/* tslint:disable */
// This file was automatically generated and should not be edited.

import { StockAvailability } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: SkillList
// ====================================================

export interface SkillList_skills_edges_node_thumbnail {
  __typename: "Image";
  url: string;
}

export interface SkillList_skills_edges_node_availability {
  __typename: "SkillAvailability";
  available: boolean | null;
}

export interface SkillList_skills_edges_node_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface SkillList_skills_edges_node_skillType {
  __typename: "SkillType";
  id: string;
  name: string;
}

export interface SkillList_skills_edges_node {
  __typename: "Skill";
  id: string;
  name: string;
  thumbnail: SkillList_skills_edges_node_thumbnail | null;
  availability: SkillList_skills_edges_node_availability | null;
  price: SkillList_skills_edges_node_price | null;
  skillType: SkillList_skills_edges_node_skillType;
}

export interface SkillList_skills_edges {
  __typename: "SkillCountableEdge";
  node: SkillList_skills_edges_node;
}

export interface SkillList_skills_pageInfo {
  __typename: "PageInfo";
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  startCursor: string | null;
  endCursor: string | null;
}

export interface SkillList_skills {
  __typename: "SkillCountableConnection";
  edges: SkillList_skills_edges[];
  pageInfo: SkillList_skills_pageInfo;
}

export interface SkillList {
  skills: SkillList_skills | null;
}

export interface SkillListVariables {
  first?: number | null;
  after?: string | null;
  last?: number | null;
  before?: string | null;
  stockAvailability?: StockAvailability | null;
}
