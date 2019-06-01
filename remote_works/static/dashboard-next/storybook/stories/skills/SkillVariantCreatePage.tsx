import { storiesOf } from "@storybook/react";
import * as React from "react";

import * as placeholderImage from "../../../../images/placeholder255x255.png";
import SkillVariantCreatePage from "../../../skills/components/SkillVariantCreatePage";
import { skill as skillFixture } from "../../../skills/fixtures";
import Decorator from "../../Decorator";

const skill = skillFixture(placeholderImage);
const errors = [
  {
    field: "cost_price",
    message: "Generic error"
  },
  {
    field: "price_override",
    message: "Generic error"
  },
  {
    field: "sku",
    message: "Generic error"
  },
  {
    field: "availability",
    message: "Generic error"
  }
];

storiesOf("Views / Skills / Create skill variant", module)
  .addDecorator(Decorator)
  .add("default", () => (
    <SkillVariantCreatePage
      currencySymbol="USD"
      errors={[]}
      header="Add variant"
      loading={false}
      skill={skill}
      onBack={() => undefined}
      onSubmit={() => undefined}
      onVariantClick={undefined}
      saveButtonBarState="default"
    />
  ))
  .add("with errors", () => (
    <SkillVariantCreatePage
      currencySymbol="USD"
      errors={errors}
      header="Add variant"
      loading={false}
      skill={skill}
      onBack={() => undefined}
      onSubmit={() => undefined}
      onVariantClick={undefined}
      saveButtonBarState="default"
    />
  ))
  .add("when loading data", () => (
    <SkillVariantCreatePage
      currencySymbol="USD"
      errors={[]}
      header="Add variant"
      loading={true}
      skill={undefined}
      onBack={() => undefined}
      onSubmit={() => undefined}
      onVariantClick={undefined}
      saveButtonBarState="default"
    />
  ));
