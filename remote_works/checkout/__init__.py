import logging

from django.utils.translation import pgettext_lazy

logger = logging.getLogger(__name__)


class AddressType:
    BILLING = 'billing'
    DELIVERY = 'delivery'

    CHOICES = [
        (BILLING, pgettext_lazy(
            'Type of address used to fulfill task',
            'Billing'
        )),
        (DELIVERY, pgettext_lazy(
            'Type of address used to fulfill task',
            'Delivery'
        ))]
