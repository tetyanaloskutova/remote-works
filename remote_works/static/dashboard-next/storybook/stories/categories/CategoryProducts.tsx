import { storiesOf } from "@storybook/react";
import * as React from "react";

import * as placeholder from "../../../../images/placeholder60x60.png";
import CategorySkills from "../../../categories/components/CategorySkills";
import Decorator from "../../Decorator";

const skills = [
  {
    id: "UHJvZHVjdDox",
    name: "Gardner, Graham and King",
    productType: {
      id: "1",
      name: "T-Shirt"
    },
    thumbnailUrl: placeholder
  },
  {
    id: "UHJvZHVjdDoy",
    name: "Gardner, Graham and King",
    productType: {
      id: "1",
      name: "T-Shirt"
    },
    thumbnailUrl: placeholder
  },
  {
    id: "UHJvZHVjdDoz",
    name: "Gardner, Graham and King",
    productType: {
      id: "1",
      name: "T-Shirt"
    },
    thumbnailUrl: placeholder
  },
  {
    id: "UHJvZHVjdDoa",
    name: "Gardner, Graham and King",
    productType: {
      id: "1",
      name: "T-Shirt"
    },
    thumbnailUrl: placeholder
  }
];

storiesOf("Categories / CategorySkills", module)
  .addDecorator(Decorator)
  .add("without initial data", () => (
    <CategorySkills
      hasNextPage={true}
      hasPreviousPage={false}
      products={[]}
      onAddSkill={undefined}
      onNextPage={undefined}
      onPreviousPage={undefined}
    />
  ))
  .add("with initial data", () => (
    <CategorySkills
      hasNextPage={true}
      hasPreviousPage={false}
      products={products}
      onAddSkill={undefined}
      onNextPage={undefined}
      onPreviousPage={undefined}
    />
  ))
  .add("with clickable rows", () => (
    <CategorySkills
      hasNextPage={true}
      hasPreviousPage={false}
      products={products}
      onAddSkill={undefined}
      onNextPage={undefined}
      onPreviousPage={undefined}
      onRowClick={() => undefined}
    />
  ))
  .add("when loading data", () => (
    <CategorySkills
      hasNextPage={true}
      hasPreviousPage={false}
      onAddSkill={undefined}
      onNextPage={undefined}
      onPreviousPage={undefined}
    />
  ));
