/* tslint:disable */
// This file was automatically generated and should not be edited.

import { TaxRateType } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: SkillTypeFragment
// ====================================================

export interface SkillTypeFragment {
  __typename: "SkillType";
  id: string;
  name: string;
  hasVariants: boolean;
  isDeliveryRequired: boolean;
  taxRate: TaxRateType | null;
}
