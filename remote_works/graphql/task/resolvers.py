import graphene
import graphene_django_optimizer as gql_optimizer

from ...task import TaskEvents, TaskStatus, models
from ...task.utils import sum_task_totals
from ..utils import filter_by_period, filter_by_query_param
from .enums import TaskStatusFilter
from .types import Task
from .utils import applicable_delivery_methods

ORDER_SEARCH_FIELDS = (
    'id', 'discount_name', 'token', 'user_email', 'user__email')


def resolve_orders(info, created, status, query):
    user = info.context.user
    if user.has_perm('task.manage_orders'):
        qs = models.Task.objects.all()
    else:
        qs = user.tasks.confirmed()
    qs = filter_by_query_param(qs, query, ORDER_SEARCH_FIELDS)

    # filter tasks by status
    if status is not None:
        if status == TaskStatusFilter.READY_TO_FULFILL:
            qs = qs.ready_to_fulfill()
        elif status == TaskStatusFilter.READY_TO_CAPTURE:
            qs = qs.ready_to_capture()

    # filter tasks by creation date
    if created is not None:
        qs = filter_by_period(qs, created, 'created')

    return gql_optimizer.query(qs, info)


def resolve_orders_total(info, period):
    qs = models.Task.objects.confirmed().exclude(status=TaskStatus.CANCELED)
    qs = filter_by_period(qs, period, 'created')
    return sum_task_totals(qs)


def resolve_order(info, id):
    """Return task only for user assigned to it or proper staff user."""
    user = info.context.user
    task = graphene.Node.get_node_from_global_id(info, id, Task)
    if user.has_perm('task.manage_orders') or task.user == user:
        return task
    return None


def resolve_delivery_methods(obj, info, price):
    return applicable_delivery_methods(obj, info, price)


def resolve_homepage_events(info):
    # Filter only selected events to be displayed on homepage.
    types = [
        TaskEvents.PLACED.value, TaskEvents.PLACED_FROM_DRAFT.value,
        TaskEvents.ORDER_FULLY_PAID.value]
    return models.TaskEvent.objects.filter(type__in=types)


def resolve_order_by_token(info, token):
    return models.Task.objects.filter(token=token).first()
