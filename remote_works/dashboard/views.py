from django.conf import settings
from django.contrib.admin.views.decorators import (
    staff_member_required as _staff_member_required, user_passes_test)
from django.contrib.auth import REDIRECT_FIELD_NAME
from django.db.models import Q, Sum
from django.template.response import TemplateResponse

from ..task.models import Task
from ..payment import ChargeStatus
from ..payment.models import Payment
from ..skill.models import Skill


def staff_member_required(f):
    return _staff_member_required(f, login_url='account:login')


def superuser_required(
        view_func=None, redirect_field_name=REDIRECT_FIELD_NAME,
        login_url='account:login'):
    """Check if the user is logged in and is a superuser.
    
    Otherwise redirects to the login page.
    """
    actual_decorator = user_passes_test(
        lambda u: u.is_active and u.is_superuser,
        login_url=login_url,
        redirect_field_name=redirect_field_name)
    if view_func:
        return actual_decorator(view_func)
    return actual_decorator


def index(request):
    paginate_by = 10
    orders_to_ship = Task.objects.ready_to_fulfill().select_related(
        'user').prefetch_related('lines', 'payments')
    payments = Payment.objects.filter(
        is_active=True, charge_status=ChargeStatus.NOT_CHARGED
    ).order_by('-created')
    payments = payments.select_related('task', 'task__user')
    low_availability = get_low_availability_skills()
    ctx = {'preauthorized_payments': payments[:paginate_by],
           'orders_to_ship': orders_to_ship[:paginate_by],
           'low_availability': low_availability[:paginate_by]}
    return TemplateResponse(request, 'dashboard/index.html', ctx)


#@staff_member_required
def styleguide(request):
    return TemplateResponse(request, 'dashboard/styleguide/index.html', {})


def get_low_availability_skills():
    threshold = getattr(settings, 'LOW_AVAILABILITY_THRESHOLD', 10)
    skills = Skill.objects.annotate(
        total_availability=Sum('variants__quantity'))
    return skills.filter(Q(total_availability__lte=threshold)).distinct()
