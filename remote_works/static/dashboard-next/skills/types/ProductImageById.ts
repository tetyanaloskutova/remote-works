/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SkillImageById
// ====================================================

export interface SkillImageById_product_mainImage {
  __typename: "SkillImage";
  id: string;
  alt: string;
  url: string;
}

export interface SkillImageById_product_images {
  __typename: "SkillImage";
  id: string;
  url: string;
}

export interface SkillImageById_product {
  __typename: "Skill";
  id: string;
  mainImage: SkillImageById_product_mainImage | null;
  images: (SkillImageById_product_images | null)[] | null;
}

export interface SkillImageById {
  product: SkillImageById_product | null;
}

export interface SkillImageByIdVariables {
  productId: string;
  imageId: string;
}
