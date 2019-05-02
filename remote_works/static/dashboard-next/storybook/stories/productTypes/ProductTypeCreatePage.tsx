import { Omit } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import SkillTypeCreatePage, {
  SkillTypeCreatePageProps
} from "../../../productTypes/components/SkillTypeCreatePage";
import { WeightUnitsEnum } from "../../../types/globalTypes";
import Decorator from "../../Decorator";

const props: Omit<SkillTypeCreatePageProps, "classes"> = {
  defaultWeightUnit: "kg" as WeightUnitsEnum,
  disabled: false,
  errors: [],
  onBack: () => undefined,
  onSubmit: () => undefined,
  pageTitle: "Create product type",
  saveButtonBarState: "default"
};

storiesOf("Views / Skill types / Create product type", module)
  .addDecorator(Decorator)
  .add("default", () => <SkillTypeCreatePage {...props} />)
  .add("loading", () => (
    <SkillTypeCreatePage {...props} disabled={true} pageTitle={undefined} />
  ));
