import * as React from "react";

import Messages from "../../../components/messages";
import Navigator from "../../../components/Navigator";
import i18n from "../../../i18n";
import { maybe } from "../../../misc";
import { TaskAddNote } from "../../types/TaskAddNote";
import { TaskCancel } from "../../types/TaskCancel";
import { TaskCapture } from "../../types/TaskCapture";
import { TaskCreateFulfillment } from "../../types/TaskCreateFulfillment";
import { TaskDraftCancel } from "../../types/TaskDraftCancel";
import { TaskDraftFinalize } from "../../types/TaskDraftFinalize";
import { TaskDraftUpdate } from "../../types/TaskDraftUpdate";
import { TaskFulfillmentCancel } from "../../types/TaskFulfillmentCancel";
import { TaskFulfillmentUpdateTracking } from "../../types/TaskFulfillmentUpdateTracking";
import { TaskLineAdd } from "../../types/TaskLineAdd";
import { TaskLineDelete } from "../../types/TaskLineDelete";
import { TaskLineUpdate } from "../../types/TaskLineUpdate";
import { TaskMarkAsPaid } from "../../types/TaskMarkAsPaid";
import { TaskRefund } from "../../types/TaskRefund";
import { TaskDeliveryMethodUpdate } from "../../types/TaskDeliveryMethodUpdate";
import { TaskUpdate } from "../../types/TaskUpdate";
import { TaskVoid } from "../../types/TaskVoid";
import { taskListUrl, taskUrl } from "../../urls";

interface TaskDetailsMessages {
  children: (
    props: {
      handleDraftCancel: (data: TaskDraftCancel) => void;
      handleDraftFinalize: (data: TaskDraftFinalize) => void;
      handleDraftUpdate: (data: TaskDraftUpdate) => void;
      handleNoteAdd: (data: TaskAddNote) => void;
      handleTaskCancel: (data: TaskCancel) => void;
      handleTaskFulfillmentCancel: (data: TaskFulfillmentCancel) => void;
      handleTaskFulfillmentCreate: (data: TaskCreateFulfillment) => void;
      handleTaskFulfillmentUpdate: (
        data: TaskFulfillmentUpdateTracking
      ) => void;
      handleTaskLineAdd: (data: TaskLineAdd) => void;
      handleTaskLineDelete: (data: TaskLineDelete) => void;
      handleTaskLineUpdate: (data: TaskLineUpdate) => void;
      handleTaskMarkAsPaid: (data: TaskMarkAsPaid) => void;
      handleTaskVoid: (data: TaskVoid) => void;
      handlePaymentCapture: (data: TaskCapture) => void;
      handlePaymentRefund: (data: TaskRefund) => void;
      handleDeliveryMethodUpdate: (data: TaskDeliveryMethodUpdate) => void;
      handleUpdate: (data: TaskUpdate) => void;
    }
  ) => React.ReactNode;
}

export const TaskDetailsMessages: React.StatelessComponent<
  TaskDetailsMessages
> = ({ children }) => (
  <Navigator>
    {navigate => (
      <Messages>
        {pushMessage => {
          const handlePaymentCapture = (data: TaskCapture) => {
            if (!maybe(() => data.taskCapture.errors.length)) {
              pushMessage({
                text: i18n.t("Payment successfully captured", {
                  context: "notification"
                })
              });
            } else {
              pushMessage({
                text: i18n.t("Payment not captured: {{ errorMessage }}", {
                  context: "notification",
                  errorMessage: data.taskCapture.errors.filter(
                    error => error.field === "payment"
                  )[0].message
                })
              });
            }
          };
          const handlePaymentRefund = (data: TaskRefund) => {
            if (!maybe(() => data.taskRefund.errors.length)) {
              pushMessage({
                text: i18n.t("Payment successfully refunded", {
                  context: "notification"
                })
              });
            } else {
              pushMessage({
                text: i18n.t("Payment not refunded: {{ errorMessage }}", {
                  context: "notification",
                  errorMessage: data.taskRefund.errors.filter(
                    error => error.field === "payment"
                  )[0].message
                })
              });
            }
          };
          const handleTaskFulfillmentCreate = (
            data: TaskCreateFulfillment
          ) => {
            if (!maybe(() => data.taskFulfillmentCreate.errors.length)) {
              pushMessage({
                text: i18n.t("Items successfully fulfilled", {
                  context: "notification"
                })
              });
              navigate(taskUrl(data.taskFulfillmentCreate.task.id), true);
            } else {
              pushMessage({
                text: i18n.t("Could not fulfill items", {
                  context: "notification"
                })
              });
            }
          };
          const handleTaskMarkAsPaid = (data: TaskMarkAsPaid) => {
            if (!maybe(() => data.taskMarkAsPaid.errors.length)) {
              pushMessage({
                text: i18n.t("Task marked as paid", {
                  context: "notification"
                })
              });
              navigate(taskUrl(data.taskMarkAsPaid.task.id), true);
            } else {
              pushMessage({
                text: i18n.t("Could not mark task as paid", {
                  context: "notification"
                })
              });
            }
          };
          const handleTaskCancel = (data: TaskCancel) => {
            pushMessage({
              text: i18n.t("Task successfully cancelled", {
                context: "notification"
              })
            });
            navigate(taskUrl(data.taskCancel.task.id), true);
          };
          const handleDraftCancel = () => {
            pushMessage({
              text: i18n.t("Task successfully cancelled", {
                context: "notification"
              })
            });
            navigate(taskListUrl(), true);
          };
          const handleTaskVoid = () => {
            pushMessage({
              text: i18n.t("Task payment successfully voided", {
                context: "notification"
              })
            });
          };
          const handleNoteAdd = (data: TaskAddNote) => {
            if (!maybe(() => data.orderAddNote.errors.length)) {
              pushMessage({
                text: i18n.t("Note successfully added", {
                  context: "notification"
                })
              });
            } else {
              pushMessage({
                text: i18n.t("Could not add note", {
                  context: "notification"
                })
              });
            }
          };
          const handleUpdate = (data: TaskUpdate) => {
            if (!maybe(() => data.taskUpdate.errors.length)) {
              pushMessage({
                text: i18n.t("Task successfully updated", {
                  context: "notification"
                })
              });
              navigate(taskUrl(data.taskUpdate.task.id), true);
            }
          };
          const handleDraftUpdate = (data: TaskDraftUpdate) => {
            if (!maybe(() => data.draftTaskUpdate.errors.length)) {
              pushMessage({
                text: i18n.t("Task successfully updated", {
                  context: "notification"
                })
              });
              navigate(taskUrl(data.draftTaskUpdate.task.id), true);
            }
          };
          const handleDeliveryMethodUpdate = (
            data: TaskDeliveryMethodUpdate
          ) => {
            if (!maybe(() => data.taskUpdateDelivery.errors.length)) {
              pushMessage({
                text: i18n.t("Delivery method successfully updated", {
                  context: "notification"
                })
              });
            } else {
              pushMessage({
                text: i18n.t("Could not update delivery method", {
                  context: "notification"
                })
              });
            }
            navigate(taskUrl(data.taskUpdateDelivery.task.id), true);
          };
          const handleTaskLineDelete = (data: TaskLineDelete) => {
            if (!maybe(() => data.draftTaskLineDelete.errors.length)) {
              pushMessage({
                text: i18n.t("Task line deleted", {
                  context: "notification"
                })
              });
            } else {
              pushMessage({
                text: i18n.t("Could not delete task line", {
                  context: "notification"
                })
              });
            }
          };
          const handleTaskLineAdd = (data: TaskLineAdd) => {
            if (!maybe(() => data.draftTaskLinesCreate.errors.length)) {
              pushMessage({
                text: i18n.t("Task line added", {
                  context: "notification"
                })
              });
              navigate(taskUrl(data.draftTaskLinesCreate.task.id), true);
            } else {
              pushMessage({
                text: i18n.t("Could not create task line", {
                  context: "notification"
                })
              });
            }
          };
          const handleTaskLineUpdate = (data: TaskLineUpdate) => {
            if (!maybe(() => data.draftTaskLineUpdate.errors.length)) {
              pushMessage({
                text: i18n.t("Task line updated", {
                  context: "notification"
                })
              });
            } else {
              pushMessage({
                text: i18n.t("Could not update task line", {
                  context: "notification"
                })
              });
            }
          };
          const handleTaskFulfillmentCancel = (
            data: TaskFulfillmentCancel
          ) => {
            if (!maybe(() => data.taskFulfillmentCancel.errors.length)) {
              pushMessage({
                text: i18n.t("Fulfillment successfully cancelled", {
                  context: "notification"
                })
              });
              navigate(taskUrl(data.taskFulfillmentCancel.task.id), true);
            } else {
              pushMessage({
                text: i18n.t("Could not cancel fulfillment", {
                  context: "notification"
                })
              });
            }
          };
          const handleTaskFulfillmentUpdate = (
            data: TaskFulfillmentUpdateTracking
          ) => {
            if (
              !maybe(() => data.taskFulfillmentUpdateTracking.errors.length)
            ) {
              pushMessage({
                text: i18n.t("Fulfillment successfully updated", {
                  context: "notification"
                })
              });
              navigate(
                taskUrl(data.taskFulfillmentUpdateTracking.task.id),
                true
              );
            } else {
              pushMessage({
                text: i18n.t("Could not update fulfillment", {
                  context: "notification"
                })
              });
            }
          };
          const handleDraftFinalize = (data: TaskDraftFinalize) => {
            if (!maybe(() => data.draftTaskComplete.errors.length)) {
              pushMessage({
                text: i18n.t("Draft task successfully finalized", {
                  context: "notification"
                })
              });
              navigate(taskUrl(data.draftTaskComplete.task.id), true);
            } else {
              pushMessage({
                text: i18n.t("Could not finalize draft", {
                  context: "notification"
                })
              });
            }
          };

          return children({
            handleDraftCancel,
            handleDraftFinalize,
            handleDraftUpdate,
            handleNoteAdd,
            handleTaskCancel,
            handleTaskFulfillmentCancel,
            handleTaskFulfillmentCreate,
            handleTaskFulfillmentUpdate,
            handleTaskLineAdd,
            handleTaskLineDelete,
            handleTaskLineUpdate,
            handleTaskMarkAsPaid,
            handleTaskVoid,
            handlePaymentCapture,
            handlePaymentRefund,
            handleDeliveryMethodUpdate,
            handleUpdate
          });
        }}
      </Messages>
    )}
  </Navigator>
);
