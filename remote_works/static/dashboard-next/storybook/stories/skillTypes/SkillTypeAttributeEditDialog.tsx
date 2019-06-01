import { storiesOf } from "@storybook/react";
import * as React from "react";

import SkillTypeAttributeEditDialog, {
  SkillTypeAttributeEditDialogProps
} from "../../../skillTypes/components/SkillTypeAttributeEditDialog";
import { attributes } from "../../../skillTypes/fixtures";
import Decorator from "../../Decorator";

const attribute = attributes[0];

const props: SkillTypeAttributeEditDialogProps = {
  disabled: false,
  errors: [],
  name: attribute.name,
  onClose: () => undefined,
  onConfirm: () => undefined,
  opened: true,
  title: "Add Attribute",
  values: attribute.values.map(value => ({
    label: value.name,
    value: value.id
  }))
};

storiesOf("Skill types / Edit attribute", module)
  .addDecorator(Decorator)
  .add("default", () => <SkillTypeAttributeEditDialog {...props} />)
  .add("loading", () => (
    <SkillTypeAttributeEditDialog {...props} disabled={true} />
  ))
  .add("form errors", () => (
    <SkillTypeAttributeEditDialog
      {...props}
      // errors={["name", "values"].map(field => formError(field))}
      errors={["name", "values"].map(field => ({
        field,
        message: "Generic error"
      }))}
    />
  ));
