from django.conf import settings
from django.contrib.sites.models import Site
from django.contrib.sites.shortcuts import get_current_site
from django.template.loader import get_template

from ...checkout import AddressType
from ...checkout.utils import _get_skills_voucher_discount
from ...core.utils.taxes import ZERO_MONEY
from ...discount import VoucherType
from ...discount.utils import (
    get_delivery_voucher_discount, get_value_voucher_discount)
from ...skill.utils import decrease_availability

INVOICE_TEMPLATE = 'dashboard/task/pdf/invoice.html'
PACKING_SLIP_TEMPLATE = 'dashboard/task/pdf/packing_slip.html'


def get_statics_absolute_url(request):
    site = get_current_site(request)
    absolute_url = '%(protocol)s://%(domain)s%(static_url)s' % {
        'protocol': 'https' if request.is_secure() else 'http',
        'domain': site.domain,
        'static_url': settings.STATIC_URL}
    return absolute_url


def _create_pdf(rendered_template, absolute_url):
    from weasyprint import HTML
    pdf_file = (HTML(string=rendered_template, base_url=absolute_url)
                .write_pdf())
    return pdf_file


def create_invoice_pdf(task, absolute_url):
    ctx = {
        'task': task,
        'site': Site.objects.get_current()}
    rendered_template = get_template(INVOICE_TEMPLATE).render(ctx)
    pdf_file = _create_pdf(rendered_template, absolute_url)
    return pdf_file, task


def create_packing_slip_pdf(task, fulfillment, absolute_url):
    ctx = {
        'task': task,
        'fulfillment': fulfillment,
        'site': Site.objects.get_current()}
    rendered_template = get_template(PACKING_SLIP_TEMPLATE).render(ctx)
    pdf_file = _create_pdf(rendered_template, absolute_url)
    return pdf_file, task


def fulfill_task_line(task_line, quantity):
    """Fulfill task line with given quantity."""
    if task_line.variant and task_line.variant.track_inventory:
        decrease_availability(task_line.variant, quantity)
    task_line.quantity_fulfilled += quantity
    task_line.save(update_fields=['quantity_fulfilled'])


def update_task_with_user_addresses(task):
    """Update addresses in an task based on a user assigned to an task."""
    if task.delivery_address:
        task.delivery_address.delete()
        task.delivery_address = None

    if task.billing_address:
        task.billing_address.delete()
        task.billing_address = None

    if task.user:
        task.billing_address = (
            task.user.default_billing_address.get_copy()
            if task.user.default_billing_address else None)
        task.delivery_address = (
            task.user.default_delivery_address.get_copy()
            if task.user.default_delivery_address else None)

    task.save(update_fields=['billing_address', 'delivery_address'])


def get_voucher_discount_for_order(task):
    """Calculate discount value depending on voucher and discount types.

    Raise NotApplicable if voucher of given type cannot be applied.
    """
    if not task.voucher:
        return ZERO_MONEY
    if task.voucher.type == VoucherType.VALUE:
        return get_value_voucher_discount(
            task.voucher, task.get_subtotal())
    if task.voucher.type == VoucherType.DELIVERY:
        return get_delivery_voucher_discount(
            task.voucher, task.get_subtotal(), task.delivery_price)
    if task.voucher.type in (
            VoucherType.TYPE, VoucherType.COLLECTION, VoucherType.CATEGORY):
        return _get_skills_voucher_discount(task, task.voucher)
    raise NotImplementedError('Unknown discount type')


def save_address_in_order(task, address, address_type):
    """Save new address of a given address type in an task.

    If the other type of address is empty, copy it.
    """
    if address_type == AddressType.DELIVERY:
        task.delivery_address = address
        if not task.billing_address:
            task.billing_address = address.get_copy()
    else:
        task.billing_address = address
        if not task.delivery_address:
            task.delivery_address = address.get_copy()
    task.save(update_fields=['billing_address', 'delivery_address'])


def addresses_are_equal(address_1, address_2):
    return address_1 and address_2 and address_1 == address_2


def remove_customer_from_order(task):
    """Remove related customer and user email from task.

    If billing and delivery addresses are set to related customer's default
    addresses and were not edited, remove them as well.
    """
    customer = task.user
    task.user = None
    task.user_email = ''
    task.save()

    if customer:
        equal_billing_addresses = addresses_are_equal(
            task.billing_address, customer.default_billing_address)
        if equal_billing_addresses:
            task.billing_address.delete()
            task.billing_address = None

        equal_delivery_addresses = addresses_are_equal(
            task.delivery_address, customer.default_delivery_address)
        if equal_delivery_addresses:
            task.delivery_address.delete()
            task.delivery_address = None

        if equal_billing_addresses or equal_delivery_addresses:
            task.save()
