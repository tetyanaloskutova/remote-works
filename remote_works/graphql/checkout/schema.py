import graphene
from graphene_django.fields import DjangoConnectionField
from graphql_jwt.decorators import permission_required

from ..core.fields import PrefetchingConnectionField
from ..payment.mutations import CheckoutPaymentCreate
from .mutations import (
    CheckoutBillingAddressUpdate, CheckoutComplete, CheckoutCreate,
    CheckoutCustomerAttach, CheckoutCustomerDetach, CheckoutEmailUpdate,
    CheckoutLineDelete, CheckoutLinesAdd, CheckoutLinesUpdate,
    CheckoutDeliveryAddressUpdate, CheckoutDeliveryMethodUpdate,
    CheckoutUpdateVoucher)
from .resolvers import (
    resolve_checkout, resolve_checkout_lines, resolve_checkouts)
from .types import Checkout, CheckoutLine


class CheckoutQueries(graphene.ObjectType):
    checkout = graphene.Field(
        Checkout, description='Single checkout.',
        token=graphene.Argument(graphene.UUID))
    # FIXME we could optimize the below field
    checkouts = DjangoConnectionField(
        Checkout, description='List of checkouts.')
    checkout_line = graphene.Field(
        CheckoutLine, id=graphene.Argument(graphene.ID),
        description='Single checkout line.')
    checkout_lines = PrefetchingConnectionField(
        CheckoutLine, description='List of checkout lines')

    def resolve_checkout(self, info, token):
        return resolve_checkout(info, token)

    @permission_required('task.manage_orders')
    def resolve_checkouts(self, info, query=None, **kwargs):
        resolve_checkouts(info, query)

    def resolve_checkout_line(self, info, id):
        return graphene.Node.get_node_from_global_id(info, id, CheckoutLine)

    @permission_required('task.manage_orders')
    def resolve_checkout_lines(self, info, query=None, **kwargs):
        return resolve_checkout_lines(info, query)


class CheckoutMutations(graphene.ObjectType):
    checkout_billing_address_update = CheckoutBillingAddressUpdate.Field()
    checkout_complete = CheckoutComplete.Field()
    checkout_create = CheckoutCreate.Field()
    checkout_customer_attach = CheckoutCustomerAttach.Field()
    checkout_customer_detach = CheckoutCustomerDetach.Field()
    checkout_email_update = CheckoutEmailUpdate.Field()
    checkout_line_delete = CheckoutLineDelete.Field()
    checkout_lines_add = CheckoutLinesAdd.Field()
    checkout_lines_update = CheckoutLinesUpdate.Field()
    checkout_payment_create = CheckoutPaymentCreate.Field()
    checkout_delivery_address_update = CheckoutDeliveryAddressUpdate.Field()
    checkout_delivery_method_update = CheckoutDeliveryMethodUpdate.Field()
    checkout_update_voucher = CheckoutUpdateVoucher.Field()
