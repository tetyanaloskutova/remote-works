/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SkillTypeDelete
// ====================================================

export interface SkillTypeDelete_skillTypeDelete_errors {
  __typename: "Error";
  field: string | null;
  message: string | null;
}

export interface SkillTypeDelete_skillTypeDelete_skillType {
  __typename: "SkillType";
  id: string;
}

export interface SkillTypeDelete_skillTypeDelete {
  __typename: "SkillTypeDelete";
  errors: SkillTypeDelete_skillTypeDelete_errors[] | null;
  skillType: SkillTypeDelete_skillTypeDelete_skillType | null;
}

export interface SkillTypeDelete {
  skillTypeDelete: SkillTypeDelete_skillTypeDelete | null;
}

export interface SkillTypeDeleteVariables {
  id: string;
}
