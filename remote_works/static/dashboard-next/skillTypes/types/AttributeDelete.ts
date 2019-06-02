/* tslint:disable */
// This file was automatically generated and should not be edited.

import { TaxRateType } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: AttributeDelete
// ====================================================

export interface AttributeDelete_attributeDelete_errors {
  __typename: "Error";
  field: string | null;
  message: string | null;
}

export interface AttributeDelete_attributeDelete_skillType_skillAttributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface AttributeDelete_attributeDelete_skillType_skillAttributes {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  values: (AttributeDelete_attributeDelete_skillType_skillAttributes_values | null)[] | null;
}

export interface AttributeDelete_attributeDelete_skillType_variantAttributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface AttributeDelete_attributeDelete_skillType_variantAttributes {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  values: (AttributeDelete_attributeDelete_skillType_variantAttributes_values | null)[] | null;
}

export interface AttributeDelete_attributeDelete_skillType_weight {
  __typename: "Weight";
  unit: string;
  value: number;
}

export interface AttributeDelete_attributeDelete_skillType {
  __typename: "SkillType";
  id: string;
  name: string;
  hasVariants: boolean;
  isDeliveryRequired: boolean;
  taxRate: TaxRateType | null;
  skillAttributes: (AttributeDelete_attributeDelete_skillType_skillAttributes | null)[] | null;
  variantAttributes: (AttributeDelete_attributeDelete_skillType_variantAttributes | null)[] | null;
  weight: AttributeDelete_attributeDelete_skillType_weight | null;
}

export interface AttributeDelete_attributeDelete {
  __typename: "AttributeDelete";
  errors: AttributeDelete_attributeDelete_errors[] | null;
  skillType: AttributeDelete_attributeDelete_skillType | null;
}

export interface AttributeDelete {
  attributeDelete: AttributeDelete_attributeDelete | null;
}

export interface AttributeDeleteVariables {
  id: string;
}
