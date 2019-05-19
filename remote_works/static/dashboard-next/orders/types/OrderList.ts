/* tslint:disable */
// This file was automatically generated and should not be edited.

import { TaskStatusFilter, PaymentChargeStatusEnum, TaskStatus } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: TaskList
// ====================================================

export interface TaskList_orders_edges_node_billingAddress_country {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface TaskList_orders_edges_node_billingAddress {
  __typename: "Address";
  city: string;
  cityArea: string;
  companyName: string;
  country: TaskList_orders_edges_node_billingAddress_country;
  countryArea: string;
  firstName: string;
  id: string;
  lastName: string;
  phone: string | null;
  postalCode: string;
  streetAddress1: string;
  streetAddress2: string;
}

export interface TaskList_orders_edges_node_total_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskList_orders_edges_node_total {
  __typename: "TaxedMoney";
  gross: TaskList_orders_edges_node_total_gross;
}

export interface TaskList_orders_edges_node {
  __typename: "Task";
  billingAddress: TaskList_orders_edges_node_billingAddress | null;
  created: any;
  id: string;
  number: string | null;
  paymentStatus: PaymentChargeStatusEnum | null;
  status: TaskStatus;
  total: TaskList_orders_edges_node_total | null;
  userEmail: string | null;
}

export interface TaskList_orders_edges {
  __typename: "TaskCountableEdge";
  node: TaskList_orders_edges_node;
}

export interface TaskList_orders_pageInfo {
  __typename: "PageInfo";
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  startCursor: string | null;
  endCursor: string | null;
}

export interface TaskList_orders {
  __typename: "TaskCountableConnection";
  edges: TaskList_orders_edges[];
  pageInfo: TaskList_orders_pageInfo;
}

export interface TaskList {
  tasks: TaskList_orders | null;
}

export interface TaskListVariables {
  first?: number | null;
  after?: string | null;
  last?: number | null;
  before?: string | null;
  status?: TaskStatusFilter | null;
}
