/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SkillCreateData
// ====================================================

export interface SkillCreateData_skillTypes_edges_node_skillAttributes_values {
  __typename: "AttributeValue";
  id: string;
  sortTask: number;
  name: string | null;
  slug: string | null;
}

export interface SkillCreateData_skillTypes_edges_node_skillAttributes {
  __typename: "Attribute";
  id: string;
  slug: string | null;
  name: string | null;
  values: (SkillCreateData_skillTypes_edges_node_skillAttributes_values | null)[] | null;
}

export interface SkillCreateData_skillTypes_edges_node {
  __typename: "SkillType";
  id: string;
  name: string;
  hasVariants: boolean;
  skillAttributes: (SkillCreateData_skillTypes_edges_node_skillAttributes | null)[] | null;
}

export interface SkillCreateData_skillTypes_edges {
  __typename: "SkillTypeCountableEdge";
  node: SkillCreateData_skillTypes_edges_node;
}

export interface SkillCreateData_skillTypes {
  __typename: "SkillTypeCountableConnection";
  edges: SkillCreateData_skillTypes_edges[];
}

export interface SkillCreateData {
  skillTypes: SkillCreateData_skillTypes | null;
}
