import { storiesOf } from "@storybook/react";
import * as React from "react";

import { pageListProps } from "../../../fixtures";
import SkillTypeListPage from "../../../skillTypes/components/SkillTypeListPage";
import { skillTypes } from "../../../skillTypes/fixtures";
import Decorator from "../../Decorator";

storiesOf("Views / Skill types / Skill types list", module)
  .addDecorator(Decorator)
  .add("default", () => (
    <SkillTypeListPage
      skillTypes={skillTypes}
      {...pageListProps.default}
    />
  ))
  .add("loading", () => (
    <SkillTypeListPage skillTypes={undefined} {...pageListProps.loading} />
  ));
