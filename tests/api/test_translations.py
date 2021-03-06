import graphene
import pytest
from tests.api.utils import get_graphql_content

from remote_works.graphql.translations.schema import TranslatableKinds


def test_skill_translation(user_api_client, product):
    product.translations.create(language_code='pl', name='Produkt')

    query = """
    query productById($productId: ID!) {
        skill(id: $productId) {
            translation(languageCode: "pl") {
                name
                language {
                    code
                }
            }
        }
    }
    """

    skill_id = graphene.Node.to_global_id('Skill', product.id)
    response = user_api_client.post_graphql(query, {'productId': skill_id})
    data = get_graphql_content(response)['data']

    assert data['skill']['translation']['name'] == 'Produkt'
    assert data['skill']['translation']['language']['code'] == 'pl'


def test_skill_variant_translation(user_api_client, variant):
    variant.translations.create(language_code='pl', name='Wariant')

    query = """
    query productVariantById($productVariantId: ID!) {
        productVariant(id: $productVariantId) {
            translation(languageCode: "pl") {
                name
                language {
                    code
                }
            }
        }
    }
    """

    skill_variant_id = graphene.Node.to_global_id(
        'SkillVariant', variant.id)
    response = user_api_client.post_graphql(
        query, {'productVariantId': skill_variant_id})
    data = get_graphql_content(response)['data']

    assert data['productVariant']['translation']['name'] == 'Wariant'
    assert data['productVariant']['translation']['language']['code'] == 'pl'


def test_collection_translation(user_api_client, collection):
    collection.translations.create(language_code='pl', name='Kolekcja')

    query = """
    query collectionById($collectionId: ID!) {
        collection(id: $collectionId) {
            translation(languageCode: "pl") {
                name
                language {
                    code
                }
            }
        }
    }
    """

    collection_id = graphene.Node.to_global_id('Collection', collection.id)
    response = user_api_client.post_graphql(
        query, {'collectionId': collection_id})
    data = get_graphql_content(response)['data']

    assert data['collection']['translation']['name'] == 'Kolekcja'
    assert data['collection']['translation']['language']['code'] == 'pl'


def test_category_translation(user_api_client, category):
    category.translations.create(language_code='pl', name='Kategoria')

    query = """
    query categoryById($categoryId: ID!) {
        category(id: $categoryId) {
            translation(languageCode: "pl") {
                name
                language {
                    code
                }
            }
        }
    }
    """

    category_id = graphene.Node.to_global_id('Category', category.id)
    response = user_api_client.post_graphql(query, {'categoryId': category_id})
    data = get_graphql_content(response)['data']

    assert data['category']['translation']['name'] == 'Kategoria'
    assert data['category']['translation']['language']['code'] == 'pl'


def test_voucher_translation(
        staff_api_client, voucher, permission_manage_discounts):
    voucher.translations.create(language_code='pl', name='Bon')

    query = """
    query voucherById($voucherId: ID!) {
        voucher(id: $voucherId) {
            translation(languageCode: "pl") {
                name
                language {
                    code
                }
            }
        }
    }
    """

    voucher_id = graphene.Node.to_global_id('Voucher', voucher.id)
    response = staff_api_client.post_graphql(
        query, {'voucherId': voucher_id},
        permissions=[permission_manage_discounts])
    data = get_graphql_content(response)['data']

    assert data['voucher']['translation']['name'] == 'Bon'
    assert data['voucher']['translation']['language']['code'] == 'pl'


def test_page_translation(user_api_client, page):
    page.translations.create(language_code='pl', title='Strona')

    query = """
    query pageById($pageId: ID!) {
        page(id: $pageId) {
            translation(languageCode: "pl") {
                title
                language {
                    code
                }
            }
        }
    }
    """

    page_id = graphene.Node.to_global_id('Page', page.id)
    response = user_api_client.post_graphql(query, {'pageId': page_id})
    data = get_graphql_content(response)['data']

    assert data['page']['translation']['title'] == 'Strona'
    assert data['page']['translation']['language']['code'] == 'pl'


def test_attribute_translation(user_api_client, color_attribute):
    color_attribute.translations.create(language_code='pl', name='Kolor')

    query = """
    query {
        attributes(first: 1) {
            edges {
                node {
                    translation(languageCode: "pl") {
                        name
                        language {
                            code
                        }
                    }
                }
            }
        }
    }
    """

    response = user_api_client.post_graphql(query)
    data = get_graphql_content(response)['data']

    attribute = data['attributes']['edges'][0]['node']
    assert attribute['translation']['name'] == 'Kolor'
    assert attribute['translation']['language']['code'] == 'pl'


def test_attribute_value_translation(user_api_client, pink_attribute_value):
    pink_attribute_value.translations.create(language_code='pl', name='Różowy')

    query = """
    query {
        attributes(first: 1) {
            edges {
                node {
                    values {
                        translation(languageCode: "pl") {
                            name
                            language {
                                code
                            }
                        }
                    }
                }
            }
        }
    }
    """

    attribute_value_id = graphene.Node.to_global_id(
        'AttributeValue', pink_attribute_value.id)
    response = user_api_client.post_graphql(
        query, {'attributeValueId': attribute_value_id})
    data = get_graphql_content(response)['data']

    attribute_value = data['attributes']['edges'][0]['node']['values'][-1]
    assert attribute_value['translation']['name'] == 'Różowy'
    assert attribute_value['translation']['language']['code'] == 'pl'


def test_delivery_method_translation(
        staff_api_client, delivery_method, permission_manage_delivery):
    delivery_method.translations.create(language_code='pl', name='DHL Polska')

    query = """
    query deliveryZoneById($deliveryZoneId: ID!) {
        deliveryZone(id: $deliveryZoneId) {
            deliveryMethods {
                translation(languageCode: "pl") {
                    name
                    language {
                        code
                    }
                }
            }
        }
    }
    """

    delivery_zone_id = graphene.Node.to_global_id(
        'DeliveryZone', delivery_method.delivery_zone.id)
    response = staff_api_client.post_graphql(
        query, {'deliveryZoneId': delivery_zone_id},
        permissions=[permission_manage_delivery])
    data = get_graphql_content(response)['data']

    delivery_method = data['deliveryZone']['deliveryMethods'][0]
    assert delivery_method['translation']['name'] == 'DHL Polska'
    assert delivery_method['translation']['language']['code'] == 'pl'


def test_menu_item_translation(user_api_client, menu_item):
    menu_item.translations.create(language_code='pl', name='Odnośnik 1')

    query = """
    query menuItemById($menuItemId: ID!) {
        menuItem(id: $menuItemId) {
            translation(languageCode: "pl") {
                name
                language {
                    code
                }
            }
        }
    }
    """

    menu_item_id = graphene.Node.to_global_id('MenuItem', menu_item.id)
    response = user_api_client.post_graphql(
        query, {'menuItemId': menu_item_id})
    data = get_graphql_content(response)['data']

    assert data['menuItem']['translation']['name'] == 'Odnośnik 1'
    assert data['menuItem']['translation']['language']['code'] == 'pl'


def test_shop_translation(user_api_client, site_settings):
    site_settings.translations.create(
        language_code='pl', header_text='Nagłówek')

    query = """
    query {
        shop {
            translation(languageCode: "pl") {
                headerText
                language {
                    code
                }
            }
        }
    }
    """

    response = user_api_client.post_graphql(query)
    data = get_graphql_content(response)['data']

    assert data['shop']['translation']['headerText'] == 'Nagłówek'
    assert data['shop']['translation']['language']['code'] == 'pl'


def test_skill_no_translation(user_api_client, product):
    query = """
    query productById($productId: ID!) {
        skill(id: $productId) {
            translation(languageCode: "pl") {
                name
                language {
                    code
                }
            }
        }
    }
    """

    skill_id = graphene.Node.to_global_id('Skill', product.id)
    response = user_api_client.post_graphql(query, {'productId': skill_id})
    data = get_graphql_content(response)['data']

    assert data['skill']['translation'] is None


def test_skill_variant_no_translation(user_api_client, variant):
    query = """
    query productVariantById($productVariantId: ID!) {
        productVariant(id: $productVariantId) {
            translation(languageCode: "pl") {
                name
                language {
                    code
                }
            }
        }
    }
    """

    skill_variant_id = graphene.Node.to_global_id(
        'SkillVariant', variant.id)
    response = user_api_client.post_graphql(
        query, {'productVariantId': skill_variant_id})
    data = get_graphql_content(response)['data']

    assert data['productVariant']['translation'] is None


def test_collection_no_translation(user_api_client, collection):
    query = """
    query collectionById($collectionId: ID!) {
        collection(id: $collectionId) {
            translation(languageCode: "pl") {
                name
                language {
                    code
                }
            }
        }
    }
    """

    collection_id = graphene.Node.to_global_id('Collection', collection.id)
    response = user_api_client.post_graphql(
        query, {'collectionId': collection_id})
    data = get_graphql_content(response)['data']

    assert data['collection']['translation'] is None


def test_category_no_translation(user_api_client, category):
    query = """
    query categoryById($categoryId: ID!) {
        category(id: $categoryId) {
            translation(languageCode: "pl") {
                name
                language {
                    code
                }
            }
        }
    }
    """

    category_id = graphene.Node.to_global_id('Category', category.id)
    response = user_api_client.post_graphql(query, {'categoryId': category_id})
    data = get_graphql_content(response)['data']

    assert data['category']['translation'] is None


def test_voucher_no_translation(
        staff_api_client, voucher, permission_manage_discounts):
    query = """
    query voucherById($voucherId: ID!) {
        voucher(id: $voucherId) {
            translation(languageCode: "pl") {
                name
                language {
                    code
                }
            }
        }
    }
    """

    voucher_id = graphene.Node.to_global_id('Voucher', voucher.id)
    response = staff_api_client.post_graphql(
        query, {'voucherId': voucher_id},
        permissions=[permission_manage_discounts])
    data = get_graphql_content(response)['data']

    assert data['voucher']['translation'] is None


def test_page_no_translation(user_api_client, page):
    query = """
    query pageById($pageId: ID!) {
        page(id: $pageId) {
            translation(languageCode: "pl") {
                title
                language {
                    code
                }
            }
        }
    }
    """

    page_id = graphene.Node.to_global_id('Page', page.id)
    response = user_api_client.post_graphql(query, {'pageId': page_id})
    data = get_graphql_content(response)['data']

    assert data['page']['translation'] is None


def test_attribute_no_translation(user_api_client, color_attribute):
    query = """
    query {
        attributes(first: 1) {
            edges {
                node {
                    translation(languageCode: "pl") {
                        name
                        language {
                            code
                        }
                    }
                }
            }
        }
    }
    """

    response = user_api_client.post_graphql(query)
    data = get_graphql_content(response)['data']

    attribute = data['attributes']['edges'][0]['node']
    assert attribute['translation'] is None


def test_attribute_value_no_translation(user_api_client, pink_attribute_value):
    query = """
    query {
        attributes(first: 1) {
            edges {
                node {
                    values {
                        translation(languageCode: "pl") {
                            name
                            language {
                                code
                            }
                        }
                    }
                }
            }
        }
    }
    """

    attribute_value_id = graphene.Node.to_global_id(
        'AttributeValue', pink_attribute_value.id)
    response = user_api_client.post_graphql(
        query, {'attributeValueId': attribute_value_id})
    data = get_graphql_content(response)['data']

    attribute_value = data['attributes']['edges'][0]['node']['values'][-1]
    assert attribute_value['translation'] is None


def test_delivery_method_no_translation(
        staff_api_client, delivery_method, permission_manage_delivery):
    query = """
    query deliveryZoneById($deliveryZoneId: ID!) {
        deliveryZone(id: $deliveryZoneId) {
            deliveryMethods {
                translation(languageCode: "pl") {
                    name
                    language {
                        code
                    }
                }
            }
        }
    }
    """

    delivery_zone_id = graphene.Node.to_global_id(
        'DeliveryZone', delivery_method.delivery_zone.id)
    response = staff_api_client.post_graphql(
        query, {'deliveryZoneId': delivery_zone_id},
        permissions=[permission_manage_delivery])
    data = get_graphql_content(response)['data']

    delivery_method = data['deliveryZone']['deliveryMethods'][0]
    assert delivery_method['translation'] is None


def test_menu_item_no_translation(user_api_client, menu_item):
    query = """
    query menuItemById($menuItemId: ID!) {
        menuItem(id: $menuItemId) {
            translation(languageCode: "pl") {
                name
                language {
                    code
                }
            }
        }
    }
    """

    menu_item_id = graphene.Node.to_global_id('MenuItem', menu_item.id)
    response = user_api_client.post_graphql(
        query, {'menuItemId': menu_item_id})
    data = get_graphql_content(response)['data']

    assert data['menuItem']['translation'] is None


def test_shop_no_translation(user_api_client, site_settings):
    query = """
    query {
        shop {
            translation(languageCode: "pl") {
                headerText
                language {
                    code
                }
            }
        }
    }
    """

    response = user_api_client.post_graphql(query)
    data = get_graphql_content(response)['data']

    assert data['shop']['translation'] is None


def test_skill_create_translation(
        staff_api_client, product, permission_manage_translations):
    query = """
    mutation productTranslate($productId: ID!) {
        productTranslate(
                id: $productId, languageCode: "pl",
                input: {name: "Produkt PL"}) {
            skill {
                translation(languageCode: "pl") {
                    name
                    language {
                        code
                    }
                }
            }
        }
    }
    """

    skill_id = graphene.Node.to_global_id('Skill', product.id)
    response = staff_api_client.post_graphql(
        query, {'productId': skill_id},
        permissions=[permission_manage_translations])
    data = get_graphql_content(response)['data']['productTranslate']

    assert data['skill']['translation']['name'] == 'Produkt PL'
    assert data['skill']['translation']['language']['code'] == 'pl'


def test_skill_update_translation(
        staff_api_client, product, permission_manage_translations):
    product.translations.create(language_code='pl', name='Produkt')

    query = """
    mutation productTranslate($productId: ID!) {
        productTranslate(
                id: $productId, languageCode: "pl",
                input: {name: "Produkt PL"}) {
            skill {
                translation(languageCode: "pl") {
                    name
                    language {
                        code
                    }
                }
            }
        }
    }
    """

    skill_id = graphene.Node.to_global_id('Skill', product.id)
    response = staff_api_client.post_graphql(
        query, {'productId': skill_id},
        permissions=[permission_manage_translations])
    data = get_graphql_content(response)['data']['productTranslate']

    assert data['skill']['translation']['name'] == 'Produkt PL'
    assert data['skill']['translation']['language']['code'] == 'pl'


def test_skill_variant_create_translation(
        staff_api_client, variant, permission_manage_translations):
    query = """
    mutation productVariantTranslate($productVariantId: ID!) {
        productVariantTranslate(
                id: $productVariantId, languageCode: "pl",
                input: {name: "Wariant PL"}) {
            productVariant {
                translation(languageCode: "pl") {
                    name
                    language {
                        code
                    }
                }
            }
        }
    }
    """

    skill_variant_id = graphene.Node.to_global_id(
        'SkillVariant', variant.id)
    response = staff_api_client.post_graphql(
        query, {'productVariantId': skill_variant_id},
        permissions=[permission_manage_translations])
    data = get_graphql_content(response)['data']['productVariantTranslate']

    assert data['productVariant']['translation']['name'] == 'Wariant PL'
    assert data['productVariant']['translation']['language']['code'] == 'pl'


def test_skill_variant_update_translation(
        staff_api_client, variant, permission_manage_translations):
    variant.translations.create(language_code='pl', name='Wariant')

    query = """
    mutation productVariantTranslate($productVariantId: ID!) {
        productVariantTranslate(
                id: $productVariantId, languageCode: "pl",
                input: {name: "Wariant PL"}) {
            productVariant {
                translation(languageCode: "pl") {
                    name
                    language {
                        code
                    }
                }
            }
        }
    }
    """

    skill_variant_id = graphene.Node.to_global_id(
        'SkillVariant', variant.id)
    response = staff_api_client.post_graphql(
        query, {'productVariantId': skill_variant_id},
        permissions=[permission_manage_translations])
    data = get_graphql_content(response)['data']['productVariantTranslate']

    assert data['productVariant']['translation']['name'] == 'Wariant PL'
    assert data['productVariant']['translation']['language']['code'] == 'pl'


def test_collection_create_translation(
        staff_api_client, collection, permission_manage_translations):
    query = """
    mutation collectionTranslate($collectionId: ID!) {
        collectionTranslate(
                id: $collectionId, languageCode: "pl",
                input: {name: "Kolekcja PL"}) {
            collection {
                translation(languageCode: "pl") {
                    name
                    language {
                        code
                    }
                }
            }
        }
    }
    """

    collection_id = graphene.Node.to_global_id('Collection', collection.id)
    response = staff_api_client.post_graphql(
        query, {'collectionId': collection_id},
        permissions=[permission_manage_translations])
    data = get_graphql_content(response)['data']['collectionTranslate']

    assert data['collection']['translation']['name'] == 'Kolekcja PL'
    assert data['collection']['translation']['language']['code'] == 'pl'


def test_collection_update_translation(
        staff_api_client, collection, permission_manage_translations):
    collection.translations.create(language_code='pl', name='Kolekcja')

    query = """
    mutation collectionTranslate($collectionId: ID!) {
        collectionTranslate(
                id: $collectionId, languageCode: "pl",
                input: {name: "Kolekcja PL"}) {
            collection {
                translation(languageCode: "pl") {
                    name
                    language {
                        code
                    }
                }
            }
        }
    }
    """

    collection_id = graphene.Node.to_global_id('Collection', collection.id)
    response = staff_api_client.post_graphql(
        query, {'collectionId': collection_id},
        permissions=[permission_manage_translations])
    data = get_graphql_content(response)['data']['collectionTranslate']

    assert data['collection']['translation']['name'] == 'Kolekcja PL'
    assert data['collection']['translation']['language']['code'] == 'pl'


def test_category_create_translation(
        staff_api_client, category, permission_manage_translations):
    query = """
    mutation categoryTranslate($categoryId: ID!) {
        categoryTranslate(
                id: $categoryId, languageCode: "pl",
                input: {name: "Kategoria PL"}) {
            category {
                translation(languageCode: "pl") {
                    name
                    language {
                        code
                    }
                }
            }
        }
    }
    """

    category_id = graphene.Node.to_global_id('Category', category.id)
    response = staff_api_client.post_graphql(
        query, {'categoryId': category_id},
        permissions=[permission_manage_translations])
    data = get_graphql_content(response)['data']['categoryTranslate']

    assert data['category']['translation']['name'] == 'Kategoria PL'
    assert data['category']['translation']['language']['code'] == 'pl'


def test_category_update_translation(
        staff_api_client, category, permission_manage_translations):
    category.translations.create(language_code='pl', name='Kategoria')

    query = """
    mutation categoryTranslate($categoryId: ID!) {
        categoryTranslate(
                id: $categoryId, languageCode: "pl",
                input: {name: "Kategoria PL"}) {
            category {
                translation(languageCode: "pl") {
                    name
                    language {
                        code
                    }
                }
            }
        }
    }
    """

    category_id = graphene.Node.to_global_id('Category', category.id)
    response = staff_api_client.post_graphql(
        query, {'categoryId': category_id},
        permissions=[permission_manage_translations])
    data = get_graphql_content(response)['data']['categoryTranslate']

    assert data['category']['translation']['name'] == 'Kategoria PL'
    assert data['category']['translation']['language']['code'] == 'pl'


def test_voucher_create_translation(
        staff_api_client, voucher, permission_manage_translations):
    query = """
    mutation voucherTranslate($voucherId: ID!) {
        voucherTranslate(
                id: $voucherId, languageCode: "pl",
                input: {name: "Bon PL"}) {
            voucher {
                translation(languageCode: "pl") {
                    name
                    language {
                        code
                    }
                }
            }
        }
    }
    """

    voucher_id = graphene.Node.to_global_id('Voucher', voucher.id)
    response = staff_api_client.post_graphql(
        query, {'voucherId': voucher_id},
        permissions=[permission_manage_translations])
    data = get_graphql_content(response)['data']['voucherTranslate']

    assert data['voucher']['translation']['name'] == 'Bon PL'
    assert data['voucher']['translation']['language']['code'] == 'pl'


def test_voucher_update_translation(
        staff_api_client, voucher, permission_manage_translations):
    voucher.translations.create(language_code='pl', name='Kategoria')

    query = """
    mutation voucherTranslate($voucherId: ID!) {
        voucherTranslate(
                id: $voucherId, languageCode: "pl",
                input: {name: "Bon PL"}) {
            voucher {
                translation(languageCode: "pl") {
                    name
                    language {
                        code
                    }
                }
            }
        }
    }
    """

    voucher_id = graphene.Node.to_global_id('Voucher', voucher.id)
    response = staff_api_client.post_graphql(
        query, {'voucherId': voucher_id},
        permissions=[permission_manage_translations])
    data = get_graphql_content(response)['data']['voucherTranslate']

    assert data['voucher']['translation']['name'] == 'Bon PL'
    assert data['voucher']['translation']['language']['code'] == 'pl'


def test_page_create_translation(
        staff_api_client, page, permission_manage_translations):
    query = """
    mutation pageTranslate($pageId: ID!) {
        pageTranslate(
                id: $pageId, languageCode: "pl",
                input: {title: "Strona PL"}) {
            page {
                translation(languageCode: "pl") {
                    title
                    language {
                        code
                    }
                }
            }
        }
    }
    """

    page_id = graphene.Node.to_global_id('Page', page.id)
    response = staff_api_client.post_graphql(
        query, {'pageId': page_id},
        permissions=[permission_manage_translations])
    data = get_graphql_content(response)['data']['pageTranslate']

    assert data['page']['translation']['title'] == 'Strona PL'
    assert data['page']['translation']['language']['code'] == 'pl'


def test_page_update_translation(
        staff_api_client, page, permission_manage_translations):
    page.translations.create(language_code='pl', title='Strona')

    query = """
    mutation pageTranslate($pageId: ID!) {
        pageTranslate(
                id: $pageId, languageCode: "pl",
                input: {title: "Strona PL"}) {
            page {
                translation(languageCode: "pl") {
                    title
                    language {
                        code
                    }
                }
            }
        }
    }
    """

    page_id = graphene.Node.to_global_id('Page', page.id)
    response = staff_api_client.post_graphql(
        query, {'pageId': page_id},
        permissions=[permission_manage_translations])
    data = get_graphql_content(response)['data']['pageTranslate']

    assert data['page']['translation']['title'] == 'Strona PL'
    assert data['page']['translation']['language']['code'] == 'pl'


def test_attribute_create_translation(
        staff_api_client, color_attribute, permission_manage_translations):
    query = """
    mutation attributeTranslate($attributeId: ID!) {
        attributeTranslate(
                id: $attributeId, languageCode: "pl",
                input: {name: "Kolor PL"}) {
            attribute {
                translation(languageCode: "pl") {
                    name
                    language {
                        code
                    }
                }
            }
        }
    }
    """

    attribute_id = graphene.Node.to_global_id('Attribute', color_attribute.id)
    response = staff_api_client.post_graphql(
        query, {'attributeId': attribute_id},
        permissions=[permission_manage_translations])
    data = get_graphql_content(response)['data']['attributeTranslate']

    assert data['attribute']['translation']['name'] == 'Kolor PL'
    assert data['attribute']['translation']['language']['code'] == 'pl'


def test_attribute_update_translation(
        staff_api_client, color_attribute, permission_manage_translations):
    color_attribute.translations.create(language_code='pl', name='Kolor')

    query = """
    mutation attributeTranslate($attributeId: ID!) {
        attributeTranslate(
                id: $attributeId, languageCode: "pl",
                input: {name: "Kolor PL"}) {
            attribute {
                translation(languageCode: "pl") {
                    name
                    language {
                        code
                    }
                }
            }
        }
    }
    """

    attribute_id = graphene.Node.to_global_id('Attribute', color_attribute.id)
    response = staff_api_client.post_graphql(
        query, {'attributeId': attribute_id},
        permissions=[permission_manage_translations])
    data = get_graphql_content(response)['data']['attributeTranslate']

    assert data['attribute']['translation']['name'] == 'Kolor PL'
    assert data['attribute']['translation']['language']['code'] == 'pl'


def test_attribute_value_create_translation(
        staff_api_client, pink_attribute_value,
        permission_manage_translations):
    query = """
    mutation attributeValueTranslate($attributeValueId: ID!) {
        attributeValueTranslate(
                id: $attributeValueId, languageCode: "pl",
                input: {name: "Róż PL"}) {
            attributeValue {
                translation(languageCode: "pl") {
                    name
                    language {
                        code
                    }
                }
            }
        }
    }
    """

    attribute_value_id = graphene.Node.to_global_id(
        'AttributeValue', pink_attribute_value.id)
    response = staff_api_client.post_graphql(
        query, {'attributeValueId': attribute_value_id},
        permissions=[permission_manage_translations])
    data = get_graphql_content(response)['data']['attributeValueTranslate']

    assert data['attributeValue']['translation']['name'] == 'Róż PL'
    assert data['attributeValue']['translation']['language']['code'] == 'pl'


def test_attribute_value_update_translation(
        staff_api_client, pink_attribute_value,
        permission_manage_translations):
    pink_attribute_value.translations.create(
        language_code='pl', name='Różowy')

    query = """
    mutation attributeValueTranslate($attributeValueId: ID!) {
        attributeValueTranslate(
                id: $attributeValueId, languageCode: "pl",
                input: {name: "Róż PL"}) {
            attributeValue {
                translation(languageCode: "pl") {
                    name
                    language {
                        code
                    }
                }
            }
        }
    }
    """

    attribute_value_id = graphene.Node.to_global_id(
        'AttributeValue', pink_attribute_value.id)
    response = staff_api_client.post_graphql(
        query, {'attributeValueId': attribute_value_id},
        permissions=[permission_manage_translations])
    data = get_graphql_content(response)['data']['attributeValueTranslate']

    assert data['attributeValue']['translation']['name'] == 'Róż PL'
    assert data['attributeValue']['translation']['language']['code'] == 'pl'


def test_delivery_method_create_translation(
        staff_api_client, delivery_method, permission_manage_translations):
    query = """
    mutation deliveryPriceTranslate($deliveryMethodId: ID!) {
        deliveryPriceTranslate(
                id: $deliveryMethodId, languageCode: "pl",
                input: {name: "DHL PL"}) {
            deliveryMethod {
                translation(languageCode: "pl") {
                    name
                    language {
                        code
                    }
                }
            }
        }
    }
    """

    delivery_method_id = graphene.Node.to_global_id(
        'DeliveryMethod', delivery_method.id)
    response = staff_api_client.post_graphql(
        query, {'deliveryMethodId': delivery_method_id},
        permissions=[permission_manage_translations])
    data = get_graphql_content(response)['data']['deliveryPriceTranslate']

    assert data['deliveryMethod']['translation']['name'] == 'DHL PL'
    assert data['deliveryMethod']['translation']['language']['code'] == 'pl'


def test_delivery_method_update_translation(
        staff_api_client, delivery_method, permission_manage_translations):
    delivery_method.translations.create(language_code='pl', name='DHL')

    query = """
    mutation deliveryPriceTranslate($deliveryMethodId: ID!) {
        deliveryPriceTranslate(
                id: $deliveryMethodId, languageCode: "pl",
                input: {name: "DHL PL"}) {
            deliveryMethod {
                translation(languageCode: "pl") {
                    name
                    language {
                        code
                    }
                }
            }
        }
    }
    """

    delivery_method_id = graphene.Node.to_global_id(
        'DeliveryMethod', delivery_method.id)
    response = staff_api_client.post_graphql(
        query, {'deliveryMethodId': delivery_method_id},
        permissions=[permission_manage_translations])
    data = get_graphql_content(response)['data']['deliveryPriceTranslate']

    assert data['deliveryMethod']['translation']['name'] == 'DHL PL'
    assert data['deliveryMethod']['translation']['language']['code'] == 'pl'


def test_menu_item_update_translation(
        staff_api_client, menu_item, permission_manage_translations):
    menu_item.translations.create(language_code='pl', name='Odnośnik')

    query = """
    mutation menuItemTranslate($menuItemId: ID!) {
        menuItemTranslate(
                id: $menuItemId, languageCode: "pl",
                input: {name: "Odnośnik PL"}) {
            menuItem {
                translation(languageCode: "pl") {
                    name
                    language {
                        code
                    }
                }
            }
        }
    }
    """

    menu_item_id = graphene.Node.to_global_id('MenuItem', menu_item.id)
    response = staff_api_client.post_graphql(
        query, {'menuItemId': menu_item_id},
        permissions=[permission_manage_translations])
    data = get_graphql_content(response)['data']['menuItemTranslate']

    assert data['menuItem']['translation']['name'] == 'Odnośnik PL'
    assert data['menuItem']['translation']['language']['code'] == 'pl'


def test_shop_create_translation(
        staff_api_client, permission_manage_translations):
    query = """
    mutation shopSettingsTranslate {
        shopSettingsTranslate(
                languageCode: "pl", input: {headerText: "Nagłówek PL"}) {
            shop {
                translation(languageCode: "pl") {
                    headerText
                    language {
                        code
                    }
                }
            }
        }
    }
    """

    response = staff_api_client.post_graphql(
        query, permissions=[permission_manage_translations])
    data = get_graphql_content(response)['data']['shopSettingsTranslate']

    assert data['shop']['translation']['headerText'] == 'Nagłówek PL'
    assert data['shop']['translation']['language']['code'] == 'pl'


def test_shop_update_translation(
        staff_api_client, site_settings, permission_manage_translations):
    site_settings.translations.create(
        language_code='pl', header_text='Nagłówek')

    query = """
    mutation shopSettingsTranslate {
        shopSettingsTranslate(
                languageCode: "pl", input: {headerText: "Nagłówek PL"}) {
            shop {
                translation(languageCode: "pl") {
                    headerText
                    language {
                        code
                    }
                }
            }
        }
    }
    """

    response = staff_api_client.post_graphql(
        query, permissions=[permission_manage_translations])
    data = get_graphql_content(response)['data']['shopSettingsTranslate']

    assert data['shop']['translation']['headerText'] == 'Nagłówek PL'
    assert data['shop']['translation']['language']['code'] == 'pl'


@pytest.mark.parametrize('kind, expected_typename', [
    (TranslatableKinds.SKILL, 'Skill'),
    (TranslatableKinds.COLLECTION, 'Collection'),
    (TranslatableKinds.CATEGORY, 'Category'),
    (TranslatableKinds.PAGE, 'Page'),
    (TranslatableKinds.DELIVERY_METHOD, 'DeliveryMethod'),
    (TranslatableKinds.VOUCHER, 'Voucher'),
    (TranslatableKinds.ATTRIBUTE, 'Attribute'),
    (TranslatableKinds.ATTRIBUTE_VALUE, 'AttributeValue'),
    (TranslatableKinds.VARIANT, 'SkillVariant'),
    (TranslatableKinds.MENU_ITEM, 'MenuItem')])
def test_translations_query(
        user_api_client, product, collection, voucher, delivery_method,
        page, menu_item, kind, expected_typename):
    query = """
    query TranslationsQuery($kind: TranslatableKinds!) {
        translations(kind: $kind, first: 1) {
            edges {
                node {
                    __typename
                }
            }
        }
    }
    """

    response = user_api_client.post_graphql(query, {'kind': kind.name})
    data = get_graphql_content(response)['data']['translations']

    assert data['edges'][0]['node']['__typename'] == expected_typename


def test_translations_query_inline_fragment(user_api_client, product):
    product.translations.create(language_code='pl', name='Produkt testowy')

    query = """
    {
        translations(kind: SKILL, first: 1) {
            edges {
                node {
                    ... on Skill {
                        name
                        translation(languageCode: "pl") {
                            name
                        }
                    }
                }
            }
        }
    }
    """

    response = user_api_client.post_graphql(query)
    data = get_graphql_content(response)['data']['translations']['edges'][0]

    assert data['node']['name'] == 'Test skill'
    assert data['node']['translation']['name'] == 'Produkt testowy'
