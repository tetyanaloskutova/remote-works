import { Omit } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import * as placeholderImage from "../../../../images/placeholder60x60.png";
import TaskDraftPage, {
  TaskDraftPageProps
} from "../../../tasks/components/TaskDraftPage";
import { clients, countries, draftTask } from "../../../tasks/fixtures";
import Decorator from "../../Decorator";

const order = draftTask(placeholderImage);

const props: Omit<TaskDraftPageProps, "classes"> = {
  countries,
  disabled: false,
  fetchUsers: () => undefined,
  onBack: () => undefined,
  onBillingAddressEdit: undefined,
  onCustomerEdit: () => undefined,
  onDraftFinalize: () => undefined,
  onDraftRemove: () => undefined,
  onNoteAdd: undefined,
  onTaskLineAdd: () => undefined,
  onTaskLineChange: () => undefined,
  onTaskLineRemove: () => () => undefined,
  onSkillClick: undefined,
  onDeliveryAddressEdit: undefined,
  onDeliveryMethodEdit: undefined,
  order,
  saveButtonBarState: "default",
  users: clients,
  usersLoading: false
};

storiesOf("Views / Tasks / Task draft", module)
  .addDecorator(Decorator)
  .add("default", () => <TaskDraftPage {...props} />)
  .add("loading", () => (
    <TaskDraftPage {...props} disabled={true} order={undefined} />
  ))
  .add("without lines", () => (
    <TaskDraftPage {...props} order={{ ...order, lines: [] }} />
  ));
