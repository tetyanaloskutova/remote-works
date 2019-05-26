import { storiesOf } from "@storybook/react";
import * as React from "react";

import * as placeholderImage from "../../../../images/placeholder60x60.png";
import SkillVariantPage from "../../../products/components/SkillVariantPage";
import { variant as variantFixture } from "../../../products/fixtures";
import Decorator from "../../Decorator";

const variant = variantFixture(placeholderImage);

storiesOf("Views / Skills / Skill variant details", module)
  .addDecorator(Decorator)
  .add("when loaded data", () => (
    <SkillVariantPage
      header={variant.name || variant.sku}
      errors={[]}
      variant={variant}
      onBack={() => undefined}
      onDelete={undefined}
      onImageSelect={() => undefined}
      onSubmit={() => undefined}
      onVariantClick={() => undefined}
      saveButtonBarState="default"
    />
  ))
  .add("when loading data", () => (
    <SkillVariantPage
      header={undefined}
      errors={[]}
      loading={true}
      onBack={() => undefined}
      placeholderImage={placeholderImage}
      onDelete={undefined}
      onImageSelect={() => undefined}
      onSubmit={() => undefined}
      onVariantClick={() => undefined}
      saveButtonBarState="default"
    />
  ));
