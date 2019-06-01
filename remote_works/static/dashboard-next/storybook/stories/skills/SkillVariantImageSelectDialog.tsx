import { storiesOf } from "@storybook/react";
import * as React from "react";

import * as placeholderImage from "../../../../images/placeholder255x255.png";
import SkillVariantImageSelectDialog from "../../../skills/components/SkillVariantImageSelectDialog";
import {
  variantImages as variantImagesFixture,
  variantSkillImages as variantSkillImagesFixture
} from "../../../skills/fixtures";

const variantImages = variantImagesFixture(placeholderImage);
const variantSkillImages = variantSkillImagesFixture(placeholderImage);

storiesOf("Skills / SkillVariantImageSelectDialog", module).add(
  "default",
  () => (
    <SkillVariantImageSelectDialog
      images={variantSkillImages}
      selectedImages={variantImages.map(image => image.id)}
      onClose={() => undefined}
      onImageSelect={() => undefined}
      open={true}
    />
  )
);
