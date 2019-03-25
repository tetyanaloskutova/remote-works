from urllib.parse import urlencode

from django.conf import settings
from django.db.models import F

from ...checkout.utils import (
    get_cart_from_request, get_or_create_cart_from_request)
from ...core.utils import get_paginator_items
from ...core.utils.filters import get_now_sorted_by
from ...core.utils.taxes import ZERO_TAXED_MONEY, TaxedMoney
from ..forms import SkillForm
from .availability import skills_with_availability


def skills_visible_to_user(user):
    # pylint: disable=cyclic-import
    from ..models import Skill
    if user.is_authenticated and user.is_active and user.is_staff:
        return Skill.objects.all()
    if user.is_authenticated and user.is_active:
        return Skill.objects.filter(owner = user)
    return Skill.objects.published()


def skills_with_details(user):
    skills = skills_visible_to_user(user)
    skills = skills.prefetch_related(
        'translations', 'category__translations', 'collections__translations',
        'images', 'variants__variant_images__image',
        'attributes__values__translations',
        'skill_type__skill_attributes__translations',
        'skill_type__skill_attributes__values__translations')
    return skills


def skills_for_skills_list(user):
    skills = skills_visible_to_user(user)
    skills = skills.prefetch_related(
        'translations', 'images', 'variants__variant_images__image')
    return skills


def skills_for_homepage(user, homepage_collection):
    skills = skills_visible_to_user(user)
    skills = skills.prefetch_related(
        'translations', 'images', 'variants__variant_images__image')
    skills = skills.filter(collections=homepage_collection)
    return skills


def get_skill_images(skill):
    """Return list of skill images that will be placed in skill gallery."""
    return list(skill.images.all())


def handle_cart_form(request, skill, create_cart=False):
    if create_cart:
        cart = get_or_create_cart_from_request(request)
    else:
        cart = get_cart_from_request(request)
    form = SkillForm(
        cart=cart, skill=skill, data=request.POST or None,
        discounts=request.discounts, taxes=request.taxes)
    return form, cart


def skills_for_cart(user):
    skills = skills_visible_to_user(user)
    skills = skills.prefetch_related('variants__variant_images__image')
    return skills


def get_variant_url_from_skill(skill, attributes):
    return '%s?%s' % (skill.get_absolute_url(), urlencode(attributes))


def get_variant_url(variant):
    attributes = {
        str(attribute.pk): attribute
        for attribute in variant.skill.skill_type.variant_attributes.all()}
    return get_variant_url_from_skill(variant.skill, attributes)


def allocate_stock(variant, quantity):
    variant.quantity_allocated = F('quantity_allocated') + quantity
    variant.save(update_fields=['quantity_allocated'])


def deallocate_stock(variant, quantity):
    variant.quantity_allocated = F('quantity_allocated') - quantity
    variant.save(update_fields=['quantity_allocated'])


def decrease_stock(variant, quantity):
    variant.quantity = F('quantity') - quantity
    variant.quantity_allocated = F('quantity_allocated') - quantity
    variant.save(update_fields=['quantity', 'quantity_allocated'])


def increase_stock(variant, quantity, allocate=False):
    """Return given quantity of skill to a stock."""
    variant.quantity = F('quantity') + quantity
    update_fields = ['quantity']
    if allocate:
        variant.quantity_allocated = F('quantity_allocated') + quantity
        update_fields.append('quantity_allocated')
    variant.save(update_fields=update_fields)


def get_skill_list_context(request, filter_set):
    """
    :param request: request object
    :param filter_set: filter set for skill list
    :return: context dictionary
    """
    # Avoiding circular dependency
    from ..filters import SORT_BY_FIELDS
    qs = filter_set.qs
    if not filter_set.form.is_valid():
        qs = qs.none()
    skills_paginated = get_paginator_items(
        qs, settings.PAGINATE_BY, request.GET.get('page'))
    skills_and_availability = list(skills_with_availability(
        skills_paginated, request.discounts, request.taxes,
        request.currency))
    now_sorted_by = get_now_sorted_by(filter_set)
    arg_sort_by = request.GET.get('sort_by')
    is_descending = arg_sort_by.startswith('-') if arg_sort_by else False
    return {
        'filter_set': filter_set,
        'skills': skills_and_availability,
        'skills_paginated': skills_paginated,
        'sort_by_choices': SORT_BY_FIELDS,
        'now_sorted_by': now_sorted_by,
        'is_descending': is_descending}


def collections_visible_to_user(user):
    # pylint: disable=cyclic-import
    from ..models import Collection
    if user.is_authenticated and user.is_active and user.is_staff:
        return Collection.objects.all()
    return Collection.objects.published()


def calculate_revenue_for_variant(variant, start_date):
    """Calculate total revenue generated by a skill variant."""
    revenue = ZERO_TAXED_MONEY
    for order_line in variant.order_lines.all():
        if order_line.order.created >= start_date:
            net = order_line.unit_price_net * order_line.quantity
            gross = order_line.unit_price_gross * order_line.quantity
            revenue += TaxedMoney(net, gross)
    return revenue
