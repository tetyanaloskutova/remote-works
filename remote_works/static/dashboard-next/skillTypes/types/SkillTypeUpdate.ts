/* tslint:disable */
// This file was automatically generated and should not be edited.

import { SkillTypeInput, TaxRateType } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: SkillTypeUpdate
// ====================================================

export interface SkillTypeUpdate_skillTypeUpdate_errors {
  __typename: "Error";
  field: string | null;
  message: string | null;
}

export interface SkillTypeUpdate_skillTypeUpdate_skillType_skillAttributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface SkillTypeUpdate_skillTypeUpdate_skillType_skillAttributes {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  values: (SkillTypeUpdate_skillTypeUpdate_skillType_skillAttributes_values | null)[] | null;
}

export interface SkillTypeUpdate_skillTypeUpdate_skillType_variantAttributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface SkillTypeUpdate_skillTypeUpdate_skillType_variantAttributes {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  values: (SkillTypeUpdate_skillTypeUpdate_skillType_variantAttributes_values | null)[] | null;
}

export interface SkillTypeUpdate_skillTypeUpdate_skillType_weight {
  __typename: "Weight";
  unit: string;
  value: number;
}

export interface SkillTypeUpdate_skillTypeUpdate_skillType {
  __typename: "SkillType";
  id: string;
  name: string;
  hasVariants: boolean;
  isDeliveryRequired: boolean;
  taxRate: TaxRateType | null;
  skillAttributes: (SkillTypeUpdate_skillTypeUpdate_skillType_skillAttributes | null)[] | null;
  variantAttributes: (SkillTypeUpdate_skillTypeUpdate_skillType_variantAttributes | null)[] | null;
  weight: SkillTypeUpdate_skillTypeUpdate_skillType_weight | null;
}

export interface SkillTypeUpdate_skillTypeUpdate {
  __typename: "SkillTypeUpdate";
  errors: SkillTypeUpdate_skillTypeUpdate_errors[] | null;
  skillType: SkillTypeUpdate_skillTypeUpdate_skillType | null;
}

export interface SkillTypeUpdate {
  skillTypeUpdate: SkillTypeUpdate_skillTypeUpdate | null;
}

export interface SkillTypeUpdateVariables {
  id: string;
  input: SkillTypeInput;
}
