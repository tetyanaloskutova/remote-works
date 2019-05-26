import { storiesOf } from "@storybook/react";
import * as React from "react";

import TaskPaymentVoidDialog from "../../../tasks/components/TaskPaymentVoidDialog";
import Decorator from "../../Decorator";

storiesOf("Tasks / TaskPaymentVoidDialog", module)
  .addDecorator(Decorator)
  .add("default", () => (
    <TaskPaymentVoidDialog
      confirmButtonState="default"
      open={true}
      onConfirm={undefined}
      onClose={undefined}
    />
  ));
