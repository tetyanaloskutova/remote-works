from decimal import Decimal

from django.conf import settings
from django.contrib.postgres.fields import HStoreField, JSONField
from django.core.validators import MinValueValidator
from django.db import models
from django.urls import reverse
from django.utils.encoding import smart_text
from django.utils.text import slugify
from django.utils.translation import pgettext_lazy
from django_measurement.models import MeasurementField
from django_prices.models import MoneyField
from django_prices.templatetags import prices_i18n
from measurement.measures import Weight
from mptt.managers import TreeManager
from mptt.models import MPTTModel
from prices import TaxedMoneyRange
from text_unidecode import unidecode
from versatileimagefield.fields import PPOIField, VersatileImageField
from django.shortcuts import get_object_or_404
from ..account.models import User

from ..core import TaxRateType
from ..core.exceptions import InsufficientStock
from ..core.models import PublishableModel, SortableModel
from ..core.utils.taxes import DEFAULT_TAX_RATE_NAME, apply_tax_to_price
from ..core.utils.translations import TranslationProxy
from ..core.weight import WeightUnits, zero_weight
from ..discount.utils import calculate_discounted_price
from ..seo.models import SeoModel, SeoModelTranslation


class Category(MPTTModel, SeoModel):
    name = models.CharField(max_length=128)
    slug = models.SlugField(max_length=128)
    description = models.TextField(blank=True)
    description_json = JSONField(blank=True, default=dict)
    parent = models.ForeignKey(
        'self', null=True, blank=True, related_name='children',
        on_delete=models.CASCADE)
    background_image = VersatileImageField(
        upload_to='category-backgrounds', blank=True, null=True)
    background_image_alt = models.CharField(max_length=128, blank=True)

    objects = models.Manager()
    tree = TreeManager()
    translated = TranslationProxy()

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse(
            'skill:category',
            kwargs={'slug': self.slug, 'category_id': self.id})


class CategoryTranslation(SeoModelTranslation):
    language_code = models.CharField(max_length=10)
    category = models.ForeignKey(
        Category, related_name='translations', on_delete=models.CASCADE)
    name = models.CharField(max_length=128)
    description = models.TextField(blank=True)
    description_json = JSONField(blank=True, default=dict)

    class Meta:
        unique_together = (('language_code', 'category'),)

    def __str__(self):
        return self.name

    def __repr__(self):
        class_ = type(self)
        return '%s(pk=%r, name=%r, category_pk=%r)' % (
            class_.__name__, self.pk, self.name, self.category_id)


class SkillType(models.Model):
    name = models.CharField(max_length=128)
    has_variants = models.BooleanField(default=True)
    is_shipping_required = models.BooleanField(default=True)
    tax_rate = models.CharField(
        max_length=128, default=DEFAULT_TAX_RATE_NAME,
        choices=TaxRateType.CHOICES)
    weight = MeasurementField(
        measurement=Weight, unit_choices=WeightUnits.CHOICES,
        default=zero_weight)

    class Meta:
        app_label = 'skill'

    def __str__(self):
        return self.name

    def __repr__(self):
        class_ = type(self)
        return '<%s.%s(pk=%r, name=%r)>' % (
            class_.__module__, class_.__name__, self.pk, self.name)


class Skill(SeoModel, PublishableModel):
    skill_type = models.ForeignKey(
        SkillType, related_name='skills', on_delete=models.CASCADE)
    name = models.CharField(max_length=128)
    description = models.TextField(blank=True)
    description_json = JSONField(blank=True, default=dict)
    category = models.ForeignKey(
        Category, related_name='skills', on_delete=models.CASCADE)
    price = MoneyField(
        currency=settings.DEFAULT_CURRENCY,
        max_digits=settings.DEFAULT_MAX_DIGITS,
        decimal_places=settings.DEFAULT_DECIMAL_PLACES)
    attributes = HStoreField(default=dict, blank=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)
    charge_taxes = models.BooleanField(default=True)
    tax_rate = models.CharField(
        max_length=128, default=DEFAULT_TAX_RATE_NAME, blank=True,
        choices=TaxRateType.CHOICES)
    weight = MeasurementField(
        measurement=Weight, unit_choices=WeightUnits.CHOICES,
        blank=True, null=True)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, null = True, related_name='skills',
        on_delete=models.SET_NULL)

    translated = TranslationProxy()

    class Meta:
        app_label = 'skill'
        ordering = ('name', )
        permissions = ((
            'manage_skills', pgettext_lazy(
                'Permission description',
                'Manage Skills.')),)

    def __iter__(self):
        if not hasattr(self, '__variants'):
            setattr(self, '__variants', self.variants.all())
        return iter(getattr(self, '__variants'))

    def __repr__(self):
        class_ = type(self)
        return '<%s.%s(pk=%r, name=%r)>' % (
            class_.__module__, class_.__name__, self.pk, self.name)

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse(
            'skill:details',
            kwargs={'slug': self.get_slug(), 'skill_id': self.id})
     
    def get_owner_url(self):
        # Put owner ID compulsory in the DB
        customer = get_object_or_404(User,email = self.owner)
        return reverse("account:profile-details",kwargs={'pk':str(customer.id)}) 

    def get_slug(self):
        return slugify(smart_text(unidecode(self.name)))

    def is_in_stock(self):
        return any(variant.is_in_stock() for variant in self)

    def get_first_image(self):
        images = list(self.images.all())
        return images[0] if images else None

    def get_price_range(self, discounts=None, taxes=None):
        if self.variants.all():
            prices = [
                variant.get_price(discounts=discounts, taxes=taxes)
                for variant in self]
            return TaxedMoneyRange(min(prices), max(prices))
        price = calculate_discounted_price(self, self.price, discounts)
        if not self.charge_taxes:
            taxes = None
        tax_rate = self.tax_rate or self.skill_type.tax_rate
        price = apply_tax_to_price(taxes, tax_rate, price)
        return TaxedMoneyRange(start=price, stop=price)


class SkillTranslation(SeoModelTranslation):
    language_code = models.CharField(max_length=10)
    skill = models.ForeignKey(
        Skill, related_name='translations', on_delete=models.CASCADE)
    name = models.CharField(max_length=128)
    description = models.TextField(blank=True)
    description_json = JSONField(blank=True, default=dict)

    class Meta:
        unique_together = (('language_code', 'skill'),)

    def __str__(self):
        return self.name

    def __repr__(self):
        class_ = type(self)
        return '%s(pk=%r, name=%r, skill_pk=%r)' % (
            class_.__name__, self.pk, self.name, self.skill_id)


class SkillVariant(models.Model):
    sku = models.CharField(max_length=32, unique=True)
    name = models.CharField(max_length=255, blank=True)
    price_override = MoneyField(
        currency=settings.DEFAULT_CURRENCY,
        max_digits=settings.DEFAULT_MAX_DIGITS,
        decimal_places=settings.DEFAULT_DECIMAL_PLACES, blank=True, null=True)
    skill = models.ForeignKey(
        Skill, related_name='variants', on_delete=models.CASCADE)
    attributes = HStoreField(default=dict, blank=True)
    images = models.ManyToManyField('SkillImage', through='VariantImage')
    track_inventory = models.BooleanField(default=True)
    quantity = models.IntegerField(
        validators=[MinValueValidator(0)], default=Decimal(1))
    quantity_allocated = models.IntegerField(
        validators=[MinValueValidator(0)], default=Decimal(0))
    cost_price = MoneyField(
        currency=settings.DEFAULT_CURRENCY,
        max_digits=settings.DEFAULT_MAX_DIGITS,
        decimal_places=settings.DEFAULT_DECIMAL_PLACES, blank=True, null=True)
    weight = MeasurementField(
        measurement=Weight, unit_choices=WeightUnits.CHOICES,
        blank=True, null=True)
    translated = TranslationProxy()

    class Meta:
        app_label = 'skill'

    def __str__(self):
        return self.name or self.sku

    @property
    def quantity_available(self):
        return max(self.quantity - self.quantity_allocated, 0)

    def check_quantity(self, quantity):
        """Check if there is at least the given quantity in stock
        if stock handling is enabled.
        """
        if self.track_inventory and quantity > self.quantity_available:
            raise InsufficientStock(self)

    @property
    def base_price(self):
        return self.price_override or self.skill.price

    def get_price(self, discounts=None, taxes=None):
        price = calculate_discounted_price(
            self.skill, self.base_price, discounts)
        if not self.skill.charge_taxes:
            taxes = None
        tax_rate = (
            self.skill.tax_rate or self.skill.skill_type.tax_rate)
        return apply_tax_to_price(taxes, tax_rate, price)

    def get_weight(self):
        return (
            self.weight or self.skill.weight or
            self.skill.skill_type.weight)

    def get_absolute_url(self):
        slug = self.skill.get_slug()
        skill_id = self.skill.id
        return reverse('skill:details',
                       kwargs={'slug': slug, 'skill_id': skill_id})

    def is_shipping_required(self):
        return self.skill.skill_type.is_shipping_required

    def is_in_stock(self):
        return self.quantity_available > 0

    def display_skill(self, translated=False):
        if translated:
            skill = self.skill.translated
            variant_display = str(self.translated)
        else:
            variant_display = str(self)
            skill = self.skill
            skill_display = (
            '%s (%s)' % (skill, variant_display)
            if variant_display else str(skill))
        return smart_text(skill_display)

    def get_first_image(self):
        images = list(self.images.all())
        return images[0] if images else self.skill.get_first_image()

    def get_ajax_label(self, discounts=None):
        price = self.get_price(discounts).gross
        return '%s, %s, %s' % (
            self.sku, self.display_skill(), prices_i18n.amount(price))


class SkillVariantTranslation(models.Model):
    language_code = models.CharField(max_length=10)
    skill_variant = models.ForeignKey(
        SkillVariant, related_name='translations', on_delete=models.CASCADE)
    name = models.CharField(max_length=255, blank=True)

    translated = TranslationProxy()

    class Meta:
        unique_together = (('language_code', 'skill_variant'),)

    def __repr__(self):
        class_ = type(self)
        return '%s(pk=%r, name=%r, variant_pk=%r)' % (
            class_.__name__, self.pk, self.name, self.skill_variant_id)

    def __str__(self):
        return self.name or str(self.skill_variant)


class Attribute(models.Model):
    slug = models.SlugField(max_length=50)
    name = models.CharField(max_length=50)
    skill_type = models.ForeignKey(
        SkillType, related_name='skill_attributes', blank=True,
        null=True, on_delete=models.CASCADE)
    skill_variant_type = models.ForeignKey(
        SkillType, related_name='variant_attributes', blank=True,
        null=True, on_delete=models.CASCADE)

    translated = TranslationProxy()

    class Meta:
        ordering = ('slug', )

    def __str__(self):
        return self.name

    def get_formfield_name(self):
        return slugify(
            'attribute-%s-%s' % (self.slug, self.pk), allow_unicode=True)

    def has_values(self):
        return self.values.exists()


class AttributeTranslation(models.Model):
    language_code = models.CharField(max_length=10)
    attribute = models.ForeignKey(
        Attribute, related_name='translations',
        on_delete=models.CASCADE)
    name = models.CharField(max_length=100)

    class Meta:
        unique_together = (('language_code', 'attribute'),)

    def __repr__(self):
        class_ = type(self)
        return '%s(pk=%r, name=%r, attribute_pk=%r)' % (
            class_.__name__, self.pk, self.name, self.attribute_id)

    def __str__(self):
        return self.name


class AttributeValue(SortableModel):
    name = models.CharField(max_length=100)
    value = models.CharField(max_length=100, blank=True, default='')
    slug = models.SlugField(max_length=100)
    attribute = models.ForeignKey(
        Attribute, related_name='values', on_delete=models.CASCADE)

    translated = TranslationProxy()

    class Meta:
        ordering = ('sort_order', )
        unique_together = ('name', 'attribute')

    def __str__(self):
        return self.name

    def get_ordering_queryset(self):
        return self.attribute.values.all()


class AttributeValueTranslation(models.Model):
    language_code = models.CharField(max_length=10)
    attribute_value = models.ForeignKey(
        AttributeValue, related_name='translations',
        on_delete=models.CASCADE)
    name = models.CharField(max_length=100)

    class Meta:
        unique_together = (('language_code', 'attribute_value'),)

    def __repr__(self):
        class_ = type(self)
        return '%s(pk=%r, name=%r, attribute_value_pk=%r)' % (
            class_.__name__, self.pk, self.name,
            self.attribute_value_id)

    def __str__(self):
        return self.name


class SkillImage(SortableModel):
    skill = models.ForeignKey(
        Skill, related_name='images', on_delete=models.CASCADE)
    image = VersatileImageField(
        upload_to='skills', ppoi_field='ppoi', blank=False)
    ppoi = PPOIField()
    alt = models.CharField(max_length=128, blank=True)

    class Meta:
        ordering = ('sort_order', )
        app_label = 'skill'

    def get_ordering_queryset(self):
        return self.skill.images.all()


class VariantImage(models.Model):
    variant = models.ForeignKey(
        'SkillVariant', related_name='variant_images',
        on_delete=models.CASCADE)
    image = models.ForeignKey(
        SkillImage, related_name='variant_images', on_delete=models.CASCADE)


class Collection(SeoModel, PublishableModel):
    name = models.CharField(max_length=128, unique=True)
    slug = models.SlugField(max_length=128)
    skills = models.ManyToManyField(
        Skill, blank=True, related_name='collections')
    background_image = VersatileImageField(
        upload_to='collection-backgrounds', blank=True, null=True)
    background_image_alt = models.CharField(max_length=128, blank=True)
    description = models.TextField(blank=True)
    description_json = JSONField(blank=True, default=dict)

    translated = TranslationProxy()

    class Meta:
        ordering = ('slug', )

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse(
            'skill:collection',
            kwargs={'pk': self.id, 'slug': self.slug})


class CollectionTranslation(SeoModelTranslation):
    language_code = models.CharField(max_length=10)
    collection = models.ForeignKey(
        Collection, related_name='translations',
        on_delete=models.CASCADE)
    name = models.CharField(max_length=128)
    description = models.TextField(blank=True)
    description_json = JSONField(blank=True, default=dict)

    class Meta:
        unique_together = (('language_code', 'collection'),)

    def __repr__(self):
        class_ = type(self)
        return '%s(pk=%r, name=%r, collection_pk=%r)' % (
            class_.__name__, self.pk, self.name, self.collection_id)

    def __str__(self):
        return self.name
