import { storiesOf } from "@storybook/react";
import * as React from "react";

import TaskDraftFinalize, {
  TaskDraftFinalizeDialogProps
} from "../../../tasks/components/TaskDraftFinalizeDialog";
import Decorator from "../../Decorator";

const props: TaskDraftFinalizeDialogProps = {
  confirmButtonState: "default",
  onClose: () => undefined,
  onConfirm: () => undefined,
  open: true,
  taskNumber: "5",
  warnings: []
};

storiesOf("Tasks / TaskDraftFinalizeDialog", module)
  .addDecorator(Decorator)
  .add("default", () => <TaskDraftFinalize {...props} />)
  .add("with warnings", () => (
    <TaskDraftFinalize
      {...props}
      warnings={["no-delivery-method", "no-delivery", "no-billing", "no-user"]}
    />
  ));
