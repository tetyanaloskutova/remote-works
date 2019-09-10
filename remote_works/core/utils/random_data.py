import json
import os
import random
import unicodedata
import uuid
from collections import defaultdict
from datetime import date
from textwrap import dedent
from unittest.mock import patch

from django.conf import settings
from django.contrib.sites.models import Site
from django.core.files import File
from django_countries.fields import Country
from faker import Factory
from faker.providers import BaseProvider
from measurement.measures import Weight
from prices import Money

from ...account.models import Address, User
from ...account.utils import store_user_address
from ...checkout import AddressType
from ...core.utils.json_serializer import object_hook
from ...core.utils.taxes import get_tax_rate_by_name, get_taxes_for_country
from ...dashboard.menu.utils import update_menu
from ...discount import DiscountValueType, VoucherType
from ...discount.models import Sale, Voucher
from ...menu.models import Menu
from ...task.models import Fulfillment, Task
from ...task.utils import update_task_status
from ...page.models import Page
from ...payment.utils import (
    create_payment, gateway_authorize, gateway_capture, gateway_refund,
    gateway_void)
from ...skill.models import (
    Attribute, AttributeValue, Category, Collection, Skill, SkillImage,
    SkillType, SkillVariant)
from ...skill.thumbnails import (
    create_category_background_image_thumbnails,
    create_collection_background_image_thumbnails, create_skill_thumbnails)
from ...delivery.models import DeliveryMethod, DeliveryMethodType, DeliveryZone
from ...delivery.utils import get_taxed_delivery_price
from ...site.models import SiteSettings
fake = Factory.create()

TYPES_LIST_DIR = 'skills-list/'

GROCERIES_CATEGORY = {'name': 'Groceries', 'image_name': 'groceries.jpg'}

COLLECTIONS_SCHEMA = [
    {
        'name': 'Summer collection',
        'image_name': 'summer.jpg',
        'description': dedent('''The remote-works Summer Collection features a range
            of skills that feel the heat of the market.remote-works captures 
            the open source, e-commerce sun.''')},
    {
        'name': 'Winter sale',
        'image_name': 'clothing.jpg',
        'description': dedent('''The remote-works Winter Sale is snowed under with
            seasonal offers. Unreal skills at unreal rates. Literally,
            they are not real skills, but the remote-works demo is a
            genuine remote work leader.''')}]

IMAGES_MAPPING = {
    61: ['bigdata.jfif'],
    63: ['bigdata_Xqz6b6e.jfif'],
    64: ['classification.jfif'],
    62: ['classification_DHigUwZ.jfif'],
    65: ['data.png'],
    71: ['data_MlLpHpu.png'],
    72: ['download.jfif'],
    73: ['java.png'],
    74: ['Microsoft_.NET_logo.png'],
    75: ['Microsoft_.NET_logo_yjeACAr.png'],
    76: ['python.jfif'],
    77: ['python_xrOy2uN.jfif'],
    78: ['stats1.jfif'],
    79: ['stats1_kSuP9Ku.jfif'],
    81: ['visualisation.jfif'],
    82: ['visualisation_eb1tnh0.jfif']}


CATEGORY_IMAGES = {
    1: 'DEMO-04.jpg',
    7: 'DEMO-04.jpg',
    8: 'groceries.jpg',
    9: 'cos.jpg'
}


def create_skill_types(skill_type_data):
    for skill_type in skill_type_data:
        pk = skill_type['pk']
        defaults = skill_type['fields']
        SkillType.objects.update_or_create(pk=pk, defaults=defaults)


def create_categories(categories_data, placeholder_dir):
    placeholder_dir = get_skill_list_images_dir(placeholder_dir)
    for category in categories_data:
        pk = category['pk']
        defaults = category['fields']
        image_name = CATEGORY_IMAGES[pk]
        background_image = get_image(placeholder_dir, image_name)
        defaults['background_image'] = background_image
        Category.objects.update_or_create(pk=pk, defaults=defaults)
        create_category_background_image_thumbnails.delay(pk)


def create_attributes(attributes_data):
    for attribute in attributes_data:
        pk = attribute['pk']
        defaults = attribute['fields']
        defaults['skill_type_id'] = defaults.pop('skill_type')
        defaults['skill_variant_type_id'] = defaults.pop(
            'skill_variant_type')
        Attribute.objects.update_or_create(pk=pk, defaults=defaults)


def create_attributes_values(values_data):
    for value in values_data:
        pk = value['pk']
        defaults = value['fields']
        defaults['attribute_id'] = defaults.pop('attribute')
        AttributeValue.objects.update_or_create(pk=pk, defaults=defaults)


def create_skills(skills_data, placeholder_dir, create_images):
    for skill in skills_data:
        pk = skill['pk']
        # We are skipping skills without images
        if pk not in IMAGES_MAPPING:
            continue
        defaults = skill['fields']
        defaults['category_id'] = defaults.pop('category')
        defaults['skill_type_id'] = defaults.pop('skill_type')
        defaults['price'] = get_in_default_currency(
            defaults, 'price', settings.DEFAULT_CURRENCY)
        defaults['attributes'] = json.loads(defaults['attributes'])
        skill, _ = Skill.objects.update_or_create(pk=pk, defaults=defaults)

        if create_images:
            images = IMAGES_MAPPING.get(pk, [])
            for image_name in images:
                create_skill_image(skill, placeholder_dir, image_name)


def create_skill_variants(variants_data):
    for variant in variants_data:
        pk = variant['pk']
        defaults = variant['fields']
        skill_id = defaults.pop('skill')
        # We have not created skills without images
        if skill_id not in IMAGES_MAPPING:
            continue
        defaults['skill_id'] = skill_id
        defaults['attributes'] = json.loads(defaults['attributes'])
        defaults['price_override'] = get_in_default_currency(
            defaults, 'price_override', settings.DEFAULT_CURRENCY)
        defaults['cost_price'] = get_in_default_currency(
            defaults, 'cost_price', settings.DEFAULT_CURRENCY)
        SkillVariant.objects.update_or_create(pk=pk, defaults=defaults)


def get_in_default_currency(defaults, field, currency):
    if field in defaults and defaults[field] is not None:
        return Money(defaults[field].amount, currency)
    return None


def create_skills_by_schema(placeholder_dir, create_images, default_template):
    path = os.path.join(settings.PROJECT_ROOT, 'remote_works', 'static', default_template)
    with open(path) as f:
        db_items = json.load(f, object_hook=object_hook)
    types = defaultdict(list)
    # Sort db objects by its model
    for item in db_items:
        model = item.pop('model')
        types[model].append(item)

    create_skill_types(skill_type_data=types['skill.skilltype'])
    create_categories(
        categories_data=types['skill.category'],
        placeholder_dir=placeholder_dir)
    create_attributes(attributes_data=types['skill.attribute'])
    create_attributes_values(values_data=types['skill.attributevalue'])
    create_skills(
        skills_data=types['skill.skill'],
        placeholder_dir=placeholder_dir, create_images=create_images)
    create_skill_variants(variants_data=types['skill.skillvariant'])


class RemoteWorksProvider(BaseProvider):
    def money(self):
        return Money(
            fake.pydecimal(2, 2, positive=True), settings.DEFAULT_CURRENCY)

    def weight(self):
        return Weight(kg=fake.pydecimal(1, 2, positive=True))


fake.add_provider(RemoteWorksProvider)


def get_email(first_name, last_name):
    _first = unicodedata.normalize('NFD', first_name).encode('ascii', 'ignore')
    _last = unicodedata.normalize('NFD', last_name).encode('ascii', 'ignore')
    return '%s.%s@example.com' % (
        _first.lower().decode('utf-8'), _last.lower().decode('utf-8'))


def get_or_create_collection(name, placeholder_dir, image_name, description):
    background_image = get_image(placeholder_dir, image_name)
    defaults = {
        'slug': fake.slug(name),
        'background_image': background_image,
        'description': description}
    return Collection.objects.get_or_create(name=name, defaults=defaults)[0]


def create_skill_image(skill, placeholder_dir, image_name):
    image = get_image(placeholder_dir, image_name)
    # We don't want to create duplicated skill images
    if skill.skill_type.images.count() >= len(IMAGES_MAPPING.get(skill.pk, [])):
        return None
    skill_image = SkillImage(skill_type = skill.skill_type, image=image)
    skill_image.save()
    create_skill_thumbnails.delay(skill_image.pk)
    return skill_image


def create_address():
    address = Address.objects.create(
        first_name=fake.first_name(),
        last_name=fake.last_name(),
        street_address_1=fake.street_address(),
        city=fake.city(),
        postal_code=fake.postcode(),
        country=fake.country_code())
    return address


def create_fake_user():
    address = create_address()
    email = get_email(address.first_name, address.last_name)

    user = User.objects.create_user(
        first_name=address.first_name,
        last_name=address.last_name,
        email=email,
        password='password')

    user.addresses.add(address)
    user.default_billing_address = address
    user.default_delivery_address = address
    user.is_active = True
    user.save()
    return user


# We don't want to spam the console with payment confirmations sent to
# fake customers.
@patch('remote_works.task.emails.send_payment_confirmation.delay')
def create_fake_payment(mock_email_confirmation, task):
    payment = create_payment(
        gateway=settings.DUMMY,
        customer_ip_address=fake.ipv4(),
        email=task.user_email,
        task=task,
        payment_token=str(uuid.uuid4()),
        total=task.total.gross.amount,
        currency=task.total.gross.currency,
        billing_address=task.billing_address)

    # Create authorization transaction
    gateway_authorize(payment, payment.token)
    # 20% chance to void the transaction at this stage
    if random.choice([0, 0, 0, 0, 1]):
        gateway_void(payment)
        return payment
    # 25% to end the payment at the authorization stage
    if not random.choice([1, 1, 1, 0]):
        return payment
    # Create capture transaction
    gateway_capture(payment)
    # 25% to refund the payment
    if random.choice([0, 0, 0, 1]):
        gateway_refund(payment)
    return payment


def create_task_line(task, discounts, taxes):
    if Skill.objects.filter(variants__isnull=False).count() > 0:
        skill = Skill.objects.filter(variants__isnull=False).order_by('?')[0]
        variant = skill.variants.all()[0]
        quantity = random.randrange(1, 5)
        variant.quantity += quantity
        variant.quantity_allocated += quantity
        variant.save()
        return task.lines.create(
            skill_name=variant.display_skill(),
            skill_sku=variant.sku,
            is_delivery_required=variant.is_delivery_required(),
            quantity=quantity,
            variant=variant,
            unit_price=variant.get_price(discounts=discounts, taxes=taxes),
            tax_rate=get_tax_rate_by_name(variant.skill.tax_rate, taxes))


def create_task_lines(task, discounts, taxes, how_many=10):
    for dummy in range(how_many):
        yield create_task_line(task, discounts, taxes)


def create_fulfillments(task):
    for line in task:
        if random.choice([False, True]):
            fulfillment, _ = Fulfillment.objects.get_or_create(task=task)
            quantity = random.randrange(0, line.quantity) + 1
            fulfillment.lines.create(task_line=line, quantity=quantity)
            line.quantity_fulfilled = quantity
            line.save(update_fields=['quantity_fulfilled'])

    update_task_status(task)


def create_fake_task(discounts, taxes):
    user = random.choice([None, User.objects.filter(
        is_superuser=False).order_by('?').first()])
    if user:
        task_data = {
            'user': user,
            'billing_address': user.default_billing_address,
            'delivery_address': user.default_delivery_address}
    else:
        address = create_address()
        task_data = {
            'billing_address': address,
            'delivery_address': address,
            'user_email': get_email(
                address.first_name, address.last_name)}

    delivery_method = DeliveryMethod.objects.order_by('?').first()
    delivery_price = delivery_method.price
    delivery_price = get_taxed_delivery_price(delivery_price, taxes)
    task_data.update({
        'delivery_method_name': delivery_method.name,
        'delivery_price': delivery_price})

    task = Task.objects.create(**task_data)

    lines = create_task_lines(task, discounts, taxes, random.randrange(1, 5))
    line_total = 0
    for line in lines:
        if line:
            line_total += line.get_total()

    task.total = task.delivery_price
    task.save()

    create_fake_payment(task=task)
    create_fulfillments(task)
    return task


def create_fake_sale():
    sale = Sale.objects.create(
        name='Happy %s day!' % fake.word(),
        type=DiscountValueType.PERCENTAGE,
        value=random.choice([10, 20, 30, 40, 50]))
    for skill in Skill.objects.all().order_by('?')[:4]:
        sale.skills.add(skill)
    return sale


def create_users(how_many=10):
    for dummy in range(how_many):
        user = create_fake_user()
        yield 'User: %s' % (user.email,)


def create_tasks(how_many=10):
    taxes = get_taxes_for_country(Country(settings.DEFAULT_COUNTRY))
    discounts = Sale.objects.active(date.today()).prefetch_related(
        'skills', 'categories', 'collections')
    for dummy in range(how_many):
        task = create_fake_task(discounts, taxes)
        yield 'Task: %s' % (task,)


def create_skill_sales(how_many=5):
    for dummy in range(how_many):
        sale = create_fake_sale()
        yield 'Sale: %s' % (sale,)


def create_delivery_zone(
        delivery_methods_names, countries, delivery_zone_name):
    delivery_zone = DeliveryZone.objects.get_or_create(
        name=delivery_zone_name, defaults={'countries': countries})[0]
    DeliveryMethod.objects.bulk_create([
        DeliveryMethod(
            name=name, price=fake.money(), delivery_zone=delivery_zone,
            type=(
                DeliveryMethodType.PRICE_BASED))
        for name in delivery_methods_names])
    return 'Delivery Zone: %s' % delivery_zone


def create_delivery_zones():
    european_countries = [
        'AX', 'AL', 'AD', 'AT', 'BY', 'BE', 'BA', 'BG', 'HR', 'CZ', 'DK', 'EE',
        'FO', 'FI', 'FR', 'DE', 'GI', 'GR', 'GG', 'VA', 'HU', 'IS', 'IE', 'IM',
        'IT', 'JE', 'LV', 'LI', 'LT', 'LU', 'MK', 'MT', 'MD', 'MC', 'ME', 'NL',
        'NO', 'PL', 'PT', 'RO', 'RU', 'SM', 'RS', 'SK', 'SI', 'ES', 'SJ', 'SE',
        'CH', 'UA', 'GB']
    yield create_delivery_zone(
        delivery_zone_name='Europe', countries=european_countries,
        delivery_methods_names=[
            'DHL', 'UPS', 'Registred priority', 'DB Schenker'])
    oceanian_countries = [
        'AS', 'AU', 'CX', 'CC', 'CK', 'FJ', 'PF', 'GU', 'HM', 'KI', 'MH', 'FM',
        'NR', 'NC', 'NZ', 'NU', 'NF', 'MP', 'PW', 'PG', 'PN', 'WS', 'SB', 'TK',
        'TO', 'TV', 'UM', 'VU', 'WF']
    yield create_delivery_zone(
        delivery_zone_name='Oceania', countries=oceanian_countries,
        delivery_methods_names=['FBA', 'FedEx Express', 'Oceania Air Mail'])
    asian_countries = [
        'AF', 'AM', 'AZ', 'BH', 'BD', 'BT', 'BN', 'KH', 'CN', 'CY', 'GE', 'HK',
        'IN', 'ID', 'IR', 'IQ', 'IL', 'JP', 'JO', 'KZ', 'KP', 'KR', 'KW', 'KG',
        'LA', 'LB', 'MO', 'MY', 'MV', 'MN', 'MM', 'NP', 'OM', 'PK', 'PS', 'PH',
        'QA', 'SA', 'SG', 'LK', 'SY', 'TW', 'TJ', 'TH', 'TL', 'TR', 'TM', 'AE',
        'UZ', 'VN', 'YE']
    yield create_delivery_zone(
        delivery_zone_name='Asia', countries=asian_countries,
        delivery_methods_names=['China Post', 'TNT', 'Aramex', 'EMS'])
    american_countries = [
        'AI', 'AG', 'AR', 'AW', 'BS', 'BB', 'BZ', 'BM', 'BO', 'BQ', 'BV', 'BR',
        'CA', 'KY', 'CL', 'CO', 'CR', 'CU', 'CW', 'DM', 'DO', 'EC', 'SV', 'FK',
        'GF', 'GL', 'GD', 'GP', 'GT', 'GY', 'HT', 'HN', 'JM', 'MQ', 'MX', 'MS',
        'NI', 'PA', 'PY', 'PE', 'PR', 'BL', 'KN', 'LC', 'MF', 'PM', 'VC', 'SX',
        'GS', 'SR', 'TT', 'TC', 'US', 'UY', 'VE', 'VG', 'VI']
    yield create_delivery_zone(
        delivery_zone_name='Americas', countries=american_countries,
        delivery_methods_names=['DHL', 'UPS', 'FedEx', 'EMS'])
    african_countries = [
        'DZ', 'AO', 'BJ', 'BW', 'IO', 'BF', 'BI', 'CV', 'CM', 'CF', 'TD', 'KM',
        'CG', 'CD', 'CI', 'DJ', 'EG', 'GQ', 'ER', 'SZ', 'ET', 'TF', 'GA', 'GM',
        'GH', 'GN', 'GW', 'KE', 'LS', 'LR', 'LY', 'MG', 'MW', 'ML', 'MR', 'MU',
        'YT', 'MA', 'MZ', 'NA', 'NE', 'NG', 'RE', 'RW', 'SH', 'ST', 'SN', 'SC',
        'SL', 'SO', 'ZA', 'SS', 'SD', 'TZ', 'TG', 'TN', 'UG', 'EH', 'ZM', 'ZW']
    yield create_delivery_zone(
        delivery_zone_name='Africa', countries=african_countries,
        delivery_methods_names=[
            'Royale International', 'ACE', 'fastway couriers', 'Post Office'])


def create_vouchers():
    voucher, created = Voucher.objects.get_or_create(
        code='FREEDELIVERY', defaults={
            'type': VoucherType.DELIVERY,
            'name': 'Free delivery',
            'discount_value_type': DiscountValueType.PERCENTAGE,
            'discount_value': 100})
    if created:
        yield 'Voucher #%d' % voucher.id
    else:
        yield 'Delivery voucher already exists'

    voucher, created = Voucher.objects.get_or_create(
        code='DISCOUNT', defaults={
            'type': VoucherType.VALUE,
            'name': 'Big task discount',
            'discount_value_type': DiscountValueType.FIXED,
            'discount_value': 25,
            'min_amount_spent': 200})
    if created:
        yield 'Voucher #%d' % voucher.id
    else:
        yield 'Value voucher already exists'


def set_homepage_collection():
    homepage_collection = Collection.objects.order_by('?').first()
    site = Site.objects.get_current()
    settings = SiteSettings.objects.get_or_create(site=site)
    print(settings[0])
    print(type(settings[0]))
    site.settings = settings[0]
    site_settings = site.settings
    site_settings.homepage_collection = homepage_collection
    site_settings.save()
    yield 'Homepage collection assigned'


def add_address_to_admin(email):
    address = create_address()
    user = User.objects.get(email=email)
    store_user_address(user, address, AddressType.BILLING)
    store_user_address(user, address, AddressType.DELIVERY)


def create_fake_collection(placeholder_dir, collection_data):
    image_dir = get_skill_list_images_dir(placeholder_dir)
    collection = get_or_create_collection(
        name=collection_data['name'], placeholder_dir=image_dir,
        image_name=collection_data['image_name'],
        description=collection_data['description'])
    skills = Skill.objects.order_by('?')[:4]
    collection.skills.add(*skills)
    create_collection_background_image_thumbnails.delay(collection.pk)
    return collection


def create_collections_by_schema(placeholder_dir, schema=COLLECTIONS_SCHEMA):
    for collection_data in COLLECTIONS_SCHEMA:
        collection = create_fake_collection(placeholder_dir, collection_data)
        yield 'Collection: %s' % (collection,)


def create_page():
    content = """
    <h2>E-commerce for the PWA era</h2>
    <h3>A modular, high performance e-commerce storefront built with GraphQL, Django, and ReactJS.</h3>
    <p>Remote-works is a rapidly-growing open source e-commerce platform that has served high-volume companies from branches like publishing and apparel since 2012. Based on Python and Django, the latest major update introduces a modular front end with a GraphQL API and storefront and dashboard written in React to make remote-works a full-functionality open source e-commerce.</p>
    """
    page_data = {'content': content, 'title': 'About', 'is_published': True}
    page, dummy = Page.objects.get_or_create(slug='about', **page_data)
    yield 'Page %s created' % page.slug


def generate_menu_items(menu: Menu, category: Category, parent_menu_item):
    menu_item, created = menu.items.get_or_create(
        name=category.name, category=category, parent=parent_menu_item)

    if created:
        yield 'Created menu item for category %s' % category

    for child in category.get_children():
        for msg in generate_menu_items(menu, child, menu_item):
            yield '\t%s' % msg


def generate_menu_tree(menu):
    categories = Category.tree.get_queryset().filter(skills__isnull=False)
    for category in categories:
        if not category.parent_id:
            for msg in generate_menu_items(menu, category, None):
                yield msg


def create_menus():
    # Create navbar menu with category links
    top_menu, _ = Menu.objects.get_or_create(
        name=settings.DEFAULT_MENUS['top_menu_name'])
    top_menu.items.all().delete()
    yield 'Created navbar menu'
    for msg in generate_menu_tree(top_menu):
        yield msg

    # Create footer menu with collections and pages
    bottom_menu, _ = Menu.objects.get_or_create(
        name=settings.DEFAULT_MENUS['bottom_menu_name'])
    bottom_menu.items.all().delete()
    if Collection.objects.filter(skills__isnull=False).count() > 0:
        collection = Collection.objects.filter(
            skills__isnull=False).order_by('?')[0]
        item, _ = bottom_menu.items.get_or_create(
            name='Collections',
            collection=collection)

        for collection in Collection.objects.filter(
                skills__isnull=False, background_image__isnull=False):
            bottom_menu.items.get_or_create(
                name=collection.name,
                collection=collection,
                parent=item)

    page = Page.objects.order_by('?')[0]
    bottom_menu.items.get_or_create(
        name=page.title,
        page=page)
    yield 'Created footer menu'
    update_menu(top_menu)
    update_menu(bottom_menu)
    site = Site.objects.get_current()
    site_settings = site.settings
    site_settings.top_menu = top_menu
    site_settings.bottom_menu = bottom_menu
    site_settings.save()


def get_skill_list_images_dir(placeholder_dir):
    skill_list_images_dir = os.path.join(
        placeholder_dir, TYPES_LIST_DIR)
    return skill_list_images_dir


def get_image(image_dir, image_name):
    img_path = os.path.join(image_dir, image_name)
    return File(open(img_path, 'rb'), name=image_name)
