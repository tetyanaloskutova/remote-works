from django.conf import settings
from django.contrib import auth, messages
from django.contrib.auth import views as django_views
from django.contrib.auth.decorators import login_required
from django.http import Http404, HttpResponseRedirect
from django.shortcuts import get_object_or_404, redirect
from django.template.response import TemplateResponse
from django.urls import reverse, reverse_lazy
from django.utils.translation import pgettext, ugettext_lazy as _, pgettext_lazy
from django.views.decorators.http import require_POST

from ..checkout.utils import find_and_assign_anonymous_cart
from ..core.utils import get_paginator_items
from .emails import send_account_delete_confirmation_email
from .forms import (
    ChangePasswordForm, LoginForm, NameForm, PasswordResetForm, SignupForm,
    ScheduleForm,
    get_address_form, logout_on_password_change)
from ..account.models import User, Schedule
from django.db.models import Q
from ..dashboard.customer.filters import UserFilter
from ..skill.models import Skill


@find_and_assign_anonymous_cart()
def login(request):
    kwargs = {
        'template_name': 'account/login.html',
        'authentication_form': LoginForm}
    return django_views.LoginView.as_view(**kwargs)(request, **kwargs)


@login_required
def logout(request):
    auth.logout(request)
    messages.success(request, _('You have been successfully logged out.'))
    return redirect(settings.LOGIN_REDIRECT_URL)


def signup(request):
    form = SignupForm(request.POST or None)
    if form.is_valid():
        form.save()
        password = form.cleaned_data.get('password')
        email = form.cleaned_data.get('email')
        user = auth.authenticate(
            request=request, email=email, password=password)
        if user:
            auth.login(request, user)
        messages.success(request, _('User has been created'))
        redirect_url = request.POST.get('next', settings.LOGIN_REDIRECT_URL)
        return redirect(redirect_url)
    ctx = {'form': form}
    return TemplateResponse(request, 'account/signup.html', ctx)


def password_reset(request):
    kwargs = {
        'template_name': 'account/password_reset.html',
        'success_url': reverse_lazy('account:reset-password-done'),
        'form_class': PasswordResetForm}
    return django_views.PasswordResetView.as_view(**kwargs)(request, **kwargs)


class PasswordResetConfirm(django_views.PasswordResetConfirmView):
    template_name = 'account/password_reset_from_key.html'
    success_url = reverse_lazy('account:reset-password-complete')
    token = None
    uidb64 = None


def password_reset_confirm(request, uidb64=None, token=None):
    kwargs = {
        'template_name': 'account/password_reset_from_key.html',
        'success_url': reverse_lazy('account:reset-password-complete'),
        'token': token,
        'uidb64': uidb64}
    return PasswordResetConfirm.as_view(**kwargs)(request, **kwargs)


@login_required
def details(request):
    password_form = get_or_process_password_form(request)
    name_form = get_or_process_name_form(request)
    tasks = request.user.tasks.confirmed().prefetch_related('lines')
    orders_paginated = get_paginator_items(
        tasks, settings.PAGINATE_BY, request.GET.get('page'))
    schedules = request.user.schedules.all()
    ctx = {'addresses': request.user.addresses.all(),
           'tasks': orders_paginated,
           'change_password_form': password_form,
           'user_name_form': name_form,
           'schedules': schedules}

    return TemplateResponse(request, 'account/details.html', ctx)


def get_or_process_password_form(request):
    form = ChangePasswordForm(data=request.POST or None, user=request.user)
    if form.is_valid():
        form.save()
        logout_on_password_change(request, form.user)
        messages.success(request, pgettext(
            'Storefront message', 'Password successfully changed.'))
    return form


def get_or_process_name_form(request):
    form = NameForm(data=request.POST or None, instance=request.user)
    if form.is_valid():
        form.save()
        messages.success(request, pgettext(
            'Storefront message', 'Account successfully updated.'))
    return form


@login_required
def address_edit(request, pk):
    address = get_object_or_404(request.user.addresses, pk=pk)
    address_form, preview = get_address_form(
        request.POST or None, instance=address,
        country_code=address.country.code)
    if address_form.is_valid() and not preview:
        address_form.save()
        message = pgettext(
            'Storefront message', 'Address successfully updated.')
        messages.success(request, message)
        return HttpResponseRedirect(reverse('account:details') + '#addresses')
    return TemplateResponse(
        request, 'account/address_edit.html',
        {'address_form': address_form})


@login_required
def address_delete(request, pk):
    address = get_object_or_404(request.user.addresses, pk=pk)
    if request.method == 'POST':
        address.delete()
        messages.success(
            request,
            pgettext('Storefront message', 'Address successfully removed'))
        return HttpResponseRedirect(reverse('account:details') + '#addresses')
    return TemplateResponse(
        request, 'account/address_delete.html', {'address': address})


@login_required
@require_POST
def account_delete(request):
    user = request.user
    send_account_delete_confirmation_email.delay(str(user.token), user.email)
    messages.success(
        request, pgettext(
            'Storefront message, when user requested his account removed',
            'Please check your inbox for a confirmation e-mail.'))
    return HttpResponseRedirect(reverse('account:details') + '#settings')


@login_required
def account_delete_confirm(request, token):
    user = request.user

    if str(request.user.token) != token:
        raise Http404('No such page!')

    if request.method == 'POST':
        user.delete()
        msg = pgettext(
            'Account deleted',
            'Your account was deleted successfully. '
            'In case of any trouble or questions feel free to contact us.')
        messages.success(request, msg)
        return redirect('home')

    return TemplateResponse(
        request, 'account/account_delete_prompt.html')


def profile_list(request):
    profiles = (
        User.objects.filter(Q(is_staff=False)).distinct().prefetch_related('skills', 'addresses').select_related('default_billing_address', 'default_delivery_address').order_by('email'))
    print(len(profiles))
    profile_filter = UserFilter(request.GET, queryset=profiles)
    profiles = get_paginator_items(
        profile_filter.qs, settings.DASHBOARD_PAGINATE_BY,
        request.GET.get('page'))
    print(len(profiles))
    ctx = {
        'profiles': profiles, 'filter_set': profile_filter,
        'is_empty': not profile_filter.queryset.exists()}
    return TemplateResponse(request, 'account/list.html', ctx)


def profile_details(request, pk):
    queryset = User.objects.prefetch_related(
        'tasks', 'addresses', 'notes').select_related(
            'default_billing_address', 'default_delivery_address')
    customer = get_object_or_404(queryset, pk=pk)
    customer_orders = customer.tasks.all()
    customer_skills = Skill.objects.filter(owner=customer.id)
    notes = customer.notes.all()
    schedules = customer.schedules.all()

    ctx = {
        'customer': customer, 'customer_orders': customer_orders,
        'notes': notes, 'customer_skills':customer_skills, 'schedules': schedules }
    return TemplateResponse(request, 'account/profile_detail.html', ctx)


def schedule_create(request):
    schedule = Schedule()
    form = ScheduleForm(request.POST or None, instance=schedule)
    if form.is_valid():
        schedule = form.save()
        schedule.owner = request.user
        schedule.save()
        msg = pgettext_lazy('Dashboard message', 'Added schedule')
        messages.success(request, msg)
        return redirect('account:details')
    ctx = {'schedule': schedule, 'form': form}
    return TemplateResponse(
        request,
        'account/schedule_form.html',
        ctx)


def schedule_delete(request, pk):
    schedule = get_object_or_404(Schedule, pk=pk)
    if request.method == 'POST':
        schedule.delete()
        msg = pgettext_lazy(
            'Dashboard message', 'Removed schedule %s') % (schedule)
        messages.success(request, msg)
        return redirect('account:details')
    return TemplateResponse(
        request,
        'account/modal/'
        'schedule_confirm_delete.html',
        {'schedule': schedule})

