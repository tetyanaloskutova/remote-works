/* tslint:disable */
// This file was automatically generated and should not be edited.

import { TaxRateType } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: SkillTypeDetailsFragment
// ====================================================

export interface SkillTypeDetailsFragment_skillAttributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface SkillTypeDetailsFragment_skillAttributes {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  values: (SkillTypeDetailsFragment_skillAttributes_values | null)[] | null;
}

export interface SkillTypeDetailsFragment_variantAttributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface SkillTypeDetailsFragment_variantAttributes {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  values: (SkillTypeDetailsFragment_variantAttributes_values | null)[] | null;
}

export interface SkillTypeDetailsFragment_weight {
  __typename: "Weight";
  unit: string;
  value: number;
}

export interface SkillTypeDetailsFragment {
  __typename: "SkillType";
  id: string;
  name: string;
  hasVariants: boolean;
  isDeliveryRequired: boolean;
  taxRate: TaxRateType | null;
  skillAttributes: (SkillTypeDetailsFragment_skillAttributes | null)[] | null;
  variantAttributes: (SkillTypeDetailsFragment_variantAttributes | null)[] | null;
  weight: SkillTypeDetailsFragment_weight | null;
}
