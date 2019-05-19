from textwrap import dedent

import graphene
from graphql_jwt.decorators import permission_required

from ..core.enums import ReportingPeriod
from ..core.fields import PrefetchingConnectionField
from ..descriptions import DESCRIPTIONS
from ..translations.mutations import (
    AttributeTranslate, AttributeValueTranslate, CategoryTranslate,
    CollectionTranslate, SkillTranslate, SkillVariantTranslate)
from .enums import StockAvailability
from .mutations.attributes import (
    AttributeCreate, AttributeDelete, AttributeUpdate, AttributeValueCreate,
    AttributeValueDelete, AttributeValueUpdate)
from .mutations.skills import (
    CategoryCreate, CategoryDelete, CategoryUpdate, CollectionAddSkills,
    CollectionCreate, CollectionDelete, CollectionRemoveSkills,
    CollectionUpdate, SkillCreate, SkillDelete, SkillImageCreate,
    SkillImageDelete, SkillImageReorder, SkillImageUpdate,
    SkillTypeCreate, SkillTypeDelete, SkillTypeUpdate, SkillUpdate,
    SkillVariantCreate, SkillVariantDelete, SkillVariantUpdate,
    VariantImageAssign, VariantImageUnassign)
from .resolvers import (
    resolve_attributes, resolve_categories, resolve_collections,
    resolve_skill_types, resolve_skill_variants, resolve_skills,
    resolve_report_skill_sales)
from .scalars import AttributeScalar
from .types import (
    Attribute, Category, Collection, Skill, SkillTask, SkillType,
    SkillVariant)


class SkillQueries(graphene.ObjectType):
    attributes = PrefetchingConnectionField(
        Attribute,
        description='List of the shop\'s attributes.',
        query=graphene.String(description=DESCRIPTIONS['attributes']),
        in_category=graphene.Argument(
            graphene.ID, description=dedent(
                '''Return attributes for skills belonging to the given
                category.''')),
        in_collection=graphene.Argument(
            graphene.ID, description=dedent(
                '''Return attributes for skills belonging to the given
                collection.''')),)
    categories = PrefetchingConnectionField(
        Category, query=graphene.String(
            description=DESCRIPTIONS['category']),
        level=graphene.Argument(graphene.Int),
        description='List of the shop\'s categories.')
    category = graphene.Field(
        Category, id=graphene.Argument(graphene.ID, required=True),
        description='Lookup a category by ID.')
    collection = graphene.Field(
        Collection, id=graphene.Argument(graphene.ID, required=True),
        description='Lookup a collection by ID.')
    collections = PrefetchingConnectionField(
        Collection, query=graphene.String(
            description=DESCRIPTIONS['collection']),
        description='List of the shop\'s collections.')
    skill = graphene.Field(
        Skill, id=graphene.Argument(graphene.ID, required=True),
        description='Lookup a skill by ID.')
    skills = PrefetchingConnectionField(
        Skill,
        attributes=graphene.List(
            AttributeScalar, description='Filter skills by attributes.'),
        categories=graphene.List(
            graphene.ID, description='Filter skills by category.'),
        collections=graphene.List(
            graphene.ID, description='Filter skills by collections.'),
        price_lte=graphene.Float(
            description=dedent(
                '''Filter by price less than or equal to the given value.''')),
        price_gte=graphene.Float(
            description=dedent(
                '''
                Filter by price greater than or equal to the given value.''')),
        sort_by=graphene.Argument(
            SkillTask, description='Sort skills.'),
        stock_availability=graphene.Argument(
            StockAvailability,
            description='Filter skills by the availability availability'),
        query=graphene.String(description=DESCRIPTIONS['skill']),
        description='List of the shop\'s skills.')
    skill_type = graphene.Field(
        SkillType, id=graphene.Argument(graphene.ID, required=True),
        description='Lookup a skill type by ID.')
    skill_types = PrefetchingConnectionField(
        SkillType, description='List of the shop\'s skill types.')
    skill_variant = graphene.Field(
        SkillVariant, id=graphene.Argument(graphene.ID, required=True),
        description='Lookup a variant by ID.')
    skill_variants = PrefetchingConnectionField(
        SkillVariant, ids=graphene.List(graphene.ID),
        description='Lookup multiple variants by ID')
    report_skill_sales = PrefetchingConnectionField(
        SkillVariant,
        period=graphene.Argument(
            ReportingPeriod, required=True, description='Span of time.'),
        description='List of top selling skills.')

    def resolve_attributes(
            self, info, in_category=None, in_collection=None, query=None,
            **kwargs):
        return resolve_attributes(info, in_category, in_collection, query)

    def resolve_categories(self, info, level=None, query=None, **kwargs):
        return resolve_categories(info, level=level, query=query)

    def resolve_category(self, info, id):
        return graphene.Node.get_node_from_global_id(info, id, Category)

    def resolve_collection(self, info, id):
        return graphene.Node.get_node_from_global_id(info, id, Collection)

    def resolve_collections(self, info, query=None, **kwargs):
        return resolve_collections(info, query)

    def resolve_skill(self, info, id):
        return graphene.Node.get_node_from_global_id(info, id, Skill)

    def resolve_skills(self, info, **kwargs):
        return resolve_skills(info, **kwargs)

    def resolve_skill_type(self, info, id):
        return graphene.Node.get_node_from_global_id(info, id, SkillType)

    def resolve_skill_types(self, info, **kwargs):
        return resolve_skill_types(info)

    def resolve_skill_variant(self, info, id):
        return graphene.Node.get_node_from_global_id(info, id, SkillVariant)

    def resolve_skill_variants(self, info, ids=None, **kwargs):
        return resolve_skill_variants(info, ids)

    @permission_required(['task.manage_orders', 'skill.manage_skills'])
    def resolve_report_skill_sales(self, info, period, **kwargs):
        return resolve_report_skill_sales(info, period)


class SkillMutations(graphene.ObjectType):
    attribute_create = AttributeCreate.Field()
    attribute_delete = AttributeDelete.Field()
    attribute_update = AttributeUpdate.Field()
    attribute_translate = AttributeTranslate.Field()

    attribute_value_create = AttributeValueCreate.Field()
    attribute_value_delete = AttributeValueDelete.Field()
    attribute_value_update = AttributeValueUpdate.Field()
    attribute_value_translate = AttributeValueTranslate.Field()

    category_create = CategoryCreate.Field()
    category_delete = CategoryDelete.Field()
    category_update = CategoryUpdate.Field()
    category_translate = CategoryTranslate.Field()

    collection_add_skills = CollectionAddSkills.Field()
    collection_create = CollectionCreate.Field()
    collection_delete = CollectionDelete.Field()
    collection_remove_skills = CollectionRemoveSkills.Field()
    collection_update = CollectionUpdate.Field()
    collection_translate = CollectionTranslate.Field()

    skill_create = SkillCreate.Field()
    skill_delete = SkillDelete.Field()
    skill_update = SkillUpdate.Field()
    skill_translate = SkillTranslate.Field()

    skill_image_create = SkillImageCreate.Field()
    skill_image_delete = SkillImageDelete.Field()
    skill_image_reorder = SkillImageReorder.Field()
    skill_image_update = SkillImageUpdate.Field()

    skill_type_create = SkillTypeCreate.Field()
    skill_type_delete = SkillTypeDelete.Field()
    skill_type_update = SkillTypeUpdate.Field()

    skill_variant_create = SkillVariantCreate.Field()
    skill_variant_delete = SkillVariantDelete.Field()
    skill_variant_update = SkillVariantUpdate.Field()
    skill_variant_translate = SkillVariantTranslate.Field()

    variant_image_assign = VariantImageAssign.Field()
    variant_image_unassign = VariantImageUnassign.Field()
