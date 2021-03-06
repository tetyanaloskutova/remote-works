from django.contrib.auth.models import Permission

MODELS_PERMISSIONS = [
    'account.manage_users',
    'account.manage_staff',
    'account.impersonate_users',
    'discount.manage_discounts',
    'menu.manage_menus',
    'task.manage_tasks',
    'page.manage_pages',
    'skill.manage_skills',
    'delivery.manage_delivery',
    'site.manage_settings',
    'site.manage_translations']


def split_permission_codename(permissions):
    return [permission.split('.')[1] for permission in permissions]


def get_permissions(permissions=None):
    if permissions is None:
        permissions = MODELS_PERMISSIONS
    codenames = split_permission_codename(permissions)
    return Permission.objects.filter(codename__in=codenames).prefetch_related(
        'content_type').order_by('codename')
