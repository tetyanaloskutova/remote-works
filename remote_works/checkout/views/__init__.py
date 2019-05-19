"""Cart and checkout related views."""
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, redirect, render
from django.template.response import TemplateResponse

from ...account.forms import LoginForm
from ...core.utils import (
    format_money, get_user_delivery_country, to_local_currency)
from ...skill.models import SkillVariant
from ...delivery.utils import get_delivery_price_estimate
from ..forms import CartDeliveryMethodForm, CountryForm, ReplaceCartLineForm
from ..models import Cart
from ..utils import (
    check_skill_availability_and_warn, get_cart_data,
    get_cart_data_for_checkout, get_or_empty_db_cart, get_taxes_for_cart,
    is_valid_delivery_method, update_cart_quantity)
from .discount import add_voucher_form, validate_voucher
from .delivery import (
    anonymous_user_delivery_address_view, user_delivery_address_view)
from .summary import (
    anonymous_summary_without_delivery, summary_with_delivery_view,
    summary_without_delivery)
from .validators import (
    validate_cart, validate_is_delivery_required, validate_delivery_address,
    validate_delivery_method)


@get_or_empty_db_cart(Cart.objects.for_display())
@validate_cart
def checkout_login(request, cart):
    """Allow the user to log in prior to checkout."""
    if request.user.is_authenticated:
        return redirect('checkout:index')
    ctx = {'form': LoginForm()}
    return TemplateResponse(request, 'checkout/login.html', ctx)


@get_or_empty_db_cart(Cart.objects.for_display())
@validate_cart
@validate_is_delivery_required
def checkout_index(request, cart):
    """Redirect to the initial step of checkout."""
    return redirect('checkout:delivery-address')


@get_or_empty_db_cart(Cart.objects.for_display())
@validate_voucher
@validate_cart
@validate_is_delivery_required
@add_voucher_form
def checkout_delivery_address(request, cart):
    """Display the correct delivery address step."""
    if request.user.is_authenticated:
        return user_delivery_address_view(request, cart)
    return anonymous_user_delivery_address_view(request, cart)


@get_or_empty_db_cart(Cart.objects.for_display())
@validate_voucher
@validate_cart
@validate_is_delivery_required
@validate_delivery_address
@add_voucher_form
def checkout_delivery_method(request, cart):
    """Display the delivery method selection step."""
    discounts = request.discounts
    taxes = get_taxes_for_cart(cart, request.taxes)
    is_valid_delivery_method(cart, request.taxes, discounts)

    form = CartDeliveryMethodForm(
        request.POST or None, discounts=discounts, taxes=taxes, instance=cart,
        initial={'delivery_method': cart.delivery_method})
    if form.is_valid():
        form.save()
        return redirect('checkout:summary')

    ctx = get_cart_data_for_checkout(cart, discounts, taxes)
    ctx.update({'delivery_method_form': form})
    return TemplateResponse(request, 'checkout/delivery_method.html', ctx)


@get_or_empty_db_cart(Cart.objects.for_display())
@validate_voucher
@validate_cart
@add_voucher_form
def checkout_summary(request, cart):
    """Display the correct task summary."""
    if cart.is_delivery_required():
        view = validate_delivery_method(summary_with_delivery_view)
        view = validate_delivery_address(view)
        return view(request, cart)
    if request.user.is_authenticated:
        return summary_without_delivery(request, cart)
    return anonymous_summary_without_delivery(request, cart)


@get_or_empty_db_cart(cart_queryset=Cart.objects.for_display())
def cart_index(request, cart):
    """Display cart details."""
    discounts = request.discounts
    taxes = request.taxes
    cart_lines = []
    check_skill_availability_and_warn(request, cart)

    # refresh required to get updated cart lines and it's quantity
    try:
        cart = Cart.objects.prefetch_related(
            'lines__variant__skill__category').get(pk=cart.pk)
    except Cart.DoesNotExist:
        pass

    lines = cart.lines.select_related('variant__skill__skill_type')
    lines = lines.prefetch_related(
        'variant__translations', 'variant__skill__translations',
        'variant__skill__images',
        'variant__skill__skill_type__variant_attributes__translations',
        'variant__images',
        'variant__skill__skill_type__variant_attributes')
    for line in lines:
        initial = {'quantity': line.quantity}
        form = ReplaceCartLineForm(
            None, cart=cart, variant=line.variant, initial=initial,
            discounts=discounts, taxes=taxes)
        cart_lines.append({
            'variant': line.variant,
            'get_price': line.variant.get_price(discounts, taxes),
            'get_total': line.get_total(discounts, taxes),
            'form': form})

    default_country = get_user_delivery_country(request)
    country_form = CountryForm(initial={'country': default_country})
    delivery_price_range = get_delivery_price_estimate(
        price=cart.get_subtotal(discounts, taxes).gross,
        weight=cart.get_total_weight(), country_code=default_country,
        taxes=taxes)

    cart_data = get_cart_data(
        cart, delivery_price_range, request.currency, discounts, taxes)
    ctx = {
        'cart_lines': cart_lines,
        'country_form': country_form,
        'delivery_price_range': delivery_price_range}
    ctx.update(cart_data)

    return TemplateResponse(request, 'checkout/index.html', ctx)


@get_or_empty_db_cart(cart_queryset=Cart.objects.for_display())
def cart_delivery_options(request, cart):
    """Display delivery options to get a price estimate."""
    country_form = CountryForm(request.POST or None, taxes=request.taxes)
    if country_form.is_valid():
        delivery_price_range = country_form.get_delivery_price_estimate(
            price=cart.get_subtotal(request.discounts, request.taxes).gross,
            weight=cart.get_total_weight())
    else:
        delivery_price_range = None
    ctx = {
        'delivery_price_range': delivery_price_range,
        'country_form': country_form}
    cart_data = get_cart_data(
        cart, delivery_price_range, request.currency, request.discounts,
        request.taxes)
    ctx.update(cart_data)
    return TemplateResponse(request, 'checkout/_subtotal_table.html', ctx)


@get_or_empty_db_cart()
def update_cart_line(request, cart, variant_id):
    """Update the line quantities."""
    if not request.is_ajax():
        return redirect('cart:index')
    variant = get_object_or_404(SkillVariant, pk=variant_id)
    discounts = request.discounts
    taxes = request.taxes
    status = None
    form = ReplaceCartLineForm(
        request.POST, cart=cart, variant=variant, discounts=discounts,
        taxes=taxes)
    if form.is_valid():
        form.save()
        response = {
            'variantId': variant_id,
            'subtotal': 0,
            'total': 0,
            'cart': {
                'numItems': cart.quantity,
                'numLines': len(cart)}}
        updated_line = cart.get_line(form.cart_line.variant)
        if updated_line:
            response['subtotal'] = format_money(
                updated_line.get_total(discounts, taxes).gross)
        if cart:
            cart_total = cart.get_subtotal(discounts, taxes)
            response['total'] = format_money(cart_total.gross)
            local_cart_total = to_local_currency(cart_total, request.currency)
            if local_cart_total is not None:
                response['localTotal'] = format_money(local_cart_total.gross)
        status = 200
    elif request.POST is not None:
        response = {'error': form.errors}
        status = 400
    return JsonResponse(response, status=status)


@get_or_empty_db_cart()
def clear_cart(request, cart):
    """Clear cart"""
    if not request.is_ajax():
        return redirect('cart:index')
    cart.lines.all().delete()
    update_cart_quantity(cart)
    response = {'numItems': 0}
    return JsonResponse(response)


@get_or_empty_db_cart(cart_queryset=Cart.objects.for_display())
def cart_summary(request, cart):
    """Display a cart summary suitable for displaying on all pages."""
    discounts = request.discounts
    taxes = request.taxes

    def prepare_line_data(line):
        first_image = line.variant.get_first_image()
        if first_image:
            first_image = first_image.image
        return {
            'skill': line.variant.skill,
            'variant': line.variant,
            'quantity': line.quantity,
            'image': first_image,
            'line_total': line.get_total(discounts, taxes),
            'variant_url': line.variant.get_absolute_url()}

    if cart.quantity == 0:
        data = {'quantity': 0}
    else:
        data = {
            'quantity': cart.quantity,
            'total': cart.get_subtotal(discounts, taxes),
            'lines': [prepare_line_data(line) for line in cart]}

    return render(request, 'cart_dropdown.html', data)
