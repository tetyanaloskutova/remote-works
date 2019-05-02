import json
from datetime import datetime
from unittest.mock import Mock, patch

import graphene
import pytest
from django.utils.dateparse import parse_datetime
from django.utils.text import slugify
from graphql_relay import to_global_id
from prices import Money

from remote_works.graphql.core.enums import ReportingPeriod
from remote_works.graphql.product.enums import StockAvailability
from remote_works.graphql.product.types import resolve_attribute_list
from remote_works.product.models import (
    Attribute, AttributeValue, Category, Skill, SkillImage, SkillType,
    SkillVariant)
from remote_works.product.tasks import update_variants_names
from tests.api.utils import get_graphql_content
from tests.utils import create_image, create_pdf_file_with_image_ext

from .utils import assert_no_permission, get_multipart_request_body


def test_resolve_attribute_list(color_attribute):
    value = color_attribute.values.first()
    attributes_hstore = {str(color_attribute.pk): str(value.pk)}
    res = resolve_attribute_list(attributes_hstore, Attribute.objects.all())
    assert len(res) == 1
    assert res[0].attribute.name == color_attribute.name
    assert res[0].value.name == value.name

    # test passing invalid hstore should resolve to empty list
    attr_pk = str(Attribute.objects.order_by('pk').last().pk + 1)
    val_pk = str(AttributeValue.objects.order_by('pk').last().pk + 1)
    attributes_hstore = {attr_pk: val_pk}
    res = resolve_attribute_list(attributes_hstore, Attribute.objects.all())
    assert res == []


def test_fetch_all_products(user_api_client, product):
    query = """
    query {
        skills(first: 1) {
            totalCount
            edges {
                node {
                    id
                }
            }
        }
    }
    """
    response = user_api_client.post_graphql(query)
    content = get_graphql_content(response)
    num_products = Skill.objects.count()
    assert content['data']['skills']['totalCount'] == num_products
    assert len(content['data']['skills']['edges']) == num_products


@pytest.mark.djangodb
def test_fetch_unavailable_products(user_api_client, product):
    Skill.objects.update(is_published=False)
    query = """
    query {
        skills(first: 1) {
            totalCount
            edges {
                node {
                    id
                }
            }
        }
    }
    """
    response = user_api_client.post_graphql(query)
    content = get_graphql_content(response)
    assert content['data']['skills']['totalCount'] == 0
    assert not content['data']['skills']['edges']


def test_product_query(staff_api_client, product, permission_manage_products):
    category = Category.objects.first()
    product = category.products.first()
    query = """
    query {
        category(id: "%(category_id)s") {
            skills(first: 20) {
                edges {
                    node {
                        id
                        name
                        url
                        thumbnailUrl
                        thumbnail{
                            url
                            alt
                        }
                        images {
                            url
                        }
                        variants {
                            name
                            stockQuantity
                        }
                        availability {
                            available,
                            priceRange {
                                start {
                                    gross {
                                        amount
                                        currency
                                        localized
                                    }
                                    net {
                                        amount
                                        currency
                                        localized
                                    }
                                    currency
                                }
                            }
                        }
                        purchaseCost {
                            start {
                                amount
                            }
                            stop {
                                amount
                            }
                        }
                        margin {
                            start
                            stop
                        }
                    }
                }
            }
        }
    }
    """ % {'category_id': graphene.Node.to_global_id('Category', category.id)}
    staff_api_client.user.user_permissions.add(permission_manage_products)
    response = staff_api_client.post_graphql(query)
    content = get_graphql_content(response)
    assert content['data']['category'] is not None
    product_edges_data = content['data']['category']['skills']['edges']
    assert len(product_edges_data) == category.products.count()
    product_data = product_edges_data[0]['node']
    assert product_data['name'] == product.name
    assert product_data['url'] == product.get_absolute_url()
    gross = product_data['availability']['priceRange']['start']['gross']
    assert float(gross['amount']) == float(product.price.amount)
    from remote_works.product.utils.costs import get_product_costs_data
    purchase_cost, margin = get_product_costs_data(product)
    assert purchase_cost.start.amount == product_data[
        'purchaseCost']['start']['amount']
    assert purchase_cost.stop.amount == product_data[
        'purchaseCost']['stop']['amount']
    assert margin[0] == product_data['margin']['start']
    assert margin[1] == product_data['margin']['stop']


def test_product_query_search(user_api_client, product_type, category):
    blue_product = Skill.objects.create(
        name='Blue Paint', price=Money('10.00', 'USD'),
        product_type=product_type, category=category)
    Skill.objects.create(
        name='Red Paint', price=Money('10.00', 'USD'),
        product_type=product_type, category=category)

    query = """
    query productSearch($query: String) {
        skills(query: $query, first: 10) {
            edges {
                node {
                    name
                }
            }
        }
    }
    """

    response = user_api_client.post_graphql(query, {'query': 'blu p4int'})
    content = get_graphql_content(response)
    products = content['data']['skills']['edges']

    assert len(products) == 1
    assert products[0]['node']['name'] == blue_product.name


def test_query_product_image_by_id(user_api_client, product_with_image):
    image = product_with_image.images.first()
    query = """
    query productImageById($imageId: ID!, $productId: ID!) {
        skill(id: $productId) {
            imageById(id: $imageId) {
                id
                url
            }
        }
    }
    """
    variables = {
        'productId': graphene.Node.to_global_id('Skill', product_with_image.pk),
        'imageId': graphene.Node.to_global_id('SkillImage', image.pk)}
    response = user_api_client.post_graphql(query, variables)
    get_graphql_content(response)


def test_product_with_collections(
        staff_api_client, product, collection, permission_manage_products):
    query = """
        query getSkill($productID: ID!) {
            skill(id: $productID) {
                collections {
                    name
                }
            }
        }
        """
    product.collections.add(collection)
    product.save()
    product_id = graphene.Node.to_global_id('Skill', product.id)

    variables = {'productID': product_id}
    staff_api_client.user.user_permissions.add(permission_manage_products)
    response = staff_api_client.post_graphql(query, variables)
    content = get_graphql_content(response)
    data = content['data']['skill']
    assert data['collections'][0]['name'] == collection.name
    assert len(data['collections']) == 1


def test_filter_product_by_category(user_api_client, product):
    category = product.category
    query = """
    query getSkills($categoryId: ID) {
        skills(categories: [$categoryId], first: 1) {
            edges {
                node {
                    name
                }
            }
        }
    }
    """
    variables = {
        'categoryId': graphene.Node.to_global_id('Category', category.id)}
    response = user_api_client.post_graphql(query, variables)
    content = get_graphql_content(response)
    product_data = content['data']['skills']['edges'][0]['node']
    assert product_data['name'] == product.name


def test_fetch_product_by_id(user_api_client, product):
    query = """
    query ($productId: ID!) {
        node(id: $productId) {
            ... on Skill {
                name
            }
        }
    }
    """
    variables = {
        'productId': graphene.Node.to_global_id('Skill', product.id)}
    response = user_api_client.post_graphql(query, variables)
    content = get_graphql_content(response)
    product_data = content['data']['node']
    assert product_data['name'] == product.name


def _fetch_product(client, product, permissions=None):
    query = """
    query ($productId: ID!) {
        node(id: $productId) {
            ... on Skill {
                name,
                isPublished
            }
        }
    }
    """
    variables = {
        'productId': graphene.Node.to_global_id('Skill', product.id)}
    response = client.post_graphql(
        query, variables, permissions=permissions, check_no_permissions=False)
    content = get_graphql_content(response)
    return content['data']['node']


def test_fetch_unpublished_product_staff_user(
        staff_api_client, unavailable_product, permission_manage_products):
    product_data = _fetch_product(
        staff_api_client,
        unavailable_product,
        permissions=[permission_manage_products])
    assert product_data['name'] == unavailable_product.name
    assert product_data['isPublished'] == unavailable_product.is_published


def test_fetch_unpublished_product_customer(
        user_api_client, unavailable_product):
    product_data = _fetch_product(user_api_client, unavailable_product)
    assert product_data is None


def test_fetch_unpublished_product_anonymous_user(
        api_client, unavailable_product):
    product_data = _fetch_product(api_client, unavailable_product)
    assert product_data is None


def test_filter_products_by_attributes(user_api_client, product):
    product_attr = product.product_type.product_attributes.first()
    attr_value = product_attr.values.first()
    filter_by = '%s:%s' % (product_attr.slug, attr_value.slug)
    query = """
    query {
        skills(attributes: ["%(filter_by)s"], first: 1) {
            edges {
                node {
                    name
                }
            }
        }
    }
    """ % {'filter_by': filter_by}
    response = user_api_client.post_graphql(query)
    content = get_graphql_content(response)
    product_data = content['data']['skills']['edges'][0]['node']
    assert product_data['name'] == product.name


def test_filter_products_by_categories(
        user_api_client, categories_tree, product):
    category = categories_tree.children.first()
    product.category = category
    product.save()
    query = """
    query {
        skills(categories: ["%(category_id)s"], first: 1) {
            edges {
                node {
                    name
                }
            }
        }
    }
    """ % {'category_id': graphene.Node.to_global_id('Category', category.id)}
    response = user_api_client.post_graphql(query)
    content = get_graphql_content(response)
    product_data = content['data']['skills']['edges'][0]['node']
    assert product_data['name'] == product.name


def test_filter_products_by_collections(
        user_api_client, collection, product):
    collection.products.add(product)
    query = """
    query {
        skills(collections: ["%(collection_id)s"], first: 1) {
            edges {
                node {
                    name
                }
            }
        }
    }
    """ % {'collection_id': graphene.Node.to_global_id(
        'Collection', collection.id)}
    response = user_api_client.post_graphql(query)
    content = get_graphql_content(response)
    product_data = content['data']['skills']['edges'][0]['node']
    assert product_data['name'] == product.name


def test_sort_products(user_api_client, product):
    # set price and update date of the first skill
    product.price = Money('10.00', 'USD')
    product.updated_at = datetime.utcnow()
    product.save()

    # Create the second skill with higher price and date
    product.pk = None
    product.price = Money('20.00', 'USD')
    product.updated_at = datetime.utcnow()
    product.save()

    query = """
    query {
        skills(sortBy: %(sort_by_product_order)s, first: 2) {
            edges {
                node {
                    price {
                        amount
                    }
                    updatedAt
                }
            }
        }
    }
    """

    asc_price_query = query % {
        'sort_by_product_order': '{field: PRICE, direction:ASC}'}
    response = user_api_client.post_graphql(asc_price_query)
    content = get_graphql_content(response)
    price_0 = content['data']['skills']['edges'][0]['node']['price']['amount']
    price_1 = content['data']['skills']['edges'][1]['node']['price']['amount']
    assert price_0 < price_1

    desc_price_query = query % {
        'sort_by_product_order': '{field: PRICE, direction:DESC}'}
    response = user_api_client.post_graphql(desc_price_query)
    content = get_graphql_content(response)
    price_0 = content['data']['skills']['edges'][0]['node']['price']['amount']
    price_1 = content['data']['skills']['edges'][1]['node']['price']['amount']
    assert price_0 > price_1

    asc_date_query = query % {
        'sort_by_product_order': '{field: DATE, direction:ASC}'}
    response = user_api_client.post_graphql(asc_date_query)
    content = get_graphql_content(response)
    date_0 = content['data']['skills']['edges'][0]['node']['updatedAt'] ## parse_datetime
    date_1 = content['data']['skills']['edges'][1]['node']['updatedAt']
    assert parse_datetime(date_0) < parse_datetime(date_1)

    desc_date_query = query % {
        'sort_by_product_order': '{field: DATE, direction:DESC}'}
    response = user_api_client.post_graphql(desc_date_query)
    content = get_graphql_content(response)
    date_0 = content['data']['skills']['edges'][0]['node']['updatedAt']
    date_1 = content['data']['skills']['edges'][1]['node']['updatedAt']
    assert parse_datetime(date_0) > parse_datetime(date_1)


def test_create_product(
        staff_api_client, product_type, category, size_attribute,
        permission_manage_products):
    query = """
        mutation createSkill(
            $productTypeId: ID!,
            $categoryId: ID!,
            $name: String!,
            $description: String!,
            $descriptionJson: JSONString!,
            $isPublished: Boolean!,
            $chargeTaxes: Boolean!,
            $taxRate: TaxRateType!,
            $price: Decimal!,
            $attributes: [AttributeValueInput!]) {
                productCreate(
                    input: {
                        category: $categoryId,
                        productType: $productTypeId,
                        name: $name,
                        description: $description,
                        descriptionJson: $descriptionJson,
                        isPublished: $isPublished,
                        chargeTaxes: $chargeTaxes,
                        taxRate: $taxRate,
                        price: $price,
                        attributes: $attributes
                    }) {
                        skill {
                            category {
                                name
                            }
                            description
                            descriptionJson
                            isPublished
                            chargeTaxes
                            taxRate
                            name
                            price {
                                amount
                            }
                            productType {
                                name
                            }
                            attributes {
                                attribute {
                                    slug
                                }
                                value {
                                    slug
                                }
                            }
                          }
                          errors {
                            message
                            field
                          }
                        }
                      }
    """

    product_type_id = graphene.Node.to_global_id(
        'SkillType', product_type.pk)
    category_id = graphene.Node.to_global_id(
        'Category', category.pk)
    product_description = 'test description'
    product_description_json = json.dumps({'content': 'description'})
    product_name = 'test name'
    product_is_published = True
    product_charge_taxes = True
    product_tax_rate = 'STANDARD'
    product_price = 22.33

    # Default attribute defined in skill_type fixture
    color_attr = product_type.product_attributes.get(name='Color')
    color_value_slug = color_attr.values.first().slug
    color_attr_slug = color_attr.slug

    # Add second attribute
    product_type.product_attributes.add(size_attribute)
    size_attr_slug = product_type.product_attributes.get(name='Size').slug
    non_existent_attr_value = 'The cake is a lie'

    # test creating root skill
    variables = {
        'productTypeId': product_type_id,
        'categoryId': category_id,
        'name': product_name,
        'description': product_description,
        'descriptionJson': product_description_json,
        'isPublished': product_is_published,
        'chargeTaxes': product_charge_taxes,
        'taxRate': product_tax_rate,
        'price': product_price,
        'attributes': [
            {'slug': color_attr_slug, 'value': color_value_slug},
            {'slug': size_attr_slug, 'value': non_existent_attr_value}]}

    response = staff_api_client.post_graphql(
        query, variables, permissions=[permission_manage_products])
    content = get_graphql_content(response)
    data = content['data']['productCreate']
    assert data['errors'] == []
    assert data['skill']['name'] == product_name
    assert data['skill']['description'] == product_description
    assert data['skill']['descriptionJson'] == product_description_json
    assert data['skill']['isPublished'] == product_is_published
    assert data['skill']['chargeTaxes'] == product_charge_taxes
    assert data['skill']['taxRate'] == product_tax_rate
    assert data['skill']['productType']['name'] == product_type.name
    assert data['skill']['category']['name'] == category.name
    values = (
        data['skill']['attributes'][0]['value']['slug'],
        data['skill']['attributes'][1]['value']['slug'])
    assert slugify(non_existent_attr_value) in values
    assert color_value_slug in values


QUERY_CREATE_PRODUCT_WITHOUT_VARIANTS = """
    mutation createSkill(
        $productTypeId: ID!,
        $categoryId: ID!
        $name: String!,
        $description: String!,
        $price: Decimal!,
        $sku: String,
        $quantity: Int,
        $trackInventory: Boolean)
    {
        productCreate(
            input: {
                category: $categoryId,
                productType: $productTypeId,
                name: $name,
                description: $description,
                price: $price,
                sku: $sku,
                quantity: $quantity,
                trackInventory: $trackInventory
            })
        {
            skill {
                id
                name
                variants{
                    id
                    sku
                    quantity
                    trackInventory
                }
                category {
                    name
                }
                productType {
                    name
                }
            }
            errors {
                message
                field
            }
        }
    }
    """


def test_create_product_without_variants(
        staff_api_client, product_type_without_variant, category,
        permission_manage_products):
    query = QUERY_CREATE_PRODUCT_WITHOUT_VARIANTS

    product_type = product_type_without_variant
    product_type_id = graphene.Node.to_global_id(
        'SkillType', product_type.pk)
    category_id = graphene.Node.to_global_id(
        'Category', category.pk)
    product_name = 'test name'
    product_description = 'description'
    product_price = 10
    sku = 'sku'
    quantity = 1
    track_inventory = True

    variables = {
        'productTypeId': product_type_id,
        'categoryId': category_id,
        'name': product_name,
        'description': product_description,
        'price': product_price,
        'sku': sku,
        'quantity': quantity,
        'trackInventory': track_inventory}

    response = staff_api_client.post_graphql(
        query, variables, permissions=[permission_manage_products])
    content = get_graphql_content(response)
    data = content['data']['productCreate']
    assert data['errors'] == []
    assert data['skill']['name'] == product_name
    assert data['skill']['productType']['name'] == product_type.name
    assert data['skill']['category']['name'] == category.name
    assert data['skill']['variants'][0]['sku'] == sku
    assert data['skill']['variants'][0]['quantity'] == quantity
    assert data['skill']['variants'][0]['trackInventory'] == track_inventory


def test_create_product_without_variants_sku_validation(
        staff_api_client, product_type_without_variant, category,
        permission_manage_products):
    query = QUERY_CREATE_PRODUCT_WITHOUT_VARIANTS

    product_type = product_type_without_variant
    product_type_id = graphene.Node.to_global_id(
        'SkillType', product_type.pk)
    category_id = graphene.Node.to_global_id(
        'Category', category.pk)
    product_name = 'test name'
    product_description = 'description'
    product_price = 10
    quantity = 1
    track_inventory = True

    variables = {
        'productTypeId': product_type_id,
        'categoryId': category_id,
        'name': product_name,
        'description': product_description,
        'price': product_price,
        'sku': None,
        'quantity': quantity,
        'trackInventory': track_inventory}

    response = staff_api_client.post_graphql(
        query, variables, permissions=[permission_manage_products])
    content = get_graphql_content(response)
    data = content['data']['productCreate']
    assert data['errors'][0]['field'] == 'sku'
    assert data['errors'][0]['message'] == 'This field cannot be blank.'


def test_create_product_without_variants_sku_duplication(
        staff_api_client, product_type_without_variant, category,
        permission_manage_products, product_with_default_variant):
    query = QUERY_CREATE_PRODUCT_WITHOUT_VARIANTS

    product_type = product_type_without_variant
    product_type_id = graphene.Node.to_global_id(
        'SkillType', product_type.pk)
    category_id = graphene.Node.to_global_id(
        'Category', category.pk)
    product_name = 'test name'
    product_description = 'description'
    product_price = 10
    quantity = 1
    track_inventory = True
    sku = '1234'

    variables = {
        'productTypeId': product_type_id,
        'categoryId': category_id,
        'name': product_name,
        'description': product_description,
        'price': product_price,
        'sku': sku,
        'quantity': quantity,
        'trackInventory': track_inventory}

    response = staff_api_client.post_graphql(
        query, variables, permissions=[permission_manage_products])
    content = get_graphql_content(response)
    data = content['data']['productCreate']
    assert data['errors'][0]['field'] == 'sku'
    assert data['errors'][0]['message'] == 'Skill with this SKU already exists.'


def test_update_product(
        staff_api_client, category, non_default_category, product,
        permission_manage_products):
    query = """
        mutation updateSkill(
            $productId: ID!,
            $categoryId: ID!,
            $name: String!,
            $description: String!,
            $isPublished: Boolean!,
            $chargeTaxes: Boolean!,
            $taxRate: TaxRateType!,
            $price: Decimal!,
            $attributes: [AttributeValueInput!]) {
                productUpdate(
                    id: $productId,
                    input: {
                        category: $categoryId,
                        name: $name,
                        description: $description,
                        isPublished: $isPublished,
                        chargeTaxes: $chargeTaxes,
                        taxRate: $taxRate,
                        price: $price,
                        attributes: $attributes
                    }) {
                        skill {
                            category {
                                name
                            }
                            description
                            isPublished
                            chargeTaxes
                            taxRate
                            name
                            price {
                                amount
                            }
                            productType {
                                name
                            }
                            attributes {
                                attribute {
                                    name
                                }
                                value {
                                    name
                                }
                            }
                          }
                          errors {
                            message
                            field
                          }
                        }
                      }
    """
    product_id = graphene.Node.to_global_id('Skill', product.pk)
    category_id = graphene.Node.to_global_id(
        'Category', non_default_category.pk)
    product_description = 'updated description'
    product_name = 'updated name'
    product_isPublished = True
    product_chargeTaxes = True
    product_taxRate = 'STANDARD'
    product_price = "33.12"

    variables = {
        'productId': product_id,
        'categoryId': category_id,
        'name': product_name,
        'description': product_description,
        'isPublished': product_isPublished,
        'chargeTaxes': product_chargeTaxes,
        'taxRate': product_taxRate,
        'price': product_price}

    response = staff_api_client.post_graphql(
        query, variables, permissions=[permission_manage_products])
    content = get_graphql_content(response)
    data = content['data']['productUpdate']
    assert data['errors'] == []
    assert data['skill']['name'] == product_name
    assert data['skill']['description'] == product_description
    assert data['skill']['isPublished'] == product_isPublished
    assert data['skill']['chargeTaxes'] == product_chargeTaxes
    assert data['skill']['taxRate'] == product_taxRate
    assert not data['skill']['category']['name'] == category.name


def test_update_product_without_variants(
        staff_api_client, product_with_default_variant,
        permission_manage_products):
    query = """
    mutation updateSkill(
        $productId: ID!,
        $sku: String,
        $quantity: Int,
        $trackInventory: Boolean,
        $description: String)
    {
        productUpdate(
            id: $productId,
            input: {
                sku: $sku,
                quantity: $quantity,
                trackInventory: $trackInventory,
                description: $description
            })
        {
            skill {
                id
                variants{
                    id
                    sku
                    quantity
                    trackInventory
                }
            }
            errors {
                message
                field
            }
        }
    }
    """

    product = product_with_default_variant
    product_id = graphene.Node.to_global_id('Skill', product.pk)
    product_sku = "test_sku"
    product_quantity = 10
    product_track_inventory = False
    product_description = "test description"

    variables = {
        'productId': product_id,
        'sku': product_sku,
        'quantity': product_quantity,
        'trackInventory': product_track_inventory,
        'description': product_description}

    response = staff_api_client.post_graphql(
        query, variables, permissions=[permission_manage_products])
    content = get_graphql_content(response)
    data = content['data']['productUpdate']
    assert data['errors'] == []
    product = data['skill']['variants'][0]
    assert product['sku'] == product_sku
    assert product['quantity'] == product_quantity
    assert product['trackInventory'] == product_track_inventory


def test_update_product_without_variants_sku_duplication(
        staff_api_client, product_with_default_variant,
        permission_manage_products, product):
    query = """
    mutation updateSkill(
        $productId: ID!,
        $sku: String)
    {
        productUpdate(
            id: $productId,
            input: {
                sku: $sku
            })
        {
            skill {
                id
            }
            errors {
                message
                field
            }
        }
    }"""
    product = product_with_default_variant
    product_id = graphene.Node.to_global_id('Skill', product.pk)
    product_sku = "123"

    variables = {
        'productId': product_id,
        'sku': product_sku}

    response = staff_api_client.post_graphql(
        query, variables, permissions=[permission_manage_products])
    content = get_graphql_content(response)
    data = content['data']['productUpdate']
    assert data['errors']
    assert data['errors'][0]['field'] == 'sku'
    assert data['errors'][0]['message'] == 'Skill with this SKU already exists.'

def test_delete_product(staff_api_client, product, permission_manage_products):
    query = """
        mutation DeleteSkill($id: ID!) {
            productDelete(id: $id) {
                skill {
                    name
                    id
                }
                errors {
                    field
                    message
                }
              }
            }
    """
    node_id = graphene.Node.to_global_id('Skill', product.id)
    variables = {'id': node_id}
    response = staff_api_client.post_graphql(
        query, variables, permissions=[permission_manage_products])
    content = get_graphql_content(response)
    data = content['data']['productDelete']
    assert data['skill']['name'] == product.name
    with pytest.raises(product._meta.model.DoesNotExist):
        product.refresh_from_db()
    assert node_id == data['skill']['id']


def test_product_type(user_api_client, product_type):
    query = """
    query {
        skillTypes(first: 20) {
            totalCount
            edges {
                node {
                    id
                    name
                    skills(first: 1) {
                        edges {
                            node {
                                id
                            }
                        }
                    }
                }
            }
        }
    }
    """
    response = user_api_client.post_graphql(query)
    content = get_graphql_content(response)
    no_product_types = SkillType.objects.count()
    assert content['data']['skillTypes']['totalCount'] == no_product_types
    assert len(content['data']['skillTypes']['edges']) == no_product_types


def test_product_type_query(
        user_api_client, staff_api_client, product_type, product,
        permission_manage_products):
    query = """
            query getSkillType($id: ID!) {
                productType(id: $id) {
                    name
                    skills(first: 20) {
                        totalCount
                        edges {
                            node {
                                name
                            }
                        }
                    }
                    taxRate
                }
            }
        """
    no_products = Skill.objects.count()
    product.is_published = False
    product.save()
    variables = {
        'id': graphene.Node.to_global_id('SkillType', product_type.id)}

    response = user_api_client.post_graphql(query, variables)
    content = get_graphql_content(response)
    data = content['data']
    assert data['productType']['skills']['totalCount'] == no_products - 1

    staff_api_client.user.user_permissions.add(permission_manage_products)
    response = staff_api_client.post_graphql(query, variables)
    content = get_graphql_content(response)
    data = content['data']
    assert data['productType']['skills']['totalCount'] == no_products
    assert data['productType']['taxRate'] == product_type.tax_rate.upper()


def test_product_type_create_mutation(
        staff_api_client, product_type, permission_manage_products):
    query = """
    mutation createSkillType(
        $name: String!,
        $taxRate: TaxRateType!,
        $hasVariants: Boolean!,
        $isShippingRequired: Boolean!,
        $productAttributes: [ID],
        $variantAttributes: [ID]) {
        productTypeCreate(
            input: {
                name: $name,
                taxRate: $taxRate,
                hasVariants: $hasVariants,
                isShippingRequired: $isShippingRequired,
                productAttributes: $productAttributes,
                variantAttributes: $variantAttributes}) {
            productType {
            name
            taxRate
            isShippingRequired
            hasVariants
            variantAttributes {
                name
                values {
                    name
                }
            }
            productAttributes {
                name
                values {
                    name
                }
            }
            }
        }
    }
    """
    product_type_name = 'test type'
    has_variants = True
    require_shipping = True
    product_attributes = product_type.product_attributes.all()
    product_attributes_ids = [
        graphene.Node.to_global_id('Attribute', att.id) for att in
        product_attributes]
    variant_attributes = product_type.variant_attributes.all()
    variant_attributes_ids = [
        graphene.Node.to_global_id('Attribute', att.id) for att in
        variant_attributes]

    variables = {
        'name': product_type_name, 'hasVariants': has_variants,
        'taxRate': 'STANDARD',
        'isShippingRequired': require_shipping,
        'productAttributes': product_attributes_ids,
        'variantAttributes': variant_attributes_ids}
    initial_count = SkillType.objects.count()
    response = staff_api_client.post_graphql(
        query, variables, permissions=[permission_manage_products])
    content = get_graphql_content(response)
    assert SkillType.objects.count() == initial_count + 1
    data = content['data']['productTypeCreate']['productType']
    assert data['name'] == product_type_name
    assert data['hasVariants'] == has_variants
    assert data['isShippingRequired'] == require_shipping

    pa = product_attributes[0]
    assert data['productAttributes'][0]['name'] == pa.name
    pa_values = data['productAttributes'][0]['values']
    assert sorted([value['name'] for value in pa_values]) == sorted(
        [value.name for value in pa.values.all()])

    va = variant_attributes[0]
    assert data['variantAttributes'][0]['name'] == va.name
    va_values = data['variantAttributes'][0]['values']
    assert sorted([value['name'] for value in va_values]) == sorted(
        [value.name for value in va.values.all()])

    new_instance = SkillType.objects.latest('pk')
    assert new_instance.tax_rate == 'standard'


def test_product_type_update_mutation(
        staff_api_client, product_type, permission_manage_products):
    query = """
    mutation updateSkillType(
        $id: ID!,
        $name: String!,
        $hasVariants: Boolean!,
        $isShippingRequired: Boolean!,
        $productAttributes: [ID],
        ) {
            productTypeUpdate(
            id: $id,
            input: {
                name: $name,
                hasVariants: $hasVariants,
                isShippingRequired: $isShippingRequired,
                productAttributes: $productAttributes
            }) {
                productType {
                    name
                    isShippingRequired
                    hasVariants
                    variantAttributes {
                        id
                    }
                    productAttributes {
                        id
                    }
                }
              }
            }
    """
    product_type_name = 'test type updated'
    has_variants = True
    require_shipping = False
    product_type_id = graphene.Node.to_global_id(
        'SkillType', product_type.id)

    # Test scenario: remove all skill attributes using [] as input
    # but do not change variant attributes
    product_attributes = []
    product_attributes_ids = [
        graphene.Node.to_global_id('Attribute', att.id) for att in
        product_attributes]
    variant_attributes = product_type.variant_attributes.all()

    variables = {
        'id': product_type_id, 'name': product_type_name,
        'hasVariants': has_variants,
        'isShippingRequired': require_shipping,
        'productAttributes': product_attributes_ids}
    response = staff_api_client.post_graphql(
        query, variables, permissions=[permission_manage_products])
    content = get_graphql_content(response)
    data = content['data']['productTypeUpdate']['productType']
    assert data['name'] == product_type_name
    assert data['hasVariants'] == has_variants
    assert data['isShippingRequired'] == require_shipping
    assert len(data['productAttributes']) == 0
    assert len(data['variantAttributes']) == (
        variant_attributes.count())


def test_product_type_delete_mutation(
        staff_api_client, product_type, permission_manage_products):
    query = """
        mutation deleteSkillType($id: ID!) {
            productTypeDelete(id: $id) {
                productType {
                    name
                }
            }
        }
    """
    variables = {
        'id': graphene.Node.to_global_id('SkillType', product_type.id)}
    response = staff_api_client.post_graphql(
        query, variables, permissions=[permission_manage_products])
    content = get_graphql_content(response)
    data = content['data']['productTypeDelete']
    assert data['productType']['name'] == product_type.name
    with pytest.raises(product_type._meta.model.DoesNotExist):
        product_type.refresh_from_db()


def test_product_image_create_mutation(
        monkeypatch, staff_api_client, product, permission_manage_products):
    query = """
    mutation createSkillImage($image: Upload!, $skill: ID!) {
        productImageCreate(input: {image: $image, skill: $skill}) {
            image {
                id
            }
        }
    }
    """

    mock_create_thumbnails = Mock(return_value=None)
    monkeypatch.setattr(
        ('remote_works.graphql.skill.mutations.skills.'
         'create_product_thumbnails.delay'),
        mock_create_thumbnails)

    image_file, image_name = create_image()
    variables = {
        'skill': graphene.Node.to_global_id('Skill', product.id),
        'image': image_name}
    body = get_multipart_request_body(query, variables, image_file, image_name)
    response = staff_api_client.post_multipart(
        body, permissions=[permission_manage_products])
    get_graphql_content(response)
    product.refresh_from_db()
    product_image = product.images.last()
    assert product_image.image.file

    # The image creation should have triggered a warm-up
    mock_create_thumbnails.assert_called_once_with(product_image.pk)


def test_invalid_product_image_create_mutation(
        staff_api_client, product, permission_manage_products):
    query = """
    mutation createSkillImage($image: Upload!, $skill: ID!) {
        productImageCreate(input: {image: $image, skill: $skill}) {
            image {
                id
                url
                sortOrder
            }
            errors {
                field
                message
            }
        }
    }
    """
    image_file, image_name = create_pdf_file_with_image_ext()
    variables = {
        'skill': graphene.Node.to_global_id('Skill', product.id),
        'image': image_name}
    body = get_multipart_request_body(query, variables, image_file, image_name)
    response = staff_api_client.post_multipart(
        body, permissions=[permission_manage_products])
    content = get_graphql_content(response)
    assert content['data']['productImageCreate']['errors'] == [{
        'field': 'image',
        'message': 'Invalid file type'}]
    product.refresh_from_db()
    assert product.images.count() == 0


def test_product_image_update_mutation(
        monkeypatch,
        staff_api_client, product_with_image, permission_manage_products):
    query = """
    mutation updateSkillImage($imageId: ID!, $alt: String) {
        productImageUpdate(id: $imageId, input: {alt: $alt}) {
            image {
                alt
            }
        }
    }
    """

    mock_create_thumbnails = Mock(return_value=None)
    monkeypatch.setattr(
        ('remote_works.graphql.skill.mutations.skills.'
         'create_product_thumbnails.delay'),
        mock_create_thumbnails)

    image_obj = product_with_image.images.first()
    alt = 'damage alt'
    variables = {
        'alt': alt,
        'imageId': graphene.Node.to_global_id('SkillImage', image_obj.id)}
    response = staff_api_client.post_graphql(
        query, variables, permissions=[permission_manage_products])
    content = get_graphql_content(response)
    assert content['data']['productImageUpdate']['image']['alt'] == alt

    # We did not update the image field,
    # the image should not have triggered a warm-up
    assert mock_create_thumbnails.call_count == 0


def test_product_image_delete(
        staff_api_client, product_with_image, permission_manage_products):
    product = product_with_image
    query = """
            mutation deleteSkillImage($id: ID!) {
                productImageDelete(id: $id) {
                    image {
                        id
                        url
                    }
                }
            }
        """
    image_obj = product.images.first()
    node_id = graphene.Node.to_global_id('SkillImage', image_obj.id)
    variables = {'id': node_id}
    response = staff_api_client.post_graphql(
        query, variables, permissions=[permission_manage_products])
    content = get_graphql_content(response)
    data = content['data']['productImageDelete']
    assert image_obj.image.url in data['image']['url']
    with pytest.raises(image_obj._meta.model.DoesNotExist):
        image_obj.refresh_from_db()
    assert node_id == data['image']['id']


def test_reorder_images(
        staff_api_client, product_with_images, permission_manage_products):
    query = """
    mutation reorderImages($product_id: ID!, $images_ids: [ID]!) {
        productImageReorder(productId: $product_id, imagesIds: $images_ids) {
            skill {
                id
            }
        }
    }
    """
    product = product_with_images
    images = product.images.all()
    image_0 = images[0]
    image_1 = images[1]
    image_0_id = graphene.Node.to_global_id('SkillImage', image_0.id)
    image_1_id = graphene.Node.to_global_id('SkillImage', image_1.id)
    product_id = graphene.Node.to_global_id('Skill', product.id)

    variables = {
        'product_id': product_id, 'images_ids': [image_1_id, image_0_id]}
    response = staff_api_client.post_graphql(
        query, variables, permissions=[permission_manage_products])
    get_graphql_content(response)

    # Check if order has been changed
    product.refresh_from_db()
    reordered_images = product.images.all()
    reordered_image_0 = reordered_images[0]
    reordered_image_1 = reordered_images[1]
    assert image_0.id == reordered_image_1.id
    assert image_1.id == reordered_image_0.id


ASSIGN_VARIANT_QUERY = """
    mutation assignVariantImageMutation($variantId: ID!, $imageId: ID!) {
        variantImageAssign(variantId: $variantId, imageId: $imageId) {
            errors {
                field
                message
            }
            productVariant {
                id
            }
        }
    }
"""


def test_assign_variant_image(
        staff_api_client, user_api_client, product_with_image,
        permission_manage_products):
    query = ASSIGN_VARIANT_QUERY
    variant = product_with_image.variants.first()
    image = product_with_image.images.first()

    variables = {
        'variantId': to_global_id('SkillVariant', variant.pk),
        'imageId': to_global_id('SkillImage', image.pk)}
    response = staff_api_client.post_graphql(
        query, variables, permissions=[permission_manage_products])
    get_graphql_content(response)
    variant.refresh_from_db()
    assert variant.images.first() == image


def test_assign_variant_image_from_different_product(
        staff_api_client, user_api_client, product_with_image,
        permission_manage_products):
    query = ASSIGN_VARIANT_QUERY
    variant = product_with_image.variants.first()
    product_with_image.pk = None
    product_with_image.save()

    image_2 = SkillImage.objects.create(product=product_with_image)
    variables = {
        'variantId': to_global_id('SkillVariant', variant.pk),
        'imageId': to_global_id('SkillImage', image_2.pk)}
    response = staff_api_client.post_graphql(
        query, variables, permissions=[permission_manage_products])
    content = get_graphql_content(response)
    assert content['data']['variantImageAssign']['errors'][0]['field'] == 'imageId'

    # check permissions
    response = user_api_client.post_graphql(query, variables)
    assert_no_permission(response)


UNASSIGN_VARIANT_IMAGE_QUERY = """
    mutation unassignVariantImageMutation($variantId: ID!, $imageId: ID!) {
        variantImageUnassign(variantId: $variantId, imageId: $imageId) {
            errors {
                field
                message
            }
            productVariant {
                id
            }
        }
    }
"""


def test_unassign_variant_image(
        staff_api_client, product_with_image, permission_manage_products):
    query = UNASSIGN_VARIANT_IMAGE_QUERY

    image = product_with_image.images.first()
    variant = product_with_image.variants.first()
    variant.variant_images.create(image=image)

    variables = {
        'variantId': to_global_id('SkillVariant', variant.pk),
        'imageId': to_global_id('SkillImage', image.pk)}
    response = staff_api_client.post_graphql(
        query, variables, permissions=[permission_manage_products])
    get_graphql_content(response)
    variant.refresh_from_db()
    assert variant.images.count() == 0


def test_unassign_not_assigned_variant_image(
        staff_api_client, product_with_image, permission_manage_products):
    query = UNASSIGN_VARIANT_IMAGE_QUERY
    variant = product_with_image.variants.first()
    image_2 = SkillImage.objects.create(product=product_with_image)
    variables = {
        'variantId': to_global_id('SkillVariant', variant.pk),
        'imageId': to_global_id('SkillImage', image_2.pk)}
    response = staff_api_client.post_graphql(
        query, variables, permissions=[permission_manage_products])
    content = get_graphql_content(response)
    assert content['data']['variantImageUnassign']['errors'][0]['field'] == (
        'imageId')


@patch('remote_works.skill.tasks.update_variants_names.delay')
def test_product_type_update_changes_variant_name(
        mock_update_variants_names, staff_api_client, product_type,
        product, permission_manage_products):
    query = """
    mutation updateSkillType(
        $id: ID!,
        $hasVariants: Boolean!,
        $isShippingRequired: Boolean!,
        $variantAttributes: [ID],
        ) {
            productTypeUpdate(
            id: $id,
            input: {
                hasVariants: $hasVariants,
                isShippingRequired: $isShippingRequired,
                variantAttributes: $variantAttributes}) {
                productType {
                    id
                }
              }
            }
    """
    variant = product.variants.first()
    variant.name = 'test name'
    variant.save()
    has_variants = True
    require_shipping = False
    product_type_id = graphene.Node.to_global_id(
        'SkillType', product_type.id)

    variant_attributes = product_type.variant_attributes.all()
    variant_attributes_ids = [
        graphene.Node.to_global_id('Attribute', att.id) for att in
        variant_attributes]
    variables = {
        'id': product_type_id,
        'hasVariants': has_variants,
        'isShippingRequired': require_shipping,
        'variantAttributes': variant_attributes_ids}
    response = staff_api_client.post_graphql(
        query, variables, permissions=[permission_manage_products])
    content = get_graphql_content(response)
    variant_attributes = set(variant_attributes)
    variant_attributes_ids = [attr.pk for attr in variant_attributes]
    mock_update_variants_names.assert_called_once_with(
        product_type.pk, variant_attributes_ids)


@patch('remote_works.skill.tasks._update_variants_names')
def test_product_update_variants_names(mock__update_variants_names,
                                       product_type):
    variant_attributes = [product_type.variant_attributes.first()]
    variant_attr_ids = [attr.pk for attr in variant_attributes]
    update_variants_names(product_type.pk, variant_attr_ids)
    mock__update_variants_names.call_count == 1


def test_product_variants_by_ids(user_api_client, variant):
    query = """
        query getSkill($ids: [ID!]) {
            productVariants(ids: $ids, first: 1) {
                edges {
                    node {
                        id
                    }
                }
            }
        }
    """
    variant_id = graphene.Node.to_global_id('SkillVariant', variant.id)

    variables = {'ids': [variant_id]}
    response = user_api_client.post_graphql(query, variables)
    content = get_graphql_content(response)
    data = content['data']['productVariants']
    assert data['edges'][0]['node']['id'] == variant_id
    assert len(data['edges']) == 1


def test_product_variants_no_ids_list(user_api_client, variant):
    query = """
        query getSkillVariants {
            productVariants(first: 10) {
                edges {
                    node {
                        id
                    }
                }
            }
        }
    """
    response = user_api_client.post_graphql(query)
    content = get_graphql_content(response)
    data = content['data']['productVariants']
    assert len(data['edges']) == SkillVariant.objects.count()


@pytest.mark.parametrize('product_price, variant_override, api_variant_price', [
    (100, None, 100),
    (100, 200, 200),
    (100, 0, 0)
])
def test_product_variant_price(
        product_price, variant_override, api_variant_price,
        user_api_client, variant):
    # Set price override on variant that is different than skill price
    product = variant.product
    product.price = Money(amount=product_price, currency='USD')
    product.save()
    if variant_override is not None:
        product.variants.update(
            price_override=Money(amount=variant_override, currency='USD'))
    else:
        product.variants.update(price_override=None)
    # Drop other variants
    # skill.variants.exclude(id=variant.pk).delete()

    query = """
        query getSkillVariants($id: ID!) {
            skill(id: $id) {
                variants {
                    price {
                        amount
                    }
                }
            }
        }
        """
    product_id = graphene.Node.to_global_id('Skill', variant.product.id)
    variables = {'id': product_id}
    response = user_api_client.post_graphql(query, variables)
    content = get_graphql_content(response)
    data = content['data']['skill']
    variant_price = data['variants'][0]['price']
    assert variant_price['amount'] == api_variant_price


def test_stock_availability_filter(user_api_client, product):
    query = """
    query Skills($stockAvailability: StockAvailability) {
        skills(stockAvailability: $stockAvailability, first: 1) {
            totalCount
            edges {
                node {
                    id
                }
            }
        }
    }
    """

    # fetch skills in stock
    variables = {'stockAvailability': StockAvailability.IN_STOCK.name}
    response = user_api_client.post_graphql(query, variables)
    content = get_graphql_content(response)
    assert content['data']['skills']['totalCount'] == 1

    # fetch out of stock
    variables = {'stockAvailability': StockAvailability.OUT_OF_STOCK.name}
    response = user_api_client.post_graphql(query, variables)
    content = get_graphql_content(response)
    assert content['data']['skills']['totalCount'] == 0

    # Change skill stock availability and test again
    product.variants.update(quantity=0)

    # There should be no skills in stock
    variables = {'stockAvailability': StockAvailability.IN_STOCK.name}
    response = user_api_client.post_graphql(query, variables)
    content = get_graphql_content(response)
    assert content['data']['skills']['totalCount'] == 0


def test_report_product_sales(
        staff_api_client, order_with_lines, permission_manage_products,
        permission_manage_orders):
    query = """
    query TopSkills($period: ReportingPeriod!) {
        reportSkillSales(period: $period, first: 20) {
            edges {
                node {
                    revenue(period: $period) {
                        gross {
                            amount
                        }
                    }
                    quantityOrdered
                    sku
                }
            }
        }
    }
    """
    variables = {'period': ReportingPeriod.TODAY.name}
    permissions = [permission_manage_orders, permission_manage_products]
    response = staff_api_client.post_graphql(query, variables, permissions)
    content = get_graphql_content(response)
    edges = content['data']['reportSkillSales']['edges']

    node_a = edges[0]['node']
    line_a = order_with_lines.lines.get(product_sku=node_a['sku'])
    assert node_a['quantityOrdered'] == line_a.quantity
    assert (
        node_a['revenue']['gross']['amount'] ==
        line_a.quantity * line_a.unit_price_gross.amount)

    node_b = edges[1]['node']
    line_b = order_with_lines.lines.get(product_sku=node_b['sku'])
    assert node_b['quantityOrdered'] == line_b.quantity
    assert (
        node_b['revenue']['gross']['amount'] ==
        line_b.quantity * line_b.unit_price_gross.amount)


def test_variant_revenue_permissions(
        staff_api_client, permission_manage_products,
        permission_manage_orders, product):
    query = """
    query VariantRevenue($id: ID!) {
        productVariant(id: $id) {
            revenue(period: TODAY) {
                gross {
                    localized
                }
            }
        }
    }
    """
    variant = product.variants.first()
    variables = {
        'id': graphene.Node.to_global_id('SkillVariant', variant.pk)}
    permissions = [permission_manage_orders, permission_manage_products]
    response = staff_api_client.post_graphql(query, variables, permissions)
    content = get_graphql_content(response)
    assert content['data']['productVariant']['revenue']


def test_variant_quantity_permissions(
        staff_api_client, permission_manage_products, product):
    query = """
    query Quantity($id: ID!) {
        productVariant(id: $id) {
            quantity
        }
    }
    """
    variant = product.variants.first()
    variables = {
        'id': graphene.Node.to_global_id('SkillVariant', variant.pk)}
    permissions = [permission_manage_products]
    response = staff_api_client.post_graphql(query, variables, permissions)
    content = get_graphql_content(response)
    assert 'quantity' in content['data']['productVariant']


def test_variant_quantity_ordered_permissions(
        staff_api_client, permission_manage_products,
        permission_manage_orders, product):
    query = """
    query QuantityOrdered($id: ID!) {
        productVariant(id: $id) {
            quantityOrdered
        }
    }
    """
    variant = product.variants.first()
    variables = {
        'id': graphene.Node.to_global_id('SkillVariant', variant.pk)}
    permissions = [permission_manage_orders, permission_manage_products]
    response = staff_api_client.post_graphql(query, variables, permissions)
    content = get_graphql_content(response)
    assert 'quantityOrdered' in content['data']['productVariant']


def test_variant_quantity_allocated_permissions(
        staff_api_client, permission_manage_products,
        permission_manage_orders, product):
    query = """
    query QuantityAllocated($id: ID!) {
        productVariant(id: $id) {
            quantityAllocated
        }
    }
    """
    variant = product.variants.first()
    variables = {
        'id': graphene.Node.to_global_id('SkillVariant', variant.pk)}
    permissions = [permission_manage_orders, permission_manage_products]
    response = staff_api_client.post_graphql(query, variables, permissions)
    content = get_graphql_content(response)
    assert 'quantityAllocated' in content['data']['productVariant']


def test_variant_margin_permissions(
        staff_api_client, permission_manage_products,
        permission_manage_orders, product):
    query = """
    query Margin($id: ID!) {
        productVariant(id: $id) {
            margin
        }
    }
    """
    variant = product.variants.first()
    variables = {
        'id': graphene.Node.to_global_id('SkillVariant', variant.pk)}
    permissions = [permission_manage_orders, permission_manage_products]
    response = staff_api_client.post_graphql(query, variables, permissions)
    content = get_graphql_content(response)
    assert 'margin' in content['data']['productVariant']
