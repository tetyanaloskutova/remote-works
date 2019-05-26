/* tslint:disable */
// This file was automatically generated and should not be edited.

import { SkillTypeInput, TaxRateType } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: SkillTypeCreate
// ====================================================

export interface SkillTypeCreate_productTypeCreate_errors {
  __typename: "Error";
  field: string | null;
  message: string | null;
}

export interface SkillTypeCreate_productTypeCreate_productType_productAttributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface SkillTypeCreate_productTypeCreate_productType_productAttributes {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  values: (SkillTypeCreate_productTypeCreate_productType_productAttributes_values | null)[] | null;
}

export interface SkillTypeCreate_productTypeCreate_productType_variantAttributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface SkillTypeCreate_productTypeCreate_productType_variantAttributes {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  values: (SkillTypeCreate_productTypeCreate_productType_variantAttributes_values | null)[] | null;
}

export interface SkillTypeCreate_productTypeCreate_productType_weight {
  __typename: "Weight";
  unit: string;
  value: number;
}

export interface SkillTypeCreate_productTypeCreate_productType {
  __typename: "SkillType";
  id: string;
  name: string;
  hasVariants: boolean;
  isDeliveryRequired: boolean;
  taxRate: TaxRateType | null;
  productAttributes: (SkillTypeCreate_productTypeCreate_productType_productAttributes | null)[] | null;
  variantAttributes: (SkillTypeCreate_productTypeCreate_productType_variantAttributes | null)[] | null;
  weight: SkillTypeCreate_productTypeCreate_productType_weight | null;
}

export interface SkillTypeCreate_productTypeCreate {
  __typename: "SkillTypeCreate";
  errors: SkillTypeCreate_productTypeCreate_errors[] | null;
  productType: SkillTypeCreate_productTypeCreate_productType | null;
}

export interface SkillTypeCreate {
  productTypeCreate: SkillTypeCreate_productTypeCreate | null;
}

export interface SkillTypeCreateVariables {
  input: SkillTypeInput;
}
