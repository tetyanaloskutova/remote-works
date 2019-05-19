import { storiesOf } from "@storybook/react";
import * as React from "react";

import TaskCustomerEditDialog from "../../../tasks/components/TaskCustomerEditDialog";
import { clients as users } from "../../../tasks/fixtures";
import Decorator from "../../Decorator";

const user = users[0];

storiesOf("Tasks / TaskCustomerEditDialog", module)
  .addDecorator(Decorator)
  .add("default", () => (
    <TaskCustomerEditDialog
      confirmButtonState="default"
      fetchUsers={undefined}
      onChange={undefined}
      onClose={undefined}
      onConfirm={undefined}
      open={true}
      user={{
        label: user.email,
        value: user.id
      }}
      users={users}
    />
  ));
