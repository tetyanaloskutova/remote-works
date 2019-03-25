import { storiesOf } from "@storybook/react";
import * as React from "react";

import SkillCreatePage from "../../../skills/components/SkillCreatePage";
import { skill as skillFixture } from "../../../skills/fixtures";
import { skillTypes } from "../../../skillTypes/fixtures";
import Decorator from "../../Decorator";

const skill = skillFixture("");

storiesOf("Views / Skills / Create skill", module)
  .addDecorator(Decorator)
  .add("default", () => (
    <SkillCreatePage
      currency="USD"
      disabled={false}
      errors={[]}
      header="Add skill"
      collections={skill.collections}
      fetchCategories={() => undefined}
      fetchCollections={() => undefined}
      skillTypes={skillTypes}
      categories={[skill.category]}
      onAttributesEdit={undefined}
      onBack={() => undefined}
      onSubmit={() => undefined}
      saveButtonBarState="default"
    />
  ))
  .add("When loading", () => (
    <SkillCreatePage
      currency="USD"
      disabled={true}
      errors={[]}
      header="Add skill"
      collections={skill.collections}
      fetchCategories={() => undefined}
      fetchCollections={() => undefined}
      skillTypes={skillTypes}
      categories={[skill.category]}
      onAttributesEdit={undefined}
      onBack={() => undefined}
      onSubmit={() => undefined}
      saveButtonBarState="default"
    />
  ));
