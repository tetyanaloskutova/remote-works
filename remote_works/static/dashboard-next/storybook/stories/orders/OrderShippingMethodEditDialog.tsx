import { storiesOf } from "@storybook/react";
import * as React from "react";

import TaskDeliveryMethodEditDialog from "../../../tasks/components/TaskDeliveryMethodEditDialog";
import { order as orderFixture } from "../../../tasks/fixtures";
import Decorator from "../../Decorator";

const order = orderFixture("");

storiesOf("Tasks / TaskDeliveryMethodEditDialog", module)
  .addDecorator(Decorator)
  .add("default", () => (
    <TaskDeliveryMethodEditDialog
      confirmButtonState="default"
      onClose={undefined}
      onSubmit={undefined}
      open={true}
      deliveryMethod={null}
      deliveryMethods={order.availableDeliveryMethods}
    />
  ));
