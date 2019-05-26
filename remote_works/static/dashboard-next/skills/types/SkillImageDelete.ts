/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SkillImageDelete
// ====================================================

export interface SkillImageDelete_productImageDelete_skill_images {
  __typename: "SkillImage";
  id: string;
}

export interface SkillImageDelete_productImageDelete_skill {
  __typename: "Skill";
  id: string;
  images: (SkillImageDelete_productImageDelete_skill_images | null)[] | null;
}

export interface SkillImageDelete_productImageDelete {
  __typename: "SkillImageDelete";
  product: SkillImageDelete_productImageDelete_skill | null;
}

export interface SkillImageDelete {
  productImageDelete: SkillImageDelete_productImageDelete | null;
}

export interface SkillImageDeleteVariables {
  id: string;
}
