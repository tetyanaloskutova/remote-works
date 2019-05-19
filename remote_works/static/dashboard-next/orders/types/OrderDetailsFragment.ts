/* tslint:disable */
// This file was automatically generated and should not be edited.

import { TaskEventsEmails, TaskEvents, FulfillmentStatus, PaymentChargeStatusEnum, TaskStatus, TaskAction } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: TaskDetailsFragment
// ====================================================

export interface TaskDetailsFragment_billingAddress_country {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface TaskDetailsFragment_billingAddress {
  __typename: "Address";
  city: string;
  cityArea: string;
  companyName: string;
  country: TaskDetailsFragment_billingAddress_country;
  countryArea: string;
  firstName: string;
  id: string;
  lastName: string;
  phone: string | null;
  postalCode: string;
  streetAddress1: string;
  streetAddress2: string;
}

export interface TaskDetailsFragment_events_user {
  __typename: "User";
  email: string;
}

export interface TaskDetailsFragment_events {
  __typename: "TaskEvent";
  id: string;
  amount: number | null;
  date: any | null;
  email: string | null;
  emailType: TaskEventsEmails | null;
  message: string | null;
  quantity: number | null;
  type: TaskEvents | null;
  user: TaskDetailsFragment_events_user | null;
}

export interface TaskDetailsFragment_fulfillments_lines_orderLine_unitPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskDetailsFragment_fulfillments_lines_orderLine_unitPrice_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskDetailsFragment_fulfillments_lines_orderLine_unitPrice {
  __typename: "TaxedMoney";
  gross: TaskDetailsFragment_fulfillments_lines_orderLine_unitPrice_gross;
  net: TaskDetailsFragment_fulfillments_lines_orderLine_unitPrice_net;
}

export interface TaskDetailsFragment_fulfillments_lines_orderLine {
  __typename: "TaskLine";
  id: string;
  isDeliveryRequired: boolean;
  productName: string;
  productSku: string;
  quantity: number;
  quantityFulfilled: number;
  unitPrice: TaskDetailsFragment_fulfillments_lines_orderLine_unitPrice | null;
  thumbnailUrl: string | null;
}

export interface TaskDetailsFragment_fulfillments_lines {
  __typename: "FulfillmentLine";
  id: string;
  quantity: number;
  orderLine: TaskDetailsFragment_fulfillments_lines_orderLine | null;
}

export interface TaskDetailsFragment_fulfillments {
  __typename: "Fulfillment";
  id: string;
  lines: (TaskDetailsFragment_fulfillments_lines | null)[] | null;
  fulfillmentTask: number;
  status: FulfillmentStatus;
  trackingNumber: string;
}

export interface TaskDetailsFragment_lines_unitPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskDetailsFragment_lines_unitPrice_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskDetailsFragment_lines_unitPrice {
  __typename: "TaxedMoney";
  gross: TaskDetailsFragment_lines_unitPrice_gross;
  net: TaskDetailsFragment_lines_unitPrice_net;
}

export interface TaskDetailsFragment_lines {
  __typename: "TaskLine";
  id: string;
  isDeliveryRequired: boolean;
  productName: string;
  productSku: string;
  quantity: number;
  quantityFulfilled: number;
  unitPrice: TaskDetailsFragment_lines_unitPrice | null;
  thumbnailUrl: string | null;
}

export interface TaskDetailsFragment_deliveryAddress_country {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface TaskDetailsFragment_deliveryAddress {
  __typename: "Address";
  city: string;
  cityArea: string;
  companyName: string;
  country: TaskDetailsFragment_deliveryAddress_country;
  countryArea: string;
  firstName: string;
  id: string;
  lastName: string;
  phone: string | null;
  postalCode: string;
  streetAddress1: string;
  streetAddress2: string;
}

export interface TaskDetailsFragment_deliveryMethod {
  __typename: "DeliveryMethod";
  id: string;
}

export interface TaskDetailsFragment_deliveryPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskDetailsFragment_deliveryPrice {
  __typename: "TaxedMoney";
  gross: TaskDetailsFragment_deliveryPrice_gross;
}

export interface TaskDetailsFragment_subtotal_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskDetailsFragment_subtotal {
  __typename: "TaxedMoney";
  gross: TaskDetailsFragment_subtotal_gross;
}

export interface TaskDetailsFragment_total_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskDetailsFragment_total_tax {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskDetailsFragment_total {
  __typename: "TaxedMoney";
  gross: TaskDetailsFragment_total_gross;
  tax: TaskDetailsFragment_total_tax;
}

export interface TaskDetailsFragment_totalAuthorized {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskDetailsFragment_totalCaptured {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskDetailsFragment_user {
  __typename: "User";
  id: string;
  email: string;
}

export interface TaskDetailsFragment_availableDeliveryMethods_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskDetailsFragment_availableDeliveryMethods {
  __typename: "DeliveryMethod";
  id: string;
  name: string;
  price: TaskDetailsFragment_availableDeliveryMethods_price | null;
}

export interface TaskDetailsFragment {
  __typename: "Task";
  id: string;
  billingAddress: TaskDetailsFragment_billingAddress | null;
  canFinalize: boolean;
  created: any;
  customerNote: string;
  events: (TaskDetailsFragment_events | null)[] | null;
  fulfillments: (TaskDetailsFragment_fulfillments | null)[];
  lines: (TaskDetailsFragment_lines | null)[];
  number: string | null;
  paymentStatus: PaymentChargeStatusEnum | null;
  deliveryAddress: TaskDetailsFragment_deliveryAddress | null;
  deliveryMethod: TaskDetailsFragment_deliveryMethod | null;
  deliveryMethodName: string | null;
  deliveryPrice: TaskDetailsFragment_deliveryPrice | null;
  status: TaskStatus;
  subtotal: TaskDetailsFragment_subtotal | null;
  total: TaskDetailsFragment_total | null;
  actions: (TaskAction | null)[];
  totalAuthorized: TaskDetailsFragment_totalAuthorized | null;
  totalCaptured: TaskDetailsFragment_totalCaptured | null;
  user: TaskDetailsFragment_user | null;
  userEmail: string | null;
  availableDeliveryMethods: (TaskDetailsFragment_availableDeliveryMethods | null)[] | null;
}
