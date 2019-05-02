/* tslint:disable */
// This file was automatically generated and should not be edited.

import { AttributeValueInput } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: SkillCreate
// ====================================================

export interface SkillCreate_productCreate_errors {
  __typename: "Error";
  field: string | null;
  message: string | null;
}

export interface SkillCreate_productCreate_product_category {
  __typename: "Category";
  id: string;
  name: string;
}

export interface SkillCreate_productCreate_product_collections {
  __typename: "Collection";
  id: string;
  name: string;
}

export interface SkillCreate_productCreate_product_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SkillCreate_productCreate_product_margin {
  __typename: "Margin";
  start: number | null;
  stop: number | null;
}

export interface SkillCreate_productCreate_product_purchaseCost_start {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SkillCreate_productCreate_product_purchaseCost_stop {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SkillCreate_productCreate_product_purchaseCost {
  __typename: "MoneyRange";
  start: SkillCreate_productCreate_product_purchaseCost_start | null;
  stop: SkillCreate_productCreate_product_purchaseCost_stop | null;
}

export interface SkillCreate_productCreate_product_attributes_attribute_values {
  __typename: "AttributeValue";
  name: string | null;
  slug: string | null;
}

export interface SkillCreate_productCreate_product_attributes_attribute {
  __typename: "Attribute";
  id: string;
  slug: string | null;
  name: string | null;
  values: (SkillCreate_productCreate_product_attributes_attribute_values | null)[] | null;
}

export interface SkillCreate_productCreate_product_attributes_value {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface SkillCreate_productCreate_product_attributes {
  __typename: "SelectedAttribute";
  attribute: SkillCreate_productCreate_product_attributes_attribute;
  value: SkillCreate_productCreate_product_attributes_value;
}

export interface SkillCreate_productCreate_product_availability_priceRange_start_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SkillCreate_productCreate_product_availability_priceRange_start {
  __typename: "TaxedMoney";
  net: SkillCreate_productCreate_product_availability_priceRange_start_net;
}

export interface SkillCreate_productCreate_product_availability_priceRange_stop_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SkillCreate_productCreate_product_availability_priceRange_stop {
  __typename: "TaxedMoney";
  net: SkillCreate_productCreate_product_availability_priceRange_stop_net;
}

export interface SkillCreate_productCreate_product_availability_priceRange {
  __typename: "TaxedMoneyRange";
  start: SkillCreate_productCreate_product_availability_priceRange_start | null;
  stop: SkillCreate_productCreate_product_availability_priceRange_stop | null;
}

export interface SkillCreate_productCreate_product_availability {
  __typename: "SkillAvailability";
  available: boolean | null;
  priceRange: SkillCreate_productCreate_product_availability_priceRange | null;
}

export interface SkillCreate_productCreate_product_images {
  __typename: "SkillImage";
  id: string;
  alt: string;
  sortOrder: number;
  url: string;
}

export interface SkillCreate_productCreate_product_variants_priceOverride {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SkillCreate_productCreate_product_variants {
  __typename: "SkillVariant";
  id: string;
  sku: string;
  name: string;
  priceOverride: SkillCreate_productCreate_product_variants_priceOverride | null;
  margin: number | null;
  quantity: number;
  quantityAllocated: number;
  stockQuantity: number;
}

export interface SkillCreate_productCreate_product_productType {
  __typename: "SkillType";
  id: string;
  name: string;
  hasVariants: boolean;
}

export interface SkillCreate_productCreate_product {
  __typename: "Skill";
  id: string;
  name: string;
  descriptionJson: any;
  seoTitle: string | null;
  seoDescription: string | null;
  category: SkillCreate_productCreate_product_category;
  collections: (SkillCreate_productCreate_product_collections | null)[] | null;
  price: SkillCreate_productCreate_product_price | null;
  margin: SkillCreate_productCreate_product_margin | null;
  purchaseCost: SkillCreate_productCreate_product_purchaseCost | null;
  isPublished: boolean;
  chargeTaxes: boolean;
  publicationDate: any | null;
  attributes: SkillCreate_productCreate_product_attributes[];
  availability: SkillCreate_productCreate_product_availability | null;
  images: (SkillCreate_productCreate_product_images | null)[] | null;
  variants: (SkillCreate_productCreate_product_variants | null)[] | null;
  productType: SkillCreate_productCreate_product_productType;
  url: string;
}

export interface SkillCreate_productCreate {
  __typename: "SkillCreate";
  errors: SkillCreate_productCreate_errors[] | null;
  product: SkillCreate_productCreate_product | null;
}

export interface SkillCreate {
  productCreate: SkillCreate_productCreate | null;
}

export interface SkillCreateVariables {
  attributes?: (AttributeValueInput | null)[] | null;
  publicationDate?: any | null;
  category: string;
  chargeTaxes: boolean;
  collections?: (string | null)[] | null;
  descriptionJson?: any | null;
  isPublished: boolean;
  name: string;
  price?: any | null;
  productType: string;
}
