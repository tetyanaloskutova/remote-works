/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SkillImageReorder
// ====================================================

export interface SkillImageReorder_productImageReorder_errors {
  __typename: "Error";
  field: string | null;
  message: string | null;
}

export interface SkillImageReorder_productImageReorder_product_images {
  __typename: "SkillImage";
  id: string;
  alt: string;
  sortOrder: number;
  url: string;
}

export interface SkillImageReorder_productImageReorder_product {
  __typename: "Skill";
  id: string;
  images: (SkillImageReorder_productImageReorder_product_images | null)[] | null;
}

export interface SkillImageReorder_productImageReorder {
  __typename: "SkillImageReorder";
  errors: SkillImageReorder_productImageReorder_errors[] | null;
  product: SkillImageReorder_productImageReorder_product | null;
}

export interface SkillImageReorder {
  productImageReorder: SkillImageReorder_productImageReorder | null;
}

export interface SkillImageReorderVariables {
  productId: string;
  imagesIds: (string | null)[];
}
