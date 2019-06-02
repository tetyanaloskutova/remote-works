import * as React from "react";

import { getMutationProviderData } from "../../misc";
import { PartialMutationProviderOutput } from "../../types";
import {
  TypedTaskAddNoteMutation,
  TypedTaskCancelMutation,
  TypedTaskCaptureMutation,
  TypedTaskCreateFulfillmentMutation,
  TypedTaskDraftCancelMutation,
  TypedTaskDraftFinalizeMutation,
  TypedTaskDraftUpdateMutation,
  TypedTaskFulfillmentCancelMutation,
  TypedTaskFulfillmentUpdateTrackingMutation,
  TypedTaskLineDeleteMutation,
  TypedTaskLinesAddMutation,
  TypedTaskLineUpdateMutation,
  TypedTaskMarkAsPaidMutation,
  TypedTaskRefundMutation,
  TypedTaskDeliveryMethodUpdateMutation,
  TypedTaskUpdateMutation,
  TypedTaskVoidMutation
} from "../mutations";
import { TaskAddNote, TaskAddNoteVariables } from "../types/TaskAddNote";
import { TaskCancel, TaskCancelVariables } from "../types/TaskCancel";
import { TaskCapture, TaskCaptureVariables } from "../types/TaskCapture";
import {
  TaskCreateFulfillment,
  TaskCreateFulfillmentVariables
} from "../types/TaskCreateFulfillment";
import {
  TaskDraftCancel,
  TaskDraftCancelVariables
} from "../types/TaskDraftCancel";
import {
  TaskDraftFinalize,
  TaskDraftFinalizeVariables
} from "../types/TaskDraftFinalize";
import {
  TaskDraftUpdate,
  TaskDraftUpdateVariables
} from "../types/TaskDraftUpdate";
import {
  TaskFulfillmentCancel,
  TaskFulfillmentCancelVariables
} from "../types/TaskFulfillmentCancel";
import {
  TaskFulfillmentUpdateTracking,
  TaskFulfillmentUpdateTrackingVariables
} from "../types/TaskFulfillmentUpdateTracking";
import { TaskLineAdd, TaskLineAddVariables } from "../types/TaskLineAdd";
import {
  TaskLineDelete,
  TaskLineDeleteVariables
} from "../types/TaskLineDelete";
import {
  TaskLineUpdate,
  TaskLineUpdateVariables
} from "../types/TaskLineUpdate";
import {
  TaskMarkAsPaid,
  TaskMarkAsPaidVariables
} from "../types/TaskMarkAsPaid";
import { TaskRefund, TaskRefundVariables } from "../types/TaskRefund";
import {
  TaskDeliveryMethodUpdate,
  TaskDeliveryMethodUpdateVariables
} from "../types/TaskDeliveryMethodUpdate";
import { TaskUpdate, TaskUpdateVariables } from "../types/TaskUpdate";
import { TaskVoid, TaskVoidVariables } from "../types/TaskVoid";

interface TaskOperationsProps {
  task: string;
  children: (
    props: {
      orderAddNote: PartialMutationProviderOutput<
        TaskAddNote,
        TaskAddNoteVariables
      >;
      taskCancel: PartialMutationProviderOutput<
        TaskCancel,
        TaskCancelVariables
      >;
      taskCreateFulfillment: PartialMutationProviderOutput<
        TaskCreateFulfillment,
        TaskCreateFulfillmentVariables
      >;
      taskFulfillmentCancel: PartialMutationProviderOutput<
        TaskFulfillmentCancel,
        TaskFulfillmentCancelVariables
      >;
      taskFulfillmentUpdateTracking: PartialMutationProviderOutput<
        TaskFulfillmentUpdateTracking,
        TaskFulfillmentUpdateTrackingVariables
      >;
      taskPaymentCapture: PartialMutationProviderOutput<
        TaskCapture,
        TaskCaptureVariables
      >;
      taskPaymentRefund: PartialMutationProviderOutput<
        TaskRefund,
        TaskRefundVariables
      >;
      taskPaymentMarkAsPaid: PartialMutationProviderOutput<
        TaskMarkAsPaid,
        TaskMarkAsPaidVariables
      >;
      taskVoid: PartialMutationProviderOutput<TaskVoid, TaskVoidVariables>;
      taskUpdate: PartialMutationProviderOutput<
        TaskUpdate,
        TaskUpdateVariables
      >;
      taskDraftCancel: PartialMutationProviderOutput<
        TaskDraftCancel,
        TaskDraftCancelVariables
      >;
      taskDraftFinalize: PartialMutationProviderOutput<
        TaskDraftFinalize,
        TaskDraftFinalizeVariables
      >;
      taskDraftUpdate: PartialMutationProviderOutput<
        TaskDraftUpdate,
        TaskDraftUpdateVariables
      >;
      taskDeliveryMethodUpdate: PartialMutationProviderOutput<
        TaskDeliveryMethodUpdate,
        TaskDeliveryMethodUpdateVariables
      >;
      taskLineDelete: PartialMutationProviderOutput<
        TaskLineDelete,
        TaskLineDeleteVariables
      >;
      taskLineAdd: PartialMutationProviderOutput<
        TaskLineAdd,
        TaskLineAddVariables
      >;
      taskLineUpdate: PartialMutationProviderOutput<
        TaskLineUpdate,
        TaskLineUpdateVariables
      >;
    }
  ) => React.ReactNode;
  onTaskFulfillmentCancel: (data: TaskFulfillmentCancel) => void;
  onTaskFulfillmentCreate: (data: TaskCreateFulfillment) => void;
  onTaskFulfillmentUpdate: (data: TaskFulfillmentUpdateTracking) => void;
  onTaskCancel: (data: TaskCancel) => void;
  onTaskVoid: (data: TaskVoid) => void;
  onTaskMarkAsPaid: (data: TaskMarkAsPaid) => void;
  onNoteAdd: (data: TaskAddNote) => void;
  onPaymentCapture: (data: TaskCapture) => void;
  onPaymentRefund: (data: TaskRefund) => void;
  onUpdate: (data: TaskUpdate) => void;
  onDraftCancel: (data: TaskDraftCancel) => void;
  onDraftFinalize: (data: TaskDraftFinalize) => void;
  onDraftUpdate: (data: TaskDraftUpdate) => void;
  onDeliveryMethodUpdate: (data: TaskDeliveryMethodUpdate) => void;
  onTaskLineDelete: (data: TaskLineDelete) => void;
  onTaskLineAdd: (data: TaskLineAdd) => void;
  onTaskLineUpdate: (data: TaskLineUpdate) => void;
}

const TaskOperations: React.StatelessComponent<TaskOperationsProps> = ({
  children,
  onDraftUpdate,
  onTaskFulfillmentCreate,
  onNoteAdd,
  onTaskCancel,
  onTaskLineAdd,
  onTaskLineDelete,
  onTaskLineUpdate,
  onTaskVoid,
  onPaymentCapture,
  onPaymentRefund,
  onDeliveryMethodUpdate,
  onUpdate,
  onDraftCancel,
  onDraftFinalize,
  onTaskFulfillmentCancel,
  onTaskFulfillmentUpdate,
  onTaskMarkAsPaid
}) => (
  <TypedTaskVoidMutation onCompleted={onTaskVoid}>
    {(...taskVoid) => (
      <TypedTaskCancelMutation onCompleted={onTaskCancel}>
        {(...taskCancel) => (
          <TypedTaskCaptureMutation onCompleted={onPaymentCapture}>
            {(...paymentCapture) => (
              <TypedTaskRefundMutation onCompleted={onPaymentRefund}>
                {(...paymentRefund) => (
                  <TypedTaskCreateFulfillmentMutation
                    onCompleted={onTaskFulfillmentCreate}
                  >
                    {(...createFulfillment) => (
                      <TypedTaskAddNoteMutation onCompleted={onNoteAdd}>
                        {(...addNote) => (
                          <TypedTaskUpdateMutation onCompleted={onUpdate}>
                            {(...update) => (
                              <TypedTaskDraftUpdateMutation
                                onCompleted={onDraftUpdate}
                              >
                                {(...updateDraft) => (
                                  <TypedTaskDeliveryMethodUpdateMutation
                                    onCompleted={onDeliveryMethodUpdate}
                                  >
                                    {(...updateDeliveryMethod) => (
                                      <TypedTaskLineDeleteMutation
                                        onCompleted={onTaskLineDelete}
                                      >
                                        {(...deleteTaskLine) => (
                                          <TypedTaskLinesAddMutation
                                            onCompleted={onTaskLineAdd}
                                          >
                                            {(...addTaskLine) => (
                                              <TypedTaskLineUpdateMutation
                                                onCompleted={onTaskLineUpdate}
                                              >
                                                {(...updateTaskLine) => (
                                                  <TypedTaskFulfillmentCancelMutation
                                                    onCompleted={
                                                      onTaskFulfillmentCancel
                                                    }
                                                  >
                                                    {(...cancelFulfillment) => (
                                                      <TypedTaskFulfillmentUpdateTrackingMutation
                                                        onCompleted={
                                                          onTaskFulfillmentUpdate
                                                        }
                                                      >
                                                        {(
                                                          ...updateTrackingNumber
                                                        ) => (
                                                          <TypedTaskDraftFinalizeMutation
                                                            onCompleted={
                                                              onDraftFinalize
                                                            }
                                                          >
                                                            {(
                                                              ...finalizeDraft
                                                            ) => (
                                                              <TypedTaskDraftCancelMutation
                                                                onCompleted={
                                                                  onDraftCancel
                                                                }
                                                              >
                                                                {(
                                                                  ...cancelDraft
                                                                ) => (
                                                                  <TypedTaskMarkAsPaidMutation
                                                                    onCompleted={
                                                                      onTaskMarkAsPaid
                                                                    }
                                                                  >
                                                                    {(
                                                                      ...markAsPaid
                                                                    ) =>
                                                                      children({
                                                                        orderAddNote: getMutationProviderData(
                                                                          ...addNote
                                                                        ),
                                                                        taskCancel: getMutationProviderData(
                                                                          ...taskCancel
                                                                        ),
                                                                        taskCreateFulfillment: getMutationProviderData(
                                                                          ...createFulfillment
                                                                        ),
                                                                        taskDraftCancel: getMutationProviderData(
                                                                          ...cancelDraft
                                                                        ),
                                                                        taskDraftFinalize: getMutationProviderData(
                                                                          ...finalizeDraft
                                                                        ),
                                                                        taskDraftUpdate: getMutationProviderData(
                                                                          ...updateDraft
                                                                        ),
                                                                        taskFulfillmentCancel: getMutationProviderData(
                                                                          ...cancelFulfillment
                                                                        ),
                                                                        taskFulfillmentUpdateTracking: getMutationProviderData(
                                                                          ...updateTrackingNumber
                                                                        ),
                                                                        taskLineAdd: getMutationProviderData(
                                                                          ...addTaskLine
                                                                        ),
                                                                        taskLineDelete: getMutationProviderData(
                                                                          ...deleteTaskLine
                                                                        ),
                                                                        taskLineUpdate: getMutationProviderData(
                                                                          ...updateTaskLine
                                                                        ),
                                                                        taskPaymentCapture: getMutationProviderData(
                                                                          ...paymentCapture
                                                                        ),
                                                                        taskPaymentMarkAsPaid: getMutationProviderData(
                                                                          ...markAsPaid
                                                                        ),
                                                                        taskPaymentRefund: getMutationProviderData(
                                                                          ...paymentRefund
                                                                        ),
                                                                        taskDeliveryMethodUpdate: getMutationProviderData(
                                                                          ...updateDeliveryMethod
                                                                        ),
                                                                        taskUpdate: getMutationProviderData(
                                                                          ...update
                                                                        ),
                                                                        taskVoid: getMutationProviderData(
                                                                          ...taskVoid
                                                                        )
                                                                      })
                                                                    }
                                                                  </TypedTaskMarkAsPaidMutation>
                                                                )}
                                                              </TypedTaskDraftCancelMutation>
                                                            )}
                                                          </TypedTaskDraftFinalizeMutation>
                                                        )}
                                                      </TypedTaskFulfillmentUpdateTrackingMutation>
                                                    )}
                                                  </TypedTaskFulfillmentCancelMutation>
                                                )}
                                              </TypedTaskLineUpdateMutation>
                                            )}
                                          </TypedTaskLinesAddMutation>
                                        )}
                                      </TypedTaskLineDeleteMutation>
                                    )}
                                  </TypedTaskDeliveryMethodUpdateMutation>
                                )}
                              </TypedTaskDraftUpdateMutation>
                            )}
                          </TypedTaskUpdateMutation>
                        )}
                      </TypedTaskAddNoteMutation>
                    )}
                  </TypedTaskCreateFulfillmentMutation>
                )}
              </TypedTaskRefundMutation>
            )}
          </TypedTaskCaptureMutation>
        )}
      </TypedTaskCancelMutation>
    )}
  </TypedTaskVoidMutation>
);
export default TaskOperations;
