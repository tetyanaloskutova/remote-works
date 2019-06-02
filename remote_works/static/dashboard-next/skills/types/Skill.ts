/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: Skill
// ====================================================

export interface Skill_category {
  __typename: "Category";
  id: string;
  name: string;
}

export interface Skill_collections {
  __typename: "Collection";
  id: string;
  name: string;
}

export interface Skill_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface Skill_margin {
  __typename: "Margin";
  start: number | null;
  stop: number | null;
}

export interface Skill_purchaseCost_start {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface Skill_purchaseCost_stop {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface Skill_purchaseCost {
  __typename: "MoneyRange";
  start: Skill_purchaseCost_start | null;
  stop: Skill_purchaseCost_stop | null;
}

export interface Skill_attributes_attribute_values {
  __typename: "AttributeValue";
  name: string | null;
  slug: string | null;
}

export interface Skill_attributes_attribute {
  __typename: "Attribute";
  id: string;
  slug: string | null;
  name: string | null;
  values: (Skill_attributes_attribute_values | null)[] | null;
}

export interface Skill_attributes_value {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface Skill_attributes {
  __typename: "SelectedAttribute";
  attribute: Skill_attributes_attribute;
  value: Skill_attributes_value;
}

export interface Skill_availability_priceRange_start_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface Skill_availability_priceRange_start {
  __typename: "TaxedMoney";
  net: Skill_availability_priceRange_start_net;
}

export interface Skill_availability_priceRange_stop_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface Skill_availability_priceRange_stop {
  __typename: "TaxedMoney";
  net: Skill_availability_priceRange_stop_net;
}

export interface Skill_availability_priceRange {
  __typename: "TaxedMoneyRange";
  start: Skill_availability_priceRange_start | null;
  stop: Skill_availability_priceRange_stop | null;
}

export interface Skill_availability {
  __typename: "SkillAvailability";
  available: boolean | null;
  priceRange: Skill_availability_priceRange | null;
}

export interface Skill_images {
  __typename: "SkillImage";
  id: string;
  alt: string;
  sortTask: number;
  url: string;
}

export interface Skill_variants_priceOverride {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface Skill_variants {
  __typename: "SkillVariant";
  id: string;
  sku: string;
  name: string;
  priceOverride: Skill_variants_priceOverride | null;
  margin: number | null;
  quantity: number;
  quantityAllocated: number;
  stockQuantity: number;
}

export interface Skill_skillType {
  __typename: "SkillType";
  id: string;
  name: string;
  hasVariants: boolean;
}

export interface Skill {
  __typename: "Skill";
  id: string;
  name: string;
  descriptionJson: any;
  seoTitle: string | null;
  seoDescription: string | null;
  category: Skill_category;
  collections: (Skill_collections | null)[] | null;
  price: Skill_price | null;
  margin: Skill_margin | null;
  purchaseCost: Skill_purchaseCost | null;
  isPublished: boolean;
  chargeTaxes: boolean;
  publicationDate: any | null;
  attributes: Skill_attributes[];
  availability: Skill_availability | null;
  images: (Skill_images | null)[] | null;
  variants: (Skill_variants | null)[] | null;
  skillType: Skill_skillType;
  url: string;
}
