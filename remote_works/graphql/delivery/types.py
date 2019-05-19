from textwrap import dedent

import graphene
import graphene_django_optimizer as gql_optimizer
from graphene import relay

from ...delivery import models
from ..core.connection import CountableDjangoObjectType
from ..core.types import CountryDisplay, MoneyRange
from ..translations.resolvers import resolve_translation
from ..translations.types import DeliveryMethodTranslation
from .enums import DeliveryMethodTypeEnum


class DeliveryMethod(CountableDjangoObjectType):
    type = DeliveryMethodTypeEnum(description='Type of the delivery method.')
    translation = graphene.Field(
        DeliveryMethodTranslation,
        language_code=graphene.String(
            description='A language code to return the translation for.',
            required=True),
        description=(
            'Returns translated Delivery Method fields '
            'for the given language code.'),
        resolver=resolve_translation)

    class Meta:
        description = dedent("""
            Delivery method are the methods you'll use to get
            customer's tasks to them.
            They are directly exposed to the customers.""")
        model = models.DeliveryMethod
        interfaces = [relay.Node]
        exclude_fields = ['carts', 'delivery_zone', 'tasks', 'translations']


class DeliveryZone(CountableDjangoObjectType):
    price_range = graphene.Field(
        MoneyRange, description='Lowest and highest prices for the delivery.')
    countries = graphene.List(
        CountryDisplay,
        description='List of countries available for the method.')
    delivery_methods = gql_optimizer.field(
        graphene.List(
            DeliveryMethod,
            description=(
                'List of delivery methods available for tasks'
                ' shipped to countries within this delivery zone.')),
        model_field='delivery_methods')

    class Meta:
        description = dedent("""
            Represents a delivery zone in the shop. Zones are the concept
            used only for grouping delivery methods in the dashboard,
            and are never exposed to the customers directly.""")
        model = models.DeliveryZone
        interfaces = [relay.Node]

    def resolve_price_range(self, info):
        return self.price_range

    def resolve_countries(self, info):
        return [
            CountryDisplay(code=country.code, country=country.name)
            for country in self.countries]

    def resolve_delivery_methods(self, info):
        return self.delivery_methods.all()
