/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SkillVariantCreateData
// ====================================================

export interface SkillVariantCreateData_product_images {
  __typename: "SkillImage";
  id: string;
  sortOrder: number;
  url: string;
}

export interface SkillVariantCreateData_product_productType_variantAttributes_values {
  __typename: "AttributeValue";
  id: string;
  sortOrder: number;
  name: string | null;
  slug: string | null;
}

export interface SkillVariantCreateData_product_productType_variantAttributes {
  __typename: "Attribute";
  id: string;
  slug: string | null;
  name: string | null;
  values: (SkillVariantCreateData_product_productType_variantAttributes_values | null)[] | null;
}

export interface SkillVariantCreateData_product_productType {
  __typename: "SkillType";
  id: string;
  variantAttributes: (SkillVariantCreateData_product_productType_variantAttributes | null)[] | null;
}

export interface SkillVariantCreateData_product_variants_images {
  __typename: "SkillImage";
  id: string;
  url: string;
}

export interface SkillVariantCreateData_product_variants {
  __typename: "SkillVariant";
  id: string;
  name: string;
  sku: string;
  images: (SkillVariantCreateData_product_variants_images | null)[] | null;
}

export interface SkillVariantCreateData_product {
  __typename: "Skill";
  id: string;
  images: (SkillVariantCreateData_product_images | null)[] | null;
  productType: SkillVariantCreateData_product_productType;
  variants: (SkillVariantCreateData_product_variants | null)[] | null;
}

export interface SkillVariantCreateData {
  product: SkillVariantCreateData_product | null;
}

export interface SkillVariantCreateDataVariables {
  id: string;
}
