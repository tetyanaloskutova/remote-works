/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SkillImageDelete
// ====================================================

export interface SkillImageDelete_skillImageDelete_skill_images {
  __typename: "SkillImage";
  id: string;
}

export interface SkillImageDelete_skillImageDelete_skill {
  __typename: "Skill";
  id: string;
  images: (SkillImageDelete_skillImageDelete_skill_images | null)[] | null;
}

export interface SkillImageDelete_skillImageDelete {
  __typename: "SkillImageDelete";
  skill: SkillImageDelete_skillImageDelete_skill | null;
}

export interface SkillImageDelete {
  skillImageDelete: SkillImageDelete_skillImageDelete | null;
}

export interface SkillImageDeleteVariables {
  id: string;
}
