import graphene

from ...delivery import DeliveryMethodType

DeliveryMethodTypeEnum = graphene.Enum(
    'DeliveryMethodTypeEnum',
    [(code.upper(), code) for code, name in DeliveryMethodType.CHOICES])
