/* tslint:disable */
// This file was automatically generated and should not be edited.

import { TaskEventsEmails, TaskEvents, FulfillmentStatus, PaymentChargeStatusEnum, TaskStatus, TaskAction, WeightUnitsEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: TaskDetails
// ====================================================

export interface TaskDetails_order_billingAddress_country {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface TaskDetails_order_billingAddress {
  __typename: "Address";
  city: string;
  cityArea: string;
  companyName: string;
  country: TaskDetails_order_billingAddress_country;
  countryArea: string;
  firstName: string;
  id: string;
  lastName: string;
  phone: string | null;
  postalCode: string;
  streetAddress1: string;
  streetAddress2: string;
}

export interface TaskDetails_order_events_user {
  __typename: "User";
  email: string;
}

export interface TaskDetails_order_events {
  __typename: "TaskEvent";
  id: string;
  amount: number | null;
  date: any | null;
  email: string | null;
  emailType: TaskEventsEmails | null;
  message: string | null;
  quantity: number | null;
  type: TaskEvents | null;
  user: TaskDetails_order_events_user | null;
}

export interface TaskDetails_order_fulfillments_lines_orderLine_unitPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskDetails_order_fulfillments_lines_orderLine_unitPrice_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskDetails_order_fulfillments_lines_orderLine_unitPrice {
  __typename: "TaxedMoney";
  gross: TaskDetails_order_fulfillments_lines_orderLine_unitPrice_gross;
  net: TaskDetails_order_fulfillments_lines_orderLine_unitPrice_net;
}

export interface TaskDetails_order_fulfillments_lines_orderLine {
  __typename: "TaskLine";
  id: string;
  isDeliveryRequired: boolean;
  productName: string;
  productSku: string;
  quantity: number;
  quantityFulfilled: number;
  unitPrice: TaskDetails_order_fulfillments_lines_orderLine_unitPrice | null;
  thumbnailUrl: string | null;
}

export interface TaskDetails_order_fulfillments_lines {
  __typename: "FulfillmentLine";
  id: string;
  quantity: number;
  orderLine: TaskDetails_order_fulfillments_lines_orderLine | null;
}

export interface TaskDetails_order_fulfillments {
  __typename: "Fulfillment";
  id: string;
  lines: (TaskDetails_order_fulfillments_lines | null)[] | null;
  fulfillmentTask: number;
  status: FulfillmentStatus;
  trackingNumber: string;
}

export interface TaskDetails_order_lines_unitPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskDetails_order_lines_unitPrice_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskDetails_order_lines_unitPrice {
  __typename: "TaxedMoney";
  gross: TaskDetails_order_lines_unitPrice_gross;
  net: TaskDetails_order_lines_unitPrice_net;
}

export interface TaskDetails_order_lines {
  __typename: "TaskLine";
  id: string;
  isDeliveryRequired: boolean;
  productName: string;
  productSku: string;
  quantity: number;
  quantityFulfilled: number;
  unitPrice: TaskDetails_order_lines_unitPrice | null;
  thumbnailUrl: string | null;
}

export interface TaskDetails_order_deliveryAddress_country {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface TaskDetails_order_deliveryAddress {
  __typename: "Address";
  city: string;
  cityArea: string;
  companyName: string;
  country: TaskDetails_order_deliveryAddress_country;
  countryArea: string;
  firstName: string;
  id: string;
  lastName: string;
  phone: string | null;
  postalCode: string;
  streetAddress1: string;
  streetAddress2: string;
}

export interface TaskDetails_order_deliveryMethod {
  __typename: "DeliveryMethod";
  id: string;
}

export interface TaskDetails_order_deliveryPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskDetails_order_deliveryPrice {
  __typename: "TaxedMoney";
  gross: TaskDetails_order_deliveryPrice_gross;
}

export interface TaskDetails_order_subtotal_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskDetails_order_subtotal {
  __typename: "TaxedMoney";
  gross: TaskDetails_order_subtotal_gross;
}

export interface TaskDetails_order_total_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskDetails_order_total_tax {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskDetails_order_total {
  __typename: "TaxedMoney";
  gross: TaskDetails_order_total_gross;
  tax: TaskDetails_order_total_tax;
}

export interface TaskDetails_order_totalAuthorized {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskDetails_order_totalCaptured {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskDetails_order_user {
  __typename: "User";
  id: string;
  email: string;
}

export interface TaskDetails_order_availableDeliveryMethods_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskDetails_order_availableDeliveryMethods {
  __typename: "DeliveryMethod";
  id: string;
  name: string;
  price: TaskDetails_order_availableDeliveryMethods_price | null;
}

export interface TaskDetails_order {
  __typename: "Task";
  id: string;
  billingAddress: TaskDetails_order_billingAddress | null;
  canFinalize: boolean;
  created: any;
  customerNote: string;
  events: (TaskDetails_order_events | null)[] | null;
  fulfillments: (TaskDetails_order_fulfillments | null)[];
  lines: (TaskDetails_order_lines | null)[];
  number: string | null;
  paymentStatus: PaymentChargeStatusEnum | null;
  deliveryAddress: TaskDetails_order_deliveryAddress | null;
  deliveryMethod: TaskDetails_order_deliveryMethod | null;
  deliveryMethodName: string | null;
  deliveryPrice: TaskDetails_order_deliveryPrice | null;
  status: TaskStatus;
  subtotal: TaskDetails_order_subtotal | null;
  total: TaskDetails_order_total | null;
  actions: (TaskAction | null)[];
  totalAuthorized: TaskDetails_order_totalAuthorized | null;
  totalCaptured: TaskDetails_order_totalCaptured | null;
  user: TaskDetails_order_user | null;
  userEmail: string | null;
  availableDeliveryMethods: (TaskDetails_order_availableDeliveryMethods | null)[] | null;
}

export interface TaskDetails_shop_countries {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface TaskDetails_shop {
  __typename: "Shop";
  countries: (TaskDetails_shop_countries | null)[];
  defaultWeightUnit: WeightUnitsEnum | null;
}

export interface TaskDetails {
  task: TaskDetails_order | null;
  shop: TaskDetails_shop | null;
}

export interface TaskDetailsVariables {
  id: string;
}
