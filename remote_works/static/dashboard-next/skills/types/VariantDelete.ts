/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: VariantDelete
// ====================================================

export interface VariantDelete_skillVariantDelete_errors {
  __typename: "Error";
  field: string | null;
  message: string | null;
}

export interface VariantDelete_skillVariantDelete_skillVariant {
  __typename: "SkillVariant";
  id: string;
}

export interface VariantDelete_skillVariantDelete {
  __typename: "SkillVariantDelete";
  errors: VariantDelete_skillVariantDelete_errors[] | null;
  skillVariant: VariantDelete_skillVariantDelete_skillVariant | null;
}

export interface VariantDelete {
  skillVariantDelete: VariantDelete_skillVariantDelete | null;
}

export interface VariantDeleteVariables {
  id: string;
}
