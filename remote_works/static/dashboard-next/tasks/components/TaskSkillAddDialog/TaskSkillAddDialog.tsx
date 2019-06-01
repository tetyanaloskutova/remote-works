import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import CircularProgress from "@material-ui/core/CircularProgress";
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
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import * as React from "react";
import * as InfiniteScroll from "react-infinite-scroller";

import ConfirmButton, {
  ConfirmButtonTransitionState
} from "../../../components/ConfirmButton";
import Debounce from "../../../components/Debounce";
import Form from "../../../components/Form";
import Money from "../../../components/Money";
import TableCellAvatar from "../../../components/TableCellAvatar";
import i18n from "../../../i18n";
import { maybe, renderCollection } from "../../../misc";
import {
  TaskVariantSearch_skills_edges_node,
  TaskVariantSearch_skills_edges_node_variants
} from "../../types/TaskVariantSearch";

export interface FormData {
  variants: TaskVariantSearch_skills_edges_node_variants[];
  query: string;
}

const styles = (theme: Theme) =>
  createStyles({
    avatar: {
      paddingLeft: 0
    },
    content: {
      maxHeight: 600,
      overflowY: "scroll"
    },
    grayText: {
      color: theme.palette.text.disabled
    },
    loadMoreLoaderContainer: {
      alignItems: "center",
      display: "flex",
      height: theme.spacing.unit * 3,
      justifyContent: "center"
    },
    overflow: {
      overflowY: "visible"
    },
    skillCheckboxCell: {
      "&:first-child": {
        paddingLeft: 0,
        paddingRight: 0
      }
    },
    textRight: {
      textAlign: "right"
    },
    variantCheckbox: {
      paddingLeft: theme.spacing.unit
    },
    wideCell: {
      width: "100%"
    }
  });

interface TaskSkillAddDialogProps extends WithStyles<typeof styles> {
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  skills: TaskVariantSearch_skills_edges_node[];
  loading: boolean;
  hasMore: boolean;
  onClose: () => void;
  onFetch: (value: string) => void;
  onFetchMore: () => void;
  onSubmit: (data: FormData) => void;
}

const initialForm: FormData = {
  query: "",
  variants: []
};

function hasAllVariantsSelected(
  skillVariants: TaskVariantSearch_skills_edges_node_variants[],
  selectedVariants: TaskVariantSearch_skills_edges_node_variants[]
): boolean {
  return skillVariants.reduce(
    (acc, skillVariant) =>
      acc &&
      !!selectedVariants.find(
        selectedVariant => selectedVariant.id === skillVariant.id
      ),
    true
  );
}

function isVariantSelected(
  variant: TaskVariantSearch_skills_edges_node_variants,
  selectedVariants: TaskVariantSearch_skills_edges_node_variants[]
): boolean {
  return !!selectedVariants.find(
    selectedVariant => selectedVariant.id === variant.id
  );
}

const TaskSkillAddDialog = withStyles(styles, {
  name: "TaskSkillAddDialog"
})(
  ({
    classes,
    confirmButtonState,
    open,
    loading,
    hasMore,
    skills,
    onFetch,
    onFetchMore,
    onClose,
    onSubmit
  }: TaskSkillAddDialogProps) => (
    <Dialog
      open={open}
      classes={{ paper: classes.overflow }}
      fullWidth
      maxWidth="sm"
    >
      <Form initial={initialForm} onSubmit={onSubmit}>
        {({ data, change }) => {
          const selectedVariants = skills
            ? skills.map(skill =>
                skill.variants.map(variant =>
                  isVariantSelected(variant, data.variants)
                )
              )
            : [];
          const selectedSkills = skills
            ? skills.map(skill =>
                hasAllVariantsSelected(skill.variants, data.variants)
              )
            : [];

          const onSkillAdd = (
            skill: TaskVariantSearch_skills_edges_node,
            skillIndex: number
          ) =>
            selectedSkills[skillIndex]
              ? change({
                  target: {
                    name: "variants",
                    value: data.variants.filter(
                      selectedVariant =>
                        !skill.variants.find(
                          skillVariant =>
                            skillVariant.id === selectedVariant.id
                        )
                    )
                  }
                } as any)
              : change({
                  target: {
                    name: "variants",
                    value: [
                      ...data.variants,
                      ...skill.variants.filter(
                        skillVariant =>
                          !data.variants.find(
                            selectedVariant =>
                              selectedVariant.id === skillVariant.id
                          )
                      )
                    ]
                  }
                } as any);
          const onVariantAdd = (
            variant: TaskVariantSearch_skills_edges_node_variants,
            variantIndex: number,
            skillIndex: number
          ) =>
            selectedVariants[skillIndex][variantIndex]
              ? change({
                  target: {
                    name: "variants",
                    value: data.variants.filter(
                      selectedVariant => selectedVariant.id !== variant.id
                    )
                  }
                } as any)
              : change({
                  target: {
                    name: "variants",
                    value: [...data.variants, variant]
                  }
                } as any);

          return (
            <>
              <DialogTitle>{i18n.t("Add skill")}</DialogTitle>
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
              </DialogContent>
              <DialogContent className={classes.content}>
                <InfiniteScroll
                  pageStart={0}
                  loadMore={onFetchMore}
                  hasMore={hasMore}
                  useWindow={false}
                  loader={
                    <div className={classes.loadMoreLoaderContainer}>
                      <CircularProgress size={16} />
                    </div>
                  }
                  threshold={10}
                >
                  <Table key="table">
                    <TableBody>
                      {renderCollection(
                        skills,
                        (skill, skillIndex) => (
                          <React.Fragment
                            key={skill ? skill.id : "skeleton"}
                          >
                            <TableRow>
                              <TableCell
                                padding="checkbox"
                                className={classes.skillCheckboxCell}
                              >
                                <Checkbox
                                  checked={selectedSkills[skillIndex]}
                                  disabled={loading}
                                  onChange={() =>
                                    onSkillAdd(skill, skillIndex)
                                  }
                                />
                              </TableCell>
                              <TableCellAvatar
                                className={classes.avatar}
                                thumbnail={maybe(() => skill.thumbnail.url)}
                              />
                              <TableCell
                                className={classes.wideCell}
                                colSpan={2}
                              >
                                {maybe(() => skill.name)}
                              </TableCell>
                            </TableRow>
                            {maybe(() => skill.variants, []).map(
                              (variant, variantIndex) => (
                                <TableRow key={variant.id}>
                                  <TableCell />
                                  <TableCell>
                                    <Checkbox
                                      className={classes.variantCheckbox}
                                      checked={
                                        selectedVariants[skillIndex][
                                          variantIndex
                                        ]
                                      }
                                      disabled={loading}
                                      onChange={() =>
                                        onVariantAdd(
                                          variant,
                                          variantIndex,
                                          skillIndex
                                        )
                                      }
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <div>{variant.name}</div>
                                    <div className={classes.grayText}>
                                      {i18n.t("SKU {{ sku }}", {
                                        sku: variant.sku
                                      })}
                                    </div>
                                  </TableCell>
                                  <TableCell className={classes.textRight}>
                                    <Money money={variant.price} />
                                  </TableCell>
                                </TableRow>
                              )
                            )}
                          </React.Fragment>
                        ),
                        () => (
                          <TableRow>
                            <TableCell colSpan={4}>
                              {i18n.t("No skills matching given query")}
                            </TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                </InfiniteScroll>
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
          );
        }}
      </Form>
    </Dialog>
  )
);
TaskSkillAddDialog.displayName = "TaskSkillAddDialog";
export default TaskSkillAddDialog;
