import { storiesOf } from "@storybook/react";
import * as React from "react";

import TaskMarkAsPaidDialog, {
  TaskMarkAsPaidDialogProps
} from "../../../tasks/components/TaskMarkAsPaidDialog";
import Decorator from "../../Decorator";

const props: TaskMarkAsPaidDialogProps = {
  confirmButtonState: "default",
  onClose: () => undefined,
  onConfirm: () => undefined,
  open: true
};

storiesOf("Tasks / TaskMarkAsPaidDialog", module)
  .addDecorator(Decorator)
  .add("default", () => <TaskMarkAsPaidDialog {...props} />);
