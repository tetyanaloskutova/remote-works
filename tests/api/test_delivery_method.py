import graphene
import pytest

from remote_works.graphql.delivery.types import DeliveryMethodTypeEnum
from tests.api.utils import get_graphql_content


def test_delivery_zone_query(
        staff_api_client, delivery_zone, permission_manage_delivery):
    delivery = delivery_zone
    query = """
    query DeliveryQuery($id: ID!) {
        deliveryZone(id: $id) {
            name
            deliveryMethods {
                price {
                    amount
                }
            }
            priceRange {
                start {
                    amount
                }
                stop {
                    amount
                }
            }
        }
    }
    """
    ID = graphene.Node.to_global_id('DeliveryZone', delivery.id)
    variables = {'id': ID}
    response = staff_api_client.post_graphql(
        query, variables, permissions=[permission_manage_delivery])
    content = get_graphql_content(response)

    delivery_data = content['data']['deliveryZone']
    assert delivery_data['name'] == delivery.name
    num_of_delivery_methods = delivery_zone.delivery_methods.count()
    assert len(delivery_data['deliveryMethods']) == num_of_delivery_methods
    price_range = delivery.price_range
    data_price_range = delivery_data['priceRange']
    assert data_price_range['start']['amount'] == price_range.start.amount
    assert data_price_range['stop']['amount'] == price_range.stop.amount


def test_delivery_zones_query(
        staff_api_client, delivery_zone, permission_manage_delivery):
    query = """
    query MultipleDeliverys {
        deliveryZones {
            totalCount
        }
    }
    """
    num_of_deliverys = delivery_zone._meta.model.objects.count()
    response = staff_api_client.post_graphql(
        query, permissions=[permission_manage_delivery])
    content = get_graphql_content(response)
    assert content['data']['deliveryZones']['totalCount'] == num_of_deliverys


CREATE_DELIVERY_ZONE_QUERY = """
    mutation createDelivery(
        $name: String, $default: Boolean, $countries: [String]) {
        deliveryZoneCreate(
            input: {name: $name, countries: $countries, default: $default})
        {
            errors {
                field
                message
            }
            deliveryZone {
                name
                countries {
                    code
                }
                default
            }
        }
    }
"""


def test_create_delivery_zone(staff_api_client, permission_manage_delivery):
    query = CREATE_DELIVERY_ZONE_QUERY
    variables = {'name': 'test delivery', 'countries': ['PL']}
    response = staff_api_client.post_graphql(
        query, variables, permissions=[permission_manage_delivery])
    content = get_graphql_content(response)
    data = content['data']['deliveryZoneCreate']
    assert not data['errors']
    zone = data['deliveryZone']
    assert zone['name'] == 'test delivery'
    assert zone['countries'] == [{'code': 'PL'}]
    assert zone['default'] == False


def test_create_default_delivery_zone(
        staff_api_client, permission_manage_delivery):
    query = CREATE_DELIVERY_ZONE_QUERY
    variables = {'default': True, 'name': 'test delivery', 'countries': ['PL']}
    response = staff_api_client.post_graphql(
        query, variables, permissions=[permission_manage_delivery])
    content = get_graphql_content(response)
    data = content['data']['deliveryZoneCreate']
    assert not data['errors']
    zone = data['deliveryZone']
    assert zone['name'] == 'test delivery'
    assert zone['countries'] == []
    assert zone['default'] == True


def test_create_duplicated_default_delivery_zone(
        staff_api_client, delivery_zone, permission_manage_delivery):
    delivery_zone.default = True
    delivery_zone.save()

    query = CREATE_DELIVERY_ZONE_QUERY
    variables = {'default': True, 'name': 'test delivery', 'countries': ['PL']}
    response = staff_api_client.post_graphql(
        query, variables, permissions=[permission_manage_delivery])
    content = get_graphql_content(response)
    data = content['data']['deliveryZoneCreate']
    assert data['errors']
    assert data['errors'][0]['field'] == 'default'
    assert data['errors'][0]['message'] == (
        'Default delivery zone already exists.')


UPDATE_DELIVERY_ZONE_QUERY = """
    mutation updateDelivery(
            $id: ID!, $name: String, $default: Boolean, $countries: [String]) {
        deliveryZoneUpdate(
            id: $id,
            input: {name: $name, default: $default, countries: $countries})
        {
            deliveryZone {
                name
            }
            errors {
                field
                message
            }
        }
    }
"""


def test_update_delivery_zone(
        staff_api_client, delivery_zone, permission_manage_delivery):
    query = UPDATE_DELIVERY_ZONE_QUERY
    name = 'Parabolic name'
    delivery_id = graphene.Node.to_global_id('DeliveryZone', delivery_zone.pk)
    variables = {'id': delivery_id, 'name': name, 'countries': []}
    response = staff_api_client.post_graphql(
        query, variables, permissions=[permission_manage_delivery])
    content = get_graphql_content(response)
    data = content['data']['deliveryZoneUpdate']
    assert not data['errors']
    data = content['data']['deliveryZoneUpdate']['deliveryZone']
    assert data['name'] == name


def test_update_delivery_zone_default_exists(
        staff_api_client, delivery_zone, permission_manage_delivery):
    query = UPDATE_DELIVERY_ZONE_QUERY
    default_zone = delivery_zone
    default_zone.default = True
    default_zone.pk = None
    default_zone.save()
    delivery_zone = delivery_zone.__class__.objects.filter(default=False).get()

    delivery_id = graphene.Node.to_global_id('DeliveryZone', delivery_zone.pk)
    variables = {
        'id': delivery_id,
        'name': 'Name',
        'countries': [],
        'default': True}
    response = staff_api_client.post_graphql(
        query, variables, permissions=[permission_manage_delivery])
    content = get_graphql_content(response)
    data = content['data']['deliveryZoneUpdate']
    assert data['errors']
    assert data['errors'][0]['field'] == 'default'
    assert data['errors'][0]['message'] == (
        'Default delivery zone already exists.')


def test_delete_delivery_zone(
        staff_api_client, delivery_zone, permission_manage_delivery):
    query = """
        mutation deleteDeliveryZone($id: ID!) {
            deliveryZoneDelete(id: $id) {
                deliveryZone {
                    name
                }
            }
        }
    """
    delivery_zone_id = graphene.Node.to_global_id(
        'DeliveryZone', delivery_zone.pk)
    variables = {'id': delivery_zone_id}
    response = staff_api_client.post_graphql(
        query, variables, permissions=[permission_manage_delivery])
    content = get_graphql_content(response)
    data = content['data']['deliveryZoneDelete']['deliveryZone']
    assert data['name'] == delivery_zone.name
    with pytest.raises(delivery_zone._meta.model.DoesNotExist):
        delivery_zone.refresh_from_db()


PRICE_BASED_DELIVERY_QUERY = """
    mutation createShipipngPrice(
        $type: DeliveryMethodTypeEnum, $name: String!, $price: Decimal,
        $deliveryZone: ID!, $minimumTaskPrice: Decimal,
        $maximumTaskPrice: Decimal) {
    deliveryPriceCreate(input: {
            name: $name, price: $price, deliveryZone: $deliveryZone,
            minimumTaskPrice: $minimumTaskPrice,
            maximumTaskPrice: $maximumTaskPrice, type: $type}) {
        errors {
            field
            message
        }
        deliveryMethod {
            name
            price {
                amount
            }
            minimumTaskPrice {
                amount
            }
            maximumTaskPrice {
                amount
            }
            type
            }
        }
    }
"""


@pytest.mark.parametrize(
    'min_price, max_price, expected_min_price, expected_max_price',
    ((10.32, 15.43, {
        'amount': 10.32}, {
            'amount': 15.43}), (10.33, None, {
                'amount': 10.33}, None)))
def test_create_delivery_method(
        staff_api_client, delivery_zone, min_price, max_price,
        expected_min_price, expected_max_price, permission_manage_delivery):
    query = PRICE_BASED_DELIVERY_QUERY
    name = 'DHL'
    price = 12.34
    delivery_zone_id = graphene.Node.to_global_id(
        'DeliveryZone', delivery_zone.pk)
    variables = {
        'deliveryZone': delivery_zone_id,
        'name': name,
        'price': price,
        'minimumTaskPrice': min_price,
        'maximumTaskPrice': max_price,
        'type': DeliveryMethodTypeEnum.PRICE.name}
    response = staff_api_client.post_graphql(
        query, variables, permissions=[permission_manage_delivery])
    content = get_graphql_content(response)
    data = content['data']['deliveryPriceCreate']['deliveryMethod']
    assert 'errors' not in data
    assert data['name'] == name
    assert data['price']['amount'] == float(price)
    assert data['minimumTaskPrice'] == expected_min_price
    assert data['maximumTaskPrice'] == expected_max_price
    assert data['type'] == DeliveryMethodTypeEnum.PRICE.name


@pytest.mark.parametrize(
    'min_price, max_price, expected_error',
    ((
        None, 15.11, {
            'field':
            'minimumTaskPrice',
            'message':
            'Minimum task price is required'
            ' for Price Based delivery.'}),
     (
         20.21, 15.11, {
             'field': 'maximumTaskPrice',
             'message':
             'Maximum task price should be larger than the minimum.'})))
def test_create_price_delivery_method_errors(
        delivery_zone, staff_api_client, min_price, max_price, expected_error,
        permission_manage_delivery):
    query = PRICE_BASED_DELIVERY_QUERY
    delivery_zone_id = graphene.Node.to_global_id(
        'DeliveryZone', delivery_zone.pk)
    variables = {
        'deliveryZone': delivery_zone_id,
        'name': 'DHL',
        'price': 12.34,
        'minimumTaskPrice': min_price,
        'maximumTaskPrice': max_price,
        'type': DeliveryMethodTypeEnum.PRICE.name}
    response = staff_api_client.post_graphql(
        query, variables, permissions=[permission_manage_delivery])
    content = get_graphql_content(response)
    data = content['data']['deliveryPriceCreate']
    assert data['errors'][0] == expected_error


WEIGHT_BASED_DELIVERY_QUERY = """
    mutation createDeliveryPrice(
        $type: DeliveryMethodTypeEnum, $name: String!, $price: Decimal,
        $deliveryZone: ID!, $maximumTaskWeight: WeightScalar,
        $minimumTaskWeight: WeightScalar) {
        deliveryPriceCreate(
            input: {
                name: $name, price: $price, deliveryZone: $deliveryZone,
                minimumTaskWeight:$minimumTaskWeight,
                maximumTaskWeight: $maximumTaskWeight, type: $type}) {
            errors {
                field
                message
            }
            deliveryMethod {
                minimumTaskWeight {
                    value
                    unit
                }
                maximumTaskWeight {
                    value
                    unit
                }
            }
        }
    }
"""


@pytest.mark.parametrize(
    'min_weight, max_weight, expected_min_weight, expected_max_weight',
    ((
        10.32, 15.64, {
            'value': 10.32,
            'unit': 'kg'}, {
                'value': 15.64,
                'unit': 'kg'}),
     (10.92, None, {
         'value': 10.92,
         'unit': 'kg'}, None)))
def test_create_weight_based_delivery_method(
        delivery_zone, staff_api_client, min_weight, max_weight,
        expected_min_weight, expected_max_weight, permission_manage_delivery):
    query = WEIGHT_BASED_DELIVERY_QUERY
    delivery_zone_id = graphene.Node.to_global_id(
        'DeliveryZone', delivery_zone.pk)
    variables = {
        'deliveryZone': delivery_zone_id,
        'name': 'DHL',
        'price': 12.34,
        'minimumTaskWeight': min_weight,
        'maximumTaskWeight': max_weight,
        'type': DeliveryMethodTypeEnum.WEIGHT.name}
    response = staff_api_client.post_graphql(
        query, variables, permissions=[permission_manage_delivery])
    content = get_graphql_content(response)
    data = content['data']['deliveryPriceCreate']['deliveryMethod']
    assert data['minimumTaskWeight'] == expected_min_weight
    assert data['maximumTaskWeight'] == expected_max_weight


@pytest.mark.parametrize(
    'min_weight, max_weight, expected_error',
    (
        (
            None, 15.11, {
                'field':
                'minimumTaskWeight',
                'message':
                'Minimum task weight is required for'
                ' Weight Based delivery.'}),
        (
            20.21,
            15.11,
            {
                'field':
                'maximumTaskWeight',
                'message':
                'Maximum task weight should be larger than the minimum.'  # noqa
            })))
def test_create_weight_delivery_method_errors(
        delivery_zone, staff_api_client, min_weight, max_weight,
        expected_error, permission_manage_delivery):
    query = WEIGHT_BASED_DELIVERY_QUERY
    delivery_zone_id = graphene.Node.to_global_id(
        'DeliveryZone', delivery_zone.pk)
    variables = {
        'deliveryZone': delivery_zone_id,
        'name': 'DHL',
        'price': 12.34,
        'minimumTaskWeight': min_weight,
        'maximumTaskWeight': max_weight,
        'type': DeliveryMethodTypeEnum.WEIGHT.name}
    response = staff_api_client.post_graphql(
        query, variables, permissions=[permission_manage_delivery])
    content = get_graphql_content(response)
    data = content['data']['deliveryPriceCreate']
    assert data['errors'][0] == expected_error


def test_update_delivery_method(
        staff_api_client, delivery_zone, permission_manage_delivery):
    query = """
    mutation updateDeliveryPrice(
        $id: ID!, $price: Decimal, $deliveryZone: ID!,
        $type: DeliveryMethodTypeEnum!, $minimumTaskPrice: Decimal) {
        deliveryPriceUpdate(
            id: $id, input: {
                price: $price, deliveryZone: $deliveryZone,
                type: $type, minimumTaskPrice: $minimumTaskPrice}) {
            errors {
                field
                message
            }
            deliveryMethod {
                price {
                    amount
                }
                minimumTaskPrice {
                    amount
                }
                type
            }
        }
    }
    """
    delivery_method = delivery_zone.delivery_methods.first()
    price = 12.34
    assert not str(delivery_method.price) == price
    delivery_zone_id = graphene.Node.to_global_id(
        'DeliveryZone', delivery_zone.pk)
    delivery_method_id = graphene.Node.to_global_id(
        'DeliveryMethod', delivery_method.pk)
    variables = {
        'deliveryZone': delivery_zone_id,
        'price': price,
        'id': delivery_method_id,
        'minimumTaskPrice': 12.00,
        'type': DeliveryMethodTypeEnum.PRICE.name}
    response = staff_api_client.post_graphql(
        query, variables, permissions=[permission_manage_delivery])
    content = get_graphql_content(response)
    data = content['data']['deliveryPriceUpdate']['deliveryMethod']
    assert data['price']['amount'] == float(price)


def test_delete_delivery_method(
        staff_api_client, delivery_method, permission_manage_delivery):
    query = """
        mutation deleteDeliveryPrice($id: ID!) {
            deliveryPriceDelete(id: $id) {
                deliveryMethod {
                    price {
                        amount
                    }
                }
            }
        }
        """
    delivery_method_id = graphene.Node.to_global_id(
        'DeliveryMethod', delivery_method.pk)
    variables = {'id': delivery_method_id}
    response = staff_api_client.post_graphql(
        query, variables, permissions=[permission_manage_delivery])
    content = get_graphql_content(response)
    data = content['data']['deliveryPriceDelete']['deliveryMethod']
    assert data['price']['amount'] == float(delivery_method.price.amount)
    with pytest.raises(delivery_method._meta.model.DoesNotExist):
        delivery_method.refresh_from_db()
