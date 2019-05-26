import { Omit } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import * as placeholderImage from "../../../../images/placeholder60x60.png";
import TaskFulfillmentDialog, {
  TaskFulfillmentDialogProps
} from "../../../tasks/components/TaskFulfillmentDialog";
import { task as orderFixture } from "../../../tasks/fixtures";
import Decorator from "../../Decorator";

const task = orderFixture(placeholderImage);

const props: Omit<TaskFulfillmentDialogProps, "classes"> = {
  confirmButtonState: "default",
  lines: task.lines,
  onClose: undefined,
  onSubmit: undefined,
  open: true
};

storiesOf("Tasks / TaskFulfillmentDialog", module)
  .addDecorator(Decorator)
  .add("default", () => <TaskFulfillmentDialog {...props} />);
