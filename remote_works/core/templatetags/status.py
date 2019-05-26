from django.template import Library

from ...task import TaskStatus
from ...payment import ChargeStatus
from ...skill import SkillAvailabilityStatus, VariantAvailabilityStatus
from ...skill.utils.availability import (
    get_skill_availability_status, get_variant_availability_status)

register = Library()


SUCCESSES = {
    ChargeStatus.FULLY_CHARGED,
    ChargeStatus.FULLY_REFUNDED}


LABEL_DANGER = 'danger'
LABEL_SUCCESS = 'success'
LABEL_DEFAULT = 'default'


@register.inclusion_tag('status_label.html')
def render_status(status, status_display=None):
    if status in SUCCESSES:
        label_cls = LABEL_SUCCESS
    else:
        label_cls = LABEL_DEFAULT
    return {'label_cls': label_cls, 'status': status_display or status}


@register.inclusion_tag('status_label.html')
def render_task_status(status, status_display=None):
    if status == TaskStatus.FULFILLED:
        label_cls = LABEL_SUCCESS
    else:
        label_cls = LABEL_DEFAULT
    return {'label_cls': label_cls, 'status': status_display or status}


@register.inclusion_tag('status_label.html')
def render_availability_status(skill):
    status = get_skill_availability_status(skill)
    display = SkillAvailabilityStatus.get_display(status)
    if status == SkillAvailabilityStatus.READY_FOR_PURCHASE:
        label_cls = LABEL_SUCCESS
    else:
        label_cls = LABEL_DANGER
    return {'status': display, 'label_cls': label_cls}


@register.inclusion_tag('status_label.html')
def render_variant_availability_status(variant):
    status = get_variant_availability_status(variant)
    display = VariantAvailabilityStatus.get_display(status)
    if status == VariantAvailabilityStatus.AVAILABLE:
        label_cls = LABEL_SUCCESS
    else:
        label_cls = LABEL_DANGER
    return {'status': display, 'label_cls': label_cls}


@register.inclusion_tag('dashboard/includes/_page_availability.html')
def render_page_availability(page):
    ctx = {'is_visible': page.is_visible, 'page': page}
    if page.is_visible:
        label_cls = LABEL_SUCCESS
        ctx.update({'label_cls': label_cls})
    return ctx


@register.inclusion_tag('dashboard/includes/_collection_availability.html')
def render_collection_availability(collection):
    if collection.is_visible:
        label_cls = LABEL_SUCCESS
    else:
        label_cls = LABEL_DANGER
    return {'is_visible': collection.is_visible,
            'collection': collection,
            'label_cls': label_cls}
