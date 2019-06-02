/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SkillImageReorder
// ====================================================

export interface SkillImageReorder_skillImageReorder_errors {
  __typename: "Error";
  field: string | null;
  message: string | null;
}

export interface SkillImageReorder_skillImageReorder_skill_images {
  __typename: "SkillImage";
  id: string;
  alt: string;
  sortTask: number;
  url: string;
}

export interface SkillImageReorder_skillImageReorder_skill {
  __typename: "Skill";
  id: string;
  images: (SkillImageReorder_skillImageReorder_skill_images | null)[] | null;
}

export interface SkillImageReorder_skillImageReorder {
  __typename: "SkillImageReorder";
  errors: SkillImageReorder_skillImageReorder_errors[] | null;
  skill: SkillImageReorder_skillImageReorder_skill | null;
}

export interface SkillImageReorder {
  skillImageReorder: SkillImageReorder_skillImageReorder | null;
}

export interface SkillImageReorderVariables {
  skillId: string;
  imagesIds: (string | null)[];
}
