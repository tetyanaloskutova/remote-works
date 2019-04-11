from django import forms
from django.utils.translation import npgettext, pgettext_lazy
from django_filters import (
    CharFilter, ChoiceFilter, ModelMultipleChoiceFilter, OrderingFilter,
    RangeFilter)

from ...core.filters import SortedFilterSet
from ...skill.models import Attribute, Category, Skill, SkillType
from ..widgets import MoneyRangeWidget

SKILL_SORT_BY_FIELDS = {
    'name': pgettext_lazy('Skill list sorting option', 'name'),
    'price': pgettext_lazy('Skill type list sorting option', 'price')}

SKILL_ATTRIBUTE_SORT_BY_FIELDS = {
    'name': pgettext_lazy('Skill attribute list sorting option', 'name')}

SKILL_TYPE_SORT_BY_FIELDS = {
    'name': pgettext_lazy('Skill type list sorting option', 'name')}

PUBLISHED_CHOICES = (
    ('1', pgettext_lazy('Is publish filter choice', 'Published')),
    ('0', pgettext_lazy('Is publish filter choice', 'Not published')))


class SkillFilter(SortedFilterSet):
    name = CharFilter(
        label=pgettext_lazy('Skill list filter label', 'Name'),
        lookup_expr='icontains')
    category = ModelMultipleChoiceFilter(
        label=pgettext_lazy('Skill list filter label', 'Category'),
        field_name='category',
        queryset=Category.objects.all())
    skill_type = ModelMultipleChoiceFilter(
        label=pgettext_lazy('Skill list filter label', 'Skill type'),
        field_name='skill_type',
        queryset=SkillType.objects.all())
    price = RangeFilter(
        label=pgettext_lazy('Skill list filter label', 'Price'),
        field_name='price',
        widget=MoneyRangeWidget)
    is_published = ChoiceFilter(
        label=pgettext_lazy('Skill list filter label', 'Is published'),
        choices=PUBLISHED_CHOICES,
        empty_label=pgettext_lazy('Filter empty choice label', 'All'),
        widget=forms.Select)
    sort_by = OrderingFilter(
        label=pgettext_lazy('Skill list filter label', 'Sort by'),
        fields=SKILL_SORT_BY_FIELDS.keys(),
        field_labels=SKILL_SORT_BY_FIELDS)

    class Meta:
        model = Skill
        fields = []

    def get_summary_message(self):
        counter = self.qs.count()
        return npgettext(
            'Number of matching records in the dashboard skills list',
            'Found %(counter)d matching skill',
            'Found %(counter)d matching skills',
            number=counter) % {'counter': counter}


class AttributeFilter(SortedFilterSet):
    name = CharFilter(
        label=pgettext_lazy('Attribute list filter label', 'Name'),
        lookup_expr='icontains')
    sort_by = OrderingFilter(
        label=pgettext_lazy('Attribute list filter label', 'Sort by'),
        fields=SKILL_TYPE_SORT_BY_FIELDS.keys(),
        field_labels=SKILL_TYPE_SORT_BY_FIELDS)

    class Meta:
        model = Attribute
        fields = []

    def get_summary_message(self):
        counter = self.qs.count()
        return npgettext(
            'Number of matching records in the dashboard attributes list',
            'Found %(counter)d matching attribute',
            'Found %(counter)d matching attributes',
            number=counter) % {'counter': counter}


class SkillTypeFilter(SortedFilterSet):
    name = CharFilter(
        label=pgettext_lazy('Skill type list filter label', 'Name'),
        lookup_expr='icontains')
    sort_by = OrderingFilter(
        label=pgettext_lazy('Skill type list filter label', 'Sort by'),
        fields=SKILL_TYPE_SORT_BY_FIELDS.keys(),
        field_labels=SKILL_TYPE_SORT_BY_FIELDS)
    skill_attributes = ModelMultipleChoiceFilter(
        label=pgettext_lazy(
            'Skill type list filter label', 'Skill attributes'),
        field_name='skill_attributes',
        queryset=Attribute.objects.all())
    variant_attributes = ModelMultipleChoiceFilter(
        label=pgettext_lazy(
            'Skill type list filter label', 'Variant attributes'),
        field_name='variant_attributes',
        queryset=Attribute.objects.all())

    class Meta:
        model = SkillType
        fields = ['name', 'skill_attributes', 'variant_attributes']

    def get_summary_message(self):
        counter = self.qs.count()
        return npgettext(
            'Number of matching records in the dashboard skill types list',
            'Found %(counter)d matching skill type',
            'Found %(counter)d matching skill types',
            number=counter) % {'counter': counter}
