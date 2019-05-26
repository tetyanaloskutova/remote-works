/* tslint:disable */
// This file was automatically generated and should not be edited.

import { TaskEventsEmails, TaskEvents, FulfillmentStatus, PaymentChargeStatusEnum, TaskStatus, TaskAction } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: TaskDraftFinalize
// ====================================================

export interface TaskDraftFinalize_draftTaskComplete_errors {
  __typename: "Error";
  field: string | null;
  message: string | null;
}

export interface TaskDraftFinalize_draftTaskComplete_task_billingAddress_country {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface TaskDraftFinalize_draftTaskComplete_task_billingAddress {
  __typename: "Address";
  city: string;
  cityArea: string;
  companyName: string;
  country: TaskDraftFinalize_draftTaskComplete_task_billingAddress_country;
  countryArea: string;
  firstName: string;
  id: string;
  lastName: string;
  phone: string | null;
  postalCode: string;
  streetAddress1: string;
  streetAddress2: string;
}

export interface TaskDraftFinalize_draftTaskComplete_task_events_user {
  __typename: "User";
  email: string;
}

export interface TaskDraftFinalize_draftTaskComplete_task_events {
  __typename: "TaskEvent";
  id: string;
  amount: number | null;
  date: any | null;
  email: string | null;
  emailType: TaskEventsEmails | null;
  message: string | null;
  quantity: number | null;
  type: TaskEvents | null;
  user: TaskDraftFinalize_draftTaskComplete_task_events_user | null;
}

export interface TaskDraftFinalize_draftTaskComplete_task_fulfillments_lines_orderLine_unitPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskDraftFinalize_draftTaskComplete_task_fulfillments_lines_orderLine_unitPrice_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskDraftFinalize_draftTaskComplete_task_fulfillments_lines_orderLine_unitPrice {
  __typename: "TaxedMoney";
  gross: TaskDraftFinalize_draftTaskComplete_task_fulfillments_lines_orderLine_unitPrice_gross;
  net: TaskDraftFinalize_draftTaskComplete_task_fulfillments_lines_orderLine_unitPrice_net;
}

export interface TaskDraftFinalize_draftTaskComplete_task_fulfillments_lines_orderLine {
  __typename: "TaskLine";
  id: string;
  isDeliveryRequired: boolean;
  productName: string;
  productSku: string;
  quantity: number;
  quantityFulfilled: number;
  unitPrice: TaskDraftFinalize_draftTaskComplete_task_fulfillments_lines_orderLine_unitPrice | null;
  thumbnailUrl: string | null;
}

export interface TaskDraftFinalize_draftTaskComplete_task_fulfillments_lines {
  __typename: "FulfillmentLine";
  id: string;
  quantity: number;
  orderLine: TaskDraftFinalize_draftTaskComplete_task_fulfillments_lines_orderLine | null;
}

export interface TaskDraftFinalize_draftTaskComplete_task_fulfillments {
  __typename: "Fulfillment";
  id: string;
  lines: (TaskDraftFinalize_draftTaskComplete_task_fulfillments_lines | null)[] | null;
  fulfillmentTask: number;
  status: FulfillmentStatus;
  trackingNumber: string;
}

export interface TaskDraftFinalize_draftTaskComplete_task_lines_unitPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskDraftFinalize_draftTaskComplete_task_lines_unitPrice_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskDraftFinalize_draftTaskComplete_task_lines_unitPrice {
  __typename: "TaxedMoney";
  gross: TaskDraftFinalize_draftTaskComplete_task_lines_unitPrice_gross;
  net: TaskDraftFinalize_draftTaskComplete_task_lines_unitPrice_net;
}

export interface TaskDraftFinalize_draftTaskComplete_task_lines {
  __typename: "TaskLine";
  id: string;
  isDeliveryRequired: boolean;
  productName: string;
  productSku: string;
  quantity: number;
  quantityFulfilled: number;
  unitPrice: TaskDraftFinalize_draftTaskComplete_task_lines_unitPrice | null;
  thumbnailUrl: string | null;
}

export interface TaskDraftFinalize_draftTaskComplete_task_deliveryAddress_country {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface TaskDraftFinalize_draftTaskComplete_task_deliveryAddress {
  __typename: "Address";
  city: string;
  cityArea: string;
  companyName: string;
  country: TaskDraftFinalize_draftTaskComplete_task_deliveryAddress_country;
  countryArea: string;
  firstName: string;
  id: string;
  lastName: string;
  phone: string | null;
  postalCode: string;
  streetAddress1: string;
  streetAddress2: string;
}

export interface TaskDraftFinalize_draftTaskComplete_task_deliveryMethod {
  __typename: "DeliveryMethod";
  id: string;
}

export interface TaskDraftFinalize_draftTaskComplete_task_deliveryPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskDraftFinalize_draftTaskComplete_task_deliveryPrice {
  __typename: "TaxedMoney";
  gross: TaskDraftFinalize_draftTaskComplete_task_deliveryPrice_gross;
}

export interface TaskDraftFinalize_draftTaskComplete_task_subtotal_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskDraftFinalize_draftTaskComplete_task_subtotal {
  __typename: "TaxedMoney";
  gross: TaskDraftFinalize_draftTaskComplete_task_subtotal_gross;
}

export interface TaskDraftFinalize_draftTaskComplete_task_total_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskDraftFinalize_draftTaskComplete_task_total_tax {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskDraftFinalize_draftTaskComplete_task_total {
  __typename: "TaxedMoney";
  gross: TaskDraftFinalize_draftTaskComplete_task_total_gross;
  tax: TaskDraftFinalize_draftTaskComplete_task_total_tax;
}

export interface TaskDraftFinalize_draftTaskComplete_task_totalAuthorized {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskDraftFinalize_draftTaskComplete_task_totalCaptured {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskDraftFinalize_draftTaskComplete_task_user {
  __typename: "User";
  id: string;
  email: string;
}

export interface TaskDraftFinalize_draftTaskComplete_task_availableDeliveryMethods_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskDraftFinalize_draftTaskComplete_task_availableDeliveryMethods {
  __typename: "DeliveryMethod";
  id: string;
  name: string;
  price: TaskDraftFinalize_draftTaskComplete_task_availableDeliveryMethods_price | null;
}

export interface TaskDraftFinalize_draftTaskComplete_order {
  __typename: "Task";
  id: string;
  billingAddress: TaskDraftFinalize_draftTaskComplete_task_billingAddress | null;
  canFinalize: boolean;
  created: any;
  customerNote: string;
  events: (TaskDraftFinalize_draftTaskComplete_task_events | null)[] | null;
  fulfillments: (TaskDraftFinalize_draftTaskComplete_task_fulfillments | null)[];
  lines: (TaskDraftFinalize_draftTaskComplete_task_lines | null)[];
  number: string | null;
  paymentStatus: PaymentChargeStatusEnum | null;
  deliveryAddress: TaskDraftFinalize_draftTaskComplete_task_deliveryAddress | null;
  deliveryMethod: TaskDraftFinalize_draftTaskComplete_task_deliveryMethod | null;
  deliveryMethodName: string | null;
  deliveryPrice: TaskDraftFinalize_draftTaskComplete_task_deliveryPrice | null;
  status: TaskStatus;
  subtotal: TaskDraftFinalize_draftTaskComplete_task_subtotal | null;
  total: TaskDraftFinalize_draftTaskComplete_task_total | null;
  actions: (TaskAction | null)[];
  totalAuthorized: TaskDraftFinalize_draftTaskComplete_task_totalAuthorized | null;
  totalCaptured: TaskDraftFinalize_draftTaskComplete_task_totalCaptured | null;
  user: TaskDraftFinalize_draftTaskComplete_task_user | null;
  userEmail: string | null;
  availableDeliveryMethods: (TaskDraftFinalize_draftTaskComplete_task_availableDeliveryMethods | null)[] | null;
}

export interface TaskDraftFinalize_draftTaskComplete {
  __typename: "DraftTaskComplete";
  errors: TaskDraftFinalize_draftTaskComplete_errors[] | null;
  task: TaskDraftFinalize_draftTaskComplete_order | null;
}

export interface TaskDraftFinalize {
  draftTaskComplete: TaskDraftFinalize_draftTaskComplete | null;
}

export interface TaskDraftFinalizeVariables {
  id: string;
}
