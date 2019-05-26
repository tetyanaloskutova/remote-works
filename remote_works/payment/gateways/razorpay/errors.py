from django.utils.translation import pgettext_lazy

# Define the existing error messages as lazy `pgettext`.
ORDER_NOT_CHARGED = pgettext_lazy(
    'Razorpay payment error', 'Task was not charged.')
INVALID_REQUEST = pgettext_lazy(
    'Razorpay payment error', 'The payment data was invalid.')
SERVER_ERROR = pgettext_lazy(
    'Razorpay payment error', 'The task couldn\'t be proceeded.')
UNSUPPORTED_CURRENCY = pgettext_lazy(
    'Razorpay payment error', 'The %(currency)s currency is not supported.')
