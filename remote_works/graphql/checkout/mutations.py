from datetime import date

import graphene
from django.db import transaction

from ...checkout import models
from ...checkout.utils import (
    add_variant_to_cart, add_voucher_to_cart, change_billing_address_in_cart,
    change_delivery_address_in_cart, create_order, get_or_create_user_cart,
    get_taxes_for_cart, get_voucher_for_cart, ready_to_place_order,
    recalculate_cart_discount, remove_voucher_from_cart)
from ...core import analytics
from ...core.exceptions import InsufficientStock
from ...core.utils.taxes import get_taxes_for_address
from ...discount import models as voucher_model
from ...task import TaskEvents, TaskEventsEmails
from ...task.emails import send_order_confirmation
from ...payment import PaymentError
from ...payment.utils import gateway_process_payment
from ...delivery.models import DeliveryMethod as DeliveryMethodModel
from ..account.i18n import I18nMixin
from ..account.types import AddressInput, User
from ..core.mutations import BaseMutation, ModelMutation
from ..core.types.common import Error
from ..task.types import Task
from ..skill.types import SkillVariant
from ..delivery.types import DeliveryMethod
from .types import Checkout, CheckoutLine


def clean_delivery_method(
        checkout, method, errors, discounts, taxes, country_code=None,
        remove=True):
    # FIXME Add tests for this function
    if not method:
        return errors
    if not checkout.is_delivery_required():
        errors.append(
            Error(
                field='checkout',
                message='This checkout does not requires delivery.'))
    if not checkout.delivery_address:
        errors.append(
            Error(
                field='checkout',
                message=(
                    'Cannot choose a delivery method for a '
                    'checkout without the delivery address.')))
        return errors
    valid_methods = (
        DeliveryMethodModel.objects.applicable_delivery_methods(
            price=checkout.get_subtotal(discounts, taxes).gross.amount,
            weight=checkout.get_total_weight(),
            country_code=country_code or checkout.delivery_address.country.code
        ))
    valid_methods = valid_methods.values_list('id', flat=True)
    if method.pk not in valid_methods and not remove:
        errors.append(
            Error(
                field='deliveryMethod',
                message='Delivery method cannot be used with this checkout.'))
    if remove:
        checkout.delivery_method = None
        checkout.save(update_fields=['delivery_method'])
    return errors


def check_lines_quantity(variants, quantities):
    """Check if availability is sufficient for each line in the list of dicts.
    Return list of errors.
    """
    errors = []
    for variant, quantity in zip(variants, quantities):
        try:
            variant.check_quantity(quantity)
        except InsufficientStock as e:
            message = (
                'Could not add item '
                + '%(item_name)s. Only %(remaining)d remaining in availability.' % {
                    'remaining': e.item.quantity_available,
                    'item_name': e.item.display_skill()})
            errors.append(('quantity', message))
    return errors


class CheckoutLineInput(graphene.InputObjectType):
    quantity = graphene.Int(
        required=True, description='The number of items purchased.')
    variant_id = graphene.ID(
        required=True, description='ID of the SkillVariant.')


class CheckoutCreateInput(graphene.InputObjectType):
    lines = graphene.List(
        CheckoutLineInput,
        description=(
            'A list of checkout lines, each containing information about '
            'an item in the checkout.'), required=True)
    email = graphene.String(
        description='The customer\'s email address.')
    delivery_address = AddressInput(
        description=(
            'The mailling address to where the checkout will be shipped.'))
    billing_address = AddressInput(
        description='Billing address of the customer.')


class CheckoutCreate(ModelMutation, I18nMixin):
    class Arguments:
        input = CheckoutCreateInput(
            required=True, description='Fields required to create checkout.')

    class Meta:
        description = 'Create a new checkout.'
        model = models.Cart
        return_field_name = 'checkout'

    @classmethod
    def clean_input(cls, info, instance, input, errors):
        cleaned_input = super().clean_input(info, instance, input, errors)
        user = info.context.user
        lines = input.pop('lines', None)
        if lines:
            variant_ids = [line.get('variant_id') for line in lines]
            variants = cls.get_nodes_or_error(
                ids=variant_ids, errors=errors, field='variant_id',
                only_type=SkillVariant)
            quantities = [line.get('quantity') for line in lines]
            if not errors:
                line_errors = check_lines_quantity(variants, quantities)
                if line_errors:
                    for err in line_errors:
                        cls.add_error(errors, field=err[0], message=err[1])
                else:
                    cleaned_input['variants'] = variants
                    cleaned_input['quantities'] = quantities

        default_delivery_address = None
        default_billing_address = None
        if user.is_authenticated:
            default_billing_address = user.default_billing_address
            default_delivery_address = user.default_delivery_address

        if 'delivery_address' in input:
            delivery_address, errors = cls.validate_address(
                input['delivery_address'], errors)
            cleaned_input['delivery_address'] = delivery_address
        else:
            cleaned_input['delivery_address'] = default_delivery_address

        if 'billing_address' in input:
            billing_address, errors = cls.validate_address(
                input['billing_address'], errors)
            cleaned_input['billing_address'] = billing_address
        else:
            cleaned_input['billing_address'] = default_billing_address

        # Use authenticated user's email as default email
        if user.is_authenticated:
            email = input.pop('email', None)
            cleaned_input['email'] = email or user.email

        return cleaned_input

    @classmethod
    def save(cls, info, instance, cleaned_input):
        delivery_address = cleaned_input.get('delivery_address')
        billing_address = cleaned_input.get('billing_address')
        if delivery_address:
            delivery_address.save()
            instance.delivery_address = delivery_address
        if billing_address:
            billing_address.save()
            instance.billing_address = billing_address

        instance.save()

        variants = cleaned_input.get('variants')
        quantities = cleaned_input.get('quantities')
        if variants and quantities:
            for variant, quantity in zip(variants, quantities):
                add_variant_to_cart(instance, variant, quantity)

    @classmethod
    def mutate(cls, root, info, input):
        errors = []
        user = info.context.user

        # `mutate` method is overriden to properly get or create a checkout
        # instance here:
        if user.is_authenticated:
            checkout, created = get_or_create_user_cart(user)
            # If user has an active checkout, return it without any
            # modifications.
            if not created:
                return CheckoutCreate(checkout=checkout, errors=errors)
        else:
            checkout = models.Cart()

        cleaned_input = cls.clean_input(info, checkout, input, errors)
        checkout = cls.construct_instance(checkout, cleaned_input)
        cls.clean_instance(checkout, errors)
        if errors:
            return CheckoutCreate(errors=errors)
        cls.save(info, checkout, cleaned_input)
        cls._save_m2m(info, checkout, cleaned_input)
        return CheckoutCreate(checkout=checkout, errors=errors)


class CheckoutLinesAdd(BaseMutation):
    checkout = graphene.Field(Checkout, description='An updated Checkout.')

    class Arguments:
        checkout_id = graphene.ID(
            description='The ID of the Checkout.', required=True)
        lines = graphene.List(
            CheckoutLineInput,
            required=True,
            description=(
                'A list of checkout lines, each containing information about '
                'an item in the checkout.'))

    class Meta:
        description = 'Adds a checkout line to the existing checkout.'

    @classmethod
    def mutate(cls, root, info, checkout_id, lines, replace=False):
        errors = []
        checkout = cls.get_node_or_error(
            info, checkout_id, errors, 'checkout_id', only_type=Checkout)
        if checkout is None:
            return CheckoutLinesAdd(errors=errors)

        variants, quantities = None, None
        if lines:
            variant_ids = [line.get('variant_id') for line in lines]
            variants = cls.get_nodes_or_error(
                ids=variant_ids, errors=errors, field='variant_id',
                only_type=SkillVariant)
            quantities = [line.get('quantity') for line in lines]
            if not errors:
                line_errors = check_lines_quantity(variants, quantities)
                if line_errors:
                    for err in line_errors:
                        cls.add_error(errors, field=err[0], message=err[1])

        # FIXME test if below function is called
        clean_delivery_method(
            checkout=checkout, method=checkout.delivery_method,
            errors=errors, discounts=info.context.discounts,
            taxes=get_taxes_for_address(checkout.delivery_address))

        if errors:
            return CheckoutLinesAdd(errors=errors)

        if variants and quantities:
            for variant, quantity in zip(variants, quantities):
                add_variant_to_cart(
                    checkout, variant, quantity, replace=replace)

        recalculate_cart_discount(
            checkout, info.context.discounts, info.context.taxes)

        return CheckoutLinesAdd(checkout=checkout, errors=errors)


class CheckoutLinesUpdate(CheckoutLinesAdd):
    checkout = graphene.Field(Checkout, description='An updated Checkout.')

    class Meta:
        description = 'Updates CheckoutLine in the existing Checkout.'

    @classmethod
    def mutate(cls, root, info, checkout_id, lines):
        return super().mutate(root, info, checkout_id, lines, replace=True)


class CheckoutLineDelete(BaseMutation):
    checkout = graphene.Field(Checkout, description='An updated checkout.')

    class Arguments:
        checkout_id = graphene.ID(
            description='The ID of the Checkout.', required=True)
        line_id = graphene.ID(
            description='ID of the CheckoutLine to delete.')

    class Meta:
        description = 'Deletes a CheckoutLine.'

    @classmethod
    def mutate(cls, root, info, checkout_id, line_id):
        errors = []
        checkout = cls.get_node_or_error(
            info, checkout_id, errors, 'checkout_id', only_type=Checkout)
        line = cls.get_node_or_error(
            info, line_id, errors, 'line_id', only_type=CheckoutLine)

        if checkout is None or line is None:
            return CheckoutLineDelete(errors=errors)

        if line and line in checkout.lines.all():
            line.delete()

        # FIXME test if below function is called
        clean_delivery_method(
            checkout=checkout, method=checkout.delivery_method, errors=errors,
            discounts=info.context.discounts,
            taxes=get_taxes_for_address(checkout.delivery_address))
        if errors:
            return CheckoutLineDelete(errors=errors)

        recalculate_cart_discount(
            checkout, info.context.discounts, info.context.taxes)

        return CheckoutLineDelete(checkout=checkout, errors=errors)


class CheckoutCustomerAttach(BaseMutation):
    checkout = graphene.Field(Checkout, description='An updated checkout.')

    class Arguments:
        checkout_id = graphene.ID(
            required=True, description='ID of the Checkout.')
        customer_id = graphene.ID(
            required=True, description='The ID of the customer.')

    class Meta:
        description = 'Sets the customer as the owner of the Checkout.'

    @classmethod
    def mutate(cls, root, info, checkout_id, customer_id):
        errors = []
        checkout = cls.get_node_or_error(
            info, checkout_id, errors, 'checkout_id', only_type=Checkout)
        customer = cls.get_node_or_error(
            info, customer_id, errors, 'customer_id', only_type=User)
        if checkout is not None and customer:
            checkout.user = customer
            checkout.save(update_fields=['user'])
        return CheckoutCustomerAttach(checkout=checkout, errors=errors)


class CheckoutCustomerDetach(BaseMutation):
    checkout = graphene.Field(Checkout, description='An updated checkout')

    class Arguments:
        checkout_id = graphene.ID(description='Checkout ID', required=True)

    class Meta:
        description = 'Removes the user assigned as the owner of the checkout.'

    @classmethod
    def mutate(cls, root, info, checkout_id):
        errors = []
        checkout = cls.get_node_or_error(
            info, checkout_id, errors, 'checkout_id', only_type=Checkout)
        if checkout is not None and not checkout.user:
            cls.add_error(
                errors, field=None,
                message='There\'s no customer assigned to this Checkout.')
        if errors:
            return CheckoutCustomerDetach(errors=errors)

        checkout.user = None
        checkout.save(update_fields=['user'])
        return CheckoutCustomerDetach(checkout=checkout)


class CheckoutDeliveryAddressUpdate(BaseMutation, I18nMixin):
    checkout = graphene.Field(Checkout, description='An updated checkout')

    class Arguments:
        checkout_id = graphene.ID(description='ID of the Checkout.')
        delivery_address = AddressInput(
            description=(
                'The mailling address to where the checkout will be shipped.'))

    class Meta:
        description = 'Update delivery address in the existing Checkout.'

    @classmethod
    def mutate(cls, root, info, checkout_id, delivery_address):
        errors = []
        checkout = cls.get_node_or_error(
            info, checkout_id, errors, 'checkout_id', only_type=Checkout)

        if checkout is not None and delivery_address:
            delivery_address, errors = cls.validate_address(
                delivery_address, errors, instance=checkout.delivery_address)
            # FIXME test if below function is called
            clean_delivery_method(
                checkout, checkout.delivery_method, errors,
                info.context.discounts,
                get_taxes_for_address(delivery_address))
            if not errors:
                with transaction.atomic():
                    delivery_address.save()
                    change_delivery_address_in_cart(checkout, delivery_address)
                recalculate_cart_discount(
                    checkout, info.context.discounts, info.context.taxes)

        return CheckoutDeliveryAddressUpdate(checkout=checkout, errors=errors)


class CheckoutBillingAddressUpdate(CheckoutDeliveryAddressUpdate):
    checkout = graphene.Field(Checkout, description='An updated checkout')

    class Arguments:
        checkout_id = graphene.ID(description='ID of the Checkout.')
        billing_address = AddressInput(
            description=(
                'The billing address of the checkout.'))

    class Meta:
        description = 'Update billing address in the existing Checkout.'

    @classmethod
    def mutate(cls, root, info, checkout_id, billing_address):
        errors = []
        checkout = cls.get_node_or_error(
            info, checkout_id, errors, 'checkout_id', only_type=Checkout)

        if checkout is not None and billing_address:
            billing_address, errors = cls.validate_address(
                billing_address, errors, instance=checkout.billing_address)
            if not errors:
                with transaction.atomic():
                    billing_address.save()
                    change_billing_address_in_cart(checkout, billing_address)
        return CheckoutDeliveryAddressUpdate(checkout=checkout, errors=errors)


class CheckoutEmailUpdate(BaseMutation):
    checkout = graphene.Field(Checkout, description='An updated checkout')

    class Arguments:
        checkout_id = graphene.ID(description='Checkout ID')
        email = graphene.String(required=True, description='email')

    class Meta:
        description = 'Updates email address in the existing Checkout object.'

    @classmethod
    def mutate(cls, root, info, checkout_id, email):
        errors = []
        checkout = cls.get_node_or_error(
            info, checkout_id, errors, 'checkout_id', only_type=Checkout)
        if checkout is not None:
            checkout.email = email
            cls.clean_instance(checkout, errors)
            if errors:
                return CheckoutEmailUpdate(errors=errors)
            checkout.save(update_fields=['email'])

        return CheckoutEmailUpdate(checkout=checkout, errors=errors)


class CheckoutDeliveryMethodUpdate(BaseMutation):
    checkout = graphene.Field(Checkout, description='An updated checkout')

    class Arguments:
        checkout_id = graphene.ID(description='Checkout ID')
        delivery_method_id = graphene.ID(
            required=True, description='Delivery method')

    class Meta:
        description = 'Updates the delivery address of the checkout.'

    @classmethod
    def mutate(cls, root, info, checkout_id, delivery_method_id):
        errors = []
        checkout = cls.get_node_or_error(
            info, checkout_id, errors, 'checkout_id', only_type=Checkout)
        delivery_method = cls.get_node_or_error(
            info, delivery_method_id, errors, 'delivery_method_id',
            only_type=DeliveryMethod)

        if checkout is not None and delivery_method:
            clean_delivery_method(
                checkout, delivery_method, errors, info.context.discounts,
                info.context.taxes, remove=False)

        if not errors:
            checkout.delivery_method = delivery_method
            checkout.save(update_fields=['delivery_method'])
            recalculate_cart_discount(
                checkout, info.context.discounts, info.context.taxes)

        return CheckoutDeliveryMethodUpdate(checkout=checkout, errors=errors)


class CheckoutComplete(BaseMutation):
    task = graphene.Field(Task, description='Placed task')

    class Arguments:
        checkout_id = graphene.ID(description='Checkout ID', required=True)

    class Meta:
        description = (
            'Completes the checkout. As a result a new task is created and '
            'a payment charge is made. This action requires a successful '
            'payment before it can be performed.')

    @classmethod
    def mutate(cls, root, info, checkout_id):
        errors = []
        checkout = cls.get_node_or_error(
            info, checkout_id, errors, 'checkout_id', only_type=Checkout)
        if checkout is None:
            return CheckoutComplete(errors=errors)

        taxes = get_taxes_for_cart(checkout, info.context.taxes)
        ready, checkout_error = ready_to_place_order(
            checkout, taxes, info.context.discounts)
        if not ready:
            cls.add_error(
                field=None, message=checkout_error, errors=errors)
            return CheckoutComplete(errors=errors)

        try:
            task = create_order(
                cart=checkout,
                tracking_code=analytics.get_client_id(info.context),
                discounts=info.context.discounts, taxes=taxes)
        except InsufficientStock:
            cls.add_error(
                field=None, message='Insufficient skill availability.',
                errors=errors)
            return CheckoutComplete(errors=errors)
        except voucher_model.NotApplicable:
            cls.add_error(
                field=None, message='Voucher not applicable', errors=errors)
            return CheckoutComplete(errors=errors)

        payment = checkout.get_last_active_payment()

        # remove cart after checkout is created
        checkout.delete()
        task.events.create(type=TaskEvents.PLACED.value)
        send_order_confirmation.delay(task.pk)
        task.events.create(
            type=TaskEvents.EMAIL_SENT.value,
            parameters={
                'email': task.get_user_current_email(),
                'email_type': TaskEventsEmails.ORDER.value})

        try:
            gateway_process_payment(
                payment=payment, payment_token=payment.token)
        except PaymentError as e:
            cls.add_error(errors=errors, field=None, message=str(e))
        return CheckoutComplete(task=task, errors=errors)


class CheckoutUpdateVoucher(BaseMutation):
    checkout = graphene.Field(
        Checkout, description='An checkout with updated voucher')

    class Arguments:
        checkout_id = graphene.ID(description='Checkout ID', required=True)
        voucher_code = graphene.String(description='Voucher code')

    class Meta:
        description = (
            'Adds voucher to the checkout. '
            'Query it without voucher_code field to '
            'remove voucher from checkout.')

    @classmethod
    def mutate(cls, root, info, checkout_id, voucher_code=None):
        errors = []
        checkout = cls.get_node_or_error(
            info, checkout_id, errors, 'checkout_id', only_type=Checkout)
        if checkout is None:
            return CheckoutUpdateVoucher(errors=errors)

        if voucher_code:
            try:
                voucher = voucher_model.Voucher.objects.active(
                    date=date.today()).get(code=voucher_code)
            except voucher_model.Voucher.DoesNotExist:
                cls.add_error(
                    errors=errors,
                    field='voucher_code',
                    message='Voucher with given code does not exist.')
                return CheckoutUpdateVoucher(errors=errors)

            try:
                add_voucher_to_cart(voucher, checkout)
            except voucher_model.NotApplicable:
                cls.add_error(
                    errors=errors,
                    field='voucher_code',
                    message='Voucher is not applicable to that checkout.')
                return CheckoutUpdateVoucher(errors=errors)

        else:
            existing_voucher = get_voucher_for_cart(checkout)
            if existing_voucher:
                remove_voucher_from_cart(checkout)

        return CheckoutUpdateVoucher(checkout=checkout, errors=errors)
