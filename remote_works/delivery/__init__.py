from django.utils.translation import pgettext_lazy


class DeliveryMethodType:
    PRICE_BASED = 'price'

    CHOICES = [
        (PRICE_BASED, pgettext_lazy(
            'Type of delivery', 'Price based delivery')),
        ]
