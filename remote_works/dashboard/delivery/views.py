from django.conf import settings
from django.contrib import messages
from django.contrib.auth.decorators import permission_required
from django.shortcuts import get_object_or_404, redirect
from django.template.response import TemplateResponse
from django.utils.translation import pgettext_lazy

from ...core.utils import get_paginator_items
from ...delivery.models import DeliveryMethod, DeliveryZone
from ..views import staff_member_required
from .filters import DeliveryZoneFilter
from .forms import ChangeDefaultWeightUnit, DeliveryZoneForm, get_delivery_form


@staff_member_required
@permission_required('delivery.manage_delivery')
def delivery_zone_list(request):
    zones = DeliveryZone.objects.prefetch_related(
        'delivery_methods').order_by('name')
    delivery_zone_filter = DeliveryZoneFilter(
        request.GET, queryset=zones)

    form = ChangeDefaultWeightUnit(
        request.POST or None, instance=request.site.settings)
    if request.method == 'POST' and form.is_valid():
        form.save()
        msg = pgettext_lazy(
            'Dashboard message', 'Updated default weight unit')
        messages.success(request, msg)
        return redirect('dashboard:delivery-zone-list')

    zones = get_paginator_items(
        delivery_zone_filter.qs.distinct(), settings.DASHBOARD_PAGINATE_BY,
        request.GET.get('page'))
    ctx = {
        'delivery_zones': zones, 'filter_set': delivery_zone_filter,
        'is_empty': not delivery_zone_filter.queryset.exists(),
        'form': form}
    return TemplateResponse(request, 'dashboard/delivery/list.html', ctx)


@staff_member_required
@permission_required('delivery.manage_delivery')
def delivery_zone_add(request):
    zone = DeliveryZone()
    form = DeliveryZoneForm(request.POST or None, instance=zone)
    if form.is_valid():
        zone = form.save()
        msg = pgettext_lazy('Dashboard message', 'Added delivery zone')
        messages.success(request, msg)
        return redirect('dashboard:delivery-zone-details', pk=zone.pk)
    ctx = {'form': form, 'delivery_zone': form.instance}
    return TemplateResponse(request, 'dashboard/delivery/form.html', ctx)


@staff_member_required
@permission_required('delivery.manage_delivery')
def delivery_zone_edit(request, pk):
    zone = get_object_or_404(DeliveryZone, pk=pk)
    form = DeliveryZoneForm(request.POST or None, instance=zone)
    if form.is_valid():
        zone = form.save()
        msg = pgettext_lazy('Dashboard message', 'Updated delivery zone')
        messages.success(request, msg)
        return redirect('dashboard:delivery-zone-details', pk=zone.pk)
    ctx = {'form': form, 'delivery_zone': zone}
    return TemplateResponse(request, 'dashboard/delivery/form.html', ctx)


@staff_member_required
@permission_required('delivery.manage_delivery')
def delivery_zone_details(request, pk):
    zone = get_object_or_404(DeliveryZone, pk=pk)
    price_based = zone.delivery_methods.price_based()
    weight_based = zone.delivery_methods.weight_based()
    ctx = {
        'delivery_zone': zone, 'price_based': price_based,
        'weight_based': weight_based}
    return TemplateResponse(
        request, 'dashboard/delivery/detail.html', ctx)


@staff_member_required
@permission_required('delivery.manage_delivery')
def delivery_zone_delete(request, pk):
    delivery_zone = get_object_or_404(DeliveryZone, pk=pk)
    if request.method == 'POST':
        delivery_zone.delete()
        msg = pgettext_lazy(
            'Dashboard message',
            '%(delivery_zone_name)s successfully removed') % {
                'delivery_zone_name': delivery_zone}
        messages.success(request, msg)
        return redirect('dashboard:delivery-zone-list')
    ctx = {'delivery_zone': delivery_zone}
    return TemplateResponse(
        request, 'dashboard/delivery/modal/confirm_delete.html', ctx)


@staff_member_required
@permission_required('delivery.manage_delivery')
def delivery_method_add(request, delivery_zone_pk, type):
    delivery_zone = get_object_or_404(DeliveryZone, pk=delivery_zone_pk)
    delivery_method = DeliveryMethod(
        delivery_zone_id=delivery_zone_pk, type=type)
    form = get_delivery_form(delivery_method.type)
    form = form(request.POST or None, instance=delivery_method)
    if form.is_valid():
        delivery_method = form.save()
        msg = pgettext_lazy(
            'Dashboard message',
            'Added delivery method for %(zone_name)s delivery zone') % {
                'zone_name': delivery_zone}
        messages.success(request, msg)
        return redirect(
            'dashboard:delivery-zone-details', pk=delivery_zone_pk)
    ctx = {
        'form': form, 'delivery_zone': delivery_zone,
        'delivery_method': delivery_method}
    return TemplateResponse(
        request, 'dashboard/delivery/methods/form.html', ctx)


@staff_member_required
@permission_required('delivery.manage_delivery')
def delivery_method_edit(request, delivery_zone_pk, delivery_method_pk):
    delivery_zone = get_object_or_404(DeliveryZone, pk=delivery_zone_pk)
    delivery_method = get_object_or_404(DeliveryMethod, pk=delivery_method_pk)

    form = get_delivery_form(delivery_method.type)
    form = form(request.POST or None, instance=delivery_method)
    if form.is_valid():
        delivery_method = form.save()
        msg = pgettext_lazy(
            'Dashboard message',
            'Updated %(method_name)s delivery method') % {
                'method_name': delivery_method}
        messages.success(request, msg)
        return redirect(
            'dashboard:delivery-zone-details', pk=delivery_zone_pk)
    ctx = {
        'form': form, 'delivery_zone': delivery_zone,
        'delivery_method': delivery_method}
    return TemplateResponse(
        request, 'dashboard/delivery/methods/form.html', ctx)


@staff_member_required
@permission_required('delivery.manage_delivery')
def delivery_method_delete(
        request, delivery_zone_pk, delivery_method_pk=None):
    delivery_method = get_object_or_404(DeliveryMethod, pk=delivery_method_pk)
    if request.method == 'POST':
        delivery_method.delete()
        msg = pgettext_lazy(
            'Dashboard message',
            'Removed %(delivery_method_name)s delivery method') % {
                'delivery_method_name': delivery_method}
        messages.success(request, msg)
        return redirect(
            'dashboard:delivery-zone-details', pk=delivery_zone_pk)
    ctx = {
        'delivery_method': delivery_method,
        'delivery_zone_pk': delivery_zone_pk}
    return TemplateResponse(
        request, 'dashboard/delivery/modal/method_confirm_delete.html', ctx)
