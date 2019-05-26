import { storiesOf } from "@storybook/react";
import * as React from "react";

import TaskFulfillmentCancelDialog from "../../../tasks/components/TaskFulfillmentCancelDialog";
import Decorator from "../../Decorator";

storiesOf("Tasks / TaskFulfillmentCancelDialog", module)
  .addDecorator(Decorator)
  .add("default", () => (
    <TaskFulfillmentCancelDialog
      confirmButtonState="default"
      open={true}
      onConfirm={undefined}
      onClose={undefined}
    />
  ));
