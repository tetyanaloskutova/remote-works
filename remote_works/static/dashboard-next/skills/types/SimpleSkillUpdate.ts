/* tslint:disable */
// This file was automatically generated and should not be edited.

import { AttributeValueInput, SkillVariantInput } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: SimpleSkillUpdate
// ====================================================

export interface SimpleSkillUpdate_skillUpdate_errors {
  __typename: "Error";
  field: string | null;
  message: string | null;
}

export interface SimpleSkillUpdate_skillUpdate_skill_category {
  __typename: "Category";
  id: string;
  name: string;
}

export interface SimpleSkillUpdate_skillUpdate_skill_collections {
  __typename: "Collection";
  id: string;
  name: string;
}

export interface SimpleSkillUpdate_skillUpdate_skill_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SimpleSkillUpdate_skillUpdate_skill_margin {
  __typename: "Margin";
  start: number | null;
  stop: number | null;
}

export interface SimpleSkillUpdate_skillUpdate_skill_purchaseCost_start {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SimpleSkillUpdate_skillUpdate_skill_purchaseCost_stop {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SimpleSkillUpdate_skillUpdate_skill_purchaseCost {
  __typename: "MoneyRange";
  start: SimpleSkillUpdate_skillUpdate_skill_purchaseCost_start | null;
  stop: SimpleSkillUpdate_skillUpdate_skill_purchaseCost_stop | null;
}

export interface SimpleSkillUpdate_skillUpdate_skill_attributes_attribute_values {
  __typename: "AttributeValue";
  name: string | null;
  slug: string | null;
}

export interface SimpleSkillUpdate_skillUpdate_skill_attributes_attribute {
  __typename: "Attribute";
  id: string;
  slug: string | null;
  name: string | null;
  values: (SimpleSkillUpdate_skillUpdate_skill_attributes_attribute_values | null)[] | null;
}

export interface SimpleSkillUpdate_skillUpdate_skill_attributes_value {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface SimpleSkillUpdate_skillUpdate_skill_attributes {
  __typename: "SelectedAttribute";
  attribute: SimpleSkillUpdate_skillUpdate_skill_attributes_attribute;
  value: SimpleSkillUpdate_skillUpdate_skill_attributes_value;
}

export interface SimpleSkillUpdate_skillUpdate_skill_availability_priceRange_start_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SimpleSkillUpdate_skillUpdate_skill_availability_priceRange_start {
  __typename: "TaxedMoney";
  net: SimpleSkillUpdate_skillUpdate_skill_availability_priceRange_start_net;
}

export interface SimpleSkillUpdate_skillUpdate_skill_availability_priceRange_stop_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SimpleSkillUpdate_skillUpdate_skill_availability_priceRange_stop {
  __typename: "TaxedMoney";
  net: SimpleSkillUpdate_skillUpdate_skill_availability_priceRange_stop_net;
}

export interface SimpleSkillUpdate_skillUpdate_skill_availability_priceRange {
  __typename: "TaxedMoneyRange";
  start: SimpleSkillUpdate_skillUpdate_skill_availability_priceRange_start | null;
  stop: SimpleSkillUpdate_skillUpdate_skill_availability_priceRange_stop | null;
}

export interface SimpleSkillUpdate_skillUpdate_skill_availability {
  __typename: "SkillAvailability";
  available: boolean | null;
  priceRange: SimpleSkillUpdate_skillUpdate_skill_availability_priceRange | null;
}

export interface SimpleSkillUpdate_skillUpdate_skill_images {
  __typename: "SkillImage";
  id: string;
  alt: string;
  sortTask: number;
  url: string;
}

export interface SimpleSkillUpdate_skillUpdate_skill_variants_priceOverride {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SimpleSkillUpdate_skillUpdate_skill_variants {
  __typename: "SkillVariant";
  id: string;
  sku: string;
  name: string;
  priceOverride: SimpleSkillUpdate_skillUpdate_skill_variants_priceOverride | null;
  margin: number | null;
  quantity: number;
  quantityAllocated: number;
  stockQuantity: number;
}

export interface SimpleSkillUpdate_skillUpdate_skill_skillType {
  __typename: "SkillType";
  id: string;
  name: string;
  hasVariants: boolean;
}

export interface SimpleSkillUpdate_skillUpdate_skill {
  __typename: "Skill";
  id: string;
  name: string;
  descriptionJson: any;
  seoTitle: string | null;
  seoDescription: string | null;
  category: SimpleSkillUpdate_skillUpdate_skill_category;
  collections: (SimpleSkillUpdate_skillUpdate_skill_collections | null)[] | null;
  price: SimpleSkillUpdate_skillUpdate_skill_price | null;
  margin: SimpleSkillUpdate_skillUpdate_skill_margin | null;
  purchaseCost: SimpleSkillUpdate_skillUpdate_skill_purchaseCost | null;
  isPublished: boolean;
  chargeTaxes: boolean;
  publicationDate: any | null;
  attributes: SimpleSkillUpdate_skillUpdate_skill_attributes[];
  availability: SimpleSkillUpdate_skillUpdate_skill_availability | null;
  images: (SimpleSkillUpdate_skillUpdate_skill_images | null)[] | null;
  variants: (SimpleSkillUpdate_skillUpdate_skill_variants | null)[] | null;
  skillType: SimpleSkillUpdate_skillUpdate_skill_skillType;
  url: string;
}

export interface SimpleSkillUpdate_skillUpdate {
  __typename: "SkillUpdate";
  errors: SimpleSkillUpdate_skillUpdate_errors[] | null;
  skill: SimpleSkillUpdate_skillUpdate_skill | null;
}

export interface SimpleSkillUpdate_skillVariantUpdate_errors {
  __typename: "Error";
  field: string | null;
  message: string | null;
}

export interface SimpleSkillUpdate_skillVariantUpdate_skillVariant_attributes_attribute_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface SimpleSkillUpdate_skillVariantUpdate_skillVariant_attributes_attribute {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  values: (SimpleSkillUpdate_skillVariantUpdate_skillVariant_attributes_attribute_values | null)[] | null;
}

export interface SimpleSkillUpdate_skillVariantUpdate_skillVariant_attributes_value {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface SimpleSkillUpdate_skillVariantUpdate_skillVariant_attributes {
  __typename: "SelectedAttribute";
  attribute: SimpleSkillUpdate_skillVariantUpdate_skillVariant_attributes_attribute;
  value: SimpleSkillUpdate_skillVariantUpdate_skillVariant_attributes_value;
}

export interface SimpleSkillUpdate_skillVariantUpdate_skillVariant_costPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SimpleSkillUpdate_skillVariantUpdate_skillVariant_images {
  __typename: "SkillImage";
  id: string;
  url: string;
}

export interface SimpleSkillUpdate_skillVariantUpdate_skillVariant_priceOverride {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SimpleSkillUpdate_skillVariantUpdate_skillVariant_skill_images {
  __typename: "SkillImage";
  id: string;
  alt: string;
  sortTask: number;
  url: string;
}

export interface SimpleSkillUpdate_skillVariantUpdate_skillVariant_skill_thumbnail {
  __typename: "Image";
  url: string;
}

export interface SimpleSkillUpdate_skillVariantUpdate_skillVariant_skill_variants_images {
  __typename: "SkillImage";
  id: string;
  url: string;
}

export interface SimpleSkillUpdate_skillVariantUpdate_skillVariant_skill_variants {
  __typename: "SkillVariant";
  id: string;
  name: string;
  sku: string;
  images: (SimpleSkillUpdate_skillVariantUpdate_skillVariant_skill_variants_images | null)[] | null;
}

export interface SimpleSkillUpdate_skillVariantUpdate_skillVariant_skill {
  __typename: "Skill";
  id: string;
  images: (SimpleSkillUpdate_skillVariantUpdate_skillVariant_skill_images | null)[] | null;
  name: string;
  thumbnail: SimpleSkillUpdate_skillVariantUpdate_skillVariant_skill_thumbnail | null;
  variants: (SimpleSkillUpdate_skillVariantUpdate_skillVariant_skill_variants | null)[] | null;
}

export interface SimpleSkillUpdate_skillVariantUpdate_skillVariant {
  __typename: "SkillVariant";
  id: string;
  attributes: SimpleSkillUpdate_skillVariantUpdate_skillVariant_attributes[];
  costPrice: SimpleSkillUpdate_skillVariantUpdate_skillVariant_costPrice | null;
  images: (SimpleSkillUpdate_skillVariantUpdate_skillVariant_images | null)[] | null;
  name: string;
  priceOverride: SimpleSkillUpdate_skillVariantUpdate_skillVariant_priceOverride | null;
  skill: SimpleSkillUpdate_skillVariantUpdate_skillVariant_skill;
  sku: string;
  quantity: number;
  quantityAllocated: number;
}

export interface SimpleSkillUpdate_skillVariantUpdate {
  __typename: "SkillVariantUpdate";
  errors: SimpleSkillUpdate_skillVariantUpdate_errors[] | null;
  skillVariant: SimpleSkillUpdate_skillVariantUpdate_skillVariant | null;
}

export interface SimpleSkillUpdate {
  skillUpdate: SimpleSkillUpdate_skillUpdate | null;
  skillVariantUpdate: SimpleSkillUpdate_skillVariantUpdate | null;
}

export interface SimpleSkillUpdateVariables {
  id: string;
  attributes?: (AttributeValueInput | null)[] | null;
  publicationDate?: any | null;
  category?: string | null;
  chargeTaxes: boolean;
  collections?: (string | null)[] | null;
  descriptionJson?: any | null;
  isPublished: boolean;
  name?: string | null;
  price?: any | null;
  skillVariantId: string;
  skillVariantInput: SkillVariantInput;
}
