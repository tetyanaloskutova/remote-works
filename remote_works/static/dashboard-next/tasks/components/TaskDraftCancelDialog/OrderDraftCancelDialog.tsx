import DialogContentText from "@material-ui/core/DialogContentText";
import * as React from "react";

import ActionDialog from "../../../components/ActionDialog";
import { ConfirmButtonTransitionState } from "../../../components/ConfirmButton/ConfirmButton";
import i18n from "../../../i18n";

export interface TaskDraftCancelDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  orderNumber: string;
}

const TaskDraftCancelDialog: React.StatelessComponent<
  TaskDraftCancelDialogProps
> = ({ confirmButtonState, onClose, onConfirm, open, orderNumber }) => (
  <ActionDialog
    confirmButtonState={confirmButtonState}
    onClose={onClose}
    onConfirm={onConfirm}
    open={open}
    title={i18n.t("Remove draft task", {
      context: "modal title"
    })}
    variant="delete"
  >
    <DialogContentText
      dangerouslySetInnerHTML={{
        __html: i18n.t(
          "Are you sure you want to remove draft <strong>#{{ number }}</strong>?",
          {
            context: "modal",
            number: orderNumber
          }
        )
      }}
    />
  </ActionDialog>
);
TaskDraftCancelDialog.displayName = "TaskDraftCancelDialog";
export default TaskDraftCancelDialog;
