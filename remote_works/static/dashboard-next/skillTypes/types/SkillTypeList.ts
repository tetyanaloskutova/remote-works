/* tslint:disable */
// This file was automatically generated and should not be edited.

import { TaxRateType } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: SkillTypeList
// ====================================================

export interface SkillTypeList_productTypes_edges_node {
  __typename: "SkillType";
  id: string;
  name: string;
  hasVariants: boolean;
  isDeliveryRequired: boolean;
  taxRate: TaxRateType | null;
}

export interface SkillTypeList_productTypes_edges {
  __typename: "SkillTypeCountableEdge";
  node: SkillTypeList_productTypes_edges_node;
}

export interface SkillTypeList_productTypes_pageInfo {
  __typename: "PageInfo";
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
  endCursor: string | null;
}

export interface SkillTypeList_productTypes {
  __typename: "SkillTypeCountableConnection";
  edges: SkillTypeList_productTypes_edges[];
  pageInfo: SkillTypeList_productTypes_pageInfo;
}

export interface SkillTypeList {
  productTypes: SkillTypeList_productTypes | null;
}

export interface SkillTypeListVariables {
  after?: string | null;
  before?: string | null;
  first?: number | null;
  last?: number | null;
}
