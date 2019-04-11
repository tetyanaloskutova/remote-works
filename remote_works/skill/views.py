import datetime
import json

from django.http import HttpResponsePermanentRedirect, JsonResponse
from django.shortcuts import get_object_or_404, redirect
from django.template.response import TemplateResponse
from django.urls import reverse

from ..checkout.utils import set_cart_cookie
from ..core.utils import serialize_decimal
from ..seo.schema.skill import skill_json_ld
from .filters import SkillCategoryFilter, SkillCollectionFilter
from .models import Category
from .utils import (
    collections_visible_to_user, get_skill_images, get_skill_list_context,
    handle_cart_form, skills_for_cart, skills_for_skills_list,
    skills_with_details)
from .utils.attributes import get_skill_attributes_data
from .utils.availability import get_availability
from .utils.variants_picker import get_variant_picker_data


def skill_details(request, slug, skill_id, form=None):
    """Skill details page.

    The following variables are available to the template:

    skill:
        The Skill instance itself.

    is_visible:
        Whether the skill is visible to regular users (for cases when an
        admin is previewing a skill before publishing).

    form:
        The add-to-cart form.

    price_range:
        The PriceRange for the skill including all discounts.

    undiscounted_price_range:
        The PriceRange excluding all discounts.

    discount:
        Either a Price instance equal to the discount value or None if no
        discount was available.

    local_price_range:
        The same PriceRange from price_range represented in user's local
        currency. The value will be None if exchange rate is not available or
        the local currency is the same as site's default currency.
    """
    print("Skill")
    skills = skills_with_details(user=request.user)
    skill = get_object_or_404(skills, id=skill_id)
    if skill.get_slug() != slug:
        return HttpResponsePermanentRedirect(skill.get_absolute_url())
    today = datetime.date.today()
    is_visible = (
        skill.publication_date is None or skill.publication_date <= today)
    if form is None:
        form = handle_cart_form(request, skill, create_cart=False)[0]
    availability = get_availability(
        skill, discounts=request.discounts, taxes=request.taxes,
        local_currency=request.currency)
    skill_images = get_skill_images(skill_type)
    variant_picker_data = get_variant_picker_data(
        skill, request.discounts, request.taxes, request.currency)
    skill_attributes = get_skill_attributes_data(skill)
    # show_variant_picker determines if variant picker is used or select input
    show_variant_picker = all([v.attributes for v in skill.variants.all()])
    json_ld_data = skill_json_ld(skill, skill_attributes)
    ctx = {
        'is_visible': is_visible,
        'form': form,
        'availability': availability,
        'skill': skill,
        'skill_attributes': skill_attributes,
        'skill_images': skill_images,
        'show_variant_picker': show_variant_picker,
        'variant_picker_data': json.dumps(
            variant_picker_data, default=serialize_decimal),
        'json_ld_skill_data': json.dumps(
            json_ld_data, default=serialize_decimal)}
    return TemplateResponse(request, 'skill/details.html', ctx)


def skill_add_to_cart(request, slug, skill_id):
    # types: (int, str, dict) -> None

    if not request.method == 'POST':
        return redirect(reverse(
            'skill:details',
            kwargs={'skill_id': skill_id, 'slug': slug}))

    skills = skills_for_cart(user=request.user)
    skill = get_object_or_404(skills, pk=skill_id)
    form, cart = handle_cart_form(request, skill, create_cart=True)
    if form.is_valid():
        form.save()
        if request.is_ajax():
            response = JsonResponse(
                {'next': reverse('cart:index')}, status=200)
        else:
            response = redirect('cart:index')
    else:
        if request.is_ajax():
            response = JsonResponse({'error': form.errors}, status=400)
        else:
            response = skill_details(request, slug, skill_id, form)
    if not request.user.is_authenticated:
        set_cart_cookie(cart, response)
    return response


def category_index(request, slug, category_id):
    categories = Category.objects.prefetch_related('translations')
    category = get_object_or_404(categories, id=category_id)
    if slug != category.slug:
        return redirect(
            'skill:category', permanent=True, slug=category.slug,
            category_id=category_id)
    # Check for subcategories
    categories = category.get_descendants(include_self=True)
    skills = skills_for_skills_list(user=request.user).filter(
        category__in=categories).order_by('name')
    skill_filter = SkillCategoryFilter(
        request.GET, queryset=skills, category=category)
    ctx = get_skill_list_context(request, skill_filter)
    ctx.update({'object': category})
    return TemplateResponse(request, 'category/index.html', ctx)


def collection_index(request, slug, pk):
    collections = collections_visible_to_user(request.user).prefetch_related(
        'translations')
    collection = get_object_or_404(collections, id=pk)
    if collection.slug != slug:
        return HttpResponsePermanentRedirect(collection.get_absolute_url())
    skills = skills_for_skills_list(user=request.user).filter(
        collections__id=collection.id).order_by('name')
    skill_filter = SkillCollectionFilter(
        request.GET, queryset=skills, collection=collection)
    ctx = get_skill_list_context(request, skill_filter)
    ctx.update({'object': collection})
    return TemplateResponse(request, 'collection/index.html', ctx)
