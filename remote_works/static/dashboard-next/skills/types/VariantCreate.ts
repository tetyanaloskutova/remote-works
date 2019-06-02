/* tslint:disable */
// This file was automatically generated and should not be edited.

import { AttributeValueInput } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: VariantCreate
// ====================================================

export interface VariantCreate_skillVariantCreate_errors {
  __typename: "Error";
  field: string | null;
  message: string | null;
}

export interface VariantCreate_skillVariantCreate_skillVariant_attributes_attribute_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface VariantCreate_skillVariantCreate_skillVariant_attributes_attribute {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  values: (VariantCreate_skillVariantCreate_skillVariant_attributes_attribute_values | null)[] | null;
}

export interface VariantCreate_skillVariantCreate_skillVariant_attributes_value {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface VariantCreate_skillVariantCreate_skillVariant_attributes {
  __typename: "SelectedAttribute";
  attribute: VariantCreate_skillVariantCreate_skillVariant_attributes_attribute;
  value: VariantCreate_skillVariantCreate_skillVariant_attributes_value;
}

export interface VariantCreate_skillVariantCreate_skillVariant_costPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface VariantCreate_skillVariantCreate_skillVariant_images {
  __typename: "SkillImage";
  id: string;
  url: string;
}

export interface VariantCreate_skillVariantCreate_skillVariant_priceOverride {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface VariantCreate_skillVariantCreate_skillVariant_skill_images {
  __typename: "SkillImage";
  id: string;
  alt: string;
  sortTask: number;
  url: string;
}

export interface VariantCreate_skillVariantCreate_skillVariant_skill_thumbnail {
  __typename: "Image";
  url: string;
}

export interface VariantCreate_skillVariantCreate_skillVariant_skill_variants_images {
  __typename: "SkillImage";
  id: string;
  url: string;
}

export interface VariantCreate_skillVariantCreate_skillVariant_skill_variants {
  __typename: "SkillVariant";
  id: string;
  name: string;
  sku: string;
  images: (VariantCreate_skillVariantCreate_skillVariant_skill_variants_images | null)[] | null;
}

export interface VariantCreate_skillVariantCreate_skillVariant_skill {
  __typename: "Skill";
  id: string;
  images: (VariantCreate_skillVariantCreate_skillVariant_skill_images | null)[] | null;
  name: string;
  thumbnail: VariantCreate_skillVariantCreate_skillVariant_skill_thumbnail | null;
  variants: (VariantCreate_skillVariantCreate_skillVariant_skill_variants | null)[] | null;
}

export interface VariantCreate_skillVariantCreate_skillVariant {
  __typename: "SkillVariant";
  id: string;
  attributes: VariantCreate_skillVariantCreate_skillVariant_attributes[];
  costPrice: VariantCreate_skillVariantCreate_skillVariant_costPrice | null;
  images: (VariantCreate_skillVariantCreate_skillVariant_images | null)[] | null;
  name: string;
  priceOverride: VariantCreate_skillVariantCreate_skillVariant_priceOverride | null;
  skill: VariantCreate_skillVariantCreate_skillVariant_skill;
  sku: string;
  quantity: number;
  quantityAllocated: number;
}

export interface VariantCreate_skillVariantCreate {
  __typename: "SkillVariantCreate";
  errors: VariantCreate_skillVariantCreate_errors[] | null;
  skillVariant: VariantCreate_skillVariantCreate_skillVariant | null;
}

export interface VariantCreate {
  skillVariantCreate: VariantCreate_skillVariantCreate | null;
}

export interface VariantCreateVariables {
  attributes: (AttributeValueInput | null)[];
  costPrice?: any | null;
  priceOverride?: any | null;
  skill: string;
  sku?: string | null;
  quantity?: number | null;
  trackInventory: boolean;
}
