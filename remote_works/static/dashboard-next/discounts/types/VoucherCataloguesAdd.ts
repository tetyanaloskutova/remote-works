/* tslint:disable */
// This file was automatically generated and should not be edited.

import { CatalogueInput, VoucherDiscountValueType, VoucherType } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: VoucherCataloguesAdd
// ====================================================

export interface VoucherCataloguesAdd_voucherCataloguesAdd_errors {
  __typename: "Error";
  field: string | null;
  message: string | null;
}

export interface VoucherCataloguesAdd_voucherCataloguesAdd_voucher_countries {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface VoucherCataloguesAdd_voucherCataloguesAdd_voucher_minAmountSpent {
  __typename: "Money";
  currency: string;
  amount: number;
}

export interface VoucherCataloguesAdd_voucherCataloguesAdd_voucher_skills_edges_node_skillType {
  __typename: "SkillType";
  id: string;
  name: string;
}

export interface VoucherCataloguesAdd_voucherCataloguesAdd_voucher_skills_edges_node_thumbnail {
  __typename: "Image";
  url: string;
}

export interface VoucherCataloguesAdd_voucherCataloguesAdd_voucher_skills_edges_node {
  __typename: "Skill";
  id: string;
  name: string;
  skillType: VoucherCataloguesAdd_voucherCataloguesAdd_voucher_skills_edges_node_skillType;
  isPublished: boolean;
  thumbnail: VoucherCataloguesAdd_voucherCataloguesAdd_voucher_skills_edges_node_thumbnail | null;
}

export interface VoucherCataloguesAdd_voucherCataloguesAdd_voucher_skills_edges {
  __typename: "SkillCountableEdge";
  node: VoucherCataloguesAdd_voucherCataloguesAdd_voucher_skills_edges_node;
}

export interface VoucherCataloguesAdd_voucherCataloguesAdd_voucher_skills_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface VoucherCataloguesAdd_voucherCataloguesAdd_voucher_skills {
  __typename: "SkillCountableConnection";
  edges: VoucherCataloguesAdd_voucherCataloguesAdd_voucher_skills_edges[];
  totalCount: number | null;
  pageInfo: VoucherCataloguesAdd_voucherCataloguesAdd_voucher_skills_pageInfo;
}

export interface VoucherCataloguesAdd_voucherCataloguesAdd_voucher_collections_edges_node_skills {
  __typename: "SkillCountableConnection";
  totalCount: number | null;
}

export interface VoucherCataloguesAdd_voucherCataloguesAdd_voucher_collections_edges_node {
  __typename: "Collection";
  id: string;
  name: string;
  skills: VoucherCataloguesAdd_voucherCataloguesAdd_voucher_collections_edges_node_skills | null;
}

export interface VoucherCataloguesAdd_voucherCataloguesAdd_voucher_collections_edges {
  __typename: "CollectionCountableEdge";
  node: VoucherCataloguesAdd_voucherCataloguesAdd_voucher_collections_edges_node;
}

export interface VoucherCataloguesAdd_voucherCataloguesAdd_voucher_collections_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface VoucherCataloguesAdd_voucherCataloguesAdd_voucher_collections {
  __typename: "CollectionCountableConnection";
  edges: VoucherCataloguesAdd_voucherCataloguesAdd_voucher_collections_edges[];
  totalCount: number | null;
  pageInfo: VoucherCataloguesAdd_voucherCataloguesAdd_voucher_collections_pageInfo;
}

export interface VoucherCataloguesAdd_voucherCataloguesAdd_voucher_categories_edges_node_skills {
  __typename: "SkillCountableConnection";
  totalCount: number | null;
}

export interface VoucherCataloguesAdd_voucherCataloguesAdd_voucher_categories_edges_node {
  __typename: "Category";
  id: string;
  name: string;
  skills: VoucherCataloguesAdd_voucherCataloguesAdd_voucher_categories_edges_node_skills | null;
}

export interface VoucherCataloguesAdd_voucherCataloguesAdd_voucher_categories_edges {
  __typename: "CategoryCountableEdge";
  node: VoucherCataloguesAdd_voucherCataloguesAdd_voucher_categories_edges_node;
}

export interface VoucherCataloguesAdd_voucherCataloguesAdd_voucher_categories_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface VoucherCataloguesAdd_voucherCataloguesAdd_voucher_categories {
  __typename: "CategoryCountableConnection";
  edges: VoucherCataloguesAdd_voucherCataloguesAdd_voucher_categories_edges[];
  totalCount: number | null;
  pageInfo: VoucherCataloguesAdd_voucherCataloguesAdd_voucher_categories_pageInfo;
}

export interface VoucherCataloguesAdd_voucherCataloguesAdd_voucher {
  __typename: "Voucher";
  id: string;
  name: string | null;
  startDate: any;
  endDate: any | null;
  usageLimit: number | null;
  discountValueType: VoucherDiscountValueType;
  discountValue: number;
  countries: (VoucherCataloguesAdd_voucherCataloguesAdd_voucher_countries | null)[] | null;
  minAmountSpent: VoucherCataloguesAdd_voucherCataloguesAdd_voucher_minAmountSpent | null;
  type: VoucherType;
  code: string;
  used: number;
  applyOncePerTask: boolean;
  skills: VoucherCataloguesAdd_voucherCataloguesAdd_voucher_skills | null;
  collections: VoucherCataloguesAdd_voucherCataloguesAdd_voucher_collections | null;
  categories: VoucherCataloguesAdd_voucherCataloguesAdd_voucher_categories | null;
}

export interface VoucherCataloguesAdd_voucherCataloguesAdd {
  __typename: "VoucherAddCatalogues";
  errors: VoucherCataloguesAdd_voucherCataloguesAdd_errors[] | null;
  voucher: VoucherCataloguesAdd_voucherCataloguesAdd_voucher | null;
}

export interface VoucherCataloguesAdd {
  voucherCataloguesAdd: VoucherCataloguesAdd_voucherCataloguesAdd | null;
}

export interface VoucherCataloguesAddVariables {
  input: CatalogueInput;
  id: string;
  after?: string | null;
  before?: string | null;
  first?: number | null;
  last?: number | null;
}
