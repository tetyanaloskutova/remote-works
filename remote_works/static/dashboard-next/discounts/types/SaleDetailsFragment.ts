/* tslint:disable */
// This file was automatically generated and should not be edited.

import { SaleType } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: SaleDetailsFragment
// ====================================================

export interface SaleDetailsFragment_skills_edges_node_skillType {
  __typename: "SkillType";
  id: string;
  name: string;
}

export interface SaleDetailsFragment_skills_edges_node_thumbnail {
  __typename: "Image";
  url: string;
}

export interface SaleDetailsFragment_skills_edges_node {
  __typename: "Skill";
  id: string;
  name: string;
  isPublished: boolean;
  skillType: SaleDetailsFragment_skills_edges_node_skillType;
  thumbnail: SaleDetailsFragment_skills_edges_node_thumbnail | null;
}

export interface SaleDetailsFragment_skills_edges {
  __typename: "SkillCountableEdge";
  node: SaleDetailsFragment_skills_edges_node;
}

export interface SaleDetailsFragment_skills_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface SaleDetailsFragment_skills {
  __typename: "SkillCountableConnection";
  edges: SaleDetailsFragment_skills_edges[];
  pageInfo: SaleDetailsFragment_skills_pageInfo;
  totalCount: number | null;
}

export interface SaleDetailsFragment_categories_edges_node_skills {
  __typename: "SkillCountableConnection";
  totalCount: number | null;
}

export interface SaleDetailsFragment_categories_edges_node {
  __typename: "Category";
  id: string;
  name: string;
  skills: SaleDetailsFragment_categories_edges_node_skills | null;
}

export interface SaleDetailsFragment_categories_edges {
  __typename: "CategoryCountableEdge";
  node: SaleDetailsFragment_categories_edges_node;
}

export interface SaleDetailsFragment_categories_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface SaleDetailsFragment_categories {
  __typename: "CategoryCountableConnection";
  edges: SaleDetailsFragment_categories_edges[];
  pageInfo: SaleDetailsFragment_categories_pageInfo;
  totalCount: number | null;
}

export interface SaleDetailsFragment_collections_edges_node_skills {
  __typename: "SkillCountableConnection";
  totalCount: number | null;
}

export interface SaleDetailsFragment_collections_edges_node {
  __typename: "Collection";
  id: string;
  name: string;
  skills: SaleDetailsFragment_collections_edges_node_skills | null;
}

export interface SaleDetailsFragment_collections_edges {
  __typename: "CollectionCountableEdge";
  node: SaleDetailsFragment_collections_edges_node;
}

export interface SaleDetailsFragment_collections_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface SaleDetailsFragment_collections {
  __typename: "CollectionCountableConnection";
  edges: SaleDetailsFragment_collections_edges[];
  pageInfo: SaleDetailsFragment_collections_pageInfo;
  totalCount: number | null;
}

export interface SaleDetailsFragment {
  __typename: "Sale";
  id: string;
  name: string;
  type: SaleType;
  startDate: any;
  endDate: any | null;
  value: number;
  skills: SaleDetailsFragment_skills | null;
  categories: SaleDetailsFragment_categories | null;
  collections: SaleDetailsFragment_collections | null;
}
