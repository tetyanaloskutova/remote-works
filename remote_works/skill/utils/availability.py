from collections import namedtuple

from .. import SkillAvailabilityStatus, VariantAvailabilityStatus
from ...core.utils import to_local_currency

SkillAvailability = namedtuple(
    'SkillAvailability', (
        'available', 'on_sale', 'price_range', 'price_range_undiscounted',
        'discount', 'price_range_local_currency', 'discount_local_currency'))


def skills_with_availability(skills, discounts, taxes, local_currency):
    for skill in skills:
        yield (skill, get_availability(
            skill, discounts, taxes, local_currency))


def get_skill_availability_status(skill):
    is_visible = skill.is_visible
    are_all_variants_in_availability = all(
        variant.is_in_availability() for variant in skill.variants.all())
    is_in_availability = any(
        variant.is_in_availability() for variant in skill.variants.all())
    requires_variants = skill.skill_type.has_variants

    if not skill.is_published:
        return SkillAvailabilityStatus.NOT_PUBLISHED
    if requires_variants and not skill.variants.exists():
        # We check the requires_variants flag here in task to not show this
        # status with skill types that don't require variants, as in that
        # case variants are hidden from the UI and user doesn't manage them.
        return SkillAvailabilityStatus.VARIANTS_MISSSING
    if not is_in_availability:
        return SkillAvailabilityStatus.OUT_OF_AVAILABILITY
    if not are_all_variants_in_availability:
        return SkillAvailabilityStatus.LOW_AVAILABILITY
    if not is_visible and skill.publication_date is not None:
        return SkillAvailabilityStatus.NOT_YET_AVAILABLE
    return SkillAvailabilityStatus.READY_FOR_PURCHASE


def get_variant_availability_status(variant):
    if not variant.is_in_availability():
        return VariantAvailabilityStatus.OUT_OF_AVAILABILITY
    return VariantAvailabilityStatus.AVAILABLE


def get_availability(skill, discounts=None, taxes=None, local_currency=None):
    # In default currency
    price_range = skill.get_price_range(discounts=discounts, taxes=taxes)
    undiscounted = skill.get_price_range(taxes=taxes)
    if undiscounted.start > price_range.start:
        discount = undiscounted.start - price_range.start
    else:
        discount = None

    # Local currency
    if local_currency:
        price_range_local = to_local_currency(
            price_range, local_currency)
        undiscounted_local = to_local_currency(
            undiscounted, local_currency)
        if (undiscounted_local and
                undiscounted_local.start > price_range_local.start):
            discount_local_currency = (
                undiscounted_local.start - price_range_local.start)
        else:
            discount_local_currency = None
    else:
        price_range_local = None
        discount_local_currency = None

    is_available = skill.is_in_availability() and skill.is_visible
    is_on_sale = (
        skill.is_visible and discount is not None and
        undiscounted.start != price_range.start)

    return SkillAvailability(
        available=is_available,
        on_sale=is_on_sale,
        price_range=price_range,
        price_range_undiscounted=undiscounted,
        discount=discount,
        price_range_local_currency=price_range_local,
        discount_local_currency=discount_local_currency)
