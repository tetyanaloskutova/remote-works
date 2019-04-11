from captcha.fields import ReCaptchaField
from django import forms
from django.conf import settings
from django.contrib.auth import forms as django_forms, update_session_auth_hash
from django.utils.safestring import mark_safe
from django.utils.translation import pgettext, pgettext_lazy
from phonenumbers.phonenumberutil import country_code_for_region

from . import emails
from ..account.models import User, Schedule
from .i18n import AddressMetaForm, get_address_form_class


class FormWithReCaptcha(forms.BaseForm):
    def __new__(cls, *args, **kwargs):
        if settings.RECAPTCHA_PUBLIC_KEY and settings.RECAPTCHA_PRIVATE_KEY:
            # insert a Google reCaptcha field inside the form
            # note: label is empty, the reCaptcha is self-explanatory making
            #       the form simpler for the user.
            cls.base_fields['_captcha'] = ReCaptchaField(label='')
        return super(FormWithReCaptcha, cls).__new__(cls)


def get_address_form(
        data, country_code, initial=None, instance=None, **kwargs):
    country_form = AddressMetaForm(data, initial=initial)
    preview = False
    if country_form.is_valid():
        country_code = country_form.cleaned_data['country']
        preview = country_form.cleaned_data['preview']

    if initial is None and country_code:
        initial = {}
    if country_code:
        initial['phone'] = '+{}'.format(country_code_for_region(country_code))

    address_form_class = get_address_form_class(country_code)

    if not preview and instance is not None:
        address_form_class = get_address_form_class(instance.country.code)
        address_form = address_form_class(data, instance=instance, **kwargs)
    else:
        initial_address = (
            initial if not preview
            else data.dict() if data is not None else data)
        address_form = address_form_class(
            not preview and data or None,
            initial=initial_address,
            **kwargs)
    return address_form, preview


class TimePickerWidget(forms.TimeInput):
    def render(self, name, value, attrs=None, renderer=None):

        htmlString = u''
        htmlString += u'<select name="%s">' % (name)
        for i in range(24):
                htmlString += ('<option value="%d:00">%d:00</option>' % (i,i))
        htmlString +='</select>'
        return mark_safe(u''.join(htmlString))


class ScheduleForm(forms.ModelForm):
    DAYS_OF_WEEK = (
        ("su", "Sunday"),
        ("mo", "Monday"),
        ("tu", "Tuesday"),
        ("we", "Wednesday"),
        ("th", "Thursday"),
        ("fr", "Friday"),
        ("sa", "Saturday"),
    )

    #time_slot_start = forms.TimeField(input_formats='%H:%M', widget=forms.TimeInput(format='%H:%M')) #, widget=TimePickerWidget(format='%I:%M %p'))
    #time_slot_end = forms.TimeField(input_formats='%H:%M', widget=forms.TimeInput(format='%H:%M')) #, widget=TimePickerWidget(format='%I:%M %p'))
    #days_of_week = forms.MultipleChoiceField(widget=forms.CheckboxSelectMultiple,
    #                                         choices=DAYS_OF_WEEK)

    def __init__(self, *args, **kwargs):
        self.parent = kwargs.pop('parent', None)
        super().__init__(*args, **kwargs)
        self.fields['days_of_week'].choices = (
                                                ("su", "Sunday"),
                                                ("mo", "Monday"),
                                                ("tu", "Tuesday"),
                                                ("we", "Wednesday"),
                                                ("th", "Thursday"),
                                                ("fr", "Friday"),
                                                ("sa", "Saturday"),
                                            )

    class Meta:
        model = Schedule
        fields = ('time_slot_start', 'time_slot_end', 'days_of_week')
        widgets = {
            'time_slot_start': TimePickerWidget(format='%H:%M'),
            'time_slot_end': TimePickerWidget(format='%H:%M'),
            'days_of_week': forms.CheckboxSelectMultiple(choices=(
                                                                ("su", "Sunday"),
                                                                ("mo", "Monday"),
                                                                ("tu", "Tuesday"),
                                                                ("we", "Wednesday"),
                                                                ("th", "Thursday"),
                                                                ("fr", "Friday"),
                                                                ("sa", "Saturday"),
                                                            ))
        }
        labels = {
            'time_slot_start': pgettext_lazy(
                'Start work hh24:mm',
                'Start work hh:mm'),
            'time_slot_end': pgettext_lazy(
                'End work hh24:mm',
                'End work hh:mm'),
            'days_of_week': pgettext_lazy(
                'Days of week applicable',
                'Days of week applicable')}

    def save(self, *args, **kwargs):
        instance = super(ScheduleForm, self).save(commit=False)

        days_of_week = self.cleaned_data.get("days_of_week")
        instance.days_of_week = days_of_week
        instance.save()
        return instance

class ChangePasswordForm(django_forms.PasswordChangeForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['new_password1'].user = self.user
        self.fields['old_password'].widget.attrs['placeholder'] = ''
        self.fields['new_password1'].widget.attrs['placeholder'] = ''
        del self.fields['new_password2']


def logout_on_password_change(request, user):
    if (update_session_auth_hash is not None and
            not settings.LOGOUT_ON_PASSWORD_CHANGE):
        update_session_auth_hash(request, user)


class LoginForm(django_forms.AuthenticationForm, FormWithReCaptcha):
    username = forms.EmailField(
        label=pgettext('Form field', 'Email'), max_length=75)

    def __init__(self, request=None, *args, **kwargs):
        super().__init__(request=request, *args, **kwargs)
        if request:
            email = request.GET.get('email')
            if email:
                self.fields['username'].initial = email


class SignupForm(forms.ModelForm, FormWithReCaptcha):
    password = forms.CharField(
        widget=forms.PasswordInput,
        label=pgettext('Password', 'Password'))
    email = forms.EmailField(
        label=pgettext('Email', 'Email'),
        error_messages={
            'unique': pgettext_lazy(
                'Registration error',
                'This email has already been registered.')})

    class Meta:
        model = User
        fields = ('email',)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self._meta.model.USERNAME_FIELD in self.fields:
            self.fields[self._meta.model.USERNAME_FIELD].widget.attrs.update(
                {'autofocus': ''})

    def save(self, request=None, commit=True):
        user = super().save(commit=False)
        password = self.cleaned_data['password']
        user.set_password(password)
        if commit:
            user.save()
        return user


class PasswordResetForm(django_forms.PasswordResetForm, FormWithReCaptcha):
    """Allow resetting passwords.

    This subclass overrides sending emails to use templated email.
    """

    def get_users(self, email):
        active_users = User.objects.filter(email__iexact=email, is_active=True)
        return active_users

    def send_mail(
            self, subject_template_name, email_template_name, context,
            from_email, to_email, html_email_template_name=None):
        # Passing the user object to the Celery task throws an
        # error "'User' is not JSON serializable". Since it's not used in our
        # template, we remove it from the context.
        del context['user']
        emails.send_password_reset_email.delay(context, to_email)


class NameForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['first_name', 'last_name']
        labels = {
            'first_name': pgettext_lazy(
                'Customer form: Given name field', 'Given name'),
            'last_name': pgettext_lazy(
                'Customer form: Family name field', 'Family name')}
