import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import * as React from "react";

import CardTitle from "../../../components/CardTitle";
import i18n from "../../../i18n";
import { maybe } from "../../../misc";
import { TaskDetails_task } from "../../types/TaskDetails";
import TaskDraftDetailsSkills, {
  FormData as TaskDraftDetailsSkillsFormData
} from "../TaskDraftDetailsSkills";
import TaskDraftDetailsSummary from "../TaskDraftDetailsSummary/TaskDraftDetailsSummary";

interface TaskDraftDetailsProps {
  task: TaskDetails_task;
  onTaskLineAdd: () => void;
  onTaskLineChange: (
    id: string,
    data: TaskDraftDetailsSkillsFormData
  ) => void;
  onTaskLineRemove: (id: string) => void;
  onDeliveryMethodEdit: () => void;
}

const TaskDraftDetails: React.StatelessComponent<TaskDraftDetailsProps> = ({
  task,
  onTaskLineAdd,
  onTaskLineChange,
  onTaskLineRemove,
  onDeliveryMethodEdit
}) => (
  <Card>
    <CardTitle
      title={i18n.t("Task details", {
        context: "card title"
      })}
      toolbar={
        <Button color="secondary" variant="text" onClick={onTaskLineAdd}>
          {i18n.t("Add skills", {
            context: "button"
          })}
        </Button>
      }
    />
    <TaskDraftDetailsSkills
      lines={maybe(() => task.lines)}
      onTaskLineChange={onTaskLineChange}
      onTaskLineRemove={onTaskLineRemove}
    />
    {maybe(() => task.lines.length) !== 0 && (
      <CardContent>
        <TaskDraftDetailsSummary
          task={task}
          onDeliveryMethodEdit={onDeliveryMethodEdit}
        />
      </CardContent>
    )}
  </Card>
);
TaskDraftDetails.displayName = "TaskDraftDetails";
export default TaskDraftDetails;
