import DialogContentText from "@material-ui/core/DialogContentText";
import * as React from "react";

import ActionDialog from "../../../components/ActionDialog";
import { ConfirmButtonTransitionState } from "../../../components/ConfirmButton/ConfirmButton";
import i18n from "../../../i18n";

export type TaskDraftFinalizeWarning =
  | "no-delivery"
  | "no-billing"
  | "no-user"
  | "no-delivery-method"
  | "unnecessary-delivery-method";

export interface TaskDraftFinalizeDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  taskNumber: string;
  warnings: TaskDraftFinalizeWarning[];
  onClose: () => void;
  onConfirm: () => void;
}

const warningToText = (warning: TaskDraftFinalizeWarning) => {
  switch (warning) {
    case "no-delivery":
      return i18n.t("No delivery address");
    case "no-billing":
      return i18n.t("No billing address");
    case "no-user":
      return i18n.t("No user information");
    case "no-delivery-method":
      return i18n.t("Some skills require delivery, but no method provided");
    case "unnecessary-delivery-method":
      return i18n.t("Delivery method provided, but no skill requires it");
  }
};

const TaskDraftFinalizeDialog: React.StatelessComponent<
  TaskDraftFinalizeDialogProps
> = ({
  confirmButtonState,
  open,
  warnings,
  onClose,
  onConfirm,
  taskNumber
}) => (
  <ActionDialog
    onClose={onClose}
    onConfirm={onConfirm}
    open={open}
    title={i18n.t("Finalize draft task", {
      context: "modal title"
    })}
    confirmButtonLabel={
      warnings.length > 0 ? i18n.t("Finalize anyway") : i18n.t("Finalize")
    }
    confirmButtonState={confirmButtonState}
    variant={warnings.length > 0 ? "delete" : "default"}
  >
    <DialogContentText component="div">
      {warnings.length > 0 && (
        <>
          <p>
            {i18n.t(
              "There are missing or incorrect informations about this task:"
            )}
          </p>
          <ul>
            {warnings.map(warning => (
              <li key={warning}>{warningToText(warning)}</li>
            ))}
          </ul>
        </>
      )}
      <span
        dangerouslySetInnerHTML={{
          __html: i18n.t(
            "Are you sure you want to finalize draft <strong>#{{ number }}</strong>?",
            {
              context: "modal",
              number: taskNumber
            }
          )
        }}
      />
    </DialogContentText>
  </ActionDialog>
);
TaskDraftFinalizeDialog.displayName = "TaskDraftFinalize";
export default TaskDraftFinalizeDialog;
