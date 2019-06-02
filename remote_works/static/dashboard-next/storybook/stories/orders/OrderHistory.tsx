import { storiesOf } from "@storybook/react";
import * as React from "react";

import TaskHistory from "../../../tasks/components/TaskHistory";
import { task as taskFixture } from "../../../tasks/fixtures";
import Decorator from "../../Decorator";

const task = taskFixture("");

storiesOf("Tasks / TaskHistory", module)
  .addDecorator(Decorator)
  .add("default", () => (
    <TaskHistory onNoteAdd={undefined} history={task.events} />
  ));
