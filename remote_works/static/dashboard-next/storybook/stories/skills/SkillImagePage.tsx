import { storiesOf } from "@storybook/react";
import * as React from "react";

import * as placeholder from "../../../../images/placeholder1080x1080.png";
import SkillImagePage from "../../../skills/components/SkillImagePage";
import Decorator from "../../Decorator";

const image = { id: "", url: placeholder, alt: "Lorem ipsum" };
const images = (Array(8) as any)
  .fill({ id: "img", url: placeholder })
  .map((image, imageIndex) => ({ ...image, id: image.id + imageIndex }));

storiesOf("Views / Skills / Skill image details", module)
  .addDecorator(Decorator)
  .add("when loaded data", () => (
    <SkillImagePage
      disabled={false}
      image={image}
      images={images}
      onBack={() => undefined}
      onDelete={undefined}
      onRowClick={() => undefined}
      onSubmit={() => undefined}
      saveButtonBarState="default"
    />
  ))
  .add("when loading data", () => (
    <SkillImagePage
      disabled={true}
      onBack={() => undefined}
      onDelete={undefined}
      onRowClick={() => undefined}
      onSubmit={() => undefined}
      saveButtonBarState="default"
    />
  ));
