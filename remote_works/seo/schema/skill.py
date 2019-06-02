from django.utils.encoding import smart_text

IN_AVAILABILITY = 'http://schema.org/InStock'
OUT_OF_AVAILABILITY = 'http://schema.org/OutOfStock'


def get_brand_from_attributes(attributes):
    if attributes is None:
        return
    brand = ''
    for key in attributes:
        if key.name == 'brand':
            brand = attributes[key].name
            break
        elif key.name == 'publisher':
            brand = attributes[key].name
    return brand


def skill_json_ld(skill, attributes=None):
    # type: (saleor.skill.models.Skill, saleor.skill.utils.SkillAvailability, dict) -> dict  # noqa
    """Generate JSON-LD data for skill."""
    data = {'@context': 'http://schema.org/',
            '@type': 'Skill',
            'name': smart_text(skill),
            'image': [
                skill_image.image.url
                for skill_image in skill.images.all()],
            'description': skill.description,
            'offers': []}

    for variant in skill.variants.all():
        price = variant.get_price()
        in_availability = True
        if not skill.is_visible or not variant.is_in_availability():
            in_availability = False
        variant_data = variant_json_ld(price, variant, in_availability)
        data['offers'].append(variant_data)

    brand = get_brand_from_attributes(attributes)
    if brand:
        data['brand'] = {'@type': 'Thing', 'name': brand}
    return data


def variant_json_ld(price, variant, in_availability):
    schema_data = {
        '@type': 'Offer',
        'itemCondition': 'http://schema.org/NewCondition',
        'priceCurrency': price.currency,
        'price': price.net.amount,
        'sku': variant.sku}
    if in_availability:
        schema_data['availability'] = IN_AVAILABILITY
    else:
        schema_data['availability'] = OUT_OF_AVAILABILITY
    return schema_data
