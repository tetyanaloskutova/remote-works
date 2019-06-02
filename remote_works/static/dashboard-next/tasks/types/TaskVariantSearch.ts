/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: TaskVariantSearch
// ====================================================

export interface TaskVariantSearch_skills_edges_node_thumbnail {
  __typename: "Image";
  url: string;
}

export interface TaskVariantSearch_skills_edges_node_variants_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskVariantSearch_skills_edges_node_variants {
  __typename: "SkillVariant";
  id: string;
  name: string;
  sku: string;
  price: TaskVariantSearch_skills_edges_node_variants_price | null;
}

export interface TaskVariantSearch_skills_edges_node {
  __typename: "Skill";
  id: string;
  name: string;
  thumbnail: TaskVariantSearch_skills_edges_node_thumbnail | null;
  variants: (TaskVariantSearch_skills_edges_node_variants | null)[] | null;
}

export interface TaskVariantSearch_skills_edges {
  __typename: "SkillCountableEdge";
  node: TaskVariantSearch_skills_edges_node;
}

export interface TaskVariantSearch_skills_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface TaskVariantSearch_skills {
  __typename: "SkillCountableConnection";
  edges: TaskVariantSearch_skills_edges[];
  pageInfo: TaskVariantSearch_skills_pageInfo;
}

export interface TaskVariantSearch {
  skills: TaskVariantSearch_skills | null;
}

export interface TaskVariantSearchVariables {
  search: string;
  after?: string | null;
}
