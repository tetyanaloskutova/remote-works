/* tslint:disable */
// This file was automatically generated and should not be edited.

import { PaymentChargeStatusEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: CustomerDetails
// ====================================================

export interface CustomerDetails_user_defaultDeliveryAddress_country {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface CustomerDetails_user_defaultDeliveryAddress {
  __typename: "Address";
  city: string;
  cityArea: string;
  companyName: string;
  country: CustomerDetails_user_defaultDeliveryAddress_country;
  countryArea: string;
  firstName: string;
  id: string;
  lastName: string;
  phone: string | null;
  postalCode: string;
  streetAddress1: string;
  streetAddress2: string;
}

export interface CustomerDetails_user_defaultBillingAddress_country {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface CustomerDetails_user_defaultBillingAddress {
  __typename: "Address";
  city: string;
  cityArea: string;
  companyName: string;
  country: CustomerDetails_user_defaultBillingAddress_country;
  countryArea: string;
  firstName: string;
  id: string;
  lastName: string;
  phone: string | null;
  postalCode: string;
  streetAddress1: string;
  streetAddress2: string;
}

export interface CustomerDetails_user_orders_edges_node_total_gross {
  __typename: "Money";
  currency: string;
  amount: number;
}

export interface CustomerDetails_user_orders_edges_node_total {
  __typename: "TaxedMoney";
  gross: CustomerDetails_user_orders_edges_node_total_gross;
}

export interface CustomerDetails_user_orders_edges_node {
  __typename: "Task";
  id: string;
  created: any;
  number: string | null;
  paymentStatus: PaymentChargeStatusEnum | null;
  total: CustomerDetails_user_orders_edges_node_total | null;
}

export interface CustomerDetails_user_orders_edges {
  __typename: "TaskCountableEdge";
  node: CustomerDetails_user_orders_edges_node;
}

export interface CustomerDetails_user_orders {
  __typename: "TaskCountableConnection";
  edges: CustomerDetails_user_orders_edges[];
}

export interface CustomerDetails_user_lastPlacedTask_edges_node {
  __typename: "Task";
  id: string;
  created: any;
}

export interface CustomerDetails_user_lastPlacedTask_edges {
  __typename: "TaskCountableEdge";
  node: CustomerDetails_user_lastPlacedTask_edges_node;
}

export interface CustomerDetails_user_lastPlacedTask {
  __typename: "TaskCountableConnection";
  edges: CustomerDetails_user_lastPlacedTask_edges[];
}

export interface CustomerDetails_user {
  __typename: "User";
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  dateJoined: any;
  lastLogin: any | null;
  defaultDeliveryAddress: CustomerDetails_user_defaultDeliveryAddress | null;
  defaultBillingAddress: CustomerDetails_user_defaultBillingAddress | null;
  note: string | null;
  isActive: boolean;
  tasks: CustomerDetails_user_orders | null;
  lastPlacedTask: CustomerDetails_user_lastPlacedTask | null;
}

export interface CustomerDetails {
  user: CustomerDetails_user | null;
}

export interface CustomerDetailsVariables {
  id: string;
}
