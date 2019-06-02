/* tslint:disable */
// This file was automatically generated and should not be edited.

import { SkillTypeInput, TaxRateType } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: SkillTypeCreate
// ====================================================

export interface SkillTypeCreate_skillTypeCreate_errors {
  __typename: "Error";
  field: string | null;
  message: string | null;
}

export interface SkillTypeCreate_skillTypeCreate_skillType_skillAttributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface SkillTypeCreate_skillTypeCreate_skillType_skillAttributes {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  values: (SkillTypeCreate_skillTypeCreate_skillType_skillAttributes_values | null)[] | null;
}

export interface SkillTypeCreate_skillTypeCreate_skillType_variantAttributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface SkillTypeCreate_skillTypeCreate_skillType_variantAttributes {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  values: (SkillTypeCreate_skillTypeCreate_skillType_variantAttributes_values | null)[] | null;
}

export interface SkillTypeCreate_skillTypeCreate_skillType_weight {
  __typename: "Weight";
  unit: string;
  value: number;
}

export interface SkillTypeCreate_skillTypeCreate_skillType {
  __typename: "SkillType";
  id: string;
  name: string;
  hasVariants: boolean;
  isDeliveryRequired: boolean;
  taxRate: TaxRateType | null;
  skillAttributes: (SkillTypeCreate_skillTypeCreate_skillType_skillAttributes | null)[] | null;
  variantAttributes: (SkillTypeCreate_skillTypeCreate_skillType_variantAttributes | null)[] | null;
  weight: SkillTypeCreate_skillTypeCreate_skillType_weight | null;
}

export interface SkillTypeCreate_skillTypeCreate {
  __typename: "SkillTypeCreate";
  errors: SkillTypeCreate_skillTypeCreate_errors[] | null;
  skillType: SkillTypeCreate_skillTypeCreate_skillType | null;
}

export interface SkillTypeCreate {
  skillTypeCreate: SkillTypeCreate_skillTypeCreate | null;
}

export interface SkillTypeCreateVariables {
  input: SkillTypeInput;
}
