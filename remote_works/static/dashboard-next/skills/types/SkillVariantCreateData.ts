/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SkillVariantCreateData
// ====================================================

export interface SkillVariantCreateData_skill_images {
  __typename: "SkillImage";
  id: string;
  sortTask: number;
  url: string;
}

export interface SkillVariantCreateData_skill_skillType_variantAttributes_values {
  __typename: "AttributeValue";
  id: string;
  sortTask: number;
  name: string | null;
  slug: string | null;
}

export interface SkillVariantCreateData_skill_skillType_variantAttributes {
  __typename: "Attribute";
  id: string;
  slug: string | null;
  name: string | null;
  values: (SkillVariantCreateData_skill_skillType_variantAttributes_values | null)[] | null;
}

export interface SkillVariantCreateData_skill_skillType {
  __typename: "SkillType";
  id: string;
  variantAttributes: (SkillVariantCreateData_skill_skillType_variantAttributes | null)[] | null;
}

export interface SkillVariantCreateData_skill_variants_images {
  __typename: "SkillImage";
  id: string;
  url: string;
}

export interface SkillVariantCreateData_skill_variants {
  __typename: "SkillVariant";
  id: string;
  name: string;
  sku: string;
  images: (SkillVariantCreateData_skill_variants_images | null)[] | null;
}

export interface SkillVariantCreateData_skill {
  __typename: "Skill";
  id: string;
  images: (SkillVariantCreateData_skill_images | null)[] | null;
  skillType: SkillVariantCreateData_skill_skillType;
  variants: (SkillVariantCreateData_skill_variants | null)[] | null;
}

export interface SkillVariantCreateData {
  skill: SkillVariantCreateData_skill | null;
}

export interface SkillVariantCreateDataVariables {
  id: string;
}
