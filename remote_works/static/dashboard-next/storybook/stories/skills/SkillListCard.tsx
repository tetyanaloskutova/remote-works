import { storiesOf } from "@storybook/react";
import * as React from "react";

import * as placeholderImage from "../../../../images/placeholder255x255.png";
import { category as categoryFixture } from "../../../categories/fixtures";
import { Filter } from "../../../components/TableFilter";
import { pageListProps } from "../../../fixtures";
import SkillListCard from "../../../skills/components/SkillListCard";
import Decorator from "../../Decorator";

const skills = categoryFixture(placeholderImage).skills.edges.map(
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
      skills={skills}
      {...pageListProps.default}
      onAllSkills={() => undefined}
      onAvailable={() => undefined}
      onOfStock={() => undefined}
      onCustomFilter={() => undefined}
    />
  ))
  .add("with custom filters", () => (
    <SkillListCard
      skills={skills}
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
      skills={undefined}
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
      skills={[]}
      {...pageListProps.default}
      filtersList={[]}
      currentTab="all"
      onAllSkills={() => undefined}
      onAvailable={() => undefined}
      onOfStock={() => undefined}
      onCustomFilter={() => undefined}
    />
  ));
