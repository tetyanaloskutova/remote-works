from django.utils.translation import pgettext_lazy

TASK_NOT_AUTHORIZED = pgettext_lazy(
    'Stripe payment error', 'Task was not authorized.')
TASK_NOT_CHARGED = pgettext_lazy(
    'Stripe payment error', 'Task was not charged.')
