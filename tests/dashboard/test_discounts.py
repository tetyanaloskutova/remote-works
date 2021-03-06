import json
from datetime import date
from decimal import Decimal
from unittest.mock import Mock

import pytest
from django.urls import reverse
from prices import Money, TaxedMoney

from remote_works.dashboard.task.utils import get_voucher_discount_for_order
from remote_works.discount import DiscountValueType, VoucherType
from remote_works.discount.models import NotApplicable, Sale, Voucher
from remote_works.product.models import Collection


def test_sales_list(admin_client, sale):
    url = reverse('dashboard:sale-list')
    response = admin_client.get(url)
    assert response.status_code == 200


def test_vouchers_list(admin_client, voucher):
    url = reverse('dashboard:voucher-list')
    response = admin_client.get(url)
    assert response.status_code == 200


def test_voucher_delivery_add(admin_client):
    assert Voucher.objects.count() == 0
    url = reverse('dashboard:voucher-add')
    data = {
        'code': 'TESTVOUCHER', 'name': 'Test Voucher',
        'start_date': '2018-01-01', 'end_date': '2018-06-01',
        'type': VoucherType.DELIVERY, 'discount_value': '15.99',
        'discount_value_type': DiscountValueType.FIXED,
        'delivery-min_amount_spent': '59.99'}
    response = admin_client.post(url, data, follow=True)
    assert response.status_code == 200
    assert Voucher.objects.count() == 1

    voucher = Voucher.objects.all()[0]
    assert voucher.type == VoucherType.DELIVERY
    assert voucher.code == data['code']
    assert voucher.name == data['name']
    assert voucher.start_date == date(2018, 1, 1)
    assert voucher.end_date == date(2018, 6, 1)
    assert voucher.discount_value_type == DiscountValueType.FIXED
    assert voucher.discount_value == Decimal('15.99')
    assert voucher.min_amount_spent == Money('59.99', 'USD')


def test_view_sale_add(admin_client, category, collection):
    url = reverse('dashboard:sale-add')
    data = {
        'name': 'Free skills',
        'type': DiscountValueType.PERCENTAGE,
        'value': 100,
        'categories': [category.id],
        'collections': [collection.id],
        'start_date': '2018-01-01'}

    response = admin_client.post(url, data)

    assert response.status_code == 302
    assert Sale.objects.count() == 1
    sale = Sale.objects.first()
    assert sale.name == data['name']
    assert category in sale.categories.all()
    assert collection in sale.collections.all()


def test_view_sale_add_requires_skill_category_or_collection(
        admin_client, category, product, collection):
    initial_sales_count = Sale.objects.count()
    url = reverse('dashboard:sale-add')
    data = {
        'name': 'Free skills',
        'type': DiscountValueType.PERCENTAGE,
        'value': 100,
        'start_date': '2018-01-01'}

    response = admin_client.post(url, data)

    assert response.status_code == 200
    assert Sale.objects.count() == initial_sales_count
    products_data = [
        {'categories': [category.id]},
        {'skills': [product.id]}, {'collections': [collection.pk]}]
    for count, proper_data in enumerate(products_data):
        proper_data.update(data)
        response = admin_client.post(url, proper_data)
        assert response.status_code == 302
        assert Sale.objects.count() == 1 + initial_sales_count + count


@pytest.mark.parametrize(
    'total, discount_value, discount_type, min_amount_spent, expected_value', [
        ('100', 10, DiscountValueType.FIXED, None, 10),
        ('100.05', 10, DiscountValueType.PERCENTAGE, 100, 10)])
def test_value_voucher_task_discount(
        settings, total, discount_value, discount_type, min_amount_spent, expected_value):
    voucher = Voucher(
        code='unique', type=VoucherType.VALUE,
        discount_value_type=discount_type,
        discount_value=discount_value,
        min_amount_spent=Money(min_amount_spent, 'USD') if min_amount_spent is not None else None)
    subtotal = TaxedMoney(net=Money(total, 'USD'), gross=Money(total, 'USD'))
    task = Mock(get_subtotal=Mock(return_value=subtotal), voucher=voucher)
    discount = get_voucher_discount_for_order(task)
    assert discount == Money(expected_value, 'USD')


@pytest.mark.parametrize(
    'delivery_cost, discount_value, discount_type, expected_value', [
        (10, 50, DiscountValueType.PERCENTAGE, 5),
        (10, 20, DiscountValueType.FIXED, 10)])
def test_delivery_voucher_task_discount(
        delivery_cost, discount_value, discount_type, expected_value):
    voucher = Voucher(
        code='unique', type=VoucherType.DELIVERY,
        discount_value_type=discount_type,
        discount_value=discount_value,
        min_amount_spent=None)
    subtotal = TaxedMoney(net=Money(100, 'USD'), gross=Money(100, 'USD'))
    delivery_total = TaxedMoney(
        net=Money(delivery_cost, 'USD'), gross=Money(delivery_cost, 'USD'))
    task = Mock(
        get_subtotal=Mock(return_value=subtotal),
        delivery_price=delivery_total,
        voucher=voucher)
    discount = get_voucher_discount_for_order(task)
    assert discount == Money(expected_value, 'USD')


def test_delivery_voucher_checkout_discount_not_applicable_returns_zero():
    voucher = Voucher(
        code='unique', type=VoucherType.DELIVERY,
        discount_value_type=DiscountValueType.FIXED,
        discount_value=10,
        min_amount_spent=Money(20, 'USD'))
    price = TaxedMoney(net=Money(10, 'USD'), gross=Money(10, 'USD'))
    task = Mock(
        get_subtotal=Mock(return_value=price),
        delivery_price=price,
        voucher=voucher)
    with pytest.raises(NotApplicable):
        get_voucher_discount_for_order(task)


def test_skill_voucher_checkout_discount_raises_not_applicable(
        task_with_lines, skill_with_images):
    discounted_skill = skill_with_images
    voucher = Voucher(
        code='unique', type=VoucherType.SKILL,
        discount_value_type=DiscountValueType.FIXED,
        discount_value=10)
    voucher.save()
    voucher.products.add(discounted_product)
    task_with_lines.voucher = voucher
    task_with_lines.save()
    # Offer is valid only for skills listed in voucher
    with pytest.raises(NotApplicable):
        get_voucher_discount_for_order(task_with_lines)


def test_category_voucher_checkout_discount_raises_not_applicable(
        task_with_lines):
    discounted_collection = Collection.objects.create(
        name='Discounted', slug='discou')
    voucher = Voucher(
        code='unique', type=VoucherType.COLLECTION,
        discount_value_type=DiscountValueType.FIXED,
        discount_value=10)
    voucher.save()
    voucher.collections.add(discounted_collection)
    task_with_lines.voucher = voucher
    task_with_lines.save()
    # Discount should be valid only for items in the discounted collections
    with pytest.raises(NotApplicable):
        get_voucher_discount_for_order(task_with_lines)


def test_ajax_voucher_list(admin_client, voucher):
    voucher.name = 'Summer sale'
    voucher.save()
    vouchers_list = [{'id': voucher.pk, 'text': str(voucher)}]
    url = reverse('dashboard:ajax-vouchers')

    response = admin_client.get(url, HTTP_X_REQUESTED_WITH='XMLHttpRequest')
    resp_decoded = json.loads(response.content.decode('utf-8'))

    assert response.status_code == 200
    assert resp_decoded == {'results': vouchers_list}
