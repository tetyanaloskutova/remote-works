/* tslint:disable */
// This file was automatically generated and should not be edited.

import { TaskEventsEmails, TaskEvents, FulfillmentStatus, PaymentChargeStatusEnum, TaskStatus, TaskAction } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: TaskMarkAsPaid
// ====================================================

export interface TaskMarkAsPaid_orderMarkAsPaid_errors {
  __typename: "Error";
  field: string | null;
  message: string | null;
}

export interface TaskMarkAsPaid_orderMarkAsPaid_order_billingAddress_country {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface TaskMarkAsPaid_orderMarkAsPaid_order_billingAddress {
  __typename: "Address";
  city: string;
  cityArea: string;
  companyName: string;
  country: TaskMarkAsPaid_orderMarkAsPaid_order_billingAddress_country;
  countryArea: string;
  firstName: string;
  id: string;
  lastName: string;
  phone: string | null;
  postalCode: string;
  streetAddress1: string;
  streetAddress2: string;
}

export interface TaskMarkAsPaid_orderMarkAsPaid_order_events_user {
  __typename: "User";
  email: string;
}

export interface TaskMarkAsPaid_orderMarkAsPaid_order_events {
  __typename: "TaskEvent";
  id: string;
  amount: number | null;
  date: any | null;
  email: string | null;
  emailType: TaskEventsEmails | null;
  message: string | null;
  quantity: number | null;
  type: TaskEvents | null;
  user: TaskMarkAsPaid_orderMarkAsPaid_order_events_user | null;
}

export interface TaskMarkAsPaid_orderMarkAsPaid_order_fulfillments_lines_orderLine_unitPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskMarkAsPaid_orderMarkAsPaid_order_fulfillments_lines_orderLine_unitPrice_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskMarkAsPaid_orderMarkAsPaid_order_fulfillments_lines_orderLine_unitPrice {
  __typename: "TaxedMoney";
  gross: TaskMarkAsPaid_orderMarkAsPaid_order_fulfillments_lines_orderLine_unitPrice_gross;
  net: TaskMarkAsPaid_orderMarkAsPaid_order_fulfillments_lines_orderLine_unitPrice_net;
}

export interface TaskMarkAsPaid_orderMarkAsPaid_order_fulfillments_lines_orderLine {
  __typename: "TaskLine";
  id: string;
  isDeliveryRequired: boolean;
  productName: string;
  productSku: string;
  quantity: number;
  quantityFulfilled: number;
  unitPrice: TaskMarkAsPaid_orderMarkAsPaid_order_fulfillments_lines_orderLine_unitPrice | null;
  thumbnailUrl: string | null;
}

export interface TaskMarkAsPaid_orderMarkAsPaid_order_fulfillments_lines {
  __typename: "FulfillmentLine";
  id: string;
  quantity: number;
  orderLine: TaskMarkAsPaid_orderMarkAsPaid_order_fulfillments_lines_orderLine | null;
}

export interface TaskMarkAsPaid_orderMarkAsPaid_order_fulfillments {
  __typename: "Fulfillment";
  id: string;
  lines: (TaskMarkAsPaid_orderMarkAsPaid_order_fulfillments_lines | null)[] | null;
  fulfillmentTask: number;
  status: FulfillmentStatus;
  trackingNumber: string;
}

export interface TaskMarkAsPaid_orderMarkAsPaid_order_lines_unitPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskMarkAsPaid_orderMarkAsPaid_order_lines_unitPrice_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskMarkAsPaid_orderMarkAsPaid_order_lines_unitPrice {
  __typename: "TaxedMoney";
  gross: TaskMarkAsPaid_orderMarkAsPaid_order_lines_unitPrice_gross;
  net: TaskMarkAsPaid_orderMarkAsPaid_order_lines_unitPrice_net;
}

export interface TaskMarkAsPaid_orderMarkAsPaid_order_lines {
  __typename: "TaskLine";
  id: string;
  isDeliveryRequired: boolean;
  productName: string;
  productSku: string;
  quantity: number;
  quantityFulfilled: number;
  unitPrice: TaskMarkAsPaid_orderMarkAsPaid_order_lines_unitPrice | null;
  thumbnailUrl: string | null;
}

export interface TaskMarkAsPaid_orderMarkAsPaid_order_deliveryAddress_country {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface TaskMarkAsPaid_orderMarkAsPaid_order_deliveryAddress {
  __typename: "Address";
  city: string;
  cityArea: string;
  companyName: string;
  country: TaskMarkAsPaid_orderMarkAsPaid_order_deliveryAddress_country;
  countryArea: string;
  firstName: string;
  id: string;
  lastName: string;
  phone: string | null;
  postalCode: string;
  streetAddress1: string;
  streetAddress2: string;
}

export interface TaskMarkAsPaid_orderMarkAsPaid_order_deliveryMethod {
  __typename: "DeliveryMethod";
  id: string;
}

export interface TaskMarkAsPaid_orderMarkAsPaid_order_deliveryPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskMarkAsPaid_orderMarkAsPaid_order_deliveryPrice {
  __typename: "TaxedMoney";
  gross: TaskMarkAsPaid_orderMarkAsPaid_order_deliveryPrice_gross;
}

export interface TaskMarkAsPaid_orderMarkAsPaid_order_subtotal_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskMarkAsPaid_orderMarkAsPaid_order_subtotal {
  __typename: "TaxedMoney";
  gross: TaskMarkAsPaid_orderMarkAsPaid_order_subtotal_gross;
}

export interface TaskMarkAsPaid_orderMarkAsPaid_order_total_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskMarkAsPaid_orderMarkAsPaid_order_total_tax {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskMarkAsPaid_orderMarkAsPaid_order_total {
  __typename: "TaxedMoney";
  gross: TaskMarkAsPaid_orderMarkAsPaid_order_total_gross;
  tax: TaskMarkAsPaid_orderMarkAsPaid_order_total_tax;
}

export interface TaskMarkAsPaid_orderMarkAsPaid_order_totalAuthorized {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskMarkAsPaid_orderMarkAsPaid_order_totalCaptured {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskMarkAsPaid_orderMarkAsPaid_order_user {
  __typename: "User";
  id: string;
  email: string;
}

export interface TaskMarkAsPaid_orderMarkAsPaid_order_availableDeliveryMethods_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskMarkAsPaid_orderMarkAsPaid_order_availableDeliveryMethods {
  __typename: "DeliveryMethod";
  id: string;
  name: string;
  price: TaskMarkAsPaid_orderMarkAsPaid_order_availableDeliveryMethods_price | null;
}

export interface TaskMarkAsPaid_orderMarkAsPaid_order {
  __typename: "Task";
  id: string;
  billingAddress: TaskMarkAsPaid_orderMarkAsPaid_order_billingAddress | null;
  canFinalize: boolean;
  created: any;
  customerNote: string;
  events: (TaskMarkAsPaid_orderMarkAsPaid_order_events | null)[] | null;
  fulfillments: (TaskMarkAsPaid_orderMarkAsPaid_order_fulfillments | null)[];
  lines: (TaskMarkAsPaid_orderMarkAsPaid_order_lines | null)[];
  number: string | null;
  paymentStatus: PaymentChargeStatusEnum | null;
  deliveryAddress: TaskMarkAsPaid_orderMarkAsPaid_order_deliveryAddress | null;
  deliveryMethod: TaskMarkAsPaid_orderMarkAsPaid_order_deliveryMethod | null;
  deliveryMethodName: string | null;
  deliveryPrice: TaskMarkAsPaid_orderMarkAsPaid_order_deliveryPrice | null;
  status: TaskStatus;
  subtotal: TaskMarkAsPaid_orderMarkAsPaid_order_subtotal | null;
  total: TaskMarkAsPaid_orderMarkAsPaid_order_total | null;
  actions: (TaskAction | null)[];
  totalAuthorized: TaskMarkAsPaid_orderMarkAsPaid_order_totalAuthorized | null;
  totalCaptured: TaskMarkAsPaid_orderMarkAsPaid_order_totalCaptured | null;
  user: TaskMarkAsPaid_orderMarkAsPaid_order_user | null;
  userEmail: string | null;
  availableDeliveryMethods: (TaskMarkAsPaid_orderMarkAsPaid_order_availableDeliveryMethods | null)[] | null;
}

export interface TaskMarkAsPaid_orderMarkAsPaid {
  __typename: "TaskMarkAsPaid";
  errors: TaskMarkAsPaid_orderMarkAsPaid_errors[] | null;
  task: TaskMarkAsPaid_orderMarkAsPaid_order | null;
}

export interface TaskMarkAsPaid {
  orderMarkAsPaid: TaskMarkAsPaid_orderMarkAsPaid | null;
}

export interface TaskMarkAsPaidVariables {
  id: string;
}
