import graphene
import graphene_django_optimizer as gql_optimizer
from django.db.models import Q, Sum

from ...order import OrderStatus
from ...skill import models
from ...search.backends import picker
from ..utils import (
    filter_by_period, filter_by_query_param, get_database_id, get_nodes)
from .enums import StockAvailability
from .filters import (
    filter_skills_by_attributes, filter_skills_by_categories,
    filter_skills_by_collections, filter_skills_by_price, sort_qs)
from .types import Category, Collection, SkillVariant

SKILL_SEARCH_FIELDS = ('name', 'description')
CATEGORY_SEARCH_FIELDS = ('name', 'slug', 'description', 'parent__name')
COLLECTION_SEARCH_FIELDS = ('name', 'slug')
ATTRIBUTES_SEARCH_FIELDS = ('name', 'slug')


def _filter_attributes_by_skill_types(attribute_qs, skill_qs):
    skill_types = set(skill_qs.values_list('skill_type_id', flat=True))
    return attribute_qs.filter(
        Q(skill_type__in=skill_types)
        | Q(skill_variant_type__in=skill_types))


def resolve_attributes(info, category_id=None, collection_id=None, query=None):
    qs = models.Attribute.objects.all()
    qs = filter_by_query_param(qs, query, ATTRIBUTES_SEARCH_FIELDS)

    if category_id:
        # Filter attributes by skill types belonging to the given category.
        category = graphene.Node.get_node_from_global_id(
            info, category_id, Category)
        if category:
            tree = category.get_descendants(include_self=True)
            skill_qs = models.Skill.objects.filter(category__in=tree)
            qs = _filter_attributes_by_skill_types(qs, skill_qs)
        else:
            qs = qs.none()

    if collection_id:
        # Filter attributes by skill types belonging to the given collection.
        collection = graphene.Node.get_node_from_global_id(
            info, collection_id, Collection)
        if collection:
            skill_qs = collection.skills.all()
            qs = _filter_attributes_by_skill_types(qs, skill_qs)
        else:
            qs = qs.none()

    qs = qs.order_by('name')
    qs = qs.distinct()
    return gql_optimizer.query(qs, info)


def resolve_categories(info, query, level=None):
    qs = models.Category.objects.prefetch_related('children')
    if level is not None:
        qs = qs.filter(level=level)
    qs = filter_by_query_param(qs, query, CATEGORY_SEARCH_FIELDS)
    qs = qs.order_by('name')
    qs = qs.distinct()
    return gql_optimizer.query(qs, info)


def resolve_collections(info, query):
    user = info.context.user
    qs = models.Collection.objects.visible_to_user(user)
    qs = filter_by_query_param(qs, query, COLLECTION_SEARCH_FIELDS)
    qs = qs.order_by('name')
    return gql_optimizer.query(qs, info)


def resolve_skills(
        info, attributes=None, categories=None, collections=None,
        price_lte=None, price_gte=None, sort_by=None, stock_availability=None,
        query=None, **kwargs):

    user = info.context.user
    qs = models.Skill.objects.visible_to_user(user)

    if query:
        search = picker.pick_backend()
        qs &= search(query)

    if attributes:
        qs = filter_skills_by_attributes(qs, attributes)

    if categories:
        categories = get_nodes(categories, Category)
        qs = filter_skills_by_categories(qs, categories)

    if collections:
        collections = get_nodes(collections, Collection)
        qs = filter_skills_by_collections(qs, collections)

    if stock_availability:
        qs = qs.annotate(total_quantity=Sum('variants__quantity'))
        if stock_availability == StockAvailability.IN_STOCK:
            qs = qs.filter(total_quantity__gt=0)
        elif stock_availability == StockAvailability.OUT_OF_STOCK:
            qs = qs.filter(total_quantity__lte=0)

    qs = filter_skills_by_price(qs, price_lte, price_gte)
    qs = sort_qs(qs, sort_by)
    qs = qs.distinct()
    return gql_optimizer.query(qs, info)


def resolve_skill_types(info):
    qs = models.SkillType.objects.all()
    qs = qs.order_by('name')
    return gql_optimizer.query(qs, info)


def resolve_skill_variants(info, ids=None):
    user = info.context.user
    visible_skills = models.Skill.objects.visible_to_user(
        user).values_list('pk', flat=True)
    qs = models.SkillVariant.objects.filter(
        skill__id__in=visible_skills)
    if ids:
        db_ids = [
            get_database_id(info, node_id, only_type=SkillVariant)
            for node_id in ids]
        qs = qs.filter(pk__in=db_ids)
    return gql_optimizer.query(qs, info)


def resolve_report_skill_sales(info, period):
    qs = models.SkillVariant.objects.prefetch_related(
        'skill', 'skill__images', 'order_lines__order').all()

    # exclude draft and canceled orders
    exclude_status = [OrderStatus.DRAFT, OrderStatus.CANCELED]
    qs = qs.exclude(order_lines__order__status__in=exclude_status)

    # filter by period
    qs = filter_by_period(qs, period, 'order_lines__order__created')

    qs = qs.annotate(quantity_ordered=Sum('order_lines__quantity'))
    qs = qs.filter(quantity_ordered__isnull=False)
    return qs.order_by('-quantity_ordered')
