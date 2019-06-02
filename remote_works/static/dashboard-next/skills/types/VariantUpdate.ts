/* tslint:disable */
// This file was automatically generated and should not be edited.

import { AttributeValueInput } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: VariantUpdate
// ====================================================

export interface VariantUpdate_skillVariantUpdate_errors {
  __typename: "Error";
  field: string | null;
  message: string | null;
}

export interface VariantUpdate_skillVariantUpdate_skillVariant_attributes_attribute_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface VariantUpdate_skillVariantUpdate_skillVariant_attributes_attribute {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  values: (VariantUpdate_skillVariantUpdate_skillVariant_attributes_attribute_values | null)[] | null;
}

export interface VariantUpdate_skillVariantUpdate_skillVariant_attributes_value {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface VariantUpdate_skillVariantUpdate_skillVariant_attributes {
  __typename: "SelectedAttribute";
  attribute: VariantUpdate_skillVariantUpdate_skillVariant_attributes_attribute;
  value: VariantUpdate_skillVariantUpdate_skillVariant_attributes_value;
}

export interface VariantUpdate_skillVariantUpdate_skillVariant_costPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface VariantUpdate_skillVariantUpdate_skillVariant_images {
  __typename: "SkillImage";
  id: string;
  url: string;
}

export interface VariantUpdate_skillVariantUpdate_skillVariant_priceOverride {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface VariantUpdate_skillVariantUpdate_skillVariant_skill_images {
  __typename: "SkillImage";
  id: string;
  alt: string;
  sortTask: number;
  url: string;
}

export interface VariantUpdate_skillVariantUpdate_skillVariant_skill_thumbnail {
  __typename: "Image";
  url: string;
}

export interface VariantUpdate_skillVariantUpdate_skillVariant_skill_variants_images {
  __typename: "SkillImage";
  id: string;
  url: string;
}

export interface VariantUpdate_skillVariantUpdate_skillVariant_skill_variants {
  __typename: "SkillVariant";
  id: string;
  name: string;
  sku: string;
  images: (VariantUpdate_skillVariantUpdate_skillVariant_skill_variants_images | null)[] | null;
}

export interface VariantUpdate_skillVariantUpdate_skillVariant_skill {
  __typename: "Skill";
  id: string;
  images: (VariantUpdate_skillVariantUpdate_skillVariant_skill_images | null)[] | null;
  name: string;
  thumbnail: VariantUpdate_skillVariantUpdate_skillVariant_skill_thumbnail | null;
  variants: (VariantUpdate_skillVariantUpdate_skillVariant_skill_variants | null)[] | null;
}

export interface VariantUpdate_skillVariantUpdate_skillVariant {
  __typename: "SkillVariant";
  id: string;
  attributes: VariantUpdate_skillVariantUpdate_skillVariant_attributes[];
  costPrice: VariantUpdate_skillVariantUpdate_skillVariant_costPrice | null;
  images: (VariantUpdate_skillVariantUpdate_skillVariant_images | null)[] | null;
  name: string;
  priceOverride: VariantUpdate_skillVariantUpdate_skillVariant_priceOverride | null;
  skill: VariantUpdate_skillVariantUpdate_skillVariant_skill;
  sku: string;
  quantity: number;
  quantityAllocated: number;
}

export interface VariantUpdate_skillVariantUpdate {
  __typename: "SkillVariantUpdate";
  errors: VariantUpdate_skillVariantUpdate_errors[] | null;
  skillVariant: VariantUpdate_skillVariantUpdate_skillVariant | null;
}

export interface VariantUpdate {
  skillVariantUpdate: VariantUpdate_skillVariantUpdate | null;
}

export interface VariantUpdateVariables {
  id: string;
  attributes?: (AttributeValueInput | null)[] | null;
  costPrice?: any | null;
  priceOverride?: any | null;
  sku?: string | null;
  quantity?: number | null;
  trackInventory: boolean;
}
