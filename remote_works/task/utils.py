from functools import wraps

from django.conf import settings
from django.db import transaction
from django.shortcuts import get_object_or_404, redirect
from prices import Money, TaxedMoney

from ..account.utils import store_user_address
from ..checkout import AddressType
from ..core.utils.taxes import (
    ZERO_MONEY, get_tax_rate_by_name, get_taxes_for_address)
from ..core.weight import zero_weight
from ..dashboard.task.utils import get_voucher_discount_for_order
from ..discount.models import NotApplicable
from ..task import FulfillmentStatus, TaskStatus
from ..task.models import TaskLine
from ..payment import ChargeStatus
from ..payment.utils import gateway_refund, gateway_void
from ..skill.utils import allocate_availability, deallocate_availability, increase_availability


def check_task_status(func):
    """Check if task meets preconditions of payment process.

    Task can not have draft status or be fully paid. Billing address
    must be provided.
    If not, redirect to task details page.
    """
    # pylint: disable=cyclic-import
    from .models import Task

    @wraps(func)
    def decorator(*args, **kwargs):
        token = kwargs.pop('token')
        task = get_object_or_404(Task.objects.confirmed(), token=token)
        if not task.billing_address or task.is_fully_paid():
            return redirect('task:details', token=task.token)
        kwargs['task'] = task
        return func(*args, **kwargs)

    return decorator


def update_voucher_discount(func):
    """Recalculate task discount amount based on task voucher."""

    @wraps(func)
    def decorator(*args, **kwargs):
        if kwargs.pop('update_voucher_discount', True):
            task = args[0]
            try:
                discount_amount = get_voucher_discount_for_order(task)
            except NotApplicable:
                discount_amount = ZERO_MONEY
            task.discount_amount = discount_amount
        return func(*args, **kwargs)

    return decorator


@update_voucher_discount
def recalculate_order(task, **kwargs):
    """Recalculate and assign total price of task.

    Total price is a sum of items in task and task delivery price minus
    discount amount.

    Voucher discount amount is recalculated by default. To avoid this, pass
    update_voucher_discount argument set to False.
    """
    # avoid using prefetched task lines
    lines = [TaskLine.objects.get(pk=line.pk) for line in task]
    prices = [line.get_total() for line in lines]
    total = sum(prices, task.delivery_price)
    # discount amount can't be greater than task total
    task.discount_amount = min(task.discount_amount, total.gross)
    if task.discount_amount:
        total -= task.discount_amount
    task.total = total
    task.save()
    recalculate_task_weight(task)


def recalculate_task_weight(task):
    """Recalculate task weights."""
    weight = zero_weight()
    for line in task:
        if line.variant:
            weight += line.variant.get_weight() * line.quantity
    task.weight = weight
    task.save(update_fields=['weight'])


def update_task_prices(task, discounts):
    """Update prices in task with given discounts and proper taxes."""
    taxes = get_taxes_for_address(task.delivery_address)

    for line in task:
        if line.variant:
            line.unit_price = line.variant.get_price(discounts, taxes)
            line.tax_rate = get_tax_rate_by_name(
                line.variant.skill.tax_rate, taxes)
            line.save()

    if task.delivery_method:
        task.delivery_price = task.delivery_method.get_total(taxes)
        task.save()

    recalculate_order(task)


def cancel_order(task, reavailability):
    """Cancel task and associated fulfillments.

    Return skills to corresponding availabilitys if reavailability is set to True.
    """
    if reavailability:
        reavailability_task_lines(task)
    for fulfillment in task.fulfillments.all():
        fulfillment.status = FulfillmentStatus.CANCELED
        fulfillment.save(update_fields=['status'])
    task.status = TaskStatus.CANCELED
    task.save(update_fields=['status'])

    payments = task.payments.filter(is_active=True).exclude(
        charge_status=ChargeStatus.FULLY_REFUNDED)

    for payment in payments:
        if payment.can_refund():
            gateway_refund(payment)
        elif payment.can_void():
            gateway_void(payment)


def update_task_status(task):
    """Update task status depending on fulfillments."""
    quantity_fulfilled = task.quantity_fulfilled
    total_quantity = task.get_total_quantity()

    if quantity_fulfilled <= 0:
        status = TaskStatus.UNFULFILLED
    elif quantity_fulfilled < total_quantity:
        status = TaskStatus.PARTIALLY_FULFILLED
    else:
        status = TaskStatus.FULFILLED

    if status != task.status:
        task.status = status
        task.save(update_fields=['status'])


def cancel_fulfillment(fulfillment, reavailability):
    """Cancel fulfillment.

    Return skills to corresponding availabilitys if reavailability is set to True.
    """
    if reavailability:
        reavailability_fulfillment_lines(fulfillment)
    for line in fulfillment:
        task_line = line.task_line
        task_line.quantity_fulfilled -= line.quantity
        task_line.save(update_fields=['quantity_fulfilled'])
    fulfillment.status = FulfillmentStatus.CANCELED
    fulfillment.save(update_fields=['status'])
    update_task_status(fulfillment.task)


def attach_task_to_user(task, user):
    """Associate existing task with user account."""
    task.user = user
    store_user_address(user, task.billing_address, AddressType.BILLING)
    if task.delivery_address:
        store_user_address(user, task.delivery_address, AddressType.DELIVERY)
    task.save(update_fields=['user'])


@transaction.atomic
def add_variant_to_order(
        task,
        variant,
        quantity,
        discounts=None,
        taxes=None,
        allow_overselling=False,
        track_inventory=True):
    """Add total_quantity of variant to task.

    Returns an task line the variant was added to.

    By default, raises InsufficientStock exception if  quantity could not be
    fulfilled. This can be disabled by setting `allow_overselling` to True.
    """
    if not allow_overselling:
        variant.check_quantity(quantity)

    try:
        line = task.lines.get(variant=variant)
        line.quantity += quantity
        line.save(update_fields=['quantity'])
    except TaskLine.DoesNotExist:
        skill_name = variant.display_skill()
        translated_skill_name = variant.display_skill(translated=True)
        if translated_skill_name == skill_name:
            translated_skill_name = ''
        line = task.lines.create(
            skill_name=skill_name,
            translated_skill_name=translated_skill_name,
            skill_sku=variant.sku,
            is_delivery_required=variant.is_delivery_required(),
            quantity=quantity,
            variant=variant,
            unit_price=variant.get_price(discounts, taxes),
            tax_rate=get_tax_rate_by_name(variant.skill.tax_rate, taxes))

    if variant.track_inventory and track_inventory:
        allocate_availability(variant, quantity)
    return line


def change_task_line_quantity(line, new_quantity):
    """Change the quantity of ordered items in a task line."""
    if new_quantity:
        line.quantity = new_quantity
        line.save(update_fields=['quantity'])
    else:
        delete_task_line(line)


def delete_task_line(line):
    """Delete an task line from an task."""
    line.delete()


def reavailability_task_lines(task):
    """Return ordered skills to corresponding availabilitys."""
    for line in task:
        if line.variant and line.variant.track_inventory:
            if line.quantity_unfulfilled > 0:
                deallocate_availability(line.variant, line.quantity_unfulfilled)
            if line.quantity_fulfilled > 0:
                increase_availability(line.variant, line.quantity_fulfilled)

        if line.quantity_fulfilled > 0:
            line.quantity_fulfilled = 0
            line.save(update_fields=['quantity_fulfilled'])


def reavailability_fulfillment_lines(fulfillment):
    """Return fulfilled skills to corresponding availabilitys."""
    for line in fulfillment:
        if line.task_line.variant and line.task_line.variant.track_inventory:
            increase_availability(
                line.task_line.variant, line.quantity, allocate=True)


def sum_task_totals(qs):
    zero = Money(0, currency=settings.DEFAULT_CURRENCY)
    taxed_zero = TaxedMoney(zero, zero)
    return sum([task.total for task in qs], taxed_zero)
