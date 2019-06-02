/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SkillImageCreate
// ====================================================

export interface SkillImageCreate_productImageCreate_errors {
  __typename: "Error";
  field: string | null;
  message: string | null;
}

export interface SkillImageCreate_productImageCreate_skill_category {
  __typename: "Category";
  id: string;
  name: string;
}

export interface SkillImageCreate_productImageCreate_skill_collections {
  __typename: "Collection";
  id: string;
  name: string;
}

export interface SkillImageCreate_productImageCreate_skill_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SkillImageCreate_productImageCreate_skill_margin {
  __typename: "Margin";
  start: number | null;
  stop: number | null;
}

export interface SkillImageCreate_productImageCreate_skill_purchaseCost_start {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SkillImageCreate_productImageCreate_skill_purchaseCost_stop {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SkillImageCreate_productImageCreate_skill_purchaseCost {
  __typename: "MoneyRange";
  start: SkillImageCreate_productImageCreate_skill_purchaseCost_start | null;
  stop: SkillImageCreate_productImageCreate_skill_purchaseCost_stop | null;
}

export interface SkillImageCreate_productImageCreate_skill_attributes_attribute_values {
  __typename: "AttributeValue";
  name: string | null;
  slug: string | null;
}

export interface SkillImageCreate_productImageCreate_skill_attributes_attribute {
  __typename: "Attribute";
  id: string;
  slug: string | null;
  name: string | null;
  values: (SkillImageCreate_productImageCreate_skill_attributes_attribute_values | null)[] | null;
}

export interface SkillImageCreate_productImageCreate_skill_attributes_value {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface SkillImageCreate_productImageCreate_skill_attributes {
  __typename: "SelectedAttribute";
  attribute: SkillImageCreate_productImageCreate_skill_attributes_attribute;
  value: SkillImageCreate_productImageCreate_skill_attributes_value;
}

export interface SkillImageCreate_productImageCreate_skill_availability_priceRange_start_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SkillImageCreate_productImageCreate_skill_availability_priceRange_start {
  __typename: "TaxedMoney";
  net: SkillImageCreate_productImageCreate_skill_availability_priceRange_start_net;
}

export interface SkillImageCreate_productImageCreate_skill_availability_priceRange_stop_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SkillImageCreate_productImageCreate_skill_availability_priceRange_stop {
  __typename: "TaxedMoney";
  net: SkillImageCreate_productImageCreate_skill_availability_priceRange_stop_net;
}

export interface SkillImageCreate_productImageCreate_skill_availability_priceRange {
  __typename: "TaxedMoneyRange";
  start: SkillImageCreate_productImageCreate_skill_availability_priceRange_start | null;
  stop: SkillImageCreate_productImageCreate_skill_availability_priceRange_stop | null;
}

export interface SkillImageCreate_productImageCreate_skill_availability {
  __typename: "SkillAvailability";
  available: boolean | null;
  priceRange: SkillImageCreate_productImageCreate_skill_availability_priceRange | null;
}

export interface SkillImageCreate_productImageCreate_skill_images {
  __typename: "SkillImage";
  id: string;
  alt: string;
  sortTask: number;
  url: string;
}

export interface SkillImageCreate_productImageCreate_skill_variants_priceOverride {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SkillImageCreate_productImageCreate_skill_variants {
  __typename: "SkillVariant";
  id: string;
  sku: string;
  name: string;
  priceOverride: SkillImageCreate_productImageCreate_skill_variants_priceOverride | null;
  margin: number | null;
  quantity: number;
  quantityAllocated: number;
  stockQuantity: number;
}

export interface SkillImageCreate_productImageCreate_skill_productType {
  __typename: "SkillType";
  id: string;
  name: string;
  hasVariants: boolean;
}

export interface SkillImageCreate_productImageCreate_skill {
  __typename: "Skill";
  id: string;
  name: string;
  descriptionJson: any;
  seoTitle: string | null;
  seoDescription: string | null;
  category: SkillImageCreate_productImageCreate_skill_category;
  collections: (SkillImageCreate_productImageCreate_skill_collections | null)[] | null;
  price: SkillImageCreate_productImageCreate_skill_price | null;
  margin: SkillImageCreate_productImageCreate_skill_margin | null;
  purchaseCost: SkillImageCreate_productImageCreate_skill_purchaseCost | null;
  isPublished: boolean;
  chargeTaxes: boolean;
  publicationDate: any | null;
  attributes: SkillImageCreate_productImageCreate_skill_attributes[];
  availability: SkillImageCreate_productImageCreate_skill_availability | null;
  images: (SkillImageCreate_productImageCreate_skill_images | null)[] | null;
  variants: (SkillImageCreate_productImageCreate_skill_variants | null)[] | null;
  productType: SkillImageCreate_productImageCreate_skill_productType;
  url: string;
}

export interface SkillImageCreate_productImageCreate {
  __typename: "SkillImageCreate";
  errors: SkillImageCreate_productImageCreate_errors[] | null;
  product: SkillImageCreate_productImageCreate_skill | null;
}

export interface SkillImageCreate {
  productImageCreate: SkillImageCreate_productImageCreate | null;
}

export interface SkillImageCreateVariables {
  product: string;
  image: any;
  alt?: string | null;
}