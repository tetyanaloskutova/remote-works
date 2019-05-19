import graphene_django_optimizer as gql_optimizer

from ...skill import models as skill_models
from ...delivery import models as delivery_models


def resolve_translation(instance, info, language_code):
    """Gets translation object from instance based on language code."""
    return instance.translations.filter(language_code=language_code).first()


def resolve_delivery_methods(info):
    qs = delivery_models.DeliveryMethod.objects.all()
    return gql_optimizer.query(qs, info)


def resolve_attribute_values(info):
    qs = skill_models.AttributeValue.objects.all()
    return gql_optimizer.query(qs, info)
