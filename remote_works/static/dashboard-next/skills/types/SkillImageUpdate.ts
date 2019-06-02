/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SkillImageUpdate
// ====================================================

export interface SkillImageUpdate_skillImageUpdate_errors {
  __typename: "Error";
  field: string | null;
  message: string | null;
}

export interface SkillImageUpdate_skillImageUpdate_skill_category {
  __typename: "Category";
  id: string;
  name: string;
}

export interface SkillImageUpdate_skillImageUpdate_skill_collections {
  __typename: "Collection";
  id: string;
  name: string;
}

export interface SkillImageUpdate_skillImageUpdate_skill_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SkillImageUpdate_skillImageUpdate_skill_margin {
  __typename: "Margin";
  start: number | null;
  stop: number | null;
}

export interface SkillImageUpdate_skillImageUpdate_skill_purchaseCost_start {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SkillImageUpdate_skillImageUpdate_skill_purchaseCost_stop {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SkillImageUpdate_skillImageUpdate_skill_purchaseCost {
  __typename: "MoneyRange";
  start: SkillImageUpdate_skillImageUpdate_skill_purchaseCost_start | null;
  stop: SkillImageUpdate_skillImageUpdate_skill_purchaseCost_stop | null;
}

export interface SkillImageUpdate_skillImageUpdate_skill_attributes_attribute_values {
  __typename: "AttributeValue";
  name: string | null;
  slug: string | null;
}

export interface SkillImageUpdate_skillImageUpdate_skill_attributes_attribute {
  __typename: "Attribute";
  id: string;
  slug: string | null;
  name: string | null;
  values: (SkillImageUpdate_skillImageUpdate_skill_attributes_attribute_values | null)[] | null;
}

export interface SkillImageUpdate_skillImageUpdate_skill_attributes_value {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface SkillImageUpdate_skillImageUpdate_skill_attributes {
  __typename: "SelectedAttribute";
  attribute: SkillImageUpdate_skillImageUpdate_skill_attributes_attribute;
  value: SkillImageUpdate_skillImageUpdate_skill_attributes_value;
}

export interface SkillImageUpdate_skillImageUpdate_skill_availability_priceRange_start_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SkillImageUpdate_skillImageUpdate_skill_availability_priceRange_start {
  __typename: "TaxedMoney";
  net: SkillImageUpdate_skillImageUpdate_skill_availability_priceRange_start_net;
}

export interface SkillImageUpdate_skillImageUpdate_skill_availability_priceRange_stop_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SkillImageUpdate_skillImageUpdate_skill_availability_priceRange_stop {
  __typename: "TaxedMoney";
  net: SkillImageUpdate_skillImageUpdate_skill_availability_priceRange_stop_net;
}

export interface SkillImageUpdate_skillImageUpdate_skill_availability_priceRange {
  __typename: "TaxedMoneyRange";
  start: SkillImageUpdate_skillImageUpdate_skill_availability_priceRange_start | null;
  stop: SkillImageUpdate_skillImageUpdate_skill_availability_priceRange_stop | null;
}

export interface SkillImageUpdate_skillImageUpdate_skill_availability {
  __typename: "SkillAvailability";
  available: boolean | null;
  priceRange: SkillImageUpdate_skillImageUpdate_skill_availability_priceRange | null;
}

export interface SkillImageUpdate_skillImageUpdate_skill_images {
  __typename: "SkillImage";
  id: string;
  alt: string;
  sortTask: number;
  url: string;
}

export interface SkillImageUpdate_skillImageUpdate_skill_variants_priceOverride {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SkillImageUpdate_skillImageUpdate_skill_variants {
  __typename: "SkillVariant";
  id: string;
  sku: string;
  name: string;
  priceOverride: SkillImageUpdate_skillImageUpdate_skill_variants_priceOverride | null;
  margin: number | null;
  quantity: number;
  quantityAllocated: number;
  stockQuantity: number;
}

export interface SkillImageUpdate_skillImageUpdate_skill_skillType {
  __typename: "SkillType";
  id: string;
  name: string;
  hasVariants: boolean;
}

export interface SkillImageUpdate_skillImageUpdate_skill {
  __typename: "Skill";
  id: string;
  name: string;
  descriptionJson: any;
  seoTitle: string | null;
  seoDescription: string | null;
  category: SkillImageUpdate_skillImageUpdate_skill_category;
  collections: (SkillImageUpdate_skillImageUpdate_skill_collections | null)[] | null;
  price: SkillImageUpdate_skillImageUpdate_skill_price | null;
  margin: SkillImageUpdate_skillImageUpdate_skill_margin | null;
  purchaseCost: SkillImageUpdate_skillImageUpdate_skill_purchaseCost | null;
  isPublished: boolean;
  chargeTaxes: boolean;
  publicationDate: any | null;
  attributes: SkillImageUpdate_skillImageUpdate_skill_attributes[];
  availability: SkillImageUpdate_skillImageUpdate_skill_availability | null;
  images: (SkillImageUpdate_skillImageUpdate_skill_images | null)[] | null;
  variants: (SkillImageUpdate_skillImageUpdate_skill_variants | null)[] | null;
  skillType: SkillImageUpdate_skillImageUpdate_skill_skillType;
  url: string;
}

export interface SkillImageUpdate_skillImageUpdate {
  __typename: "SkillImageUpdate";
  errors: SkillImageUpdate_skillImageUpdate_errors[] | null;
  skill: SkillImageUpdate_skillImageUpdate_skill | null;
}

export interface SkillImageUpdate {
  skillImageUpdate: SkillImageUpdate_skillImageUpdate | null;
}

export interface SkillImageUpdateVariables {
  id: string;
  alt: string;
}
