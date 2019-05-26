from django.utils.translation import pgettext_lazy


class DeliveryMethodType:
    PRICE_BASED = 'price'
    WEIGHT_BASED = 'weight'

    CHOICES = [
        (PRICE_BASED, pgettext_lazy(
            'Type of delivery', 'Price based delivery')),
        (WEIGHT_BASED, pgettext_lazy(
            'Type of delivery', 'Weight based delivery'))]
