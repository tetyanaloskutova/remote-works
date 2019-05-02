/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SkillVariantDetails
// ====================================================

export interface SkillVariantDetails_productVariant_attributes_attribute_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface SkillVariantDetails_productVariant_attributes_attribute {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  values: (SkillVariantDetails_productVariant_attributes_attribute_values | null)[] | null;
}

export interface SkillVariantDetails_productVariant_attributes_value {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface SkillVariantDetails_productVariant_attributes {
  __typename: "SelectedAttribute";
  attribute: SkillVariantDetails_productVariant_attributes_attribute;
  value: SkillVariantDetails_productVariant_attributes_value;
}

export interface SkillVariantDetails_productVariant_costPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SkillVariantDetails_productVariant_images {
  __typename: "SkillImage";
  id: string;
  url: string;
}

export interface SkillVariantDetails_productVariant_priceOverride {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SkillVariantDetails_productVariant_product_images {
  __typename: "SkillImage";
  id: string;
  alt: string;
  sortOrder: number;
  url: string;
}

export interface SkillVariantDetails_productVariant_product_thumbnail {
  __typename: "Image";
  url: string;
}

export interface SkillVariantDetails_productVariant_product_variants_images {
  __typename: "SkillImage";
  id: string;
  url: string;
}

export interface SkillVariantDetails_productVariant_product_variants {
  __typename: "SkillVariant";
  id: string;
  name: string;
  sku: string;
  images: (SkillVariantDetails_productVariant_product_variants_images | null)[] | null;
}

export interface SkillVariantDetails_productVariant_product {
  __typename: "Skill";
  id: string;
  images: (SkillVariantDetails_productVariant_product_images | null)[] | null;
  name: string;
  thumbnail: SkillVariantDetails_productVariant_product_thumbnail | null;
  variants: (SkillVariantDetails_productVariant_product_variants | null)[] | null;
}

export interface SkillVariantDetails_productVariant {
  __typename: "SkillVariant";
  id: string;
  attributes: SkillVariantDetails_productVariant_attributes[];
  costPrice: SkillVariantDetails_productVariant_costPrice | null;
  images: (SkillVariantDetails_productVariant_images | null)[] | null;
  name: string;
  priceOverride: SkillVariantDetails_productVariant_priceOverride | null;
  product: SkillVariantDetails_productVariant_product;
  sku: string;
  quantity: number;
  quantityAllocated: number;
}

export interface SkillVariantDetails {
  productVariant: SkillVariantDetails_productVariant | null;
}

export interface SkillVariantDetailsVariables {
  id: string;
}
