/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SkillVariantDetails
// ====================================================

export interface SkillVariantDetails_skillVariant_attributes_attribute_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface SkillVariantDetails_skillVariant_attributes_attribute {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  values: (SkillVariantDetails_skillVariant_attributes_attribute_values | null)[] | null;
}

export interface SkillVariantDetails_skillVariant_attributes_value {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface SkillVariantDetails_skillVariant_attributes {
  __typename: "SelectedAttribute";
  attribute: SkillVariantDetails_skillVariant_attributes_attribute;
  value: SkillVariantDetails_skillVariant_attributes_value;
}

export interface SkillVariantDetails_skillVariant_costPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SkillVariantDetails_skillVariant_images {
  __typename: "SkillImage";
  id: string;
  url: string;
}

export interface SkillVariantDetails_skillVariant_priceOverride {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SkillVariantDetails_skillVariant_skill_images {
  __typename: "SkillImage";
  id: string;
  alt: string;
  sortTask: number;
  url: string;
}

export interface SkillVariantDetails_skillVariant_skill_thumbnail {
  __typename: "Image";
  url: string;
}

export interface SkillVariantDetails_skillVariant_skill_variants_images {
  __typename: "SkillImage";
  id: string;
  url: string;
}

export interface SkillVariantDetails_skillVariant_skill_variants {
  __typename: "SkillVariant";
  id: string;
  name: string;
  sku: string;
  images: (SkillVariantDetails_skillVariant_skill_variants_images | null)[] | null;
}

export interface SkillVariantDetails_skillVariant_skill {
  __typename: "Skill";
  id: string;
  images: (SkillVariantDetails_skillVariant_skill_images | null)[] | null;
  name: string;
  thumbnail: SkillVariantDetails_skillVariant_skill_thumbnail | null;
  variants: (SkillVariantDetails_skillVariant_skill_variants | null)[] | null;
}

export interface SkillVariantDetails_skillVariant {
  __typename: "SkillVariant";
  id: string;
  attributes: SkillVariantDetails_skillVariant_attributes[];
  costPrice: SkillVariantDetails_skillVariant_costPrice | null;
  images: (SkillVariantDetails_skillVariant_images | null)[] | null;
  name: string;
  priceOverride: SkillVariantDetails_skillVariant_priceOverride | null;
  skill: SkillVariantDetails_skillVariant_skill;
  sku: string;
  quantity: number;
  quantityAllocated: number;
}

export interface SkillVariantDetails {
  skillVariant: SkillVariantDetails_skillVariant | null;
}

export interface SkillVariantDetailsVariables {
  id: string;
}
