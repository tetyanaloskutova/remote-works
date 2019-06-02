/* tslint:disable */
// This file was automatically generated and should not be edited.

import { SaleType } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: SaleDetails
// ====================================================

export interface SaleDetails_sale_skills_edges_node_skillType {
  __typename: "SkillType";
  id: string;
  name: string;
}

export interface SaleDetails_sale_skills_edges_node_thumbnail {
  __typename: "Image";
  url: string;
}

export interface SaleDetails_sale_skills_edges_node {
  __typename: "Skill";
  id: string;
  name: string;
  isPublished: boolean;
  skillType: SaleDetails_sale_skills_edges_node_skillType;
  thumbnail: SaleDetails_sale_skills_edges_node_thumbnail | null;
}

export interface SaleDetails_sale_skills_edges {
  __typename: "SkillCountableEdge";
  node: SaleDetails_sale_skills_edges_node;
}

export interface SaleDetails_sale_skills_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface SaleDetails_sale_skills {
  __typename: "SkillCountableConnection";
  edges: SaleDetails_sale_skills_edges[];
  pageInfo: SaleDetails_sale_skills_pageInfo;
  totalCount: number | null;
}

export interface SaleDetails_sale_categories_edges_node_skills {
  __typename: "SkillCountableConnection";
  totalCount: number | null;
}

export interface SaleDetails_sale_categories_edges_node {
  __typename: "Category";
  id: string;
  name: string;
  skills: SaleDetails_sale_categories_edges_node_skills | null;
}

export interface SaleDetails_sale_categories_edges {
  __typename: "CategoryCountableEdge";
  node: SaleDetails_sale_categories_edges_node;
}

export interface SaleDetails_sale_categories_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface SaleDetails_sale_categories {
  __typename: "CategoryCountableConnection";
  edges: SaleDetails_sale_categories_edges[];
  pageInfo: SaleDetails_sale_categories_pageInfo;
  totalCount: number | null;
}

export interface SaleDetails_sale_collections_edges_node_skills {
  __typename: "SkillCountableConnection";
  totalCount: number | null;
}

export interface SaleDetails_sale_collections_edges_node {
  __typename: "Collection";
  id: string;
  name: string;
  skills: SaleDetails_sale_collections_edges_node_skills | null;
}

export interface SaleDetails_sale_collections_edges {
  __typename: "CollectionCountableEdge";
  node: SaleDetails_sale_collections_edges_node;
}

export interface SaleDetails_sale_collections_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface SaleDetails_sale_collections {
  __typename: "CollectionCountableConnection";
  edges: SaleDetails_sale_collections_edges[];
  pageInfo: SaleDetails_sale_collections_pageInfo;
  totalCount: number | null;
}

export interface SaleDetails_sale {
  __typename: "Sale";
  id: string;
  name: string;
  type: SaleType;
  startDate: any;
  endDate: any | null;
  value: number;
  skills: SaleDetails_sale_skills | null;
  categories: SaleDetails_sale_categories | null;
  collections: SaleDetails_sale_collections | null;
}

export interface SaleDetails {
  sale: SaleDetails_sale | null;
}

export interface SaleDetailsVariables {
  id: string;
  after?: string | null;
  before?: string | null;
  first?: number | null;
  last?: number | null;
}
