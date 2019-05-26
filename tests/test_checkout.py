import datetime
from unittest.mock import Mock, patch

import pytest
from django.urls import reverse
from django_countries.fields import Country
from freezegun import freeze_time
from prices import Money, TaxedMoney

from remote_works.account.models import Address
from remote_works.checkout import views
from remote_works.checkout.forms import CartVoucherForm, CountryForm
from remote_works.checkout.utils import (
    add_variant_to_cart, add_voucher_to_cart, change_billing_address_in_cart,
    change_delivery_address_in_cart, clear_delivery_method, create_order,
    get_cart_data_for_checkout,
    get_prices_of_products_in_discounted_categories, get_taxes_for_cart,
    get_voucher_discount_for_cart, get_voucher_for_cart,
    is_valid_delivery_method, recalculate_cart_discount,
    remove_voucher_from_cart)
from remote_works.core.exceptions import InsufficientStock
from remote_works.core.utils.taxes import (
    ZERO_MONEY, ZERO_TAXED_MONEY, get_taxes_for_country)
from remote_works.discount import DiscountValueType, VoucherType
from remote_works.discount.models import NotApplicable, Voucher
from remote_works.product.models import Category
from remote_works.delivery.models import DeliveryZone

from .utils import compare_taxes, get_redirect_location


def test_country_form_country_choices():
    form = CountryForm(data={'csrf': '', 'country': 'PL'})
    assert form.fields['country'].choices == []

    zone = DeliveryZone.objects.create(countries=['PL', 'DE'], name='Europe')
    form = CountryForm(data={'csrf': '', 'country': 'PL'})

    expected_choices = [
        (country.code, country.name) for country in zone.countries]
    expected_choices = sorted(
        expected_choices, key=lambda choice: choice[1])
    assert form.fields['country'].choices == expected_choices


def test_is_valid_delivery_method(
        cart_with_item, address, delivery_zone, vatlayer):
    cart = cart_with_item
    cart.delivery_address = address
    cart.save()
    # no delivery method assigned
    assert not is_valid_delivery_method(cart, vatlayer, None)
    delivery_method = delivery_zone.delivery_methods.first()
    cart.delivery_method = delivery_method
    cart.save()

    assert is_valid_delivery_method(cart, vatlayer, None)

    zone = DeliveryZone.objects.create(name='DE', countries=['DE'])
    delivery_method.delivery_zone = zone
    delivery_method.save()
    assert not is_valid_delivery_method(cart, vatlayer, None)


def test_clear_delivery_method(cart, delivery_method):
    cart.delivery_method = delivery_method
    cart.save()
    clear_delivery_method(cart)
    cart.refresh_from_db()
    assert not cart.delivery_method


@pytest.mark.parametrize('cart_length, is_delivery_required, redirect_url', [
    (0, True, reverse('cart:index')),
    (0, False, reverse('cart:index')),
    (1, True, reverse('checkout:delivery-address')),
    (1, False, reverse('checkout:summary'))])
def test_view_checkout_index(
        monkeypatch, rf, cart_length, is_delivery_required, redirect_url):
    cart = Mock(
        __len__=Mock(return_value=cart_length),
        is_delivery_required=Mock(return_value=is_delivery_required))
    monkeypatch.setattr(
        'remote_works.checkout.utils.get_cart_from_request', lambda req, qs: cart)
    url = reverse('checkout:index')
    request = rf.get(url, follow=True)

    response = views.checkout_index(request)

    assert response.url == redirect_url


def test_view_checkout_index_authorized_user(
        authorized_client, customer_user, request_cart_with_item):
    request_cart_with_item.user = customer_user
    request_cart_with_item.save()
    url = reverse('checkout:index')

    response = authorized_client.get(url, follow=True)

    redirect_url = reverse('checkout:delivery-address')
    assert response.request['PATH_INFO'] == redirect_url


def test_view_checkout_delivery_address(client, request_cart_with_item):
    url = reverse('checkout:delivery-address')
    data = {
        'email': 'test@example.com',
        'first_name': 'John',
        'last_name': 'Doe',
        'street_address_1': 'Aleje Jerozolimskie 2',
        'street_address_2': '',
        'city': 'Warszawa',
        'city_area': '',
        'country_area': '',
        'postal_code': '00-374',
        'phone': '+48536984008',
        'country': 'PL'}

    response = client.get(url)

    assert response.request['PATH_INFO'] == url

    response = client.post(url, data, follow=True)

    redirect_url = reverse('checkout:delivery-method')
    assert response.request['PATH_INFO'] == redirect_url
    assert request_cart_with_item.email == 'test@example.com'


def test_view_checkout_delivery_address_with_invalid_data(
        client, request_cart_with_item):
    url = reverse('checkout:delivery-address')
    data = {
        'email': 'test@example.com',
        'first_name': 'John',
        'last_name': 'Doe',
        'street_address_1': 'Aleje Jerozolimskie 2',
        'street_address_2': '',
        'city': 'Warszawa',
        'city_area': '',
        'country_area': '',
        'postal_code': '00-37412',
        'phone': '+48536984008',
        'country': 'PL'}

    response = client.post(url, data, follow=True)
    assert response.request['PATH_INFO'] == url


def test_view_checkout_delivery_address_authorized_user(
        authorized_client, customer_user, request_cart_with_item):
    request_cart_with_item.user = customer_user
    request_cart_with_item.save()
    url = reverse('checkout:delivery-address')
    data = {'address': customer_user.default_billing_address.pk}

    response = authorized_client.post(url, data, follow=True)

    redirect_url = reverse('checkout:delivery-method')
    assert response.request['PATH_INFO'] == redirect_url
    assert request_cart_with_item.email == customer_user.email


def test_view_checkout_delivery_address_without_delivery(
        request_cart, skill_without_delivery, client):
    variant = skill_without_delivery.variants.get()
    add_variant_to_cart(request_cart, variant)
    url = reverse('checkout:delivery-address')

    response = client.get(url)

    assert response.status_code == 302
    assert get_redirect_location(response) == reverse('checkout:summary')
    assert not request_cart.email


def test_view_checkout_delivery_method(
        client, delivery_zone, address, request_cart_with_item):
    request_cart_with_item.delivery_address = address
    request_cart_with_item.email = 'test@example.com'
    request_cart_with_item.save()
    url = reverse('checkout:delivery-method')
    data = {'delivery_method': delivery_zone.delivery_methods.first().pk}

    response = client.get(url)

    assert response.request['PATH_INFO'] == url

    response = client.post(url, data, follow=True)

    redirect_url = reverse('checkout:summary')
    assert response.request['PATH_INFO'] == redirect_url


def test_view_checkout_delivery_method_authorized_user(
        authorized_client, customer_user, delivery_zone, address,
        request_cart_with_item):
    request_cart_with_item.user = customer_user
    request_cart_with_item.email = customer_user.email
    request_cart_with_item.delivery_address = address
    request_cart_with_item.save()
    url = reverse('checkout:delivery-method')
    data = {'delivery_method': delivery_zone.delivery_methods.first().pk}

    response = authorized_client.get(url)

    assert response.request['PATH_INFO'] == url

    response = authorized_client.post(url, data, follow=True)

    redirect_url = reverse('checkout:summary')
    assert response.request['PATH_INFO'] == redirect_url


def test_view_checkout_delivery_method_without_delivery(
        request_cart, skill_without_delivery, client):
    variant = skill_without_delivery.variants.get()
    add_variant_to_cart(request_cart, variant)
    url = reverse('checkout:delivery-method')

    response = client.get(url)

    assert response.status_code == 302
    assert get_redirect_location(response) == reverse('checkout:summary')


def test_view_checkout_delivery_method_without_address(
        request_cart_with_item, client):
    url = reverse('checkout:delivery-method')

    response = client.get(url)

    assert response.status_code == 302
    redirect_url = reverse('checkout:delivery-address')
    assert get_redirect_location(response) == redirect_url


@patch('remote_works.checkout.views.summary.send_task_confirmation')
def test_view_checkout_summary(
        mock_send_confirmation, client, delivery_zone, address,
        request_cart_with_item):
    request_cart_with_item.delivery_address = address
    request_cart_with_item.email = 'test@example.com'
    request_cart_with_item.delivery_method = (
        delivery_zone.delivery_methods.first())
    request_cart_with_item.save()
    url = reverse('checkout:summary')
    data = {'address': 'delivery_address'}

    response = client.get(url)

    assert response.request['PATH_INFO'] == url

    response = client.post(url, data, follow=True)

    task = response.context['task']
    assert task.user_email == 'test@example.com'
    redirect_url = reverse('task:payment', kwargs={'token': task.token})
    assert response.request['PATH_INFO'] == redirect_url
    mock_send_confirmation.delay.assert_called_once_with(task.pk)

    # cart should be deleted after task is created
    assert request_cart_with_item.pk is None


@patch('remote_works.checkout.views.summary.send_task_confirmation')
def test_view_checkout_summary_authorized_user(
        mock_send_confirmation, authorized_client, customer_user,
        delivery_zone, address, request_cart_with_item):
    request_cart_with_item.delivery_address = address
    request_cart_with_item.user = customer_user
    request_cart_with_item.email = customer_user.email
    request_cart_with_item.delivery_method = (
        delivery_zone.delivery_methods.first())
    request_cart_with_item.save()
    url = reverse('checkout:summary')
    data = {'address': 'delivery_address'}

    response = authorized_client.get(url)

    assert response.request['PATH_INFO'] == url

    response = authorized_client.post(url, data, follow=True)

    task = response.context['task']
    assert task.user_email == customer_user.email
    redirect_url = reverse('task:payment', kwargs={'token': task.token})
    assert response.request['PATH_INFO'] == redirect_url
    mock_send_confirmation.delay.assert_called_once_with(task.pk)


@patch('remote_works.checkout.views.summary.send_task_confirmation')
def test_view_checkout_summary_save_language(
        mock_send_confirmation, authorized_client, customer_user,
        delivery_zone, address, request_cart_with_item, settings):
    settings.LANGUAGE_CODE = 'en'
    user_language = 'fr'
    authorized_client.cookies[settings.LANGUAGE_COOKIE_NAME] = user_language
    url = reverse('set_language')
    data = {'language': 'fr'}

    authorized_client.post(url, data)

    request_cart_with_item.delivery_address = address
    request_cart_with_item.user = customer_user
    request_cart_with_item.email = customer_user.email
    request_cart_with_item.delivery_method = (
        delivery_zone.delivery_methods.first())
    request_cart_with_item.save()
    url = reverse('checkout:summary')
    data = {'address': 'delivery_address'}

    response = authorized_client.get(url, HTTP_ACCEPT_LANGUAGE=user_language)

    assert response.request['PATH_INFO'] == url

    response = authorized_client.post(
        url, data, follow=True, HTTP_ACCEPT_LANGUAGE=user_language)

    task = response.context['task']
    assert task.user_email == customer_user.email
    assert task.language_code == user_language
    redirect_url = reverse('task:payment', kwargs={'token': task.token})
    assert response.request['PATH_INFO'] == redirect_url
    mock_send_confirmation.delay.assert_called_once_with(task.pk)


def test_view_checkout_summary_without_address(request_cart_with_item, client):
    url = reverse('checkout:summary')

    response = client.get(url)

    assert response.status_code == 302
    redirect_url = reverse('checkout:delivery-address')
    assert get_redirect_location(response) == redirect_url


def test_view_checkout_summary_without_delivery_zone(
        request_cart_with_item, client, address):
    request_cart_with_item.delivery_address = address
    request_cart_with_item.email = 'test@example.com'
    request_cart_with_item.save()

    url = reverse('checkout:summary')
    response = client.get(url)

    assert response.status_code == 302
    redirect_url = reverse('checkout:delivery-method')
    assert get_redirect_location(response) == redirect_url


def test_view_checkout_summary_with_invalid_voucher(
        client, request_cart_with_item, delivery_zone, address, voucher):
    voucher.usage_limit = 3
    voucher.save()

    request_cart_with_item.delivery_address = address
    request_cart_with_item.email = 'test@example.com'
    request_cart_with_item.delivery_method = (
        delivery_zone.delivery_methods.first())
    request_cart_with_item.save()

    url = reverse('checkout:summary')
    voucher_url = '{url}?next={url}'.format(url=url)
    data = {'discount-voucher': voucher.code}

    response = client.post(voucher_url, data, follow=True, HTTP_REFERER=url)

    assert response.context['cart'].voucher_code == voucher.code

    voucher.used = 3
    voucher.save()

    data = {'address': 'delivery_address'}
    response = client.post(url, data, follow=True)
    cart = response.context['cart']
    assert not cart.voucher_code
    assert not cart.discount_amount
    assert not cart.discount_name

    response = client.post(url, data, follow=True)
    task = response.context['task']
    assert not task.voucher
    assert not task.discount_amount
    assert not task.discount_name


def test_view_checkout_summary_with_invalid_voucher_code(
        client, request_cart_with_item, delivery_zone, address):
    request_cart_with_item.delivery_address = address
    request_cart_with_item.email = 'test@example.com'
    request_cart_with_item.delivery_method = (
        delivery_zone.delivery_methods.first())
    request_cart_with_item.save()

    url = reverse('checkout:summary')
    voucher_url = '{url}?next={url}'.format(url=url)
    data = {'discount-voucher': 'invalid-code'}

    response = client.post(voucher_url, data, follow=True, HTTP_REFERER=url)

    assert 'voucher' in response.context['voucher_form'].errors
    assert response.context['cart'].voucher_code is None


def test_view_checkout_place_task_with_expired_voucher_code(
        client, request_cart_with_item, delivery_zone, address, voucher):

    cart = request_cart_with_item

    # add delivery information to the cart
    cart.delivery_address = address
    cart.email = 'test@example.com'
    cart.delivery_method = (
        delivery_zone.delivery_methods.first())

    # set voucher to be expired
    yesterday = datetime.date.today() - datetime.timedelta(days=1)
    voucher.end_date = yesterday
    voucher.save()

    # put the voucher code to cart
    cart.voucher_code = voucher.code

    # save the cart
    cart.save()

    checkout_url = reverse('checkout:summary')

    # place task
    data = {'address': 'delivery_address'}
    response = client.post(checkout_url, data, follow=True)

    # task should not have been placed
    assert response.request['PATH_INFO'] == checkout_url

    # ensure the voucher was removed
    cart.refresh_from_db()
    assert not cart.voucher_code


def test_view_checkout_place_task_with_item_out_of_stock(
        client, request_cart_with_item,
        delivery_zone, address, voucher, product):

    cart = request_cart_with_item
    variant = product.variants.get()

    # add delivery information to the cart
    cart.delivery_address = address
    cart.email = 'test@example.com'
    cart.delivery_method = delivery_zone.delivery_methods.first()
    cart.save()

    # make the variant be out of availability
    variant.quantity = 0
    variant.save()

    checkout_url = reverse('checkout:summary')
    redirect_url = reverse('cart:index')

    # place task
    data = {'address': 'delivery_address'}
    response = client.post(checkout_url, data, follow=True)

    # task should have been aborted,
    # and user should have been redirected to its cart
    assert response.request['PATH_INFO'] == redirect_url


def test_view_checkout_place_task_without_delivery_address(
        client, request_cart_with_item, delivery_zone):

    cart = request_cart_with_item

    # add delivery information to the cart
    cart.email = 'test@example.com'
    cart.delivery_method = (
        delivery_zone.delivery_methods.first())

    # save the cart
    cart.save()

    checkout_url = reverse('checkout:summary')
    redirect_url = reverse('checkout:delivery-address')

    # place task
    data = {'address': 'delivery_address'}
    response = client.post(checkout_url, data, follow=True)

    # task should have been aborted,
    # and user should have been redirected to its cart
    assert response.request['PATH_INFO'] == redirect_url


def test_view_checkout_summary_remove_voucher(
        client, request_cart_with_item, delivery_zone, voucher, address):
    request_cart_with_item.delivery_address = address
    request_cart_with_item.email = 'test@example.com'
    request_cart_with_item.delivery_method = (
        delivery_zone.delivery_methods.first())
    request_cart_with_item.save()

    remove_voucher_url = reverse('checkout:summary')
    voucher_url = '{url}?next={url}'.format(url=remove_voucher_url)
    data = {'discount-voucher': voucher.code}

    response = client.post(
        voucher_url, data, follow=True, HTTP_REFERER=remove_voucher_url)

    assert response.context['cart'].voucher_code == voucher.code

    url = reverse('checkout:remove-voucher')

    response = client.post(url, follow=True, HTTP_REFERER=remove_voucher_url)

    assert not response.context['cart'].voucher_code


def test_create_task_insufficient_stock(
        request_cart, customer_user, skill_without_delivery):
    variant = skill_without_delivery.variants.get()
    add_variant_to_cart(request_cart, variant, 10, check_quantity=False)
    request_cart.user = customer_user
    request_cart.billing_address = customer_user.default_billing_address
    request_cart.delivery_address = customer_user.default_billing_address
    request_cart.save()

    with pytest.raises(InsufficientStock):
        create_order(
            request_cart, 'tracking_code', discounts=None, taxes=None)


def test_create_task_doesnt_duplicate_order(
        cart_with_item, customer_user, delivery_method):
    cart = cart_with_item
    cart.user = customer_user
    cart.billing_address = customer_user.default_billing_address
    cart.delivery_address = customer_user.default_billing_address
    cart.delivery_method = delivery_method
    cart.save()

    task_1 = create_order(cart, tracking_code='', discounts=None, taxes=None)
    assert task_1.checkout_token == cart_with_item.token
    task_2 = create_order(cart, tracking_code='', discounts=None, taxes=None)
    assert task_1.pk == task_2.pk


def test_note_in_created_order(request_cart_with_item, address):
    request_cart_with_item.delivery_address = address
    request_cart_with_item.note = 'test_note'
    request_cart_with_item.save()
    task = create_order(
        request_cart_with_item, 'tracking_code', discounts=None, taxes=None)
    assert task.customer_note == request_cart_with_item.note


@pytest.mark.parametrize(
    'total, discount_value, discount_type, min_amount_spent, discount_amount', [
        ('100', 10, DiscountValueType.FIXED, None, 10),
        ('100.05', 10, DiscountValueType.PERCENTAGE, 100, 10)])
def test_get_discount_for_cart_value_voucher(
        total, discount_value, discount_type, min_amount_spent,
        discount_amount):
    voucher = Voucher(
        code='unique',
        type=VoucherType.VALUE,
        discount_value_type=discount_type,
        discount_value=discount_value,
        min_amount_spent=(
            Money(min_amount_spent, 'USD')
            if min_amount_spent is not None else None))
    subtotal = TaxedMoney(net=Money(total, 'USD'), gross=Money(total, 'USD'))
    cart = Mock(get_subtotal=Mock(return_value=subtotal))
    discount = get_voucher_discount_for_cart(voucher, cart)
    assert discount == Money(discount_amount, 'USD')


def test_get_discount_for_cart_value_voucher_not_applicable():
    voucher = Voucher(
        code='unique',
        type=VoucherType.VALUE,
        discount_value_type=DiscountValueType.FIXED,
        discount_value=10,
        min_amount_spent=Money(100, 'USD'))
    subtotal = TaxedMoney(net=Money(10, 'USD'), gross=Money(10, 'USD'))
    cart = Mock(get_subtotal=Mock(return_value=subtotal))
    with pytest.raises(NotApplicable) as e:
        get_voucher_discount_for_cart(voucher, cart)
    assert e.value.min_amount_spent == Money(100, 'USD')


@pytest.mark.parametrize(
    'delivery_cost, delivery_country_code, discount_value, discount_type,'
    'countries, expected_value', [
        (10, None, 50, DiscountValueType.PERCENTAGE, [], 5),
        (10, None, 20, DiscountValueType.FIXED, [], 10),
        (10, 'PL', 20, DiscountValueType.FIXED, [], 10),
        (5, 'PL', 5, DiscountValueType.FIXED, ['PL'], 5)])
def test_get_discount_for_cart_delivery_voucher(
        delivery_cost, delivery_country_code, discount_value,
        discount_type, countries, expected_value):
    subtotal = TaxedMoney(net=Money(100, 'USD'), gross=Money(100, 'USD'))
    delivery_total = TaxedMoney(
        net=Money(delivery_cost, 'USD'), gross=Money(delivery_cost, 'USD'))
    cart = Mock(
        get_subtotal=Mock(return_value=subtotal),
        is_delivery_required=Mock(return_value=True),
        delivery_method=Mock(
            get_total=Mock(return_value=delivery_total)),
        delivery_address=Mock(country=Country(delivery_country_code)))
    voucher = Voucher(
        code='unique', type=VoucherType.DELIVERY,
        discount_value_type=discount_type,
        discount_value=discount_value,
        countries=countries)
    discount = get_voucher_discount_for_cart(voucher, cart)
    assert discount == Money(expected_value, 'USD')


def test_get_discount_for_cart_delivery_voucher_all_countries():
    subtotal = TaxedMoney(net=Money(100, 'USD'), gross=Money(100, 'USD'))
    delivery_total = TaxedMoney(net=Money(10, 'USD'), gross=Money(10, 'USD'))
    cart = Mock(
        get_subtotal=Mock(return_value=subtotal),
        is_delivery_required=Mock(return_value=True),
        delivery_method=Mock(get_total=Mock(return_value=delivery_total)),
        delivery_address=Mock(country=Country('PL')))
    voucher = Voucher(
        code='unique', type=VoucherType.DELIVERY,
        discount_value_type=DiscountValueType.PERCENTAGE,
        discount_value=50, countries=[])

    discount = get_voucher_discount_for_cart(voucher, cart)

    assert discount == Money(5, 'USD')


def test_get_discount_for_cart_delivery_voucher_limited_countries():
    subtotal = TaxedMoney(net=Money(100, 'USD'), gross=Money(100, 'USD'))
    delivery_total = TaxedMoney(net=Money(10, 'USD'), gross=Money(10, 'USD'))
    cart = Mock(
        get_subtotal=Mock(return_value=subtotal),
        is_delivery_required=Mock(return_value=True),
        delivery_method=Mock(get_total=Mock(return_value=delivery_total)),
        delivery_address=Mock(country=Country('PL')))
    voucher = Voucher(
        code='unique', type=VoucherType.DELIVERY,
        discount_value_type=DiscountValueType.PERCENTAGE,
        discount_value=50, countries=['UK', 'DE'])

    with pytest.raises(NotApplicable):
        get_voucher_discount_for_cart(voucher, cart)


@pytest.mark.parametrize(
    'is_delivery_required, delivery_method, discount_value, discount_type,'
    'countries, min_amount_spent, subtotal, error_msg', [
        (True, Mock(delivery_zone=Mock(countries=['PL'])),
         10, DiscountValueType.FIXED, ['US'], None, Money(10, 'USD'),
         'This offer is not valid in your country.'),
        (True, None, 10, DiscountValueType.FIXED,
         [], None, Money(10, 'USD'),
         'Please select a delivery method first.'),
        (False, None, 10, DiscountValueType.FIXED,
         [], None, Money(10, 'USD'),
         'Your task does not require delivery.'),
        (True, Mock(price=Money(10, 'USD')), 10,
         DiscountValueType.FIXED, [], 5, Money(2, 'USD'),
         'This offer is only valid for tasks over $5.00.')])
def test_get_discount_for_cart_delivery_voucher_not_applicable(
        is_delivery_required, delivery_method, discount_value,
        discount_type, countries, min_amount_spent, subtotal, error_msg):
    subtotal_price = TaxedMoney(net=subtotal, gross=subtotal)
    cart = Mock(
        get_subtotal=Mock(return_value=subtotal_price),
        is_delivery_required=Mock(return_value=is_delivery_required),
        delivery_method=delivery_method)
    voucher = Voucher(
        code='unique', type=VoucherType.DELIVERY,
        discount_value_type=discount_type,
        discount_value=discount_value,
        min_amount_spent=(
            Money(min_amount_spent, 'USD')
            if min_amount_spent is not None else None),
        countries=countries)
    with pytest.raises(NotApplicable) as e:
        get_voucher_discount_for_cart(voucher, cart)
    assert str(e.value) == error_msg


def test_get_discount_for_cart_skill_voucher_not_applicable(monkeypatch):
    monkeypatch.setattr(
        'remote_works.checkout.utils.get_prices_of_discounted_products',
        lambda cart, product: [])
    voucher = Voucher(
        code='unique', type=VoucherType.PRODUCT,
        discount_value_type=DiscountValueType.FIXED,
        discount_value=10)
    voucher.save()
    cart = Mock()

    with pytest.raises(NotApplicable) as e:
        get_voucher_discount_for_cart(voucher, cart)
    assert str(e.value) == 'This offer is only valid for selected items.'


def test_get_discount_for_cart_collection_voucher_not_applicable(monkeypatch):
    monkeypatch.setattr(
        'remote_works.checkout.utils.get_prices_of_products_in_discounted_collections',  # noqa
        lambda cart, product: [])
    voucher = Voucher(
        code='unique', type=VoucherType.COLLECTION,
        discount_value_type=DiscountValueType.FIXED,
        discount_value=10)
    voucher.save()
    cart = Mock()

    with pytest.raises(NotApplicable) as e:
        get_voucher_discount_for_cart(voucher, cart)
    assert str(e.value) == 'This offer is only valid for selected items.'


def test_cart_voucher_form_invalid_voucher_code(
        monkeypatch, request_cart_with_item):
    form = CartVoucherForm(
        {'voucher': 'invalid'}, instance=request_cart_with_item)
    assert not form.is_valid()
    assert 'voucher' in form.errors


def test_cart_voucher_form_voucher_not_applicable(
        voucher, request_cart_with_item):
    voucher.min_amount_spent = 200
    voucher.save()
    form = CartVoucherForm(
        {'voucher': voucher.code}, instance=request_cart_with_item)
    assert not form.is_valid()
    assert 'voucher' in form.errors


def test_cart_voucher_form_active_queryset_voucher_not_active(
        voucher, request_cart_with_item):
    assert Voucher.objects.count() == 1
    voucher.start_date = datetime.date.today() + datetime.timedelta(days=1)
    voucher.save()
    form = CartVoucherForm(
        {'voucher': voucher.code}, instance=request_cart_with_item)
    qs = form.fields['voucher'].queryset
    assert qs.count() == 0


def test_cart_voucher_form_active_queryset_voucher_active(
        voucher, request_cart_with_item):
    assert Voucher.objects.count() == 1
    voucher.start_date = datetime.date.today()
    voucher.save()
    form = CartVoucherForm(
        {'voucher': voucher.code}, instance=request_cart_with_item)
    qs = form.fields['voucher'].queryset
    assert qs.count() == 1


def test_cart_voucher_form_active_queryset_after_some_time(
        voucher, request_cart_with_item):
    assert Voucher.objects.count() == 1
    voucher.start_date = datetime.date(year=2016, month=6, day=1)
    voucher.end_date = datetime.date(year=2016, month=6, day=2)
    voucher.save()

    with freeze_time('2016-05-31'):
        form = CartVoucherForm(
            {'voucher': voucher.code}, instance=request_cart_with_item)
        assert form.fields['voucher'].queryset.count() == 0

    with freeze_time('2016-06-01'):
        form = CartVoucherForm(
            {'voucher': voucher.code}, instance=request_cart_with_item)
        assert form.fields['voucher'].queryset.count() == 1

    with freeze_time('2016-06-03'):
        form = CartVoucherForm(
            {'voucher': voucher.code}, instance=request_cart_with_item)
        assert form.fields['voucher'].queryset.count() == 0


def test_get_taxes_for_cart(cart, vatlayer):
    taxes = get_taxes_for_cart(cart, vatlayer)
    compare_taxes(taxes, vatlayer)


def test_get_taxes_for_cart_with_delivery_address(cart, address, vatlayer):
    address.country = 'DE'
    address.save()
    cart.delivery_address = address
    cart.save()
    taxes = get_taxes_for_cart(cart, vatlayer)
    compare_taxes(taxes, get_taxes_for_country(Country('DE')))


def test_get_taxes_for_cart_with_delivery_address_taxes_not_handled(
        cart, settings, address, vatlayer):
    settings.VATLAYER_ACCESS_KEY = ''
    address.country = 'DE'
    address.save()
    cart.delivery_address = address
    cart.save()
    assert not get_taxes_for_cart(cart, None)


def test_get_voucher_for_cart(cart_with_voucher, voucher):
    cart_voucher = get_voucher_for_cart(cart_with_voucher)
    assert cart_voucher == voucher


def test_get_voucher_for_cart_expired_voucher(cart_with_voucher, voucher):
    date_yesterday = datetime.date.today() - datetime.timedelta(days=1)
    voucher.end_date = date_yesterday
    voucher.save()
    cart_voucher = get_voucher_for_cart(cart_with_voucher)
    assert cart_voucher is None


def test_get_voucher_for_cart_no_voucher_code(cart):
    cart_voucher = get_voucher_for_cart(cart)
    assert cart_voucher is None


def test_remove_voucher_from_cart(cart_with_voucher, voucher_translation_fr):
    cart = cart_with_voucher
    remove_voucher_from_cart(cart)

    assert not cart.voucher_code
    assert not cart.discount_name
    assert not cart.translated_discount_name
    assert cart.discount_amount == ZERO_MONEY


def test_recalculate_cart_discount(
        cart_with_voucher, voucher, voucher_translation_fr, settings):
    settings.LANGUAGE_CODE = 'fr'
    voucher.discount_value = 10
    voucher.save()

    recalculate_cart_discount(cart_with_voucher, None, None)
    assert cart_with_voucher.translated_discount_name == voucher_translation_fr.name  # noqa
    assert cart_with_voucher.discount_amount == Money('10.00', 'USD')


def test_recalculate_cart_discount_voucher_not_applicable(
        cart_with_voucher, voucher):
    cart = cart_with_voucher
    voucher.min_amount_spent = 100
    voucher.save()

    recalculate_cart_discount(cart_with_voucher, None, None)

    assert not cart.voucher_code
    assert not cart.discount_name
    assert cart.discount_amount == ZERO_MONEY


def test_recalculate_cart_discount_expired_voucher(cart_with_voucher, voucher):
    cart = cart_with_voucher
    date_yesterday = datetime.date.today() - datetime.timedelta(days=1)
    voucher.end_date = date_yesterday
    voucher.save()

    recalculate_cart_discount(cart_with_voucher, None, None)

    assert not cart.voucher_code
    assert not cart.discount_name
    assert cart.discount_amount == ZERO_MONEY


def test_get_cart_data_for_checkout(cart_with_voucher, vatlayer):
    line_price = TaxedMoney(
        net=Money('24.39', 'USD'), gross=Money('30.00', 'USD'))
    expected_data = {
        'cart': cart_with_voucher,
        'cart_are_taxes_handled': True,
        'cart_lines': [(cart_with_voucher.lines.first(), line_price)],
        'cart_delivery_price': ZERO_TAXED_MONEY,
        'cart_subtotal': line_price,
        'cart_total': line_price - cart_with_voucher.discount_amount}

    data = get_cart_data_for_checkout(
        cart_with_voucher, discounts=None, taxes=vatlayer)

    assert data == expected_data


def test_change_address_in_cart(cart, address):
    change_delivery_address_in_cart(cart, address)
    change_billing_address_in_cart(cart, address)

    cart.refresh_from_db()
    assert cart.delivery_address == address
    assert cart.billing_address == address


def test_change_address_in_cart_to_none(cart, address):
    cart.delivery_address = address
    cart.billing_address = address.get_copy()
    cart.save()

    change_delivery_address_in_cart(cart, None)
    change_billing_address_in_cart(cart, None)

    cart.refresh_from_db()
    assert cart.delivery_address is None
    assert cart.billing_address is None


def test_change_address_in_cart_to_same(cart, address):
    cart.delivery_address = address
    cart.billing_address = address.get_copy()
    cart.save(update_fields=['delivery_address', 'billing_address'])
    delivery_address_id = cart.delivery_address.id
    billing_address_id = cart.billing_address.id

    change_delivery_address_in_cart(cart, address)
    change_billing_address_in_cart(cart, address)

    cart.refresh_from_db()
    assert cart.delivery_address.id == delivery_address_id
    assert cart.billing_address.id == billing_address_id


def test_change_address_in_cart_to_other(cart, address):
    address_id = address.id
    cart.delivery_address = address
    cart.billing_address = address.get_copy()
    cart.save(update_fields=['delivery_address', 'billing_address'])
    other_address = Address.objects.create(country=Country('DE'))

    change_delivery_address_in_cart(cart, other_address)
    change_billing_address_in_cart(cart, other_address)

    cart.refresh_from_db()
    assert cart.delivery_address == other_address
    assert cart.billing_address == other_address
    assert not Address.objects.filter(id=address_id).exists()


def test_change_address_in_cart_from_user_address_to_other(
        cart, customer_user, address):
    address_id = address.id
    cart.user = customer_user
    cart.delivery_address = address
    cart.billing_address = address.get_copy()
    cart.save(update_fields=['delivery_address', 'billing_address'])
    other_address = Address.objects.create(country=Country('DE'))

    change_delivery_address_in_cart(cart, other_address)
    change_billing_address_in_cart(cart, other_address)

    cart.refresh_from_db()
    assert cart.delivery_address == other_address
    assert cart.billing_address == other_address
    assert Address.objects.filter(id=address_id).exists()


def test_get_prices_of_products_in_discounted_categories(cart_with_item):
    lines = cart_with_item.lines.all()
    # There's no discounted categories, therefore all of them are discoutned
    discounted_lines = get_prices_of_products_in_discounted_categories(
        lines, [])
    assert [
        line.variant.get_price()
        for line in lines
        for item in range(line.quantity)] == discounted_lines

    discounted_category = Category.objects.create(
        name='discounted', slug='discounted')
    discounted_lines = get_prices_of_products_in_discounted_categories(
        lines, [discounted_category])
    # None of the lines are belongs to the discounted category
    assert not discounted_lines


def test_add_voucher_to_cart(cart_with_item, voucher):
    assert cart_with_item.voucher_code is None
    add_voucher_to_cart(voucher, cart_with_item)

    assert cart_with_item.voucher_code == voucher.code


def test_add_voucher_to_cart_fail(
        cart_with_item, voucher_with_high_min_amount_spent):
    with pytest.raises(NotApplicable) as e:
        add_voucher_to_cart(
            voucher_with_high_min_amount_spent, cart_with_item)

    assert cart_with_item.voucher_code is None
