/* tslint:disable */
// This file was automatically generated and should not be edited.

import { TaskEventsEmails, TaskEvents, FulfillmentStatus, PaymentChargeStatusEnum, TaskStatus, TaskAction } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: TaskVoid
// ====================================================

export interface TaskVoid_orderVoid_errors {
  __typename: "Error";
  field: string | null;
  message: string | null;
}

export interface TaskVoid_orderVoid_order_billingAddress_country {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface TaskVoid_orderVoid_order_billingAddress {
  __typename: "Address";
  city: string;
  cityArea: string;
  companyName: string;
  country: TaskVoid_orderVoid_order_billingAddress_country;
  countryArea: string;
  firstName: string;
  id: string;
  lastName: string;
  phone: string | null;
  postalCode: string;
  streetAddress1: string;
  streetAddress2: string;
}

export interface TaskVoid_orderVoid_order_events_user {
  __typename: "User";
  email: string;
}

export interface TaskVoid_orderVoid_order_events {
  __typename: "TaskEvent";
  id: string;
  amount: number | null;
  date: any | null;
  email: string | null;
  emailType: TaskEventsEmails | null;
  message: string | null;
  quantity: number | null;
  type: TaskEvents | null;
  user: TaskVoid_orderVoid_order_events_user | null;
}

export interface TaskVoid_orderVoid_order_fulfillments_lines_orderLine_unitPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskVoid_orderVoid_order_fulfillments_lines_orderLine_unitPrice_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskVoid_orderVoid_order_fulfillments_lines_orderLine_unitPrice {
  __typename: "TaxedMoney";
  gross: TaskVoid_orderVoid_order_fulfillments_lines_orderLine_unitPrice_gross;
  net: TaskVoid_orderVoid_order_fulfillments_lines_orderLine_unitPrice_net;
}

export interface TaskVoid_orderVoid_order_fulfillments_lines_orderLine {
  __typename: "TaskLine";
  id: string;
  isDeliveryRequired: boolean;
  productName: string;
  productSku: string;
  quantity: number;
  quantityFulfilled: number;
  unitPrice: TaskVoid_orderVoid_order_fulfillments_lines_orderLine_unitPrice | null;
  thumbnailUrl: string | null;
}

export interface TaskVoid_orderVoid_order_fulfillments_lines {
  __typename: "FulfillmentLine";
  id: string;
  quantity: number;
  orderLine: TaskVoid_orderVoid_order_fulfillments_lines_orderLine | null;
}

export interface TaskVoid_orderVoid_order_fulfillments {
  __typename: "Fulfillment";
  id: string;
  lines: (TaskVoid_orderVoid_order_fulfillments_lines | null)[] | null;
  fulfillmentTask: number;
  status: FulfillmentStatus;
  trackingNumber: string;
}

export interface TaskVoid_orderVoid_order_lines_unitPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskVoid_orderVoid_order_lines_unitPrice_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskVoid_orderVoid_order_lines_unitPrice {
  __typename: "TaxedMoney";
  gross: TaskVoid_orderVoid_order_lines_unitPrice_gross;
  net: TaskVoid_orderVoid_order_lines_unitPrice_net;
}

export interface TaskVoid_orderVoid_order_lines {
  __typename: "TaskLine";
  id: string;
  isDeliveryRequired: boolean;
  productName: string;
  productSku: string;
  quantity: number;
  quantityFulfilled: number;
  unitPrice: TaskVoid_orderVoid_order_lines_unitPrice | null;
  thumbnailUrl: string | null;
}

export interface TaskVoid_orderVoid_order_deliveryAddress_country {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface TaskVoid_orderVoid_order_deliveryAddress {
  __typename: "Address";
  city: string;
  cityArea: string;
  companyName: string;
  country: TaskVoid_orderVoid_order_deliveryAddress_country;
  countryArea: string;
  firstName: string;
  id: string;
  lastName: string;
  phone: string | null;
  postalCode: string;
  streetAddress1: string;
  streetAddress2: string;
}

export interface TaskVoid_orderVoid_order_deliveryMethod {
  __typename: "DeliveryMethod";
  id: string;
}

export interface TaskVoid_orderVoid_order_deliveryPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskVoid_orderVoid_order_deliveryPrice {
  __typename: "TaxedMoney";
  gross: TaskVoid_orderVoid_order_deliveryPrice_gross;
}

export interface TaskVoid_orderVoid_order_subtotal_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskVoid_orderVoid_order_subtotal {
  __typename: "TaxedMoney";
  gross: TaskVoid_orderVoid_order_subtotal_gross;
}

export interface TaskVoid_orderVoid_order_total_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskVoid_orderVoid_order_total_tax {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskVoid_orderVoid_order_total {
  __typename: "TaxedMoney";
  gross: TaskVoid_orderVoid_order_total_gross;
  tax: TaskVoid_orderVoid_order_total_tax;
}

export interface TaskVoid_orderVoid_order_totalAuthorized {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskVoid_orderVoid_order_totalCaptured {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskVoid_orderVoid_order_user {
  __typename: "User";
  id: string;
  email: string;
}

export interface TaskVoid_orderVoid_order_availableDeliveryMethods_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskVoid_orderVoid_order_availableDeliveryMethods {
  __typename: "DeliveryMethod";
  id: string;
  name: string;
  price: TaskVoid_orderVoid_order_availableDeliveryMethods_price | null;
}

export interface TaskVoid_orderVoid_order {
  __typename: "Task";
  id: string;
  billingAddress: TaskVoid_orderVoid_order_billingAddress | null;
  canFinalize: boolean;
  created: any;
  customerNote: string;
  events: (TaskVoid_orderVoid_order_events | null)[] | null;
  fulfillments: (TaskVoid_orderVoid_order_fulfillments | null)[];
  lines: (TaskVoid_orderVoid_order_lines | null)[];
  number: string | null;
  paymentStatus: PaymentChargeStatusEnum | null;
  deliveryAddress: TaskVoid_orderVoid_order_deliveryAddress | null;
  deliveryMethod: TaskVoid_orderVoid_order_deliveryMethod | null;
  deliveryMethodName: string | null;
  deliveryPrice: TaskVoid_orderVoid_order_deliveryPrice | null;
  status: TaskStatus;
  subtotal: TaskVoid_orderVoid_order_subtotal | null;
  total: TaskVoid_orderVoid_order_total | null;
  actions: (TaskAction | null)[];
  totalAuthorized: TaskVoid_orderVoid_order_totalAuthorized | null;
  totalCaptured: TaskVoid_orderVoid_order_totalCaptured | null;
  user: TaskVoid_orderVoid_order_user | null;
  userEmail: string | null;
  availableDeliveryMethods: (TaskVoid_orderVoid_order_availableDeliveryMethods | null)[] | null;
}

export interface TaskVoid_orderVoid {
  __typename: "TaskVoid";
  errors: TaskVoid_orderVoid_errors[] | null;
  task: TaskVoid_orderVoid_order | null;
}

export interface TaskVoid {
  orderVoid: TaskVoid_orderVoid | null;
}

export interface TaskVoidVariables {
  id: string;
}
