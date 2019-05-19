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

const orderCancelMutation = gql`
  ${fragmentTaskDetails}
  mutation TaskCancel($id: ID!, $restock: Boolean!) {
    orderCancel(id: $id, restock: $restock) {
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
>(orderCancelMutation);

const orderDraftCancelMutation = gql`
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
>(orderDraftCancelMutation);

const orderDraftFinalizeMutation = gql`
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
>(orderDraftFinalizeMutation);

const orderRefundMutation = gql`
  ${fragmentTaskDetails}
  mutation TaskRefund($id: ID!, $amount: Decimal!) {
    orderRefund(id: $id, amount: $amount) {
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
>(orderRefundMutation);

const orderVoidMutation = gql`
  ${fragmentTaskDetails}
  mutation TaskVoid($id: ID!) {
    orderVoid(id: $id) {
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
>(orderVoidMutation);

const orderMarkAsPaidMutation = gql`
  ${fragmentTaskDetails}
  mutation TaskMarkAsPaid($id: ID!) {
    orderMarkAsPaid(id: $id) {
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
>(orderMarkAsPaidMutation);

const orderCaptureMutation = gql`
  ${fragmentTaskDetails}
  mutation TaskCapture($id: ID!, $amount: Decimal!) {
    orderCapture(id: $id, amount: $amount) {
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
>(orderCaptureMutation);

const orderCreateFulfillmentMutation = gql`
  ${fragmentTaskDetails}
  mutation TaskCreateFulfillment(
    $order: ID!
    $input: FulfillmentCreateInput!
  ) {
    orderFulfillmentCreate(task: $order, input: $input) {
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
>(orderCreateFulfillmentMutation);

const orderFulfillmentUpdateTrackingMutation = gql`
  ${fragmentTaskDetails}
  mutation TaskFulfillmentUpdateTracking(
    $id: ID!
    $input: FulfillmentUpdateTrackingInput!
  ) {
    orderFulfillmentUpdateTracking(id: $id, input: $input) {
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
>(orderFulfillmentUpdateTrackingMutation);

const orderFulfillmentCancelMutation = gql`
  ${fragmentTaskDetails}
  mutation TaskFulfillmentCancel($id: ID!, $input: FulfillmentCancelInput!) {
    orderFulfillmentCancel(id: $id, input: $input) {
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
>(orderFulfillmentCancelMutation);

const orderAddNoteMutation = gql`
  ${fragmentTaskEvent}
  mutation TaskAddNote($order: ID!, $input: TaskAddNoteInput!) {
    orderAddNote(task: $order, input: $input) {
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
>(orderAddNoteMutation);

const orderUpdateMutation = gql`
  ${fragmentAddress}
  mutation TaskUpdate($id: ID!, $input: TaskUpdateInput!) {
    orderUpdate(id: $id, input: $input) {
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
>(orderUpdateMutation);

const orderDraftUpdateMutation = gql`
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
>(orderDraftUpdateMutation);

const orderDeliveryMethodUpdateMutation = gql`
  mutation TaskDeliveryMethodUpdate(
    $id: ID!
    $input: TaskUpdateDeliveryInput!
  ) {
    orderUpdateDelivery(task: $id, input: $input) {
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
>(orderDeliveryMethodUpdateMutation);

const orderDraftCreateMutation = gql`
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
>(orderDraftCreateMutation);

const orderLineDeleteMutation = gql`
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
>(orderLineDeleteMutation);

const orderLinesAddMutation = gql`
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
>(orderLinesAddMutation);

const orderLineUpdateMutation = gql`
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
>(orderLineUpdateMutation);
