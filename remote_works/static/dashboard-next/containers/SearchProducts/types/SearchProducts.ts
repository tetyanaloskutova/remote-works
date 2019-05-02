/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SearchSkills
// ====================================================

export interface SearchSkills_products_edges_node_thumbnail {
  __typename: "Image";
  url: string;
}

export interface SearchSkills_products_edges_node {
  __typename: "Skill";
  id: string;
  thumbnail: SearchSkills_products_edges_node_thumbnail | null;
  name: string;
}

export interface SearchSkills_products_edges {
  __typename: "SkillCountableEdge";
  node: SearchSkills_products_edges_node;
}

export interface SearchSkills_products {
  __typename: "SkillCountableConnection";
  edges: SearchSkills_products_edges[];
}

export interface SearchSkills {
  products: SearchSkills_products | null;
}

export interface SearchSkillsVariables {
  query: string;
}
