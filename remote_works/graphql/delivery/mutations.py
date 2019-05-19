from textwrap import dedent

import graphene

from ...dashboard.delivery.forms import default_delivery_zone_exists
from ...delivery import models
from ..core.mutations import ModelDeleteMutation, ModelMutation
from ..core.scalars import Decimal, WeightScalar
from .enums import DeliveryMethodTypeEnum
from .types import DeliveryZone


class DeliveryPriceInput(graphene.InputObjectType):
    name = graphene.String(
        description='Name of the delivery method. Visible to customers')
    price = Decimal(description='Delivery price of the delivery method.')
    minimum_order_price = Decimal(
        description='Minimum task price to use this delivery method',
        required=False)
    maximum_order_price = Decimal(
        description='Maximum task price to use this delivery method',
        required=False)
    minimum_order_weight = WeightScalar(
        description='Minimum task weight to use this delivery method',
        required=False)
    maximum_order_weight = WeightScalar(
        description='Maximum task weight to use this delivery method',
        required=False)
    type = DeliveryMethodTypeEnum(
        description='Delivery type: price or weight based.')
    delivery_zone = graphene.ID(
        description='Delivery zone this method belongs to.',
        name='deliveryZone')


class DeliveryZoneInput(graphene.InputObjectType):
    name = graphene.String(
        description='Delivery zone\'s name. Visible only to the staff.')
    countries = graphene.List(
        graphene.String,
        description='List of countries in this delivery zone.')
    default = graphene.Boolean(
        description=dedent("""
            Is default delivery zone, that will be used
            for countries not covered by other zones."""))


class DeliveryZoneMixin:

    @classmethod
    def clean_input(cls, info, instance, input, errors):
        cleaned_input = super().clean_input(info, instance, input, errors)
        default = cleaned_input.get('default')
        if default is not None:
            if default_delivery_zone_exists(instance.pk):
                cls.add_error(
                    errors, 'default', 'Default delivery zone already exists.')
            elif cleaned_input.get('countries'):
                cleaned_input['countries'] = []
        else:
            cleaned_input['default'] = False
        return cleaned_input


class DeliveryZoneCreate(DeliveryZoneMixin, ModelMutation):
    delivery_zone = graphene.Field(
        DeliveryZone, description='Created delivery zone.')

    class Arguments:
        input = DeliveryZoneInput(
            description='Fields required to create a delivery zone.',
            required=True)

    class Meta:
        description = 'Creates a new delivery zone.'
        model = models.DeliveryZone

    @classmethod
    def user_is_allowed(cls, user, input):
        return user.has_perm('delivery.manage_delivery')


class DeliveryZoneUpdate(DeliveryZoneMixin, ModelMutation):
    delivery_zone = graphene.Field(
        DeliveryZone, description='Updated delivery zone.')

    class Arguments:
        id = graphene.ID(
            description='ID of a delivery zone to update.', required=True)
        input = DeliveryZoneInput(
            description='Fields required to update a delivery zone.',
            required=True)

    class Meta:
        description = 'Updates a new delivery zone.'
        model = models.DeliveryZone

    @classmethod
    def user_is_allowed(cls, user, input):
        return user.has_perm('delivery.manage_delivery')


class DeliveryZoneDelete(ModelDeleteMutation):
    class Arguments:
        id = graphene.ID(
            required=True, description='ID of a delivery zone to delete.')

    class Meta:
        description = 'Deletes a delivery zone.'
        model = models.DeliveryZone

    @classmethod
    def user_is_allowed(cls, user, input):
        return user.has_perm('delivery.manage_delivery')


class DeliveryPriceMixin:

    @classmethod
    def clean_input(cls, info, instance, input, errors):
        cleaned_input = super().clean_input(info, instance, input, errors)
        type = cleaned_input.get('type')
        if not type:
            return cleaned_input

        if type == DeliveryMethodTypeEnum.PRICE.value:
            min_price = cleaned_input.get('minimum_order_price')
            max_price = cleaned_input.get('maximum_order_price')
            if min_price is None:
                cls.add_error(
                    errors, 'minimum_order_price',
                    'Minimum task price is required'
                    ' for Price Based delivery.')
            elif max_price is not None and max_price <= min_price:
                cls.add_error(
                    errors, 'maximum_order_price',
                    'Maximum task price should be larger than the minimum.')
        else:
            min_weight = cleaned_input.get('minimum_order_weight')
            max_weight = cleaned_input.get('maximum_order_weight')
            if min_weight is None:
                cls.add_error(
                    errors, 'minimum_order_weight',
                    'Minimum task weight is required for'
                    ' Weight Based delivery.')
            elif max_weight is not None and max_weight <= min_weight:
                cls.add_error(
                    errors, 'maximum_order_weight',
                    'Maximum task weight should be larger than the minimum.')
        return cleaned_input


class DeliveryPriceCreate(DeliveryPriceMixin, ModelMutation):
    class Arguments:
        input = DeliveryPriceInput(
            description='Fields required to create a delivery price',
            required=True)

    class Meta:
        description = 'Creates a new delivery price.'
        model = models.DeliveryMethod

    @classmethod
    def user_is_allowed(cls, user, input):
        return user.has_perm('delivery.manage_delivery')


class DeliveryPriceUpdate(DeliveryPriceMixin, ModelMutation):
    class Arguments:
        id = graphene.ID(
            description='ID of a delivery price to update.', required=True)
        input = DeliveryPriceInput(
            description='Fields required to update a delivery price',
            required=True)

    class Meta:
        description = 'Updates a new delivery price.'
        model = models.DeliveryMethod

    @classmethod
    def user_is_allowed(cls, user, input):
        return user.has_perm('delivery.manage_delivery')


class DeliveryPriceDelete(ModelDeleteMutation):
    class Arguments:
        id = graphene.ID(
            required=True, description='ID of a delivery price to delete.')

    class Meta:
        description = 'Deletes a delivery price.'
        model = models.DeliveryMethod

    @classmethod
    def user_is_allowed(cls, user, input):
        return user.has_perm('delivery.manage_delivery')
