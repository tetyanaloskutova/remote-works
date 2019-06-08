from decimal import Decimal

import pytest
from django.urls import reverse
from django_countries.fields import Country
from prices import Money, TaxedMoney
from tests.utils import get_redirect_location

from remote_works.account.models import User
from remote_works.checkout.utils import create_order
from remote_works.core.exceptions import InsufficientStock
from remote_works.core.utils.taxes import (
    DEFAULT_TAX_RATE_NAME, get_tax_rate_by_name, get_taxes_for_country)
from remote_works.task import FulfillmentStatus, TaskStatus, models
from remote_works.task.models import Task
from remote_works.task.utils import (
    add_variant_to_order, cancel_fulfillment, cancel_order,
    change_task_line_quantity, delete_task_line, recalculate_order,
    reavail_fulfillment_lines, reavail_task_lines,
    update_task_prices, update_task_status)
from remote_works.payment import ChargeStatus
from remote_works.payment.models import Payment


def test_total_setter():
    price = TaxedMoney(net=Money(10, 'USD'), gross=Money(15, 'USD'))
    task = models.Task()
    task.total = price
    assert task.total_net == Money(10, 'USD')
    assert task.total.net == Money(10, 'USD')
    assert task.total_gross == Money(15, 'USD')
    assert task.total.gross == Money(15, 'USD')
    assert task.total.tax == Money(5, 'USD')


def test_task_get_subtotal(task_with_lines):
    task_with_lines.discount_name = "Test discount"
    task_with_lines.discount_amount = (
        task_with_lines.total.gross * Decimal('0.5'))
    recalculate_order(task_with_lines)

    target_subtotal = task_with_lines.total - task_with_lines.delivery_price
    target_subtotal += task_with_lines.discount_amount
    assert task_with_lines.get_subtotal() == target_subtotal


def test_get_tax_rate_by_name(taxes):
    rate_name = 'pharmaceuticals'
    tax_rate = get_tax_rate_by_name(rate_name, taxes)

    assert tax_rate == taxes[rate_name]['value']


def test_get_tax_rate_by_name_fallback_to_standard(taxes):
    rate_name = 'unexisting tax rate'
    tax_rate = get_tax_rate_by_name(rate_name, taxes)

    assert tax_rate == taxes[DEFAULT_TAX_RATE_NAME]['value']


def test_get_tax_rate_by_name_empty_taxes(product):
    rate_name = 'unexisting tax rate'
    tax_rate = get_tax_rate_by_name(rate_name)

    assert tax_rate == 0


def test_add_variant_to_task_adds_line_for_new_variant(
        task_with_lines, product, taxes, skill_translation_fr, settings):
    task = task_with_lines
    variant = product.variants.get()
    lines_before = task.lines.count()
    settings.LANGUAGE_CODE = 'fr'
    add_variant_to_order(task, variant, 1, taxes=taxes)

    line = task.lines.last()
    assert task.lines.count() == lines_before + 1
    assert line.skill_sku == variant.sku
    assert line.quantity == 1
    assert line.unit_price == TaxedMoney(
        net=Money('8.13', 'USD'), gross=Money(10, 'USD'))
    assert line.tax_rate == taxes[product.tax_rate]['value']
    assert line.translated_skill_name == variant.display_product(
        translated=True)


@pytest.mark.parametrize('track_inventory', (True, False))
def test_add_variant_to_task_allocates_stock_for_new_variant(
        task_with_lines, product, track_inventory):
    variant = product.variants.get()
    variant.track_inventory = track_inventory
    variant.save()

    stock_before = variant.quantity_allocated

    add_variant_to_order(task_with_lines, variant, 1)

    variant.refresh_from_db()
    if track_inventory:
        assert variant.quantity_allocated == stock_before + 1
    else:
        assert variant.quantity_allocated == stock_before


def test_add_variant_to_task_edits_line_for_existing_variant(
        task_with_lines):
    existing_line = task_with_lines.lines.first()
    variant = existing_line.variant
    lines_before = task_with_lines.lines.count()
    line_quantity_before = existing_line.quantity

    add_variant_to_order(task_with_lines, variant, 1)

    existing_line.refresh_from_db()
    assert task_with_lines.lines.count() == lines_before
    assert existing_line.skill_sku == variant.sku
    assert existing_line.quantity == line_quantity_before + 1


def test_add_variant_to_task_allocates_stock_for_existing_variant(
        task_with_lines):
    existing_line = task_with_lines.lines.first()
    variant = existing_line.variant
    stock_before = variant.quantity_allocated

    add_variant_to_order(task_with_lines, variant, 1)

    variant.refresh_from_db()
    assert variant.quantity_allocated == stock_before + 1


def test_add_variant_to_task_allow_overselling(task_with_lines):
    existing_line = task_with_lines.lines.first()
    variant = existing_line.variant
    stock_before = variant.quantity_allocated

    quantity = variant.quantity + 1
    with pytest.raises(InsufficientStock):
        add_variant_to_order(
            task_with_lines, variant, quantity, allow_overselling=False)

    add_variant_to_order(
        task_with_lines, variant, quantity, allow_overselling=True)
    variant.refresh_from_db()
    assert variant.quantity_allocated == stock_before + quantity


def test_view_connect_task_with_user_authorized_user(
        task, authorized_client, customer_user):
    task.user_email = customer_user.email
    task.save()

    url = reverse(
        'task:connect-task-with-user', kwargs={'token': task.token})
    response = authorized_client.post(url)

    redirect_location = get_redirect_location(response)
    assert redirect_location == reverse('task:details', args=[task.token])
    task.refresh_from_db()
    assert task.user == customer_user


def test_view_connect_task_with_user_different_email(
        task, authorized_client, customer_user):
    """Task was placed from different email, than user's
    we are trying to assign it to."""
    task.user = None
    task.user_email = 'example_email@email.email'
    task.save()

    assert task.user_email != customer_user.email

    url = reverse(
        'task:connect-task-with-user', kwargs={'token': task.token})
    response = authorized_client.post(url)

    redirect_location = get_redirect_location(response)
    assert redirect_location == reverse('account:details')
    task.refresh_from_db()
    assert task.user is None


def test_view_task_with_deleted_variant(authorized_client, task_with_lines):
    task = task_with_lines
    task_details_url = reverse('task:details', kwargs={'token': task.token})

    # delete a variant associated to the task
    task.lines.first().variant.delete()

    # check if the task details view handles the deleted variant
    response = authorized_client.get(task_details_url)
    assert response.status_code == 200


def test_view_fulfilled_task_with_deleted_variant(
        authorized_client, fulfilled_order):
    task = fulfilled_order
    task_details_url = reverse('task:details', kwargs={'token': task.token})

    # delete a variant associated to the task
    task.lines.first().variant.delete()

    # check if the task details view handles the deleted variant
    response = authorized_client.get(task_details_url)
    assert response.status_code == 200


@pytest.mark.parametrize('track_inventory', (True, False))
def test_reavail_task_lines(task_with_lines, track_inventory):

    task = task_with_lines
    line_1 = task.lines.first()
    line_2 = task.lines.last()

    line_1.variant.track_inventory = track_inventory
    line_2.variant.track_inventory = track_inventory

    line_1.variant.save()
    line_2.variant.save()

    stock_1_quantity_allocated_before = line_1.variant.quantity_allocated
    stock_2_quantity_allocated_before = line_2.variant.quantity_allocated

    stock_1_quantity_before = line_1.variant.quantity
    stock_2_quantity_before = line_2.variant.quantity

    reavail_task_lines(task)

    line_1.variant.refresh_from_db()
    line_2.variant.refresh_from_db()

    if track_inventory:
        assert line_1.variant.quantity_allocated == (
            stock_1_quantity_allocated_before - line_1.quantity)
        assert line_2.variant.quantity_allocated == (
            stock_2_quantity_allocated_before - line_2.quantity)
    else:
        assert line_1.variant.quantity_allocated == (
            stock_1_quantity_allocated_before)
        assert line_2.variant.quantity_allocated == (
            stock_2_quantity_allocated_before)

    assert line_1.variant.quantity == stock_1_quantity_before
    assert line_2.variant.quantity == stock_2_quantity_before
    assert line_1.quantity_fulfilled == 0
    assert line_2.quantity_fulfilled == 0


def test_reavail_fulfilled_task_lines(fulfilled_order):
    line_1 = fulfilled_order.lines.first()
    line_2 = fulfilled_order.lines.last()
    stock_1_quantity_allocated_before = line_1.variant.quantity_allocated
    stock_2_quantity_allocated_before = line_2.variant.quantity_allocated
    stock_1_quantity_before = line_1.variant.quantity
    stock_2_quantity_before = line_2.variant.quantity

    reavail_task_lines(fulfilled_order)

    line_1.variant.refresh_from_db()
    line_2.variant.refresh_from_db()
    assert line_1.variant.quantity_allocated == (
        stock_1_quantity_allocated_before)
    assert line_2.variant.quantity_allocated == (
        stock_2_quantity_allocated_before)
    assert line_1.variant.quantity == stock_1_quantity_before + line_1.quantity
    assert line_2.variant.quantity == stock_2_quantity_before + line_2.quantity


def test_reavail_fulfillment_lines(fulfilled_order):
    fulfillment = fulfilled_order.fulfillments.first()
    line_1 = fulfillment.lines.first()
    line_2 = fulfillment.lines.last()
    stock_1 = line_1.task_line.variant
    stock_2 = line_2.task_line.variant
    stock_1_quantity_allocated_before = stock_1.quantity_allocated
    stock_2_quantity_allocated_before = stock_2.quantity_allocated
    stock_1_quantity_before = stock_1.quantity
    stock_2_quantity_before = stock_2.quantity

    reavail_fulfillment_lines(fulfillment)

    stock_1.refresh_from_db()
    stock_2.refresh_from_db()
    assert stock_1.quantity_allocated == (
        stock_1_quantity_allocated_before + line_1.quantity)
    assert stock_2.quantity_allocated == (
        stock_2_quantity_allocated_before + line_2.quantity)
    assert stock_1.quantity == stock_1_quantity_before + line_1.quantity
    assert stock_2.quantity == stock_2_quantity_before + line_2.quantity


def test_cancel_order(fulfilled_order):
    cancel_order(fulfilled_order, reavail=False)
    assert all([
        f.status == FulfillmentStatus.CANCELED
        for f in fulfilled_order.fulfillments.all()])
    assert fulfilled_order.status == TaskStatus.CANCELED


def test_cancel_fulfillment(fulfilled_order):
    fulfillment = fulfilled_order.fulfillments.first()
    line_1 = fulfillment.lines.first()
    line_2 = fulfillment.lines.first()

    cancel_fulfillment(fulfillment, reavail=False)

    assert fulfillment.status == FulfillmentStatus.CANCELED
    assert fulfilled_order.status == TaskStatus.UNFULFILLED
    assert line_1.task_line.quantity_fulfilled == 0
    assert line_2.task_line.quantity_fulfilled == 0


def test_update_task_status(fulfilled_order):
    fulfillment = fulfilled_order.fulfillments.first()
    line = fulfillment.lines.first()
    task_line = line.task_line

    task_line.quantity_fulfilled -= line.quantity
    task_line.save()
    line.delete()
    update_task_status(fulfilled_order)

    assert fulfilled_order.status == TaskStatus.PARTIALLY_FULFILLED

    line = fulfillment.lines.first()
    task_line = line.task_line

    task_line.quantity_fulfilled -= line.quantity
    task_line.save()
    line.delete()
    update_task_status(fulfilled_order)

    assert fulfilled_order.status == TaskStatus.UNFULFILLED


def test_task_queryset_confirmed(draft_order):
    other_orders = [
        Task.objects.create(status=TaskStatus.UNFULFILLED),
        Task.objects.create(status=TaskStatus.PARTIALLY_FULFILLED),
        Task.objects.create(status=TaskStatus.FULFILLED),
        Task.objects.create(status=TaskStatus.CANCELED)]

    confirmed_orders = Task.objects.confirmed()

    assert draft_order not in confirmed_orders
    assert all([task in confirmed_orders for task in other_orders])


def test_task_queryset_drafts(draft_order):
    other_orders = [
        Task.objects.create(status=TaskStatus.UNFULFILLED),
        Task.objects.create(status=TaskStatus.PARTIALLY_FULFILLED),
        Task.objects.create(status=TaskStatus.FULFILLED),
        Task.objects.create(status=TaskStatus.CANCELED)
    ]

    draft_orders = Task.objects.drafts()

    assert draft_order in draft_orders
    assert all([task not in draft_orders for task in other_orders])


def test_task_queryset_to_ship(settings):
    total = TaxedMoney(net=Money(10, 'USD'), gross=Money(15, 'USD'))
    orders_to_ship = [
        Task.objects.create(status=TaskStatus.UNFULFILLED, total=total),
        Task.objects.create(
            status=TaskStatus.PARTIALLY_FULFILLED, total=total)
    ]
    for task in orders_to_ship:
        task.payments.create(
            gateway=settings.DUMMY, charge_status=ChargeStatus.FULLY_CHARGED,
            total=task.total.gross.amount,
            captured_amount=task.total.gross.amount,
            currency=task.total.gross.currency)

    orders_not_to_ship = [
        Task.objects.create(status=TaskStatus.DRAFT, total=total),
        Task.objects.create(status=TaskStatus.UNFULFILLED, total=total),
        Task.objects.create(
            status=TaskStatus.PARTIALLY_FULFILLED, total=total),
        Task.objects.create(status=TaskStatus.FULFILLED, total=total),
        Task.objects.create(status=TaskStatus.CANCELED, total=total)
    ]

    tasks = Task.objects.ready_to_fulfill()

    assert all([task in tasks for task in orders_to_ship])
    assert all([task not in tasks for task in orders_not_to_ship])


def test_queryset_ready_to_capture():
    total = TaxedMoney(net=Money(10, 'USD'), gross=Money(15, 'USD'))

    preauth_order = Task.objects.create(
        status=TaskStatus.UNFULFILLED, total=total)
    Payment.objects.create(
        task=preauth_order,
        charge_status=ChargeStatus.NOT_CHARGED, is_active=True)

    tasks = [
        Task.objects.create(status=TaskStatus.DRAFT, total=total),
        Task.objects.create(status=TaskStatus.UNFULFILLED, total=total),
        preauth_order,
        Task.objects.create(status=TaskStatus.CANCELED, total=total)]

    qs = Task.objects.ready_to_capture()
    assert preauth_order in qs
    statuses = [o.status for o in qs]
    assert TaskStatus.DRAFT not in statuses
    assert TaskStatus.CANCELED not in statuses


def test_update_task_prices(task_with_lines):
    taxes = get_taxes_for_country(Country('DE'))
    address = task_with_lines.delivery_address
    address.country = 'DE'
    address.save()

    line_1 = task_with_lines.lines.first()
    line_2 = task_with_lines.lines.last()
    price_1 = line_1.variant.get_price(taxes=taxes)
    price_2 = line_2.variant.get_price(taxes=taxes)
    delivery_price = task_with_lines.delivery_method.get_total(taxes)

    update_task_prices(task_with_lines, None)

    line_1.refresh_from_db()
    line_2.refresh_from_db()
    assert line_1.unit_price == price_1
    assert line_2.unit_price == price_2
    assert task_with_lines.delivery_price == delivery_price
    total = (
        line_1.quantity * price_1 + line_2.quantity * price_2 + delivery_price)
    assert task_with_lines.total == total


def test_task_payment_flow(
        request_cart_with_item, client, address, delivery_zone, settings):
    request_cart_with_item.delivery_address = address
    request_cart_with_item.billing_address = address.get_copy()
    request_cart_with_item.email = 'test@example.com'
    request_cart_with_item.delivery_method = (
        delivery_zone.delivery_methods.first())
    request_cart_with_item.save()

    task = create_order(
        request_cart_with_item, 'tracking_code', discounts=None, taxes=None)

    # Select payment
    url = reverse('task:payment', kwargs={'token': task.token})
    data = {'gateway': settings.DUMMY}
    response = client.post(url, data, follow=True)

    assert len(response.redirect_chain) == 1
    assert response.status_code == 200
    redirect_url = reverse(
        'task:payment',
        kwargs={'token': task.token, 'gateway': settings.DUMMY})
    assert response.request['PATH_INFO'] == redirect_url

    # Go to payment details page, enter payment data
    data = {
        'gateway': settings.DUMMY,
        'is_active': True,
        'total': task.total.gross.amount,
        'currency': task.total.gross.currency,
        'charge_status': ChargeStatus.FULLY_CHARGED}
    response = client.post(redirect_url, data)

    assert response.status_code == 302
    redirect_url = reverse(
        'task:payment-success', kwargs={'token': task.token})
    assert get_redirect_location(response) == redirect_url

    # Assert that payment object was created and contains correct data
    payment = task.payments.all()[0]
    assert payment.total == task.total.gross.amount
    assert payment.currency == task.total.gross.currency
    assert payment.transactions.count() == 2
    assert payment.transactions.first().kind == 'auth'
    assert payment.transactions.last().kind == 'capture'


def test_create_user_after_order(task, client):
    task.user_email = 'hello@mirumee.com'
    task.save()
    url = reverse('task:checkout-success', kwargs={'token': task.token})
    data = {'password': 'password'}

    response = client.post(url, data)

    redirect_url = reverse('task:details', kwargs={'token': task.token})
    assert get_redirect_location(response) == redirect_url
    user = User.objects.filter(email='hello@mirumee.com').first()
    assert user is not None
    assert user.tasks.filter(token=task.token).exists()


def test_view_task_details(task, client):
    url = reverse('task:details', kwargs={'token': task.token})
    response = client.get(url)
    assert response.status_code == 200


def test_add_task_note_view(task, authorized_client, customer_user):
    task.user_email = customer_user.email
    task.save()
    url = reverse('task:details', kwargs={'token': task.token})
    customer_note = 'bla-bla note'
    data = {'customer_note': customer_note}

    response = authorized_client.post(url, data)

    redirect_url = reverse('task:details', kwargs={'token': task.token})
    assert get_redirect_location(response) == redirect_url
    task.refresh_from_db()
    assert task.customer_note == customer_note
