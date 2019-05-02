/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SkillImageUpdate
// ====================================================

export interface SkillImageUpdate_productImageUpdate_errors {
  __typename: "Error";
  field: string | null;
  message: string | null;
}

export interface SkillImageUpdate_productImageUpdate_product_category {
  __typename: "Category";
  id: string;
  name: string;
}

export interface SkillImageUpdate_productImageUpdate_product_collections {
  __typename: "Collection";
  id: string;
  name: string;
}

export interface SkillImageUpdate_productImageUpdate_product_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SkillImageUpdate_productImageUpdate_product_margin {
  __typename: "Margin";
  start: number | null;
  stop: number | null;
}

export interface SkillImageUpdate_productImageUpdate_product_purchaseCost_start {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SkillImageUpdate_productImageUpdate_product_purchaseCost_stop {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SkillImageUpdate_productImageUpdate_product_purchaseCost {
  __typename: "MoneyRange";
  start: SkillImageUpdate_productImageUpdate_product_purchaseCost_start | null;
  stop: SkillImageUpdate_productImageUpdate_product_purchaseCost_stop | null;
}

export interface SkillImageUpdate_productImageUpdate_product_attributes_attribute_values {
  __typename: "AttributeValue";
  name: string | null;
  slug: string | null;
}

export interface SkillImageUpdate_productImageUpdate_product_attributes_attribute {
  __typename: "Attribute";
  id: string;
  slug: string | null;
  name: string | null;
  values: (SkillImageUpdate_productImageUpdate_product_attributes_attribute_values | null)[] | null;
}

export interface SkillImageUpdate_productImageUpdate_product_attributes_value {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface SkillImageUpdate_productImageUpdate_product_attributes {
  __typename: "SelectedAttribute";
  attribute: SkillImageUpdate_productImageUpdate_product_attributes_attribute;
  value: SkillImageUpdate_productImageUpdate_product_attributes_value;
}

export interface SkillImageUpdate_productImageUpdate_product_availability_priceRange_start_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SkillImageUpdate_productImageUpdate_product_availability_priceRange_start {
  __typename: "TaxedMoney";
  net: SkillImageUpdate_productImageUpdate_product_availability_priceRange_start_net;
}

export interface SkillImageUpdate_productImageUpdate_product_availability_priceRange_stop_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SkillImageUpdate_productImageUpdate_product_availability_priceRange_stop {
  __typename: "TaxedMoney";
  net: SkillImageUpdate_productImageUpdate_product_availability_priceRange_stop_net;
}

export interface SkillImageUpdate_productImageUpdate_product_availability_priceRange {
  __typename: "TaxedMoneyRange";
  start: SkillImageUpdate_productImageUpdate_product_availability_priceRange_start | null;
  stop: SkillImageUpdate_productImageUpdate_product_availability_priceRange_stop | null;
}

export interface SkillImageUpdate_productImageUpdate_product_availability {
  __typename: "SkillAvailability";
  available: boolean | null;
  priceRange: SkillImageUpdate_productImageUpdate_product_availability_priceRange | null;
}

export interface SkillImageUpdate_productImageUpdate_product_images {
  __typename: "SkillImage";
  id: string;
  alt: string;
  sortOrder: number;
  url: string;
}

export interface SkillImageUpdate_productImageUpdate_product_variants_priceOverride {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SkillImageUpdate_productImageUpdate_product_variants {
  __typename: "SkillVariant";
  id: string;
  sku: string;
  name: string;
  priceOverride: SkillImageUpdate_productImageUpdate_product_variants_priceOverride | null;
  margin: number | null;
  quantity: number;
  quantityAllocated: number;
  stockQuantity: number;
}

export interface SkillImageUpdate_productImageUpdate_product_productType {
  __typename: "SkillType";
  id: string;
  name: string;
  hasVariants: boolean;
}

export interface SkillImageUpdate_productImageUpdate_product {
  __typename: "Skill";
  id: string;
  name: string;
  descriptionJson: any;
  seoTitle: string | null;
  seoDescription: string | null;
  category: SkillImageUpdate_productImageUpdate_product_category;
  collections: (SkillImageUpdate_productImageUpdate_product_collections | null)[] | null;
  price: SkillImageUpdate_productImageUpdate_product_price | null;
  margin: SkillImageUpdate_productImageUpdate_product_margin | null;
  purchaseCost: SkillImageUpdate_productImageUpdate_product_purchaseCost | null;
  isPublished: boolean;
  chargeTaxes: boolean;
  publicationDate: any | null;
  attributes: SkillImageUpdate_productImageUpdate_product_attributes[];
  availability: SkillImageUpdate_productImageUpdate_product_availability | null;
  images: (SkillImageUpdate_productImageUpdate_product_images | null)[] | null;
  variants: (SkillImageUpdate_productImageUpdate_product_variants | null)[] | null;
  productType: SkillImageUpdate_productImageUpdate_product_productType;
  url: string;
}

export interface SkillImageUpdate_productImageUpdate {
  __typename: "SkillImageUpdate";
  errors: SkillImageUpdate_productImageUpdate_errors[] | null;
  product: SkillImageUpdate_productImageUpdate_product | null;
}

export interface SkillImageUpdate {
  productImageUpdate: SkillImageUpdate_productImageUpdate | null;
}

export interface SkillImageUpdateVariables {
  id: string;
  alt: string;
}
