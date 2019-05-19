import { storiesOf } from "@storybook/react";
import * as React from "react";

import TaskPaymentDialog from "../../../tasks/components/TaskPaymentDialog";
import Decorator from "../../Decorator";

storiesOf("Tasks / TaskPaymentDialog", module)
  .addDecorator(Decorator)
  .add("capture payment", () => (
    <TaskPaymentDialog
      confirmButtonState="default"
      initial={0}
      variant="capture"
      open={true}
      onClose={undefined}
      onSubmit={undefined}
    />
  ))
  .add("refund payment", () => (
    <TaskPaymentDialog
      confirmButtonState="default"
      initial={0}
      variant="refund"
      open={true}
      onClose={undefined}
      onSubmit={undefined}
    />
  ));
