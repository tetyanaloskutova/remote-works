from django.utils.translation import npgettext, pgettext_lazy
from django_filters import (
    CharFilter, ChoiceFilter, OrderingFilter, RangeFilter)

from ...core.filters import SortedFilterSet
from ...core.i18n import COUNTRY_CODE_CHOICES
from ...delivery.models import DeliveryZone

SORT_BY_FIELDS = {
    'name': pgettext_lazy('Group list sorting option', 'name')}


class DeliveryZoneFilter(SortedFilterSet):
    name = CharFilter(
        label=pgettext_lazy(
            'Delivery zones list filter label', 'Delivery zone name'),
        lookup_expr="icontains")
    price = RangeFilter(
        label=pgettext_lazy(
            'Delivery zones list filter label', 'Price range'),
        field_name='delivery_methods__price')
    country = ChoiceFilter(
        label=pgettext_lazy('Delivery zones filter label', 'Country'),
        field_name='countries', lookup_expr='contains',
        choices=COUNTRY_CODE_CHOICES)
    sort_by = OrderingFilter(
        label=pgettext_lazy('Skill list sorting filter label', 'Sort by'),
        fields=SORT_BY_FIELDS.keys(),
        field_labels=SORT_BY_FIELDS)

    class Meta:
        model = DeliveryZone
        fields = []

    def get_summary_message(self):
        counter = self.qs.count()
        return npgettext(
            'Number of matching records in the dashboard '
            'delivery zones list',
            'Found %(counter)d matching delivery zone',
            'Found %(counter)d matching delivery zones',
            number=counter) % {'counter': counter}
