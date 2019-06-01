import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import * as React from "react";

import ConfirmButton, {
  ConfirmButtonTransitionState
} from "../../components/ConfirmButton/ConfirmButton";
import Debounce from "../../components/Debounce";
import Form from "../../components/Form";
import FormSpacer from "../../components/FormSpacer";
import TableCellAvatar from "../../components/TableCellAvatar";
import { SearchSkills_skills_edges_node } from "../../containers/SearchSkills/types/SearchSkills";
import i18n from "../../i18n";

export interface FormData {
  skills: SearchSkills_skills_edges_node[];
  query: string;
}

const styles = createStyles({
  avatar: {
    "&:first-child": {
      paddingLeft: 0
    }
  },
  checkboxCell: {
    paddingLeft: 0
  },
  overflow: {
    overflowY: "visible"
  },
  wideCell: {
    width: "100%"
  }
});

interface AssignSkillDialogProps extends WithStyles<typeof styles> {
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  skills: SearchSkills_skills_edges_node[];
  loading: boolean;
  onClose: () => void;
  onFetch: (value: string) => void;
  onSubmit: (data: FormData) => void;
}

const initialForm: FormData = {
  skills: [],
  query: ""
};
const AssignSkillDialog = withStyles(styles, {
  name: "AssignSkillDialog"
})(
  ({
    classes,
    confirmButtonState,
    open,
    loading,
    skills,
    onClose,
    onFetch,
    onSubmit
  }: AssignSkillDialogProps) => (
    <Dialog
      open={open}
      classes={{ paper: classes.overflow }}
      fullWidth
      maxWidth="sm"
    >
      <Form initial={initialForm} onSubmit={onSubmit}>
        {({ data, change }) => (
          <>
            <DialogTitle>{i18n.t("Assign Skill")}</DialogTitle>
            <DialogContent className={classes.overflow}>
              <Debounce debounceFn={onFetch}>
                {fetch => (
                  <TextField
                    name="query"
                    value={data.query}
                    onChange={event => change(event, () => fetch(data.query))}
                    label={i18n.t("Search Skills", {
                      context: "skill search input label"
                    })}
                    placeholder={i18n.t(
                      "Search by skill name, attribute, skill type etc...",
                      {
                        context: "skill search input placeholder"
                      }
                    )}
                    fullWidth
                    InputProps={{
                      autoComplete: "off",
                      endAdornment: loading && <CircularProgress size={16} />
                    }}
                  />
                )}
              </Debounce>
              <FormSpacer />
              <Table>
                <TableBody>
                  {skills &&
                    skills.map(skill => {
                      const isChecked = !!data.skills.find(
                        selectedSkill => selectedSkill.id === skill.id
                      );

                      return (
                        <TableRow key={skill.id}>
                          <TableCellAvatar
                            className={classes.avatar}
                            thumbnail={skill.thumbnail.url}
                          />
                          <TableCell className={classes.wideCell}>
                            {skill.name}
                          </TableCell>
                          <TableCell
                            padding="checkbox"
                            className={classes.checkboxCell}
                          >
                            <Checkbox
                              checked={isChecked}
                              onChange={() =>
                                isChecked
                                  ? change({
                                      target: {
                                        name: "skills",
                                        value: data.skills.filter(
                                          selectedSkill =>
                                            selectedSkill.id !== skill.id
                                        )
                                      }
                                    } as any)
                                  : change({
                                      target: {
                                        name: "skills",
                                        value: [...data.skills, skill]
                                      }
                                    } as any)
                              }
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
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
                {i18n.t("Assign skills", { context: "button" })}
              </ConfirmButton>
            </DialogActions>
          </>
        )}
      </Form>
    </Dialog>
  )
);
AssignSkillDialog.displayName = "AssignSkillDialog";
export default AssignSkillDialog;
