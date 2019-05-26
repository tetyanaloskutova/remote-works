import DialogContentText from "@material-ui/core/DialogContentText";
import * as React from "react";

import ActionDialog from "../../../components/ActionDialog";
import { ConfirmButtonTransitionState } from "../../../components/ConfirmButton/ConfirmButton";
import i18n from "../../../i18n";

export interface TaskMarkAsPaidDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const TaskMarkAsPaidDialog: React.StatelessComponent<
  TaskMarkAsPaidDialogProps
> = ({ confirmButtonState, onClose, onConfirm, open }) => (
  <ActionDialog
    confirmButtonState={confirmButtonState}
    open={open}
    title={i18n.t("Mark task as paid")}
    onClose={onClose}
    onConfirm={onConfirm}
  >
    <DialogContentText>
      {i18n.t("Are you sure you want to mark this task as paid?", {
        context: "modal content"
      })}
    </DialogContentText>
  </ActionDialog>
);
TaskMarkAsPaidDialog.displayName = "TaskMarkAsPaidDialog";
export default TaskMarkAsPaidDialog;
