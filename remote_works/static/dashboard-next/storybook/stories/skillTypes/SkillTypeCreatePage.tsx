import { Omit } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import SkillTypeCreatePage, {
  SkillTypeCreatePageProps
} from "../../../skillTypes/components/SkillTypeCreatePage";
import { WeightUnitsEnum } from "../../../types/globalTypes";
import Decorator from "../../Decorator";

const props: Omit<SkillTypeCreatePageProps, "classes"> = {
  defaultWeightUnit: "kg" as WeightUnitsEnum,
  disabled: false,
  errors: [],
  onBack: () => undefined,
  onSubmit: () => undefined,
  pageTitle: "Create skill type",
  saveButtonBarState: "default"
};

storiesOf("Views / Skill types / Create skill type", module)
  .addDecorator(Decorator)
  .add("default", () => <SkillTypeCreatePage {...props} />)
  .add("loading", () => (
    <SkillTypeCreatePage {...props} disabled={true} pageTitle={undefined} />
  ));
