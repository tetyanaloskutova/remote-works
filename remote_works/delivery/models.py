from django.conf import settings
from django.db import models
from django.utils.safestring import mark_safe
from django.utils.translation import pgettext_lazy
from django_countries.fields import CountryField
from django_measurement.models import MeasurementField
from django_prices.models import MoneyField
from measurement.measures import Weight
from prices import MoneyRange

from . import DeliveryMethodType
from ..core.utils import format_money
from ..core.utils.taxes import get_taxed_delivery_price
from ..core.utils.translations import TranslationProxy
from ..core.weight import WeightUnits, zero_weight
from .utils import (
    applicable_price_based_methods, applicable_weight_based_methods,
    get_price_type_display, get_weight_type_display)


class DeliveryZone(models.Model):
    name = models.CharField(max_length=100)
    countries = CountryField(multiple=True, default=[], blank=True)
    default = models.BooleanField(default=False)

    def __str__(self):
        return self.name

    def countries_display(self):
        countries = self.countries
        if self.default:
            from ..dashboard.delivery.forms import get_available_countries
            countries = get_available_countries()
        if countries and len(countries) <= 3:
            return ', '.join((country.name for country in countries))
        return pgettext_lazy(
            'Number of countries delivery zone apply to',
            '%(num_of_countries)d countries' % {
                'num_of_countries': len(countries)})

    @property
    def price_range(self):
        prices = [
            delivery_method.get_total()
            for delivery_method in self.delivery_methods.all()]
        if prices:
            return MoneyRange(min(prices).net, max(prices).net)
        return None

    class Meta:
        permissions = ((
            'manage_delivery', pgettext_lazy(
                'Permission description', 'Manage delivery.')),)


class DeliveryMethodQueryset(models.QuerySet):
    def price_based(self):
        return self.filter(type=DeliveryMethodType.PRICE_BASED)

    def weight_based(self):
        return self.filter(type=DeliveryMethodType.WEIGHT_BASED)

    def applicable_delivery_methods(self, price, weight, country_code):
        """Returns DeliveryMethods that can be used on an task with
        shipment to given country(code), that are applicable to given
        price & weight total.
        """
        # If dedicated delivery zone for the country exists, we should use it
        # in the first place
        qs = self.filter(
            delivery_zone__countries__contains=country_code,
            delivery_zone__default=False)
        if not qs.exists():
            # Otherwise default delivery zone should be used
            qs = self.filter(delivery_zone__default=True)

        qs = qs.prefetch_related('delivery_zone').order_by('price')
        price_based_methods = applicable_price_based_methods(price, qs)
        weight_based_methods = applicable_weight_based_methods(weight, qs)
        return price_based_methods | weight_based_methods


class DeliveryMethod(models.Model):
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=30, choices=DeliveryMethodType.CHOICES)
    price = MoneyField(
        currency=settings.DEFAULT_CURRENCY,
        max_digits=settings.DEFAULT_MAX_DIGITS,
        decimal_places=settings.DEFAULT_DECIMAL_PLACES, default=0)
    delivery_zone = models.ForeignKey(
        DeliveryZone, related_name='delivery_methods',
        on_delete=models.CASCADE)
    minimum_order_price = MoneyField(
        currency=settings.DEFAULT_CURRENCY,
        max_digits=settings.DEFAULT_MAX_DIGITS,
        decimal_places=settings.DEFAULT_DECIMAL_PLACES, default=0, blank=True,
        null=True)
    maximum_order_price = MoneyField(
        currency=settings.DEFAULT_CURRENCY,
        max_digits=settings.DEFAULT_MAX_DIGITS,
        decimal_places=settings.DEFAULT_DECIMAL_PLACES, blank=True, null=True)
    minimum_order_weight = MeasurementField(
        measurement=Weight, unit_choices=WeightUnits.CHOICES,
        default=zero_weight, blank=True, null=True)
    maximum_order_weight = MeasurementField(
        measurement=Weight, unit_choices=WeightUnits.CHOICES,
        blank=True, null=True)

    objects = DeliveryMethodQueryset.as_manager()
    translated = TranslationProxy()

    def __str__(self):
        return self.name

    def __repr__(self):
        if self.type == DeliveryMethodType.PRICE_BASED:
            minimum = '%s%s' % (
                self.minimum_order_price.amount,
                self.minimum_order_price.currency)
            max_price = self.maximum_order_price
            maximum = (
                '%s%s' % (max_price.amount, max_price.currency)
                if max_price else 'no limit')
            return 'DeliveryMethod(type=%s min=%s, max=%s)' % (
                self.type, minimum, maximum)
        return 'DeliveryMethod(type=%s weight_range=(%s)' % (
            self.type, get_weight_type_display(
                self.minimum_order_weight, self.maximum_order_weight))

    def get_total(self, taxes=None):
        return get_taxed_delivery_price(self.price, taxes)

    def get_ajax_label(self):
        price_html = format_money(self.price)
        label = mark_safe('%s %s' % (self, price_html))
        return label

    def get_type_display(self):
        if self.type == DeliveryMethodType.PRICE_BASED:
            return get_price_type_display(
                self.minimum_order_price, self.maximum_order_price)
        return get_weight_type_display(
            self.minimum_order_weight, self.maximum_order_weight)


class DeliveryMethodTranslation(models.Model):
    language_code = models.CharField(max_length=10)
    name = models.CharField(max_length=255, null=True, blank=True)
    delivery_method = models.ForeignKey(
        DeliveryMethod, related_name='translations', on_delete=models.CASCADE)

    class Meta:
        unique_together = (('language_code', 'delivery_method'),)
