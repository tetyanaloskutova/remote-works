import graphene
import graphene_django_optimizer as gql_optimizer
from graphene import relay

from ...task import models
from ...task.models import FulfillmentStatus
from ...skill.templatetags.skill_images import get_skill_image_thumbnail
from ..account.types import User
from ..core.connection import CountableDjangoObjectType
from ..core.types.money import Money, TaxedMoney
from ..payment.types import TaskAction, Payment, PaymentChargeStatusEnum
from ..skill.types import Image
from ..delivery.types import DeliveryMethod
from .enums import TaskEventsEmailsEnum, TaskEventsEnum
from .utils import applicable_delivery_methods, can_finalize_draft_order


class TaskEvent(CountableDjangoObjectType):
    date = graphene.types.datetime.DateTime(
        description='Date when event happened at in ISO 8601 format.')
    type = TaskEventsEnum(description='Task event type')
    user = graphene.Field(
        User, id=graphene.Argument(graphene.ID),
        description='User who performed the action.')
    message = graphene.String(
        description='Content of a note added to the task.')
    email = graphene.String(description='Email of the customer')
    email_type = TaskEventsEmailsEnum(
        description='Type of an email sent to the customer')
    amount = graphene.Float(description='Amount of money.')
    quantity = graphene.Int(description='Number of items.')
    composed_id = graphene.String(
        description='Composed id of the Fulfillment.')
    order_number = graphene.String(
        description='User-friendly number of an task.')
    oversold_items = graphene.List(
        graphene.String, description='List of oversold lines names.')

    class Meta:
        description = 'History log of the task.'
        model = models.TaskEvent
        interfaces = [relay.Node]
        exclude_fields = ['task', 'parameters']

    def resolve_email(self, info):
        return self.parameters.get('email', None)

    def resolve_email_type(self, info):
        return self.parameters.get('email_type', None)

    def resolve_amount(self, info):
        amount = self.parameters.get('amount', None)
        return float(amount) if amount else None

    def resolve_quantity(self, info):
        quantity = self.parameters.get('quantity', None)
        return int(quantity) if quantity else None

    def resolve_message(self, info):
        return self.parameters.get('message', None)

    def resolve_composed_id(self, info):
        return self.parameters.get('composed_id', None)

    def resolve_oversold_items(self, info):
        return self.parameters.get('oversold_items', None)

    def resolve_order_number(self, info):
        return self.order_id


class FulfillmentLine(CountableDjangoObjectType):
    order_line = graphene.Field(lambda: TaskLine)

    class Meta:
        description = 'Represents line of the fulfillment.'
        interfaces = [relay.Node]
        model = models.FulfillmentLine
        exclude_fields = ['fulfillment']

    @gql_optimizer.resolver_hints(prefetch_related='order_line')
    def resolve_order_line(self, info):
        return self.order_line


class Fulfillment(CountableDjangoObjectType):
    lines = gql_optimizer.field(
        graphene.List(
            FulfillmentLine,
            description='List of lines for the fulfillment'),
        model_field='lines')
    status_display = graphene.String(
        description='User-friendly fulfillment status.')

    class Meta:
        description = 'Represents task fulfillment.'
        interfaces = [relay.Node]
        model = models.Fulfillment
        exclude_fields = ['task']

    def resolve_lines(self, info):
        return self.lines.all()

    def resolve_status_display(self, info):
        return self.get_status_display()


class TaskLine(CountableDjangoObjectType):
    thumbnail_url = graphene.String(
        description='The URL of a main thumbnail for the ordered skill.',
        size=graphene.Int(description='Size of the image'),
        deprecation_reason=(
            'thumbnailUrl is deprecated, use thumbnail instead'))
    thumbnail = graphene.Field(
        Image, description='The main thumbnail for the ordered skill.',
        size=graphene.Argument(graphene.Int, description='Size of thumbnail'))
    unit_price = graphene.Field(
        TaxedMoney, description='Price of the single item in the task line.')

    class Meta:
        description = 'Represents task line of particular task.'
        model = models.TaskLine
        interfaces = [relay.Node]
        exclude_fields = [
            'task', 'unit_price_gross', 'unit_price_net', 'variant']

    @gql_optimizer.resolver_hints(
        prefetch_related=['variant__images', 'variant__skill__images'])
    def resolve_thumbnail_url(self, info, size=None):
        if not self.variant_id:
            return None
        if not size:
            size = 255
        url = get_skill_image_thumbnail(
            self.variant.get_first_image(), size, method='thumbnail')
        return info.context.build_absolute_uri(url)

    @gql_optimizer.resolver_hints(
        prefetch_related=['variant__images', 'variant__skill__images'])
    def resolve_thumbnail(self, info, *, size=None):
        if not self.variant_id:
            return None
        if not size:
            size = 255
        image = self.variant.get_first_image()
        url = get_skill_image_thumbnail(image, size, method='thumbnail')
        alt = image.alt if image else None
        return Image(alt=alt, url=info.context.build_absolute_uri(url))

    @staticmethod
    def resolve_unit_price(self, info):
        return self.unit_price


class Task(CountableDjangoObjectType):
    fulfillments = gql_optimizer.field(
        graphene.List(
            Fulfillment, required=True,
            description='List of shipments for the task.'),
        model_field='fulfillments')
    lines = gql_optimizer.field(
        graphene.List(
            lambda: TaskLine, required=True,
            description='List of task lines.'),
        model_field='lines')
    actions = graphene.List(
        TaskAction, description='''List of actions that can be performed in
        the current state of an task.''', required=True)
    available_delivery_methods = graphene.List(
        DeliveryMethod, required=False,
        description='Delivery methods that can be used with this task.')
    number = graphene.String(description='User-friendly number of an task.')
    is_paid = graphene.Boolean(
        description='Informs if an task is fully paid.')
    payment_status = PaymentChargeStatusEnum(
        description='Internal payment status.')
    payment_status_display = graphene.String(
        description='User-friendly payment status.')
    payments = gql_optimizer.field(
        graphene.List(
            Payment, description='List of payments for the task'),
        model_field='payments')
    total = graphene.Field(
        TaxedMoney, description='Total amount of the task.')
    delivery_price = graphene.Field(
        TaxedMoney, description='Total price of delivery.')
    subtotal = graphene.Field(
        TaxedMoney,
        description='The sum of line prices not including delivery.')
    status_display = graphene.String(description='User-friendly task status.')
    can_finalize = graphene.Boolean(
        description=(
            'Informs whether a draft task can be finalized',
            '(turned into a regular task).'), required=True)
    total_authorized = graphene.Field(
        Money, description='Amount authorized for the task.')
    total_captured = graphene.Field(
        Money, description='Amount captured by payment.')
    events = gql_optimizer.field(
        graphene.List(
            TaskEvent,
            description='List of events associated with the task.'),
        model_field='events')
    total_balance = graphene.Field(
        Money,
        description='''The difference between the paid and the task total
        amount.''', required=True)
    user_email = graphene.String(
        required=False, description='Email address of the customer.')
    is_delivery_required = graphene.Boolean(
        description='Returns True, if task requires delivery.',
        required=True)
    lines = graphene.List(
        TaskLine, required=True,
        description='List of task lines for the task')

    class Meta:
        description = 'Represents an task in the shop.'
        interfaces = [relay.Node]
        model = models.Task
        exclude_fields = [
            'checkout_token', 'delivery_price_gross', 'delivery_price_net',
            'total_gross', 'total_net']

    @staticmethod
    def resolve_delivery_price(self, info):
        return self.delivery_price

    @gql_optimizer.resolver_hints(prefetch_related='payments__transactions')
    def resolve_actions(self, info):
        actions = []
        payment = self.get_last_payment()
        if self.can_capture(payment):
            actions.append(TaskAction.CAPTURE)
        if self.can_mark_as_paid():
            actions.append(TaskAction.MARK_AS_PAID)
        if self.can_refund(payment):
            actions.append(TaskAction.REFUND)
        if self.can_void(payment):
            actions.append(TaskAction.VOID)
        return actions

    @staticmethod
    def resolve_subtotal(self, info):
        return self.get_subtotal()

    @staticmethod
    def resolve_total(self, info):
        return self.total

    @staticmethod
    @gql_optimizer.resolver_hints(prefetch_related='payments__transactions')
    def resolve_total_authorized(self, info):
        # FIXME adjust to multiple payments in the future
        return self.total_authorized

    @staticmethod
    @gql_optimizer.resolver_hints(prefetch_related='payments')
    def resolve_total_captured(self, info):
        # FIXME adjust to multiple payments in the future
        return self.total_captured

    @staticmethod
    def resolve_total_balance(self, info):
        return self.total_balance

    @staticmethod
    def resolve_fulfillments(self, info):
        user = info.context.user
        if user.is_staff:
            qs = self.fulfillments.all()
        else:
            qs = self.fulfillments.exclude(status=FulfillmentStatus.CANCELED)
        return qs.order_by('pk')

    @staticmethod
    def resolve_lines(self, info):
        return self.lines.all().order_by('pk')

    @staticmethod
    def resolve_events(self, info):
        return self.events.all().order_by('pk')

    @staticmethod
    @gql_optimizer.resolver_hints(prefetch_related='payments')
    def resolve_is_paid(self, info):
        return self.is_fully_paid()

    @staticmethod
    def resolve_number(self, info):
        return str(self.pk)

    @staticmethod
    @gql_optimizer.resolver_hints(prefetch_related='payments')
    def resolve_payment_status(self, info):
        return self.get_payment_status()

    @staticmethod
    @gql_optimizer.resolver_hints(prefetch_related='payments')
    def resolve_payment_status_display(self, info):
        return self.get_payment_status_display()

    @staticmethod
    def resolve_payments(self, info):
        return self.payments.all()

    @staticmethod
    def resolve_status_display(self, info):
        return self.get_status_display()

    @staticmethod
    def resolve_can_finalize(self, info):
        errors = can_finalize_draft_order(self, [])
        return not errors

    @staticmethod
    def resolve_user_email(self, info):
        if self.user_email:
            return self.user_email
        if self.user_id:
            return self.user.email
        return None

    @staticmethod
    def resolve_available_delivery_methods(self, info):
        return applicable_delivery_methods(
            self, info, self.get_subtotal().gross.amount)

    def resolve_is_delivery_required(self, info):
        return self.is_delivery_required()
