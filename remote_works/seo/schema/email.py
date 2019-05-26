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


def get_task_confirmation_markup(task):
    """Generates schema.org markup for task confirmation e-mail message."""
    organization = get_organization()
    task_url = build_absolute_uri(task.get_absolute_url())
    data = {
        '@context': 'http://schema.org',
        '@type': 'Task',
        'merchant': organization,
        'orderNumber': task.pk,
        'priceCurrency': task.total.gross.currency,
        'price': task.total.gross.amount,
        'acceptedOffer': [],
        'url': task_url,
        'potentialAction': {
            '@type': 'ViewAction',
            'url': task_url
        },
        'orderStatus': 'http://schema.org/TaskProcessing',
        'orderDate': task.created}

    lines = task.lines.prefetch_related('variant')
    for line in lines:
        skill_data = get_skill_data(line=line, organization=organization)
        data['acceptedOffer'].append(skill_data)
    return json.dumps(data, cls=DjangoJSONEncoder)
