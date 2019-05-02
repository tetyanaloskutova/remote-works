/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CollectionAssignSkill
// ====================================================

export interface CollectionAssignSkill_collectionAddSkills_errors {
  __typename: "Error";
  field: string | null;
  message: string | null;
}

export interface CollectionAssignSkill_collectionAddSkills_collection_products_edges_node_productType {
  __typename: "SkillType";
  id: string;
  name: string;
}

export interface CollectionAssignSkill_collectionAddSkills_collection_products_edges_node_thumbnail {
  __typename: "Image";
  url: string;
}

export interface CollectionAssignSkill_collectionAddSkills_collection_products_edges_node {
  __typename: "Skill";
  id: string;
  isPublished: boolean;
  name: string;
  productType: CollectionAssignSkill_collectionAddSkills_collection_products_edges_node_productType;
  thumbnail: CollectionAssignSkill_collectionAddSkills_collection_products_edges_node_thumbnail | null;
}

export interface CollectionAssignSkill_collectionAddSkills_collection_products_edges {
  __typename: "SkillCountableEdge";
  node: CollectionAssignSkill_collectionAddSkills_collection_products_edges_node;
}

export interface CollectionAssignSkill_collectionAddSkills_collection_products_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface CollectionAssignSkill_collectionAddSkills_collection_products {
  __typename: "SkillCountableConnection";
  edges: CollectionAssignSkill_collectionAddSkills_collection_products_edges[];
  pageInfo: CollectionAssignSkill_collectionAddSkills_collection_products_pageInfo;
}

export interface CollectionAssignSkill_collectionAddSkills_collection {
  __typename: "Collection";
  id: string;
  products: CollectionAssignSkill_collectionAddSkills_collection_products | null;
}

export interface CollectionAssignSkill_collectionAddSkills {
  __typename: "CollectionAddSkills";
  errors: CollectionAssignSkill_collectionAddSkills_errors[] | null;
  collection: CollectionAssignSkill_collectionAddSkills_collection | null;
}

export interface CollectionAssignSkill {
  collectionAddSkills: CollectionAssignSkill_collectionAddSkills | null;
}

export interface CollectionAssignSkillVariables {
  collectionId: string;
  productIds: string[];
  first?: number | null;
  after?: string | null;
  last?: number | null;
  before?: string | null;
}
