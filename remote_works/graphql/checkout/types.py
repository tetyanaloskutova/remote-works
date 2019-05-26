import graphene
import graphene_django_optimizer as gql_optimizer
from django.conf import settings

from ...checkout import models
from ...core.utils.taxes import get_taxes_for_address
from ..core.connection import CountableDjangoObjectType
from ..core.types.money import TaxedMoney
from ..task.utils import applicable_delivery_methods
from ..payment.enums import PaymentGatewayEnum
from ..delivery.types import DeliveryMethod


class CheckoutLine(CountableDjangoObjectType):
    total_price = graphene.Field(
        TaxedMoney,
        description=(
            'The sum of the checkout line price, taxes and discounts.'))
    requires_delivery = graphene.Boolean(
        description='Indicates whether the item need to be delivered.')

    class Meta:
        exclude_fields = ['cart', 'data']
        description = 'Represents an item in the checkout.'
        interfaces = [graphene.relay.Node]
        model = models.CartLine
        filter_fields = ['id']

    def resolve_total_price(self, info):
        taxes = get_taxes_for_address(self.cart.delivery_address)
        return self.get_total(discounts=info.context.discounts, taxes=taxes)

    def resolve_requires_delivery(self, info):
        return self.is_delivery_required()


class Checkout(CountableDjangoObjectType):
    available_delivery_methods = graphene.List(
        DeliveryMethod, required=True,
        description='Delivery methods that can be used with this task.')
    available_payment_gateways = graphene.List(
        PaymentGatewayEnum, description='List of available payment gateways.',
        required=True)
    email = graphene.String(description='Email of a customer', required=True)
    is_delivery_required = graphene.Boolean(
        description='Returns True, if checkout requires delivery.',
        required=True)
    lines = gql_optimizer.field(
        graphene.List(
            CheckoutLine, description=(
                'A list of checkout lines, each containing information about '
                'an item in the checkout.')),
        model_field='lines')
    delivery_price = graphene.Field(
        TaxedMoney,
        description='The price of the delivery, with all the taxes included.')
    subtotal_price = graphene.Field(
        TaxedMoney,
        description=(
            'The price of the checkout before delivery, with taxes included.'))
    total_price = graphene.Field(
        TaxedMoney,
        description=(
            'The sum of the the checkout line prices, with all the taxes,'
            'delivery costs, and discounts included.'))

    class Meta:
        exclude_fields = ['payments']
        description = 'Checkout object'
        model = models.Cart
        interfaces = [graphene.relay.Node]
        filter_fields = ['token']

    def resolve_total_price(self, info):
        taxes = get_taxes_for_address(self.delivery_address)
        return self.get_total(discounts=info.context.discounts, taxes=taxes)

    def resolve_subtotal_price(self, info):
        taxes = get_taxes_for_address(self.delivery_address)
        return self.get_subtotal(taxes=taxes)

    def resolve_delivery_price(self, info):
        taxes = get_taxes_for_address(self.delivery_address)
        return self.get_delivery_price(taxes=taxes)

    def resolve_lines(self, info):
        return self.lines.prefetch_related('variant')

    def resolve_available_delivery_methods(self, info):
        taxes = get_taxes_for_address(self.delivery_address)
        price = self.get_subtotal(
            taxes=taxes, discounts=info.context.discounts)
        return applicable_delivery_methods(self, info, price.gross.amount)

    def resolve_available_payment_gateways(self, info):
        return settings.CHECKOUT_PAYMENT_GATEWAYS.keys()

    def resolve_is_delivery_required(self, info):
        return self.is_delivery_required()
