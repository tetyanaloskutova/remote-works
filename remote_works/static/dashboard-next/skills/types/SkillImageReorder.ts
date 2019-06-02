/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SkillImageReorder
// ====================================================

export interface SkillImageRetask_skillImageRetask_errors {
  __typename: "Error";
  field: string | null;
  message: string | null;
}

export interface SkillImageRetask_skillImageRetask_skill_images {
  __typename: "SkillImage";
  id: string;
  alt: string;
  sortTask: number;
  url: string;
}

export interface SkillImageRetask_skillImageRetask_skill {
  __typename: "Skill";
  id: string;
  images: (SkillImageRetask_skillImageRetask_skill_images | null)[] | null;
}

export interface SkillImageRetask_skillImageReorder {
  __typename: "SkillImageReorder";
  errors: SkillImageRetask_skillImageRetask_errors[] | null;
  skill: SkillImageRetask_skillImageRetask_skill | null;
}

export interface SkillImageReorder {
  skillImageReorder: SkillImageRetask_skillImageReorder | null;
}

export interface SkillImageReorderVariables {
  skillId: string;
  imagesIds: (string | null)[];
}
