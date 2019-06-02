import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import * as React from "react";

import { CardMenu } from "../../../components/CardMenu/CardMenu";
import { ConfirmButtonTransitionState } from "../../../components/ConfirmButton/ConfirmButton";
import { Container } from "../../../components/Container";
import { DateTime } from "../../../components/Date";
import Grid from "../../../components/Grid";
import PageHeader from "../../../components/PageHeader";
import SaveButtonBar from "../../../components/SaveButtonBar";
import Skeleton from "../../../components/Skeleton";
import i18n from "../../../i18n";
import { maybe } from "../../../misc";
import { DraftTaskInput } from "../../../types/globalTypes";
import { TaskDetails_task } from "../../types/TaskDetails";
import { UserSearch_customers_edges_node } from "../../types/UserSearch";
import TaskCustomer from "../TaskCustomer";
import TaskDraftDetails from "../TaskDraftDetails/TaskDraftDetails";
import { FormData as TaskDraftDetailsSkillsFormData } from "../TaskDraftDetailsSkills";
import TaskHistory, { FormData as HistoryFormData } from "../TaskHistory";

const styles = (theme: Theme) =>
  createStyles({
    date: {
      marginBottom: theme.spacing.unit * 3,
      marginLeft: theme.spacing.unit * 7
    },
    header: {
      marginBottom: 0
    },
    menu: {
      marginRight: -theme.spacing.unit
    }
  });

export interface TaskDraftPageProps extends WithStyles<typeof styles> {
  disabled: boolean;
  task: TaskDetails_task;
  users: UserSearch_customers_edges_node[];
  usersLoading: boolean;
  countries: Array<{
    code: string;
    label: string;
  }>;
  saveButtonBarState: ConfirmButtonTransitionState;
  fetchUsers: (query: string) => void;
  onBack: () => void;
  onBillingAddressEdit: () => void;
  onCustomerEdit: (data: DraftTaskInput) => void;
  onDraftFinalize: () => void;
  onDraftRemove: () => void;
  onNoteAdd: (data: HistoryFormData) => void;
  onTaskLineAdd: () => void;
  onTaskLineChange: (
    id: string,
    data: TaskDraftDetailsSkillsFormData
  ) => void;
  onTaskLineRemove: (id: string) => void;
  onSkillClick: (id: string) => void;
  onDeliveryAddressEdit: () => void;
  onDeliveryMethodEdit: () => void;
}

const TaskDraftPage = withStyles(styles, { name: "TaskDraftPage" })(
  ({
    classes,
    disabled,
    fetchUsers,
    saveButtonBarState,
    onBack,
    onBillingAddressEdit,
    onCustomerEdit,
    onDraftFinalize,
    onDraftRemove,
    onNoteAdd,
    onTaskLineAdd,
    onTaskLineChange,
    onTaskLineRemove,
    onDeliveryAddressEdit,
    onDeliveryMethodEdit,
    task,
    users,
    usersLoading
  }: TaskDraftPageProps) => (
    <Container width="md">
      <PageHeader
        className={classes.header}
        title={maybe(() => task.number) ? "#" + task.number : undefined}
        onBack={onBack}
      >
        <CardMenu
          className={classes.menu}
          menuItems={[
            {
              label: i18n.t("Cancel task", { context: "button" }),
              onSelect: onDraftRemove
            }
          ]}
        />
      </PageHeader>
      <div className={classes.date}>
        {task && task.created ? (
          <Typography variant="caption">
            <DateTime date={task.created} />
          </Typography>
        ) : (
          <Skeleton style={{ width: "10em" }} />
        )}
      </div>
      <Grid>
        <div>
          <TaskDraftDetails
            task={task}
            onTaskLineAdd={onTaskLineAdd}
            onTaskLineChange={onTaskLineChange}
            onTaskLineRemove={onTaskLineRemove}
            onDeliveryMethodEdit={onDeliveryMethodEdit}
          />
          <TaskHistory
            history={maybe(() => task.events)}
            onNoteAdd={onNoteAdd}
          />
        </div>
        <div>
          <TaskCustomer
            canEditAddresses={true}
            canEditCustomer={true}
            task={task}
            users={users}
            loading={usersLoading}
            fetchUsers={fetchUsers}
            onBillingAddressEdit={onBillingAddressEdit}
            onCustomerEdit={onCustomerEdit}
            onDeliveryAddressEdit={onDeliveryAddressEdit}
          />
        </div>
      </Grid>
      <SaveButtonBar
        state={saveButtonBarState}
        disabled={disabled || !maybe(() => task.canFinalize)}
        onCancel={onBack}
        onSave={onDraftFinalize}
        labels={{ save: i18n.t("Finalize", { context: "button" }) }}
      />
    </Container>
  )
);
TaskDraftPage.displayName = "TaskDraftPage";
export default TaskDraftPage;
