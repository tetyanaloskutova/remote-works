/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SkillImageById
// ====================================================

export interface SkillImageById_skill_mainImage {
  __typename: "SkillImage";
  id: string;
  alt: string;
  url: string;
}

export interface SkillImageById_skill_images {
  __typename: "SkillImage";
  id: string;
  url: string;
}

export interface SkillImageById_skill {
  __typename: "Skill";
  id: string;
  mainImage: SkillImageById_skill_mainImage | null;
  images: (SkillImageById_skill_images | null)[] | null;
}

export interface SkillImageById {
  skill: SkillImageById_skill | null;
}

export interface SkillImageByIdVariables {
  skillId: string;
  imageId: string;
}
