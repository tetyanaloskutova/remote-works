import json
from decimal import Decimal

import pytest
from django.urls import reverse
from prices import Money

from remote_works.checkout import AddressType
from remote_works.core.utils.taxes import ZERO_MONEY, ZERO_TAXED_MONEY
from remote_works.dashboard.task.forms import ChangeQuantityForm
from remote_works.dashboard.task.utils import (
    fulfill_task_line, remove_customer_from_order, save_address_in_order,
    update_task_with_user_addresses)
from remote_works.discount.utils import increase_voucher_usage
from remote_works.task import (
    FulfillmentStatus, TaskEvents, TaskEventsEmails, TaskStatus)
from remote_works.task.models import Task, TaskEvent, TaskLine
from remote_works.task.utils import add_variant_to_order, change_task_line_quantity
from remote_works.payment import ChargeStatus, TransactionKind
from remote_works.product.models import SkillVariant
from remote_works.delivery.models import DeliveryZone
from tests.utils import get_form_errors, get_redirect_location


def test_ajax_task_delivery_methods_list(
        admin_client, task, delivery_zone):
    method = delivery_zone.delivery_methods.get()
    delivery_methods_list = [
        {'id': method.pk, 'text': method.get_ajax_label()}]
    url = reverse(
        'dashboard:ajax-task-delivery-methods', kwargs={'task_pk': task.pk})

    response = admin_client.get(url, HTTP_X_REQUESTED_WITH='XMLHttpRequest')
    resp_decoded = json.loads(response.content.decode('utf-8'))

    assert response.status_code == 200
    assert resp_decoded == {'results': delivery_methods_list}


def test_ajax_task_delivery_methods_list_different_country(
        admin_client, task, settings, delivery_zone):
    task.delivery_address = task.billing_address.get_copy()
    task.save()
    method = delivery_zone.delivery_methods.get()
    delivery_methods_list = [
        {'id': method.pk, 'text': method.get_ajax_label()}]
    # If delivery zone does not cover task's country,
    # then its delivery methods should not be included
    assert task.delivery_address.country.code != 'DE'
    zone = DeliveryZone.objects.create(name='Delivery zone', countries=['DE'])
    zone.delivery_methods.create(
        price=Money(15, settings.DEFAULT_CURRENCY), name='DHL')

    url = reverse(
        'dashboard:ajax-task-delivery-methods', kwargs={'task_pk': task.pk})

    response = admin_client.get(url, HTTP_X_REQUESTED_WITH='XMLHttpRequest')
    resp_decoded = json.loads(response.content.decode('utf-8'))

    assert response.status_code == 200
    assert resp_decoded == {'results': delivery_methods_list}


@pytest.mark.integration
def test_view_capture_task_payment_preauth(
        admin_client, task_with_lines, payment_txn_preauth):
    task = task_with_lines
    payment = payment_txn_preauth
    url = reverse(
        'dashboard:capture-payment', kwargs={
            'task_pk': task.pk, 'payment_pk': payment.pk})
    response = admin_client.get(url)
    assert response.status_code == 200

    response = admin_client.post(
        url, {
            'csrfmiddlewaretoken': 'hello',
            'amount': str(task.total.gross.amount)})
    assert response.status_code == 302
    payment = task.payments.last()
    assert payment.charge_status == ChargeStatus.FULLY_CHARGED
    assert payment.captured_amount == task.total.gross.amount
    assert payment.currency == task.total.gross.currency


@pytest.mark.integration
def test_view_capture_task_invalid_payment_confirmed_status(
        admin_client, task_with_lines, payment_txn_captured):
    task = task_with_lines
    url = reverse(
        'dashboard:capture-payment', kwargs={
            'task_pk': task.pk, 'payment_pk': payment_txn_captured.pk})
    response = admin_client.get(url)
    assert response.status_code == 200

    response = admin_client.post(
        url, {'csrfmiddlewaretoken': 'hello', 'amount': '20.00'})
    assert response.status_code == 400
    payment = task.payments.last()
    assert payment.charge_status == ChargeStatus.FULLY_CHARGED


@pytest.mark.integration
def test_view_capture_task_invalid_payment_rejected_status(
        admin_client, payment_not_authorized):
    task = payment_not_authorized.task
    url = reverse(
        'dashboard:capture-payment', kwargs={
            'task_pk': task.pk,
            'payment_pk': payment_not_authorized.pk})
    response = admin_client.get(url)
    assert response.status_code == 200

    response = admin_client.post(
        url, {'csrfmiddlewaretoken': 'hello', 'amount': '20.00'})
    assert response.status_code == 400
    payment = task.payments.last()
    assert payment.charge_status == ChargeStatus.NOT_CHARGED


@pytest.mark.integration
def test_view_capture_task_invalid_payment_refunded_status(
        admin_client, task_with_lines, payment_txn_refunded):
    task = task_with_lines
    url = reverse(
        'dashboard:capture-payment', kwargs={
            'task_pk': task.pk, 'payment_pk': payment_txn_refunded.pk})
    response = admin_client.get(url)
    assert response.status_code == 200

    response = admin_client.post(
        url, {'csrfmiddlewaretoken': 'hello', 'amount': '20.00'})
    assert response.status_code == 400
    payment = task.payments.last()
    assert payment.charge_status == ChargeStatus.FULLY_REFUNDED


@pytest.mark.integration
def test_view_refund_task_payment_confirmed(
        admin_client, task_with_lines, payment_txn_captured):
    task = task_with_lines
    payment_confirmed = payment_txn_captured
    url = reverse(
        'dashboard:refund-payment', kwargs={
            'task_pk': task.pk, 'payment_pk': payment_confirmed.pk})
    response = admin_client.get(url)
    assert response.status_code == 200

    response = admin_client.post(
        url, {
            'csrfmiddlewaretoken': 'hello',
            'amount': str(payment_confirmed.captured_amount)})
    assert response.status_code == 302
    payment = task.payments.last()
    assert payment.charge_status == ChargeStatus.FULLY_REFUNDED
    assert payment.captured_amount == Decimal('0.00')


@pytest.mark.integration
def test_view_refund_task_invalid_payment_preauth_status(
        admin_client, task_with_lines, payment_txn_preauth):
    task = task_with_lines

    url = reverse(
        'dashboard:refund-payment', kwargs={
            'task_pk': task.pk, 'payment_pk': payment_txn_preauth.pk})
    response = admin_client.get(url)
    assert response.status_code == 200

    response = admin_client.post(
        url, {'csrfmiddlewaretoken': 'hello', 'amount': '20.00'})
    assert response.status_code == 400
    payment = task.payments.last()
    assert payment.charge_status == ChargeStatus.NOT_CHARGED


@pytest.mark.integration
def test_view_refund_task_invalid_payment_refunded_status(
        admin_client, task_with_lines, payment_txn_refunded):
    task = task_with_lines

    url = reverse(
        'dashboard:refund-payment', kwargs={
            'task_pk': task.pk, 'payment_pk': payment_txn_refunded.pk})
    response = admin_client.get(url)
    assert response.status_code == 200

    response = admin_client.post(
        url, {'csrfmiddlewaretoken': 'hello', 'amount': '20.00'})
    assert response.status_code == 400
    payment = task.payments.last()
    assert payment.charge_status == ChargeStatus.FULLY_REFUNDED


@pytest.mark.integration
def test_view_void_task_payment_preauth(
        admin_client, task_with_lines, payment_txn_preauth):
    task = task_with_lines

    url = reverse(
        'dashboard:void-payment', kwargs={
            'task_pk': task.pk, 'payment_pk': payment_txn_preauth.pk})
    response = admin_client.get(url)
    assert response.status_code == 200

    response = admin_client.post(url, {
        'csrfmiddlewaretoken': 'hello'})
    assert response.status_code == 302
    task_payment = task.payments.last()
    assert task_payment.charge_status == ChargeStatus.NOT_CHARGED
    last_transaction = task_payment.transactions.latest('pk')

    assert last_transaction.kind == TransactionKind.VOID
    assert task_payment.captured_amount == Decimal('0.00')



@pytest.mark.integration
def test_view_void_task_invalid_payment_confirmed_status(
        admin_client, task_with_lines, payment_txn_captured):
    task = task_with_lines

    url = reverse(
        'dashboard:void-payment', kwargs={
            'task_pk': task.pk, 'payment_pk': payment_txn_captured.pk})
    response = admin_client.get(url)
    assert response.status_code == 200

    response = admin_client.post(url, {
        'csrfmiddlewaretoken': 'hello'})
    assert response.status_code == 400
    task_payment = task.payments.last()
    assert task_payment.charge_status == ChargeStatus.FULLY_CHARGED
    assert task_payment.captured_amount == task.total.gross.amount
    assert task_payment.total == task.total.gross.amount
    assert task_payment.currency == task.total.gross.currency


@pytest.mark.integration
def test_view_void_task_invalid_payment_refunded_status(
        admin_client, task_with_lines, payment_txn_refunded):
    task = task_with_lines

    url = reverse(
        'dashboard:void-payment', kwargs={
            'task_pk': task.pk, 'payment_pk': payment_txn_refunded.pk})
    response = admin_client.get(url)
    assert response.status_code == 200

    response = admin_client.post(url, {
        'csrfmiddlewaretoken': 'hello'})
    assert response.status_code == 400
    payment = task.payments.last()
    assert payment.charge_status == ChargeStatus.FULLY_REFUNDED
    assert payment.captured_amount == Decimal('0.00')


@pytest.mark.integration
@pytest.mark.parametrize('track_inventory', (True, False))
def test_view_cancel_task_line(admin_client, draft_order, track_inventory):
    lines_before = draft_order.lines.all()
    lines_before_count = lines_before.count()
    line = lines_before.first()
    line_quantity = line.quantity
    quantity_allocated_before = line.variant.quantity_allocated

    line.variant.track_inventory = track_inventory
    line.variant.save()

    url = reverse(
        'dashboard:orderline-cancel', kwargs={
            'task_pk': draft_order.pk,
            'line_pk': line.pk})

    response = admin_client.get(url)
    assert response.status_code == 200
    response = admin_client.post(url, {'csrfmiddlewaretoken': 'hello'})
    assert response.status_code == 302
    assert get_redirect_location(response) == reverse(
        'dashboard:task-details', args=[draft_order.pk])
    # check ordered item removal
    lines_after = Task.objects.get().lines.all()
    assert lines_before_count - 1 == lines_after.count()

    # check availability deallocation
    line.variant.refresh_from_db()

    if track_inventory:
        assert line.variant.quantity_allocated == (
            quantity_allocated_before - line_quantity)
    else:
        assert line.variant.quantity_allocated == quantity_allocated_before

    url = reverse(
        'dashboard:orderline-cancel', kwargs={
            'task_pk': draft_order.pk,
            'line_pk': TaskLine.objects.get().pk})
    response = admin_client.post(
        url, {'csrfmiddlewaretoken': 'hello'}, follow=True)
    assert Task.objects.get().lines.all().count() == 0
    # check success messages after redirect
    assert response.context['messages']


@pytest.mark.integration
@pytest.mark.parametrize('track_inventory', (True, False))
def test_view_change_task_line_quantity(
        admin_client, draft_order, track_inventory):
    lines_before_quantity_change = draft_order.lines.all()
    lines_before_quantity_change_count = lines_before_quantity_change.count()
    line = lines_before_quantity_change.first()

    line.variant.track_inventory = track_inventory
    line.variant.save()

    url = reverse(
        'dashboard:orderline-change-quantity',
        kwargs={'task_pk': draft_order.pk, 'line_pk': line.pk})
    response = admin_client.get(url)
    assert response.status_code == 200
    response = admin_client.post(url, {'quantity': 2}, follow=True)
    redirected_to, redirect_status_code = response.redirect_chain[-1]
    # check redirection
    assert redirect_status_code == 302
    assert redirected_to == reverse(
        'dashboard:task-details', kwargs={'task_pk': draft_order.id})
    # success messages should appear after redirect
    assert response.context['messages']
    lines_after = Task.objects.get().lines.all()
    # task should have the same lines
    assert lines_before_quantity_change_count == lines_after.count()
    line.variant.refresh_from_db()

    if track_inventory:
        # availability allocation should be 2 now
        assert line.variant.quantity_allocated == 2
    else:
        assert line.variant.quantity_allocated == 3

    line.refresh_from_db()
    # source line quantity should be decreased to 2
    assert line.quantity == 2


@pytest.mark.integration
def test_view_change_task_line_quantity_with_invalid_data(
        admin_client, draft_order):
    lines = draft_order.lines.all()
    line = lines.first()
    url = reverse(
        'dashboard:orderline-change-quantity', kwargs={
            'task_pk': draft_order.pk,
            'line_pk': line.pk})
    response = admin_client.post(
        url, {'quantity': 0})
    assert response.status_code == 400


def test_dashboard_change_quantity_form(request_cart_with_item, task):
    for line in request_cart_with_item:
        add_variant_to_order(task, line.variant, line.quantity)
    task_line = task.lines.get()
    quantity_before = task_line.variant.quantity_allocated
    # Check max quantity validation
    form = ChangeQuantityForm({'quantity': 9999}, instance=task_line)
    assert not form.is_valid()
    assert form.errors['quantity'] == [
        'Ensure this value is less than or equal to 50.']

    # Check minimum quantity validation
    form = ChangeQuantityForm({'quantity': 0}, instance=task_line)
    assert not form.is_valid()
    assert task.lines.get().variant.quantity_allocated == quantity_before
    assert 'quantity' in form.errors

    # Check available quantity validation
    form = ChangeQuantityForm({'quantity': 20}, instance=task_line)
    assert not form.is_valid()
    assert task.lines.get().variant.quantity_allocated == quantity_before
    assert 'quantity' in form.errors

    # Save same quantity
    form = ChangeQuantityForm(
        {'quantity': 1}, instance=task_line)
    assert form.is_valid()
    form.save()
    task_line.variant.refresh_from_db()
    assert task_line.variant.quantity_allocated == quantity_before

    # Increase quantity
    form = ChangeQuantityForm(
        {'quantity': 2}, instance=task_line)
    assert form.is_valid()
    form.save()
    task_line.variant.refresh_from_db()
    assert task_line.variant.quantity_allocated == quantity_before + 1

    # Decrease quantity
    form = ChangeQuantityForm({'quantity': 1}, instance=task_line)
    assert form.is_valid()
    form.save()
    task_line.variant.refresh_from_db()
    assert task_line.variant.quantity_allocated == quantity_before


def test_ordered_item_change_quantity(transactional_db, task_with_lines):
    assert not task_with_lines.events.count()
    lines = task_with_lines.lines.all()
    change_task_line_quantity(lines[1], 0)
    change_task_line_quantity(lines[0], 0)
    assert task_with_lines.get_total_quantity() == 0


@pytest.mark.integration
def test_view_task_invoice(admin_client, task_with_lines):
    url = reverse(
        'dashboard:task-invoice', kwargs={
            'task_pk': task_with_lines.id})
    response = admin_client.get(url)
    assert response.status_code == 200
    assert response['content-type'] == 'application/pdf'
    name = "invoice-%s.pdf" % task_with_lines.id
    assert response['Content-Disposition'] == 'filename=%s' % name


@pytest.mark.integration
def test_view_task_invoice_without_delivery(admin_client, task_with_lines):
    task_with_lines.delivery_address.delete()
    # Regression test for #1536:
    url = reverse(
        'dashboard:task-invoice', kwargs={'task_pk': task_with_lines.id})
    response = admin_client.get(url)
    assert response.status_code == 200
    assert response['content-type'] == 'application/pdf'


@pytest.mark.integration
def test_view_fulfillment_packing_slips(admin_client, fulfilled_order):
    fulfillment = fulfilled_order.fulfillments.first()
    url = reverse(
        'dashboard:fulfillment-packing-slips', kwargs={
            'task_pk': fulfilled_order.pk, 'fulfillment_pk': fulfillment.pk})
    response = admin_client.get(url)
    assert response.status_code == 200
    assert response['content-type'] == 'application/pdf'
    name = "packing-slip-%s.pdf" % (fulfilled_order.id,)
    assert response['Content-Disposition'] == 'filename=%s' % name


@pytest.mark.integration
def test_view_fulfillment_packing_slips_without_delivery(
        admin_client, fulfilled_order):
    # Regression test for #1536
    fulfilled_order.delivery_address.delete()
    fulfillment = fulfilled_order.fulfillments.first()
    url = reverse(
        'dashboard:fulfillment-packing-slips', kwargs={
            'task_pk': fulfilled_order.pk, 'fulfillment_pk': fulfillment.pk})
    response = admin_client.get(url)
    assert response.status_code == 200
    assert response['content-type'] == 'application/pdf'


def test_view_add_variant_to_order(admin_client, task_with_lines):
    task_with_lines.status = TaskStatus.DRAFT
    task_with_lines.save()
    variant = SkillVariant.objects.get(sku='SKU_A')
    line = TaskLine.objects.get(skill_sku='SKU_A')
    line_quantity_before = line.quantity

    added_quantity = 2
    url = reverse(
        'dashboard:add-variant-to-task',
        kwargs={'task_pk': task_with_lines.pk})
    data = {'variant': variant.pk, 'quantity': added_quantity}

    response = admin_client.post(url, data)

    line.refresh_from_db()
    assert response.status_code == 302
    assert get_redirect_location(response) == reverse(
        'dashboard:task-details', kwargs={'task_pk': task_with_lines.pk})
    assert line.quantity == line_quantity_before + added_quantity


def test_fulfill_task_line(task_with_lines):
    task = task_with_lines
    line = task.lines.first()
    quantity_fulfilled_before = line.quantity_fulfilled
    variant = line.variant
    stock_quantity_after = variant.quantity - line.quantity

    fulfill_task_line(line, line.quantity)

    variant.refresh_from_db()
    assert variant.quantity == stock_quantity_after
    assert line.quantity_fulfilled == quantity_fulfilled_before + line.quantity


def test_fulfill_task_line_with_variant_deleted(task_with_lines):
    line = task_with_lines.lines.first()
    line.variant.delete()

    line.refresh_from_db()

    fulfill_task_line(line, line.quantity)


def test_fulfill_task_line_without_inventory_tracking(task_with_lines):
    task = task_with_lines
    line = task.lines.first()
    quantity_fulfilled_before = line.quantity_fulfilled
    variant = line.variant
    variant.track_inventory = False
    variant.save()

    # availability should not change
    stock_quantity_after = variant.quantity

    fulfill_task_line(line, line.quantity)

    variant.refresh_from_db()
    assert variant.quantity == stock_quantity_after
    assert line.quantity_fulfilled == quantity_fulfilled_before + line.quantity


def test_view_change_fulfillment_tracking(admin_client, fulfilled_order):
    fulfillment = fulfilled_order.fulfillments.first()
    url = reverse(
        'dashboard:fulfillment-change-tracking', kwargs={
            'task_pk': fulfilled_order.pk,
            'fulfillment_pk': fulfillment.pk})
    tracking_number = '1234-5678AF'
    data = {'tracking_number': tracking_number}

    response = admin_client.post(url, data)

    fulfillment.refresh_from_db()
    assert response.status_code == 302
    assert get_redirect_location(response) == reverse(
        'dashboard:task-details', kwargs={'task_pk': fulfilled_order.pk})
    assert fulfillment.tracking_number == tracking_number


def test_view_task_create(admin_client):
    url = reverse('dashboard:task-create')

    response = admin_client.post(url, {})

    assert response.status_code == 302
    assert Task.objects.count() == 1
    task = Task.objects.first()
    redirect_url = reverse(
        'dashboard:task-details', kwargs={'task_pk': task.pk})
    assert get_redirect_location(response) == redirect_url
    assert task.status == TaskStatus.DRAFT


def test_view_create_from_draft_task_valid(admin_client, draft_order):
    task = draft_order
    url = reverse(
        'dashboard:create-task-from-draft', kwargs={'task_pk': task.pk})
    data = {'csrfmiddlewaretoken': 'hello'}

    response = admin_client.post(url, data)

    assert response.status_code == 302
    task.refresh_from_db()
    assert task.status == TaskStatus.UNFULFILLED
    redirect_url = reverse(
        'dashboard:task-details', kwargs={'task_pk': task.pk})
    assert get_redirect_location(response) == redirect_url


def test_view_create_from_draft_task_assigns_customer_email(
        admin_client, draft_order, customer_user):
    task = draft_order
    task.user_email = ''
    task.save()
    url = reverse(
        'dashboard:create-task-from-draft', kwargs={'task_pk': task.pk})
    data = {'csrfmiddlewaretoken': 'hello'}

    admin_client.post(url, data)

    task.refresh_from_db()
    assert task.user_email == customer_user.email


def test_view_create_from_draft_task_empty_order(admin_client, draft_order):
    task = draft_order
    task.lines.all().delete()
    url = reverse(
        'dashboard:create-task-from-draft', kwargs={'task_pk': task.pk})
    data = {'csrfmiddlewaretoken': 'hello'}

    response = admin_client.post(url, data)

    assert response.status_code == 400
    task.refresh_from_db()
    assert task.status == TaskStatus.DRAFT
    errors = get_form_errors(response)
    assert 'Could not create task without any skills' in errors


def test_view_create_from_draft_task_not_draft_order(
        admin_client, task_with_lines):
    url = reverse(
        'dashboard:create-task-from-draft',
        kwargs={'task_pk': task_with_lines.pk})
    data = {'csrfmiddlewaretoken': 'hello'}

    response = admin_client.post(url, data)

    assert response.status_code == 404


def test_view_create_from_draft_task_delivery_zone_not_valid(
        admin_client, draft_order, settings, delivery_zone):
    method = delivery_zone.delivery_methods.create(
        name='DHL', price=Money(10, settings.DEFAULT_CURRENCY))
    delivery_zone.countries = ['DE']
    delivery_zone.save()
    # Delivery zone is not valid, as delivery address is listed outside the
    # delivery zone's countries
    assert draft_order.delivery_address.country.code != 'DE'
    draft_order.delivery_method = method
    draft_order.save()
    url = reverse(
        'dashboard:create-task-from-draft',
        kwargs={'task_pk': draft_order.pk})
    data = {'delivery_method': method.pk}

    response = admin_client.post(url, data)

    assert response.status_code == 400
    draft_order.refresh_from_db()
    assert draft_order.status == TaskStatus.DRAFT
    errors = get_form_errors(response)
    error = 'Delivery method is not valid for chosen delivery address'
    assert error in errors


def test_view_create_from_draft_task_no_delivery_address_delivery_not_required(  # noqa
        admin_client, draft_order):
    url = reverse(
        'dashboard:create-task-from-draft',
        kwargs={'task_pk': draft_order.pk})
    data = {'csrfmiddlewaretoken': 'hello'}

    response = admin_client.post(url, data)

    assert response.status_code == 302
    draft_order.refresh_from_db()
    assert draft_order.status == TaskStatus.UNFULFILLED
    redirect_url = reverse(
        'dashboard:task-details', kwargs={'task_pk': draft_order.pk})
    assert get_redirect_location(response) == redirect_url


def test_view_task_customer_edit_to_existing_user(
        admin_client, customer_user, draft_order):
    draft_order.user = None
    draft_order.save()
    url = reverse(
        'dashboard:task-customer-edit', kwargs={'task_pk': draft_order.pk})
    data = {
        'user_email': '', 'user': customer_user.pk, 'update_addresses': True}

    response = admin_client.post(url, data)

    assert response.status_code == 302
    draft_order.refresh_from_db()
    assert draft_order.user == customer_user
    assert not draft_order.user_email
    assert (
        draft_order.billing_address == customer_user.default_billing_address)
    assert (
        draft_order.delivery_address == customer_user.default_delivery_address)
    redirect_url = reverse(
        'dashboard:task-details', kwargs={'task_pk': draft_order.pk})
    assert get_redirect_location(response) == redirect_url


def test_view_task_customer_edit_to_email(admin_client, draft_order):
    url = reverse(
        'dashboard:task-customer-edit', kwargs={'task_pk': draft_order.pk})
    data = {
        'user_email': 'customer@example.com', 'user': '',
        'update_addresses': False}

    response = admin_client.post(url, data)

    assert response.status_code == 302
    draft_order.refresh_from_db()
    assert draft_order.user_email == 'customer@example.com'
    assert not draft_order.user
    redirect_url = reverse(
        'dashboard:task-details', kwargs={'task_pk': draft_order.pk})
    assert get_redirect_location(response) == redirect_url


def test_view_task_customer_edit_to_guest_customer(admin_client, draft_order):
    url = reverse(
        'dashboard:task-customer-edit', kwargs={'task_pk': draft_order.pk})
    data = {'user_email': '', 'user': '', 'update_addresses': False}

    response = admin_client.post(url, data)

    assert response.status_code == 302
    draft_order.refresh_from_db()
    assert not draft_order.user_email
    assert not draft_order.user
    redirect_url = reverse(
        'dashboard:task-details', kwargs={'task_pk': draft_order.pk})
    assert get_redirect_location(response) == redirect_url


def test_view_task_customer_edit_not_valid(
        admin_client, customer_user, draft_order):
    draft_order.user = None
    draft_order.user_email = ''
    draft_order.save()
    url = reverse(
        'dashboard:task-customer-edit', kwargs={'task_pk': draft_order.pk})
    data = {
        'user_email': 'customer@example.com', 'user': customer_user.pk,
        'update_addresses': False}

    response = admin_client.post(url, data)

    assert response.status_code == 400
    draft_order.refresh_from_db()
    assert not draft_order.user == customer_user
    errors = get_form_errors(response)
    error = (
        'An task can be related either with an email or an existing user '
        'account')
    assert error in errors


def test_view_task_customer_remove(admin_client, draft_order):
    url = reverse(
        'dashboard:task-customer-remove', kwargs={'task_pk': draft_order.pk})
    data = {'csrfmiddlewaretoken': 'hello'}

    response = admin_client.post(url, data)

    assert response.status_code == 302
    redirect_url = reverse(
        'dashboard:task-details', kwargs={'task_pk': draft_order.pk})
    assert get_redirect_location(response) == redirect_url
    draft_order.refresh_from_db()
    assert not draft_order.user
    assert not draft_order.user_email
    assert not draft_order.billing_address
    assert not draft_order.delivery_address


def test_view_task_delivery_edit(
        admin_client, draft_order, delivery_zone, settings, vatlayer):
    method = delivery_zone.delivery_methods.create(
        price=Money(5, settings.DEFAULT_CURRENCY), name='DHL')
    url = reverse(
        'dashboard:task-delivery-edit', kwargs={'task_pk': draft_order.pk})
    data = {'delivery_method': method.pk}

    response = admin_client.post(url, data)

    assert response.status_code == 302
    redirect_url = reverse(
        'dashboard:task-details', kwargs={'task_pk': draft_order.pk})
    assert get_redirect_location(response) == redirect_url
    draft_order.refresh_from_db()
    assert draft_order.delivery_method_name == method.name
    assert draft_order.delivery_price == method.get_total(taxes=vatlayer)
    assert draft_order.delivery_method == method


def test_view_task_delivery_edit_not_draft_order(
        admin_client, task_with_lines, settings, delivery_zone):
    method = delivery_zone.delivery_methods.create(
        price=Money(5, settings.DEFAULT_CURRENCY), name='DHL')
    url = reverse(
        'dashboard:task-delivery-edit',
        kwargs={'task_pk': task_with_lines.pk})
    data = {'delivery_method': method.pk}

    response = admin_client.post(url, data)

    assert response.status_code == 404


def test_view_task_delivery_remove(admin_client, draft_order):
    url = reverse(
        'dashboard:task-delivery-remove', kwargs={'task_pk': draft_order.pk})
    data = {'csrfmiddlewaretoken': 'hello'}

    response = admin_client.post(url, data)

    assert response.status_code == 302
    redirect_url = reverse(
        'dashboard:task-details', kwargs={'task_pk': draft_order.pk})
    assert get_redirect_location(response) == redirect_url
    draft_order.refresh_from_db()
    assert not draft_order.delivery_method
    assert not draft_order.delivery_method_name
    assert draft_order.delivery_price == ZERO_TAXED_MONEY


def test_view_remove_draft_order(admin_client, draft_order):
    url = reverse(
        'dashboard:draft-task-delete', kwargs={'task_pk': draft_order.pk})

    response = admin_client.post(url, {})

    assert response.status_code == 302
    assert get_redirect_location(response) == reverse('dashboard:tasks')
    assert Task.objects.count() == 0


def test_view_remove_draft_task_invalid(admin_client, task_with_lines):
    url = reverse(
        'dashboard:draft-task-delete',
        kwargs={'task_pk': task_with_lines.pk})

    response = admin_client.post(url, {})

    assert response.status_code == 404
    assert Task.objects.count() == 1


def test_view_edit_discount(admin_client, draft_order, settings):
    discount_value = 5
    total_before = draft_order.total
    url = reverse(
        'dashboard:task-discount-edit',
        kwargs={'task_pk': draft_order.pk})
    data = {'discount_amount': discount_value}

    response = admin_client.post(url, data)

    assert response.status_code == 302
    redirect_url = reverse(
        'dashboard:task-details', kwargs={'task_pk': draft_order.pk})
    assert get_redirect_location(response) == redirect_url

    draft_order.refresh_from_db()
    discount_amount = Money(discount_value, settings.DEFAULT_CURRENCY)
    assert draft_order.discount_amount == discount_amount
    assert draft_order.total == total_before - discount_amount


def test_update_task_with_user_addresses(task):
    update_task_with_user_addresses(task)
    assert task.billing_address == task.user.default_billing_address
    assert task.delivery_address == task.user.default_delivery_address


def test_update_task_with_user_addresses_empty_user(task):
    task.user = None
    task.save()
    update_task_with_user_addresses(task)
    assert task.billing_address is None
    assert task.delivery_address is None


def test_save_address_in_task_delivery_address(task, address):
    old_billing_address = task.billing_address
    address.first_name = 'Jane'
    address.save()

    save_address_in_order(task, address, AddressType.DELIVERY)

    assert task.delivery_address == address
    assert task.delivery_address.pk == address.pk
    assert task.billing_address == old_billing_address


def test_save_address_in_task_billing_address(task, address):
    address.first_name = 'Jane'
    address.save()

    save_address_in_order(task, address, AddressType.BILLING)

    assert task.billing_address == address
    assert task.billing_address.pk == address.pk
    assert task.delivery_address == task.billing_address


def test_remove_customer_from_order(task):
    remove_customer_from_order(task)

    assert task.user is None
    assert task.user_email == ''
    assert task.billing_address is None


def test_remove_customer_from_task_remove_addresses(task, customer_user):
    task.billing_address = customer_user.default_billing_address.get_copy()
    task.delivery_address = customer_user.default_delivery_address.get_copy()

    remove_customer_from_order(task)

    assert task.user is None
    assert task.user_email == ''
    assert task.billing_address is None
    assert task.delivery_address is None


def test_remove_customer_from_task_do_not_remove_modified_addresses(
        task, customer_user):
    task.billing_address = customer_user.default_billing_address.get_copy()
    task.billing_address.first_name = 'Jane'
    task.billing_address.save()
    old_billing_address = task.billing_address

    task.delivery_address = customer_user.default_delivery_address.get_copy()
    task.delivery_address.first_name = 'Jane'
    task.delivery_address.save()
    old_delivery_address = task.delivery_address

    remove_customer_from_order(task)

    assert task.user is None
    assert task.user_email == ''
    assert task.billing_address == old_billing_address
    assert task.delivery_address == old_delivery_address


def test_view_task_voucher_edit(admin_client, draft_order, settings, voucher):
    total_before = draft_order.total
    url = reverse(
        'dashboard:task-voucher-edit', kwargs={'task_pk': draft_order.pk})
    data = {'voucher': voucher.pk}

    response = admin_client.post(url, data)

    assert response.status_code == 302
    redirect_url = reverse(
        'dashboard:task-details', kwargs={'task_pk': draft_order.pk})
    assert get_redirect_location(response) == redirect_url

    draft_order.refresh_from_db()
    discount_amount = Money(voucher.discount_value, settings.DEFAULT_CURRENCY)
    assert draft_order.discount_amount == discount_amount
    assert draft_order.total == total_before - discount_amount


def test_view_task_voucher_remove(admin_client, draft_order, settings, voucher):
    increase_voucher_usage(voucher)
    draft_order.voucher = voucher
    discount_amount = Money(voucher.discount_value, settings.DEFAULT_CURRENCY)
    draft_order.discount_amount = discount_amount
    draft_order.total -= discount_amount
    draft_order.save()
    total_before = draft_order.total
    url = reverse(
        'dashboard:task-voucher-remove', kwargs={'task_pk': draft_order.pk})
    data = {'csrfmiddlewaretoken': 'hello'}

    response = admin_client.post(url, data)

    assert response.status_code == 302
    redirect_url = reverse(
        'dashboard:task-details', kwargs={'task_pk': draft_order.pk})
    assert get_redirect_location(response) == redirect_url

    draft_order.refresh_from_db()
    assert draft_order.discount_amount == ZERO_MONEY
    assert draft_order.total == total_before + discount_amount


def test_view_mark_task_as_paid(admin_client, task_with_lines):
    url = reverse(
        'dashboard:task-mark-as-paid',
        kwargs={'task_pk': task_with_lines.pk})
    data = {'csrfmiddlewaretoken': 'hello'}

    response = admin_client.post(url, data)

    assert response.status_code == 302
    redirect_url = reverse(
        'dashboard:task-details', kwargs={'task_pk': task_with_lines.pk})
    assert get_redirect_location(response) == redirect_url

    task_with_lines.refresh_from_db()
    assert task_with_lines.is_fully_paid()
    assert task_with_lines.events.filter(
        type=TaskEvents.ORDER_MARKED_AS_PAID.value).exists()


def test_view_fulfill_task_lines(admin_client, task_with_lines):
    url = reverse(
        'dashboard:fulfill-task-lines',
        kwargs={'task_pk': task_with_lines.pk})
    data = {
        'csrfmiddlewaretoken': 'hello',
        'form-INITIAL_FORMS': '0',
        'form-MAX_NUM_FORMS': '1000',
        'form-MIN_NUM_FORMS': '0',
        'form-TOTAL_FORMS': task_with_lines.lines.count(),
        'send_mail': 'on',
        'tracking_number': ''}
    for i, line in enumerate(task_with_lines):
        data['form-{}-task_line'.format(i)] = line.pk
        data['form-{}-quantity'.format(i)] = line.quantity_unfulfilled

    response = admin_client.post(url, data)
    assert response.status_code == 302
    assert get_redirect_location(response) == reverse(
        'dashboard:task-details', kwargs={'task_pk': task_with_lines.pk})
    task_with_lines.refresh_from_db()
    for line in task_with_lines.lines.all():
        assert line.quantity_unfulfilled == 0


def test_view_fulfill_task_lines_with_empty_quantity(admin_client, task_with_lines):
    url = reverse(
        'dashboard:fulfill-task-lines',
        kwargs={'task_pk': task_with_lines.pk})
    data = {
        'csrfmiddlewaretoken': 'hello',
        'form-INITIAL_FORMS': '0',
        'form-MAX_NUM_FORMS': '1000',
        'form-MIN_NUM_FORMS': '0',
        'form-TOTAL_FORMS': task_with_lines.lines.count(),
        'send_mail': 'on',
        'tracking_number': ''}
    for i, line in enumerate(task_with_lines):
        data['form-{}-task_line'.format(i)] = line.pk
        data['form-{}-quantity'.format(i)] = line.quantity_unfulfilled

    # Set first task line's fulfill quantity to 0
    data['form-0-quantity'] = 0

    response = admin_client.post(url, data)
    assert response.status_code == 302
    assert get_redirect_location(response) == reverse(
        'dashboard:task-details', kwargs={'task_pk': task_with_lines.pk})
    task_with_lines.refresh_from_db()
    assert not task_with_lines.lines.all()[0].quantity_unfulfilled == 0
    for line in task_with_lines.lines.all()[1:]:
        assert line.quantity_unfulfilled == 0


def test_view_fulfill_task_lines_with_all_empty_quantity(
        admin_client, task_with_lines):
    url = reverse(
        'dashboard:fulfill-task-lines',
        kwargs={'task_pk': task_with_lines.pk})
    data = {
        'csrfmiddlewaretoken': 'hello',
        'form-INITIAL_FORMS': '0',
        'form-MAX_NUM_FORMS': '1000',
        'form-MIN_NUM_FORMS': '0',
        'form-TOTAL_FORMS': task_with_lines.lines.count(),
        'send_mail': 'on',
        'tracking_number': ''}
    for i, line in enumerate(task_with_lines):
        data['form-{}-task_line'.format(i)] = line.pk
        data['form-{}-quantity'.format(i)] = 0

    response = admin_client.post(url, data)
    assert response.status_code == 200
    for line in task_with_lines.lines.all():
        assert not line.quantity_unfulfilled == 0


def test_render_fulfillment_page(admin_client, task_with_lines):
    url = reverse(
        'dashboard:fulfill-task-lines',
        kwargs={'task_pk': task_with_lines.pk})
    response = admin_client.get(url)
    assert response.status_code == 200


def test_view_cancel_fulfillment(admin_client, fulfilled_order):
    fulfillment = fulfilled_order.fulfillments.first()
    url = reverse(
        'dashboard:fulfillment-cancel',
        kwargs={
            'task_pk': fulfilled_order.pk,
            'fulfillment_pk': fulfillment.pk})

    response = admin_client.post(url, {'csrfmiddlewaretoken': 'hello'})
    assert response.status_code == 302
    assert get_redirect_location(response) == reverse(
        'dashboard:task-details', kwargs={'task_pk': fulfilled_order.pk})
    fulfillment.refresh_from_db()
    assert fulfillment.status == FulfillmentStatus.CANCELED


def test_render_cancel_fulfillment_page(admin_client, fulfilled_order):
    url = reverse(
        'dashboard:fulfill-task-lines',
        kwargs={'task_pk': fulfilled_order.pk})
    response = admin_client.get(url)
    assert response.status_code == 200


def test_view_add_task_note(admin_client, task_with_lines):
    url = reverse(
        'dashboard:task-add-note',
        kwargs={'task_pk': task_with_lines.pk})
    note_content = 'this is a note'
    data = {
        'csrfmiddlewaretoken': 'hello',
        'message': note_content}
    response = admin_client.post(url, data)
    assert response.status_code == 200
    task_with_lines.refresh_from_db()
    assert task_with_lines.events.first().parameters['message'] == note_content  # noqa


@pytest.mark.parametrize('type', [e.value for e in TaskEvents])
def test_task_event_display(admin_user, type, task):
    parameters = {
        'message': 'Example Note',
        'quantity': 12,
        'email_type': TaskEventsEmails.PAYMENT.value,
        'email': 'example@example.com',
        'amount': {'_type': 'Money', 'amount': '10.00', 'currency': 'USD'},
        'composed_id': 12,
        'tracking_number': '5421AB',
        'oversold_items': ['Blue Shirt', 'Red Shirt']}
    event = TaskEvent(
        user=admin_user, task=task, parameters=parameters, type=type)
    event.get_event_display()


def test_filter_order_by_status(admin_client):
    url = reverse('dashboard:tasks',)
    data = {
        'status': 'unfulfilled', 'payment_status': ChargeStatus.NOT_CHARGED}
    response = admin_client.get(url, data)
    assert response.status_code == 200

    data = {
        'status': 'unfulfilled',
        'payment_status': ChargeStatus.FULLY_REFUNDED}
    response = admin_client.get(url, data)
    assert response.status_code == 200
