/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: RootCategoryChildren
// ====================================================

export interface RootCategoryChildren_categories_edges_node_children {
  __typename: "CategoryCountableConnection";
  totalCount: number | null;
}

export interface RootCategoryChildren_categories_edges_node_skills {
  __typename: "SkillCountableConnection";
  totalCount: number | null;
}

export interface RootCategoryChildren_categories_edges_node {
  __typename: "Category";
  id: string;
  name: string;
  children: RootCategoryChildren_categories_edges_node_children | null;
  skills: RootCategoryChildren_categories_edges_node_skills | null;
}

export interface RootCategoryChildren_categories_edges {
  __typename: "CategoryCountableEdge";
  cursor: string;
  node: RootCategoryChildren_categories_edges_node;
}

export interface RootCategoryChildren_categories {
  __typename: "CategoryCountableConnection";
  edges: RootCategoryChildren_categories_edges[];
}

export interface RootCategoryChildren {
  categories: RootCategoryChildren_categories | null;
}
