from unittest.mock import Mock

import pytest
from measurement.measures import Weight
from prices import Money, TaxedMoney

from remote_works.core.utils import format_money
from remote_works.core.utils.taxes import get_taxed_delivery_price
from remote_works.delivery.models import (
    DeliveryMethod, DeliveryMethodType, DeliveryZone)

from .utils import money


@pytest.mark.parametrize('price, charge_taxes, expected_price', [
    (Money(10, 'USD'), False, TaxedMoney(
        net=Money(10, 'USD'), gross=Money(10, 'USD'))),
    (Money(10, 'USD'), True, TaxedMoney(
        net=Money('8.13', 'USD'), gross=Money(10, 'USD')))])
def test_get_taxed_delivery_price(
        site_settings, vatlayer, price, charge_taxes, expected_price):
    site_settings.charge_taxes_on_delivery = charge_taxes
    site_settings.save()

    delivery_price = get_taxed_delivery_price(price, taxes=vatlayer)

    assert delivery_price == expected_price


def test_delivery_get_total(monkeypatch, delivery_zone, vatlayer):
    method = delivery_zone.delivery_methods.get()
    price = Money(10, 'USD')
    taxed_price = TaxedMoney(
        net=Money('8.13', 'USD'), gross=Money(10, 'USD'))
    mock_get_price = Mock(return_value=taxed_price)
    monkeypatch.setattr(
        'remote_works.delivery.models.get_taxed_delivery_price', mock_get_price)
    method.get_total(taxes=vatlayer)
    mock_get_price.assert_called_once_with(price, vatlayer)


def test_delivery_get_ajax_label(delivery_zone):
    delivery_method = delivery_zone.delivery_methods.get()
    label = delivery_method.get_ajax_label()
    proper_label = '%(delivery_method)s %(price)s' % {
        'delivery_method': delivery_method,
        'price': format_money(delivery_method.price)}
    assert label == proper_label


@pytest.mark.parametrize(
    'price, min_price, max_price, delivery_included', (
        (money(10), money(10), money(20), True),  # price equal min price
        (money(10), money(1), money(10), True),  # price equal max price
        (money(9), money(10), money(15), False),  # price just below min price
        (money(10), money(1), money(9), False),  # price just above max price
        (money(10000000), money(1), None, True),  # no max price limit
        (money(10), money(5), money(15), True)))  # regular case
def test_applicable_delivery_methods_price(
        delivery_zone, price, min_price, max_price, delivery_included):
    method = delivery_zone.delivery_methods.create(
        minimum_task_price=min_price, maximum_task_price=max_price,
        type=DeliveryMethodType.PRICE_BASED)
    assert 'PL' in delivery_zone.countries
    result = DeliveryMethod.objects.applicable_delivery_methods(
        price=price, weight=Weight(kg=0), country_code='PL')
    assert (method in result) == delivery_included


@pytest.mark.parametrize(
    'weight, min_weight, max_weight, delivery_included', (
        (Weight(kg=1), Weight(kg=1), Weight(kg=2), True),  # equal min weight
        (Weight(kg=10), Weight(kg=1), Weight(kg=10), True),  # equal max weight
        (Weight(kg=5), Weight(kg=8), Weight(kg=15), False),  # below min weight
        (Weight(kg=10), Weight(kg=1), Weight(kg=9), False),  # above max weight
        (Weight(kg=10000000), Weight(kg=1), None, True),  # no max weight limit
        (Weight(kg=10), Weight(kg=5), Weight(kg=15), True)))  # regular case
def test_applicable_delivery_methods_weight(
        weight, min_weight, max_weight, delivery_included, delivery_zone):
    method = delivery_zone.delivery_methods.create(
        minimum_task_weight=min_weight, maximum_task_weight=max_weight,
        type=DeliveryMethodType.WEIGHT_BASED)
    assert 'PL' in delivery_zone.countries
    result = DeliveryMethod.objects.applicable_delivery_methods(
        price=money(0), weight=weight, country_code='PL')
    assert (method in result) == delivery_included


def test_applicable_delivery_methods_country_code_outside_delivery_zone(
        delivery_zone):
    method = delivery_zone.delivery_methods.create(
        minimum_task_price=money(1), maximum_task_price=money(10),
        type=DeliveryMethodType.PRICE_BASED)
    delivery_zone.countries = ['DE']
    delivery_zone.save()
    result = DeliveryMethod.objects.applicable_delivery_methods(
        price=money(5), weight=Weight(kg=0), country_code='PL')
    assert method not in result


def test_applicable_delivery_methods_inproper_delivery_method_type(
        delivery_zone):
    """Case when delivery suits the price requirements of the weight type
    delivery method and the other way around.
    """
    price_method = delivery_zone.delivery_methods.create(
        minimum_task_price=money(1), maximum_task_price=money(10),
        minimum_task_weight=Weight(kg=100),
        type=DeliveryMethodType.WEIGHT_BASED)
    weight_method = delivery_zone.delivery_methods.create(
        minimum_task_weight=Weight(kg=1), maximum_task_weight=Weight(kg=10),
        minimum_task_price=money(1000), type=DeliveryMethodType.PRICE_BASED)
    result = DeliveryMethod.objects.applicable_delivery_methods(
        price=money(5), weight=Weight(kg=5), country_code='PL')
    assert price_method not in result
    assert weight_method not in result


def test_applicable_delivery_methods(delivery_zone):
    price_method = delivery_zone.delivery_methods.create(
        minimum_task_price=money(1), maximum_task_price=money(10),
        type=DeliveryMethodType.PRICE_BASED)
    weight_method = delivery_zone.delivery_methods.create(
        minimum_task_weight=Weight(kg=1), maximum_task_weight=Weight(kg=10),
        type=DeliveryMethodType.WEIGHT_BASED)
    result = DeliveryMethod.objects.applicable_delivery_methods(
        price=money(5), weight=Weight(kg=5), country_code='PL')
    assert price_method in result
    assert weight_method in result


def test_use_default_delivery_zone(delivery_zone):
    delivery_zone.countries = ['PL']
    delivery_zone.save()

    default_zone = DeliveryZone.objects.create(default=True, name='Default')
    weight_method = default_zone.delivery_methods.create(
        minimum_task_weight=Weight(kg=1), maximum_task_weight=Weight(kg=10),
        type=DeliveryMethodType.WEIGHT_BASED)
    result = DeliveryMethod.objects.applicable_delivery_methods(
        price=money(5), weight=Weight(kg=5), country_code='DE')
    assert result[0] == weight_method


@pytest.mark.parametrize(
    'countries, result',
    (
        (['PL'], 'Poland'),
        (['PL', 'DE', 'IT'], 'Poland, Germany, Italy'),
        (['PL', 'DE', 'IT', 'LE'], '4 countries'),
        ([], '0 countries')))
def test_countries_display(delivery_zone, countries, result):
    delivery_zone.countries = countries
    delivery_zone.save()
    assert delivery_zone.countries_display() == result
