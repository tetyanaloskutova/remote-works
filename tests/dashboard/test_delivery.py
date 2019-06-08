import pytest
from django.urls import reverse
from prices import Money

from remote_works.account.i18n import COUNTRY_CHOICES
from remote_works.core.time import TimeUnits
from remote_works.dashboard.delivery.forms import (
    PriceDeliveryMethodForm, DeliveryZoneForm, WeightDeliveryMethodForm,
    currently_used_countries, default_delivery_zone_exists,
    get_available_countries)
from remote_works.delivery import DeliveryMethodType
from remote_works.delivery.models import DeliveryMethod, DeliveryZone


def test_default_delivery_zone_exists(delivery_zone):
    delivery_zone.default = True
    delivery_zone.save()
    assert default_delivery_zone_exists()
    assert not default_delivery_zone_exists(delivery_zone.pk)


def test_get_available_countries(delivery_zone):
    assert get_available_countries(delivery_zone.pk) == set(COUNTRY_CHOICES)
    assert get_available_countries() == (
        set(COUNTRY_CHOICES) - currently_used_countries())


def test_currently_used_countries():
    zone_1 = DeliveryZone.objects.create(name='Zone 1', countries=['PL'])
    zone_2 = DeliveryZone.objects.create(name='Zone 2', countries=['DE'])
    result = currently_used_countries(zone_1.pk)
    assert list(result)[0][0] == 'DE'


def test_delivery_zone_form():
    zone_1 = DeliveryZone.objects.create(name='Zone 1', countries=['PL'])
    zone_2 = DeliveryZone.objects.create(name='Zone 2', countries=['DE'])
    form = DeliveryZoneForm(
        instance=zone_1, data={
            'name': 'Zone 1',
            'countries': ['PL']})

    assert 'DE' not in [
        code for code, name in form.fields['countries'].choices]
    assert form.is_valid()

    form = DeliveryZoneForm(
        instance=zone_1, data={
            'name': 'Zone 2',
            'countries': ['DE']})
    assert not form.is_valid()
    assert 'countries' in form.errors


def test_create_duplicated_default_delivery_zone_form(delivery_zone):
    default_zone = DeliveryZone.objects.create(name='Zone', default=True)
    form = DeliveryZoneForm(
        instance=delivery_zone,
        data={'name': 'Zone', 'default': True, 'countries': ['PL']})
    assert form.fields['countries'].required
    assert form.fields['default'].disabled
    assert form.is_valid()
    zone = form.save()
    assert not zone.default


def test_add_default_delivery_zone_form():
    form = DeliveryZoneForm(
        data={'name': 'Zone', 'countries': ['PL'], 'default': True})
    assert form.is_valid()
    zone = form.save()
    assert zone.default
    assert not zone.countries


@pytest.mark.parametrize(
    'min_price, max_price, result',
    (
        (10, 20, True), (None, None, True), (None, 10, True), (0, None, True),
        (20, 20, False)))
def test_price_delivery_method_form(min_price, max_price, result):
    data = {
        'name': 'Name',
        'price': 10,
        'minimum_task_price': min_price,
        'maximum_task_price': max_price}
    form = PriceDeliveryMethodForm(data=data)
    assert form.is_valid() == result


@pytest.mark.parametrize(
    'min_weight, max_weight, result',
    (
        (10, 20, True), (None, None, True), (None, 10, True), (0, None, True),
        (20, 20, False)))
def test_weight_delivery_method_form(min_weight, max_weight, result):
    data = {
        'name': 'Name',
        'price': 10,
        'minimum_task_weight': min_weight,
        'maximum_task_weight': max_weight}
    form = WeightDeliveryMethodForm(data=data)
    assert form.is_valid() == result


def test_delivery_zone_list(admin_client, delivery_zone):
    url = reverse('dashboard:delivery-zone-list')
    response = admin_client.get(url)
    assert response.status_code == 200


def test_delivery_zone_update_default_weight_unit(admin_client, site_settings):
    url = reverse('dashboard:delivery-zone-list')
    data = {'default_weight_unit': TimeUnits.IDD}
    response = admin_client.post(url, data=data)
    assert response.status_code == 302
    site_settings.refresh_from_db()
    assert site_settings.default_weight_unit == TimeUnits.IDD


def test_delivery_zone_add(admin_client):
    assert DeliveryZone.objects.count() == 0
    url = reverse('dashboard:delivery-zone-add')
    data = {'name': 'Zium', 'countries': ['PL']}
    response = admin_client.post(url, data, follow=True)
    assert response.status_code == 200
    assert DeliveryZone.objects.count() == 1


def test_delivery_zone_add_not_valid(admin_client):
    assert DeliveryZone.objects.count() == 0
    url = reverse('dashboard:delivery-zone-add')
    data = {}
    response = admin_client.post(url, data, follow=True)
    assert response.status_code == 200
    assert DeliveryZone.objects.count() == 0


def test_delivery_zone_edit(admin_client, delivery_zone):
    assert DeliveryZone.objects.count() == 1
    url = reverse(
        'dashboard:delivery-zone-update', kwargs={'pk': delivery_zone.pk})
    data = {'name': 'Flash', 'countries': ['PL']}
    response = admin_client.post(url, data, follow=True)
    assert response.status_code == 200
    assert DeliveryZone.objects.count() == 1
    assert DeliveryZone.objects.all()[0].name == 'Flash'


def test_delivery_zone_details(admin_client, delivery_zone):
    assert DeliveryZone.objects.count() == 1
    url = reverse(
        'dashboard:delivery-zone-details', kwargs={'pk': delivery_zone.pk})
    response = admin_client.post(url, follow=True)
    assert response.status_code == 200


def test_delivery_zone_delete(admin_client, delivery_zone):
    assert DeliveryZone.objects.count() == 1
    url = reverse(
        'dashboard:delivery-zone-delete', kwargs={'pk': delivery_zone.pk})
    response = admin_client.post(url, follow=True)
    assert response.status_code == 200
    assert DeliveryZone.objects.count() == 0


def test_delivery_method_add(admin_client, delivery_zone):
    assert DeliveryMethod.objects.count() == 1
    url = reverse(
        'dashboard:delivery-method-add',
        kwargs={
            'delivery_zone_pk': delivery_zone.pk,
            'type': 'price'})
    data = {
        'name': 'DHL',
        'price': '50',
        'delivery_zone': delivery_zone.pk,
        'type': DeliveryMethodType.PRICE_BASED}
    response = admin_client.post(url, data, follow=True)
    assert response.status_code == 200
    assert DeliveryMethod.objects.count() == 2


def test_delivery_method_add_not_valid(admin_client, delivery_zone):
    assert DeliveryMethod.objects.count() == 1
    url = reverse(
        'dashboard:delivery-method-add',
        kwargs={
            'delivery_zone_pk': delivery_zone.pk,
            'type': 'price'})
    data = {}
    response = admin_client.post(url, data, follow=True)
    assert response.status_code == 200
    assert DeliveryMethod.objects.count() == 1


def test_delivery_method_edit(admin_client, delivery_zone):
    assert DeliveryMethod.objects.count() == 1
    country = delivery_zone.delivery_methods.all()[0]
    assert country.price == Money(10, 'USD')
    url = reverse(
        'dashboard:delivery-method-edit',
        kwargs={
            'delivery_zone_pk': delivery_zone.pk,
            'delivery_method_pk': country.pk})
    data = {
        'name': 'DHL',
        'price': '50',
        'delivery_zone': delivery_zone.pk,
        'type': DeliveryMethodType.PRICE_BASED}
    response = admin_client.post(url, data, follow=True)
    assert response.status_code == 200
    assert DeliveryMethod.objects.count() == 1

    delivery_price = delivery_zone.delivery_methods.all()[0].price
    assert delivery_price == Money(50, 'USD')


def test_delivery_method_delete(admin_client, delivery_zone):
    assert DeliveryMethod.objects.count() == 1
    country = delivery_zone.delivery_methods.all()[0]
    url = reverse(
        'dashboard:delivery-method-delete',
        kwargs={
            'delivery_zone_pk': delivery_zone.pk,
            'delivery_method_pk': country.pk})
    response = admin_client.post(url, follow=True)
    assert response.status_code == 200
    assert DeliveryMethod.objects.count() == 0
