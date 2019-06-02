import { storiesOf } from "@storybook/react";
import * as React from "react";

import * as placeholderImage from "../../../../images/placeholder60x60.png";
import TaskSkillAddDialog from "../../../tasks/components/TaskSkillAddDialog";
import { taskLineSearch } from "../../../tasks/fixtures";
import Decorator from "../../Decorator";

storiesOf("Tasks / TaskSkillAddDialog", module)
  .addDecorator(Decorator)
  .add("default", () => (
    <TaskSkillAddDialog
      confirmButtonState="default"
      loading={false}
      open={true}
      onClose={undefined}
      onSubmit={undefined}
      hasMore={false}
      onFetch={() => undefined}
      onFetchMore={() => undefined}
      skills={taskLineSearch(placeholderImage)}
    />
  ));
