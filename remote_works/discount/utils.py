import uuid

from django.db.models import F
from django.utils.translation import pgettext

from ..core.utils.taxes import ZERO_MONEY, ZERO_TAXED_MONEY
from .models import NotApplicable


def increase_voucher_usage(voucher):
    """Increase voucher uses by 1."""
    voucher.used = F('used') + 1
    voucher.save(update_fields=['used'])


def decrease_voucher_usage(voucher):
    """Decrease voucher uses by 1."""
    voucher.used = F('used') - 1
    voucher.save(update_fields=['used'])


def are_skill_collections_on_sale(skill, sale):
    """Checks if any collection is on sale."""
    discounted_collections = set(sale.collections.all())
    skill_collections = set(skill.collections.all())
    return set(skill_collections).intersection(discounted_collections)


def is_category_on_sale(category, sale):
    """Check if category is descendant of one of categories on sale."""
    discounted_categories = set(sale.categories.all())
    return any([
        category.is_descendant_of(c, include_self=True)
        for c in discounted_categories])


def get_skill_discount_on_sale(sale, skill):
    """Return discount value if skill is on sale or raise NotApplicable."""
    discounted_skills = {p.pk for p in sale.skills.all()}
    is_skill_on_sale = (
        skill.pk in discounted_skills or
        is_category_on_sale(skill.category, sale) or
        are_skill_collections_on_sale(skill, sale))
    if is_skill_on_sale:
        return sale.get_discount()
    raise NotApplicable(
        pgettext(
            'Voucher not applicable',
            'Discount not applicable for this skill'))


def get_skill_discounts(skill, discounts):
    """Return discount values for all discounts applicable to a skill."""
    for discount in discounts:
        try:
            yield get_skill_discount_on_sale(discount, skill)
        except NotApplicable:
            pass


def calculate_discounted_price(skill, price, discounts):
    """Return minimum skill's price of all prices with discounts applied."""
    if discounts:
        discounts = list(get_skill_discounts(skill, discounts))
        if discounts:
            price = min(discount(price) for discount in discounts)
    return price


def get_value_voucher_discount(voucher, total_price):
    """Calculate discount value for a voucher of value type."""
    voucher.validate_min_amount_spent(total_price)
    return voucher.get_discount_amount_for(total_price)


def get_shipping_voucher_discount(voucher, total_price, shipping_price):
    """Calculate discount value for a voucher of shipping type."""
    voucher.validate_min_amount_spent(total_price)
    return voucher.get_discount_amount_for(shipping_price)


def get_skills_voucher_discount(voucher, prices):
    """Calculate discount value for a voucher of skill or category type."""
    if voucher.apply_once_per_order:
        skill_total = sum(prices, ZERO_TAXED_MONEY)
        return voucher.get_discount_amount_for(skill_total)
    discounts = (
        voucher.get_discount_amount_for(price) for price in prices)
    total_amount = sum(discounts, ZERO_MONEY)
    return total_amount


def generate_voucher_code():
    """Generate new unique voucher code."""
    return str(uuid.uuid4()).replace('-', '').upper()[:12]
