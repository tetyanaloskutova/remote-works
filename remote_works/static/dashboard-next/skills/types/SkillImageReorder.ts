/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SkillImageReorder
// ====================================================

export interface SkillImageRetask_productImageRetask_errors {
  __typename: "Error";
  field: string | null;
  message: string | null;
}

export interface SkillImageRetask_productImageRetask_skill_images {
  __typename: "SkillImage";
  id: string;
  alt: string;
  sortTask: number;
  url: string;
}

export interface SkillImageRetask_productImageRetask_skill {
  __typename: "Skill";
  id: string;
  images: (SkillImageRetask_productImageRetask_skill_images | null)[] | null;
}

export interface SkillImageRetask_productImageReorder {
  __typename: "SkillImageReorder";
  errors: SkillImageRetask_productImageRetask_errors[] | null;
  product: SkillImageRetask_productImageRetask_skill | null;
}

export interface SkillImageReorder {
  productImageReorder: SkillImageRetask_productImageReorder | null;
}

export interface SkillImageReorderVariables {
  productId: string;
  imagesIds: (string | null)[];
}
