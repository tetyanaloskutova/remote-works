import graphene
from graphql_jwt.decorators import permission_required

from ..core.fields import PrefetchingConnectionField
from ..translations.mutations import DeliveryPriceTranslate
from .mutations import (
    DeliveryPriceCreate, DeliveryPriceDelete, DeliveryPriceUpdate,
    DeliveryZoneCreate, DeliveryZoneDelete, DeliveryZoneUpdate)
from .resolvers import resolve_delivery_zones
from .types import DeliveryZone


class DeliveryQueries(graphene.ObjectType):
    delivery_zone = graphene.Field(
        DeliveryZone, id=graphene.Argument(graphene.ID, required=True),
        description='Lookup a delivery zone by ID.')
    delivery_zones = PrefetchingConnectionField(
        DeliveryZone, description='List of the shop\'s delivery zones.')

    @permission_required('delivery.manage_delivery')
    def resolve_delivery_zone(self, info, id):
        return graphene.Node.get_node_from_global_id(info, id, DeliveryZone)

    @permission_required('delivery.manage_delivery')
    def resolve_delivery_zones(self, info, **kwargs):
        return resolve_delivery_zones(info)


class DeliveryMutations(graphene.ObjectType):
    delivery_price_create = DeliveryPriceCreate.Field()
    delivery_price_delete = DeliveryPriceDelete.Field()
    delivery_price_update = DeliveryPriceUpdate.Field()
    delivery_price_translate = DeliveryPriceTranslate.Field()

    delivery_zone_create = DeliveryZoneCreate.Field()
    delivery_zone_delete = DeliveryZoneDelete.Field()
    delivery_zone_update = DeliveryZoneUpdate.Field()
