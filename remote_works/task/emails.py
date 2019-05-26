from celery import shared_task
from django.conf import settings
from django.urls import reverse
from templated_email import send_templated_mail

from ..core.emails import get_email_base_context
from ..core.utils import build_absolute_uri
from ..seo.schema.email import get_task_confirmation_markup
from .models import Fulfillment, Task

CONFIRM_ORDER_TEMPLATE = 'task/confirm_order'
CONFIRM_FULFILLMENT_TEMPLATE = 'task/confirm_fulfillment'
UPDATE_FULFILLMENT_TEMPLATE = 'task/update_fulfillment'
CONFIRM_PAYMENT_TEMPLATE = 'task/payment/confirm_payment'


def collect_data_for_email(task_pk, template):
    """Collects data required for email sending.

    Args:
        task_pk (int): task primary key
        template (str): email template path
    """
    task = Task.objects.get(pk=task_pk)
    recipient_email = task.get_user_current_email()
    email_context = get_email_base_context()
    email_context['task_details_url'] = build_absolute_uri(
        reverse('task:details', kwargs={'token': task.token}))

    # Task confirmation template requires additional information
    if template == CONFIRM_ORDER_TEMPLATE:
        email_markup = get_task_confirmation_markup(task)
        email_context.update(
            {'task': task, 'schema_markup': email_markup})

    return {
        'recipient_list': [recipient_email], 'template_name': template,
        'context': email_context, 'from_email': settings.ORDER_FROM_EMAIL}


def collect_data_for_fullfillment_email(task_pk, template, fulfillment_pk):
    fulfillment = Fulfillment.objects.get(pk=fulfillment_pk)
    email_data = collect_data_for_email(task_pk, template)
    email_data['context'].update({'fulfillment': fulfillment})
    return email_data


@shared_task
def send_task_confirmation(task_pk):
    """Sends task confirmation email."""
    email_data = collect_data_for_email(task_pk, CONFIRM_ORDER_TEMPLATE)
    send_templated_mail(**email_data)


@shared_task
def send_fulfillment_confirmation(task_pk, fulfillment_pk):
    email_data = collect_data_for_fullfillment_email(
        task_pk, CONFIRM_FULFILLMENT_TEMPLATE, fulfillment_pk)
    send_templated_mail(**email_data)


@shared_task
def send_fulfillment_update(task_pk, fulfillment_pk):
    email_data = collect_data_for_fullfillment_email(
        task_pk, UPDATE_FULFILLMENT_TEMPLATE, fulfillment_pk)
    send_templated_mail(**email_data)


@shared_task
def send_payment_confirmation(task_pk):
    """Sends payment confirmation email."""
    email_data = collect_data_for_email(task_pk, CONFIRM_PAYMENT_TEMPLATE)
    send_templated_mail(**email_data)
