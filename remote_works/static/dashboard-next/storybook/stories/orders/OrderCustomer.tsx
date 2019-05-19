import { Omit } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import TaskCustomer, {
  TaskCustomerProps
} from "../../../tasks/components/TaskCustomer";
import { clients, order as orderFixture } from "../../../tasks/fixtures";
import Decorator from "../../Decorator";

const order = orderFixture("");

const props: Omit<TaskCustomerProps, "classes"> = {
  canEditAddresses: false,
  canEditCustomer: true,
  fetchUsers: () => undefined,
  onBillingAddressEdit: undefined,
  onCustomerEdit: undefined,
  onDeliveryAddressEdit: undefined,
  order,
  users: clients
};

storiesOf("Tasks / TaskCustomer", module)
  .addDecorator(Decorator)
  .add("default", () => <TaskCustomer {...props} />)
  .add("loading", () => <TaskCustomer {...props} order={undefined} />)
  .add("with different addresses", () => (
    <TaskCustomer
      {...props}
      order={{
        ...order,
        deliveryAddress: { ...order.deliveryAddress, id: "a2" }
      }}
    />
  ))
  .add("editable", () => (
    <TaskCustomer {...props} canEditAddresses={true} canEditCustomer={true} />
  ));
