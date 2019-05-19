import { storiesOf } from "@storybook/react";
import * as React from "react";

import TaskFulfillmentTrackingDialog from "../../../tasks/components/TaskFulfillmentTrackingDialog";
import Decorator from "../../Decorator";

storiesOf("Tasks / TaskFulfillmentTrackingDialog", module)
  .addDecorator(Decorator)
  .add("default", () => (
    <TaskFulfillmentTrackingDialog
      confirmButtonState="default"
      open={true}
      trackingNumber="21kn7526v1"
      onConfirm={undefined}
      onClose={undefined}
    />
  ));
