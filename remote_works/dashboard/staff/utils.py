def remove_staff_member(staff):
    """Remove staff member account only if it has no tasks placed.

    Otherwise, switches is_staff status to False.
    """
    if staff.tasks.exists():
        staff.is_staff = False
        staff.user_permissions.clear()
        staff.save()
    else:
        staff.delete()
