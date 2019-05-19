import { storiesOf } from "@storybook/react";
import * as React from "react";

import TaskCancelDialog from "../../../tasks/components/TaskCancelDialog";
import Decorator from "../../Decorator";

storiesOf("Tasks / TaskCancelDialog", module)
  .addDecorator(Decorator)
  .add("default", () => (
    <TaskCancelDialog
      confirmButtonState="default"
      open={true}
      number="123"
      onSubmit={undefined}
      onClose={undefined}
    />
  ));
