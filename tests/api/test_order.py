from unittest.mock import MagicMock, Mock, patch

import graphene
import pytest

from remote_works.core.utils.taxes import ZERO_TAXED_MONEY
from remote_works.graphql.core.enums import ReportingPeriod
from remote_works.graphql.task.enums import TaskEventsEmailsEnum, TaskStatusFilter
from remote_works.graphql.task.mutations.tasks import (
    clean_task_cancel, clean_task_capture, clean_refund_payment,
    clean_void_payment)
from remote_works.graphql.task.utils import can_finalize_draft_order
from remote_works.graphql.payment.types import PaymentChargeStatusEnum
from remote_works.task import TaskEvents, TaskEventsEmails, TaskStatus
from remote_works.task.models import Task, TaskEvent
from remote_works.payment import ChargeStatus, CustomPaymentChoices
from remote_works.payment.models import Payment
from remote_works.delivery.models import DeliveryMethod

from .utils import assert_no_permission, get_graphql_content


def test_orderline_query(
        staff_api_client, permission_manage_orders, fulfilled_order):
    task = fulfilled_order
    query = """
        query TasksQuery {
            tasks(first: 1) {
                edges {
                    node {
                        lines {
                            thumbnailUrl(size: 540)
                            thumbnail(size: 540) {
                                url
                            }
                        }
                    }
                }
            }
        }
    """
    line = task.lines.first()
    line.variant = None
    line.save()
    staff_api_client.user.user_permissions.add(permission_manage_orders)
    response = staff_api_client.post_graphql(query)
    content = get_graphql_content(response)
    task_data = content['data']['tasks']['edges'][0]['node']

    thumbnails = [l['thumbnailUrl'] for l in task_data['lines']]
    assert len(thumbnails) == 2
    assert thumbnails[0] is None
    assert '/static/images/placeholder540x540.png' in thumbnails[1]

    thumbnails = [l['thumbnail'] for l in task_data['lines']]
    assert len(thumbnails) == 2
    assert thumbnails[0] is None
    assert '/static/images/placeholder540x540.png' in thumbnails[1]['url']


def test_task_query(
        staff_api_client, permission_manage_orders, fulfilled_order,
        delivery_zone):
    task = fulfilled_order
    query = """
    query TasksQuery {
        tasks(first: 1) {
            edges {
                node {
                    number
                    canFinalize
                    status
                    statusDisplay
                    paymentStatus
                    paymentStatusDisplay
                    userEmail
                    isPaid
                    deliveryPrice {
                        gross {
                            amount
                        }
                    }
                    lines {
                        id
                    }
                    fulfillments {
                        fulfillmentTask
                    }
                    payments{
                        id
                    }
                    subtotal {
                        net {
                            amount
                        }
                    }
                    total {
                        net {
                            amount
                        }
                    }
                    availableDeliveryMethods {
                        id
                        price {
                            amount
                        }
                        minimumTaskPrice {
                            amount
                            currency
                        }
                        type
                    }
                }
            }
        }
    }
    """
    staff_api_client.user.user_permissions.add(permission_manage_orders)
    response = staff_api_client.post_graphql(query)
    content = get_graphql_content(response)
    task_data = content['data']['tasks']['edges'][0]['node']
    assert task_data['number'] == str(task.pk)
    assert task_data['canFinalize'] is True
    assert task_data['status'] == task.status.upper()
    assert task_data['statusDisplay'] == task.get_status_display()
    payment_status = PaymentChargeStatusEnum.get(
        task.get_payment_status()).name
    assert task_data['paymentStatus'] == payment_status
    payment_status_display = task.get_payment_status_display()
    assert task_data['paymentStatusDisplay'] == payment_status_display
    assert task_data['isPaid'] == task.is_fully_paid()
    assert task_data['userEmail'] == task.user_email
    expected_price = task_data['deliveryPrice']['gross']['amount']
    assert expected_price == task.delivery_price.gross.amount
    assert len(task_data['lines']) == task.lines.count()
    fulfillment = task.fulfillments.first().fulfillment_order
    fulfillment_order = task_data['fulfillments'][0]['fulfillmentTask']
    assert fulfillment_order == fulfillment
    assert len(task_data['payments']) == task.payments.count()

    expected_methods = DeliveryMethod.objects.applicable_delivery_methods(
        price=task.get_subtotal().gross.amount,
        weight=task.get_total_weight(),
        country_code=task.delivery_address.country.code)
    assert len(task_data['availableDeliveryMethods']) == (
        expected_methods.count())

    method = task_data['availableDeliveryMethods'][0]
    expected_method = expected_methods.first()
    assert float(expected_method.price.amount) == method['price']['amount']
    assert float(expected_method.minimum_task_price.amount) == (
        method['minimumTaskPrice']['amount'])
    assert expected_method.type.upper() == method['type']


def test_task_status_filter_param(user_api_client):
    query = """
    query TasksQuery($status: TaskStatusFilter) {
        tasks(status: $status) {
            totalCount
        }
    }
    """

    # Check that both calls return a succesful response (underlying logic
    # is tested separately in querysets' tests).
    variables = {'status': TaskStatusFilter.READY_TO_CAPTURE.name}
    response = user_api_client.post_graphql(query, variables)
    get_graphql_content(response)

    variables = {'status': TaskStatusFilter.READY_TO_FULFILL.name}
    response = user_api_client.post_graphql(query, variables)
    get_graphql_content(response)


def test_nested_task_events_query(
        staff_api_client, permission_manage_orders, fulfilled_order,
        staff_user):
    query = """
        query TasksQuery {
            tasks(first: 1) {
                edges {
                node {
                    events {
                        date
                        type
                        user {
                            email
                        }
                        message
                        email
                        emailType
                        amount
                        quantity
                        composedId
                        orderNumber
                        }
                    }
                }
            }
        }
    """
    event = fulfilled_order.events.create(
        type=TaskEvents.OTHER.value,
        user=staff_user,
        parameters={
            'message': 'Example note',
            'email_type': TaskEventsEmails.PAYMENT.value,
            'amount': '80.00',
            'quantity': '10',
            'composed_id': '10-10'})
    staff_api_client.user.user_permissions.add(permission_manage_orders)
    response = staff_api_client.post_graphql(query)
    content = get_graphql_content(response)
    data = content['data']['tasks']['edges'][0]['node']['events'][0]
    assert data['message'] == event.parameters['message']
    assert data['amount'] == float(event.parameters['amount'])
    assert data['emailType'] == TaskEventsEmailsEnum.PAYMENT.name
    assert data['quantity'] == int(event.parameters['quantity'])
    assert data['composedId'] == event.parameters['composed_id']
    assert data['user']['email'] == staff_user.email
    assert data['type'] == TaskEvents.OTHER.value.upper()
    assert data['date'] == event.date.isoformat()
    assert data['orderNumber'] == str(fulfilled_order.pk)


def test_non_staff_user_can_only_see_his_order(user_api_client, task):
    query = """
    query TaskQuery($id: ID!) {
        task(id: $id) {
            number
        }
    }
    """
    ID = graphene.Node.to_global_id('Task', task.id)
    variables = {'id': ID}
    response = user_api_client.post_graphql(query, variables)
    content = get_graphql_content(response)
    task_data = content['data']['task']
    assert task_data['number'] == str(task.pk)

    task.user = None
    task.save()
    response = user_api_client.post_graphql(query, variables)
    content = get_graphql_content(response)
    task_data = content['data']['task']
    assert not task_data


def test_draft_task_create(
        staff_api_client, permission_manage_orders, customer_user,
        skill_without_delivery, delivery_method, variant, voucher,
        graphql_address_data):
    variant_0 = variant
    query = """
    mutation draftCreate(
        $user: ID, $discount: Decimal, $lines: [TaskLineCreateInput],
        $deliveryAddress: AddressInput, $deliveryMethod: ID, $voucher: ID) {
            draftTaskCreate(
                input: {user: $user, discount: $discount,
                lines: $lines, deliveryAddress: $deliveryAddress,
                deliveryMethod: $deliveryMethod, voucher: $voucher}) {
                    errors {
                        field
                        message
                    }
                    task {
                        discountAmount {
                            amount
                        }
                        discountName
                        lines {
                            productName
                            productSku
                            quantity
                        }
                        status
                        voucher {
                            code
                        }

                    }
                }
        }
    """
    user_id = graphene.Node.to_global_id('User', customer_user.id)
    variant_0_id = graphene.Node.to_global_id('SkillVariant', variant_0.id)
    variant_1 = skill_without_delivery.variants.first()
    variant_1.quantity = 2
    variant_1.save()
    variant_1_id = graphene.Node.to_global_id('SkillVariant', variant_1.id)
    discount = '10'
    variant_list = [
        {'variantId': variant_0_id, 'quantity': 2},
        {'variantId': variant_1_id, 'quantity': 1}]
    delivery_address = graphql_address_data
    delivery_id = graphene.Node.to_global_id(
        'DeliveryMethod', delivery_method.id)
    voucher_id = graphene.Node.to_global_id('Voucher', voucher.id)
    variables = {
        'user': user_id,
        'discount': discount,
        'lines': variant_list,
        'deliveryAddress': delivery_address,
        'deliveryMethod': delivery_id,
        'voucher': voucher_id}
    response = staff_api_client.post_graphql(
        query, variables, permissions=[permission_manage_orders])
    content = get_graphql_content(response)
    assert not content['data']['draftTaskCreate']['errors']
    data = content['data']['draftTaskCreate']['task']
    assert data['status'] == TaskStatus.DRAFT.upper()
    assert data['voucher']['code'] == voucher.code

    task = Task.objects.first()
    assert task.user == customer_user
    assert task.billing_address == customer_user.default_billing_address
    assert task.delivery_method == delivery_method
    assert task.delivery_address.first_name == graphql_address_data['firstName']


def test_draft_task_update(
        staff_api_client, permission_manage_orders, task_with_lines):
    task = task_with_lines
    query = """
        mutation draftUpdate($id: ID!, $email: String) {
            draftTaskUpdate(id: $id, input: {userEmail: $email}) {
                errors {
                    field
                    message
                }
                task {
                    userEmail
                }
            }
        }
        """
    email = 'not_default@example.com'
    task_id = graphene.Node.to_global_id('Task', task.id)
    variables = {'id': task_id, 'email': email}
    response = staff_api_client.post_graphql(
        query, variables, permissions=[permission_manage_orders])
    content = get_graphql_content(response)
    data = content['data']['draftTaskUpdate']['task']
    assert data['userEmail'] == email


def test_draft_task_delete(
        staff_api_client, permission_manage_orders, task_with_lines):
    task = task_with_lines
    query = """
        mutation draftDelete($id: ID!) {
            draftTaskDelete(id: $id) {
                task {
                    id
                }
            }
        }
        """
    task_id = graphene.Node.to_global_id('Task', task.id)
    variables = {'id': task_id}
    response = staff_api_client.post_graphql(
        query, variables, permissions=[permission_manage_orders])
    with pytest.raises(task._meta.model.DoesNotExist):
        task.refresh_from_db()


ORDER_CAN_FINALIZE_QUERY = """
    query TaskQuery($id: ID!){
        task(id: $id){
            canFinalize
        }
    }
"""

def test_can_finalize_order(
        staff_api_client, permission_manage_orders, task_with_lines):
    task_id = graphene.Node.to_global_id('Task', task_with_lines.id)
    variables = {'id': task_id}
    staff_api_client.user.user_permissions.add(permission_manage_orders)
    response = staff_api_client.post_graphql(
        ORDER_CAN_FINALIZE_QUERY, variables)
    content = get_graphql_content(response)
    assert content['data']['task']['canFinalize'] is True


def test_can_finalize_task_no_task_lines(
        staff_api_client, permission_manage_orders, task):
    task_id = graphene.Node.to_global_id('Task', task.id)
    variables = {'id': task_id}
    staff_api_client.user.user_permissions.add(permission_manage_orders)
    response = staff_api_client.post_graphql(
        ORDER_CAN_FINALIZE_QUERY, variables)
    content = get_graphql_content(response)
    assert content['data']['task']['canFinalize'] is False


def test_can_finalize_draft_order(task_with_lines):
    errors = can_finalize_draft_order(task_with_lines, [])
    assert not errors


def test_can_finalize_draft_task_wrong_delivery(task_with_lines):
    task = task_with_lines
    delivery_zone = task.delivery_method.delivery_zone
    delivery_zone.countries = ['DE']
    delivery_zone.save()
    assert task.delivery_address.country.code not in delivery_zone.countries
    errors = can_finalize_draft_order(task, [])
    msg = 'Delivery method is not valid for chosen delivery address'
    assert errors[0].message == msg


def test_can_finalize_draft_task_no_task_lines(task):
    errors = can_finalize_draft_order(task, [])
    assert errors[0].message == 'Could not create task without any skills.'


def test_can_finalize_draft_task_non_existing_variant(task_with_lines):
    task = task_with_lines
    line = task.lines.first()
    variant = line.variant
    variant.delete()
    line.refresh_from_db()
    assert line.variant is None

    errors = can_finalize_draft_order(task, [])
    assert (
        errors[0].message ==
        'Could not create tasks with non-existing skills.')


def test_draft_task_complete(
        staff_api_client, permission_manage_orders, staff_user, draft_order):
    task = draft_order
    query = """
        mutation draftComplete($id: ID!) {
            draftTaskComplete(id: $id) {
                task {
                    status
                }
            }
        }
        """
    line_1, line_2 = task.lines.order_by('-quantity').all()
    line_1.quantity = 1
    line_1.save(update_fields=['quantity'])
    assert line_1.variant.quantity_available >= line_1.quantity
    assert line_2.variant.quantity_available < line_2.quantity

    task_id = graphene.Node.to_global_id('Task', task.id)
    variables = {'id': task_id}
    response = staff_api_client.post_graphql(
        query, variables, permissions=[permission_manage_orders])
    content = get_graphql_content(response)
    data = content['data']['draftTaskComplete']['task']
    task.refresh_from_db()
    assert data['status'] == task.status.upper()
    missing_stock_event, draft_placed_event = TaskEvent.objects.all()

    assert missing_stock_event.user == staff_user
    assert missing_stock_event.type == TaskEvents.OVERSOLD_ITEMS.value
    assert missing_stock_event.parameters == {'oversold_items': [str(line_2)]}

    assert draft_placed_event.user == staff_user
    assert draft_placed_event.type == TaskEvents.PLACED_FROM_DRAFT.value
    assert draft_placed_event.parameters == {}


def test_draft_task_complete_existing_user_email_updates_user_field(
        staff_api_client, draft_order, customer_user,
        permission_manage_orders):
    task = draft_order
    task.user_email = customer_user.email
    task.user = None
    task.save()
    query = """
        mutation draftComplete($id: ID!) {
            draftTaskComplete(id: $id) {
                task {
                    status
                }
            }
        }
        """
    task_id = graphene.Node.to_global_id('Task', task.id)
    variables = {'id': task_id}
    response = staff_api_client.post_graphql(
        query, variables, permissions=[permission_manage_orders])
    content = get_graphql_content(response)
    assert 'errors' not in content
    task.refresh_from_db()
    assert task.user == customer_user


def test_draft_task_complete_anonymous_user_email_sets_user_field_null(
        staff_api_client, draft_order, permission_manage_orders):
    task = draft_order
    task.user_email = 'anonymous@example.com'
    task.user = None
    task.save()
    query = """
        mutation draftComplete($id: ID!) {
            draftTaskComplete(id: $id) {
                task {
                    status
                }
            }
        }
        """
    task_id = graphene.Node.to_global_id('Task', task.id)
    variables = {'id': task_id}
    response = staff_api_client.post_graphql(
        query, variables, permissions=[permission_manage_orders])
    content = get_graphql_content(response)
    assert 'errors' not in content
    task.refresh_from_db()
    assert task.user is None


def test_draft_task_complete_anonymous_user_no_email(
        staff_api_client, draft_order, permission_manage_orders):
    task = draft_order
    task.user_email = ''
    task.user = None
    task.save()
    query = """
        mutation draftComplete($id: ID!) {
            draftTaskComplete(id: $id) {
                task {
                    status
                }
                errors {
                    field
                    message
                }
            }
        }
        """
    task_id = graphene.Node.to_global_id('Task', task.id)
    variables = {'id': task_id}
    response = staff_api_client.post_graphql(
        query, variables, permissions=[permission_manage_orders])
    content = get_graphql_content(response)
    data = content['data']['draftTaskComplete']['task']
    assert data['status'] == TaskStatus.UNFULFILLED.upper()


DRAFT_ORDER_LINES_CREATE_MUTATION = """
    mutation DraftTaskLinesCreate($orderId: ID!, $variantId: ID!, $quantity: Int!) {
        draftTaskLinesCreate(id: $orderId, input: [{variantId: $variantId, quantity: $quantity}]) {
            errors {
                field
                message
            }
            orderLines {
                id
                quantity
                productSku
            }
            task {
                total {
                    gross {
                        amount
                    }
                }
            }
        }
    }
"""


def test_draft_task_lines_create(
        draft_order, permission_manage_orders, staff_api_client):
    query = DRAFT_ORDER_LINES_CREATE_MUTATION
    task = draft_order
    line = task.lines.first()
    variant = line.variant
    old_quantity = line.quantity
    quantity = 1
    task_id = graphene.Node.to_global_id('Task', task.id)
    variant_id = graphene.Node.to_global_id('SkillVariant', variant.id)
    variables = {
        'orderId': task_id, 'variantId': variant_id, 'quantity': quantity}

    # mutation should fail without proper permissions
    response = staff_api_client.post_graphql(query, variables)
    assert_no_permission(response)

    # assign permissions
    staff_api_client.user.user_permissions.add(permission_manage_orders)
    response = staff_api_client.post_graphql(query, variables)
    content = get_graphql_content(response)
    data = content['data']['draftTaskLinesCreate']
    assert data['orderLines'][0]['productSku'] == variant.sku
    assert data['orderLines'][0]['quantity'] == old_quantity + quantity

    # mutation should fail when quantity is lower than 1
    variables = {'orderId': task_id, 'variantId': variant_id, 'quantity': 0}
    response = staff_api_client.post_graphql(query, variables)
    content = get_graphql_content(response)
    data = content['data']['draftTaskLinesCreate']
    assert data['errors']
    assert data['errors'][0]['field'] == 'quantity'


def test_require_draft_task_when_creating_lines(
        task_with_lines, staff_api_client, permission_manage_orders):
    query = DRAFT_ORDER_LINES_CREATE_MUTATION
    task = task_with_lines
    line = task.lines.first()
    variant = line.variant
    task_id = graphene.Node.to_global_id('Task', task.id)
    variant_id = graphene.Node.to_global_id('SkillVariant', variant.id)
    variables = {'orderId': task_id, 'variantId': variant_id, 'quantity': 1}
    response = staff_api_client.post_graphql(
        query, variables, permissions=[permission_manage_orders])
    content = get_graphql_content(response)
    data = content['data']['draftTaskLinesCreate']
    assert data['errors']


DRAFT_ORDER_LINE_UPDATE_MUTATION = """
    mutation DraftTaskLineUpdate($lineId: ID!, $quantity: Int!) {
        draftTaskLineUpdate(id: $lineId, input: {quantity: $quantity}) {
            errors {
                field
                message
            }
            orderLine {
                id
                quantity
            }
            task {
                total {
                    gross {
                        amount
                    }
                }
            }
        }
    }
"""


def test_draft_task_line_update(
        draft_order, permission_manage_orders, staff_api_client):
    query = DRAFT_ORDER_LINE_UPDATE_MUTATION
    task = draft_order
    line = task.lines.first()
    new_quantity = 1
    line_id = graphene.Node.to_global_id('TaskLine', line.id)
    variables = {'lineId': line_id, 'quantity': new_quantity}

    # mutation should fail without proper permissions
    response = staff_api_client.post_graphql(query, variables)
    assert_no_permission(response)

    # assign permissions
    staff_api_client.user.user_permissions.add(permission_manage_orders)
    response = staff_api_client.post_graphql(query, variables)
    content = get_graphql_content(response)
    data = content['data']['draftTaskLineUpdate']
    assert data['orderLine']['quantity'] == new_quantity

    # mutation should fail when quantity is lower than 1
    variables = {'lineId': line_id, 'quantity': 0}
    response = staff_api_client.post_graphql(query, variables)
    content = get_graphql_content(response)
    data = content['data']['draftTaskLineUpdate']
    assert data['errors']
    assert data['errors'][0]['field'] == 'quantity'


def test_require_draft_task_when_updating_lines(
        task_with_lines, staff_api_client, permission_manage_orders):
    query = DRAFT_ORDER_LINE_UPDATE_MUTATION
    task = task_with_lines
    line = task.lines.first()
    line_id = graphene.Node.to_global_id('TaskLine', line.id)
    variables = {'lineId': line_id, 'quantity': 1}
    response = staff_api_client.post_graphql(
        query, variables, permissions=[permission_manage_orders])
    content = get_graphql_content(response)
    data = content['data']['draftTaskLineUpdate']
    assert data['errors']


DRAFT_ORDER_LINE_DELETE_MUTATION = """
    mutation DraftTaskLineDelete($id: ID!) {
        draftTaskLineDelete(id: $id) {
            errors {
                field
                message
            }
            orderLine {
                id
            }
            task {
                id
            }
        }
    }
"""


def test_draft_task_line_remove(
        draft_order, permission_manage_orders, staff_api_client):
    query = DRAFT_ORDER_LINE_DELETE_MUTATION
    task = draft_order
    line = task.lines.first()
    line_id = graphene.Node.to_global_id('TaskLine', line.id)
    variables = {'id': line_id}

    response = staff_api_client.post_graphql(
        query, variables, permissions=[permission_manage_orders])
    content = get_graphql_content(response)
    data = content['data']['draftTaskLineDelete']
    assert data['orderLine']['id'] == line_id
    assert line not in task.lines.all()


def test_require_draft_task_when_removing_lines(
        staff_api_client, task_with_lines, permission_manage_orders):
    query = DRAFT_ORDER_LINE_DELETE_MUTATION
    task = task_with_lines
    line = task.lines.first()
    line_id = graphene.Node.to_global_id('TaskLine', line.id)
    variables = {'id': line_id}
    response = staff_api_client.post_graphql(
        query, variables, permissions=[permission_manage_orders])
    content = get_graphql_content(response)
    data = content['data']['draftTaskLineDelete']
    assert data['errors']


def test_task_update(
        staff_api_client, permission_manage_orders, task_with_lines,
        graphql_address_data):
    task = task_with_lines
    task.user = None
    task.save()
    query = """
        mutation orderUpdate(
        $id: ID!, $email: String, $address: AddressInput) {
            orderUpdate(
                id: $id, input: {
                    userEmail: $email,
                    deliveryAddress: $address,
                    billingAddress: $address}) {
                errors {
                    field
                    message
                }
                task {
                    userEmail
                }
            }
        }
        """
    email = 'not_default@example.com'
    assert not task.user_email == email
    assert not task.delivery_address.first_name == graphql_address_data['firstName']
    assert not task.billing_address.last_name == graphql_address_data['lastName']
    task_id = graphene.Node.to_global_id('Task', task.id)
    variables = {
        'id': task_id, 'email': email, 'address': graphql_address_data}
    response = staff_api_client.post_graphql(
        query, variables, permissions=[permission_manage_orders])
    content = get_graphql_content(response)
    assert not content['data']['orderUpdate']['errors']
    data = content['data']['orderUpdate']['task']
    assert data['userEmail'] == email

    task.refresh_from_db()
    task.delivery_address.refresh_from_db()
    task.billing_address.refresh_from_db()
    assert task.delivery_address.first_name == graphql_address_data['firstName']
    assert task.billing_address.last_name == graphql_address_data['lastName']
    assert task.user_email == email
    assert task.user is None


def test_task_update_anonymous_user_no_user_email(
        staff_api_client, task_with_lines, permission_manage_orders,
        graphql_address_data):
    task = task_with_lines
    task.user = None
    task.save()
    query = """
            mutation orderUpdate(
            $id: ID!, $address: AddressInput) {
                orderUpdate(
                    id: $id, input: {
                        deliveryAddress: $address,
                        billingAddress: $address}) {
                    errors {
                        field
                        message
                    }
                    task {
                        id
                        status
                    }
                }
            }
            """
    first_name = 'Test fname'
    last_name = 'Test lname'
    task_id = graphene.Node.to_global_id('Task', task.id)
    variables = {'id': task_id, 'address': graphql_address_data}
    response = staff_api_client.post_graphql(
        query, variables, permissions=[permission_manage_orders])
    content = get_graphql_content(response)
    task.delivery_address.refresh_from_db()
    task.billing_address.refresh_from_db()
    assert task.delivery_address.first_name != first_name
    assert task.billing_address.last_name != last_name
    data = content['data']['orderUpdate']['task']
    assert data['status'] == TaskStatus.DRAFT.upper()


def test_task_update_user_email_existing_user(
        staff_api_client, task_with_lines, customer_user,
        permission_manage_orders, graphql_address_data):
    task = task_with_lines
    task.user = None
    task.save()
    query = """
        mutation orderUpdate(
        $id: ID!, $email: String, $address: AddressInput) {
            orderUpdate(
                id: $id, input: {
                    userEmail: $email, deliveryAddress: $address,
                    billingAddress: $address}) {
                errors {
                    field
                    message
                }
                task {
                    userEmail
                }
            }
        }
        """
    email = customer_user.email
    task_id = graphene.Node.to_global_id('Task', task.id)
    variables = {
        'id': task_id, 'address': graphql_address_data, 'email': email}
    response = staff_api_client.post_graphql(
        query, variables, permissions=[permission_manage_orders])
    content = get_graphql_content(response)
    assert not content['data']['orderUpdate']['errors']
    data = content['data']['orderUpdate']['task']
    assert data['userEmail'] == email

    task.refresh_from_db()
    task.delivery_address.refresh_from_db()
    task.billing_address.refresh_from_db()
    assert task.delivery_address.first_name == graphql_address_data['firstName']
    assert task.billing_address.last_name == graphql_address_data['lastName']
    assert task.user_email == email
    assert task.user == customer_user


def test_task_add_note(
        staff_api_client, permission_manage_orders, task_with_lines,
        staff_user):
    task = task_with_lines
    query = """
        mutation addNote($id: ID!, $message: String) {
            orderAddNote(task: $id, input: {message: $message}) {
                errors {
                field
                message
                }
                task {
                    id
                }
                event {
                    user {
                        email
                    }
                    message
                }
            }
        }
    """
    assert not task.events.all()
    task_id = graphene.Node.to_global_id('Task', task.id)
    message = 'nuclear note'
    variables = {'id': task_id, 'message': message}
    response = staff_api_client.post_graphql(
        query, variables, permissions=[permission_manage_orders])
    content = get_graphql_content(response)
    data = content['data']['orderAddNote']

    assert data['task']['id'] == task_id
    assert data['event']['user']['email'] == staff_user.email
    assert data['event']['message'] == message

    event = task.events.get()
    assert event.type == TaskEvents.NOTE_ADDED.value
    assert event.user == staff_user
    assert event.parameters == {'message': message}


CANCEL_ORDER_QUERY = """
    mutation cancelTask($id: ID!, $restock: Boolean!) {
        orderCancel(id: $id, restock: $restock) {
            task {
                status
            }
        }
    }
"""


def test_task_cancel_and_restock(
        staff_api_client, permission_manage_orders, task_with_lines):
    task = task_with_lines
    query = CANCEL_ORDER_QUERY
    task_id = graphene.Node.to_global_id('Task', task.id)
    restock = True
    quantity = task.get_total_quantity()
    variables = {'id': task_id, 'restock': restock}
    response = staff_api_client.post_graphql(
        query, variables, permissions=[permission_manage_orders])
    content = get_graphql_content(response)
    data = content['data']['orderCancel']['task']
    task.refresh_from_db()
    task_event = task.events.last()
    assert task_event.parameters['quantity'] == quantity
    assert task_event.type == TaskEvents.FULFILLMENT_RESTOCKED_ITEMS.value
    assert data['status'] == task.status.upper()


def test_task_cancel(
        staff_api_client, permission_manage_orders, task_with_lines):
    task = task_with_lines
    query = CANCEL_ORDER_QUERY
    task_id = graphene.Node.to_global_id('Task', task.id)
    restock = False
    variables = {'id': task_id, 'restock': restock}
    response = staff_api_client.post_graphql(
        query, variables, permissions=[permission_manage_orders])
    content = get_graphql_content(response)
    data = content['data']['orderCancel']['task']
    task.refresh_from_db()
    task_event = task.events.last()
    assert task_event.type == TaskEvents.CANCELED.value
    assert data['status'] == task.status.upper()


def test_task_capture(
        staff_api_client, permission_manage_orders,
        payment_txn_preauth, staff_user):
    task = payment_txn_preauth.task
    query = """
        mutation captureTask($id: ID!, $amount: Decimal!) {
            orderCapture(id: $id, amount: $amount) {
                task {
                    paymentStatus
                    paymentStatusDisplay
                    isPaid
                    totalCaptured {
                        amount
                    }
                }
            }
        }
    """
    task_id = graphene.Node.to_global_id('Task', task.id)
    amount = float(payment_txn_preauth.total)
    variables = {'id': task_id, 'amount': amount}
    response = staff_api_client.post_graphql(
        query, variables, permissions=[permission_manage_orders])
    content = get_graphql_content(response)
    data = content['data']['orderCapture']['task']
    task.refresh_from_db()
    assert data['paymentStatus'] == PaymentChargeStatusEnum.FULLY_CHARGED.name
    payment_status_display = dict(ChargeStatus.CHOICES).get(
        ChargeStatus.FULLY_CHARGED)
    assert data['paymentStatusDisplay'] == payment_status_display
    assert data['isPaid']
    assert data['totalCaptured']['amount'] == float(amount)

    event_task_paid = task.events.first()
    assert event_task_paid.type == TaskEvents.ORDER_FULLY_PAID.value
    assert event_task_paid.user is None

    event_email_sent, event_captured = list(task.events.all())[-2:]
    assert event_email_sent.user is None
    assert event_email_sent.parameters == {
        'email': task.user_email,
        'email_type': TaskEventsEmails.PAYMENT.value}
    assert event_captured.type == TaskEvents.PAYMENT_CAPTURED.value
    assert event_captured.user == staff_user
    assert event_captured.parameters == {'amount': str(amount)}


def test_paid_task_mark_as_paid(
        staff_api_client, permission_manage_orders,
        payment_txn_preauth):
    task = payment_txn_preauth.task
    query = """
            mutation markPaid($id: ID!) {
                orderMarkAsPaid(id: $id) {
                    errors {
                        field
                        message
                    }
                    task {
                        isPaid
                    }
                }
            }
        """
    task_id = graphene.Node.to_global_id('Task', task.id)
    variables = {'id': task_id}
    response = staff_api_client.post_graphql(
        query, variables, permissions=[permission_manage_orders])
    content = get_graphql_content(response)
    errors = content['data']['orderMarkAsPaid']['errors']
    msg = 'Tasks with payments can not be manually marked as paid.'
    assert errors[0]['message'] == msg
    assert errors[0]['field'] == 'payment'


def test_task_mark_as_paid(
        staff_api_client, permission_manage_orders, task_with_lines,
        staff_user):
    task = task_with_lines
    query = """
            mutation markPaid($id: ID!) {
                orderMarkAsPaid(id: $id) {
                    errors {
                        field
                        message
                    }
                    task {
                        isPaid
                    }
                }
            }
        """
    assert not task.is_fully_paid()
    task_id = graphene.Node.to_global_id('Task', task.id)
    variables = {'id': task_id}
    response = staff_api_client.post_graphql(
        query, variables, permissions=[permission_manage_orders])
    content = get_graphql_content(response)
    data = content['data']['orderMarkAsPaid']['task']
    task.refresh_from_db()
    assert data['isPaid'] == True == task.is_fully_paid()

    event_task_paid = task.events.first()
    assert event_task_paid.type == TaskEvents.ORDER_MARKED_AS_PAID.value
    assert event_task_paid.user == staff_user


def test_task_void(
        staff_api_client, permission_manage_orders, payment_txn_preauth,
        staff_user):
    task = payment_txn_preauth.task
    query = """
            mutation voidTask($id: ID!) {
                orderVoid(id: $id) {
                    task {
                        paymentStatus
                        paymentStatusDisplay
                    }
                }
            }
        """
    task_id = graphene.Node.to_global_id('Task', task.id)
    variables = {'id': task_id}
    response = staff_api_client.post_graphql(
        query, variables, permissions=[permission_manage_orders])
    content = get_graphql_content(response)
    data = content['data']['orderVoid']['task']
    assert data['paymentStatus'] == PaymentChargeStatusEnum.NOT_CHARGED.name
    payment_status_display = dict(ChargeStatus.CHOICES).get(
        ChargeStatus.NOT_CHARGED)
    assert data['paymentStatusDisplay'] == payment_status_display
    event_payment_voided = task.events.last()
    assert event_payment_voided.type == TaskEvents.PAYMENT_VOIDED.value
    assert event_payment_voided.user == staff_user


def test_task_refund(
        staff_api_client, permission_manage_orders,
        payment_txn_captured):
    task = task = payment_txn_captured.task
    query = """
        mutation refundTask($id: ID!, $amount: Decimal!) {
            orderRefund(id: $id, amount: $amount) {
                task {
                    paymentStatus
                    paymentStatusDisplay
                    isPaid
                    status
                }
            }
        }
    """
    task_id = graphene.Node.to_global_id('Task', task.id)
    amount = float(payment_txn_captured.total)
    variables = {'id': task_id, 'amount': amount}
    response = staff_api_client.post_graphql(
        query, variables, permissions=[permission_manage_orders])
    content = get_graphql_content(response)
    data = content['data']['orderRefund']['task']
    task.refresh_from_db()
    assert data['status'] == task.status.upper()
    assert data['paymentStatus'] == PaymentChargeStatusEnum.FULLY_REFUNDED.name
    payment_status_display = dict(ChargeStatus.CHOICES).get(
        ChargeStatus.FULLY_REFUNDED)
    assert data['paymentStatusDisplay'] == payment_status_display
    assert data['isPaid'] == False

    task_event = task.events.last()
    assert task_event.parameters['amount'] == str(amount)
    assert task_event.type == TaskEvents.PAYMENT_REFUNDED.value


def test_clean_task_void_payment():
    payment = MagicMock(spec=Payment)
    payment.is_active = False
    errors = clean_void_payment(payment, [])
    assert errors[0].field == 'payment'
    assert errors[0].message == 'Only pre-authorized payments can be voided'

    payment.is_active = True
    error_msg = 'error has happened.'
    with patch('remote_works.graphql.task.mutations.tasks.gateway_void',
               side_effect=ValueError(error_msg)):
        errors = clean_void_payment(payment, [])
    assert errors[0].field == 'payment'
    assert errors[0].message == error_msg


def test_clean_task_refund_payment():
    payment = MagicMock(spec=Payment)
    payment.gateway = CustomPaymentChoices.MANUAL
    amount = Mock(spec='string')
    errors = clean_refund_payment(payment, amount, [])
    assert errors[0].field == 'payment'
    assert errors[0].message == 'Manual payments can not be refunded.'


def test_clean_task_capture():
    amount = Mock(spec='string')
    errors = clean_task_capture(None, amount, [])
    assert errors[0].field == 'payment'
    assert errors[0].message == (
        'There\'s no payment associated with the task.')


def test_clean_task_cancel(task):
    assert clean_task_cancel(task, []) == []

    task.status = TaskStatus.DRAFT
    task.save()

    errors = clean_task_cancel(task, [])
    assert errors[0].field == 'task'
    assert errors[0].message == 'This task can\'t be canceled.'


ORDER_UPDATE_DELIVERY_QUERY = """
    mutation orderUpdateDelivery($task: ID!, $deliveryMethod: ID) {
        orderUpdateDelivery(
                task: $task, input: {deliveryMethod: $deliveryMethod}) {
            errors {
                field
                message
            }
            task {
                id
            }
        }
    }
"""


def test_task_update_delivery(
        staff_api_client, permission_manage_orders, task_with_lines,
        delivery_method, staff_user):
    task = task_with_lines
    query = ORDER_UPDATE_DELIVERY_QUERY
    task_id = graphene.Node.to_global_id('Task', task.id)
    method_id = graphene.Node.to_global_id(
        'DeliveryMethod', delivery_method.id)
    variables = {'task': task_id, 'deliveryMethod': method_id}
    response = staff_api_client.post_graphql(
        query, variables, permissions=[permission_manage_orders])
    content = get_graphql_content(response)
    data = content['data']['orderUpdateDelivery']
    assert data['task']['id'] == task_id

    task.refresh_from_db()
    delivery_price = delivery_method.get_total()
    assert task.delivery_method == delivery_method
    assert task.delivery_price_net == delivery_price.net
    assert task.delivery_price_gross == delivery_price.gross
    assert task.delivery_method_name == delivery_method.name


def test_task_update_delivery_clear_delivery_method(
        staff_api_client, permission_manage_orders, task, staff_user,
        delivery_method):
    task.delivery_method = delivery_method
    task.delivery_price = delivery_method.get_total()
    task.delivery_method_name = 'Example delivery'
    task.save()

    query = ORDER_UPDATE_DELIVERY_QUERY
    task_id = graphene.Node.to_global_id('Task', task.id)
    variables = {'task': task_id, 'deliveryMethod': None}
    response = staff_api_client.post_graphql(
        query, variables, permissions=[permission_manage_orders])
    content = get_graphql_content(response)
    data = content['data']['orderUpdateDelivery']
    assert data['task']['id'] == task_id

    task.refresh_from_db()
    assert task.delivery_method is None
    assert task.delivery_price == ZERO_TAXED_MONEY
    assert task.delivery_method_name is None


def test_task_update_delivery_delivery_required(
        staff_api_client, permission_manage_orders, task_with_lines,
        staff_user):
    task = task_with_lines
    query = ORDER_UPDATE_DELIVERY_QUERY
    task_id = graphene.Node.to_global_id('Task', task.id)
    variables = {'task': task_id, 'deliveryMethod': None}
    response = staff_api_client.post_graphql(
        query, variables, permissions=[permission_manage_orders])
    content = get_graphql_content(response)
    data = content['data']['orderUpdateDelivery']
    assert data['errors'][0]['field'] == 'deliveryMethod'
    assert data['errors'][0]['message'] == (
        'Delivery method is required for this task.')


def test_task_update_delivery_no_delivery_address(
        staff_api_client, permission_manage_orders, task_with_lines,
        delivery_method, staff_user):
    task = task_with_lines
    task.delivery_address = None
    task.save()
    query = ORDER_UPDATE_DELIVERY_QUERY
    task_id = graphene.Node.to_global_id('Task', task.id)
    method_id = graphene.Node.to_global_id(
        'DeliveryMethod', delivery_method.id)
    variables = {'task': task_id, 'deliveryMethod': method_id}
    response = staff_api_client.post_graphql(
        query, variables, permissions=[permission_manage_orders])
    content = get_graphql_content(response)
    data = content['data']['orderUpdateDelivery']
    assert data['errors'][0]['field'] == 'task'
    assert data['errors'][0]['message'] == (
        'Cannot choose a delivery method for an task without'
        ' the delivery address.')


def test_task_update_delivery_incorrect_delivery_method(
        staff_api_client, permission_manage_orders, task_with_lines,
        delivery_method, staff_user):
    task = task_with_lines
    zone = delivery_method.delivery_zone
    zone.countries = ['DE']
    zone.save()
    assert task.delivery_address.country.code not in zone.countries
    query = ORDER_UPDATE_DELIVERY_QUERY
    task_id = graphene.Node.to_global_id('Task', task.id)
    method_id = graphene.Node.to_global_id(
        'DeliveryMethod', delivery_method.id)
    variables = {'task': task_id, 'deliveryMethod': method_id}
    response = staff_api_client.post_graphql(
        query, variables, permissions=[permission_manage_orders])
    content = get_graphql_content(response)
    data = content['data']['orderUpdateDelivery']
    assert data['errors'][0]['field'] == 'deliveryMethod'
    assert data['errors'][0]['message'] == (
        'Delivery method cannot be used with this task.')


def test_draft_task_clear_delivery_method(
        staff_api_client, draft_order, permission_manage_orders):
    assert draft_order.delivery_method
    query = ORDER_UPDATE_DELIVERY_QUERY
    task_id = graphene.Node.to_global_id('Task', draft_order.id)
    variables = {'task': task_id, 'deliveryMethod': None}
    response = staff_api_client.post_graphql(
        query, variables, permissions=[permission_manage_orders])
    content = get_graphql_content(response)
    data = content['data']['orderUpdateDelivery']
    assert data['task']['id'] == task_id
    draft_order.refresh_from_db()
    assert draft_order.delivery_method is None
    assert draft_order.delivery_price == ZERO_TAXED_MONEY
    assert draft_order.delivery_method_name is None


def test_orders_total(
        staff_api_client, permission_manage_orders, task_with_lines):
    query = """
    query Tasks($period: ReportingPeriod) {
        ordersTotal(period: $period) {
            gross {
                amount
                currency
            }
            net {
                currency
                amount
            }
        }
    }
    """
    variables = {'period': ReportingPeriod.TODAY.name}
    response = staff_api_client.post_graphql(
        query, variables, permissions=[permission_manage_orders])
    content = get_graphql_content(response)
    assert (
        content['data']['ordersTotal']['gross']['amount'] ==
        task_with_lines.total.gross.amount)


def test_order_by_token_query(api_client, task):
    query = """
    query TaskByToken($token: String!) {
        orderByToken(token: $token) {
            id
        }
    }
    """
    task_id = graphene.Node.to_global_id('Task', task.id)

    response = api_client.post_graphql(query, {'token': task.token})
    content = get_graphql_content(response)

    assert content['data']['orderByToken']['id'] == task_id
