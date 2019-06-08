from django.db.models import Q
from django.utils.translation import pgettext_lazy
from prices import MoneyRange

from ..core.utils.taxes import get_taxed_delivery_price
from ..core.time import get_default_weight_unit


def get_delivery_price_estimate(price, country_code, taxes):
    """Returns estimated price range for delivery for given task."""
    from .models import DeliveryMethod

    delivery_methods = DeliveryMethod.objects.applicable_delivery_methods(
        price, country_code)
    delivery_methods = delivery_methods.values_list('price', flat=True)
    if not delivery_methods:
        return
    prices = MoneyRange(
        start=min(delivery_methods), stop=max(delivery_methods))
    return get_taxed_delivery_price(prices, taxes)


def applicable_weight_based_methods(weight, qs):
    """Returns weight based DeliveryMethods that can be applied to an task
    with given total weight.
    """
    qs = qs.weight_based()
    min_weight_matched = Q(minimum_task_weight__lte=weight)
    no_weight_limit = Q(maximum_task_weight__isnull=True)
    max_weight_matched = Q(maximum_task_weight__gte=weight)
    return qs.filter(
        min_weight_matched & (no_weight_limit | max_weight_matched))


def applicable_price_based_methods(price, qs):
    """Returns price based DeliveryMethods that can be applied to an task
    with given price total.
    """
    qs = qs.price_based()
    min_price_matched = Q(minimum_task_price__lte=price)
    no_price_limit = Q(maximum_task_price__isnull=True)
    max_price_matched = Q(maximum_task_price__gte=price)
    return qs.filter(
        min_price_matched & (no_price_limit | max_price_matched))


def get_price_type_display(min_price, max_price):
    from ..core.utils import format_money

    if max_price is None:
        return pgettext_lazy(
            'Applies to tasks more expensive than the min value',
            '%(min_price)s and up') % {'min_price': format_money(min_price)}
    return pgettext_lazy(
        'Applies to task valued within this price range',
        '%(min_price)s to %(max_price)s') % {
            'min_price': format_money(min_price),
            'max_price': format_money(max_price)}


def get_weight_type_display(min_weight, max_weight):
    default_unit = get_default_weight_unit()

    if max_weight is None:
        return pgettext_lazy(
            'Applies to tasks heavier than the threshold',
            '%(min_weight)s and up') % {'min_weight': min_weight}
    return pgettext_lazy(
        'Applies to tasks of total weight within this range',
        '%(min_weight)s to %(max_weight)s' % {
            'min_weight': min_weight, 'max_weight': max_weight})
