import { storiesOf } from "@storybook/react";
import * as React from "react";

import TaskHistory from "../../../tasks/components/TaskHistory";
import { task as orderFixture } from "../../../tasks/fixtures";
import Decorator from "../../Decorator";

const task = orderFixture("");

storiesOf("Tasks / TaskHistory", module)
  .addDecorator(Decorator)
  .add("default", () => (
    <TaskHistory onNoteAdd={undefined} history={task.events} />
  ));
