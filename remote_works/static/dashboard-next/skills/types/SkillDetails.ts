/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SkillDetails
// ====================================================

export interface SkillDetails_skill_category {
  __typename: "Category";
  id: string;
  name: string;
}

export interface SkillDetails_skill_collections {
  __typename: "Collection";
  id: string;
  name: string;
}

export interface SkillDetails_skill_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SkillDetails_skill_margin {
  __typename: "Margin";
  start: number | null;
  stop: number | null;
}

export interface SkillDetails_skill_purchaseCost_start {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SkillDetails_skill_purchaseCost_stop {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SkillDetails_skill_purchaseCost {
  __typename: "MoneyRange";
  start: SkillDetails_skill_purchaseCost_start | null;
  stop: SkillDetails_skill_purchaseCost_stop | null;
}

export interface SkillDetails_skill_attributes_attribute_values {
  __typename: "AttributeValue";
  name: string | null;
  slug: string | null;
}

export interface SkillDetails_skill_attributes_attribute {
  __typename: "Attribute";
  id: string;
  slug: string | null;
  name: string | null;
  values: (SkillDetails_skill_attributes_attribute_values | null)[] | null;
}

export interface SkillDetails_skill_attributes_value {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface SkillDetails_skill_attributes {
  __typename: "SelectedAttribute";
  attribute: SkillDetails_skill_attributes_attribute;
  value: SkillDetails_skill_attributes_value;
}

export interface SkillDetails_skill_availability_priceRange_start_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SkillDetails_skill_availability_priceRange_start {
  __typename: "TaxedMoney";
  net: SkillDetails_skill_availability_priceRange_start_net;
}

export interface SkillDetails_skill_availability_priceRange_stop_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SkillDetails_skill_availability_priceRange_stop {
  __typename: "TaxedMoney";
  net: SkillDetails_skill_availability_priceRange_stop_net;
}

export interface SkillDetails_skill_availability_priceRange {
  __typename: "TaxedMoneyRange";
  start: SkillDetails_skill_availability_priceRange_start | null;
  stop: SkillDetails_skill_availability_priceRange_stop | null;
}

export interface SkillDetails_skill_availability {
  __typename: "SkillAvailability";
  available: boolean | null;
  priceRange: SkillDetails_skill_availability_priceRange | null;
}

export interface SkillDetails_skill_images {
  __typename: "SkillImage";
  id: string;
  alt: string;
  sortTask: number;
  url: string;
}

export interface SkillDetails_skill_variants_priceOverride {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SkillDetails_skill_variants {
  __typename: "SkillVariant";
  id: string;
  sku: string;
  name: string;
  priceOverride: SkillDetails_skill_variants_priceOverride | null;
  margin: number | null;
  quantity: number;
  quantityAllocated: number;
  stockQuantity: number;
}

export interface SkillDetails_skill_skillType {
  __typename: "SkillType";
  id: string;
  name: string;
  hasVariants: boolean;
}

export interface SkillDetails_skill {
  __typename: "Skill";
  id: string;
  name: string;
  descriptionJson: any;
  seoTitle: string | null;
  seoDescription: string | null;
  category: SkillDetails_skill_category;
  collections: (SkillDetails_skill_collections | null)[] | null;
  price: SkillDetails_skill_price | null;
  margin: SkillDetails_skill_margin | null;
  purchaseCost: SkillDetails_skill_purchaseCost | null;
  isPublished: boolean;
  chargeTaxes: boolean;
  publicationDate: any | null;
  attributes: SkillDetails_skill_attributes[];
  availability: SkillDetails_skill_availability | null;
  images: (SkillDetails_skill_images | null)[] | null;
  variants: (SkillDetails_skill_variants | null)[] | null;
  skillType: SkillDetails_skill_skillType;
  url: string;
}

export interface SkillDetails {
  skill: SkillDetails_skill | null;
}

export interface SkillDetailsVariables {
  id: string;
}
