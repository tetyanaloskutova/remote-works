from django import forms
from django.utils.translation import pgettext_lazy

from ...account.i18n import COUNTRY_CHOICES
from ...core.weight import WeightField
from ...delivery import DeliveryMethodType
from ...delivery.models import DeliveryMethod, DeliveryZone
from ...site.models import SiteSettings


def currently_used_countries(zone_pk=None):
    delivery_zones = DeliveryZone.objects.exclude(pk=zone_pk)
    used_countries = {
        (country.code, country.name)
        for delivery_zone in delivery_zones
        for country in delivery_zone.countries}
    return used_countries


def get_available_countries(zone_pk=None):
    return set(COUNTRY_CHOICES) - currently_used_countries(zone_pk)


def default_delivery_zone_exists(zone_pk=None):
    return DeliveryZone.objects.exclude(pk=zone_pk).filter(default=True)


class ChangeDefaultWeightUnit(forms.ModelForm):
    class Meta:
        model = SiteSettings
        fields = ['default_weight_unit']
        labels = {
            'default_weight_unit': pgettext_lazy(
                'Label of the default weight unit picker',
                'Default weight unit')}
        help_texts = {
            'default_weight_unit': pgettext_lazy(
                'Default weight unit help text',
                'Default unit for weights entered from the dashboard.'
                'All weights will be recalculated to the new unit.')}


class DeliveryZoneForm(forms.ModelForm):
    class Meta:
        model = DeliveryZone
        fields = ['name', 'default', 'countries']
        labels = {
            'name': pgettext_lazy(
                'Shippment Zone field name', 'Delivery zone name'),
            'default': pgettext_lazy(
                'Delivery Zone field name', 'Rest of World'),
            'countries': pgettext_lazy(
                'List of countries to pick from', 'Countries')}
        help_texts = {
            'countries': pgettext_lazy(
                'Countries field help text',
                'Each country might be included in only one delivery zone.'),
            'name': pgettext_lazy(
                'Help text for DeliveryZone name',
                'Name is for internal use only, it won\'t '
                'be displayed to your customers'),
            'default': pgettext_lazy(
                'Help text for DeliveryZone name',
                'If selected, this zone will include any countries that'
                ' are not already listed in your other delivery zones.')}

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        pk = self.instance.pk if self.instance else None
        available_countries = get_available_countries(pk)
        self.fields['countries'].choices = sorted(
            available_countries, key=lambda choice: choice[1])

        if default_delivery_zone_exists(pk):
            self.fields['default'].disabled = True
            self.fields['countries'].required = True

    def clean_default(self):
        default = self.cleaned_data.get('default')
        if not default:
            return default
        delivery_zone_exists = default_delivery_zone_exists(
            self.instance.pk if self.instance else None)
        if not delivery_zone_exists:
            return default
        self.add_error(
            'default', pgettext_lazy(
                'DeliveryZone  with "default" option selected already exists',
                'Default DeliveryZone already exists.'))
        return default

    def clean_countries(self):
        countries = self.cleaned_data.get('countries')
        if not countries:
            return
        duplicated_countries = set(countries).intersection(
            currently_used_countries())
        if duplicated_countries:
            self.add_error(
                'countries', pgettext_lazy(
                    'Delivery zone containing duplicated countries form error',
                    'Countries already exists in another '
                    'delivery zone: %(list_of_countries)s' % {
                        'list_of_countries': ', '.join(duplicated_countries)}))
        return countries

    def clean(self):
        data = super().clean()
        if not data.get('default') and not data.get('countries'):
            self.add_error('countries', pgettext_lazy(
                'DeliveryZone field error', 'This field is required.'))
        if data.get('default'):
            data['countries'] = []
        return data


class DeliveryMethodForm(forms.ModelForm):
    class Meta:
        model = DeliveryMethod
        fields = ['name', 'price']
        labels = {
            'name': pgettext_lazy('Delivery Method name', 'Name'),
            'price': pgettext_lazy('Currency amount', 'Price')}
        help_texts = {
            'name': pgettext_lazy(
                'Delivery method name help text',
                'Customers will see this at the checkout.')}


class PriceDeliveryMethodForm(forms.ModelForm):
    class Meta(DeliveryMethodForm.Meta):
        labels = {
            'minimum_task_price': pgettext_lazy(
                'Minimum task price to use this delivery method',
                'Minimum task price'),
            'maximum_task_price': pgettext_lazy(
                'Maximum task price to use this task',
                'Maximum task price')}
        labels.update(DeliveryMethodForm.Meta.labels)
        fields = [
            'name', 'price', 'minimum_task_price', 'maximum_task_price']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['maximum_task_price'].widget.attrs['placeholder'] = (
            pgettext_lazy(
                'Placeholder for maximum task price set to unlimited',
                'No limit'))
        self.fields['minimum_task_price'].widget.attrs['placeholder'] = '0'

    def clean_minimum_task_price(self):
        return self.cleaned_data['minimum_task_price'] or 0

    def clean(self):
        data = super().clean()
        min_price = data.get('minimum_task_price')
        max_price = data.get('maximum_task_price')
        if min_price and max_price is not None and max_price <= min_price:
            self.add_error('maximum_task_price', pgettext_lazy(
                'Price delivery method form error',
                'Maximum task price should be larger'
                ' than the minimum task price.'))
        return data


class WeightDeliveryMethodForm(forms.ModelForm):
    minimum_task_weight = WeightField(
        required=False, label=pgettext_lazy(
            'Minimum task weight to use this delivery method',
            'Minimum task weight'))
    maximum_task_weight = WeightField(
        required=False, label=pgettext_lazy(
            'Maximum task weight to use this delivery method',
            'Maximum task weight'))

    class Meta(DeliveryMethodForm.Meta):
        fields = [
            'name', 'price', 'minimum_task_weight', 'maximum_task_weight']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['maximum_task_weight'].widget.attrs['placeholder'] = (
            pgettext_lazy(
                'Placeholder for maximum task weight set to unlimited',
                'No limit'))
        self.fields['minimum_task_weight'].widget.attrs['placeholder'] = '0'

    def clean_minimum_task_weight(self):
        return self.cleaned_data['minimum_task_weight'] or 0

    def clean(self):
        data = super().clean()
        min_weight = data.get('minimum_task_weight')
        max_weight = data.get('maximum_task_weight')
        if min_weight and max_weight is not None and max_weight <= min_weight:
            self.add_error('maximum_task_weight', pgettext_lazy(
                'Price delivery method form error',
                'Maximum task price should be larger'
                ' than the minimum task price.'))
        return data


def get_delivery_form(type):
    if type == DeliveryMethodType.WEIGHT_BASED:
        return WeightDeliveryMethodForm
    elif type == DeliveryMethodType.PRICE_BASED:
        return PriceDeliveryMethodForm
    raise TypeError('Unknown form type: %s' % type)
