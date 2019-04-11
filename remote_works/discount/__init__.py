from django.conf import settings
from django.utils.translation import pgettext_lazy


class DiscountValueType:
    FIXED = 'fixed'
    PERCENTAGE = 'percentage'

    CHOICES = [
        (FIXED, pgettext_lazy(
            'Discount type', settings.DEFAULT_CURRENCY)),
        (PERCENTAGE, pgettext_lazy('Discount type', '%'))]


class VoucherType:
    SKILL = 'skill'
    COLLECTION = 'collection'
    CATEGORY = 'category'
    SHIPPING = 'shipping'
    VALUE = 'value'

    CHOICES = [
        (VALUE, pgettext_lazy('Voucher: discount for', 'All skills')),
        (SKILL, pgettext_lazy('Voucher: discount for', 'Specific skills')),
        (COLLECTION, pgettext_lazy(
            'Voucher: discount for', 'Specific collections of skills')),
        (CATEGORY, pgettext_lazy(
            'Voucher: discount for', 'Specific categories of skills')),
        (SHIPPING, pgettext_lazy('Voucher: discount for', 'Shipping'))]
