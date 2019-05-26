/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SkillDelete
// ====================================================

export interface SkillDelete_productDelete_errors {
  __typename: "Error";
  field: string | null;
  message: string | null;
}

export interface SkillDelete_productDelete_skill {
  __typename: "Skill";
  id: string;
}

export interface SkillDelete_productDelete {
  __typename: "SkillDelete";
  errors: SkillDelete_productDelete_errors[] | null;
  product: SkillDelete_productDelete_skill | null;
}

export interface SkillDelete {
  productDelete: SkillDelete_productDelete | null;
}

export interface SkillDeleteVariables {
  id: string;
}
