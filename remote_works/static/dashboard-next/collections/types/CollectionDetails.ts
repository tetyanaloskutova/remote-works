/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: CollectionDetails
// ====================================================

export interface CollectionDetails_collection_backgroundImage {
  __typename: "Image";
  alt: string | null;
  url: string;
}

export interface CollectionDetails_collection_skills_edges_node_skillType {
  __typename: "SkillType";
  id: string;
  name: string;
}

export interface CollectionDetails_collection_skills_edges_node_thumbnail {
  __typename: "Image";
  url: string;
}

export interface CollectionDetails_collection_skills_edges_node {
  __typename: "Skill";
  id: string;
  isPublished: boolean;
  name: string;
  skillType: CollectionDetails_collection_skills_edges_node_skillType;
  thumbnail: CollectionDetails_collection_skills_edges_node_thumbnail | null;
}

export interface CollectionDetails_collection_skills_edges {
  __typename: "SkillCountableEdge";
  node: CollectionDetails_collection_skills_edges_node;
}

export interface CollectionDetails_collection_skills_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface CollectionDetails_collection_skills {
  __typename: "SkillCountableConnection";
  edges: CollectionDetails_collection_skills_edges[];
  pageInfo: CollectionDetails_collection_skills_pageInfo;
}

export interface CollectionDetails_collection {
  __typename: "Collection";
  id: string;
  isPublished: boolean;
  name: string;
  backgroundImage: CollectionDetails_collection_backgroundImage | null;
  descriptionJson: any;
  seoDescription: string | null;
  seoTitle: string | null;
  skills: CollectionDetails_collection_skills | null;
}

export interface CollectionDetails_shop_homepageCollection {
  __typename: "Collection";
  id: string;
}

export interface CollectionDetails_shop {
  __typename: "Shop";
  homepageCollection: CollectionDetails_shop_homepageCollection | null;
}

export interface CollectionDetails {
  collection: CollectionDetails_collection | null;
  shop: CollectionDetails_shop | null;
}

export interface CollectionDetailsVariables {
  id: string;
  first?: number | null;
  after?: string | null;
  last?: number | null;
  before?: string | null;
}
