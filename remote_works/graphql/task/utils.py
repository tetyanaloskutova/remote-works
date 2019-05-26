from ...delivery import models as delivery_models
from ..core.types.common import Error


def _check_can_finalize_skills_quantity(task, errors):
    if task.get_total_quantity() == 0:
        errors.append(
            Error(
                field='lines',
                message='Could not create task without any skills.'))


def _check_can_finalize_delivery(task, errors):
    if task.is_delivery_required():
        method = task.delivery_method
        delivery_address = task.delivery_address
        delivery_not_valid = (
            method and delivery_address and
            delivery_address.country.code not in method.delivery_zone.countries)  # noqa
        if delivery_not_valid:
            errors.append(
                Error(
                    field='delivery',
                    message='Delivery method is not valid for chosen delivery '
                    'address'))


def _check_can_finalize_skills_exists(task, errors):
    line_variants = [line.variant for line in task]
    if None in line_variants:
        errors.append(
            Error(
                field='lines',
                message='Could not create tasks with non-existing skills.'))


def can_finalize_draft_order(task, errors):
    """Return a list of errors associated with the task.

    Checks, if given task has a proper customer data, delivery
    address and method set up and return list of errors if not.
    Checks if skill variants for task lines still exists in
    database, too.
    """
    _check_can_finalize_skills_quantity(task, errors)
    _check_can_finalize_delivery(task, errors)
    _check_can_finalize_skills_exists(task, errors)
    return errors


def applicable_delivery_methods(obj, info, price):
    if not obj.is_delivery_required():
        return []
    if not obj.delivery_address:
        return []

    qs = delivery_models.DeliveryMethod.objects
    return qs.applicable_delivery_methods(
        price=price, weight=obj.get_total_weight(),
        country_code=obj.delivery_address.country.code)
