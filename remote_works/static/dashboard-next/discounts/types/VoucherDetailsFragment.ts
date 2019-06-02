/* tslint:disable */
// This file was automatically generated and should not be edited.

import { VoucherDiscountValueType, VoucherType } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: VoucherDetailsFragment
// ====================================================

export interface VoucherDetailsFragment_countries {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface VoucherDetailsFragment_minAmountSpent {
  __typename: "Money";
  currency: string;
  amount: number;
}

export interface VoucherDetailsFragment_skills_edges_node_skillType {
  __typename: "SkillType";
  id: string;
  name: string;
}

export interface VoucherDetailsFragment_skills_edges_node_thumbnail {
  __typename: "Image";
  url: string;
}

export interface VoucherDetailsFragment_skills_edges_node {
  __typename: "Skill";
  id: string;
  name: string;
  skillType: VoucherDetailsFragment_skills_edges_node_skillType;
  isPublished: boolean;
  thumbnail: VoucherDetailsFragment_skills_edges_node_thumbnail | null;
}

export interface VoucherDetailsFragment_skills_edges {
  __typename: "SkillCountableEdge";
  node: VoucherDetailsFragment_skills_edges_node;
}

export interface VoucherDetailsFragment_skills_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface VoucherDetailsFragment_skills {
  __typename: "SkillCountableConnection";
  edges: VoucherDetailsFragment_skills_edges[];
  totalCount: number | null;
  pageInfo: VoucherDetailsFragment_skills_pageInfo;
}

export interface VoucherDetailsFragment_collections_edges_node_skills {
  __typename: "SkillCountableConnection";
  totalCount: number | null;
}

export interface VoucherDetailsFragment_collections_edges_node {
  __typename: "Collection";
  id: string;
  name: string;
  skills: VoucherDetailsFragment_collections_edges_node_skills | null;
}

export interface VoucherDetailsFragment_collections_edges {
  __typename: "CollectionCountableEdge";
  node: VoucherDetailsFragment_collections_edges_node;
}

export interface VoucherDetailsFragment_collections_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface VoucherDetailsFragment_collections {
  __typename: "CollectionCountableConnection";
  edges: VoucherDetailsFragment_collections_edges[];
  totalCount: number | null;
  pageInfo: VoucherDetailsFragment_collections_pageInfo;
}

export interface VoucherDetailsFragment_categories_edges_node_skills {
  __typename: "SkillCountableConnection";
  totalCount: number | null;
}

export interface VoucherDetailsFragment_categories_edges_node {
  __typename: "Category";
  id: string;
  name: string;
  skills: VoucherDetailsFragment_categories_edges_node_skills | null;
}

export interface VoucherDetailsFragment_categories_edges {
  __typename: "CategoryCountableEdge";
  node: VoucherDetailsFragment_categories_edges_node;
}

export interface VoucherDetailsFragment_categories_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface VoucherDetailsFragment_categories {
  __typename: "CategoryCountableConnection";
  edges: VoucherDetailsFragment_categories_edges[];
  totalCount: number | null;
  pageInfo: VoucherDetailsFragment_categories_pageInfo;
}

export interface VoucherDetailsFragment {
  __typename: "Voucher";
  id: string;
  name: string | null;
  startDate: any;
  endDate: any | null;
  usageLimit: number | null;
  discountValueType: VoucherDiscountValueType;
  discountValue: number;
  countries: (VoucherDetailsFragment_countries | null)[] | null;
  minAmountSpent: VoucherDetailsFragment_minAmountSpent | null;
  type: VoucherType;
  code: string;
  used: number;
  applyOncePerTask: boolean;
  skills: VoucherDetailsFragment_skills | null;
  collections: VoucherDetailsFragment_collections | null;
  categories: VoucherDetailsFragment_categories | null;
}
