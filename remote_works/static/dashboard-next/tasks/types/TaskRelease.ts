/* tslint:disable */
// This file was automatically generated and should not be edited.

import { TaskEventsEmails, TaskEvents, FulfillmentStatus, PaymentChargeStatusEnum, TaskStatus } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: TaskRelease
// ====================================================

export interface TaskRelease_taskRelease_task_billingAddress_country {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface TaskRelease_taskRelease_task_billingAddress {
  __typename: "Address";
  city: string;
  cityArea: string;
  companyName: string;
  country: TaskRelease_taskRelease_task_billingAddress_country;
  countryArea: string;
  firstName: string;
  id: string;
  lastName: string;
  phone: string | null;
  postalCode: string;
  streetAddress1: string;
  streetAddress2: string;
}

export interface TaskRelease_taskRelease_task_events_user {
  __typename: "User";
  email: string;
}

export interface TaskRelease_taskRelease_task_events {
  __typename: "TaskEvent";
  id: string;
  amount: number | null;
  date: any | null;
  email: string | null;
  emailType: TaskEventsEmails | null;
  message: string | null;
  quantity: number | null;
  type: TaskEvents | null;
  user: TaskRelease_taskRelease_task_events_user | null;
}

export interface TaskRelease_taskRelease_task_fulfillments_lines_edges_node_taskLine_unitPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskRelease_taskRelease_task_fulfillments_lines_edges_node_taskLine_unitPrice_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskRelease_taskRelease_task_fulfillments_lines_edges_node_taskLine_unitPrice {
  __typename: "TaxedMoney";
  gross: TaskRelease_taskRelease_task_fulfillments_lines_edges_node_taskLine_unitPrice_gross;
  net: TaskRelease_taskRelease_task_fulfillments_lines_edges_node_taskLine_unitPrice_net;
}

export interface TaskRelease_taskRelease_task_fulfillments_lines_edges_node_taskLine {
  __typename: "TaskLine";
  id: string;
  skillName: string;
  skillSku: string;
  quantity: number;
  quantityFulfilled: number;
  unitPrice: TaskRelease_taskRelease_task_fulfillments_lines_edges_node_taskLine_unitPrice | null;
  thumbnailUrl: string | null;
}

export interface TaskRelease_taskRelease_task_fulfillments_lines_edges_node {
  __typename: "FulfillmentLine";
  id: string;
  quantity: number;
  taskLine: TaskRelease_taskRelease_task_fulfillments_lines_edges_node_taskLine | null;
}

export interface TaskRelease_taskRelease_task_fulfillments_lines_edges {
  __typename: "FulfillmentLineCountableEdge";
  node: TaskRelease_taskRelease_task_fulfillments_lines_edges_node;
}

export interface TaskRelease_taskRelease_task_fulfillments_lines {
  __typename: "FulfillmentLineCountableConnection";
  edges: TaskRelease_taskRelease_task_fulfillments_lines_edges[];
}

export interface TaskRelease_taskRelease_task_fulfillments {
  __typename: "Fulfillment";
  id: string;
  lines: TaskRelease_taskRelease_task_fulfillments_lines | null;
  fulfillmentTask: number;
  status: FulfillmentStatus;
  trackingNumber: string;
}

export interface TaskRelease_taskRelease_task_lines_unitPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskRelease_taskRelease_task_lines_unitPrice_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskRelease_taskRelease_task_lines_unitPrice {
  __typename: "TaxedMoney";
  gross: TaskRelease_taskRelease_task_lines_unitPrice_gross;
  net: TaskRelease_taskRelease_task_lines_unitPrice_net;
}

export interface TaskRelease_taskRelease_task_lines {
  __typename: "TaskLine";
  id: string;
  skillName: string;
  skillSku: string;
  quantity: number;
  quantityFulfilled: number;
  unitPrice: TaskRelease_taskRelease_task_lines_unitPrice | null;
  thumbnailUrl: string | null;
}

export interface TaskRelease_taskRelease_task_deliveryAddress_country {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface TaskRelease_taskRelease_task_deliveryAddress {
  __typename: "Address";
  city: string;
  cityArea: string;
  companyName: string;
  country: TaskRelease_taskRelease_task_deliveryAddress_country;
  countryArea: string;
  firstName: string;
  id: string;
  lastName: string;
  phone: string | null;
  postalCode: string;
  streetAddress1: string;
  streetAddress2: string;
}

export interface TaskRelease_taskRelease_task_deliveryMethod {
  __typename: "DeliveryMethod";
  id: string;
}

export interface TaskRelease_taskRelease_task_deliveryPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskRelease_taskRelease_task_deliveryPrice {
  __typename: "TaxedMoney";
  gross: TaskRelease_taskRelease_task_deliveryPrice_gross;
}

export interface TaskRelease_taskRelease_task_subtotal_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskRelease_taskRelease_task_subtotal {
  __typename: "TaxedMoney";
  gross: TaskRelease_taskRelease_task_subtotal_gross;
}

export interface TaskRelease_taskRelease_task_total_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskRelease_taskRelease_task_total_tax {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskRelease_taskRelease_task_total {
  __typename: "TaxedMoney";
  gross: TaskRelease_taskRelease_task_total_gross;
  tax: TaskRelease_taskRelease_task_total_tax;
}

export interface TaskRelease_taskRelease_task_totalAuthorized {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskRelease_taskRelease_task_totalCaptured {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskRelease_taskRelease_task_user {
  __typename: "User";
  id: string;
  email: string;
}

export interface TaskRelease_taskRelease_task_availableDeliveryMethods_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskRelease_taskRelease_task_availableDeliveryMethods {
  __typename: "DeliveryMethod";
  id: string;
  name: string;
  price: TaskRelease_taskRelease_task_availableDeliveryMethods_price | null;
}

export interface TaskRelease_taskRelease_order {
  __typename: "Task";
  id: string;
  billingAddress: TaskRelease_taskRelease_task_billingAddress | null;
  created: any;
  events: (TaskRelease_taskRelease_task_events | null)[] | null;
  fulfillments: (TaskRelease_taskRelease_task_fulfillments | null)[];
  lines: (TaskRelease_taskRelease_task_lines | null)[];
  number: string | null;
  paymentStatus: PaymentChargeStatusEnum | null;
  deliveryAddress: TaskRelease_taskRelease_task_deliveryAddress | null;
  deliveryMethod: TaskRelease_taskRelease_task_deliveryMethod | null;
  deliveryMethodName: string | null;
  deliveryPrice: TaskRelease_taskRelease_task_deliveryPrice | null;
  status: TaskStatus;
  subtotal: TaskRelease_taskRelease_task_subtotal | null;
  total: TaskRelease_taskRelease_task_total | null;
  totalAuthorized: TaskRelease_taskRelease_task_totalAuthorized | null;
  totalCaptured: TaskRelease_taskRelease_task_totalCaptured | null;
  user: TaskRelease_taskRelease_task_user | null;
  userEmail: string | null;
  availableDeliveryMethods: (TaskRelease_taskRelease_task_availableDeliveryMethods | null)[] | null;
}

export interface TaskRelease_taskRelease {
  __typename: "TaskRelease";
  task: TaskRelease_taskRelease_order | null;
}

export interface TaskRelease {
  taskRelease: TaskRelease_taskRelease | null;
}

export interface TaskReleaseVariables {
  id: string;
}
