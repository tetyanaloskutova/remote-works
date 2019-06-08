import gql from "graphql-tag";

import { TypedMutation } from "../mutations";
import {
  fragmentAddress,
  fragmentTaskDetails,
  fragmentTaskEvent
} from "./queries";
import { TaskAddNote, TaskAddNoteVariables } from "./types/TaskAddNote";
import { TaskCancel, TaskCancelVariables } from "./types/TaskCancel";
import { TaskCapture, TaskCaptureVariables } from "./types/TaskCapture";
import {
  TaskCreateFulfillment,
  TaskCreateFulfillmentVariables
} from "./types/TaskCreateFulfillment";
import {
  TaskDraftCancel,
  TaskDraftCancelVariables
} from "./types/TaskDraftCancel";
import { TaskDraftCreate } from "./types/TaskDraftCreate";
import {
  TaskDraftFinalize,
  TaskDraftFinalizeVariables
} from "./types/TaskDraftFinalize";
import {
  TaskDraftUpdate,
  TaskDraftUpdateVariables
} from "./types/TaskDraftUpdate";
import {
  TaskFulfillmentCancel,
  TaskFulfillmentCancelVariables
} from "./types/TaskFulfillmentCancel";
import {
  TaskFulfillmentUpdateTracking,
  TaskFulfillmentUpdateTrackingVariables
} from "./types/TaskFulfillmentUpdateTracking";
import {
  TaskLineDelete,
  TaskLineDeleteVariables
} from "./types/TaskLineDelete";
import { TaskLinesAdd, TaskLinesAddVariables } from "./types/TaskLinesAdd";
import {
  TaskLineUpdate,
  TaskLineUpdateVariables
} from "./types/TaskLineUpdate";
import {
  TaskMarkAsPaid,
  TaskMarkAsPaidVariables
} from "./types/TaskMarkAsPaid";
import { TaskRefund, TaskRefundVariables } from "./types/TaskRefund";
import {
  TaskDeliveryMethodUpdate,
  TaskDeliveryMethodUpdateVariables
} from "./types/TaskDeliveryMethodUpdate";
import { TaskUpdate, TaskUpdateVariables } from "./types/TaskUpdate";
import { TaskVoid, TaskVoidVariables } from "./types/TaskVoid";

const taskCancelMutation = gql`
  ${fragmentTaskDetails}
  mutation TaskCancel($id: ID!, $reavail: Boolean!) {
    taskCancel(id: $id, reavail: $reavail) {
      errors {
        field
        message
      }
      task {
        ...TaskDetailsFragment
      }
    }
  }
`;
export const TypedTaskCancelMutation = TypedMutation<
  TaskCancel,
  TaskCancelVariables
>(taskCancelMutation);

const taskDraftCancelMutation = gql`
  ${fragmentTaskDetails}
  mutation TaskDraftCancel($id: ID!) {
    draftTaskDelete(id: $id) {
      errors {
        field
        message
      }
      task {
        ...TaskDetailsFragment
      }
    }
  }
`;
export const TypedTaskDraftCancelMutation = TypedMutation<
  TaskDraftCancel,
  TaskDraftCancelVariables
>(taskDraftCancelMutation);

const taskDraftFinalizeMutation = gql`
  ${fragmentTaskDetails}
  mutation TaskDraftFinalize($id: ID!) {
    draftTaskComplete(id: $id) {
      errors {
        field
        message
      }
      task {
        ...TaskDetailsFragment
      }
    }
  }
`;
export const TypedTaskDraftFinalizeMutation = TypedMutation<
  TaskDraftFinalize,
  TaskDraftFinalizeVariables
>(taskDraftFinalizeMutation);

const taskRefundMutation = gql`
  ${fragmentTaskDetails}
  mutation TaskRefund($id: ID!, $amount: Decimal!) {
    taskRefund(id: $id, amount: $amount) {
      errors {
        field
        message
      }
      task {
        ...TaskDetailsFragment
      }
    }
  }
`;
export const TypedTaskRefundMutation = TypedMutation<
  TaskRefund,
  TaskRefundVariables
>(taskRefundMutation);

const taskVoidMutation = gql`
  ${fragmentTaskDetails}
  mutation TaskVoid($id: ID!) {
    taskVoid(id: $id) {
      errors {
        field
        message
      }
      task {
        ...TaskDetailsFragment
      }
    }
  }
`;
export const TypedTaskVoidMutation = TypedMutation<
  TaskVoid,
  TaskVoidVariables
>(taskVoidMutation);

const taskMarkAsPaidMutation = gql`
  ${fragmentTaskDetails}
  mutation TaskMarkAsPaid($id: ID!) {
    taskMarkAsPaid(id: $id) {
      errors {
        field
        message
      }
      task {
        ...TaskDetailsFragment
      }
    }
  }
`;
export const TypedTaskMarkAsPaidMutation = TypedMutation<
  TaskMarkAsPaid,
  TaskMarkAsPaidVariables
>(taskMarkAsPaidMutation);

const taskCaptureMutation = gql`
  ${fragmentTaskDetails}
  mutation TaskCapture($id: ID!, $amount: Decimal!) {
    taskCapture(id: $id, amount: $amount) {
      errors {
        field
        message
      }
      task {
        ...TaskDetailsFragment
      }
    }
  }
`;
export const TypedTaskCaptureMutation = TypedMutation<
  TaskCapture,
  TaskCaptureVariables
>(taskCaptureMutation);

const taskCreateFulfillmentMutation = gql`
  ${fragmentTaskDetails}
  mutation TaskCreateFulfillment(
    $task: ID!
    $input: FulfillmentCreateInput!
  ) {
    taskFulfillmentCreate(task: $task, input: $input) {
      errors {
        field
        message
      }
      task {
        ...TaskDetailsFragment
      }
    }
  }
`;
export const TypedTaskCreateFulfillmentMutation = TypedMutation<
  TaskCreateFulfillment,
  TaskCreateFulfillmentVariables
>(taskCreateFulfillmentMutation);

const taskFulfillmentUpdateTrackingMutation = gql`
  ${fragmentTaskDetails}
  mutation TaskFulfillmentUpdateTracking(
    $id: ID!
    $input: FulfillmentUpdateTrackingInput!
  ) {
    taskFulfillmentUpdateTracking(id: $id, input: $input) {
      errors {
        field
        message
      }
      task {
        ...TaskDetailsFragment
      }
    }
  }
`;
export const TypedTaskFulfillmentUpdateTrackingMutation = TypedMutation<
  TaskFulfillmentUpdateTracking,
  TaskFulfillmentUpdateTrackingVariables
>(taskFulfillmentUpdateTrackingMutation);

const taskFulfillmentCancelMutation = gql`
  ${fragmentTaskDetails}
  mutation TaskFulfillmentCancel($id: ID!, $input: FulfillmentCancelInput!) {
    taskFulfillmentCancel(id: $id, input: $input) {
      errors {
        field
        message
      }
      task {
        ...TaskDetailsFragment
      }
    }
  }
`;
export const TypedTaskFulfillmentCancelMutation = TypedMutation<
  TaskFulfillmentCancel,
  TaskFulfillmentCancelVariables
>(taskFulfillmentCancelMutation);

const taskAddNoteMutation = gql`
  ${fragmentTaskEvent}
  mutation TaskAddNote($task: ID!, $input: TaskAddNoteInput!) {
    taskAddNote(task: $task, input: $input) {
      errors {
        field
        message
      }
      task {
        id
        events {
          ...TaskEventFragment
        }
      }
    }
  }
`;
export const TypedTaskAddNoteMutation = TypedMutation<
  TaskAddNote,
  TaskAddNoteVariables
>(taskAddNoteMutation);

const taskUpdateMutation = gql`
  ${fragmentAddress}
  mutation TaskUpdate($id: ID!, $input: TaskUpdateInput!) {
    taskUpdate(id: $id, input: $input) {
      errors {
        field
        message
      }
      task {
        id
        userEmail
        billingAddress {
          ...AddressFragment
        }
        deliveryAddress {
          ...AddressFragment
        }
      }
    }
  }
`;
export const TypedTaskUpdateMutation = TypedMutation<
  TaskUpdate,
  TaskUpdateVariables
>(taskUpdateMutation);

const taskDraftUpdateMutation = gql`
  ${fragmentTaskDetails}
  mutation TaskDraftUpdate($id: ID!, $input: DraftTaskInput!) {
    draftTaskUpdate(id: $id, input: $input) {
      errors {
        field
        message
      }
      task {
        ...TaskDetailsFragment
      }
    }
  }
`;
export const TypedTaskDraftUpdateMutation = TypedMutation<
  TaskDraftUpdate,
  TaskDraftUpdateVariables
>(taskDraftUpdateMutation);

const taskDeliveryMethodUpdateMutation = gql`
  mutation TaskDeliveryMethodUpdate(
    $id: ID!
    $input: TaskUpdateDeliveryInput!
  ) {
    taskUpdateDelivery(task: $id, input: $input) {
      errors {
        field
        message
      }
      task {
        availableDeliveryMethods {
          id
          name
        }
        id
        deliveryMethod {
          id
          name
          price {
            amount
            currency
          }
        }
        deliveryMethodName
        deliveryPrice {
          gross {
            amount
            currency
          }
        }
      }
    }
  }
`;
export const TypedTaskDeliveryMethodUpdateMutation = TypedMutation<
  TaskDeliveryMethodUpdate,
  TaskDeliveryMethodUpdateVariables
>(taskDeliveryMethodUpdateMutation);

const taskDraftCreateMutation = gql`
  mutation TaskDraftCreate {
    draftTaskCreate(input: {}) {
      errors {
        field
        message
      }
      task {
        id
      }
    }
  }
`;
export const TypedTaskDraftCreateMutation = TypedMutation<
  TaskDraftCreate,
  {}
>(taskDraftCreateMutation);

const taskLineDeleteMutation = gql`
  ${fragmentTaskDetails}
  mutation TaskLineDelete($id: ID!) {
    draftTaskLineDelete(id: $id) {
      errors {
        field
        message
      }
      task {
        ...TaskDetailsFragment
      }
    }
  }
`;
export const TypedTaskLineDeleteMutation = TypedMutation<
  TaskLineDelete,
  TaskLineDeleteVariables
>(taskLineDeleteMutation);

const taskLinesAddMutation = gql`
  ${fragmentTaskDetails}
  mutation TaskLinesAdd($id: ID!, $input: [TaskLineCreateInput]!) {
    draftTaskLinesCreate(id: $id, input: $input) {
      errors {
        field
        message
      }
      task {
        ...TaskDetailsFragment
      }
    }
  }
`;
export const TypedTaskLinesAddMutation = TypedMutation<
  TaskLinesAdd,
  TaskLinesAddVariables
>(taskLinesAddMutation);

const taskLineUpdateMutation = gql`
  ${fragmentTaskDetails}
  mutation TaskLineUpdate($id: ID!, $input: TaskLineInput!) {
    draftTaskLineUpdate(id: $id, input: $input) {
      errors {
        field
        message
      }
      task {
        ...TaskDetailsFragment
      }
    }
  }
`;
export const TypedTaskLineUpdateMutation = TypedMutation<
  TaskLineUpdate,
  TaskLineUpdateVariables
>(taskLineUpdateMutation);
