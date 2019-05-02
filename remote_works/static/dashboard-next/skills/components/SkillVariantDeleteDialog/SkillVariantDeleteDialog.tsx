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
import i18n from "../../../i18n";

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

export interface SkillVariantDeleteDialogProps
  extends WithStyles<typeof styles> {
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  name: string;
  onClose?();
  onConfirm?();
}

const SkillVariantDeleteDialog = withStyles(styles, {
  name: "SkillVariantDeleteDialog"
})(
  ({
    classes,
    confirmButtonState,
    name,
    open,
    onConfirm,
    onClose
  }: SkillVariantDeleteDialogProps) => (
    <Dialog open={open}>
      <DialogTitle>
        {i18n.t("Delete variant", { context: "title" })}
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          dangerouslySetInnerHTML={{
            __html: i18n.t(
              "Are you sure you want to remove <strong>{{name}}</strong>?",
              { name }
            )
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          {i18n.t("Cancel", { context: "button" })}
        </Button>
        <ConfirmButton
          transitionState={confirmButtonState}
          className={classes.deleteButton}
          variant="contained"
          onClick={onConfirm}
        >
          {i18n.t("Delete variant", { context: "button" })}
        </ConfirmButton>
      </DialogActions>
    </Dialog>
  )
);
SkillVariantDeleteDialog.displayName = "SkillVariantDeleteDialog";
export default SkillVariantDeleteDialog;
