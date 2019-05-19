import graphene

from ...task import TaskEvents, TaskEventsEmails

TaskEventsEnum = graphene.Enum.from_enum(TaskEvents)
TaskEventsEmailsEnum = graphene.Enum.from_enum(TaskEventsEmails)


class TaskStatusFilter(graphene.Enum):
    READY_TO_FULFILL = 'READY_TO_FULFILL'
    READY_TO_CAPTURE = 'READY_TO_CAPTURE'
