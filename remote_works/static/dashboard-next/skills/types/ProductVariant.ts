/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: SkillVariant
// ====================================================

export interface SkillVariant_attributes_attribute_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface SkillVariant_attributes_attribute {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  values: (SkillVariant_attributes_attribute_values | null)[] | null;
}

export interface SkillVariant_attributes_value {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface SkillVariant_attributes {
  __typename: "SelectedAttribute";
  attribute: SkillVariant_attributes_attribute;
  value: SkillVariant_attributes_value;
}

export interface SkillVariant_costPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SkillVariant_images {
  __typename: "SkillImage";
  id: string;
  url: string;
}

export interface SkillVariant_priceOverride {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SkillVariant_product_images {
  __typename: "SkillImage";
  id: string;
  alt: string;
  sortOrder: number;
  url: string;
}

export interface SkillVariant_product_thumbnail {
  __typename: "Image";
  url: string;
}

export interface SkillVariant_product_variants_images {
  __typename: "SkillImage";
  id: string;
  url: string;
}

export interface SkillVariant_product_variants {
  __typename: "SkillVariant";
  id: string;
  name: string;
  sku: string;
  images: (SkillVariant_product_variants_images | null)[] | null;
}

export interface SkillVariant_product {
  __typename: "Skill";
  id: string;
  images: (SkillVariant_product_images | null)[] | null;
  name: string;
  thumbnail: SkillVariant_product_thumbnail | null;
  variants: (SkillVariant_product_variants | null)[] | null;
}

export interface SkillVariant {
  __typename: "SkillVariant";
  id: string;
  attributes: SkillVariant_attributes[];
  costPrice: SkillVariant_costPrice | null;
  images: (SkillVariant_images | null)[] | null;
  name: string;
  priceOverride: SkillVariant_priceOverride | null;
  product: SkillVariant_product;
  sku: string;
  quantity: number;
  quantityAllocated: number;
}
