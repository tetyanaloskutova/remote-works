/* tslint:disable */
// This file was automatically generated and should not be edited.

import { TaxRateType, WeightUnitsEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: SkillTypeDetails
// ====================================================

export interface SkillTypeDetails_productType_productAttributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface SkillTypeDetails_productType_productAttributes {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  values: (SkillTypeDetails_productType_productAttributes_values | null)[] | null;
}

export interface SkillTypeDetails_productType_variantAttributes_values {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  slug: string | null;
}

export interface SkillTypeDetails_productType_variantAttributes {
  __typename: "Attribute";
  id: string;
  name: string | null;
  slug: string | null;
  values: (SkillTypeDetails_productType_variantAttributes_values | null)[] | null;
}

export interface SkillTypeDetails_productType_weight {
  __typename: "Weight";
  unit: string;
  value: number;
}

export interface SkillTypeDetails_productType {
  __typename: "SkillType";
  id: string;
  name: string;
  hasVariants: boolean;
  isShippingRequired: boolean;
  taxRate: TaxRateType | null;
  productAttributes: (SkillTypeDetails_productType_productAttributes | null)[] | null;
  variantAttributes: (SkillTypeDetails_productType_variantAttributes | null)[] | null;
  weight: SkillTypeDetails_productType_weight | null;
}

export interface SkillTypeDetails_shop {
  __typename: "Shop";
  defaultWeightUnit: WeightUnitsEnum | null;
}

export interface SkillTypeDetails {
  productType: SkillTypeDetails_productType | null;
  shop: SkillTypeDetails_shop | null;
}

export interface SkillTypeDetailsVariables {
  id: string;
}
