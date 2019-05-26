/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SkillCreateData
// ====================================================

export interface SkillCreateData_productTypes_edges_node_productAttributes_values {
  __typename: "AttributeValue";
  id: string;
  sortTask: number;
  name: string | null;
  slug: string | null;
}

export interface SkillCreateData_productTypes_edges_node_productAttributes {
  __typename: "Attribute";
  id: string;
  slug: string | null;
  name: string | null;
  values: (SkillCreateData_productTypes_edges_node_productAttributes_values | null)[] | null;
}

export interface SkillCreateData_productTypes_edges_node {
  __typename: "SkillType";
  id: string;
  name: string;
  hasVariants: boolean;
  productAttributes: (SkillCreateData_productTypes_edges_node_productAttributes | null)[] | null;
}

export interface SkillCreateData_productTypes_edges {
  __typename: "SkillTypeCountableEdge";
  node: SkillCreateData_productTypes_edges_node;
}

export interface SkillCreateData_productTypes {
  __typename: "SkillTypeCountableConnection";
  edges: SkillCreateData_productTypes_edges[];
}

export interface SkillCreateData {
  productTypes: SkillCreateData_productTypes | null;
}
