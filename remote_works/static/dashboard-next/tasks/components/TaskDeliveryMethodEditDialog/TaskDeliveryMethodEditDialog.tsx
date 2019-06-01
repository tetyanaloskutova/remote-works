import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
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
} from "../../../components/ConfirmButton";
import Form from "../../../components/Form";
import Money from "../../../components/Money";
import { SingleSelectField } from "../../../components/SingleSelectField";
import i18n from "../../../i18n";
import { TaskDetails_task_availableDeliveryMethods } from "../../types/TaskDetails";

export interface FormData {
  deliveryMethod: string;
}

const styles = (theme: Theme) =>
  createStyles({
    dialog: {
      overflowY: "visible"
    },
    menuItem: {
      display: "flex",
      width: "100%"
    },
    root: {
      overflowY: "visible",
      width: theme.breakpoints.values.sm
    },
    deliveryMethodName: {
      flex: 1,
      overflowX: "hidden",
      textOverflow: "ellipsis"
    }
  });

interface TaskDeliveryMethodEditDialogProps extends WithStyles<typeof styles> {
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  deliveryMethod: string;
  deliveryMethods?: TaskDetails_task_availableDeliveryMethods[];
  onClose();
  onSubmit?(data: FormData);
}

const TaskDeliveryMethodEditDialog = withStyles(styles, {
  name: "TaskDeliveryMethodEditDialog"
})(
  ({
    classes,
    confirmButtonState,
    open,
    deliveryMethod,
    deliveryMethods,
    onClose,
    onSubmit
  }: TaskDeliveryMethodEditDialogProps) => {
    const choices = deliveryMethods
      ? deliveryMethods.map(s => ({
          label: (
            <div className={classes.menuItem}>
              <span className={classes.deliveryMethodName}>{s.name}</span>
              &nbsp;
              <span>
                <Money money={s.price} />
              </span>
            </div>
          ),
          value: s.id
        }))
      : [];
    const initialForm: FormData = {
      deliveryMethod
    };
    return (
      <Dialog open={open} classes={{ paper: classes.dialog }}>
        <DialogTitle>
          {i18n.t("Edit delivery method", { context: "title" })}
        </DialogTitle>
        <Form initial={initialForm} onSubmit={onSubmit}>
          {({ change, data }) => (
            <>
              <DialogContent className={classes.root}>
                <SingleSelectField
                  choices={choices}
                  name="deliveryMethod"
                  value={data.deliveryMethod}
                  onChange={change}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={onClose}>
                  {i18n.t("Cancel", { context: "button" })}
                </Button>
                <ConfirmButton
                  transitionState={confirmButtonState}
                  color="primary"
                  variant="contained"
                  type="submit"
                >
                  {i18n.t("Confirm", { context: "button" })}
                </ConfirmButton>
              </DialogActions>
            </>
          )}
        </Form>
      </Dialog>
    );
  }
);
TaskDeliveryMethodEditDialog.displayName = "TaskDeliveryMethodEditDialog";
export default TaskDeliveryMethodEditDialog;
