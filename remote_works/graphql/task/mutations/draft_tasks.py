from textwrap import dedent

import graphene
from graphene.types import InputObjectType
from graphql_jwt.decorators import permission_required

from ....account.models import User
from ....core.exceptions import InsufficientStock
from ....core.utils.taxes import ZERO_TAXED_MONEY
from ....task import TaskEvents, TaskStatus, models
from ....task.utils import (
    add_variant_to_order, allocate_stock, change_task_line_quantity,
    delete_task_line, recalculate_order)
from ...account.i18n import I18nMixin
from ...account.types import AddressInput
from ...core.mutations import BaseMutation, ModelDeleteMutation, ModelMutation
from ...core.scalars import Decimal
from ...skill.types import SkillVariant
from ..types import Task, TaskLine
from ..utils import can_finalize_draft_order


class TaskLineInput(graphene.InputObjectType):
    quantity = graphene.Int(
        description='Number of variant items ordered.', required=True)


class TaskLineCreateInput(TaskLineInput):
    variant_id = graphene.ID(
        description='Skill variant ID.', name='variantId', required=True)


class DraftTaskInput(InputObjectType):
    billing_address = AddressInput(
        description='Billing address of the customer.')
    user = graphene.ID(
        descripton='Customer associated with the draft task.', name='user')
    user_email = graphene.String(description='Email address of the customer.')
    discount = Decimal(description='Discount amount for the task.')
    delivery_address = AddressInput(
        description='Delivery address of the customer.')
    delivery_method = graphene.ID(
        description='ID of a selected delivery method.', name='deliveryMethod')
    voucher = graphene.ID(
        description='ID of the voucher associated with the task',
        name='voucher')


class DraftTaskCreateInput(DraftTaskInput):
    lines = graphene.List(
        TaskLineCreateInput,
        description=dedent("""Variant line input consisting of variant ID
        and quantity of skills."""))


class DraftTaskCreate(ModelMutation, I18nMixin):
    class Arguments:
        input = DraftTaskCreateInput(
            required=True,
            description='Fields required to create an task.')

    class Meta:
        description = 'Creates a new draft task.'
        model = models.Task

    @classmethod
    def clean_input(cls, info, instance, input, errors):
        delivery_address = input.pop('delivery_address', None)
        billing_address = input.pop('billing_address', None)
        cleaned_input = super().clean_input(info, instance, input, errors)
        lines = input.pop('lines', None)
        if lines:
            variant_ids = [line.get('variant_id') for line in lines]
            variants = cls.get_nodes_or_error(
                ids=variant_ids, only_type=SkillVariant, errors=errors,
                field='variants')
            quantities = [line.get('quantity') for line in lines]
            cleaned_input['variants'] = variants
            cleaned_input['quantities'] = quantities
        cleaned_input['status'] = TaskStatus.DRAFT
        display_gross_prices = info.context.site.settings.display_gross_prices
        cleaned_input['display_gross_prices'] = display_gross_prices

        # Set up default addresses if possible
        user = cleaned_input.get('user')
        if user and not delivery_address:
            cleaned_input[
                'delivery_address'] = user.default_delivery_address
        if user and not billing_address:
            cleaned_input[
                'billing_address'] = user.default_billing_address

        if delivery_address:
            delivery_address, errors = cls.validate_address(
                delivery_address, errors, 'delivery_address',
                instance=instance.delivery_address)
            cleaned_input['delivery_address'] = delivery_address
        if billing_address:
            billing_address, errors = cls.validate_address(
                billing_address, errors, 'billing_address',
                instance=instance.billing_address)
            cleaned_input['billing_address'] = billing_address
        return cleaned_input

    @classmethod
    def user_is_allowed(cls, user, input):
        return user.has_perm('task.manage_orders')

    @classmethod
    def save(cls, info, instance, cleaned_input):
        delivery_address = cleaned_input.get('delivery_address')
        if delivery_address:
            delivery_address.save()
            instance.delivery_address = delivery_address
        billing_address = cleaned_input.get('billing_address')
        if billing_address:
            billing_address.save()
            instance.billing_address = billing_address
        super().save(info, instance, cleaned_input)
        instance.save(update_fields=['billing_address', 'delivery_address'])
        variants = cleaned_input.get('variants')
        quantities = cleaned_input.get('quantities')
        if variants and quantities:
            for variant, quantity in zip(variants, quantities):
                add_variant_to_order(
                    instance, variant, quantity, allow_overselling=True,
                    track_inventory=False)
        recalculate_order(instance)


class DraftTaskUpdate(DraftTaskCreate):
    class Arguments:
        id = graphene.ID(
            required=True, description='ID of an task to update.')
        input = DraftTaskInput(
            required=True,
            description='Fields required to update an task.')

    class Meta:
        description = 'Updates a draft task.'
        model = models.Task


class DraftTaskDelete(ModelDeleteMutation):
    class Arguments:
        id = graphene.ID(
            required=True, description='ID of a draft task to delete.')

    class Meta:
        description = 'Deletes a draft task.'
        model = models.Task

    @classmethod
    def user_is_allowed(cls, user, input):
        return user.has_perm('task.manage_orders')


class DraftTaskComplete(BaseMutation):
    task = graphene.Field(Task, description='Completed task.')

    class Arguments:
        id = graphene.ID(
            required=True,
            description='ID of the task that will be completed.')

    class Meta:
        description = 'Completes creating an task.'

    @classmethod
    def update_user_fields(cls, task):
        if task.user:
            task.user_email = task.user.email
        elif task.user_email:
            try:
                task.user = User.objects.get(email=task.user_email)
            except User.DoesNotExist:
                task.user = None

    @classmethod
    @permission_required('task.manage_orders')
    def mutate(cls, root, info, id):
        errors = []
        task = cls.get_node_or_error(info, id, errors, 'id', Task)
        if task:
            errors = can_finalize_draft_order(task, errors)
        if errors:
            return cls(errors=errors)

        cls.update_user_fields(task)
        task.status = TaskStatus.UNFULFILLED
        if not task.is_delivery_required():
            task.delivery_method_name = None
            task.delivery_price = ZERO_TAXED_MONEY
            if task.delivery_address:
                task.delivery_address.delete()
        task.save()
        oversold_items = []
        for line in task:
            try:
                line.variant.check_quantity(line.quantity)
                allocate_stock(line.variant, line.quantity)
            except InsufficientStock:
                allocate_stock(line.variant, line.variant.quantity_available)
                oversold_items.append(str(line))
        if oversold_items:
            task.events.create(
                type=TaskEvents.OVERSOLD_ITEMS.value,
                user=info.context.user,
                parameters={'oversold_items': oversold_items})
        task.events.create(
            type=TaskEvents.PLACED_FROM_DRAFT.value,
            user=info.context.user)
        return DraftTaskComplete(task=task)


class DraftTaskLinesCreate(BaseMutation):
    task = graphene.Field(
        graphene.NonNull(Task), description='A related draft task.')
    task_lines = graphene.List(
        graphene.NonNull(TaskLine),
        description='List of newly added task lines.', required=True)

    class Arguments:
        id = graphene.ID(
            required=True,
            description='ID of the draft task to add the lines to.')
        input = graphene.List(
            TaskLineCreateInput, required=True,
            description=dedent("""Fields required to add task lines."""))

    class Meta:
        description = 'Create task lines for a draft task.'

    @classmethod
    @permission_required('task.manage_orders')
    def mutate(cls, root, info, id, input):
        errors = []
        task = cls.get_node_or_error(info, id, errors, 'id', Task)
        if not task:
            return DraftTaskLinesCreate(errors=errors)
        if task.status != TaskStatus.DRAFT:
            cls.add_error(
                errors, 'task_id', 'Only draft tasks can be edited.')

        lines = []
        for input_line in input:
            variant_id = input_line['variant_id']
            variant = cls.get_node_or_error(
                info, variant_id, errors, 'variant_id', SkillVariant)
            quantity = input_line['quantity']
            if quantity > 0:
                if variant:
                    line = add_variant_to_order(
                        task, variant, quantity, allow_overselling=True)
                    lines.append(line)
            else:
                cls.add_error(
                    errors, 'quantity',
                    'Ensure this value is greater than or equal to 1.')

        recalculate_order(task)
        return DraftTaskLinesCreate(
            task=task, task_lines=lines, errors=errors)


class DraftTaskLineDelete(BaseMutation):
    task = graphene.Field(Task, description='A related draft task.')
    task_line = graphene.Field(
        TaskLine, description='An task line that was deleted.')

    class Arguments:
        id = graphene.ID(
            description='ID of the task line to delete.', required=True)

    class Meta:
        description = 'Deletes an task line from a draft task.'

    @classmethod
    @permission_required('task.manage_orders')
    def mutate(cls, root, info, id):
        errors = []
        line = cls.get_node_or_error(info, id, errors, 'id', TaskLine)
        if not line:
            return DraftTaskLineDelete(errors=errors)

        task = line.task
        if task.status != TaskStatus.DRAFT:
            cls.add_error(
                errors, 'id', 'Only draft tasks can be edited.')
        if not errors:
            db_id = line.id
            delete_task_line(line)
            line.id = db_id
            recalculate_order(task)
        return DraftTaskLineDelete(
            errors=errors, task=task, task_line=line)


class DraftTaskLineUpdate(ModelMutation):
    task = graphene.Field(Task, description='A related draft task.')

    class Arguments:
        id = graphene.ID(
            description='ID of the task line to update.', required=True)
        input = TaskLineInput(
            required=True,
            description='Fields required to update an task line')

    class Meta:
        description = 'Updates an task line of a draft task.'
        model = models.TaskLine

    @classmethod
    def user_is_allowed(cls, user, input):
        return user.has_perm('task.manage_orders')

    @classmethod
    def clean_input(cls, info, instance, input, errors):
        cleaned_input = super().clean_input(info, instance, input, errors)
        if instance.task.status != TaskStatus.DRAFT:
            cls.add_error(
                errors, 'id', 'Only draft tasks can be edited.')

        quantity = input['quantity']
        if quantity <= 0:
            cls.add_error(
                errors, 'quantity',
                'Ensure this value is greater than or equal to 1.')

        return cleaned_input

    @classmethod
    def save(cls, info, instance, cleaned_input):
        change_task_line_quantity(instance, instance.quantity)
        recalculate_order(instance.task)

    @classmethod
    def success_response(cls, instance):
        response = super().success_response(instance)
        response.task = instance.task
        return response
