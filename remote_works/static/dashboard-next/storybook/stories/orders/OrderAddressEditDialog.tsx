import { storiesOf } from "@storybook/react";
import * as React from "react";

import { transformAddressToForm } from "../../../misc";
import TaskAddressEditDialog from "../../../tasks/components/TaskAddressEditDialog";
import { countries, task as orderFixture } from "../../../tasks/fixtures";
import Decorator from "../../Decorator";

const task = orderFixture("");

storiesOf("Tasks / TaskAddressEditDialog", module)
  .addDecorator(Decorator)
  .add("delivery address", () => (
    <TaskAddressEditDialog
      confirmButtonState="default"
      address={transformAddressToForm(task.deliveryAddress)}
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
      address={transformAddressToForm(task.billingAddress)}
      countries={countries}
      errors={[]}
      onClose={() => undefined}
      onConfirm={() => undefined}
      open={true}
      variant="billing"
    />
  ));
