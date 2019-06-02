/* tslint:disable */
// This file was automatically generated and should not be edited.

import { TaxRateType, WeightUnitsEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: SkillTypeDetails
// ====================================================

export interface SkillTypeDetails_skillType_skillAttributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface SkillTypeDetails_skillType_skillAttributes {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  values: (SkillTypeDetails_skillType_skillAttributes_values | null)[] | null;
}

export interface SkillTypeDetails_skillType_variantAttributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface SkillTypeDetails_skillType_variantAttributes {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  values: (SkillTypeDetails_skillType_variantAttributes_values | null)[] | null;
}

export interface SkillTypeDetails_skillType_weight {
  __typename: "Weight";
  unit: string;
  value: number;
}

export interface SkillTypeDetails_skillType {
  __typename: "SkillType";
  id: string;
  name: string;
  hasVariants: boolean;
  isDeliveryRequired: boolean;
  taxRate: TaxRateType | null;
  skillAttributes: (SkillTypeDetails_skillType_skillAttributes | null)[] | null;
  variantAttributes: (SkillTypeDetails_skillType_variantAttributes | null)[] | null;
  weight: SkillTypeDetails_skillType_weight | null;
}

export interface SkillTypeDetails_shop {
  __typename: "Shop";
  defaultWeightUnit: WeightUnitsEnum | null;
}

export interface SkillTypeDetails {
  skillType: SkillTypeDetails_skillType | null;
  shop: SkillTypeDetails_shop | null;
}

export interface SkillTypeDetailsVariables {
  id: string;
}
