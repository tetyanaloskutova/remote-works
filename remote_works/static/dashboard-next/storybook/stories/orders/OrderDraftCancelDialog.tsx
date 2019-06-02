import { storiesOf } from "@storybook/react";
import * as React from "react";

import TaskDraftCancelDialog, {
  TaskDraftCancelDialogProps
} from "../../../tasks/components/TaskDraftCancelDialog";
import Decorator from "../../Decorator";

const props: TaskDraftCancelDialogProps = {
  confirmButtonState: "default",
  onClose: () => undefined,
  onConfirm: () => undefined,
  open: true,
  taskNumber: "4"
};

storiesOf("Tasks / TaskDraftCancelDialog", module)
  .addDecorator(Decorator)
  .add("default", () => <TaskDraftCancelDialog {...props} />);
