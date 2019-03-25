import json

from django.contrib.sites.models import Site
from django.core.serializers.json import DjangoJSONEncoder

from ...core.utils import build_absolute_uri


def get_organization():
    site = Site.objects.get_current()
    return {'@type': 'Organization', 'name': site.name}


def get_skill_data(line, organization):
    gross_skill_price = line.get_total().gross
    skill_data = {
        '@type': 'Offer',
        'itemOffered': {
            '@type': 'Skill',
            'name': line.translated_skill_name or line.skill_name,
            'sku': line.skill_sku,
        },
        'price': gross_skill_price.amount,
        'priceCurrency': gross_skill_price.currency,
        'eligibleQuantity': {
            '@type': 'QuantitativeValue',
            'value': line.quantity
        },
        'seller': organization}

    skill = line.variant.skill
    skill_url = build_absolute_uri(skill.get_absolute_url())
    skill_data['itemOffered']['url'] = skill_url

    skill_image = skill.get_first_image()
    if skill_image:
        image = skill_image.image
        skill_data['itemOffered']['image'] = build_absolute_uri(
            location=image.url)
    return skill_data


def get_order_confirmation_markup(order):
    """Generates schema.org markup for order confirmation e-mail message."""
    organization = get_organization()
    order_url = build_absolute_uri(order.get_absolute_url())
    data = {
        '@context': 'http://schema.org',
        '@type': 'Order',
        'merchant': organization,
        'orderNumber': order.pk,
        'priceCurrency': order.total.gross.currency,
        'price': order.total.gross.amount,
        'acceptedOffer': [],
        'url': order_url,
        'potentialAction': {
            '@type': 'ViewAction',
            'url': order_url
        },
        'orderStatus': 'http://schema.org/OrderProcessing',
        'orderDate': order.created}

    lines = order.lines.prefetch_related('variant')
    for line in lines:
        skill_data = get_skill_data(line=line, organization=organization)
        data['acceptedOffer'].append(skill_data)
    return json.dumps(data, cls=DjangoJSONEncoder)
