import re
from textwrap import dedent

import graphene
import graphene_django_optimizer as gql_optimizer
from django.db.models import Prefetch
from graphene import relay
from graphql.error import GraphQLError
from graphql_jwt.decorators import permission_required

from ...skill import models
from ...skill.templatetags.skill_images import (
    get_skill_image_thumbnail, get_thumbnail)
from ...skill.utils import calculate_revenue_for_variant
from ...skill.utils.availability import get_availability
from ...skill.utils.costs import (
    get_margin_for_variant, get_skill_costs_data)
from ..core.connection import CountableDjangoObjectType
from ..core.enums import ReportingPeriod, TaxRateType
from ..core.fields import PrefetchingConnectionField
from ..core.types import Money, MoneyRange, TaxedMoney, TaxedMoneyRange
from ..translations.resolvers import resolve_translation
from ..translations.types import (
    AttributeTranslation, AttributeValueTranslation, CategoryTranslation,
    CollectionTranslation, SkillTranslation, SkillVariantTranslation)
from ..utils import get_database_id, reporting_period_to_date
from .descriptions import AttributeDescriptions, AttributeValueDescriptions
from .enums import AttributeValueType, TaskDirection, SkillTaskField

COLOR_PATTERN = r'^(#[0-9a-fA-F]{3}|#(?:[0-9a-fA-F]{2}){2,4}|(rgb|hsl)a?\((-?\d+%?[,\s]+){2,3}\s*[\d\.]+%?\))$'  # noqa
color_pattern = re.compile(COLOR_PATTERN)


def resolve_attribute_list(attributes_hstore, attributes_qs):
    """Resolve attributes dict into a list of `SelectedAttribute`s.
    keys = list(attributes.keys())
    values = list(attributes.values())

    `attributes_qs` is the queryset of attribute objects. If it's prefetch
    beforehand along with the values, it saves database queries.
    """
    attributes_map = {}
    values_map = {}
    for attr in attributes_qs:
        attributes_map[attr.pk] = attr
        for val in attr.values.all():
            values_map[val.pk] = val

    attributes_list = []
    for k, v in attributes_hstore.items():
        attribute = attributes_map.get(int(k))
        value = values_map.get(int(v))
        if attribute and value:
            attributes_list.append(
                SelectedAttribute(attribute=attribute, value=value))
    return attributes_list


def resolve_attribute_value_type(attribute_value):
    if color_pattern.match(attribute_value):
        return AttributeValueType.COLOR
    if 'gradient(' in attribute_value:
        return AttributeValueType.GRADIENT
    if '://' in attribute_value:
        return AttributeValueType.URL
    return AttributeValueType.STRING


def resolve_background_image(background_image, alt, size, info):
    if size:
        url = get_thumbnail(background_image, size, method='thumbnail')
    else:
        url = background_image.url
    url = info.context.build_absolute_uri(url)
    return Image(url, alt)


class AttributeValue(CountableDjangoObjectType):
    name = graphene.String(description=AttributeValueDescriptions.NAME)
    slug = graphene.String(description=AttributeValueDescriptions.SLUG)
    type = AttributeValueType(description=AttributeValueDescriptions.TYPE)
    value = graphene.String(description=AttributeValueDescriptions.VALUE)
    translation = graphene.Field(
        AttributeValueTranslation,
        language_code=graphene.String(
            description='A language code to return the translation for.',
            required=True),
        description=(
            'Returns translated Attribute Value fields '
            'for the given language code.'),
        resolver=resolve_translation)

    class Meta:
        description = 'Represents a value of an attribute.'
        exclude_fields = ['attribute', 'translations']
        interfaces = [relay.Node]
        model = models.AttributeValue

    def resolve_type(self, info):
        return resolve_attribute_value_type(self.value)


class Attribute(CountableDjangoObjectType):
    name = graphene.String(description=AttributeDescriptions.NAME)
    slug = graphene.String(description=AttributeDescriptions.SLUG)
    values = gql_optimizer.field(
        graphene.List(
            AttributeValue, description=AttributeDescriptions.VALUES),
        model_field='values')
    translation = graphene.Field(
        AttributeTranslation, language_code=graphene.String(
            description='A language code to return the translation for.',
            required=True),
        description=(
            'Returns translated Attribute fields '
            'for the given language code.'),
        resolver=resolve_translation)

    class Meta:
        description = dedent("""Custom attribute of a skill. Attributes can be
        assigned to skills and variants at the skill type level.""")
        exclude_fields = ['translations']
        interfaces = [relay.Node]
        model = models.Attribute

    def resolve_values(self, info):
        return self.values.all()


class Margin(graphene.ObjectType):
    start = graphene.Int()
    stop = graphene.Int()


class SelectedAttribute(graphene.ObjectType):
    attribute = graphene.Field(
        Attribute, default_value=None, description=AttributeDescriptions.NAME,
        required=True)
    value = graphene.Field(
        AttributeValue, default_value=None,
        description='Value of an attribute.', required=True)

    class Meta:
        description = 'Represents a custom attribute.'


class SkillTask(graphene.InputObjectType):
    field = graphene.Argument(
        SkillTaskField, required=True,
        description='Sort skills by the selected field.')
    direction = graphene.Argument(
        TaskDirection, required=True,
        description='Specifies the direction in which to sort skills')


class SkillVariant(CountableDjangoObjectType):
    stock_quantity = graphene.Int(
        required=True, description='Quantity of a skill available for sale.')
    price_override = graphene.Field(
        Money,
        description=dedent("""Override the base price of a skill if necessary.
        A value of `null` indicates that the default skill
        price is used."""))
    price = graphene.Field(Money, description='Price of the skill variant.')
    attributes = graphene.List(
        graphene.NonNull(SelectedAttribute), required=True,
        description='List of attributes assigned to this variant.')
    cost_price = graphene.Field(
        Money, description='Cost price of the variant.')
    margin = graphene.Int(description='Gross margin percentage value.')
    quantity_ordered = graphene.Int(description='Total quantity ordered.')
    revenue = graphene.Field(
        TaxedMoney, period=graphene.Argument(ReportingPeriod),
        description=dedent('''Total revenue generated by a variant in given
        period of time. Note: this field should be queried using
        `reportSkillSales` query as it uses optimizations suitable
        for such calculations.'''))
    images = gql_optimizer.field(
        graphene.List(
            lambda: SkillImage,
            description='List of images for the skill variant'),
        model_field='images')
    translation = graphene.Field(
        SkillVariantTranslation,
        language_code=graphene.String(
            description='A language code to return the translation for.',
            required=True),
        description=(
            'Returns translated Skill Variant fields '
            'for the given language code.'),
        resolver=resolve_translation)

    class Meta:
        description = dedent("""Represents a version of a skill such as
        different size or color.""")
        exclude_fields = ['order_lines', 'variant_images', 'translations']
        interfaces = [relay.Node]
        model = models.SkillVariant

    def resolve_stock_quantity(self, info):
        return self.quantity_available

    @gql_optimizer.resolver_hints(
        prefetch_related='skill__skill_type__variant_attributes__values')
    def resolve_attributes(self, info):
        attributes_qs = self.skill.skill_type.variant_attributes.all()
        return resolve_attribute_list(self.attributes, attributes_qs)

    @permission_required('skill.manage_skills')
    def resolve_margin(self, info):
        return get_margin_for_variant(self)

    def resolve_price(self, info):
        return (
            self.price_override
            if self.price_override is not None else self.skill.price)

    @permission_required('skill.manage_skills')
    def resolve_price_override(self, info):
        return self.price_override

    @permission_required('skill.manage_skills')
    def resolve_quantity(self, info):
        return self.quantity

    @permission_required(['task.manage_orders', 'skill.manage_skills'])
    def resolve_quantity_ordered(self, info):
        # This field is added through annotation when using the
        # `resolve_report_skill_sales` resolver.
        return getattr(self, 'quantity_ordered', None)

    @permission_required(['task.manage_orders', 'skill.manage_skills'])
    def resolve_quantity_allocated(self, info):
        return self.quantity_allocated

    @permission_required(['task.manage_orders', 'skill.manage_skills'])
    def resolve_revenue(self, info, period):
        start_date = reporting_period_to_date(period)
        return calculate_revenue_for_variant(self, start_date)

    def resolve_images(self, info):
        return self.images.all()

    @classmethod
    def get_node(cls, info, id):
        user = info.context.user
        visible_skills = models.Skill.objects.visible_to_user(
            user).values_list('pk', flat=True)
        try:
            return cls._meta.model.objects.filter(
                skill__id__in=visible_skills).get(pk=id)
        except cls._meta.model.DoesNotExist:
            return None


class SkillAvailability(graphene.ObjectType):
    available = graphene.Boolean()
    on_sale = graphene.Boolean()
    discount = graphene.Field(TaxedMoney)
    discount_local_currency = graphene.Field(TaxedMoney)
    price_range = graphene.Field(TaxedMoneyRange)
    price_range_undiscounted = graphene.Field(TaxedMoneyRange)
    price_range_local_currency = graphene.Field(TaxedMoneyRange)

    class Meta:
        description = 'Represents availability of a skill in the storefront.'


class Image(graphene.ObjectType):
    url = graphene.String(
        required=True,
        description='The URL of the image.')
    alt = graphene.String(description='Alt text for an image.')

    class Meta:
        description = 'Represents an image.'


class Skill(CountableDjangoObjectType):
    url = graphene.String(
        description='The storefront URL for the skill.', required=True)
    thumbnail_url = graphene.String(
        description='The URL of a main thumbnail for a skill.',
        size=graphene.Argument(graphene.Int, description='Size of thumbnail'),
        deprecation_reason=dedent("""thumbnailUrl is deprecated, use
         thumbnail instead"""))
    thumbnail = graphene.Field(
        Image, description='The main thumbnail for a skill.',
        size=graphene.Argument(graphene.Int, description='Size of thumbnail'))
    availability = graphene.Field(
        SkillAvailability, description=dedent("""Informs about skill's availability in the
        storefront, current price and discounts."""))
    price = graphene.Field(
        Money,
        description=dedent("""The skill's base price (without any discounts
        applied)."""))
    tax_rate = TaxRateType(description='A type of tax rate.')
    attributes = graphene.List(
        graphene.NonNull(SelectedAttribute), required=True,
        description='List of attributes assigned to this skill.')
    purchase_cost = graphene.Field(MoneyRange)
    margin = graphene.Field(Margin)
    image_by_id = graphene.Field(
        lambda: SkillImage,
        id=graphene.Argument(
            graphene.ID, description='ID of a skill image.'),
        description='Get a single skill image by ID')
    variants = gql_optimizer.field(
        graphene.List(
            SkillVariant, description='List of variants for the skill'),
        model_field='variants')
    images = gql_optimizer.field(
        graphene.List(
            lambda: SkillImage,
            description='List of images for the skill'),
        model_field='images')
    collections = gql_optimizer.field(
        graphene.List(
            lambda: Collection,
            description='List of collections for the skill'),
        model_field='collections')
    available_on = graphene.Date(
        deprecation_reason=(
            'availableOn is deprecated, use publicationDate instead'))
    translation = graphene.Field(
        SkillTranslation, language_code=graphene.String(
            description='A language code to return the translation for.',
            required=True),
        description=(
            'Returns translated Skill fields for the given language code.'),
        resolver=resolve_translation)

    class Meta:
        description = dedent("""Represents an individual item for sale in the
        storefront.""")
        interfaces = [relay.Node]
        model = models.Skill
        exclude_fields = ['voucher_set', 'sale_set', 'translations']

    @gql_optimizer.resolver_hints(prefetch_related='images')
    def resolve_thumbnail_url(self, info, *, size=None):
        if not size:
            size = 255
        url = get_skill_image_thumbnail(
            self.get_first_image(), size, method='thumbnail')
        return info.context.build_absolute_uri(url)

    @gql_optimizer.resolver_hints(prefetch_related='images')
    def resolve_thumbnail(self, info, *, size=None):
        image = self.get_first_image()
        if not size:
            size = 255
        url = get_skill_image_thumbnail(image, size, method='thumbnail')
        url = info.context.build_absolute_uri(url)
        alt = image.alt if image else None
        return Image(alt=alt, url=url)

    def resolve_url(self, info):
        return self.get_absolute_url()

    @gql_optimizer.resolver_hints(
        prefetch_related='variants',
        only=['publication_date', 'charge_taxes', 'price', 'tax_rate'])
    def resolve_availability(self, info):
        context = info.context
        availability = get_availability(
            self, context.discounts, context.taxes, context.currency)
        return SkillAvailability(**availability._asdict())

    @gql_optimizer.resolver_hints(
        prefetch_related='skill_type__skill_attributes__values')
    def resolve_attributes(self, info):
        attributes_qs = self.skill_type.skill_attributes.all()
        return resolve_attribute_list(self.attributes, attributes_qs)

    @permission_required('skill.manage_skills')
    def resolve_purchase_cost(self, info):
        purchase_cost, _ = get_skill_costs_data(self)
        return purchase_cost

    @permission_required('skill.manage_skills')
    def resolve_margin(self, info):
        _, margin = get_skill_costs_data(self)
        return Margin(margin[0], margin[1])

    def resolve_image_by_id(self, info, id):
        pk = get_database_id(info, id, SkillImage)
        try:
            return self.images.get(pk=pk)
        except models.SkillImage.DoesNotExist:
            raise GraphQLError('Skill image not found.')

    @gql_optimizer.resolver_hints(model_field='images')
    def resolve_images(self, info, **kwargs):
        return self.images.all()

    def resolve_variants(self, info, **kwargs):
        return self.variants.all()

    def resolve_collections(self, info):
        return self.collections.all()

    def resolve_available_on(self, info):
        return self.publication_date

    @classmethod
    def get_node(cls, info, id):
        if info.context:
            user = info.context.user
            try:
                return cls._meta.model.objects.visible_to_user(
                    user).get(pk=id)
            except cls._meta.model.DoesNotExist:
                return None
        return None


def prefetch_skills(info, *args, **kwargs):
    """Prefetch skills visible to the current user.

    Can be used with models that have the `skills` relationship. Queryset of
    skills being prefetched is filtered based on permissions of the viewing
    user, to restrict access to unpublished skills to non-staff users.
    """
    user = info.context.user
    qs = models.Skill.objects.visible_to_user(user)
    return Prefetch(
        'skills', queryset=gql_optimizer.query(qs, info),
        to_attr='prefetched_skills')


class SkillType(CountableDjangoObjectType):
    skills = gql_optimizer.field(
        PrefetchingConnectionField(
            Skill, description='List of skills of this type.'),
        prefetch_related=prefetch_skills)
    skill_attributes = gql_optimizer.field(
        PrefetchingConnectionField(Attribute),
        model_field='skill_attributes')
    variant_attributes = gql_optimizer.field(
        PrefetchingConnectionField(Attribute),
        model_field='variant_attributes')
    tax_rate = TaxRateType(description='A type of tax rate.')
    variant_attributes = graphene.List(
        Attribute, description='Variant attributes of that skill type.')
    skill_attributes = graphene.List(
        Attribute, description='Skill attributes of that skill type.')

    class Meta:
        description = dedent("""Represents a type of skill. It defines what
        attributes are available to skills of this type.""")
        interfaces = [relay.Node]
        model = models.SkillType

    def resolve_skill_attributes(self, info, **kwargs):
        return self.skill_attributes.all()

    def resolve_variant_attributes(self, info, **kwargs):
        return self.variant_attributes.all()

    def resolve_skills(self, info, **kwargs):
        if hasattr(self, 'prefetched_skills'):
            return self.prefetched_skills
        qs = self.skills.visible_to_user(info.context.user)
        return gql_optimizer.query(qs, info)


class Collection(CountableDjangoObjectType):
    skills = gql_optimizer.field(
        PrefetchingConnectionField(
            Skill, description='List of skills in this collection.'),
        prefetch_related=prefetch_skills)
    background_image = graphene.Field(
        Image, size=graphene.Int(description='Size of the image'))
    published_date = graphene.Date(
        deprecation_reason=(
            'publishedDate is deprecated, use publicationDate instead'))
    translation = graphene.Field(
        CollectionTranslation, language_code=graphene.String(
            description='A language code to return the translation for.',
            required=True),
        description=(
            'Returns translated Collection fields '
            'for the given language code.'),
        resolver=resolve_translation)

    class Meta:
        description = "Represents a collection of skills."
        exclude_fields = [
            'voucher_set', 'sale_set', 'menuitem_set', 'background_image_alt',
            'translations']
        interfaces = [relay.Node]
        model = models.Collection

    def resolve_background_image(self, info, size=None, **kwargs):
        if not self.background_image:
            return None
        return resolve_background_image(
            self.background_image, self.background_image_alt, size, info)

    def resolve_skills(self, info, **kwargs):
        if hasattr(self, 'prefetched_skills'):
            return self.prefetched_skills
        qs = self.skills.visible_to_user(info.context.user)
        return gql_optimizer.query(qs, info)

    def resolve_published_date(self, info):
        return self.publication_date

    @classmethod
    def get_node(cls, info, id):
        if info.context:
            user = info.context.user
            try:
                return cls._meta.model.objects.visible_to_user(
                    user).get(pk=id)
            except cls._meta.model.DoesNotExist:
                return None
        return None


class Category(CountableDjangoObjectType):
    ancestors = PrefetchingConnectionField(
        lambda: Category,
        description='List of ancestors of the category.')
    skills = gql_optimizer.field(
        PrefetchingConnectionField(
            Skill, description='List of skills in the category.'),
        prefetch_related=prefetch_skills)
    url = graphene.String(
        description='The storefront\'s URL for the category.')
    children = PrefetchingConnectionField(
        lambda: Category,
        description='List of children of the category.')
    background_image = graphene.Field(
        Image, size=graphene.Int(description='Size of the image'))
    translation = graphene.Field(
        CategoryTranslation, language_code=graphene.String(
            description='A language code to return the translation for.',
            required=True),
        description=(
            'Returns translated Category fields for the given language code.'),
        resolver=resolve_translation)

    class Meta:
        description = dedent("""Represents a single category of skills.
        Categories allow to organize skills in a tree-hierarchies which can
        be used for navigation in the storefront.""")
        exclude_fields = [
            'lft', 'rght', 'tree_id', 'voucher_set', 'sale_set',
            'menuitem_set', 'background_image_alt', 'translations']
        interfaces = [relay.Node]
        model = models.Category

    def resolve_ancestors(self, info, **kwargs):
        qs = self.get_ancestors()
        return gql_optimizer.query(qs, info)

    def resolve_background_image(self, info, size=None, **kwargs):
        if not self.background_image:
            return None
        return resolve_background_image(
            self.background_image, self.background_image_alt, size, info)

    def resolve_children(self, info, **kwargs):
        qs = self.children.all()
        return gql_optimizer.query(qs, info)

    def resolve_url(self, info):
        return self.get_absolute_url()

    def resolve_skills(self, info, **kwargs):
        # If the category has no children, we use the prefetched data.
        children = self.children.all()
        if not children and hasattr(self, 'prefetched_skills'):
            return self.prefetched_skills

        # Otherwise we want to include skills from child categories which
        # requires performing additional logic.
        tree = self.get_descendants(include_self=True)
        qs = models.Skill.objects.published()
        qs = qs.filter(category__in=tree)
        return gql_optimizer.query(qs, info)


class SkillImage(CountableDjangoObjectType):
    url = graphene.String(
        required=True,
        description='The URL of the image.',
        size=graphene.Int(description='Size of the image'))

    class Meta:
        description = 'Represents a skill image.'
        exclude_fields = [
            'image', 'skill', 'ppoi', 'skillvariant_set',
            'variant_images']
        interfaces = [relay.Node]
        model = models.SkillImage

    def resolve_url(self, info, *, size=None):
        if size:
            url = get_thumbnail(self.image, size, method='thumbnail')
        else:
            url = self.image.url
        return info.context.build_absolute_uri(url)
