/* tslint:disable */
// This file was automatically generated and should not be edited.

import { AttributeCreateInput, AttributeTypeEnum, TaxRateType } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: AttributeCreate
// ====================================================

export interface AttributeCreate_attributeCreate_errors {
  __typename: "Error";
  field: string | null;
  message: string | null;
}

export interface AttributeCreate_attributeCreate_skillType_skillAttributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface AttributeCreate_attributeCreate_skillType_skillAttributes {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  values: (AttributeCreate_attributeCreate_skillType_skillAttributes_values | null)[] | null;
}

export interface AttributeCreate_attributeCreate_skillType_variantAttributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface AttributeCreate_attributeCreate_skillType_variantAttributes {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  values: (AttributeCreate_attributeCreate_skillType_variantAttributes_values | null)[] | null;
}

export interface AttributeCreate_attributeCreate_skillType_weight {
  __typename: "Weight";
  unit: string;
  value: number;
}

export interface AttributeCreate_attributeCreate_skillType {
  __typename: "SkillType";
  id: string;
  name: string;
  hasVariants: boolean;
  isDeliveryRequired: boolean;
  taxRate: TaxRateType | null;
  skillAttributes: (AttributeCreate_attributeCreate_skillType_skillAttributes | null)[] | null;
  variantAttributes: (AttributeCreate_attributeCreate_skillType_variantAttributes | null)[] | null;
  weight: AttributeCreate_attributeCreate_skillType_weight | null;
}

export interface AttributeCreate_attributeCreate {
  __typename: "AttributeCreate";
  errors: AttributeCreate_attributeCreate_errors[] | null;
  skillType: AttributeCreate_attributeCreate_skillType | null;
}

export interface AttributeCreate {
  attributeCreate: AttributeCreate_attributeCreate | null;
}

export interface AttributeCreateVariables {
  id: string;
  input: AttributeCreateInput;
  type: AttributeTypeEnum;
}
