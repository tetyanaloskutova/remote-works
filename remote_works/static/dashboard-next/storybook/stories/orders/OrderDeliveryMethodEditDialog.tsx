import { storiesOf } from "@storybook/react";
import * as React from "react";

import TaskDeliveryMethodEditDialog from "../../../tasks/components/TaskDeliveryMethodEditDialog";
import { task as taskFixture } from "../../../tasks/fixtures";
import Decorator from "../../Decorator";

const task = taskFixture("");

storiesOf("Tasks / TaskDeliveryMethodEditDialog", module)
  .addDecorator(Decorator)
  .add("default", () => (
    <TaskDeliveryMethodEditDialog
      confirmButtonState="default"
      onClose={undefined}
      onSubmit={undefined}
      open={true}
      deliveryMethod={null}
      deliveryMethods={task.availableDeliveryMethods}
    />
  ));
