import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import * as React from "react";

import ConfirmButton, {
  ConfirmButtonTransitionState
} from "../../../components/ConfirmButton/ConfirmButton";
import ControlledCheckbox from "../../../components/ControlledCheckbox";
import Form from "../../../components/Form";
import i18n from "../../../i18n";

export interface FormData {
  reavailability: boolean;
}

const styles = (theme: Theme) =>
  createStyles({
    deleteButton: {
      "&:hover": {
        backgroundColor: theme.palette.error.main
      },
      backgroundColor: theme.palette.error.main,
      color: theme.palette.error.contrastText
    }
  });

interface TaskCancelDialogProps extends WithStyles<typeof styles> {
  confirmButtonState: ConfirmButtonTransitionState;
  number: string;
  open: boolean;
  onClose?();
  onSubmit(data: FormData);
}

const TaskCancelDialog = withStyles(styles, { name: "TaskCancelDialog" })(
  ({
    classes,
    confirmButtonState,
    number: taskNumber,
    open,
    onSubmit,
    onClose
  }: TaskCancelDialogProps) => (
    <Dialog open={open}>
      <Form
        initial={{
          reavailability: true
        }}
        onSubmit={onSubmit}
      >
        {({ data, change }) => {
          return (
            <>
              <DialogTitle>
                {i18n.t("Cancel task", { context: "title" })}
              </DialogTitle>
              <DialogContent>
                <DialogContentText
                  dangerouslySetInnerHTML={{
                    __html: i18n.t(
                      "Are you sure you want to cancel task <strong>{{ taskNumber }}</strong>?",
                      { taskNumber }
                    )
                  }}
                />
                <ControlledCheckbox
                  checked={data.reavailability}
                  label={i18n.t("Release all availability allocated to this task")}
                  name="reavailability"
                  onChange={change}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={onClose}>
                  {i18n.t("Back", { context: "button" })}
                </Button>
                <ConfirmButton
                  transitionState={confirmButtonState}
                  className={classes.deleteButton}
                  variant="contained"
                  type="submit"
                >
                  {i18n.t("Cancel task", { context: "button" })}
                </ConfirmButton>
              </DialogActions>
            </>
          );
        }}
      </Form>
    </Dialog>
  )
);
TaskCancelDialog.displayName = "TaskCancelDialog";
export default TaskCancelDialog;
