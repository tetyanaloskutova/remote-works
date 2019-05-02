/* tslint:disable */
// This file was automatically generated and should not be edited.

import { AttributeValueInput, SkillVariantInput } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: SimpleSkillUpdate
// ====================================================

export interface SimpleSkillUpdate_productUpdate_errors {
  __typename: "Error";
  field: string | null;
  message: string | null;
}

export interface SimpleSkillUpdate_productUpdate_product_category {
  __typename: "Category";
  id: string;
  name: string;
}

export interface SimpleSkillUpdate_productUpdate_product_collections {
  __typename: "Collection";
  id: string;
  name: string;
}

export interface SimpleSkillUpdate_productUpdate_product_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SimpleSkillUpdate_productUpdate_product_margin {
  __typename: "Margin";
  start: number | null;
  stop: number | null;
}

export interface SimpleSkillUpdate_productUpdate_product_purchaseCost_start {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SimpleSkillUpdate_productUpdate_product_purchaseCost_stop {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SimpleSkillUpdate_productUpdate_product_purchaseCost {
  __typename: "MoneyRange";
  start: SimpleSkillUpdate_productUpdate_product_purchaseCost_start | null;
  stop: SimpleSkillUpdate_productUpdate_product_purchaseCost_stop | null;
}

export interface SimpleSkillUpdate_productUpdate_product_attributes_attribute_values {
  __typename: "AttributeValue";
  name: string | null;
  slug: string | null;
}

export interface SimpleSkillUpdate_productUpdate_product_attributes_attribute {
  __typename: "Attribute";
  id: string;
  slug: string | null;
  name: string | null;
  values: (SimpleSkillUpdate_productUpdate_product_attributes_attribute_values | null)[] | null;
}

export interface SimpleSkillUpdate_productUpdate_product_attributes_value {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface SimpleSkillUpdate_productUpdate_product_attributes {
  __typename: "SelectedAttribute";
  attribute: SimpleSkillUpdate_productUpdate_product_attributes_attribute;
  value: SimpleSkillUpdate_productUpdate_product_attributes_value;
}

export interface SimpleSkillUpdate_productUpdate_product_availability_priceRange_start_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SimpleSkillUpdate_productUpdate_product_availability_priceRange_start {
  __typename: "TaxedMoney";
  net: SimpleSkillUpdate_productUpdate_product_availability_priceRange_start_net;
}

export interface SimpleSkillUpdate_productUpdate_product_availability_priceRange_stop_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SimpleSkillUpdate_productUpdate_product_availability_priceRange_stop {
  __typename: "TaxedMoney";
  net: SimpleSkillUpdate_productUpdate_product_availability_priceRange_stop_net;
}

export interface SimpleSkillUpdate_productUpdate_product_availability_priceRange {
  __typename: "TaxedMoneyRange";
  start: SimpleSkillUpdate_productUpdate_product_availability_priceRange_start | null;
  stop: SimpleSkillUpdate_productUpdate_product_availability_priceRange_stop | null;
}

export interface SimpleSkillUpdate_productUpdate_product_availability {
  __typename: "SkillAvailability";
  available: boolean | null;
  priceRange: SimpleSkillUpdate_productUpdate_product_availability_priceRange | null;
}

export interface SimpleSkillUpdate_productUpdate_product_images {
  __typename: "SkillImage";
  id: string;
  alt: string;
  sortOrder: number;
  url: string;
}

export interface SimpleSkillUpdate_productUpdate_product_variants_priceOverride {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SimpleSkillUpdate_productUpdate_product_variants {
  __typename: "SkillVariant";
  id: string;
  sku: string;
  name: string;
  priceOverride: SimpleSkillUpdate_productUpdate_product_variants_priceOverride | null;
  margin: number | null;
  quantity: number;
  quantityAllocated: number;
  stockQuantity: number;
}

export interface SimpleSkillUpdate_productUpdate_product_productType {
  __typename: "SkillType";
  id: string;
  name: string;
  hasVariants: boolean;
}

export interface SimpleSkillUpdate_productUpdate_product {
  __typename: "Skill";
  id: string;
  name: string;
  descriptionJson: any;
  seoTitle: string | null;
  seoDescription: string | null;
  category: SimpleSkillUpdate_productUpdate_product_category;
  collections: (SimpleSkillUpdate_productUpdate_product_collections | null)[] | null;
  price: SimpleSkillUpdate_productUpdate_product_price | null;
  margin: SimpleSkillUpdate_productUpdate_product_margin | null;
  purchaseCost: SimpleSkillUpdate_productUpdate_product_purchaseCost | null;
  isPublished: boolean;
  chargeTaxes: boolean;
  publicationDate: any | null;
  attributes: SimpleSkillUpdate_productUpdate_product_attributes[];
  availability: SimpleSkillUpdate_productUpdate_product_availability | null;
  images: (SimpleSkillUpdate_productUpdate_product_images | null)[] | null;
  variants: (SimpleSkillUpdate_productUpdate_product_variants | null)[] | null;
  productType: SimpleSkillUpdate_productUpdate_product_productType;
  url: string;
}

export interface SimpleSkillUpdate_productUpdate {
  __typename: "SkillUpdate";
  errors: SimpleSkillUpdate_productUpdate_errors[] | null;
  product: SimpleSkillUpdate_productUpdate_product | null;
}

export interface SimpleSkillUpdate_productVariantUpdate_errors {
  __typename: "Error";
  field: string | null;
  message: string | null;
}

export interface SimpleSkillUpdate_productVariantUpdate_productVariant_attributes_attribute_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface SimpleSkillUpdate_productVariantUpdate_productVariant_attributes_attribute {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  values: (SimpleSkillUpdate_productVariantUpdate_productVariant_attributes_attribute_values | null)[] | null;
}

export interface SimpleSkillUpdate_productVariantUpdate_productVariant_attributes_value {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface SimpleSkillUpdate_productVariantUpdate_productVariant_attributes {
  __typename: "SelectedAttribute";
  attribute: SimpleSkillUpdate_productVariantUpdate_productVariant_attributes_attribute;
  value: SimpleSkillUpdate_productVariantUpdate_productVariant_attributes_value;
}

export interface SimpleSkillUpdate_productVariantUpdate_productVariant_costPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SimpleSkillUpdate_productVariantUpdate_productVariant_images {
  __typename: "SkillImage";
  id: string;
  url: string;
}

export interface SimpleSkillUpdate_productVariantUpdate_productVariant_priceOverride {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SimpleSkillUpdate_productVariantUpdate_productVariant_product_images {
  __typename: "SkillImage";
  id: string;
  alt: string;
  sortOrder: number;
  url: string;
}

export interface SimpleSkillUpdate_productVariantUpdate_productVariant_product_thumbnail {
  __typename: "Image";
  url: string;
}

export interface SimpleSkillUpdate_productVariantUpdate_productVariant_product_variants_images {
  __typename: "SkillImage";
  id: string;
  url: string;
}

export interface SimpleSkillUpdate_productVariantUpdate_productVariant_product_variants {
  __typename: "SkillVariant";
  id: string;
  name: string;
  sku: string;
  images: (SimpleSkillUpdate_productVariantUpdate_productVariant_product_variants_images | null)[] | null;
}

export interface SimpleSkillUpdate_productVariantUpdate_productVariant_product {
  __typename: "Skill";
  id: string;
  images: (SimpleSkillUpdate_productVariantUpdate_productVariant_product_images | null)[] | null;
  name: string;
  thumbnail: SimpleSkillUpdate_productVariantUpdate_productVariant_product_thumbnail | null;
  variants: (SimpleSkillUpdate_productVariantUpdate_productVariant_product_variants | null)[] | null;
}

export interface SimpleSkillUpdate_productVariantUpdate_productVariant {
  __typename: "SkillVariant";
  id: string;
  attributes: SimpleSkillUpdate_productVariantUpdate_productVariant_attributes[];
  costPrice: SimpleSkillUpdate_productVariantUpdate_productVariant_costPrice | null;
  images: (SimpleSkillUpdate_productVariantUpdate_productVariant_images | null)[] | null;
  name: string;
  priceOverride: SimpleSkillUpdate_productVariantUpdate_productVariant_priceOverride | null;
  product: SimpleSkillUpdate_productVariantUpdate_productVariant_product;
  sku: string;
  quantity: number;
  quantityAllocated: number;
}

export interface SimpleSkillUpdate_productVariantUpdate {
  __typename: "SkillVariantUpdate";
  errors: SimpleSkillUpdate_productVariantUpdate_errors[] | null;
  productVariant: SimpleSkillUpdate_productVariantUpdate_productVariant | null;
}

export interface SimpleSkillUpdate {
  productUpdate: SimpleSkillUpdate_productUpdate | null;
  productVariantUpdate: SimpleSkillUpdate_productVariantUpdate | null;
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
  productVariantId: string;
  productVariantInput: SkillVariantInput;
}
