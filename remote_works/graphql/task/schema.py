from textwrap import dedent

import graphene
from graphql_jwt.decorators import login_required, permission_required

from ..core.enums import ReportingPeriod
from ..core.fields import PrefetchingConnectionField
from ..core.types import TaxedMoney
from ..descriptions import DESCRIPTIONS
from .enums import TaskStatusFilter
from .mutations.draft_tasks import (
    DraftTaskComplete, DraftTaskCreate, DraftTaskDelete,
    DraftTaskLineDelete, DraftTaskLinesCreate, DraftTaskLineUpdate,
    DraftTaskUpdate)
from .mutations.fulfillments import (
    FulfillmentCancel, FulfillmentCreate, FulfillmentUpdateTracking)
from .mutations.tasks import (
    TaskAddNote, TaskCancel, TaskCapture, TaskMarkAsPaid, TaskRefund,
    TaskUpdate, TaskUpdateDelivery, TaskVoid)
from .resolvers import (
    resolve_homepage_events, resolve_order, resolve_order_by_token,
    resolve_orders, resolve_orders_total)
from .types import Task, TaskEvent


class TaskQueries(graphene.ObjectType):
    homepage_events = PrefetchingConnectionField(
        TaskEvent, description=dedent('''List of activity events to display on
        homepage (at the moment it only contains task-events).'''))
    task = graphene.Field(
        Task, description='Lookup an task by ID.',
        id=graphene.Argument(graphene.ID, required=True))
    tasks = PrefetchingConnectionField(
        Task,
        query=graphene.String(description=DESCRIPTIONS['task']),
        created=graphene.Argument(
            ReportingPeriod,
            description='Filter tasks from a selected timespan.'),
        status=graphene.Argument(
            TaskStatusFilter, description='Filter task by status'),
        description='List of the shop\'s tasks.')
    orders_total = graphene.Field(
        TaxedMoney, description='Total sales.',
        period=graphene.Argument(
            ReportingPeriod,
            description='Get total sales for selected span of time.'))
    order_by_token = graphene.Field(
        Task, description='Lookup an task by token.',
        token=graphene.Argument(graphene.String, required=True))

    @permission_required('task.manage_orders')
    def resolve_homepage_events(self, info, **kwargs):
        return resolve_homepage_events(info)

    @login_required
    def resolve_order(self, info, id):
        return resolve_order(info, id)

    @login_required
    def resolve_orders(
            self, info, created=None, status=None, query=None, **kwargs):
        return resolve_orders(info, created, status, query)

    @permission_required('task.manage_orders')
    def resolve_orders_total(self, info, period, **kwargs):
        return resolve_orders_total(info, period)

    def resolve_order_by_token(self, info, token):
        return resolve_order_by_token(info, token)


class TaskMutations(graphene.ObjectType):
    draft_task_complete = DraftTaskComplete.Field()
    draft_task_create = DraftTaskCreate.Field()
    draft_task_delete = DraftTaskDelete.Field()
    draft_task_lines_create = DraftTaskLinesCreate.Field()
    draft_task_line_delete = DraftTaskLineDelete.Field()
    draft_task_line_update = DraftTaskLineUpdate.Field()
    draft_task_update = DraftTaskUpdate.Field()

    task_add_note = TaskAddNote.Field()
    task_cancel = TaskCancel.Field()
    task_capture = TaskCapture.Field()
    task_fulfillment_cancel = FulfillmentCancel.Field()
    task_fulfillment_create = FulfillmentCreate.Field()
    task_fulfillment_update_tracking = FulfillmentUpdateTracking.Field()
    task_mark_as_paid = TaskMarkAsPaid.Field()
    task_refund = TaskRefund.Field()
    task_update = TaskUpdate.Field()
    task_update_delivery = TaskUpdateDelivery.Field()
    task_void = TaskVoid.Field()
