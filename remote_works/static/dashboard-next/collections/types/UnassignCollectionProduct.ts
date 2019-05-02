/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UnassignCollectionSkill
// ====================================================

export interface UnassignCollectionSkill_collectionRemoveSkills_errors {
  __typename: "Error";
  field: string | null;
  message: string | null;
}

export interface UnassignCollectionSkill_collectionRemoveSkills_collection_products_edges_node_productType {
  __typename: "SkillType";
  id: string;
  name: string;
}

export interface UnassignCollectionSkill_collectionRemoveSkills_collection_products_edges_node {
  __typename: "Skill";
  id: string;
  isPublished: boolean;
  name: string;
  productType: UnassignCollectionSkill_collectionRemoveSkills_collection_products_edges_node_productType;
  thumbnailUrl: string | null;
}

export interface UnassignCollectionSkill_collectionRemoveSkills_collection_products_edges {
  __typename: "SkillCountableEdge";
  node: UnassignCollectionSkill_collectionRemoveSkills_collection_products_edges_node;
}

export interface UnassignCollectionSkill_collectionRemoveSkills_collection_products_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface UnassignCollectionSkill_collectionRemoveSkills_collection_products {
  __typename: "SkillCountableConnection";
  edges: UnassignCollectionSkill_collectionRemoveSkills_collection_products_edges[];
  pageInfo: UnassignCollectionSkill_collectionRemoveSkills_collection_products_pageInfo;
}

export interface UnassignCollectionSkill_collectionRemoveSkills_collection {
  __typename: "Collection";
  id: string;
  products: UnassignCollectionSkill_collectionRemoveSkills_collection_products | null;
}

export interface UnassignCollectionSkill_collectionRemoveSkills {
  __typename: "CollectionRemoveSkills";
  errors: UnassignCollectionSkill_collectionRemoveSkills_errors[] | null;
  collection: UnassignCollectionSkill_collectionRemoveSkills_collection | null;
}

export interface UnassignCollectionSkill {
  collectionRemoveSkills: UnassignCollectionSkill_collectionRemoveSkills | null;
}

export interface UnassignCollectionSkillVariables {
  collectionId: string;
  productId: string;
  first?: number | null;
  after?: string | null;
  last?: number | null;
  before?: string | null;
}
