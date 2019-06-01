import { Omit } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import SkillTypeDetailsPage, {
  SkillTypeDetailsPageProps
} from "../../../skillTypes/components/SkillTypeDetailsPage";
import { skillType } from "../../../skillTypes/fixtures";
import { WeightUnitsEnum } from "../../../types/globalTypes";
import Decorator from "../../Decorator";

const props: Omit<SkillTypeDetailsPageProps, "classes"> = {
  defaultWeightUnit: "kg" as WeightUnitsEnum,
  disabled: false,
  errors: [],
  onAttributeAdd: () => undefined,
  onAttributeDelete: () => undefined,
  onAttributeUpdate: () => undefined,
  onBack: () => undefined,
  onDelete: () => undefined,
  onSubmit: () => undefined,
  pageTitle: skillType.name,
  skillType,
  saveButtonBarState: "default"
};

storiesOf("Views / Skill types / Skill type details", module)
  .addDecorator(Decorator)
  .add("default", () => <SkillTypeDetailsPage {...props} />)
  .add("loading", () => (
    <SkillTypeDetailsPage
      {...props}
      disabled={true}
      pageTitle={undefined}
      skillType={undefined}
    />
  ));
