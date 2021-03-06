/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: VariantImageAssign
// ====================================================

export interface VariantImageAssign_variantImageAssign_errors {
  __typename: "Error";
  field: string | null;
  message: string | null;
}

export interface VariantImageAssign_variantImageAssign_skillVariant_attributes_attribute_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface VariantImageAssign_variantImageAssign_skillVariant_attributes_attribute {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  values: (VariantImageAssign_variantImageAssign_skillVariant_attributes_attribute_values | null)[] | null;
}

export interface VariantImageAssign_variantImageAssign_skillVariant_attributes_value {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface VariantImageAssign_variantImageAssign_skillVariant_attributes {
  __typename: "SelectedAttribute";
  attribute: VariantImageAssign_variantImageAssign_skillVariant_attributes_attribute;
  value: VariantImageAssign_variantImageAssign_skillVariant_attributes_value;
}

export interface VariantImageAssign_variantImageAssign_skillVariant_costPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface VariantImageAssign_variantImageAssign_skillVariant_images {
  __typename: "SkillImage";
  id: string;
  url: string;
}

export interface VariantImageAssign_variantImageAssign_skillVariant_priceOverride {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface VariantImageAssign_variantImageAssign_skillVariant_skill_images {
  __typename: "SkillImage";
  id: string;
  alt: string;
  sortTask: number;
  url: string;
}

export interface VariantImageAssign_variantImageAssign_skillVariant_skill_thumbnail {
  __typename: "Image";
  url: string;
}

export interface VariantImageAssign_variantImageAssign_skillVariant_skill_variants_images {
  __typename: "SkillImage";
  id: string;
  url: string;
}

export interface VariantImageAssign_variantImageAssign_skillVariant_skill_variants {
  __typename: "SkillVariant";
  id: string;
  name: string;
  sku: string;
  images: (VariantImageAssign_variantImageAssign_skillVariant_skill_variants_images | null)[] | null;
}

export interface VariantImageAssign_variantImageAssign_skillVariant_skill {
  __typename: "Skill";
  id: string;
  images: (VariantImageAssign_variantImageAssign_skillVariant_skill_images | null)[] | null;
  name: string;
  thumbnail: VariantImageAssign_variantImageAssign_skillVariant_skill_thumbnail | null;
  variants: (VariantImageAssign_variantImageAssign_skillVariant_skill_variants | null)[] | null;
}

export interface VariantImageAssign_variantImageAssign_skillVariant {
  __typename: "SkillVariant";
  id: string;
  attributes: VariantImageAssign_variantImageAssign_skillVariant_attributes[];
  costPrice: VariantImageAssign_variantImageAssign_skillVariant_costPrice | null;
  images: (VariantImageAssign_variantImageAssign_skillVariant_images | null)[] | null;
  name: string;
  priceOverride: VariantImageAssign_variantImageAssign_skillVariant_priceOverride | null;
  skill: VariantImageAssign_variantImageAssign_skillVariant_skill;
  sku: string;
  quantity: number;
  quantityAllocated: number;
}

export interface VariantImageAssign_variantImageAssign {
  __typename: "VariantImageAssign";
  errors: VariantImageAssign_variantImageAssign_errors[] | null;
  skillVariant: VariantImageAssign_variantImageAssign_skillVariant | null;
}

export interface VariantImageAssign {
  variantImageAssign: VariantImageAssign_variantImageAssign | null;
}

export interface VariantImageAssignVariables {
  variantId: string;
  imageId: string;
}
