/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SkillTypeDelete
// ====================================================

export interface SkillTypeDelete_productTypeDelete_errors {
  __typename: "Error";
  field: string | null;
  message: string | null;
}

export interface SkillTypeDelete_productTypeDelete_productType {
  __typename: "SkillType";
  id: string;
}

export interface SkillTypeDelete_productTypeDelete {
  __typename: "SkillTypeDelete";
  errors: SkillTypeDelete_productTypeDelete_errors[] | null;
  productType: SkillTypeDelete_productTypeDelete_productType | null;
}

export interface SkillTypeDelete {
  productTypeDelete: SkillTypeDelete_productTypeDelete | null;
}

export interface SkillTypeDeleteVariables {
  id: string;
}
