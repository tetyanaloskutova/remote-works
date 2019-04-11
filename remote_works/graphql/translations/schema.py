import graphene

from ..core.connection import CountableConnection
from ..discount import types as discount_types
from ..discount.resolvers import resolve_vouchers
from ..menu import types as menu_types
from ..menu.resolvers import resolve_menu_items
from ..page import types as page_types
from ..page.resolvers import resolve_pages
from ..skill import types as skill_types
from ..skill.resolvers import (
    resolve_attributes, resolve_categories, resolve_collections,
    resolve_skill_variants, resolve_skills)
from ..shipping import types as shipping_types
from .resolvers import resolve_attribute_values, resolve_shipping_methods


class TranslatableItem(graphene.Union):
    class Meta:
        types = (
            skill_types.Skill,
            skill_types.Category,
            skill_types.Collection,
            skill_types.Attribute,
            skill_types.AttributeValue,
            skill_types.SkillVariant,
            page_types.Page,
            shipping_types.ShippingMethod,
            discount_types.Voucher,
            menu_types.MenuItem)


class TranslatableItemConnection(CountableConnection):
    class Meta:
        node = TranslatableItem


class TranslatableKinds(graphene.Enum):
    PRODUCT = 'Skill'
    COLLECTION = 'Collection'
    CATEGORY = 'Category'
    PAGE = 'Page'
    SHIPPING_METHOD = 'Shipping Method'
    VOUCHER = 'Voucher'
    ATTRIBUTE = 'Attribute'
    ATTRIBUTE_VALUE = 'Attribute Value'
    VARIANT = 'Variant'
    MENU_ITEM = 'Menu Item'


class TranslationQueries(graphene.ObjectType):
    translations = graphene.ConnectionField(
        TranslatableItemConnection,
        description='Returns list of all translatable items of a given kind.',
        kind=graphene.Argument(
            TranslatableKinds,
            required=True, description='Kind of objects to retrieve.'))

    def resolve_translations(self, info, kind, **kwargs):
        if kind == TranslatableKinds.PRODUCT:
            return resolve_skills(info)
        elif kind == TranslatableKinds.COLLECTION:
            return resolve_collections(info, query=None)
        elif kind == TranslatableKinds.CATEGORY:
            return resolve_categories(info, query=None)
        elif kind == TranslatableKinds.PAGE:
            return resolve_pages(info, query=None)
        elif kind == TranslatableKinds.SHIPPING_METHOD:
            return resolve_shipping_methods(info)
        elif kind == TranslatableKinds.VOUCHER:
            return resolve_vouchers(info, query=None)
        elif kind == TranslatableKinds.ATTRIBUTE:
            return resolve_attributes(info)
        elif kind == TranslatableKinds.ATTRIBUTE_VALUE:
            return resolve_attribute_values(info)
        elif kind == TranslatableKinds.VARIANT:
            return resolve_skill_variants(info)
        elif kind == TranslatableKinds.MENU_ITEM:
            return resolve_menu_items(info, query=None)
