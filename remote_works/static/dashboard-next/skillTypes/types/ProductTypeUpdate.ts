/* tslint:disable */
// This file was automatically generated and should not be edited.

import { SkillTypeInput, TaxRateType } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: SkillTypeUpdate
// ====================================================

export interface SkillTypeUpdate_productTypeUpdate_errors {
  __typename: "Error";
  field: string | null;
  message: string | null;
}

export interface SkillTypeUpdate_productTypeUpdate_productType_productAttributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface SkillTypeUpdate_productTypeUpdate_productType_productAttributes {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  values: (SkillTypeUpdate_productTypeUpdate_productType_productAttributes_values | null)[] | null;
}

export interface SkillTypeUpdate_productTypeUpdate_productType_variantAttributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface SkillTypeUpdate_productTypeUpdate_productType_variantAttributes {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  values: (SkillTypeUpdate_productTypeUpdate_productType_variantAttributes_values | null)[] | null;
}

export interface SkillTypeUpdate_productTypeUpdate_productType_weight {
  __typename: "Weight";
  unit: string;
  value: number;
}

export interface SkillTypeUpdate_productTypeUpdate_productType {
  __typename: "SkillType";
  id: string;
  name: string;
  hasVariants: boolean;
  isDeliveryRequired: boolean;
  taxRate: TaxRateType | null;
  productAttributes: (SkillTypeUpdate_productTypeUpdate_productType_productAttributes | null)[] | null;
  variantAttributes: (SkillTypeUpdate_productTypeUpdate_productType_variantAttributes | null)[] | null;
  weight: SkillTypeUpdate_productTypeUpdate_productType_weight | null;
}

export interface SkillTypeUpdate_productTypeUpdate {
  __typename: "SkillTypeUpdate";
  errors: SkillTypeUpdate_productTypeUpdate_errors[] | null;
  productType: SkillTypeUpdate_productTypeUpdate_productType | null;
}

export interface SkillTypeUpdate {
  productTypeUpdate: SkillTypeUpdate_productTypeUpdate | null;
}

export interface SkillTypeUpdateVariables {
  id: string;
  input: SkillTypeInput;
}
