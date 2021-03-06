/* tslint:disable */
// This file was automatically generated and should not be edited.

import { CatalogueInput, SaleType } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: SaleCataloguesRemove
// ====================================================

export interface SaleCataloguesRemove_saleCataloguesRemove_errors {
  __typename: "Error";
  field: string | null;
  message: string | null;
}

export interface SaleCataloguesRemove_saleCataloguesRemove_sale_skills_edges_node_skillType {
  __typename: "SkillType";
  id: string;
  name: string;
}

export interface SaleCataloguesRemove_saleCataloguesRemove_sale_skills_edges_node_thumbnail {
  __typename: "Image";
  url: string;
}

export interface SaleCataloguesRemove_saleCataloguesRemove_sale_skills_edges_node {
  __typename: "Skill";
  id: string;
  name: string;
  isPublished: boolean;
  skillType: SaleCataloguesRemove_saleCataloguesRemove_sale_skills_edges_node_skillType;
  thumbnail: SaleCataloguesRemove_saleCataloguesRemove_sale_skills_edges_node_thumbnail | null;
}

export interface SaleCataloguesRemove_saleCataloguesRemove_sale_skills_edges {
  __typename: "SkillCountableEdge";
  node: SaleCataloguesRemove_saleCataloguesRemove_sale_skills_edges_node;
}

export interface SaleCataloguesRemove_saleCataloguesRemove_sale_skills_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface SaleCataloguesRemove_saleCataloguesRemove_sale_skills {
  __typename: "SkillCountableConnection";
  edges: SaleCataloguesRemove_saleCataloguesRemove_sale_skills_edges[];
  pageInfo: SaleCataloguesRemove_saleCataloguesRemove_sale_skills_pageInfo;
  totalCount: number | null;
}

export interface SaleCataloguesRemove_saleCataloguesRemove_sale_categories_edges_node_skills {
  __typename: "SkillCountableConnection";
  totalCount: number | null;
}

export interface SaleCataloguesRemove_saleCataloguesRemove_sale_categories_edges_node {
  __typename: "Category";
  id: string;
  name: string;
  skills: SaleCataloguesRemove_saleCataloguesRemove_sale_categories_edges_node_skills | null;
}

export interface SaleCataloguesRemove_saleCataloguesRemove_sale_categories_edges {
  __typename: "CategoryCountableEdge";
  node: SaleCataloguesRemove_saleCataloguesRemove_sale_categories_edges_node;
}

export interface SaleCataloguesRemove_saleCataloguesRemove_sale_categories_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface SaleCataloguesRemove_saleCataloguesRemove_sale_categories {
  __typename: "CategoryCountableConnection";
  edges: SaleCataloguesRemove_saleCataloguesRemove_sale_categories_edges[];
  pageInfo: SaleCataloguesRemove_saleCataloguesRemove_sale_categories_pageInfo;
  totalCount: number | null;
}

export interface SaleCataloguesRemove_saleCataloguesRemove_sale_collections_edges_node_skills {
  __typename: "SkillCountableConnection";
  totalCount: number | null;
}

export interface SaleCataloguesRemove_saleCataloguesRemove_sale_collections_edges_node {
  __typename: "Collection";
  id: string;
  name: string;
  skills: SaleCataloguesRemove_saleCataloguesRemove_sale_collections_edges_node_skills | null;
}

export interface SaleCataloguesRemove_saleCataloguesRemove_sale_collections_edges {
  __typename: "CollectionCountableEdge";
  node: SaleCataloguesRemove_saleCataloguesRemove_sale_collections_edges_node;
}

export interface SaleCataloguesRemove_saleCataloguesRemove_sale_collections_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface SaleCataloguesRemove_saleCataloguesRemove_sale_collections {
  __typename: "CollectionCountableConnection";
  edges: SaleCataloguesRemove_saleCataloguesRemove_sale_collections_edges[];
  pageInfo: SaleCataloguesRemove_saleCataloguesRemove_sale_collections_pageInfo;
  totalCount: number | null;
}

export interface SaleCataloguesRemove_saleCataloguesRemove_sale {
  __typename: "Sale";
  id: string;
  name: string;
  type: SaleType;
  startDate: any;
  endDate: any | null;
  value: number;
  skills: SaleCataloguesRemove_saleCataloguesRemove_sale_skills | null;
  categories: SaleCataloguesRemove_saleCataloguesRemove_sale_categories | null;
  collections: SaleCataloguesRemove_saleCataloguesRemove_sale_collections | null;
}

export interface SaleCataloguesRemove_saleCataloguesRemove {
  __typename: "SaleRemoveCatalogues";
  errors: SaleCataloguesRemove_saleCataloguesRemove_errors[] | null;
  sale: SaleCataloguesRemove_saleCataloguesRemove_sale | null;
}

export interface SaleCataloguesRemove {
  saleCataloguesRemove: SaleCataloguesRemove_saleCataloguesRemove | null;
}

export interface SaleCataloguesRemoveVariables {
  input: CatalogueInput;
  id: string;
  after?: string | null;
  before?: string | null;
  first?: number | null;
  last?: number | null;
}
