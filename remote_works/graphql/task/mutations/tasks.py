import graphene
from graphql_jwt.decorators import permission_required

from ....account.models import User
from ....core.utils.taxes import ZERO_TAXED_MONEY
from ....task import TaskEvents, models
from ....task.utils import cancel_order
from ....payment import CustomPaymentChoices, PaymentError
from ....payment.utils import (
    clean_mark_task_as_paid, gateway_capture, gateway_refund, gateway_void,
    mark_task_as_paid)
from ....delivery.models import DeliveryMethod as DeliveryMethodModel
from ...account.types import AddressInput
from ...core.mutations import BaseMutation
from ...core.scalars import Decimal
from ...core.types.common import Error
from ...task.mutations.draft_tasks import DraftTaskUpdate
from ...task.types import Task, TaskEvent
from ...delivery.types import DeliveryMethod


def clean_task_update_delivery(task, method, errors):
    if not method:
        return errors
    if not task.delivery_address:
        errors.append(
            Error(
                field='task',
                message=(
                    'Cannot choose a delivery method for an '
                    'task without the delivery address.')))
        return errors
    valid_methods = (
        DeliveryMethodModel.objects.applicable_delivery_methods(
            price=task.get_subtotal().gross.amount,
            weight=task.get_total_weight(),
            country_code=task.delivery_address.country.code))
    valid_methods = valid_methods.values_list('id', flat=True)
    if method.pk not in valid_methods:
        errors.append(
            Error(
                field='deliveryMethod',
                message='Delivery method cannot be used with this task.'))
    return errors


def clean_task_cancel(task, errors):
    if task and not task.can_cancel():
        errors.append(
            Error(
                field='task',
                message='This task can\'t be canceled.'))
    return errors


def clean_task_capture(payment, amount, errors):
    if not payment:
        errors.append(
            Error(
                field='payment',
                message='There\'s no payment associated with the task.'))
        return errors
    if not payment.is_active:
        errors.append(
            Error(
                field='payment',
                message='Only pre-authorized payments can be captured'))
    return errors


def clean_void_payment(payment, errors):
    """Check for payment errors."""
    if not payment.is_active:
        errors.append(
            Error(field='payment',
                  message='Only pre-authorized payments can be voided'))
    try:
        gateway_void(payment)
    except (PaymentError, ValueError) as e:
        errors.append(Error(field='payment', message=str(e)))
    return errors


def clean_refund_payment(payment, amount, errors):
    if payment.gateway == CustomPaymentChoices.MANUAL:
        errors.append(
            Error(field='payment',
                  message='Manual payments can not be refunded.'))
    return errors


class TaskUpdateInput(graphene.InputObjectType):
    billing_address = AddressInput(
        description='Billing address of the customer.')
    user_email = graphene.String(description='Email address of the customer.')
    delivery_address = AddressInput(
        description='Delivery address of the customer.')


class TaskUpdate(DraftTaskUpdate):
    class Arguments:
        id = graphene.ID(
            required=True, description='ID of an task to update.')
        input = TaskUpdateInput(
            required=True,
            description='Fields required to update an task.')

    class Meta:
        description = 'Updates an task.'
        model = models.Task

    @classmethod
    def save(cls, info, instance, cleaned_input):
        super().save(info, instance, cleaned_input)
        if instance.user_email:
            user = User.objects.filter(email=instance.user_email).first()
            instance.user = user
        instance.save()


class TaskUpdateDeliveryInput(graphene.InputObjectType):
    delivery_method = graphene.ID(
        description='ID of the selected delivery method.',
        name='deliveryMethod')


class TaskUpdateDelivery(BaseMutation):
    task = graphene.Field(
        Task, description='Task with updated delivery method.')

    class Arguments:
        id = graphene.ID(
            required=True, name='task',
            description='ID of the task to update a delivery method.')
        input = TaskUpdateDeliveryInput(
            description='Fields required to change '
                        'delivery method of the task.')

    class Meta:
        description = 'Updates a delivery method of the task.'

    @classmethod
    @permission_required('task.manage_orders')
    def mutate(cls, root, info, id, input):
        errors = []
        task = cls.get_node_or_error(info, id, errors, 'id', Task)

        if not input['delivery_method']:
            if not task.is_draft() and task.is_delivery_required():
                cls.add_error(
                    errors, 'deliveryMethod',
                    'Delivery method is required for this task.')
                return TaskUpdateDelivery(errors=errors)
            task.delivery_method = None
            task.delivery_price = ZERO_TAXED_MONEY
            task.delivery_method_name = None
            task.save(
                update_fields=[
                    'delivery_method', 'delivery_price_net',
                    'delivery_price_gross', 'delivery_method_name'])
            return TaskUpdateDelivery(task=task)

        method = cls.get_node_or_error(
            info, input['delivery_method'], errors,
            'delivery_method', DeliveryMethod)
        clean_task_update_delivery(task, method, errors)
        if errors:
            return TaskUpdateDelivery(errors=errors)

        task.delivery_method = method
        task.delivery_price = method.get_total(info.context.taxes)
        task.delivery_method_name = method.name
        task.save(
            update_fields=[
                'delivery_method', 'delivery_method_name',
                'delivery_price_net', 'delivery_price_gross'])
        return TaskUpdateDelivery(task=task)


class TaskAddNoteInput(graphene.InputObjectType):
    message = graphene.String(description='Note message.', name='message')


class TaskAddNote(BaseMutation):
    task = graphene.Field(Task, description='Task with the note added.')
    event = graphene.Field(TaskEvent, description='Task note created.')

    class Arguments:
        id = graphene.ID(
            required=True,
            description='ID of the task to add a note for.', name='task')
        input = TaskAddNoteInput(
            required=True,
            description='Fields required to create a note for the task.')

    class Meta:
        description = 'Adds note to the task.'

    @classmethod
    @permission_required('task.manage_orders')
    def mutate(cls, root, info, id, input):
        errors = []
        task = cls.get_node_or_error(info, id, errors, 'id', Task)
        if errors:
            return TaskAddNote(errors=errors)

        event = task.events.create(
            type=TaskEvents.NOTE_ADDED.value,
            user=info.context.user,
            parameters={
                'message': input['message']})
        return TaskAddNote(task=task, event=event)


class TaskCancel(BaseMutation):
    task = graphene.Field(Task, description='Canceled task.')

    class Arguments:
        id = graphene.ID(
            required=True, description='ID of the task to cancel.')
        reavailability = graphene.Boolean(
            required=True,
            description='Determine if lines will be reavailabilityed or not.')

    class Meta:
        description = 'Cancel an task.'

    @classmethod
    @permission_required('task.manage_orders')
    def mutate(cls, root, info, id, reavailability):
        errors = []
        task = cls.get_node_or_error(info, id, errors, 'id', Task)
        clean_task_cancel(task, errors)
        if errors:
            return TaskCancel(errors=errors)

        cancel_order(task=task, reavailability=reavailability)
        if reavailability:
            task.events.create(
                type=TaskEvents.FULFILLMENT_REAVAILED_ITEMS.value,
                user=info.context.user,
                parameters={'quantity': task.get_total_quantity()})
        else:
            task.events.create(
                type=TaskEvents.CANCELED.value, user=info.context.user)
        # FIXME all payments should be voided/refunded at this point
        return TaskCancel(task=task)


class TaskMarkAsPaid(BaseMutation):
    task = graphene.Field(Task, description='Task marked as paid.')

    class Arguments:
        id = graphene.ID(
            required=True, description='ID of the task to mark paid.')

    class Meta:
        description = 'Mark task as manually paid.'

    @classmethod
    @permission_required('task.manage_orders')
    def mutate(cls, root, info, id):
        errors = []
        task = cls.get_node_or_error(info, id, errors, 'id', Task)
        if task is not None:
            try:
                clean_mark_task_as_paid(task)
            except PaymentError as e:
                errors.append(Error(field='payment', message=str(e)))
        if errors:
            return TaskMarkAsPaid(errors=errors)
        mark_task_as_paid(task, info.context.user)
        return TaskMarkAsPaid(task=task)


class TaskCapture(BaseMutation):
    task = graphene.Field(Task, description='Captured task.')

    class Arguments:
        id = graphene.ID(
            required=True, description='ID of the task to capture.')
        amount = Decimal(
            required=True, description='Amount of money to capture.')

    class Meta:
        description = 'Capture an task.'

    @classmethod
    @permission_required('task.manage_orders')
    def mutate(cls, root, info, id, amount):
        errors = []
        if amount <= 0:
            cls.add_error('Amount should be a positive number.')
            return TaskCapture(errors=errors)

        task = cls.get_node_or_error(info, id, errors, 'id', Task)
        payment = task.get_last_payment()
        clean_task_capture(payment, amount, errors)

        try:
            gateway_capture(payment, amount)
        except PaymentError as e:
            errors.append(Error(field='payment', message=str(e)))

        if errors:
            return TaskCapture(errors=errors)

        task.events.create(
            parameters={'amount': amount},
            type=TaskEvents.PAYMENT_CAPTURED.value,
            user=info.context.user)
        return TaskCapture(task=task)


class TaskVoid(BaseMutation):
    task = graphene.Field(Task, description='A voided task.')

    class Arguments:
        id = graphene.ID(
            required=True, description='ID of the task to void.')

    class Meta:
        description = 'Void an task.'

    @classmethod
    @permission_required('task.manage_orders')
    def mutate(cls, root, info, id):
        errors = []
        task = cls.get_node_or_error(info, id, errors, 'id', Task)
        if task:
            payment = task.get_last_payment()
            clean_void_payment(payment, errors)

        if errors:
            return TaskVoid(errors=errors)
        task.events.create(
            type=TaskEvents.PAYMENT_VOIDED.value,
            user=info.context.user)
        return TaskVoid(task=task)


class TaskRefund(BaseMutation):
    task = graphene.Field(Task, description='A refunded task.')

    class Arguments:
        id = graphene.ID(
            required=True, description='ID of the task to refund.')
        amount = Decimal(
            required=True, description='Amount of money to refund.')

    class Meta:
        description = 'Refund an task.'

    @classmethod
    @permission_required('task.manage_orders')
    def mutate(cls, root, info, id, amount):
        errors = []
        if amount <= 0:
            cls.add_error('Amount should be a positive number.')
            return TaskRefund(errors=errors)

        task = cls.get_node_or_error(info, id, errors, 'id', Task)
        if task:
            payment = task.get_last_payment()
            clean_refund_payment(payment, amount, errors)
            try:
                gateway_refund(payment, amount)
            except PaymentError as e:
                errors.append(Error(field='payment', message=str(e)))

        if errors:
            return TaskRefund(errors=errors)

        task.events.create(
            type=TaskEvents.PAYMENT_REFUNDED.value,
            user=info.context.user,
            parameters={'amount': amount})
        return TaskRefund(task=task)
