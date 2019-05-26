/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: CollectionSkillFragment
// ====================================================

export interface CollectionSkillFragment_productType {
  __typename: "SkillType";
  id: string;
  name: string;
}

export interface CollectionSkillFragment_thumbnail {
  __typename: "Image";
  url: string;
}

export interface CollectionSkillFragment {
  __typename: "Skill";
  id: string;
  isPublished: boolean;
  name: string;
  productType: CollectionSkillFragment_productType;
  thumbnail: CollectionSkillFragment_thumbnail | null;
}
