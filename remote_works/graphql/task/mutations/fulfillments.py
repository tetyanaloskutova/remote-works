from textwrap import dedent

import graphene
from django.utils.translation import npgettext_lazy, pgettext_lazy
from graphql_jwt.decorators import permission_required

from ....dashboard.task.utils import fulfill_task_line
from ....task import TaskEvents, TaskEventsEmails, models
from ....task.emails import send_fulfillment_confirmation
from ....task.utils import cancel_fulfillment, update_task_status
from ...core.mutations import BaseMutation
from ...task.types import Fulfillment, Task
from ..types import TaskLine


def send_fulfillment_confirmation_to_customer(task, fulfillment, user):
    send_fulfillment_confirmation.delay(task.pk, fulfillment.pk)
    task.events.create(
        parameters={
            'email': task.get_user_current_email(),
            'email_type': TaskEventsEmails.FULFILLMENT.value},
        type=TaskEvents.EMAIL_SENT.value, user=user)


class FulfillmentLineInput(graphene.InputObjectType):
    task_line_id = graphene.ID(
        description='The ID of the task line.', name='orderLineId')
    quantity = graphene.Int(
        description='The number of line item(s) to be fulfiled.')


class FulfillmentCreateInput(graphene.InputObjectType):
    tracking_number = graphene.String(
        description='Fulfillment tracking number')
    notify_customer = graphene.Boolean(
        description='If true, send an email notification to the customer.')
    lines = graphene.List(
        FulfillmentLineInput, required=True,
        description='Item line to be fulfilled.')


class FulfillmentUpdateTrackingInput(graphene.InputObjectType):
    tracking_number = graphene.String(
        description='Fulfillment tracking number')
    notify_customer = graphene.Boolean(
        description='If true, send an email notification to the customer.')


class FulfillmentCancelInput(graphene.InputObjectType):
    restock = graphene.Boolean(description='Whether item lines are restocked.')


class FulfillmentCreate(BaseMutation):
    fulfillment = graphene.Field(
        Fulfillment, description='A created fulfillment.')
    task = graphene.Field(
        Task, description='Fulfilled task.')

    class Arguments:
        task = graphene.ID(
            description='ID of the task to be fulfilled.', name='task')
        input = FulfillmentCreateInput(
            required=True,
            description='Fields required to create an fulfillment.')

    class Meta:
        description = 'Creates a new fulfillment for an task.'

    @classmethod
    def clean_lines(cls, task_lines, quantities, errors):
        if errors:
            return errors

        for task_line, quantity in zip(task_lines, quantities):
            if quantity > task_line.quantity_unfulfilled:
                msg = npgettext_lazy(
                    'Fulfill task line mutation error',
                    'Only %(quantity)d item remaining to fulfill.',
                    'Only %(quantity)d items remaining to fulfill.',
                    number='quantity') % {
                        'quantity': task_line.quantity_unfulfilled,
                        'task_line': task_line}
                cls.add_error(errors, task_line, msg)
        return errors

    @classmethod
    def clean_input(cls, input, errors):
        lines = input['lines']
        quantities = [line['quantity'] for line in lines]
        lines_ids = [line['task_line_id'] for line in lines]
        task_lines = cls.get_nodes_or_error(
            lines_ids, errors, 'lines', TaskLine)

        cls.clean_lines(task_lines, quantities, errors)

        if sum(quantities) <= 0:
            cls.add_error(
                errors, 'lines', 'Total quantity must be larger than 0.')

        if errors:
            return cls(errors=errors)
        input['task_lines'] = task_lines
        input['quantities'] = quantities
        return input

    @classmethod
    def save(cls, user, fulfillment, task, cleaned_input):
        fulfillment.save()
        task_lines = cleaned_input.get('task_lines')
        quantities = cleaned_input.get('quantities')
        fulfillment_lines = []
        for task_line, quantity in zip(task_lines, quantities):
            fulfill_task_line(task_line, quantity)
            fulfillment_lines.append(
                models.FulfillmentLine(
                    task_line=task_line, fulfillment=fulfillment,
                    quantity=quantity))

        fulfillment.lines.bulk_create(fulfillment_lines)
        update_task_status(task)
        task.events.create(
            parameters={'quantity': sum(quantities)},
            type=TaskEvents.FULFILLMENT_FULFILLED_ITEMS.value,
            user=user)
        if cleaned_input.get('notify_customer'):
            send_fulfillment_confirmation_to_customer(
                task, fulfillment, user)
        return fulfillment

    @classmethod
    @permission_required('task.manage_orders')
    def mutate(cls, root, info, task, input):
        errors = []
        task = cls.get_node_or_error(
            info, task, errors, 'task', Task)
        if errors:
            return cls(errors=errors)
        fulfillment = models.Fulfillment(
            tracking_number=input.pop('tracking_number', None) or '',
            task=task)
        cleaned_input = cls.clean_input(input, errors)
        if errors:
            return cls(errors=errors)
        fulfillment = cls.save(
            info.context.user, fulfillment, task, cleaned_input)
        return FulfillmentCreate(
            fulfillment=fulfillment, task=fulfillment.task)


class FulfillmentUpdateTracking(BaseMutation):
    fulfillment = graphene.Field(
        Fulfillment, description='A fulfillment with updated tracking.')
    task = graphene.Field(
        Task, description='Task which fulfillment was updated.')

    class Arguments:
        id = graphene.ID(
            required=True, description='ID of an fulfillment to update.')
        input = FulfillmentUpdateTrackingInput(
            required=True,
            description='Fields required to update an fulfillment.')

    class Meta:
        description = 'Updates a fulfillment for an task.'

    @classmethod
    @permission_required('task.manage_orders')
    def mutate(cls, root, info, id, input):
        errors = []
        fulfillment = cls.get_node_or_error(
            info, id, errors, 'id', Fulfillment)
        if errors:
            return cls(errors=errors)
        tracking_number = input.get('tracking_number') or ''
        fulfillment.tracking_number = tracking_number
        fulfillment.save()
        task = fulfillment.task
        task.events.create(
            parameters={
                'tracking_numner': tracking_number,
                'fulfillment': fulfillment.composed_id},
            type=TaskEvents.TRACKING_UPDATED.value,
            user=info.context.user)
        return FulfillmentUpdateTracking(fulfillment=fulfillment, task=task)


class FulfillmentCancel(BaseMutation):
    fulfillment = graphene.Field(
        Fulfillment, description='A canceled fulfillment.')
    task = graphene.Field(
        Task, description='Task which fulfillment was cancelled.')

    class Arguments:
        id = graphene.ID(
            required=True, description='ID of an fulfillment to cancel.')
        input = FulfillmentCancelInput(
            required=True,
            description='Fields required to cancel an fulfillment.')

    class Meta:
        description = dedent("""Cancels existing fulfillment
        and optionally restocks items.""")

    @classmethod
    @permission_required('task.manage_orders')
    def mutate(cls, root, info, id, input):
        errors = []
        restock = input.get('restock')
        fulfillment = cls.get_node_or_error(
            info, id, errors, 'id', Fulfillment)
        if fulfillment:
            task = fulfillment.task
            if not fulfillment.can_edit():
                err_msg = pgettext_lazy(
                    'Cancel fulfillment mutation error',
                    'This fulfillment can\'t be canceled')
                cls.add_error(errors, 'fulfillment', err_msg)

        if errors:
            return cls(errors=errors)

        cancel_fulfillment(fulfillment, restock)
        if restock:
            task.events.create(
                parameters={'quantity': fulfillment.get_total_quantity()},
                type=TaskEvents.FULFILLMENT_RESTOCKED_ITEMS.value,
                user=info.context.user)
        else:
            task.events.create(
                parameters={'composed_id': fulfillment.composed_id},
                type=TaskEvents.FULFILLMENT_CANCELED.value,
                user=info.context.user)
        return FulfillmentCancel(fulfillment=fulfillment, task=task)
