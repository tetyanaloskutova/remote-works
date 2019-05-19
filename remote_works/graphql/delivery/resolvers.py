import graphene_django_optimizer as gql_optimizer

from ...delivery import models


def resolve_delivery_zones(info):
    qs = models.DeliveryZone.objects.all()
    return gql_optimizer.query(qs, info)
