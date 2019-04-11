from datetime import date

from django.conf import settings
from django.contrib import messages
from django.contrib.auth.decorators import permission_required
from django.db.models import Q
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, redirect, reverse
from django.template.response import TemplateResponse
from django.utils.translation import npgettext_lazy, pgettext_lazy
from django.views.decorators.http import require_POST

from . import forms
from ...core.utils import get_paginator_items
from ...discount.models import Sale
from ...skill.models import (
    Attribute, AttributeValue, Skill, SkillImage, SkillType,
    SkillVariant)
from ...skill.utils.availability import get_availability
from ...skill.utils.costs import (
    get_margin_for_variant, get_skill_costs_data)
#from ..views import staff_member_required
from .filters import AttributeFilter, SkillFilter, SkillTypeFilter


@permission_required('skill.manage_skills')
def skill_list(request):
    skills = Skill.objects.all()
    skills = skills.order_by('name')
    skill_types = SkillType.objects.all()
    skill_filter = SkillFilter(request.GET, queryset=skills)
    skills = get_paginator_items(
        skill_filter.qs, settings.DASHBOARD_PAGINATE_BY,
        request.GET.get('page'))
    ctx = {
        'bulk_action_form': forms.SkillBulkUpdate(),
        'skills': skills, 'skill_types': skill_types,
        'filter_set': skill_filter,
        'is_empty': not skill_filter.queryset.exists()}
    return TemplateResponse(request, 'dashboard/skill/list.html', ctx)


@permission_required('skill.manage_skills')
def skill_details(request, pk):
    skills = Skill.objects.prefetch_related('variants').all()
    skill = get_object_or_404(skills, pk=pk)
    variants = skill.variants.all()
    images = skill.skill_type.images.all()
    availability = get_availability(
        skill, discounts=request.discounts, taxes=request.taxes)
    sale_price = availability.price_range_undiscounted
    discounted_price = availability.price_range
    purchase_cost, margin = get_skill_costs_data(skill)

    # no_variants is True for skill types that doesn't require variant.
    # In this case we're using the first variant under the hood to allow stock
    # management.
    no_variants = not skill.skill_type.has_variants
    only_variant = variants.first() if no_variants else None
    ctx = {
        'skill': skill, 'sale_price': sale_price,
        'discounted_price': discounted_price, 'variants': variants,
        'images': images, 'no_variants': no_variants,
        'only_variant': only_variant, 'purchase_cost': purchase_cost,
        'margin': margin, 'is_empty': not variants.exists()}
    return TemplateResponse(request, 'dashboard/skill/detail.html', ctx)


@require_POST
@permission_required('skill.manage_skills')
def skill_toggle_is_published(request, pk):
    skill = get_object_or_404(Skill, pk=pk)
    skill.is_published = not skill.is_published
    skill.save(update_fields=['is_published'])
    return JsonResponse(
        {'success': True, 'is_published': skill.is_published})


@permission_required('skill.manage_skills')
def skill_select_type(request):
    """View for add skill modal embedded in the skill list view."""
    form = forms.SkillTypeSelectorForm(request.POST or None)
    status = 200
    if form.is_valid():
        redirect_url = reverse(
            'dashboard:skill-add',
            kwargs={'type_pk': form.cleaned_data.get('skill_type').pk})
        return (
            JsonResponse({'redirectUrl': redirect_url})
            if request.is_ajax() else redirect(redirect_url))
    elif form.errors:
        status = 400
    ctx = {'form': form}
    template = 'dashboard/skill/modal/select_type.html'
    return TemplateResponse(request, template, ctx, status=status)


@permission_required('skill.manage_skills')
def skill_create(request, type_pk):
    track_inventory = request.site.settings.track_inventory_by_default
    skill_type = get_object_or_404(SkillType, pk=type_pk)
    create_variant = not skill_type.has_variants
    skill = Skill()
    skill.skill_type = skill_type
    skill_form = forms.SkillForm(request.POST or None, instance=skill)
    if create_variant:
        variant = SkillVariant(
            skill=skill, track_inventory=track_inventory)
        variant_form = forms.SkillVariantForm(
            request.POST or None,
            instance=variant, prefix='variant')
        variant_errors = not variant_form.is_valid()
    else:
        variant_form = None
        variant_errors = False

    if skill_form.is_valid() and not variant_errors:
        skill = skill_form.save()
        if create_variant:
            variant.skill = skill
            variant_form.save()
        msg = pgettext_lazy(
            'Dashboard message', 'Added skill %s') % (skill,)
        messages.success(request, msg)
        return redirect('dashboard:skill-details', pk=skill.pk)
    ctx = {
        'skill_form': skill_form, 'variant_form': variant_form,
        'skill': skill}
    return TemplateResponse(request, 'dashboard/skill/form.html', ctx)


@permission_required('skill.manage_skills')
def skill_edit(request, pk):
    print('edit skills')
    skill = get_object_or_404(
        Skill.objects.prefetch_related('variants'), pk=pk)
    form = forms.SkillForm(request.POST or None, instance=skill)

    edit_variant = not skill.skill_type.has_variants
    print(edit_variant)
    if edit_variant:
        variant = skill.variants.first()
        variant_form = forms.SkillVariantForm(
            request.POST or None, instance=variant, prefix='variant')
        variant_errors = not variant_form.is_valid()
    else:
        variant_form = None
        variant_errors = False
    print(form.is_valid())
    if form.is_valid() and not variant_errors:
        skill = form.save()
        print(skill)
        if edit_variant:
            variant_form.save()
        msg = pgettext_lazy(
            'Dashboard message', 'Updated skill %s') % (skill,)
        messages.success(request, msg)
        return redirect('dashboard:skill-details', pk=skill.pk)
    ctx = {
        'skill': skill, 'skill_form': form, 'variant_form': variant_form}
    return TemplateResponse(request, 'dashboard/skill/form.html', ctx)


@permission_required('skill.manage_skills')
def skill_delete(request, pk):
    skill = get_object_or_404(Skill, pk=pk)
    if request.method == 'POST':
        skill.delete()
        msg = pgettext_lazy(
            'Dashboard message', 'Removed skill %s') % (skill,)
        messages.success(request, msg)
        return redirect('dashboard:skill-list')
    return TemplateResponse(
        request,
        'dashboard/skill/modal/confirm_delete.html',
        {'skill': skill})


@require_POST
@permission_required('skill.manage_skills')
def skill_bulk_update(request):
    form = forms.SkillBulkUpdate(request.POST)
    if form.is_valid():
        form.save()
        count = len(form.cleaned_data['skills'])
        msg = npgettext_lazy(
            'Dashboard message',
            '%(count)d skill has been updated',
            '%(count)d skills have been updated',
            number='count') % {'count': count}
        messages.success(request, msg)
    return redirect('dashboard:skill-list')


def ajax_skills_list(request):
    """Return skills filtered by request GET parameters.

    Response format is that of a Select2 JS widget.
    """
    queryset = (
        Skill.objects.all()
        if request.user.has_perm('skill.manage_skills')
        else Skill.objects.published())
    search_query = request.GET.get('q', '')
    if search_query:
        queryset = queryset.filter(Q(name__icontains=search_query))
    skills = [
        {'id': skill.id, 'text': str(skill)} for skill in queryset]
    return JsonResponse({'results': skills})


@permission_required('skill.manage_skills')
def skill_type_list(request):
    types = SkillType.objects.all().prefetch_related(
        'skill_attributes', 'variant_attributes').order_by('name')
    type_filter = SkillTypeFilter(request.GET, queryset=types)
    types = get_paginator_items(
        type_filter.qs, settings.DASHBOARD_PAGINATE_BY,
        request.GET.get('page'))
    types.object_list = [
        (pt.pk, pt.name, pt.skill_attributes.all(),
         pt.variant_attributes.all()) for pt in types.object_list]
    ctx = {
        'skill_types': types, 'filter_set': type_filter,
        'is_empty': not type_filter.queryset.exists()}
    return TemplateResponse(
        request,
        'dashboard/skill/skill_type/list.html',
        ctx)


@permission_required('skill.manage_skills')
@permission_required('skill.add_skilltype')
def skill_type_create(request):
    skill_type = SkillType()
    form = forms.SkillTypeForm(request.POST or None, instance=skill_type)
    if form.is_valid():
        skill_type = form.save()
        msg = pgettext_lazy(
            'Dashboard message', 'Added skill type %s') % (skill_type,)
        messages.success(request, msg)
        return redirect('dashboard:skill-type-list')
    ctx = {'form': form, 'skill_type': skill_type}
    return TemplateResponse(
        request,
        'dashboard/skill/skill_type/form.html',
        ctx)


@permission_required('skill.manage_skills')
@permission_required('skill.change_skilltype')
def skill_type_edit(request, pk):
    skill_type = get_object_or_404(SkillType, pk=pk)
    images = skill_type.images.all()
    form = forms.SkillTypeForm(request.POST or None, instance=skill_type)
    if form.is_valid():
        skill_type = form.save()
        msg = pgettext_lazy(
            'Dashboard message', 'Updated skill type %s') % (skill_type,)
        messages.success(request, msg)
        return redirect('dashboard:skill-type-update', pk=pk)
    ctx = {'form': form, 'skill_type': skill_type, 'images': images}
    return TemplateResponse(
        request,
        'dashboard/skill/skill_type/form.html',
        ctx)


@permission_required('skill.manage_skills')
@permission_required('skill.delete_skilltype')
def skill_type_delete(request, pk):
    skill_type = get_object_or_404(SkillType, pk=pk)
    if request.method == 'POST':
        skill_type.delete()
        msg = pgettext_lazy(
            'Dashboard message', 'Removed skill type %s') % (skill_type,)
        messages.success(request, msg)
        return redirect('dashboard:skill-type-list')
    ctx = {
        'skill_type': skill_type,
        'skills': skill_type.skills.all()}
    return TemplateResponse(
        request,
        'dashboard/skill/skill_type/modal/confirm_delete.html',
        ctx)


@permission_required('skill.manage_skills')
def variant_details(request, skill_pk, variant_pk):
    skill = get_object_or_404(Skill, pk=skill_pk)
    variant = get_object_or_404(skill.variants.all(), pk=variant_pk)

    # If the skill type of this skill assumes no variants, redirect to
    # skill details page that has special UI for skills without variants.
    if not skill.skill_type.has_variants:
        return redirect('dashboard:skill-details', pk=skill.pk)

    images = variant.images.all()
    margin = get_margin_for_variant(variant)
    discounted_price = variant.get_price(
        discounts=Sale.objects.active(date.today())).gross
    ctx = {
        'images': images, 'skill': skill, 'variant': variant,
        'margin': margin, 'discounted_price': discounted_price}
    return TemplateResponse(
        request,
        'dashboard/skill/skill_variant/detail.html',
        ctx)


@permission_required('skill.manage_skills')
def variant_create(request, skill_pk):
    track_inventory = request.site.settings.track_inventory_by_default
    skill = get_object_or_404(Skill.objects.all(), pk=skill_pk)
    variant = SkillVariant(skill=skill, track_inventory=track_inventory)
    form = forms.SkillVariantForm(
        request.POST or None,
        instance=variant)
    if form.is_valid():
        form.save()
        msg = pgettext_lazy(
            'Dashboard message', 'Saved variant %s') % (variant.name,)
        messages.success(request, msg)
        return redirect(
            'dashboard:variant-details', skill_pk=skill.pk,
            variant_pk=variant.pk)
    ctx = {'form': form, 'skill': skill, 'variant': variant}
    return TemplateResponse(
        request,
        'dashboard/skill/skill_variant/form.html',
        ctx)


@permission_required('skill.manage_skills')
def variant_edit(request, skill_pk, variant_pk):
    skill = get_object_or_404(Skill.objects.all(), pk=skill_pk)
    variant = get_object_or_404(skill.variants.all(), pk=variant_pk)
    form = forms.SkillVariantForm(request.POST or None, instance=variant)
    if form.is_valid():
        form.save()
        msg = pgettext_lazy(
            'Dashboard message', 'Saved variant %s') % (variant.name,)
        messages.success(request, msg)
        return redirect(
            'dashboard:variant-details', skill_pk=skill.pk,
            variant_pk=variant.pk)
    ctx = {'form': form, 'skill': skill, 'variant': variant}
    return TemplateResponse(
        request,
        'dashboard/skill/skill_variant/form.html',
        ctx)


@permission_required('skill.manage_skills')
def variant_delete(request, skill_pk, variant_pk):
    skill = get_object_or_404(Skill, pk=skill_pk)
    variant = get_object_or_404(skill.variants, pk=variant_pk)
    if request.method == 'POST':
        variant.delete()
        msg = pgettext_lazy(
            'Dashboard message', 'Removed variant %s') % (variant.name,)
        messages.success(request, msg)
        return redirect('dashboard:skill-details', pk=skill.pk)
    ctx = {
        'is_only_variant': skill.variants.count() == 1, 'skill': skill,
        'variant': variant}
    return TemplateResponse(
        request,
        'dashboard/skill/skill_variant/modal/confirm_delete.html',
        ctx)


@permission_required('skill.manage_skills')
def variant_images(request, skill_pk, variant_pk):
    skill = get_object_or_404(Skill, pk=skill_pk)
    qs = skill.skill_type.prefetch_related('variants')
    variant = get_object_or_404(qs, pk=variant_pk)
    form = forms.VariantImagesSelectForm(request.POST or None, variant=variant)
    if form.is_valid():
        form.save()
        return redirect(
            'dashboard:variant-details', skill_pk=skill.pk,
            variant_pk=variant.pk)
    ctx = {'form': form, 'skill': skill, 'variant': variant}
    return TemplateResponse(
        request,
        'dashboard/skill/skill_variant/modal/select_images.html',
        ctx)


def ajax_available_variants_list(request):
    """Return variants filtered by request GET parameters.

    Response format is that of a Select2 JS widget.
    """
    available_skills = Skill.objects.published().prefetch_related(
        'category',
        'skill_type__skill_attributes')
    queryset = SkillVariant.objects.filter(
        skill__in=available_skills).prefetch_related(
            'skill__category',
            'skill__skill_type__skill_attributes')

    search_query = request.GET.get('q', '')
    if search_query:
        queryset = queryset.filter(
            Q(sku__icontains=search_query) |
            Q(name__icontains=search_query) |
            Q(skill__name__icontains=search_query))

    variants = [
        {'id': variant.id, 'text': variant.get_ajax_label(request.discounts)}
        for variant in queryset]
    return JsonResponse({'results': variants})


@permission_required('skill.manage_skills')
def skill_images(request, skill_type_pk):
    skill_types = SkillType.objects.prefetch_related('images')
    skill_type = get_object_or_404(skill_types, pk=skill_type_pk)
    images = skill_type.images.all()
    ctx = {
        'skill_type': skill_type, 'images': images, 'is_empty': not images.exists()}
    return TemplateResponse(
        request, 'dashboard/skill/skill_image/list.html', ctx)


@permission_required('skill.manage_skills')
def skill_image_create(request, skill_type_pk):
    skill_type = get_object_or_404(SkillType, pk=skill_type_pk)
    skill_image = SkillImage(skill_type=skill_type)
    form = forms.SkillImageForm(
        request.POST or None, request.FILES or None, instance=skill_image)
    if form.is_valid():
        skill_image = form.save()
        msg = pgettext_lazy(
            'Dashboard message',
            'Added image %s') % (skill_image.image.name,)
        messages.success(request, msg)
        return redirect('dashboard:skill-image-list', skill_type_pk=skill_type.pk)
    ctx = {'form': form, 'skill_type': skill_type, 'skill_image': skill_image}
    return TemplateResponse(
        request,
        'dashboard/skill/skill_image/form.html',
        ctx)


@permission_required('skill.manage_skills')
def skill_image_edit(request, skill_type_pk, img_pk):
    skill_type = get_object_or_404(SkillType, pk=skill_type_pk)
    skill_image = get_object_or_404(skill_type.images, pk=img_pk)
    form = forms.SkillImageForm(
        request.POST or None, request.FILES or None, instance=skill_image)
    if form.is_valid():
        skill_image = form.save()
        msg = pgettext_lazy(
            'Dashboard message',
            'Updated image %s') % (skill_image.image.name,)
        messages.success(request, msg)
        return redirect('dashboard:skill-image-list', skill_type_pk=skill_type.pk)
    ctx = {'form': form, 'skill_type': skill_type, 'skill_image': skill_image}
    return TemplateResponse(
        request,
        'dashboard/skill/skill_image/form.html',
        ctx)


@permission_required('skill.manage_skills')
def skill_image_delete(request, skill_pk, img_pk):
    skill = get_object_or_404(Skill, pk=skill_pk)
    image = get_object_or_404(skill.images, pk=img_pk)
    if request.method == 'POST':
        image.delete()
        msg = pgettext_lazy(
            'Dashboard message', 'Removed image %s') % (image.image.name,)
        messages.success(request, msg)
        return redirect('dashboard:skill-image-list', skill_pk=skill.pk)
    return TemplateResponse(
        request,
        'dashboard/skill/skill_image/modal/confirm_delete.html',
        {'skill': skill, 'image': image})


@require_POST
def ajax_reorder_skill_images(request, skill_type_pk):
    skill = get_object_or_404(Skill, pk=skill_type_pk)
    form = forms.ReorderSkillImagesForm(request.POST, instance=skill)
    status = 200
    ctx = {}
    if form.is_valid():
        form.save()
    elif form.errors:
        status = 400
        ctx = {'error': form.errors}
    return JsonResponse(ctx, status=status)


@require_POST
def ajax_upload_image(request, skill_pk):
    skill = get_object_or_404(Skill, pk=skill_pk)
    form = forms.UploadImageForm(
        request.POST or None, request.FILES or None, skill=skill)
    ctx = {}
    status = 200
    if form.is_valid():
        image = form.save()
        ctx = {'id': image.pk, 'image': None, 'order': image.sort_order}
    elif form.errors:
        status = 400
        ctx = {'error': form.errors}
    return JsonResponse(ctx, status=status)


@permission_required('skill.manage_skills')
def attribute_list(request):
    attributes = (
        Attribute.objects.prefetch_related(
            'values', 'skill_type', 'skill_variant_type').order_by('name'))
    attribute_filter = AttributeFilter(request.GET, queryset=attributes)
    attributes = [(
        attribute.pk, attribute.name,
        attribute.skill_type or attribute.skill_variant_type,
        attribute.values.all()) for attribute in attribute_filter.qs]
    attributes = get_paginator_items(
        attributes, settings.DASHBOARD_PAGINATE_BY, request.GET.get('page'))
    ctx = {
        'attributes': attributes,
        'filter_set': attribute_filter,
        'is_empty': not attribute_filter.queryset.exists()}
    return TemplateResponse(
        request, 'dashboard/skill/attribute/list.html', ctx)


@permission_required('skill.manage_skills')
def attribute_details(request, pk):
    attributes = Attribute.objects.prefetch_related(
        'values', 'skill_type', 'skill_variant_type').all()
    attribute = get_object_or_404(attributes, pk=pk)
    skill_type = attribute.skill_type or attribute.skill_variant_type
    values = attribute.values.all()
    ctx = {
        'attribute': attribute, 'skill_type': skill_type, 'values': values}
    return TemplateResponse(
        request, 'dashboard/skill/attribute/detail.html', ctx)


@permission_required('skill.manage_skills')
def attribute_create(request):
    attribute = Attribute()
    form = forms.AttributeForm(request.POST or None, instance=attribute)
    if form.is_valid():
        attribute = form.save()
        msg = pgettext_lazy('Dashboard message', 'Added attribute')
        messages.success(request, msg)
        return redirect('dashboard:attribute-details', pk=attribute.pk)
    ctx = {'attribute': attribute, 'form': form}
    return TemplateResponse(
        request,
        'dashboard/skill/attribute/form.html',
        ctx)


@permission_required('skill.manage_skills')
def attribute_edit(request, pk):
    attribute = get_object_or_404(Attribute, pk=pk)
    form = forms.AttributeForm(request.POST or None, instance=attribute)
    if form.is_valid():
        attribute = form.save()
        msg = pgettext_lazy('Dashboard message', 'Updated attribute')
        messages.success(request, msg)
        return redirect('dashboard:attribute-details', pk=attribute.pk)
    ctx = {'attribute': attribute, 'form': form}
    return TemplateResponse(
        request,
        'dashboard/skill/attribute/form.html',
        ctx)


@permission_required('skill.manage_skills')
def attribute_delete(request, pk):
    attribute = get_object_or_404(Attribute, pk=pk)
    if request.method == 'POST':
        attribute.delete()
        msg = pgettext_lazy(
            'Dashboard message', 'Removed attribute %s') % (attribute.name,)
        messages.success(request, msg)
        return redirect('dashboard:attributes')
    return TemplateResponse(
        request,
        'dashboard/skill/attribute/modal/'
        'attribute_confirm_delete.html',
        {'attribute': attribute})


@permission_required('skill.manage_skills')
def attribute_value_create(request, attribute_pk):
    attribute = get_object_or_404(Attribute, pk=attribute_pk)
    value = AttributeValue(attribute_id=attribute_pk)
    form = forms.AttributeValueForm(request.POST or None, instance=value)
    if form.is_valid():
        form.save()
        msg = pgettext_lazy(
            'Dashboard message', 'Added attribute\'s value')
        messages.success(request, msg)
        return redirect('dashboard:attribute-details', pk=attribute_pk)
    ctx = {'attribute': attribute, 'value': value, 'form': form}
    return TemplateResponse(
        request,
        'dashboard/skill/attribute/values/form.html',
        ctx)


@permission_required('skill.manage_skills')
def attribute_value_edit(request, attribute_pk, value_pk):
    attribute = get_object_or_404(Attribute, pk=attribute_pk)
    value = get_object_or_404(AttributeValue, pk=value_pk)
    form = forms.AttributeValueForm(request.POST or None, instance=value)
    if form.is_valid():
        form.save()
        msg = pgettext_lazy(
            'Dashboard message', 'Updated attribute\'s value')
        messages.success(request, msg)
        return redirect('dashboard:attribute-details', pk=attribute_pk)
    ctx = {'attribute': attribute, 'value': value, 'form': form}
    return TemplateResponse(
        request,
        'dashboard/skill/attribute/values/form.html',
        ctx)


@permission_required('skill.manage_skills')
def attribute_value_delete(request, attribute_pk, value_pk):
    value = get_object_or_404(AttributeValue, pk=value_pk)
    if request.method == 'POST':
        value.delete()
        msg = pgettext_lazy(
            'Dashboard message',
            'Removed attribute\'s value %s') % (value.name,)
        messages.success(request, msg)
        return redirect('dashboard:attribute-details', pk=attribute_pk)
    return TemplateResponse(
        request,
        'dashboard/skill/attribute/values/modal/confirm_delete.html',
        {'value': value, 'attribute_pk': attribute_pk})


@permission_required('skill.manage_skills')
def ajax_reorder_attribute_values(request, attribute_pk):
    attribute = get_object_or_404(Attribute, pk=attribute_pk)
    form = forms.ReorderAttributeValuesForm(
        request.POST, instance=attribute)
    status = 200
    ctx = {}
    if form.is_valid():
        form.save()
    elif form.errors:
        status = 400
        ctx = {'error': form.errors}
    return JsonResponse(ctx, status=status)
