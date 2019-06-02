/* tslint:disable */
// This file was automatically generated and should not be edited.

import { AttributeValueInput } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: SkillCreate
// ====================================================

export interface SkillCreate_skillCreate_errors {
  __typename: "Error";
  field: string | null;
  message: string | null;
}

export interface SkillCreate_skillCreate_skill_category {
  __typename: "Category";
  id: string;
  name: string;
}

export interface SkillCreate_skillCreate_skill_collections {
  __typename: "Collection";
  id: string;
  name: string;
}

export interface SkillCreate_skillCreate_skill_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SkillCreate_skillCreate_skill_margin {
  __typename: "Margin";
  start: number | null;
  stop: number | null;
}

export interface SkillCreate_skillCreate_skill_purchaseCost_start {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SkillCreate_skillCreate_skill_purchaseCost_stop {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SkillCreate_skillCreate_skill_purchaseCost {
  __typename: "MoneyRange";
  start: SkillCreate_skillCreate_skill_purchaseCost_start | null;
  stop: SkillCreate_skillCreate_skill_purchaseCost_stop | null;
}

export interface SkillCreate_skillCreate_skill_attributes_attribute_values {
  __typename: "AttributeValue";
  name: string | null;
  slug: string | null;
}

export interface SkillCreate_skillCreate_skill_attributes_attribute {
  __typename: "Attribute";
  id: string;
  slug: string | null;
  name: string | null;
  values: (SkillCreate_skillCreate_skill_attributes_attribute_values | null)[] | null;
}

export interface SkillCreate_skillCreate_skill_attributes_value {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface SkillCreate_skillCreate_skill_attributes {
  __typename: "SelectedAttribute";
  attribute: SkillCreate_skillCreate_skill_attributes_attribute;
  value: SkillCreate_skillCreate_skill_attributes_value;
}

export interface SkillCreate_skillCreate_skill_availability_priceRange_start_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SkillCreate_skillCreate_skill_availability_priceRange_start {
  __typename: "TaxedMoney";
  net: SkillCreate_skillCreate_skill_availability_priceRange_start_net;
}

export interface SkillCreate_skillCreate_skill_availability_priceRange_stop_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SkillCreate_skillCreate_skill_availability_priceRange_stop {
  __typename: "TaxedMoney";
  net: SkillCreate_skillCreate_skill_availability_priceRange_stop_net;
}

export interface SkillCreate_skillCreate_skill_availability_priceRange {
  __typename: "TaxedMoneyRange";
  start: SkillCreate_skillCreate_skill_availability_priceRange_start | null;
  stop: SkillCreate_skillCreate_skill_availability_priceRange_stop | null;
}

export interface SkillCreate_skillCreate_skill_availability {
  __typename: "SkillAvailability";
  available: boolean | null;
  priceRange: SkillCreate_skillCreate_skill_availability_priceRange | null;
}

export interface SkillCreate_skillCreate_skill_images {
  __typename: "SkillImage";
  id: string;
  alt: string;
  sortTask: number;
  url: string;
}

export interface SkillCreate_skillCreate_skill_variants_priceOverride {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SkillCreate_skillCreate_skill_variants {
  __typename: "SkillVariant";
  id: string;
  sku: string;
  name: string;
  priceOverride: SkillCreate_skillCreate_skill_variants_priceOverride | null;
  margin: number | null;
  quantity: number;
  quantityAllocated: number;
  availabilityQuantity: number;
}

export interface SkillCreate_skillCreate_skill_skillType {
  __typename: "SkillType";
  id: string;
  name: string;
  hasVariants: boolean;
}

export interface SkillCreate_skillCreate_skill {
  __typename: "Skill";
  id: string;
  name: string;
  descriptionJson: any;
  seoTitle: string | null;
  seoDescription: string | null;
  category: SkillCreate_skillCreate_skill_category;
  collections: (SkillCreate_skillCreate_skill_collections | null)[] | null;
  price: SkillCreate_skillCreate_skill_price | null;
  margin: SkillCreate_skillCreate_skill_margin | null;
  purchaseCost: SkillCreate_skillCreate_skill_purchaseCost | null;
  isPublished: boolean;
  chargeTaxes: boolean;
  publicationDate: any | null;
  attributes: SkillCreate_skillCreate_skill_attributes[];
  availability: SkillCreate_skillCreate_skill_availability | null;
  images: (SkillCreate_skillCreate_skill_images | null)[] | null;
  variants: (SkillCreate_skillCreate_skill_variants | null)[] | null;
  skillType: SkillCreate_skillCreate_skill_skillType;
  url: string;
}

export interface SkillCreate_skillCreate {
  __typename: "SkillCreate";
  errors: SkillCreate_skillCreate_errors[] | null;
  skill: SkillCreate_skillCreate_skill | null;
}

export interface SkillCreate {
  skillCreate: SkillCreate_skillCreate | null;
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
  skillType: string;
}
