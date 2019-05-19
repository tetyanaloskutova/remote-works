from functools import wraps

from django.core.exceptions import ValidationError
from django.shortcuts import redirect

from ..utils import is_valid_delivery_method


def validate_cart(view):
    """Decorate a view making it require a non-empty cart.

    If the cart is empty, redirect to the cart details.
    """
    @wraps(view)
    def func(request, cart):
        if cart:
            return view(request, cart)
        return redirect('cart:index')
    return func


def validate_delivery_address(view):
    """Decorate a view making it require a valid delivery address.

    If either the delivery address or customer email is empty, redirect to the
    delivery address step.

    Expects to be decorated with `@validate_cart`.
    """
    @wraps(view)
    def func(request, cart):
        if not cart.email or not cart.delivery_address:
            return redirect('checkout:delivery-address')
        try:
            cart.delivery_address.full_clean()
        except ValidationError:
            return redirect('checkout:delivery-address')
        return view(request, cart)
    return func


def validate_delivery_method(view):
    """Decorate a view making it require a delivery method.

    If the method is missing or incorrect, redirect to the delivery method
    step.

    Expects to be decorated with `@validate_cart`.
    """
    @wraps(view)
    def func(request, cart):
        if not is_valid_delivery_method(
                cart, request.taxes, request.discounts):
            return redirect('checkout:delivery-method')
        return view(request, cart)
    return func


def validate_is_delivery_required(view):
    """Decorate a view making it check if cart in checkout needs delivery.

    If delivery is not needed, redirect to the checkout summary.

    Expects to be decorated with `@validate_cart`.
    """
    @wraps(view)
    def func(request, cart):
        if not cart.is_delivery_required():
            return redirect('checkout:summary')
        return view(request, cart)
    return func
