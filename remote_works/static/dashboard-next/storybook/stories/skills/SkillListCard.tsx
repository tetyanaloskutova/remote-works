import { storiesOf } from "@storybook/react";
import * as React from "react";

import * as placeholderImage from "../../../../images/placeholder255x255.png";
import { category as categoryFixture } from "../../../categories/fixtures";
import { Filter } from "../../../components/TableFilter";
import { pageListProps } from "../../../fixtures";
import SkillListCard from "../../../products/components/SkillListCard";
import Decorator from "../../Decorator";

const skills = categoryFixture(placeholderImage).products.edges.map(
  edge => edge.node
);

const filtersList: Filter[] = [
  {
    label: "Gardner-Schultz",
    onClick: () => undefined
  },
  {
    label: "Davis, Brown and Ray",
    onClick: () => undefined
  },
  {
    label: "Franklin Inc",
    onClick: () => undefined
  }
];

storiesOf("Views / Skills / Skill list", module)
  .addDecorator(Decorator)
  .add("default", () => (
    <SkillListCard
      filtersList={[]}
      currentTab="all"
      products={products}
      {...pageListProps.default}
      onAllSkills={() => undefined}
      onAvailable={() => undefined}
      onOfStock={() => undefined}
      onCustomFilter={() => undefined}
    />
  ))
  .add("with custom filters", () => (
    <SkillListCard
      products={products}
      {...pageListProps.default}
      filtersList={filtersList}
      currentTab="custom"
      onAllSkills={() => undefined}
      onAvailable={() => undefined}
      onOfStock={() => undefined}
      onCustomFilter={() => undefined}
    />
  ))
  .add("loading", () => (
    <SkillListCard
      {...pageListProps.loading}
      products={undefined}
      filtersList={undefined}
      currentTab={undefined}
      onAllSkills={() => undefined}
      onAvailable={() => undefined}
      onOfStock={() => undefined}
      onCustomFilter={() => undefined}
    />
  ))
  .add("no data", () => (
    <SkillListCard
      products={[]}
      {...pageListProps.default}
      filtersList={[]}
      currentTab="all"
      onAllSkills={() => undefined}
      onAvailable={() => undefined}
      onOfStock={() => undefined}
      onCustomFilter={() => undefined}
    />
  ));
