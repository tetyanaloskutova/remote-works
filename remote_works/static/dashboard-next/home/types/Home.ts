/* tslint:disable */
// This file was automatically generated and should not be edited.

import { TaskEventsEmails, TaskEvents } from "./../../types/globalTypes";

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
  __typename: "TaskCountableConnection";
  totalCount: number | null;
}

export interface Home_ordersToFulfill {
  __typename: "TaskCountableConnection";
  totalCount: number | null;
}

export interface Home_ordersToCapture {
  __typename: "TaskCountableConnection";
  totalCount: number | null;
}

export interface Home_skillsOutOfStock {
  __typename: "SkillCountableConnection";
  totalCount: number | null;
}

export interface Home_skillTopToday_edges_node_revenue_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface Home_skillTopToday_edges_node_revenue {
  __typename: "TaxedMoney";
  gross: Home_skillTopToday_edges_node_revenue_gross;
}

export interface Home_skillTopToday_edges_node_attributes_value {
  __typename: "AttributeValue";
  id: string;
  name: string | null;
  sortTask: number;
}

export interface Home_skillTopToday_edges_node_attributes {
  __typename: "SelectedAttribute";
  value: Home_skillTopToday_edges_node_attributes_value;
}

export interface Home_skillTopToday_edges_node_skill_thumbnail {
  __typename: "Image";
  url: string;
}

export interface Home_skillTopToday_edges_node_skill {
  __typename: "Skill";
  id: string;
  name: string;
  thumbnail: Home_skillTopToday_edges_node_skill_thumbnail | null;
}

export interface Home_skillTopToday_edges_node {
  __typename: "SkillVariant";
  id: string;
  revenue: Home_skillTopToday_edges_node_revenue | null;
  attributes: Home_skillTopToday_edges_node_attributes[];
  skill: Home_skillTopToday_edges_node_skill;
  quantityTasked: number | null;
}

export interface Home_skillTopToday_edges {
  __typename: "SkillVariantCountableEdge";
  node: Home_skillTopToday_edges_node;
}

export interface Home_skillTopToday {
  __typename: "SkillVariantCountableConnection";
  edges: Home_skillTopToday_edges[];
}

export interface Home_activities_edges_node_user {
  __typename: "User";
  id: string;
  email: string;
}

export interface Home_activities_edges_node {
  __typename: "TaskEvent";
  amount: number | null;
  composedId: string | null;
  date: any | null;
  email: string | null;
  emailType: TaskEventsEmails | null;
  id: string;
  message: string | null;
  taskNumber: string | null;
  oversoldItems: (string | null)[] | null;
  quantity: number | null;
  type: TaskEvents | null;
  user: Home_activities_edges_node_user | null;
}

export interface Home_activities_edges {
  __typename: "TaskEventCountableEdge";
  node: Home_activities_edges_node;
}

export interface Home_activities {
  __typename: "TaskEventCountableConnection";
  edges: Home_activities_edges[];
}

export interface Home {
  salesToday: Home_salesToday | null;
  ordersToday: Home_ordersToday | null;
  ordersToFulfill: Home_ordersToFulfill | null;
  ordersToCapture: Home_ordersToCapture | null;
  skillsOutOfStock: Home_skillsOutOfStock | null;
  skillTopToday: Home_skillTopToday | null;
  activities: Home_activities | null;
}
