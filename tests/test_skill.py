import datetime
import io
import json
from decimal import Decimal
from unittest.mock import patch

import pytest
from django.core import serializers
from django.core.serializers.base import DeserializationError
from django.urls import reverse
from prices import Money, TaxedMoney, TaxedMoneyRange

from remote_works.checkout import utils
from remote_works.checkout.models import Cart
from remote_works.checkout.utils import add_variant_to_cart
from remote_works.dashboard.menu.utils import update_menu
from remote_works.discount.models import Sale
from remote_works.menu.models import MenuItemTranslation
from remote_works.skill import SkillAvailabilityStatus, models
from remote_works.skill.thumbnails import create_skill_thumbnails
from remote_works.skill.utils import (
    allocate_stock, deallocate_stock, decrease_stock, increase_stock)
from remote_works.skill.utils.attributes import get_skill_attributes_data
from remote_works.skill.utils.availability import get_skill_availability_status
from remote_works.skill.utils.variants_picker import get_variant_picker_data

from .utils import filter_skills_by_attribute


@pytest.mark.parametrize(
    'func, expected_quantity, expected_quantity_allocated',
    (
        (increase_stock, 150, 80),
        (decrease_stock, 50, 30),
        (deallocate_stock, 100, 30),
        (allocate_stock, 100, 130)))
def test_stock_utils(
        skill, func, expected_quantity, expected_quantity_allocated):
    variant = skill.variants.first()
    variant.quantity = 100
    variant.quantity_allocated = 80
    variant.save()
    func(variant, 50)
    variant.refresh_from_db()
    assert variant.quantity == expected_quantity
    assert variant.quantity_allocated == expected_quantity_allocated


def test_skill_page_redirects_to_correct_slug(client, skill):
    uri = skill.get_absolute_url()
    uri = uri.replace(skill.get_slug(), 'spanish-inquisition')
    response = client.get(uri)
    assert response.status_code == 301
    location = response['location']
    if location.startswith('http'):
        location = location.split('http://testserver')[1]
    assert location == skill.get_absolute_url()


def test_skill_preview(admin_client, client, skill):
    skill.publication_date = (
        datetime.date.today() + datetime.timedelta(days=7))
    skill.save()
    response = client.get(skill.get_absolute_url())
    assert response.status_code == 404
    response = admin_client.get(skill.get_absolute_url())
    assert response.status_code == 200


def test_filtering_by_attribute(db, color_attribute, category, settings):
    skill_type_a = models.SkillType.objects.create(
        name='New class', has_variants=True)
    skill_type_a.skill_attributes.add(color_attribute)
    skill_type_b = models.SkillType.objects.create(
        name='New class', has_variants=True)
    skill_type_b.variant_attributes.add(color_attribute)
    skill_a = models.Skill.objects.create(
        name='Test skill a', price=Money(10, settings.DEFAULT_CURRENCY),
        skill_type=skill_type_a, category=category)
    models.SkillVariant.objects.create(skill=skill_a, sku='1234')
    skill_b = models.Skill.objects.create(
        name='Test skill b', price=Money(10, settings.DEFAULT_CURRENCY),
        skill_type=skill_type_b, category=category)
    variant_b = models.SkillVariant.objects.create(skill=skill_b,
                                                     sku='12345')
    color = color_attribute.values.first()
    color_2 = color_attribute.values.last()
    skill_a.attributes[str(color_attribute.pk)] = str(color.pk)
    skill_a.save()
    variant_b.attributes[str(color_attribute.pk)] = str(color.pk)
    variant_b.save()

    filtered = filter_skills_by_attribute(models.Skill.objects.all(),
                                            color_attribute.pk, color.pk)
    assert skill_a in list(filtered)
    assert skill_b in list(filtered)

    skill_a.attributes[str(color_attribute.pk)] = str(color_2.pk)
    skill_a.save()
    filtered = filter_skills_by_attribute(models.Skill.objects.all(),
                                            color_attribute.pk, color.pk)
    assert skill_a not in list(filtered)
    assert skill_b in list(filtered)
    filtered = filter_skills_by_attribute(models.Skill.objects.all(),
                                            color_attribute.pk, color_2.pk)
    assert skill_a in list(filtered)
    assert skill_b not in list(filtered)


def test_render_home_page(client, skill, site_settings, settings):
    # Tests if menu renders properly if none is assigned
    settings.LANGUAGE_CODE = 'fr'
    site_settings.top_menu = None
    site_settings.save()

    response = client.get(reverse('home'))
    assert response.status_code == 200


def test_render_home_page_with_translated_menu_items(
        client, skill, menu_with_items, site_settings, settings):
    settings.LANGUAGE_CODE = 'fr'
    site_settings.top_menu = menu_with_items
    site_settings.save()

    for item in menu_with_items.items.all():
        MenuItemTranslation.objects.create(
            menu_item=item, language_code='fr',
            name='Translated name in French')
    update_menu(menu_with_items)

    response = client.get(reverse('home'))
    assert response.status_code == 200
    assert 'Translated name in French' in str(response.content)


def test_render_home_page_with_sale(client, skill, sale):
    response = client.get(reverse('home'))
    assert response.status_code == 200


def test_render_home_page_with_taxes(client, skill, vatlayer):
    response = client.get(reverse('home'))
    assert response.status_code == 200


def test_render_category(client, category, skill):
    response = client.get(category.get_absolute_url())
    assert response.status_code == 200


def test_render_category_with_sale(client, category, skill, sale):
    response = client.get(category.get_absolute_url())
    assert response.status_code == 200


def test_render_category_with_taxes(client, category, skill, vatlayer):
    response = client.get(category.get_absolute_url())
    assert response.status_code == 200


def test_render_skill_detail(client, skill):
    response = client.get(skill.get_absolute_url())
    assert response.status_code == 200


def test_render_skill_detail_with_sale(client, skill, sale):
    response = client.get(skill.get_absolute_url())
    assert response.status_code == 200


def test_render_skill_detail_with_taxes(client, skill, vatlayer):
    response = client.get(skill.get_absolute_url())
    assert response.status_code == 200


def test_view_invalid_add_to_cart(client, skill, request_cart):
    variant = skill.variants.get()
    add_variant_to_cart(request_cart, variant, 2)
    response = client.post(
        reverse(
            'skill:add-to-cart',
            kwargs={
                'slug': skill.get_slug(),
                'skill_id': skill.pk}),
        {})
    assert response.status_code == 200
    assert request_cart.quantity == 2


def test_view_add_to_cart(client, skill, request_cart_with_item):
    variant = request_cart_with_item.lines.get().variant
    response = client.post(
        reverse(
            'skill:add-to-cart',
            kwargs={'slug': skill.get_slug(),
                    'skill_id': skill.pk}),
        {'quantity': 1, 'variant': variant.pk})
    assert response.status_code == 302
    assert request_cart_with_item.quantity == 1


def test_adding_to_cart_with_current_user_token(
        customer_user, authorized_client, skill, request_cart_with_item):
    key = utils.COOKIE_NAME
    request_cart_with_item.user = customer_user
    request_cart_with_item.save()

    response = authorized_client.get(reverse('cart:index'))

    utils.set_cart_cookie(request_cart_with_item, response)
    authorized_client.cookies[key] = response.cookies[key]
    variant = request_cart_with_item.lines.first().variant
    url = reverse(
        'skill:add-to-cart',
        kwargs={'slug': skill.get_slug(), 'skill_id': skill.pk})
    data = {'quantity': 1, 'variant': variant.pk}

    authorized_client.post(url, data)

    assert Cart.objects.count() == 1
    assert Cart.objects.get(user=customer_user).pk == request_cart_with_item.pk


def test_adding_to_cart_with_another_user_token(
        admin_user, admin_client, skill, customer_user,
        request_cart_with_item):
    client = admin_client
    key = utils.COOKIE_NAME
    request_cart_with_item.user = customer_user
    request_cart_with_item.save()

    response = client.get(reverse('cart:index'))

    utils.set_cart_cookie(request_cart_with_item, response)
    client.cookies[key] = response.cookies[key]
    variant = request_cart_with_item.lines.first().variant
    url = reverse(
        'skill:add-to-cart',
        kwargs={'slug': skill.get_slug(), 'skill_id': skill.pk})
    data = {'quantity': 1, 'variant': variant.pk}

    client.post(url, data)

    assert Cart.objects.count() == 2
    assert Cart.objects.get(user=admin_user).pk != request_cart_with_item.pk


def test_anonymous_adding_to_cart_with_another_user_token(
        client, skill, customer_user, request_cart_with_item):
    key = utils.COOKIE_NAME
    request_cart_with_item.user = customer_user
    request_cart_with_item.save()

    response = client.get(reverse('cart:index'))

    utils.set_cart_cookie(request_cart_with_item, response)
    client.cookies[key] = response.cookies[key]
    variant = skill.variants.get()
    url = reverse(
        'skill:add-to-cart',
        kwargs={'slug': skill.get_slug(), 'skill_id': skill.pk})
    data = {'quantity': 1, 'variant': variant.pk}

    client.post(url, data)

    assert Cart.objects.count() == 2
    assert Cart.objects.get(user=None).pk != request_cart_with_item.pk


def test_adding_to_cart_with_deleted_cart_token(
        customer_user, authorized_client, skill, request_cart_with_item):
    key = utils.COOKIE_NAME
    request_cart_with_item.user = customer_user
    request_cart_with_item.save()
    old_token = request_cart_with_item.token

    response = authorized_client.get(reverse('cart:index'))

    utils.set_cart_cookie(request_cart_with_item, response)
    authorized_client.cookies[key] = response.cookies[key]
    request_cart_with_item.delete()
    variant = skill.variants.get()
    url = reverse(
        'skill:add-to-cart',
        kwargs={'slug': skill.get_slug(), 'skill_id': skill.pk})
    data = {'quantity': 1, 'variant': variant.pk}

    authorized_client.post(url, data)

    assert Cart.objects.count() == 1
    assert not Cart.objects.filter(token=old_token).exists()


def test_adding_to_cart_with_closed_cart_token(
        customer_user, authorized_client, skill, request_cart_with_item):
    key = utils.COOKIE_NAME
    request_cart_with_item.user = customer_user
    request_cart_with_item.save()

    response = authorized_client.get(reverse('cart:index'))
    utils.set_cart_cookie(request_cart_with_item, response)
    authorized_client.cookies[key] = response.cookies[key]
    variant = skill.variants.get()
    url = reverse(
        'skill:add-to-cart',
        kwargs={'slug': skill.get_slug(), 'skill_id': skill.pk})
    data = {'quantity': 1, 'variant': variant.pk}

    authorized_client.post(url, data)

    assert customer_user.carts.count() == 1


def test_skill_filter_before_filtering(authorized_client, skill, category):
    skills = models.Skill.objects.all().filter(
        category__name=category).order_by('-price')
    url = reverse(
        'skill:category',
        kwargs={
            'slug': category.slug,
            'category_id': category.pk})

    response = authorized_client.get(url)

    assert list(skills) == list(response.context['filter_set'].qs)


def test_skill_filter_skill_exists(authorized_client, skill, category):
    skills = (
        models.Skill.objects.all()
        .filter(category__name=category)
        .order_by('-price'))
    url = reverse(
        'skill:category',
        kwargs={
            'slug': category.slug,
            'category_id': category.pk})
    data = {'price_min': [''], 'price_max': ['20']}

    response = authorized_client.get(url, data)

    assert list(response.context['filter_set'].qs) == list(skills)


def test_skill_filter_skill_does_not_exist(
        authorized_client, skill, category):
    url = reverse(
        'skill:category',
        kwargs={
            'slug': category.slug,
            'category_id': category.pk})
    data = {'price_min': ['20'], 'price_max': ['']}

    response = authorized_client.get(url, data)

    assert not list(response.context['filter_set'].qs)


def test_skill_filter_form(authorized_client, skill, category):
    skills = (
        models.Skill.objects.all()
        .filter(category__name=category)
        .order_by('-price'))
    url = reverse(
        'skill:category',
        kwargs={
            'slug': category.slug,
            'category_id': category.pk})

    response = authorized_client.get(url)

    assert 'price' in response.context['filter_set'].form.fields.keys()
    assert 'sort_by' in response.context['filter_set'].form.fields.keys()
    assert list(response.context['filter_set'].qs) == list(skills)


def test_skill_filter_sorted_by_price_descending(
        authorized_client, skill_list, category):
    skills = (
        models.Skill.objects.all()
        .filter(category__name=category, is_published=True)
        .order_by('-price'))
    url = reverse(
        'skill:category',
        kwargs={
            'slug': category.slug,
            'category_id': category.pk})
    data = {'sort_by': '-price'}

    response = authorized_client.get(url, data)

    assert list(response.context['filter_set'].qs) == list(skills)


def test_skill_filter_sorted_by_wrong_parameter(
        authorized_client, skill, category):
    url = reverse(
        'skill:category',
        kwargs={
            'slug': category.slug,
            'category_id': category.pk})
    data = {'sort_by': 'aaa'}

    response = authorized_client.get(url, data)

    assert not response.context['filter_set'].form.is_valid()
    assert not response.context['skills']


def test_get_variant_picker_data_proper_variant_count(skill):
    data = get_variant_picker_data(
        skill, discounts=None, taxes=None, local_currency=None)

    assert len(data['variantAttributes'][0]['values']) == 1


def test_render_skill_page_with_no_variant(
        unavailable_skill, admin_client):
    skill = unavailable_skill
    skill.is_published = True
    skill.skill_type.has_variants = True
    skill.save()
    status = get_skill_availability_status(skill)
    assert status == SkillAvailabilityStatus.VARIANTS_MISSSING
    url = reverse(
        'skill:details',
        kwargs={'skill_id': skill.pk, 'slug': skill.get_slug()})
    response = admin_client.get(url)
    assert response.status_code == 200


def test_include_skills_from_subcategories_in_main_view(
        category, skill, authorized_client):
    subcategory = models.Category.objects.create(
        name='sub', slug='test', parent=category)
    skill.category = subcategory
    skill.save()
    # URL to parent category view
    url = reverse(
        'skill:category', kwargs={
            'slug': category.slug, 'category_id': category.pk})
    response = authorized_client.get(url)
    assert skill in response.context_data['skills'][0]


@patch('remote_works.skill.thumbnails.create_thumbnails')
def test_create_skill_thumbnails(
        mock_create_thumbnails, skill_with_image):
    skill_image = skill_with_image.images.first()
    create_skill_thumbnails(skill_image.pk)
    assert mock_create_thumbnails.called_once_with(
        skill_image.pk, models.SkillImage, 'skills')


@pytest.mark.parametrize(
    'skill_price, include_taxes_in_prices, include_taxes, include_discounts,'
    'skill_net, skill_gross', [
        ('10.00', False, False, False, '10.00', '10.00'),
        ('10.00', False, True, False, '10.00', '12.30'),
        ('15.00', False, False, True, '10.00', '10.00'),
        ('15.00', False, True, True, '10.00', '12.30'),
        ('10.00', True, False, False, '10.00', '10.00'),
        ('10.00', True, True, False, '8.13', '10.00'),
        ('15.00', True, False, True, '10.00', '10.00'),
        ('15.00', True, True, True, '8.13', '10.00')])
def test_get_price(
        skill_type, category, taxes, sale, skill_price,
        include_taxes_in_prices, include_taxes, include_discounts,
        skill_net, skill_gross, site_settings):
    site_settings.include_taxes_in_prices = include_taxes_in_prices
    site_settings.save()
    skill = models.Skill.objects.create(
        skill_type=skill_type,
        category=category,
        price=Money(skill_price, 'USD'))
    variant = skill.variants.create()

    price = variant.get_price(
        taxes=taxes if include_taxes else None,
        discounts=Sale.objects.all() if include_discounts else None)

    assert price == TaxedMoney(
        net=Money(skill_net, 'USD'), gross=Money(skill_gross, 'USD'))


def test_skill_get_price_variant_has_no_price(
        skill_type, category, taxes, site_settings):
    site_settings.include_taxes_in_prices = False
    site_settings.save()
    skill = models.Skill.objects.create(
        skill_type=skill_type,
        category=category,
        price=Money('10.00', 'USD'))
    variant = skill.variants.create()

    price = variant.get_price(taxes=taxes)

    assert price == TaxedMoney(
        net=Money('10.00', 'USD'), gross=Money('12.30', 'USD'))


def test_skill_get_price_variant_with_price(
        skill_type, category, taxes, site_settings):
    site_settings.include_taxes_in_prices = False
    site_settings.save()
    skill = models.Skill.objects.create(
        skill_type=skill_type,
        category=category,
        price=Money('10.00', 'USD'))
    variant = skill.variants.create(price_override=Money('20.00', 'USD'))

    price = variant.get_price(taxes=taxes)

    assert price == TaxedMoney(
        net=Money('20.00', 'USD'), gross=Money('24.60', 'USD'))


def test_skill_get_price_range_with_variants(
        skill_type, category, taxes, site_settings):
    site_settings.include_taxes_in_prices = False
    site_settings.save()
    skill = models.Skill.objects.create(
        skill_type=skill_type,
        category=category,
        price=Money('15.00', 'USD'))
    skill.variants.create(sku='1')
    skill.variants.create(sku='2', price_override=Money('20.00', 'USD'))
    skill.variants.create(sku='3', price_override=Money('11.00', 'USD'))

    price = skill.get_price_range(taxes=taxes)

    start = TaxedMoney(
        net=Money('11.00', 'USD'), gross=Money('13.53', 'USD'))
    stop = TaxedMoney(
        net=Money('20.00', 'USD'), gross=Money('24.60', 'USD'))
    assert price == TaxedMoneyRange(start=start, stop=stop)


def test_skill_get_price_range_no_variants(
        skill_type, category, taxes, site_settings):
    site_settings.include_taxes_in_prices = False
    site_settings.save()
    skill = models.Skill.objects.create(
        skill_type=skill_type,
        category=category,
        price=Money('10.00', 'USD'))

    price = skill.get_price_range(taxes=taxes)

    expected_price = TaxedMoney(
        net=Money('10.00', 'USD'), gross=Money('12.30', 'USD'))
    assert price == TaxedMoneyRange(start=expected_price, stop=expected_price)


def test_skill_get_price_do_not_charge_taxes(
        skill_type, category, taxes, sale):
    skill = models.Skill.objects.create(
        skill_type=skill_type,
        category=category,
        price=Money('10.00', 'USD'),
        charge_taxes=False)
    variant = skill.variants.create()

    price = variant.get_price(taxes=taxes, discounts=Sale.objects.all())

    assert price == TaxedMoney(
        net=Money('5.00', 'USD'), gross=Money('5.00', 'USD'))


def test_skill_get_price_range_do_not_charge_taxes(
        skill_type, category, taxes, sale):
    skill = models.Skill.objects.create(
        skill_type=skill_type,
        category=category,
        price=Money('10.00', 'USD'),
        charge_taxes=False)

    price = skill.get_price_range(taxes=taxes, discounts=Sale.objects.all())

    expected_price = TaxedMoney(
        net=Money('5.00', 'USD'), gross=Money('5.00', 'USD'))
    assert price == TaxedMoneyRange(start=expected_price, stop=expected_price)


def test_variant_base_price(skill):
    variant = skill.variants.get()
    assert variant.base_price == skill.price

    variant.price_override = Money('15.00', 'USD')
    variant.save()

    assert variant.base_price == variant.price_override


def test_skill_json_serialization(skill):
    skill.price = Money('10.00', 'USD')
    skill.save()
    data = json.loads(serializers.serialize(
        "json", models.Skill.objects.all()))
    assert data[0]['fields']['price'] == {
        '_type': 'Money', 'amount': '10.00', 'currency': 'USD'}


def test_skill_json_deserialization(category, skill_type):
    skill_json = """
    [{{
        "model": "skill.skill",
        "pk": 60,
        "fields": {{
            "seo_title": null,
            "seo_description": "Future almost cup national.",
            "skill_type": {skill_type_pk},
            "name": "Kelly-Clark",
            "description": "Future almost cup national",
            "category": {category_pk},
            "price": {{"_type": "Money", "amount": "35.98", "currency": "USD"}},
            "publication_date": null,
            "is_published": true,
            "attributes": "{{\\"9\\": \\"24\\", \\"10\\": \\"26\\"}}",
            "updated_at": "2018-07-19T13:30:24.195Z",
            "is_featured": false,
            "charge_taxes": true,
            "tax_rate": "standard"
        }}
    }}]
    """.format(
        category_pk=category.pk, skill_type_pk=skill_type.pk)
    skill_deserialized = list(serializers.deserialize(
        'json', skill_json, ignorenonexistent=True))[0]
    skill_deserialized.save()
    skill = models.Skill.objects.first()
    assert skill.price == Money(Decimal('35.98'), 'USD')

    # same test for bytes
    skill_json_bytes = bytes(skill_json, 'utf-8')
    skill_deserialized = list(serializers.deserialize(
        'json', skill_json_bytes, ignorenonexistent=True))[0]
    skill_deserialized.save()
    skill = models.Skill.objects.first()
    assert skill.price == Money(Decimal('35.98'), 'USD')

    # same test for stream
    skill_json_stream = io.StringIO(skill_json)
    skill_deserialized = list(serializers.deserialize(
        'json', skill_json_stream, ignorenonexistent=True))[0]
    skill_deserialized.save()
    skill = models.Skill.objects.first()
    assert skill.price == Money(Decimal('35.98'), 'USD')


def test_json_no_currency_deserialization(category, skill_type):
    skill_json = """
    [{{
        "model": "skill.skill",
        "pk": 60,
        "fields": {{
            "seo_title": null,
            "seo_description": "Future almost cup national.",
            "skill_type": {skill_type_pk},
            "name": "Kelly-Clark",
            "description": "Future almost cup national",
            "category": {category_pk},
            "price": {{"_type": "Money", "amount": "35.98"}},
            "publication_date": null,
            "is_published": true,
            "attributes": "{{\\"9\\": \\"24\\", \\"10\\": \\"26\\"}}",
            "updated_at": "2018-07-19T13:30:24.195Z",
            "is_featured": false,
            "charge_taxes": true,
            "tax_rate": "standard"
        }}
    }}]
    """.format(
        category_pk=category.pk, skill_type_pk=skill_type.pk)
    with pytest.raises(DeserializationError):
        list(serializers.deserialize(
            'json', skill_json, ignorenonexistent=True))


def test_variant_picker_data_with_translations(
        skill, translated_variant_fr, settings):
    settings.LANGUAGE_CODE = 'fr'
    variant_picker_data = get_variant_picker_data(skill)
    attribute = variant_picker_data['variantAttributes'][0]
    assert attribute['name'] == translated_variant_fr.name


def test_get_skill_attributes_data_translation(
        skill, settings, translated_attribute):
    settings.LANGUAGE_CODE = 'fr'
    attributes_data = get_skill_attributes_data(skill)
    attributes_keys = [attr.name for attr in attributes_data.keys()]
    assert translated_attribute.name in attributes_keys


def test_homepage_collection_render(
        client, site_settings, collection, skill_list):
    collection.skills.add(*skill_list)
    site_settings.homepage_collection = collection
    site_settings.save()

    response = client.get(reverse('home'))
    assert response.status_code == 200
    skills_in_context = {
        skill[0] for skill in response.context['skills']}
    skills_available = {
        skill for skill in skill_list if skill.is_published}
    assert skills_in_context == skills_available
