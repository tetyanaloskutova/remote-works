/* tslint:disable */
// This file was automatically generated and should not be edited.

import { OrderEventsEmails, OrderEvents } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: Home
// ====================================================

export interface Home_salesToday_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface Home_salesToday {
  __typename: "TaxedMoney";
  gross: Home_salesToday_gross;
}

export interface Home_ordersToday {
  __typename: "OrderCountableConnection";
  totalCount: number | null;
}

export interface Home_ordersToFulfill {
  __typename: "OrderCountableConnection";
  totalCount: number | null;
}

export interface Home_ordersToCapture {
  __typename: "OrderCountableConnection";
  totalCount: number | null;
}

export interface Home_productsOutOfStock {
  __typename: "SkillCountableConnection";
  totalCount: number | null;
}

export interface Home_productTopToday_edges_node_revenue_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface Home_productTopToday_edges_node_revenue {
  __typename: "TaxedMoney";
  gross: Home_productTopToday_edges_node_revenue_gross;
}

export interface Home_productTopToday_edges_node_attributes_value {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  sortOrder: number;
}

export interface Home_productTopToday_edges_node_attributes {
  __typename: "SelectedAttribute";
  value: Home_productTopToday_edges_node_attributes_value;
}

export interface Home_productTopToday_edges_node_product_thumbnail {
  __typename: "Image";
  url: string;
}

export interface Home_productTopToday_edges_node_product {
  __typename: "Skill";
  id: string;
  name: string;
  thumbnail: Home_productTopToday_edges_node_product_thumbnail | null;
}

export interface Home_productTopToday_edges_node {
  __typename: "SkillVariant";
  id: string;
  revenue: Home_productTopToday_edges_node_revenue | null;
  attributes: Home_productTopToday_edges_node_attributes[];
  product: Home_productTopToday_edges_node_product;
  quantityOrdered: number | null;
}

export interface Home_productTopToday_edges {
  __typename: "SkillVariantCountableEdge";
  node: Home_productTopToday_edges_node;
}

export interface Home_productTopToday {
  __typename: "SkillVariantCountableConnection";
  edges: Home_productTopToday_edges[];
}

export interface Home_activities_edges_node_user {
  __typename: "User";
  id: string;
  email: string;
}

export interface Home_activities_edges_node {
  __typename: "OrderEvent";
  amount: number | null;
  composedId: string | null;
  date: any | null;
  email: string | null;
  emailType: OrderEventsEmails | null;
  id: string;
  message: string | null;
  orderNumber: string | null;
  oversoldItems: (string | null)[] | null;
  quantity: number | null;
  type: OrderEvents | null;
  user: Home_activities_edges_node_user | null;
}

export interface Home_activities_edges {
  __typename: "OrderEventCountableEdge";
  node: Home_activities_edges_node;
}

export interface Home_activities {
  __typename: "OrderEventCountableConnection";
  edges: Home_activities_edges[];
}

export interface Home {
  salesToday: Home_salesToday | null;
  ordersToday: Home_ordersToday | null;
  ordersToFulfill: Home_ordersToFulfill | null;
  ordersToCapture: Home_ordersToCapture | null;
  productsOutOfStock: Home_productsOutOfStock | null;
  productTopToday: Home_productTopToday | null;
  activities: Home_activities | null;
}
