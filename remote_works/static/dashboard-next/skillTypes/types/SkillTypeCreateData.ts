/* tslint:disable */
// This file was automatically generated and should not be edited.

import { WeightUnitsEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: SkillTypeCreateData
// ====================================================

export interface SkillTypeCreateData_shop {
  __typename: "Shop";
  defaultWeightUnit: WeightUnitsEnum | null;
}

export interface SkillTypeCreateData {
  shop: SkillTypeCreateData_shop | null;
}
