/* tslint:disable */
// This file was automatically generated and should not be edited.

import { TaskEventsEmails, TaskEvents, FulfillmentStatus, PaymentChargeStatusEnum, TaskStatus, TaskAction } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: TaskCapture
// ====================================================

export interface TaskCapture_taskCapture_errors {
  __typename: "Error";
  field: string | null;
  message: string | null;
}

export interface TaskCapture_taskCapture_task_billingAddress_country {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface TaskCapture_taskCapture_task_billingAddress {
  __typename: "Address";
  city: string;
  cityArea: string;
  companyName: string;
  country: TaskCapture_taskCapture_task_billingAddress_country;
  countryArea: string;
  firstName: string;
  id: string;
  lastName: string;
  phone: string | null;
  postalCode: string;
  streetAddress1: string;
  streetAddress2: string;
}

export interface TaskCapture_taskCapture_task_events_user {
  __typename: "User";
  email: string;
}

export interface TaskCapture_taskCapture_task_events {
  __typename: "TaskEvent";
  id: string;
  amount: number | null;
  date: any | null;
  email: string | null;
  emailType: TaskEventsEmails | null;
  message: string | null;
  quantity: number | null;
  type: TaskEvents | null;
  user: TaskCapture_taskCapture_task_events_user | null;
}

export interface TaskCapture_taskCapture_task_fulfillments_lines_taskLine_unitPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskCapture_taskCapture_task_fulfillments_lines_taskLine_unitPrice_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskCapture_taskCapture_task_fulfillments_lines_taskLine_unitPrice {
  __typename: "TaxedMoney";
  gross: TaskCapture_taskCapture_task_fulfillments_lines_taskLine_unitPrice_gross;
  net: TaskCapture_taskCapture_task_fulfillments_lines_taskLine_unitPrice_net;
}

export interface TaskCapture_taskCapture_task_fulfillments_lines_taskLine {
  __typename: "TaskLine";
  id: string;
  isDeliveryRequired: boolean;
  skillName: string;
  skillSku: string;
  quantity: number;
  quantityFulfilled: number;
  unitPrice: TaskCapture_taskCapture_task_fulfillments_lines_taskLine_unitPrice | null;
  thumbnailUrl: string | null;
}

export interface TaskCapture_taskCapture_task_fulfillments_lines {
  __typename: "FulfillmentLine";
  id: string;
  quantity: number;
  taskLine: TaskCapture_taskCapture_task_fulfillments_lines_taskLine | null;
}

export interface TaskCapture_taskCapture_task_fulfillments {
  __typename: "Fulfillment";
  id: string;
  lines: (TaskCapture_taskCapture_task_fulfillments_lines | null)[] | null;
  fulfillmentTask: number;
  status: FulfillmentStatus;
  trackingNumber: string;
}

export interface TaskCapture_taskCapture_task_lines_unitPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskCapture_taskCapture_task_lines_unitPrice_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskCapture_taskCapture_task_lines_unitPrice {
  __typename: "TaxedMoney";
  gross: TaskCapture_taskCapture_task_lines_unitPrice_gross;
  net: TaskCapture_taskCapture_task_lines_unitPrice_net;
}

export interface TaskCapture_taskCapture_task_lines {
  __typename: "TaskLine";
  id: string;
  isDeliveryRequired: boolean;
  skillName: string;
  skillSku: string;
  quantity: number;
  quantityFulfilled: number;
  unitPrice: TaskCapture_taskCapture_task_lines_unitPrice | null;
  thumbnailUrl: string | null;
}

export interface TaskCapture_taskCapture_task_deliveryAddress_country {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface TaskCapture_taskCapture_task_deliveryAddress {
  __typename: "Address";
  city: string;
  cityArea: string;
  companyName: string;
  country: TaskCapture_taskCapture_task_deliveryAddress_country;
  countryArea: string;
  firstName: string;
  id: string;
  lastName: string;
  phone: string | null;
  postalCode: string;
  streetAddress1: string;
  streetAddress2: string;
}

export interface TaskCapture_taskCapture_task_deliveryMethod {
  __typename: "DeliveryMethod";
  id: string;
}

export interface TaskCapture_taskCapture_task_deliveryPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskCapture_taskCapture_task_deliveryPrice {
  __typename: "TaxedMoney";
  gross: TaskCapture_taskCapture_task_deliveryPrice_gross;
}

export interface TaskCapture_taskCapture_task_subtotal_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskCapture_taskCapture_task_subtotal {
  __typename: "TaxedMoney";
  gross: TaskCapture_taskCapture_task_subtotal_gross;
}

export interface TaskCapture_taskCapture_task_total_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskCapture_taskCapture_task_total_tax {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskCapture_taskCapture_task_total {
  __typename: "TaxedMoney";
  gross: TaskCapture_taskCapture_task_total_gross;
  tax: TaskCapture_taskCapture_task_total_tax;
}

export interface TaskCapture_taskCapture_task_totalAuthorized {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskCapture_taskCapture_task_totalCaptured {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskCapture_taskCapture_task_user {
  __typename: "User";
  id: string;
  email: string;
}

export interface TaskCapture_taskCapture_task_availableDeliveryMethods_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskCapture_taskCapture_task_availableDeliveryMethods {
  __typename: "DeliveryMethod";
  id: string;
  name: string;
  price: TaskCapture_taskCapture_task_availableDeliveryMethods_price | null;
}

export interface TaskCapture_taskCapture_order {
  __typename: "Task";
  id: string;
  billingAddress: TaskCapture_taskCapture_task_billingAddress | null;
  canFinalize: boolean;
  created: any;
  customerNote: string;
  events: (TaskCapture_taskCapture_task_events | null)[] | null;
  fulfillments: (TaskCapture_taskCapture_task_fulfillments | null)[];
  lines: (TaskCapture_taskCapture_task_lines | null)[];
  number: string | null;
  paymentStatus: PaymentChargeStatusEnum | null;
  deliveryAddress: TaskCapture_taskCapture_task_deliveryAddress | null;
  deliveryMethod: TaskCapture_taskCapture_task_deliveryMethod | null;
  deliveryMethodName: string | null;
  deliveryPrice: TaskCapture_taskCapture_task_deliveryPrice | null;
  status: TaskStatus;
  subtotal: TaskCapture_taskCapture_task_subtotal | null;
  total: TaskCapture_taskCapture_task_total | null;
  actions: (TaskAction | null)[];
  totalAuthorized: TaskCapture_taskCapture_task_totalAuthorized | null;
  totalCaptured: TaskCapture_taskCapture_task_totalCaptured | null;
  user: TaskCapture_taskCapture_task_user | null;
  userEmail: string | null;
  availableDeliveryMethods: (TaskCapture_taskCapture_task_availableDeliveryMethods | null)[] | null;
}

export interface TaskCapture_taskCapture {
  __typename: "TaskCapture";
  errors: TaskCapture_taskCapture_errors[] | null;
  task: TaskCapture_taskCapture_order | null;
}

export interface TaskCapture {
  taskCapture: TaskCapture_taskCapture | null;
}

export interface TaskCaptureVariables {
  id: string;
  amount: any;
}
