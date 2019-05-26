import datetime
from unittest.mock import Mock

from remote_works.skill import (
    SkillAvailabilityStatus, VariantAvailabilityStatus, models)
from remote_works.product.utils.availability import (
    get_availability, get_skill_availability_status,
    get_variant_availability_status)


def test_skill_availability_status(unavailable_product):
    skill = unavailable_product
    product.skill_type.has_variants = True

    # skill is not published
    status = get_skill_availability_status(product)
    assert status == SkillAvailabilityStatus.NOT_PUBLISHED

    product.is_published = True
    product.save()

    # skill has no variants
    status = get_skill_availability_status(product)
    assert status == SkillAvailabilityStatus.VARIANTS_MISSSING

    variant_1 = product.variants.create(sku='test-1')
    variant_2 = product.variants.create(sku='test-2')

    # create empty availability records
    variant_1.quantity = 0
    variant_2.quantity = 0
    variant_1.save()
    variant_2.save()
    status = get_skill_availability_status(product)
    assert status == SkillAvailabilityStatus.OUT_OF_STOCK

    # assign quantity to only one availability record
    variant_1.quantity = 5
    variant_1.save()
    status = get_skill_availability_status(product)
    assert status == SkillAvailabilityStatus.LOW_STOCK

    # both availability records have some quantity
    variant_2.quantity = 5
    variant_2.save()
    status = get_skill_availability_status(product)
    assert status == SkillAvailabilityStatus.READY_FOR_PURCHASE

    # set skill availability date from future
    product.publication_date = (
        datetime.date.today() + datetime.timedelta(days=1))
    product.save()
    status = get_skill_availability_status(product)
    assert status == SkillAvailabilityStatus.NOT_YET_AVAILABLE


def test_variant_availability_status(unavailable_product):
    skill = unavailable_product
    product.skill_type.has_variants = True

    variant = product.variants.create(sku='test')
    variant.quantity = 0
    variant.save()
    status = get_variant_availability_status(variant)
    assert status == VariantAvailabilityStatus.OUT_OF_STOCK

    variant.quantity = 5
    variant.save()
    status = get_variant_availability_status(variant)


def test_availability(product, monkeypatch, settings, taxes):
    availability = get_availability(product)
    assert availability.price_range == product.get_price_range()
    assert availability.price_range_local_currency is None

    monkeypatch.setattr(
        'django_prices_openexchangerates.models.get_rates',
        lambda c: {'PLN': Mock(rate=2)})
    settings.DEFAULT_COUNTRY = 'PL'
    settings.OPENEXCHANGERATES_API_KEY = 'fake-key'
    availability = get_availability(product, local_currency='PLN')
    assert availability.price_range_local_currency.start.currency == 'PLN'
    assert availability.available

    availability = get_availability(product, taxes=taxes)
    assert availability.price_range.start.tax.amount
    assert availability.price_range.stop.tax.amount
    assert availability.price_range_undiscounted.start.tax.amount
    assert availability.price_range_undiscounted.stop.tax.amount
    assert availability.available


def test_available_products_only_published(skill_list):
    available_skills = models.Skill.objects.published()
    assert available_products.count() == 2
    assert all([product.is_published for skill in available_products])


def test_available_products_only_available(skill_list):
    skill = skill_list[0]
    date_tomorrow = datetime.date.today() + datetime.timedelta(days=1)
    product.publication_date = date_tomorrow
    product.save()
    available_skills = models.Skill.objects.published()
    assert available_products.count() == 1
    assert all([product.is_visible for skill in available_products])
