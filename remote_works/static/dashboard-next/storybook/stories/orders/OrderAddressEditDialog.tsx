import { storiesOf } from "@storybook/react";
import * as React from "react";

import { transformAddressToForm } from "../../../misc";
import TaskAddressEditDialog from "../../../tasks/components/TaskAddressEditDialog";
import { countries, order as orderFixture } from "../../../tasks/fixtures";
import Decorator from "../../Decorator";

const order = orderFixture("");

storiesOf("Tasks / TaskAddressEditDialog", module)
  .addDecorator(Decorator)
  .add("delivery address", () => (
    <TaskAddressEditDialog
      confirmButtonState="default"
      address={transformAddressToForm(order.deliveryAddress)}
      countries={countries}
      errors={[]}
      onClose={() => undefined}
      onConfirm={() => undefined}
      open={true}
      variant="delivery"
    />
  ))
  .add("billing address", () => (
    <TaskAddressEditDialog
      confirmButtonState="default"
      address={transformAddressToForm(order.billingAddress)}
      countries={countries}
      errors={[]}
      onClose={() => undefined}
      onConfirm={() => undefined}
      open={true}
      variant="billing"
    />
  ));
