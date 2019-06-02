from enum import Enum

from django.conf import settings
from django.utils.translation import npgettext_lazy, pgettext_lazy
from django_prices.templatetags import prices_i18n
from prices import Money


class TaskStatus:
    DRAFT = 'draft'
    UNFULFILLED = 'unfulfilled'
    PARTIALLY_FULFILLED = 'partially fulfilled'
    FULFILLED = 'fulfilled'
    CANCELED = 'canceled'

    CHOICES = [
        (DRAFT, pgettext_lazy(
            'Status for a fully editable, not confirmed task created by '
            'staff users',
            'Draft')),
        (UNFULFILLED, pgettext_lazy(
            'Status for an task with no items marked as fulfilled',
            'Unfulfilled')),
        (PARTIALLY_FULFILLED, pgettext_lazy(
            'Status for an task with some items marked as fulfilled',
            'Partially fulfilled')),
        (FULFILLED, pgettext_lazy(
            'Status for an task with all items marked as fulfilled',
            'Fulfilled')),
        (CANCELED, pgettext_lazy(
            'Status for a permanently canceled task',
            'Canceled'))]


class FulfillmentStatus:
    FULFILLED = 'fulfilled'
    CANCELED = 'canceled'

    CHOICES = [
        (FULFILLED, pgettext_lazy(
            'Status for a group of skills in an task marked as fulfilled',
            'Fulfilled')),
        (CANCELED, pgettext_lazy(
            'Status for a fulfilled group of skills in an task marked '
            'as canceled',
            'Canceled'))]


class TaskEvents(Enum):
    PLACED = 'placed'
    PLACED_FROM_DRAFT = 'draft_placed'
    OVERSOLD_ITEMS = 'oversold_items'
    TASK_MARKED_AS_PAID = 'marked_as_paid'
    CANCELED = 'canceled'
    TASK_FULLY_PAID = 'task_paid'
    UPDATED = 'updated'

    EMAIL_SENT = 'email_sent'

    PAYMENT_CAPTURED = 'captured'
    PAYMENT_REFUNDED = 'refunded'
    PAYMENT_VOIDED = 'voided'

    FULFILLMENT_CANCELED = 'fulfillment_canceled'
    FULFILLMENT_REAVAILED_ITEMS = 'reavailed_items'
    FULFILLMENT_FULFILLED_ITEMS = 'fulfilled_items'
    TRACKING_UPDATED = 'tracking_updated'
    NOTE_ADDED = 'note_added'

    # Used mostly for importing legacy data from before Enum-based events
    OTHER = 'other'


class TaskEventsEmails(Enum):
    PAYMENT = 'payment_confirmation'
    DELIVERY = 'delivery_confirmation'
    TASK = 'task_confirmation'
    FULFILLMENT = 'fulfillment_confirmation'


EMAIL_CHOICES = {
    TaskEventsEmails.PAYMENT.value: pgettext_lazy(
        'Email type', 'Payment confirmation'),
    TaskEventsEmails.DELIVERY.value: pgettext_lazy(
        'Email type', 'Delivery confirmation'),
    TaskEventsEmails.FULFILLMENT.value: pgettext_lazy(
        'Email type', 'Fulfillment confirmation'),
    TaskEventsEmails.TASK.value: pgettext_lazy(
        'Email type', 'Task confirmation')}


def get_money_from_params(amount):
    """Money serialization changed at one point, as for now it's serialized
    as a dict. But we keep those settings for the legacy data.

    Can be safely removed after migrating to Dashboard 2.0
    """
    if isinstance(amount, Money):
        return amount
    if isinstance(amount, dict):
        return Money(amount=amount['amount'], currency=amount['currency'])
    return Money(amount, settings.DEFAULT_CURRENCY)


def display_task_event(task_event):
    """This function is used to keep the  backwards compatibility
    with the old dashboard and new type of task events
    (storing enums instead of messages)
    """
    event_type = task_event.type
    params = task_event.parameters
    if event_type == TaskEvents.PLACED_FROM_DRAFT.value:
        return pgettext_lazy(
            'Dashboard message related to an task',
            'Task created from draft task by %(user_name)s' % {
                'user_name': task_event.user})
    if event_type == TaskEvents.PAYMENT_VOIDED.value:
        return pgettext_lazy(
            'Dashboard message related to an task',
            'Payment was voided by %(user_name)s' % {
                'user_name': task_event.user})
    if event_type == TaskEvents.PAYMENT_REFUNDED.value:
        amount = get_money_from_params(params['amount'])
        return pgettext_lazy(
            'Dashboard message related to an task',
            'Successfully refunded: %(amount)s' % {
                'amount': prices_i18n.amount(amount)})
    if event_type == TaskEvents.PAYMENT_CAPTURED.value:
        amount = get_money_from_params(params['amount'])
        return pgettext_lazy(
            'Dashboard message related to an task',
            'Successfully captured: %(amount)s' % {
                'amount': prices_i18n.amount(amount)})
    if event_type == TaskEvents.TASK_MARKED_AS_PAID.value:
        return pgettext_lazy(
            'Dashboard message related to an task',
            'Task manually marked as paid by %(user_name)s' % {
                'user_name': task_event.user})
    if event_type == TaskEvents.CANCELED.value:
        return pgettext_lazy(
            'Dashboard message related to an task',
            'Task was canceled by %(user_name)s' % {
                'user_name': task_event.user})
    if event_type == TaskEvents.FULFILLMENT_REAVAILED_ITEMS.value:
        return npgettext_lazy(
            'Dashboard message related to an task',
            'We reavailabilityed %(quantity)d item',
            'We reavailabilityed %(quantity)d items',
            number='quantity') % {'quantity': params['quantity']}
    if event_type == TaskEvents.NOTE_ADDED.value:
        return pgettext_lazy(
            'Dashboard message related to an task',
            '%(user_name)s added note: %(note)s' % {
                'note': params['message'],
                'user_name': task_event.user})
    if event_type == TaskEvents.FULFILLMENT_CANCELED.value:
        return pgettext_lazy(
            'Dashboard message',
            'Fulfillment #%(fulfillment)s canceled by %(user_name)s') % {
                'fulfillment': params['composed_id'],
                'user_name': task_event.user}
    if event_type == TaskEvents.FULFILLMENT_FULFILLED_ITEMS.value:
        return npgettext_lazy(
            'Dashboard message related to an task',
            'Fulfilled %(quantity_fulfilled)d item',
            'Fulfilled %(quantity_fulfilled)d items',
            number='quantity_fulfilled') % {
                'quantity_fulfilled': params['quantity']}
    if event_type == TaskEvents.PLACED.value:
        return pgettext_lazy(
            'Dashboard message related to an task',
            'Task was placed')
    if event_type == TaskEvents.TASK_FULLY_PAID.value:
        return pgettext_lazy(
            'Dashboard message related to an task',
            'Task was fully paid')
    if event_type == TaskEvents.EMAIL_SENT.value:
        return pgettext_lazy(
            'Dashboard message related to an task',
            '%(email_type)s email was sent to the customer '
            '(%(email)s)') % {
                'email_type': EMAIL_CHOICES[params['email_type']],
                'email': params['email']}
    if event_type == TaskEvents.UPDATED.value:
        return pgettext_lazy(
            'Dashboard message related to an task',
            'Task details were updated by %(user_name)s' % {
                'user_name': task_event.user})
    if event_type == TaskEvents.TRACKING_UPDATED.value:
        return pgettext_lazy(
            'Dashboard message related to an task',
            'Fulfillment #%(fulfillment)s tracking was updated to'
            ' %(tracking_number)s by %(user_name)s') % {
                'fulfillment': params['composed_id'],
                'tracking_number': params['tracking_number'],
                'user_name': task_event.user}
    if event_type == TaskEvents.OVERSOLD_ITEMS.value:
        return npgettext_lazy(
            'Dashboard message related to an task',
            '%(quantity)d line item oversold on this task.',
            '%(quantity)d line items oversold on this task.',
            number='quantity') % {
                'quantity': len(params['oversold_items'])}

    if event_type == TaskEvents.OTHER.value:
        return task_event.parameters['message']
    raise ValueError('Not supported event type: %s' % (event_type))
