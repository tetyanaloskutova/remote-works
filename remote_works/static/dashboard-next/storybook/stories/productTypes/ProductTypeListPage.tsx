import { storiesOf } from "@storybook/react";
import * as React from "react";

import { pageListProps } from "../../../fixtures";
import SkillTypeListPage from "../../../productTypes/components/SkillTypeListPage";
import { productTypes } from "../../../productTypes/fixtures";
import Decorator from "../../Decorator";

storiesOf("Views / Skill types / Skill types list", module)
  .addDecorator(Decorator)
  .add("default", () => (
    <SkillTypeListPage
      productTypes={productTypes}
      {...pageListProps.default}
    />
  ))
  .add("loading", () => (
    <SkillTypeListPage productTypes={undefined} {...pageListProps.loading} />
  ));
