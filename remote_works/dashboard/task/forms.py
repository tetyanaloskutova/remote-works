from django import forms
from django.conf import settings
from django.core.validators import MinValueValidator
from django.urls import reverse, reverse_lazy
from django.utils.translation import npgettext_lazy, pgettext_lazy

from ...account.i18n import (
    AddressForm as StorefrontAddressForm, PossiblePhoneNumberFormField)
from ...account.models import User
from ...checkout.forms import QuantityField
from ...core.exceptions import InsufficientStock
from ...core.utils.taxes import ZERO_TAXED_MONEY
from ...discount.models import Voucher
from ...discount.utils import decrease_voucher_usage, increase_voucher_usage
from ...task import TaskStatus
from ...task.models import Fulfillment, FulfillmentLine, Task, TaskLine
from ...task.utils import (
    add_variant_to_order, cancel_fulfillment, cancel_order,
    change_task_line_quantity, delete_task_line, recalculate_order)
from ...payment import ChargeStatus, CustomPaymentChoices, PaymentError
from ...payment.utils import (
    clean_mark_task_as_paid, gateway_capture, gateway_refund, gateway_void,
    mark_task_as_paid)
from ...skill.models import Skill, SkillVariant
from ...skill.utils import allocate_availability, deallocate_availability
from ...delivery.models import DeliveryMethod
from ..forms import AjaxSelect2ChoiceField
from ..widgets import PhonePrefixWidget
from .utils import (
    fulfill_task_line, remove_customer_from_order,
    update_task_with_user_addresses)


class CreateTaskFromDraftForm(forms.ModelForm):
    """Mark draft task as ready to fulfill."""
    notify_customer = forms.BooleanField(
        label=pgettext_lazy(
            'Send email to customer about task created by staff users',
            'Send email with task confirmation to the customer'),
        required=False, initial=True)

    class Meta:
        model = Task
        fields = []

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if not self.instance.get_user_current_email():
            self.fields.pop('notify_customer')

    def clean(self):
        super().clean()
        errors = []
        if self.instance.get_total_quantity() == 0:
            errors.append(forms.ValidationError(pgettext_lazy(
                'Create draft task form error',
                'Could not create task without any skills')))
        if self.instance.is_delivery_required():
            method = self.instance.delivery_method
            delivery_address = self.instance.delivery_address
            delivery_not_valid = (
                method and delivery_address and
                delivery_address.country.code not in method.delivery_zone.countries)  # noqa
            if delivery_not_valid:
                errors.append(forms.ValidationError(pgettext_lazy(
                    'Create draft task form error',
                    'Delivery method is not valid for chosen delivery '
                    'address')))
        if errors:
            raise forms.ValidationError(errors)
        return self.cleaned_data

    def save(self):
        self.instance.status = TaskStatus.UNFULFILLED
        if self.instance.user:
            self.instance.user_email = self.instance.user.email
        remove_delivery_address = False
        if not self.instance.is_delivery_required():
            self.instance.delivery_method_name = None
            self.instance.delivery_price = ZERO_TAXED_MONEY
            if self.instance.delivery_address:
                remove_delivery_address = True
        super().save()
        if remove_delivery_address:
            self.instance.delivery_address.delete()
        return self.instance


class TaskCustomerForm(forms.ModelForm):
    """Set customer details in an task."""

    update_addresses = forms.BooleanField(
        label=pgettext_lazy(
            'Update an task with user default addresses',
            'Set billing and delivery address in task to customer defaults'),
        initial=True, required=False)
    user = AjaxSelect2ChoiceField(
        queryset=User.objects.all(),
        fetch_data_url=reverse_lazy('dashboard:ajax-users-list'),
        required=False,
        label=pgettext_lazy(
            'Task form: editing customer details - selecting a customer',
            'Customer'))

    class Meta:
        model = Task
        fields = ['user', 'user_email']
        labels = {
            'user_email': pgettext_lazy(
                'Task customer email',
                'Email')}

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        user = self.instance.user
        if user:
            self.fields['user'].set_initial(user, label=user.get_ajax_label())

    def clean(self):
        cleaned_data = super().clean()
        user_email = cleaned_data.get('user_email')
        user = cleaned_data.get('user')
        if user and user_email:
            raise forms.ValidationError(pgettext_lazy(
                'Edit customer details in task form error',
                'An task can be related either with an email or an existing '
                'user account'))
        return self.cleaned_data

    def save(self):
        super().save()
        if self.cleaned_data.get('update_addresses'):
            update_task_with_user_addresses(self.instance)
        return self.instance


class TaskRemoveCustomerForm(forms.ModelForm):
    """Remove customer data from an task."""

    class Meta:
        model = Task
        fields = []

    def save(self):
        remove_customer_from_order(self.instance)
        return self.instance


class TaskDeliveryForm(forms.ModelForm):
    """Set delivery name and delivery price in an task."""
    delivery_method = AjaxSelect2ChoiceField(
        queryset=DeliveryMethod.objects.all(), min_input=0,
        label=pgettext_lazy(
            'Delivery method form field label', 'Delivery method'))

    class Meta:
        model = Task
        fields = ['delivery_method']

    def __init__(self, *args, **kwargs):
        self.taxes = kwargs.pop('taxes')
        super().__init__(*args, **kwargs)
        method_field = self.fields['delivery_method']
        fetch_data_url = reverse(
            'dashboard:ajax-task-delivery-methods',
            kwargs={'task_pk': self.instance.id})
        method_field.set_fetch_data_url(fetch_data_url)

        method = self.instance.delivery_method
        if method:
            method_field.set_initial(method, label=method.get_ajax_label())

        if self.instance.delivery_address:
            country_code = self.instance.delivery_address.country.code
            queryset = method_field.queryset.filter(
                delivery_zone__countries__contains=country_code)
            method_field.queryset = queryset

    def save(self, commit=True):
        method = self.instance.delivery_method
        self.instance.delivery_method_name = method.name
        self.instance.delivery_price = method.get_total(self.taxes)
        recalculate_order(self.instance)
        return super().save(commit)


class TaskRemoveDeliveryForm(forms.ModelForm):
    """Remove delivery name and delivery price from an task."""

    class Meta:
        model = Task
        fields = []

    def save(self, commit=True):
        self.instance.delivery_method = None
        self.instance.delivery_method_name = None
        self.instance.delivery_price = ZERO_TAXED_MONEY
        recalculate_order(self.instance)
        return super().save(commit)


class TaskEditDiscountForm(forms.ModelForm):
    """Edit discount amount in an task."""

    class Meta:
        model = Task
        fields = ['discount_amount']
        labels = {
            'discount_amount': pgettext_lazy(
                'Task discount amount fixed value',
                'Discount amount')}

    def save(self, commit=True):
        recalculate_order(self.instance, update_voucher_discount=False)
        return super().save(commit)


class TaskEditVoucherForm(forms.ModelForm):
    """Edit discount amount in an task."""
    voucher = AjaxSelect2ChoiceField(
        queryset=Voucher.objects.all(),
        fetch_data_url=reverse_lazy('dashboard:ajax-vouchers'), min_input=0,
        label=pgettext_lazy('Task voucher', 'Voucher'))

    class Meta:
        model = Task
        fields = ['voucher']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.old_voucher = self.instance.voucher
        if self.instance.voucher:
            self.fields['voucher'].set_initial(self.instance.voucher)

    def save(self, commit=True):
        voucher = self.instance.voucher
        if self.old_voucher != voucher:
            if self.old_voucher:
                decrease_voucher_usage(self.old_voucher)
            increase_voucher_usage(voucher)
        self.instance.discount_name = voucher.name or ''
        self.instance.translated_discount_name = (
            voucher.translated.name
            if voucher.translated.name != voucher.name else '')
        recalculate_order(self.instance)
        return super().save(commit)


class TaskNoteForm(forms.Form):
    message = forms.CharField(
        label=pgettext_lazy('Task note', 'Note'), widget=forms.Textarea())


class BasePaymentForm(forms.Form):

    amount = forms.DecimalField(
        label=pgettext_lazy(
            'Payment management form (capture, refund, void)', 'Amount'),
        max_digits=settings.DEFAULT_MAX_DIGITS,
        decimal_places=settings.DEFAULT_DECIMAL_PLACES)

    clean_error = pgettext_lazy(
        'Payment form error',
        'This payment action can not be performed.')

    def __init__(self, *args, **kwargs):
        self.payment = kwargs.pop('payment')
        super().__init__(*args, **kwargs)

    def payment_error(self, message):
        self.add_error(
            None, pgettext_lazy(
                'Payment form error', 'Payment gateway error: %s') % message)

    def try_payment_action(self, action):
        amount = self.cleaned_data['amount']
        try:
            action(self.payment, amount)
        except (PaymentError, ValueError) as e:
            self.payment_error(str(e))
            return False
        return True


class CapturePaymentForm(BasePaymentForm):

    clean_error = pgettext_lazy(
        'Payment form error',
        'Only pre-authorized payments can be captured')

    def clean(self):
        if not self.payment.can_capture():
            raise forms.ValidationError(self.clean_error)

    def capture(self):
        return self.try_payment_action(gateway_capture)


class RefundPaymentForm(BasePaymentForm):

    clean_error = pgettext_lazy(
        'Payment form error',
        'Only confirmed payments can be refunded')

    def clean(self):
        if not self.payment.can_refund():
            raise forms.ValidationError(self.clean_error)

        if self.payment.gateway == CustomPaymentChoices.MANUAL:
            raise forms.ValidationError(
                pgettext_lazy(
                    'Payment form error',
                    'Manual payments can not be refunded'))

    def refund(self):
        return self.try_payment_action(gateway_refund)


class VoidPaymentForm(BasePaymentForm):

    clean_error = pgettext_lazy(
        'Payment form error',
        'Only pre-authorized payments can be voided')

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.payment = kwargs.pop('payment')
        # The amount field is popped out
        # since there is no amount argument for void operation
        self.fields.pop('amount')

    def clean(self):
        if not self.payment.can_void():
            raise forms.ValidationError(self.clean_error)

    def void(self):
        try:
            gateway_void(self.payment)
        except (PaymentError, ValueError) as e:
            self.payment_error(str(e))
            return False
        return True


class TaskMarkAsPaidForm(forms.Form):
    """Mark task as manually paid."""

    def __init__(self, *args, **kwargs):
        self.task = kwargs.pop('task')
        self.user = kwargs.pop('user')
        super().__init__(*args, **kwargs)

    def clean(self):
        super().clean()
        try:
            clean_mark_task_as_paid(self.task)
        except PaymentError as e:
            raise forms.ValidationError(str(e))

    def save(self):
        mark_task_as_paid(self.task, self.user)


class CancelTaskLineForm(forms.Form):

    def __init__(self, *args, **kwargs):
        self.line = kwargs.pop('line')
        super().__init__(*args, **kwargs)

    def cancel_line(self):
        if self.line.variant and self.line.variant.track_inventory:
            deallocate_availability(self.line.variant, self.line.quantity)
        task = self.line.task
        delete_task_line(self.line)
        recalculate_order(task)


class ChangeQuantityForm(forms.ModelForm):
    quantity = QuantityField(
        validators=[MinValueValidator(1)],
        label=pgettext_lazy('Integer number', 'Quantity'))

    class Meta:
        model = TaskLine
        fields = ['quantity']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.initial_quantity = self.instance.quantity
        self.fields['quantity'].initial = self.initial_quantity

    def clean_quantity(self):
        quantity = self.cleaned_data['quantity']
        delta = quantity - self.initial_quantity
        variant = self.instance.variant
        if variant and delta > variant.quantity_available:
            raise forms.ValidationError(
                npgettext_lazy(
                    'Change quantity form error',
                    'Only %(remaining)d remaining in availability.',
                    'Only %(remaining)d remaining in availability.',
                    number='remaining') % {
                        'remaining': (
                            self.initial_quantity + variant.quantity_available)})  # noqa
        return quantity

    def save(self):
        quantity = self.cleaned_data['quantity']
        variant = self.instance.variant
        if variant and variant.track_inventory:
            # update availability allocation
            delta = quantity - self.initial_quantity
            allocate_availability(variant, delta)
        change_task_line_quantity(self.instance, quantity)
        recalculate_order(self.instance.task)
        return self.instance


class CancelTaskForm(forms.Form):
    """Allow canceling an entire task.

    Deallocate or increase corresponding availabilitys for each task line.
    """

    reavail = forms.BooleanField(initial=True, required=False)

    def __init__(self, *args, **kwargs):
        self.task = kwargs.pop('task')
        super().__init__(*args, **kwargs)
        self.fields['reavail'].label = npgettext_lazy(
            'Cancel task form action',
            'Reavail %(quantity)d item',
            'Reavail %(quantity)d items',
            number='quantity') % {'quantity': self.task.get_total_quantity()}

    def clean(self):
        data = super().clean()
        if not self.task.can_cancel():
            raise forms.ValidationError(
                pgettext_lazy(
                    'Cancel task form error',
                    "This task can't be canceled"))
        return data

    def cancel_order(self):
        cancel_order(self.task, self.cleaned_data.get('reavail'))


class CancelFulfillmentForm(forms.Form):
    """Allow canceling an entire fulfillment.

    Increase corresponding availabilitys for each fulfillment line.
    """

    reavail = forms.BooleanField(initial=True, required=False)

    def __init__(self, *args, **kwargs):
        self.fulfillment = kwargs.pop('fulfillment')
        super().__init__(*args, **kwargs)
        self.fields['reavail'].label = npgettext_lazy(
            'Cancel fulfillment form action',
            'Reavail %(quantity)d item',
            'Reavail %(quantity)d items',
            number='quantity') % {'quantity': self.fulfillment.get_total_quantity()}

    def clean(self):
        data = super().clean()
        if not self.fulfillment.can_edit():
            raise forms.ValidationError(
                pgettext_lazy(
                    'Cancel fulfillment form error',
                    'This fulfillment can\'t be canceled'))
        return data

    def cancel_fulfillment(self):
        cancel_fulfillment(self.fulfillment, self.cleaned_data.get('reavail'))


class FulfillmentTrackingNumberForm(forms.ModelForm):
    """Update tracking number in fulfillment group."""

    send_mail = forms.BooleanField(
        initial=True, required=False, label=pgettext_lazy(
            'Send mail to customer',
            'Send notification email to customer'))

    class Meta:
        model = Fulfillment
        fields = ['tracking_number']
        labels = {
            'tracking_number': pgettext_lazy(
                'Fulfillment record', 'Tracking number')}

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if not self.instance.task.get_user_current_email():
            self.fields.pop('send_mail')


class TaskRemoveVoucherForm(forms.ModelForm):
    """Remove voucher from task. Decrease usage and recalculate task."""

    class Meta:
        model = Task
        fields = []

    def clean(self):
        data = super().clean()
        if not self.instance.voucher:
            raise forms.ValidationError(
                pgettext_lazy(
                    'Remove voucher form error',
                    'This task has no voucher'))
        return data

    def remove_voucher(self):
        decrease_voucher_usage(self.instance.voucher)
        self.instance.discount_amount = 0
        self.instance.discount_name = ''
        self.instance.translated_discount_name = ''
        self.instance.voucher = None
        recalculate_order(self.instance)


PAYMENT_STATUS_CHOICES = (
    [('', pgettext_lazy('Payment status field value', 'All'))] +
    ChargeStatus.CHOICES)


class PaymentFilterForm(forms.Form):
    status = forms.ChoiceField(choices=PAYMENT_STATUS_CHOICES)


class AddVariantToTaskForm(forms.Form):
    """Allow adding lines with given quantity to an task."""

    variant = AjaxSelect2ChoiceField(
        queryset=SkillVariant.objects.filter(
            skill__in=Skill.objects.published()),
        fetch_data_url=reverse_lazy('dashboard:ajax-available-variants'),
        label=pgettext_lazy(
            'Task form: subform to add variant to task form: variant field',
            'Variant'))
    quantity = QuantityField(
        label=pgettext_lazy(
            'Add variant to task form label', 'Quantity'),
        validators=[MinValueValidator(1)])

    def __init__(self, *args, **kwargs):
        self.task = kwargs.pop('task')
        self.discounts = kwargs.pop('discounts')
        self.taxes = kwargs.pop('taxes')
        super().__init__(*args, **kwargs)

    def clean(self):
        """Check if given quantity is available in availabilitys."""
        cleaned_data = super().clean()
        variant = cleaned_data.get('variant')
        quantity = cleaned_data.get('quantity')
        if variant and quantity is not None:
            try:
                variant.check_quantity(quantity)
            except InsufficientStock as e:
                error = forms.ValidationError(
                    pgettext_lazy(
                        'Add item form error',
                        'Could not add item. '
                        'Only %(remaining)d remaining in availability.' %
                        {'remaining': e.item.quantity_available}))
                self.add_error('quantity', error)
        return cleaned_data

    def save(self):
        """Add variant to task.

        Updates availabilitys and task.
        """
        variant = self.cleaned_data.get('variant')
        quantity = self.cleaned_data.get('quantity')
        add_variant_to_order(
            self.task, variant, quantity, self.discounts, self.taxes)
        recalculate_order(self.task)


class AddressForm(StorefrontAddressForm):
    phone = PossiblePhoneNumberFormField(
        widget=PhonePrefixWidget, required=False,
        label=pgettext_lazy(
            'Task form: address subform - phone number input field',
            'Phone number'))


class FulfillmentForm(forms.ModelForm):
    """Create fulfillment group for a given task."""

    send_mail = forms.BooleanField(
        initial=True, required=False, label=pgettext_lazy(
            'Send mail to customer',
            'Send shipment details to your customer now'))

    class Meta:
        model = Fulfillment
        fields = ['tracking_number']
        labels = {
            'tracking_number': pgettext_lazy(
                'Task tracking number',
                'Tracking number')}

    def __init__(self, *args, **kwargs):
        task = kwargs.pop('task')
        super().__init__(*args, **kwargs)
        self.instance.task = task
        if not task.get_user_current_email():
            self.fields.pop('send_mail')


class BaseFulfillmentLineFormSet(forms.BaseModelFormSet):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for form in self.forms:
            form.empty_permitted = False

    def clean(self):
        total_quantity = sum(
            form.cleaned_data.get('quantity', 0) for form in self.forms)
        if total_quantity <= 0:
            raise forms.ValidationError(
                'Total quantity must be larger than 0.')


class FulfillmentLineForm(forms.ModelForm):
    """Fulfill task line with given quantity by decreasing availability."""

    class Meta:
        model = FulfillmentLine
        fields = ['task_line', 'quantity']

    def clean_quantity(self):
        quantity = self.cleaned_data.get('quantity')
        task_line = self.cleaned_data.get('task_line')
        if quantity > task_line.quantity_unfulfilled:
            raise forms.ValidationError(npgettext_lazy(
                'Fulfill task line form error',
                '%(quantity)d item remaining to fulfill.',
                '%(quantity)d items remaining to fulfill.',
                number='quantity') % {
                    'quantity': task_line.quantity_unfulfilled,
                    'task_line': task_line})
        return quantity

    def save(self, commit=True):
        fulfill_task_line(self.instance.task_line, self.instance.quantity)
        return super().save(commit)
