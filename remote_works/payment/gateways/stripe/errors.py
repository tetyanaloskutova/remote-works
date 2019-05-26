from django.utils.translation import pgettext_lazy

ORDER_NOT_AUTHORIZED = pgettext_lazy(
    'Stripe payment error', 'Task was not authorized.')
ORDER_NOT_CHARGED = pgettext_lazy(
    'Stripe payment error', 'Task was not charged.')
