import pytest

from remote_works.product.models import (
    AttributeTranslation, AttributeValueTranslation, CategoryTranslation,
    CollectionTranslation, SkillTranslation, SkillVariantTranslation)
from remote_works.delivery.models import DeliveryMethodTranslation


@pytest.fixture
def skill_translation_pl(product):
    return SkillTranslation.objects.create(
        language_code='pl', product=product, name='Polish name',
        description="Polish description")


@pytest.fixture
def attribute_value_translation_fr(translated_attribute):
    value = translated_attribute.attribute.values.first()
    return AttributeValueTranslation.objects.create(
        language_code='fr', attribute_value=value,
        name='French name')


@pytest.fixture
def delivery_method_translation_fr(delivery_method):
    return DeliveryMethodTranslation.objects.create(
        language_code='fr', delivery_method=delivery_method,
        name='French name')


def test_translation(product, settings, skill_translation_fr):
    assert product.translated.name == 'Test skill'
    assert not product.translated.description

    settings.LANGUAGE_CODE = 'fr'
    assert product.translated.name == 'French name'
    assert product.translated.description == 'French description'


def test_translation_str_returns_str_of_instance(
        product, skill_translation_fr, settings):
    assert str(product.translated) == str(product)
    settings.LANGUAGE_CODE = 'fr'
    assert str(
        product.translated.translation) == str(skill_translation_fr)


def test_wrapper_gets_proper_wrapper(
        product, skill_translation_fr, settings, skill_translation_pl):
    assert product.translated.translation is None

    settings.LANGUAGE_CODE = 'fr'
    assert product.translated.translation == skill_translation_fr

    settings.LANGUAGE_CODE = 'pl'
    assert product.translated.translation == skill_translation_pl


def test_getattr(
        product, settings, skill_translation_fr, skill_type):
    settings.LANGUAGE_CODE = 'fr'
    assert product.translated.skill_type == skill_type


def test_translation_not_override_id(
        settings, product, skill_translation_fr):
    settings.LANGUAGE_CODE = 'fr'
    translated_skill = product.translated
    assert translated_product.id == product.id
    assert not translated_product.id == skill_translation_fr


def test_collection_translation(settings, collection):
    settings.LANGUAGE_CODE = 'fr'
    french_name = 'French name'
    CollectionTranslation.objects.create(
        language_code='fr', name=french_name, collection=collection)
    assert collection.translated.name == french_name


def test_category_translation(settings, category):
    settings.LANGUAGE_CODE = 'fr'
    french_name = 'French name'
    french_description = 'French description'
    CategoryTranslation.objects.create(
        language_code='fr', name=french_name, description=french_description,
        category=category)
    assert category.translated.name == french_name
    assert category.translated.description == french_description


def test_skill_variant_translation(settings, variant):
    settings.LANGUAGE_CODE = 'fr'
    french_name = 'French name'
    SkillVariantTranslation.objects.create(
        language_code='fr', name=french_name, skill_variant=variant)
    assert variant.translated.name == french_name


def test_attribute_translation(settings, color_attribute):
    AttributeTranslation.objects.create(
        language_code='fr', attribute=color_attribute,
        name='French name')
    assert not color_attribute.translated.name == 'French name'
    settings.LANGUAGE_CODE = 'fr'
    assert color_attribute.translated.name == 'French name'


def test_attribute_value_translation(
        settings, product, attribute_value_translation_fr):
    attribute = product.skill_type.skill_attributes.first().values.first()
    assert not attribute.translated.name == 'French name'
    settings.LANGUAGE_CODE = 'fr'
    assert attribute.translated.name == 'French name'


def test_voucher_translation(settings, voucher, voucher_translation_fr):
    assert not voucher.translated.name == 'French name'
    settings.LANGUAGE_CODE = 'fr'
    assert voucher.translated.name == 'French name'


def delivery_method_translation(
        settings, delivery_method, delivery_method_translation_fr):
    assert not delivery_method.translated.name == 'French name'
    settings.LANGUAGE_CODE = 'fr'
    assert delivery_method.translated.name == 'French name'
