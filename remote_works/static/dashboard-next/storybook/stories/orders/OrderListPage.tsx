import { storiesOf } from "@storybook/react";
import * as React from "react";

import { Filter } from "../../../components/TableFilter/";
import { pageListProps } from "../../../fixtures";
import TaskListPage from "../../../tasks/components/TaskListPage";
import { tasks } from "../../../tasks/fixtures";
import Decorator from "../../Decorator";

const filtersList: Filter[] = [
  {
    label: "Gardner-Schultz",
    onClick: () => undefined
  },
  {
    label: "Davis, Brown and Ray",
    onClick: () => undefined
  },
  {
    label: "Franklin Inc",
    onClick: () => undefined
  }
];

storiesOf("Views / Tasks / Task list", module)
  .addDecorator(Decorator)
  .add("default", () => (
    <TaskListPage
      tasks={tasks}
      {...pageListProps.default}
      filtersList={[]}
      onAllSkills={() => undefined}
      currentTab="all"
      onToFulfill={() => undefined}
      onToCapture={() => undefined}
      onCustomFilter={() => undefined}
    />
  ))
  .add("with custom filters", () => (
    <TaskListPage
      tasks={tasks}
      {...pageListProps.loading}
      filtersList={filtersList}
      currentTab="custom"
      onAllSkills={() => undefined}
      onToFulfill={() => undefined}
      onToCapture={() => undefined}
      onCustomFilter={() => undefined}
    />
  ))
  .add("loading", () => (
    <TaskListPage
      tasks={undefined}
      {...pageListProps.loading}
      filtersList={undefined}
      currentTab={undefined}
      onAllSkills={() => undefined}
      onToFulfill={() => undefined}
      onToCapture={() => undefined}
      onCustomFilter={() => undefined}
    />
  ))
  .add("when no data", () => (
    <TaskListPage
      tasks={[]}
      {...pageListProps.default}
      filtersList={[]}
      currentTab="all"
      onAllSkills={() => undefined}
      onToFulfill={() => undefined}
      onToCapture={() => undefined}
      onCustomFilter={() => undefined}
    />
  ));
