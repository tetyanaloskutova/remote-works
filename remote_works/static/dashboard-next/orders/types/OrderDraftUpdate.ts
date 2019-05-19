/* tslint:disable */
// This file was automatically generated and should not be edited.

import { DraftTaskInput, TaskEventsEmails, TaskEvents, FulfillmentStatus, PaymentChargeStatusEnum, TaskStatus, TaskAction } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: TaskDraftUpdate
// ====================================================

export interface TaskDraftUpdate_draftTaskUpdate_errors {
  __typename: "Error";
  field: string | null;
  message: string | null;
}

export interface TaskDraftUpdate_draftTaskUpdate_order_billingAddress_country {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface TaskDraftUpdate_draftTaskUpdate_order_billingAddress {
  __typename: "Address";
  city: string;
  cityArea: string;
  companyName: string;
  country: TaskDraftUpdate_draftTaskUpdate_order_billingAddress_country;
  countryArea: string;
  firstName: string;
  id: string;
  lastName: string;
  phone: string | null;
  postalCode: string;
  streetAddress1: string;
  streetAddress2: string;
}

export interface TaskDraftUpdate_draftTaskUpdate_order_events_user {
  __typename: "User";
  email: string;
}

export interface TaskDraftUpdate_draftTaskUpdate_order_events {
  __typename: "TaskEvent";
  id: string;
  amount: number | null;
  date: any | null;
  email: string | null;
  emailType: TaskEventsEmails | null;
  message: string | null;
  quantity: number | null;
  type: TaskEvents | null;
  user: TaskDraftUpdate_draftTaskUpdate_order_events_user | null;
}

export interface TaskDraftUpdate_draftTaskUpdate_order_fulfillments_lines_orderLine_unitPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskDraftUpdate_draftTaskUpdate_order_fulfillments_lines_orderLine_unitPrice_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskDraftUpdate_draftTaskUpdate_order_fulfillments_lines_orderLine_unitPrice {
  __typename: "TaxedMoney";
  gross: TaskDraftUpdate_draftTaskUpdate_order_fulfillments_lines_orderLine_unitPrice_gross;
  net: TaskDraftUpdate_draftTaskUpdate_order_fulfillments_lines_orderLine_unitPrice_net;
}

export interface TaskDraftUpdate_draftTaskUpdate_order_fulfillments_lines_orderLine {
  __typename: "TaskLine";
  id: string;
  isDeliveryRequired: boolean;
  productName: string;
  productSku: string;
  quantity: number;
  quantityFulfilled: number;
  unitPrice: TaskDraftUpdate_draftTaskUpdate_order_fulfillments_lines_orderLine_unitPrice | null;
  thumbnailUrl: string | null;
}

export interface TaskDraftUpdate_draftTaskUpdate_order_fulfillments_lines {
  __typename: "FulfillmentLine";
  id: string;
  quantity: number;
  orderLine: TaskDraftUpdate_draftTaskUpdate_order_fulfillments_lines_orderLine | null;
}

export interface TaskDraftUpdate_draftTaskUpdate_order_fulfillments {
  __typename: "Fulfillment";
  id: string;
  lines: (TaskDraftUpdate_draftTaskUpdate_order_fulfillments_lines | null)[] | null;
  fulfillmentTask: number;
  status: FulfillmentStatus;
  trackingNumber: string;
}

export interface TaskDraftUpdate_draftTaskUpdate_order_lines_unitPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskDraftUpdate_draftTaskUpdate_order_lines_unitPrice_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskDraftUpdate_draftTaskUpdate_order_lines_unitPrice {
  __typename: "TaxedMoney";
  gross: TaskDraftUpdate_draftTaskUpdate_order_lines_unitPrice_gross;
  net: TaskDraftUpdate_draftTaskUpdate_order_lines_unitPrice_net;
}

export interface TaskDraftUpdate_draftTaskUpdate_order_lines {
  __typename: "TaskLine";
  id: string;
  isDeliveryRequired: boolean;
  productName: string;
  productSku: string;
  quantity: number;
  quantityFulfilled: number;
  unitPrice: TaskDraftUpdate_draftTaskUpdate_order_lines_unitPrice | null;
  thumbnailUrl: string | null;
}

export interface TaskDraftUpdate_draftTaskUpdate_order_deliveryAddress_country {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface TaskDraftUpdate_draftTaskUpdate_order_deliveryAddress {
  __typename: "Address";
  city: string;
  cityArea: string;
  companyName: string;
  country: TaskDraftUpdate_draftTaskUpdate_order_deliveryAddress_country;
  countryArea: string;
  firstName: string;
  id: string;
  lastName: string;
  phone: string | null;
  postalCode: string;
  streetAddress1: string;
  streetAddress2: string;
}

export interface TaskDraftUpdate_draftTaskUpdate_order_deliveryMethod {
  __typename: "DeliveryMethod";
  id: string;
}

export interface TaskDraftUpdate_draftTaskUpdate_order_deliveryPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskDraftUpdate_draftTaskUpdate_order_deliveryPrice {
  __typename: "TaxedMoney";
  gross: TaskDraftUpdate_draftTaskUpdate_order_deliveryPrice_gross;
}

export interface TaskDraftUpdate_draftTaskUpdate_order_subtotal_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskDraftUpdate_draftTaskUpdate_order_subtotal {
  __typename: "TaxedMoney";
  gross: TaskDraftUpdate_draftTaskUpdate_order_subtotal_gross;
}

export interface TaskDraftUpdate_draftTaskUpdate_order_total_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskDraftUpdate_draftTaskUpdate_order_total_tax {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskDraftUpdate_draftTaskUpdate_order_total {
  __typename: "TaxedMoney";
  gross: TaskDraftUpdate_draftTaskUpdate_order_total_gross;
  tax: TaskDraftUpdate_draftTaskUpdate_order_total_tax;
}

export interface TaskDraftUpdate_draftTaskUpdate_order_totalAuthorized {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskDraftUpdate_draftTaskUpdate_order_totalCaptured {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskDraftUpdate_draftTaskUpdate_order_user {
  __typename: "User";
  id: string;
  email: string;
}

export interface TaskDraftUpdate_draftTaskUpdate_order_availableDeliveryMethods_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskDraftUpdate_draftTaskUpdate_order_availableDeliveryMethods {
  __typename: "DeliveryMethod";
  id: string;
  name: string;
  price: TaskDraftUpdate_draftTaskUpdate_order_availableDeliveryMethods_price | null;
}

export interface TaskDraftUpdate_draftTaskUpdate_order {
  __typename: "Task";
  id: string;
  billingAddress: TaskDraftUpdate_draftTaskUpdate_order_billingAddress | null;
  canFinalize: boolean;
  created: any;
  customerNote: string;
  events: (TaskDraftUpdate_draftTaskUpdate_order_events | null)[] | null;
  fulfillments: (TaskDraftUpdate_draftTaskUpdate_order_fulfillments | null)[];
  lines: (TaskDraftUpdate_draftTaskUpdate_order_lines | null)[];
  number: string | null;
  paymentStatus: PaymentChargeStatusEnum | null;
  deliveryAddress: TaskDraftUpdate_draftTaskUpdate_order_deliveryAddress | null;
  deliveryMethod: TaskDraftUpdate_draftTaskUpdate_order_deliveryMethod | null;
  deliveryMethodName: string | null;
  deliveryPrice: TaskDraftUpdate_draftTaskUpdate_order_deliveryPrice | null;
  status: TaskStatus;
  subtotal: TaskDraftUpdate_draftTaskUpdate_order_subtotal | null;
  total: TaskDraftUpdate_draftTaskUpdate_order_total | null;
  actions: (TaskAction | null)[];
  totalAuthorized: TaskDraftUpdate_draftTaskUpdate_order_totalAuthorized | null;
  totalCaptured: TaskDraftUpdate_draftTaskUpdate_order_totalCaptured | null;
  user: TaskDraftUpdate_draftTaskUpdate_order_user | null;
  userEmail: string | null;
  availableDeliveryMethods: (TaskDraftUpdate_draftTaskUpdate_order_availableDeliveryMethods | null)[] | null;
}

export interface TaskDraftUpdate_draftTaskUpdate {
  __typename: "DraftTaskUpdate";
  errors: TaskDraftUpdate_draftTaskUpdate_errors[] | null;
  task: TaskDraftUpdate_draftTaskUpdate_order | null;
}

export interface TaskDraftUpdate {
  draftTaskUpdate: TaskDraftUpdate_draftTaskUpdate | null;
}

export interface TaskDraftUpdateVariables {
  id: string;
  input: DraftTaskInput;
}
