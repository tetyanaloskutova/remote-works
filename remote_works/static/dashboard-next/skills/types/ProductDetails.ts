/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SkillDetails
// ====================================================

export interface SkillDetails_product_category {
  __typename: "Category";
  id: string;
  name: string;
}

export interface SkillDetails_product_collections {
  __typename: "Collection";
  id: string;
  name: string;
}

export interface SkillDetails_product_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SkillDetails_product_margin {
  __typename: "Margin";
  start: number | null;
  stop: number | null;
}

export interface SkillDetails_product_purchaseCost_start {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SkillDetails_product_purchaseCost_stop {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SkillDetails_product_purchaseCost {
  __typename: "MoneyRange";
  start: SkillDetails_product_purchaseCost_start | null;
  stop: SkillDetails_product_purchaseCost_stop | null;
}

export interface SkillDetails_product_attributes_attribute_values {
  __typename: "AttributeValue";
  name: string | null;
  slug: string | null;
}

export interface SkillDetails_product_attributes_attribute {
  __typename: "Attribute";
  id: string;
  slug: string | null;
  name: string | null;
  values: (SkillDetails_product_attributes_attribute_values | null)[] | null;
}

export interface SkillDetails_product_attributes_value {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface SkillDetails_product_attributes {
  __typename: "SelectedAttribute";
  attribute: SkillDetails_product_attributes_attribute;
  value: SkillDetails_product_attributes_value;
}

export interface SkillDetails_product_availability_priceRange_start_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SkillDetails_product_availability_priceRange_start {
  __typename: "TaxedMoney";
  net: SkillDetails_product_availability_priceRange_start_net;
}

export interface SkillDetails_product_availability_priceRange_stop_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SkillDetails_product_availability_priceRange_stop {
  __typename: "TaxedMoney";
  net: SkillDetails_product_availability_priceRange_stop_net;
}

export interface SkillDetails_product_availability_priceRange {
  __typename: "TaxedMoneyRange";
  start: SkillDetails_product_availability_priceRange_start | null;
  stop: SkillDetails_product_availability_priceRange_stop | null;
}

export interface SkillDetails_product_availability {
  __typename: "SkillAvailability";
  available: boolean | null;
  priceRange: SkillDetails_product_availability_priceRange | null;
}

export interface SkillDetails_product_images {
  __typename: "SkillImage";
  id: string;
  alt: string;
  sortOrder: number;
  url: string;
}

export interface SkillDetails_product_variants_priceOverride {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SkillDetails_product_variants {
  __typename: "SkillVariant";
  id: string;
  sku: string;
  name: string;
  priceOverride: SkillDetails_product_variants_priceOverride | null;
  margin: number | null;
  quantity: number;
  quantityAllocated: number;
  stockQuantity: number;
}

export interface SkillDetails_product_productType {
  __typename: "SkillType";
  id: string;
  name: string;
  hasVariants: boolean;
}

export interface SkillDetails_product {
  __typename: "Skill";
  id: string;
  name: string;
  descriptionJson: any;
  seoTitle: string | null;
  seoDescription: string | null;
  category: SkillDetails_product_category;
  collections: (SkillDetails_product_collections | null)[] | null;
  price: SkillDetails_product_price | null;
  margin: SkillDetails_product_margin | null;
  purchaseCost: SkillDetails_product_purchaseCost | null;
  isPublished: boolean;
  chargeTaxes: boolean;
  publicationDate: any | null;
  attributes: SkillDetails_product_attributes[];
  availability: SkillDetails_product_availability | null;
  images: (SkillDetails_product_images | null)[] | null;
  variants: (SkillDetails_product_variants | null)[] | null;
  productType: SkillDetails_product_productType;
  url: string;
}

export interface SkillDetails {
  product: SkillDetails_product | null;
}

export interface SkillDetailsVariables {
  id: string;
}
