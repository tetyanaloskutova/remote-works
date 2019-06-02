/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SkillDelete
// ====================================================

export interface SkillDelete_skillDelete_errors {
  __typename: "Error";
  field: string | null;
  message: string | null;
}

export interface SkillDelete_skillDelete_skill {
  __typename: "Skill";
  id: string;
}

export interface SkillDelete_skillDelete {
  __typename: "SkillDelete";
  errors: SkillDelete_skillDelete_errors[] | null;
  skill: SkillDelete_skillDelete_skill | null;
}

export interface SkillDelete {
  skillDelete: SkillDelete_skillDelete | null;
}

export interface SkillDeleteVariables {
  id: string;
}
