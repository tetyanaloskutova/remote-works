import logging

from django.contrib import auth, messages
from django.contrib.auth.decorators import login_required
from django.db import transaction
from django.http import HttpResponseForbidden
from django.shortcuts import get_object_or_404, redirect
from django.template.response import TemplateResponse
from django.urls import reverse
from django.utils.translation import pgettext_lazy
from django.views.decorators.csrf import csrf_exempt

from . import FulfillmentStatus
from ..account.forms import LoginForm
from ..account.models import User
from ..core.utils import get_client_ip
from ..payment import ChargeStatus, TransactionKind, get_payment_gateway
from ..payment.utils import (
    create_payment, create_payment_information, gateway_process_payment)
from .forms import (
    CustomerNoteForm, PasswordForm, PaymentDeleteForm, PaymentsForm)
from .models import Task
from .utils import attach_task_to_user, check_task_status

logger = logging.getLogger(__name__)

PAYMENT_TEMPLATE = 'task/payment/%s.html'


def details(request, token):
    note_form = None
    tasks = Task.objects.confirmed().prefetch_related(
        'lines__variant__images', 'lines__variant__skill__images',
        'fulfillments__lines__task_line')
    tasks = tasks.select_related(
        'billing_address', 'delivery_address', 'user')
    task = get_object_or_404(tasks, token=token)
    if task.is_open() and not task.customer_note:
        note_form = CustomerNoteForm(request.POST or None, instance=task)
        if request.method == 'POST':
            if note_form.is_valid():
                note_form.save()
                return redirect('task:details', token=task.token)
    fulfillments = task.fulfillments.exclude(
        status=FulfillmentStatus.CANCELED)
    ctx = {
        'task': task, 'fulfillments': fulfillments, 'note_form': note_form}
    return TemplateResponse(request, 'task/details.html', ctx)


def payment(request, token):
    tasks = Task.objects.confirmed().filter(billing_address__isnull=False)
    tasks = tasks.prefetch_related(
        'lines__variant__images', 'lines__variant__skill__images')
    tasks = tasks.select_related(
        'billing_address', 'delivery_address', 'user')
    task = get_object_or_404(tasks, token=token)
    payments = task.payments.all()
    form_data = request.POST or None

    waiting_payment = payments.filter(
        is_active=True,
        charge_status=ChargeStatus.NOT_CHARGED,
        transactions__kind=TransactionKind.AUTH).first()
    if not waiting_payment:
        waiting_payment_form = None
    else:
        form_data = None
        waiting_payment_form = PaymentDeleteForm(
            None, task=task, initial={'payment_id': waiting_payment.id})
    if task.is_fully_paid() or not task.billing_address:
        form_data = None
    payment_form = None
    if not task.is_pre_authorized():
        payment_form = PaymentsForm(form_data)
        # FIXME: redirect if there is only one payment
        if payment_form.is_valid():
            payment = payment_form.cleaned_data['gateway']
            return redirect(
                'task:payment', token=task.token, gateway=payment)
    ctx = {
        'task': task, 'payment_form': payment_form, 'payments': payments,
        'waiting_payment': waiting_payment,
        'waiting_payment_form': waiting_payment_form}
    return TemplateResponse(request, 'task/payment.html', ctx)


@check_task_status
def start_payment(request, task, gateway):
    payment_gateway, connection_params = get_payment_gateway(gateway)
    extra_data = {'customer_user_agent': request.META.get('HTTP_USER_AGENT')}
    with transaction.atomic():
        payment = create_payment(
            gateway=gateway,
            currency=task.total.gross.currency,
            email=task.user_email,
            billing_address=task.billing_address,
            customer_ip_address=get_client_ip(request),
            total=task.total.gross.amount,
            task=task,
            extra_data=extra_data)

        if (task.is_fully_paid()
                or payment.charge_status == ChargeStatus.FULLY_REFUNDED):
            return redirect(task.get_absolute_url())

        payment_info = create_payment_information(payment)
        form = payment_gateway.create_form(
            data=request.POST or None,
            payment_information=payment_info,
            connection_params=connection_params)
        if form.is_valid():
            try:
                gateway_process_payment(
                    payment=payment, payment_token=form.get_payment_token())
            except Exception as exc:
                form.add_error(None, str(exc))
            else:
                if task.is_fully_paid():
                    return redirect('task:payment-success', token=task.token)
                return redirect(task.get_absolute_url())

    client_token = payment_gateway.get_client_token(
        connection_params=connection_params)
    ctx = {
        'form': form,
        'payment': payment,
        'client_token': client_token,
        'task': task}
    return TemplateResponse(request, payment_gateway.TEMPLATE_PATH, ctx)


@check_task_status
def cancel_payment(request, task):
    form = PaymentDeleteForm(request.POST or None, task=task)
    if form.is_valid():
        with transaction.atomic():
            form.save()
        return redirect('task:payment', token=task.token)
    return HttpResponseForbidden()


@csrf_exempt
def payment_success(request, token):
    """Receive request from payment gateway after paying for an task.

    Redirects user to payment success.
    All post data and query strings are dropped.
    """
    url = reverse('task:checkout-success', kwargs={'token': token})
    return redirect(url)


def checkout_success(request, token):
    """Redirect user after placing an task.

    Anonymous users are redirected to the checkout success page.
    Registered users are redirected to task details page and the task
    is attached to their account.
    """
    task = get_object_or_404(Task, token=token)
    email = task.user_email
    ctx = {'email': email, 'task': task}
    if request.user.is_authenticated:
        return TemplateResponse(request, 'task/checkout_success.html', ctx)
    form_data = request.POST.copy()
    if form_data:
        form_data.update({'email': email})
    register_form = PasswordForm(form_data or None)
    if register_form.is_valid():
        register_form.save()
        password = register_form.cleaned_data.get('password')
        user = auth.authenticate(
            request=request, email=email, password=password)
        auth.login(request, user)
        attach_task_to_user(task, user)
        return redirect('task:details', token=token)
    user_exists = User.objects.filter(email=email).exists()
    login_form = LoginForm(
        initial={'username': email}) if user_exists else None
    ctx.update({'form': register_form, 'login_form': login_form})
    return TemplateResponse(
        request, 'task/checkout_success_anonymous.html', ctx)


@login_required
def connect_task_with_user(request, token):
    """Connect newly created task to an authenticated user."""
    try:
        task = Task.objects.get(user_email=request.user.email, token=token)
    except Task.DoesNotExist:
        task = None
    if not task:
        msg = pgettext_lazy(
            'Connect task with user warning message',
            "We couldn't assign the task to your account as the email"
            " addresses don't match")
        messages.warning(request, msg)
        return redirect('account:details')
    attach_task_to_user(task, request.user)
    msg = pgettext_lazy(
        'storefront message',
        'The task is now assigned to your account')
    messages.success(request, msg)
    return redirect('task:details', token=task.token)
