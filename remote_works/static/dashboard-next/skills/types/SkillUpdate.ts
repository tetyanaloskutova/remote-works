/* tslint:disable */
// This file was automatically generated and should not be edited.

import { AttributeValueInput } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: SkillUpdate
// ====================================================

export interface SkillUpdate_productUpdate_errors {
  __typename: "Error";
  field: string | null;
  message: string | null;
}

export interface SkillUpdate_productUpdate_skill_category {
  __typename: "Category";
  id: string;
  name: string;
}

export interface SkillUpdate_productUpdate_skill_collections {
  __typename: "Collection";
  id: string;
  name: string;
}

export interface SkillUpdate_productUpdate_skill_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SkillUpdate_productUpdate_skill_margin {
  __typename: "Margin";
  start: number | null;
  stop: number | null;
}

export interface SkillUpdate_productUpdate_skill_purchaseCost_start {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SkillUpdate_productUpdate_skill_purchaseCost_stop {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SkillUpdate_productUpdate_skill_purchaseCost {
  __typename: "MoneyRange";
  start: SkillUpdate_productUpdate_skill_purchaseCost_start | null;
  stop: SkillUpdate_productUpdate_skill_purchaseCost_stop | null;
}

export interface SkillUpdate_productUpdate_skill_attributes_attribute_values {
  __typename: "AttributeValue";
  name: string | null;
  slug: string | null;
}

export interface SkillUpdate_productUpdate_skill_attributes_attribute {
  __typename: "Attribute";
  id: string;
  slug: string | null;
  name: string | null;
  values: (SkillUpdate_productUpdate_skill_attributes_attribute_values | null)[] | null;
}

export interface SkillUpdate_productUpdate_skill_attributes_value {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface SkillUpdate_productUpdate_skill_attributes {
  __typename: "SelectedAttribute";
  attribute: SkillUpdate_productUpdate_skill_attributes_attribute;
  value: SkillUpdate_productUpdate_skill_attributes_value;
}

export interface SkillUpdate_productUpdate_skill_availability_priceRange_start_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SkillUpdate_productUpdate_skill_availability_priceRange_start {
  __typename: "TaxedMoney";
  net: SkillUpdate_productUpdate_skill_availability_priceRange_start_net;
}

export interface SkillUpdate_productUpdate_skill_availability_priceRange_stop_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SkillUpdate_productUpdate_skill_availability_priceRange_stop {
  __typename: "TaxedMoney";
  net: SkillUpdate_productUpdate_skill_availability_priceRange_stop_net;
}

export interface SkillUpdate_productUpdate_skill_availability_priceRange {
  __typename: "TaxedMoneyRange";
  start: SkillUpdate_productUpdate_skill_availability_priceRange_start | null;
  stop: SkillUpdate_productUpdate_skill_availability_priceRange_stop | null;
}

export interface SkillUpdate_productUpdate_skill_availability {
  __typename: "SkillAvailability";
  available: boolean | null;
  priceRange: SkillUpdate_productUpdate_skill_availability_priceRange | null;
}

export interface SkillUpdate_productUpdate_skill_images {
  __typename: "SkillImage";
  id: string;
  alt: string;
  sortTask: number;
  url: string;
}

export interface SkillUpdate_productUpdate_skill_variants_priceOverride {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SkillUpdate_productUpdate_skill_variants {
  __typename: "SkillVariant";
  id: string;
  sku: string;
  name: string;
  priceOverride: SkillUpdate_productUpdate_skill_variants_priceOverride | null;
  margin: number | null;
  quantity: number;
  quantityAllocated: number;
  stockQuantity: number;
}

export interface SkillUpdate_productUpdate_skill_productType {
  __typename: "SkillType";
  id: string;
  name: string;
  hasVariants: boolean;
}

export interface SkillUpdate_productUpdate_skill {
  __typename: "Skill";
  id: string;
  name: string;
  descriptionJson: any;
  seoTitle: string | null;
  seoDescription: string | null;
  category: SkillUpdate_productUpdate_skill_category;
  collections: (SkillUpdate_productUpdate_skill_collections | null)[] | null;
  price: SkillUpdate_productUpdate_skill_price | null;
  margin: SkillUpdate_productUpdate_skill_margin | null;
  purchaseCost: SkillUpdate_productUpdate_skill_purchaseCost | null;
  isPublished: boolean;
  chargeTaxes: boolean;
  publicationDate: any | null;
  attributes: SkillUpdate_productUpdate_skill_attributes[];
  availability: SkillUpdate_productUpdate_skill_availability | null;
  images: (SkillUpdate_productUpdate_skill_images | null)[] | null;
  variants: (SkillUpdate_productUpdate_skill_variants | null)[] | null;
  productType: SkillUpdate_productUpdate_skill_productType;
  url: string;
}

export interface SkillUpdate_productUpdate {
  __typename: "SkillUpdate";
  errors: SkillUpdate_productUpdate_errors[] | null;
  product: SkillUpdate_productUpdate_skill | null;
}

export interface SkillUpdate {
  productUpdate: SkillUpdate_productUpdate | null;
}

export interface SkillUpdateVariables {
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
}
