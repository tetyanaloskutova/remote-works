import { storiesOf } from "@storybook/react";
import * as React from "react";

import * as placeholderImage from "../../../../images/placeholder255x255.png";
import SkillUpdatePage from "../../../skills/components/SkillUpdatePage";
import { skill as skillFixture } from "../../../skills/fixtures";
import Decorator from "../../Decorator";

const skill = skillFixture(placeholderImage);

storiesOf("Views / Skills / Skill edit", module)
  .addDecorator(Decorator)
  .add("when data is fully loaded", () => (
    <SkillUpdatePage
      errors={[]}
      onBack={() => undefined}
      onSubmit={() => undefined}
      skill={skill}
      header={skill.name}
      collections={skill.collections}
      categories={[skill.category]}
      fetchCategories={() => undefined}
      fetchCollections={() => undefined}
      placeholderImage={placeholderImage}
      images={skill.images}
      variants={skill.variants}
      skillCollections={skill.collections}
      onAttributesEdit={undefined}
      onDelete={undefined}
      onSkillShow={undefined}
      onVariantAdd={undefined}
      onVariantShow={() => undefined}
      onImageDelete={() => undefined}
      onImageUpload={() => undefined}
      saveButtonBarState="default"
    />
  ))
  .add("when skill has no images", () => (
    <SkillUpdatePage
      errors={[]}
      onBack={() => undefined}
      onSubmit={() => undefined}
      skill={skill}
      header={skill.name}
      collections={skill.collections}
      categories={[skill.category]}
      fetchCategories={() => undefined}
      fetchCollections={() => undefined}
      placeholderImage={placeholderImage}
      images={[]}
      variants={skill.variants}
      skillCollections={skill.collections}
      onAttributesEdit={undefined}
      onDelete={undefined}
      onSkillShow={undefined}
      onImageDelete={() => undefined}
      onVariantAdd={undefined}
      onVariantShow={() => undefined}
      onImageUpload={() => undefined}
      saveButtonBarState="default"
    />
  ))
  .add("when skill has no variants", () => (
    <SkillUpdatePage
      errors={[]}
      onBack={() => undefined}
      onSubmit={() => undefined}
      skill={
        {
          ...skill,
          skillType: { ...skill.skillType, hasVariants: false }
        } as any
      }
      header={skill.name}
      collections={skill.collections}
      categories={[skill.category]}
      fetchCategories={() => undefined}
      fetchCollections={() => undefined}
      placeholderImage={placeholderImage}
      images={skill.images}
      variants={skill.variants}
      skillCollections={skill.collections}
      onAttributesEdit={undefined}
      onDelete={undefined}
      onSkillShow={undefined}
      onVariantAdd={undefined}
      onImageDelete={() => undefined}
      onVariantShow={() => undefined}
      onImageUpload={() => undefined}
      saveButtonBarState="default"
    />
  ))
  .add("when loading data", () => (
    <SkillUpdatePage
      errors={[]}
      header={undefined}
      categories={[]}
      fetchCategories={() => undefined}
      fetchCollections={() => undefined}
      onBack={() => undefined}
      onSubmit={() => undefined}
      disabled={true}
      placeholderImage={placeholderImage}
      onAttributesEdit={undefined}
      onDelete={undefined}
      onImageDelete={() => undefined}
      onVariantShow={() => undefined}
      onImageUpload={() => undefined}
      saveButtonBarState="default"
      variants={undefined}
    />
  ));
