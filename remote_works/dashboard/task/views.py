from django.conf import settings
from django.contrib import messages
from django.contrib.auth.decorators import permission_required
from django.db import transaction
from django.db.models import F, Q
from django.forms import modelformset_factory
from django.http import HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404, redirect
from django.template.context_processors import csrf
from django.template.response import TemplateResponse
from django.utils.translation import npgettext_lazy, pgettext_lazy
from django.views.decorators.http import require_POST
from django_prices.templatetags import prices_i18n

from ...core.exceptions import InsufficientStock
from ...core.utils import get_paginator_items
from ...core.utils.taxes import get_taxes_for_address
from ...task import TaskEvents, TaskEventsEmails, TaskStatus
from ...task.emails import (
    send_fulfillment_confirmation, send_fulfillment_update,
    send_task_confirmation)
from ...task.models import Fulfillment, FulfillmentLine, Task
from ...task.utils import update_task_prices, update_task_status
from ...delivery.models import DeliveryMethod
from ..views import staff_member_required
from .filters import TaskFilter
from .forms import (
    AddressForm, AddVariantToTaskForm, BaseFulfillmentLineFormSet,
    CancelFulfillmentForm, CancelTaskForm, CancelTaskLineForm,
    CapturePaymentForm, ChangeQuantityForm, CreateTaskFromDraftForm,
    FulfillmentForm, FulfillmentLineForm, FulfillmentTrackingNumberForm,
    TaskCustomerForm, TaskEditDiscountForm, TaskEditVoucherForm,
    TaskMarkAsPaidForm, TaskNoteForm, TaskRemoveCustomerForm,
    TaskRemoveDeliveryForm, TaskRemoveVoucherForm, TaskDeliveryForm,
    RefundPaymentForm, VoidPaymentForm)
from .utils import (
    create_invoice_pdf, create_packing_slip_pdf, get_statics_absolute_url,
    save_address_in_order)


@permission_required('task.manage_orders')
def task_list(request):
    tasks = Task.objects.prefetch_related('payments', 'lines', 'user')
    task_filter = TaskFilter(request.GET, queryset=tasks)
    tasks = get_paginator_items(
        task_filter.qs, settings.DASHBOARD_PAGINATE_BY,
        request.GET.get('page'))
    ctx = {
        'tasks': tasks, 'filter_set': task_filter,
        'is_empty': not task_filter.queryset.exists()}
    return TemplateResponse(request, 'dashboard/task/list.html', ctx)


@require_POST
@permission_required('task.manage_orders')
def task_create(request):
    display_gross_prices = request.site.settings.display_gross_prices
    task = Task.objects.create(
        status=TaskStatus.DRAFT, display_gross_prices=display_gross_prices)
    msg = pgettext_lazy(
        'Dashboard message related to an task',
        'Draft task created')
    messages.success(request, msg)
    return redirect('dashboard:task-details', task_pk=task.pk)


@permission_required('task.manage_orders')
def create_task_from_draft(request, task_pk):
    task = get_object_or_404(Task.objects.drafts(), pk=task_pk)
    status = 200
    form = CreateTaskFromDraftForm(request.POST or None, instance=task)
    if form.is_valid():
        form.save()
        msg = pgettext_lazy(
            'Dashboard message related to an task',
            'Task created from draft task')
        task.events.create(
            user=request.user,
            type=TaskEvents.PLACED_FROM_DRAFT.value)
        messages.success(request, msg)
        if form.cleaned_data.get('notify_customer'):
            send_task_confirmation.delay(task.pk)
            task.events.create(
                parameters={
                    'email': task.get_user_current_email(),
                    'email_type': TaskEventsEmails.ORDER.value},
                type=TaskEvents.EMAIL_SENT.value)
        return redirect('dashboard:task-details', task_pk=task.pk)
    elif form.errors:
        status = 400
    template = 'dashboard/task/modal/create_order.html'
    ctx = {'form': form, 'task': task}
    return TemplateResponse(request, template, ctx, status=status)


@permission_required('task.manage_orders')
def remove_draft_order(request, task_pk):
    task = get_object_or_404(Task.objects.drafts(), pk=task_pk)
    if request.method == 'POST':
        task.delete()
        msg = pgettext_lazy(
            'Dashboard message', 'Draft task successfully removed')
        messages.success(request, msg)
        return redirect('dashboard:tasks')
    template = 'dashboard/task/modal/remove_order.html'
    ctx = {'task': task}
    return TemplateResponse(request, template, ctx)


@permission_required('task.manage_orders')
def task_details(request, task_pk):
    qs = Task.objects.select_related(
        'user', 'delivery_address', 'billing_address').prefetch_related(
        'payments__transactions', 'events__user', 'lines__variant__skill',
        'fulfillments__lines__task_line')
    task = get_object_or_404(qs, pk=task_pk)
    all_payments = task.payments.order_by('-pk').all()
    payment = task.get_last_payment()
    ctx = {
        'task': task, 'all_payments': all_payments, 'payment': payment,
        'notes': task.events.filter(type=TaskEvents.NOTE_ADDED.value),
        'events': task.events.order_by('-date').all(),
        'task_fulfillments': task.fulfillments.all()}
    return TemplateResponse(request, 'dashboard/task/detail.html', ctx)


@permission_required('task.manage_orders')
def task_add_note(request, task_pk):
    task = get_object_or_404(Task, pk=task_pk)
    form = TaskNoteForm(request.POST or None)
    status = 200
    if form.is_valid():
        message = form.cleaned_data['message']
        task.events.create(
            user=request.user, type=TaskEvents.NOTE_ADDED.value,
            parameters={'message': message})
        msg = pgettext_lazy(
            'Dashboard message related to an task',
            'Added note')
        messages.success(request, msg)
    elif form.errors:
        status = 400
    ctx = {'task': task, 'form': form}
    ctx.update(csrf(request))
    template = 'dashboard/task/modal/add_note.html'
    return TemplateResponse(request, template, ctx, status=status)


@staff_member_required
@permission_required('task.manage_orders')
def capture_payment(request, task_pk, payment_pk):
    tasks = Task.objects.confirmed().prefetch_related('payments')
    task = get_object_or_404(tasks, pk=task_pk)
    payment = get_object_or_404(task.payments, pk=payment_pk)
    amount = task.total.gross
    form = CapturePaymentForm(
        request.POST or None, payment=payment,
        initial={'amount': amount.amount})
    if form.is_valid() and form.capture():
        msg = pgettext_lazy(
            'Dashboard message related to a payment',
            'Captured %(amount)s') % {'amount': prices_i18n.amount(amount)}
        task.events.create(
            parameters={'amount': amount},
            user=request.user,
            type=TaskEvents.PAYMENT_CAPTURED.value)
        messages.success(request, msg)
        return redirect('dashboard:task-details', task_pk=task.pk)
    status = 400 if form.errors else 200
    ctx = {
        'captured': amount,
        'form': form,
        'task': task,
        'payment': payment}
    return TemplateResponse(request, 'dashboard/task/modal/capture.html', ctx,
                            status=status)


@staff_member_required
@permission_required('task.manage_orders')
def refund_payment(request, task_pk, payment_pk):
    tasks = Task.objects.confirmed().prefetch_related('payments')
    task = get_object_or_404(tasks, pk=task_pk)
    payment = get_object_or_404(task.payments, pk=payment_pk)
    amount = payment.captured_amount
    form = RefundPaymentForm(
        request.POST or None, payment=payment, initial={'amount': amount})
    if form.is_valid() and form.refund():
        amount = form.cleaned_data['amount']
        msg = pgettext_lazy(
            'Dashboard message related to a payment',
            'Refunded %(amount)s') % {
                'amount': prices_i18n.amount(payment.get_captured_amount())}
        task.events.create(
            parameters={'amount': amount},
            user=request.user,
            type=TaskEvents.PAYMENT_REFUNDED.value)
        messages.success(request, msg)
        return redirect('dashboard:task-details', task_pk=task.pk)
    status = 400 if form.errors else 200
    ctx = {
        'captured': payment.get_captured_amount(),
        'form': form,
        'task': task,
        'payment': payment}
    return TemplateResponse(request, 'dashboard/task/modal/refund.html', ctx,
                            status=status)


@staff_member_required
@permission_required('task.manage_orders')
def void_payment(request, task_pk, payment_pk):
    tasks = Task.objects.confirmed().prefetch_related('payments')
    task = get_object_or_404(tasks, pk=task_pk)
    payment = get_object_or_404(task.payments, pk=payment_pk)
    form = VoidPaymentForm(request.POST or None, payment=payment)
    if form.is_valid() and form.void():
        msg = pgettext_lazy('Dashboard message', 'Voided payment')
        task.events.create(
            user=request.user,
            type=TaskEvents.PAYMENT_VOIDED.value)
        messages.success(request, msg)
        return redirect('dashboard:task-details', task_pk=task.pk)
    status = 400 if form.errors else 200
    ctx = {
        'form': form, 'task': task, 'payment': payment}
    return TemplateResponse(request, 'dashboard/task/modal/void.html', ctx,
                            status=status)


@staff_member_required
@permission_required('task.manage_orders')
def orderline_change_quantity(request, task_pk, line_pk):
    tasks = Task.objects.drafts().prefetch_related('lines')
    task = get_object_or_404(tasks, pk=task_pk)
    line = get_object_or_404(task.lines, pk=line_pk)
    form = ChangeQuantityForm(request.POST or None, instance=line)
    status = 200
    old_quantity = line.quantity
    if form.is_valid():
        msg = pgettext_lazy(
            'Dashboard message related to an task line',
            'Changed quantity for variant %(variant)s from'
            ' %(old_quantity)s to %(new_quantity)s') % {
                'variant': line.variant, 'old_quantity': old_quantity,
                'new_quantity': line.quantity}
        with transaction.atomic():
            form.save()
            messages.success(request, msg)
        return redirect('dashboard:task-details', task_pk=task.pk)
    elif form.errors:
        status = 400
    ctx = {'task': task, 'object': line, 'form': form}
    template = 'dashboard/task/modal/change_quantity.html'
    return TemplateResponse(request, template, ctx, status=status)


@staff_member_required
@permission_required('task.manage_orders')
def orderline_cancel(request, task_pk, line_pk):
    task = get_object_or_404(Task.objects.drafts(), pk=task_pk)
    line = get_object_or_404(task.lines, pk=line_pk)
    form = CancelTaskLineForm(data=request.POST or None, line=line)
    status = 200
    if form.is_valid():
        msg = pgettext_lazy(
            'Dashboard message related to an task line',
            'Canceled item %s') % line
        with transaction.atomic():
            form.cancel_line()
            messages.success(request, msg)
        return redirect('dashboard:task-details', task_pk=task.pk)
    elif form.errors:
        status = 400
    ctx = {'task': task, 'item': line, 'form': form}
    return TemplateResponse(
        request, 'dashboard/task/modal/cancel_line.html',
        ctx, status=status)


@staff_member_required
@permission_required('task.manage_orders')
def add_variant_to_order(request, task_pk):
    """Add variant in given quantity to an task."""
    task = get_object_or_404(Task.objects.drafts(), pk=task_pk)
    taxes = get_taxes_for_address(task.delivery_address)
    form = AddVariantToTaskForm(
        request.POST or None, task=task, discounts=request.discounts,
        taxes=taxes)
    status = 200
    if form.is_valid():
        msg_dict = {
            'quantity': form.cleaned_data.get('quantity'),
            'variant': form.cleaned_data.get('variant')}
        try:
            with transaction.atomic():
                form.save()
            msg = pgettext_lazy(
                'Dashboard message related to an task',
                'Added %(quantity)d x %(variant)s') % msg_dict
            messages.success(request, msg)
        except InsufficientStock:
            msg = pgettext_lazy(
                'Dashboard message related to an task',
                'Insufficient availability: could not add %(quantity)d x %(variant)s'
            ) % msg_dict
            messages.warning(request, msg)
        return redirect('dashboard:task-details', task_pk=task_pk)
    elif form.errors:
        status = 400
    ctx = {'task': task, 'form': form}
    template = 'dashboard/task/modal/add_variant_to_order.html'
    return TemplateResponse(request, template, ctx, status=status)


@staff_member_required
@permission_required('task.manage_orders')
def task_address(request, task_pk, address_type):
    task = get_object_or_404(Task, pk=task_pk)
    update_prices = False
    if address_type == 'delivery':
        address = task.delivery_address
        success_msg = pgettext_lazy(
            'Dashboard message',
            'Updated delivery address')
        update_prices = True
    else:
        address = task.billing_address
        success_msg = pgettext_lazy(
            'Dashboard message',
            'Updated billing address')
    form = AddressForm(request.POST or None, instance=address)
    if form.is_valid():
        updated_address = form.save()
        if not address:
            save_address_in_order(task, updated_address, address_type)
        if update_prices:
            update_task_prices(task, request.discounts)
        if not task.is_draft():
            task.events.create(
                user=request.user,
                type=TaskEvents.UPDATED.value)
        messages.success(request, success_msg)
        return redirect('dashboard:task-details', task_pk=task_pk)
    ctx = {'task': task, 'address_type': address_type, 'form': form}
    return TemplateResponse(request, 'dashboard/task/address_form.html', ctx)


@staff_member_required
@permission_required('task.manage_orders')
def task_customer_edit(request, task_pk):
    task = get_object_or_404(Task.objects.drafts(), pk=task_pk)
    form = TaskCustomerForm(request.POST or None, instance=task)
    status = 200
    if form.is_valid():
        form.save()
        update_task_prices(task, request.discounts)
        user_email = form.cleaned_data.get('user_email')
        user = form.cleaned_data.get('user')
        if user_email:
            msg = pgettext_lazy(
                'Dashboard message',
                '%s email assigned to an task') % user_email
        elif user:
            msg = pgettext_lazy(
                'Dashboard message',
                '%s user assigned to an task') % user
        else:
            msg = pgettext_lazy(
                'Dashboard message',
                'Guest user assigned to an task')
        messages.success(request, msg)
        return redirect('dashboard:task-details', task_pk=task_pk)
    elif form.errors:
        status = 400
    ctx = {'task': task, 'form': form}
    return TemplateResponse(
        request, 'dashboard/task/modal/edit_customer.html', ctx,
        status=status)


@staff_member_required
@permission_required('task.manage_orders')
def task_customer_remove(request, task_pk):
    task = get_object_or_404(Task.objects.drafts(), pk=task_pk)
    form = TaskRemoveCustomerForm(request.POST or None, instance=task)
    if form.is_valid():
        form.save()
        update_task_prices(task, request.discounts)
        msg = pgettext_lazy(
            'Dashboard message',
            'Customer removed from an task')
        messages.success(request, msg)
        return redirect('dashboard:task-details', task_pk=task_pk)
    return redirect('dashboard:task-customer-edit', task_pk=task.pk)


@staff_member_required
@permission_required('task.manage_orders')
def task_delivery_edit(request, task_pk):
    task = get_object_or_404(Task.objects.drafts(), pk=task_pk)
    taxes = get_taxes_for_address(task.delivery_address)
    form = TaskDeliveryForm(request.POST or None, instance=task, taxes=taxes)
    status = 200
    if form.is_valid():
        form.save()
        msg = pgettext_lazy('Dashboard message', 'Delivery updated')
        messages.success(request, msg)
        return redirect('dashboard:task-details', task_pk=task_pk)
    elif form.errors:
        status = 400
    ctx = {'task': task, 'form': form}
    return TemplateResponse(
        request, 'dashboard/task/modal/edit_delivery.html', ctx,
        status=status)


@staff_member_required
@permission_required('task.manage_orders')
def task_delivery_remove(request, task_pk):
    task = get_object_or_404(Task.objects.drafts(), pk=task_pk)
    form = TaskRemoveDeliveryForm(request.POST or None, instance=task)
    if form.is_valid():
        form.save()
        msg = pgettext_lazy('Dashboard message', 'Delivery removed')
        messages.success(request, msg)
        return redirect('dashboard:task-details', task_pk=task_pk)
    return redirect('dashboard:task-delivery-edit', task_pk=task.pk)


@staff_member_required
@permission_required('task.manage_orders')
def task_discount_edit(request, task_pk):
    task = get_object_or_404(Task.objects.drafts(), pk=task_pk)
    form = TaskEditDiscountForm(request.POST or None, instance=task)
    status = 200
    if form.is_valid():
        form.save()
        msg = pgettext_lazy('Dashboard message', 'Discount updated')
        messages.success(request, msg)
        return redirect('dashboard:task-details', task_pk=task_pk)
    elif form.errors:
        status = 400
    ctx = {'task': task, 'form': form}
    return TemplateResponse(
        request, 'dashboard/task/modal/edit_discount.html', ctx,
        status=status)


@staff_member_required
@permission_required('task.manage_orders')
def task_voucher_edit(request, task_pk):
    task = get_object_or_404(Task.objects.drafts(), pk=task_pk)
    form = TaskEditVoucherForm(request.POST or None, instance=task)
    status = 200
    if form.is_valid():
        form.save()
        msg = pgettext_lazy('Dashboard message', 'Voucher updated')
        messages.success(request, msg)
        return redirect('dashboard:task-details', task_pk=task_pk)
    elif form.errors:
        status = 400
    ctx = {'task': task, 'form': form}
    return TemplateResponse(
        request, 'dashboard/task/modal/edit_voucher.html', ctx,
        status=status)


@staff_member_required
@permission_required('task.manage_orders')
def cancel_order(request, task_pk):
    task = get_object_or_404(Task.objects.confirmed(), pk=task_pk)
    status = 200
    form = CancelTaskForm(request.POST or None, task=task)
    if form.is_valid():
        msg = pgettext_lazy('Dashboard message', 'Task canceled')
        with transaction.atomic():
            form.cancel_order()
            if form.cleaned_data.get('restock'):
                task.events.create(
                    user=request.user,
                    type=TaskEvents.UPDATED.value)
            task.events.create(
                user=request.user,
                type=TaskEvents.CANCELED.value)
        messages.success(request, msg)
        return redirect('dashboard:task-details', task_pk=task.pk)
        # TODO: send status confirmation email
    elif form.errors:
        status = 400
    ctx = {'form': form, 'task': task}
    return TemplateResponse(
        request, 'dashboard/task/modal/cancel_order.html', ctx,
        status=status)


@staff_member_required
@permission_required('task.manage_orders')
def task_voucher_remove(request, task_pk):
    task = get_object_or_404(Task.objects.drafts(), pk=task_pk)
    form = TaskRemoveVoucherForm(request.POST or None, instance=task)
    if form.is_valid():
        msg = pgettext_lazy('Dashboard message', 'Removed voucher from task')
        with transaction.atomic():
            form.remove_voucher()
            messages.success(request, msg)
        return redirect('dashboard:task-details', task_pk=task.pk)
    return redirect('dashboard:task-voucher-edit', task_pk=task.pk)


@staff_member_required
@permission_required('task.manage_orders')
def task_invoice(request, task_pk):
    tasks = Task.objects.confirmed().prefetch_related(
        'user', 'delivery_address', 'billing_address', 'voucher')
    task = get_object_or_404(tasks, pk=task_pk)
    absolute_url = get_statics_absolute_url(request)
    pdf_file, task = create_invoice_pdf(task, absolute_url)
    response = HttpResponse(pdf_file, content_type='application/pdf')
    name = "invoice-%s.pdf" % task.id
    response['Content-Disposition'] = 'filename=%s' % name
    return response


@staff_member_required
@permission_required('task.manage_orders')
def mark_task_as_paid(request, task_pk):
    task = get_object_or_404(Task.objects.confirmed(), pk=task_pk)
    status = 200
    form = TaskMarkAsPaidForm(
        request.POST or None, task=task, user=request.user)
    if form.is_valid():
        with transaction.atomic():
            form.save()
            task.events.create(
                user=request.user,
                type=TaskEvents.ORDER_MARKED_AS_PAID.value)
        msg = pgettext_lazy(
            'Dashboard message',
            'Task manually marked as paid')
        messages.success(request, msg)
        return redirect('dashboard:task-details', task_pk=task.pk)
    elif form.errors:
        status = 400
    ctx = {'form': form, 'task': task}
    return TemplateResponse(
        request, 'dashboard/task/modal/mark_as_paid.html', ctx,
        status=status)


@staff_member_required
@permission_required('task.manage_orders')
def fulfillment_packing_slips(request, task_pk, fulfillment_pk):
    tasks = Task.objects.confirmed().prefetch_related(
        'user', 'delivery_address', 'billing_address')
    task = get_object_or_404(tasks, pk=task_pk)
    fulfillments = task.fulfillments.prefetch_related(
        'lines', 'lines__task_line')
    fulfillment = get_object_or_404(fulfillments, pk=fulfillment_pk)
    absolute_url = get_statics_absolute_url(request)
    pdf_file, task = create_packing_slip_pdf(task, fulfillment, absolute_url)
    response = HttpResponse(pdf_file, content_type='application/pdf')
    name = "packing-slip-%s.pdf" % (task.id,)
    response['Content-Disposition'] = 'filename=%s' % name
    return response


@staff_member_required
@permission_required('task.manage_orders')
def fulfill_task_lines(request, task_pk):
    tasks = Task.objects.confirmed().prefetch_related('lines')
    task = get_object_or_404(tasks, pk=task_pk)
    unfulfilled_lines = task.lines.filter(
        quantity_fulfilled__lt=F('quantity'))
    status = 200
    form = FulfillmentForm(
        request.POST or None, task=task, instance=Fulfillment())
    FulfillmentLineFormSet = modelformset_factory(
        FulfillmentLine, form=FulfillmentLineForm,
        extra=len(unfulfilled_lines), formset=BaseFulfillmentLineFormSet)
    initial = [
        {'task_line': line, 'quantity': line.quantity_unfulfilled}
        for line in unfulfilled_lines]
    formset = FulfillmentLineFormSet(
        request.POST or None, queryset=FulfillmentLine.objects.none(),
        initial=initial)
    all_line_forms_valid = all([line_form.is_valid() for line_form in formset])
    if all_line_forms_valid and formset.is_valid() and form.is_valid():
        forms_to_save = [
            line_form for line_form in formset
            if line_form.cleaned_data.get('quantity') > 0]
        if forms_to_save:
            fulfillment = form.save()
            quantity_fulfilled = 0
            for line_form in forms_to_save:
                line = line_form.save(commit=False)
                line.fulfillment = fulfillment
                line.save()
                quantity_fulfilled += line_form.cleaned_data.get('quantity')
            # update to refresh prefetched lines quantity_fulfilled
            task = tasks.get(pk=task_pk)
            update_task_status(task)
            msg = npgettext_lazy(
                'Dashboard message related to an task',
                'Fulfilled %(quantity_fulfilled)d item',
                'Fulfilled %(quantity_fulfilled)d items',
                number='quantity_fulfilled') % {
                    'quantity_fulfilled': quantity_fulfilled}
            task.events.create(
                parameters={'quantity': quantity_fulfilled},
                user=request.user,
                type=TaskEvents.FULFILLMENT_FULFILLED_ITEMS.value)
            if form.cleaned_data.get('send_mail'):
                send_fulfillment_confirmation.delay(task.pk, fulfillment.pk)
                task.events.create(
                    parameters={
                        'email': task.get_user_current_email(),
                        'email_type': TaskEventsEmails.DELIVERY.value},
                    user=request.user,
                    type=TaskEvents.EMAIL_SENT.value)
        else:
            msg = pgettext_lazy(
                'Dashboard message related to an task', 'No items fulfilled')
        messages.success(request, msg)
        return redirect('dashboard:task-details', task_pk=task.pk)
    elif form.errors:
        status = 400
    ctx = {
        'form': form, 'formset': formset, 'task': task,
        'unfulfilled_lines': unfulfilled_lines}
    template = 'dashboard/task/fulfillment.html'
    return TemplateResponse(request, template, ctx, status=status)


@staff_member_required
@permission_required('task.manage_orders')
def cancel_fulfillment(request, task_pk, fulfillment_pk):
    tasks = Task.objects.confirmed().prefetch_related('fulfillments')
    task = get_object_or_404(tasks, pk=task_pk)
    fulfillment = get_object_or_404(task.fulfillments, pk=fulfillment_pk)
    status = 200
    form = CancelFulfillmentForm(request.POST or None, fulfillment=fulfillment)
    if form.is_valid():
        msg = pgettext_lazy(
            'Dashboard message', 'Fulfillment #%(fulfillment)s canceled') % {
                'fulfillment': fulfillment.composed_id}
        with transaction.atomic():
            form.cancel_fulfillment()
            if form.cleaned_data.get('restock'):
                task.events.create(
                    parameters={'quantity': fulfillment.get_total_quantity()},
                    user=request.user,
                    type=TaskEvents.FULFILLMENT_RESTOCKED_ITEMS.value)
            task.events.create(
                user=request.user,
                parameters={'composed_id': fulfillment.composed_id},
                type=TaskEvents.FULFILLMENT_CANCELED.value)
        messages.success(request, msg)
        return redirect('dashboard:task-details', task_pk=task.pk)
    elif form.errors:
        status = 400
    ctx = {'form': form, 'task': task, 'fulfillment': fulfillment}
    return TemplateResponse(
        request, 'dashboard/task/modal/cancel_fulfillment.html', ctx,
        status=status)


@staff_member_required
@permission_required('task.manage_orders')
def change_fulfillment_tracking(request, task_pk, fulfillment_pk):
    tasks = Task.objects.confirmed().prefetch_related('fulfillments')
    task = get_object_or_404(tasks, pk=task_pk)
    fulfillment = get_object_or_404(task.fulfillments, pk=fulfillment_pk)
    status = 200
    form = FulfillmentTrackingNumberForm(
        request.POST or None, instance=fulfillment)
    if form.is_valid():
        form.save()
        task.events.create(
            user=request.user, type=TaskEvents.UPDATED.value)
        if form.cleaned_data.get('send_mail'):
            send_fulfillment_update.delay(task.pk, fulfillment.pk)
            task.events.create(
                parameters={
                    'email': task.get_user_current_email(),
                    'email_type': TaskEventsEmails.DELIVERY.value},
                user=request.user,
                type=TaskEvents.EMAIL_SENT.value)
        msg = pgettext_lazy(
            'Dashboard message',
            'Fulfillment #%(fulfillment)s tracking number updated') % {
                'fulfillment': fulfillment.composed_id}
        messages.success(request, msg)
        return redirect('dashboard:task-details', task_pk=task.pk)
    elif form.errors:
        status = 400
    ctx = {'form': form, 'task': task, 'fulfillment': fulfillment}
    return TemplateResponse(
        request, 'dashboard/task/modal/fulfillment_tracking.html', ctx,
        status=status)


@staff_member_required
def ajax_task_delivery_methods_list(request, task_pk):
    task = get_object_or_404(Task, pk=task_pk)
    queryset = DeliveryMethod.objects.prefetch_related(
        'delivery_zone').order_by('name', 'price')

    if task.delivery_address:
        country_code = task.delivery_address.country.code
        queryset = queryset.filter(
            delivery_zone__countries__contains=country_code)

    search_query = request.GET.get('q', '')
    if search_query:
        queryset = queryset.filter(
            Q(name__icontains=search_query) |
            Q(price__icontains=search_query))

    delivery_methods = [
        {'id': method.pk, 'text': method.get_ajax_label()}
        for method in queryset]
    return JsonResponse({'results': delivery_methods})
