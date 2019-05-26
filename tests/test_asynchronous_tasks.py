import pytest

from remote_works.task.emails import (
    send_task_confirmation, send_payment_confirmation)


@pytest.mark.integration
def test_email_sending_asynchronously(
        transactional_db, celery_app, celery_worker, task_with_lines):
    task = send_task_confirmation.delay(task_with_lines.pk)
    payment = send_payment_confirmation.delay(task_with_lines.pk)
    task.get()
    payment.get()
