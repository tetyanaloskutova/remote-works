from collections import OrderedDict

from django.db.models import Q
from django.forms import CheckboxSelectMultiple
from django.utils.translation import pgettext_lazy
from django_filters import MultipleChoiceFilter, OrderingFilter, RangeFilter

from ..core.filters import SortedFilterSet
from .models import Attribute, Skill

SORT_BY_FIELDS = OrderedDict([
    ('name', pgettext_lazy('Skill list sorting option', 'name')),
    ('price', pgettext_lazy('Skill list sorting option', 'price')),
    ('updated_at', pgettext_lazy(
        'Skill list sorting option', 'last updated'))])


class SkillFilter(SortedFilterSet):
    sort_by = OrderingFilter(
        label=pgettext_lazy('Skill list sorting form', 'Sort by'),
        fields=SORT_BY_FIELDS.keys(),
        field_labels=SORT_BY_FIELDS)
    price = RangeFilter(
        label=pgettext_lazy('Currency amount', 'Price'))

    class Meta:
        model = Skill
        fields = []

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.skill_attributes, self.variant_attributes = (
            self._get_attributes())
        self.filters.update(self._get_skill_attributes_filters())
        self.filters.update(self._get_skill_variants_attributes_filters())
        self.filters = OrderedDict(sorted(self.filters.items()))

    def _get_attributes(self):
        q_skill_attributes = self._get_skill_attributes_lookup()
        q_variant_attributes = self._get_variant_attributes_lookup()
        skill_attributes = (
            Attribute.objects.all()
            .prefetch_related('translations', 'values__translations')
            .filter(q_skill_attributes)
            .distinct())
        variant_attributes = (
            Attribute.objects.all()
            .prefetch_related('translations', 'values__translations')
            .filter(q_variant_attributes)
            .distinct())
        return skill_attributes, variant_attributes

    def _get_skill_attributes_lookup(self):
        raise NotImplementedError()

    def _get_variant_attributes_lookup(self):
        raise NotImplementedError()

    def _get_skill_attributes_filters(self):
        filters = {}
        for attribute in self.skill_attributes:
            filters[attribute.slug] = MultipleChoiceFilter(
                field_name='attributes__%s' % attribute.pk,
                label=attribute.translated.name,
                widget=CheckboxSelectMultiple,
                choices=self._get_attribute_choices(attribute))
        return filters

    def _get_skill_variants_attributes_filters(self):
        filters = {}
        for attribute in self.variant_attributes:
            filters[attribute.slug] = MultipleChoiceFilter(
                field_name='variants__attributes__%s' % attribute.pk,
                label=attribute.translated.name,
                widget=CheckboxSelectMultiple,
                choices=self._get_attribute_choices(attribute))
        return filters

    def _get_attribute_choices(self, attribute):
        return [
            (choice.pk, choice.translated.name)
            for choice in attribute.values.all()]


class SkillCategoryFilter(SkillFilter):
    def __init__(self, *args, **kwargs):
        self.category = kwargs.pop('category')
        super().__init__(*args, **kwargs)

    def _get_skill_attributes_lookup(self):
        categories = self.category.get_descendants(include_self=True)
        return Q(skill_type__skills__category__in=categories)

    def _get_variant_attributes_lookup(self):
        categories = self.category.get_descendants(include_self=True)
        return Q(skill_variant_type__skills__category__in=categories)


class SkillCollectionFilter(SkillFilter):
    def __init__(self, *args, **kwargs):
        self.collection = kwargs.pop('collection')
        super().__init__(*args, **kwargs)

    def _get_skill_attributes_lookup(self):
        return Q(skill_type__skills__collections=self.collection)

    def _get_variant_attributes_lookup(self):
        return Q(skill_variant_type__skills__collections=self.collection)
