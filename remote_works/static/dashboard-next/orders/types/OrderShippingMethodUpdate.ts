/* tslint:disable */
// This file was automatically generated and should not be edited.

import { TaskUpdateDeliveryInput } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: TaskDeliveryMethodUpdate
// ====================================================

export interface TaskDeliveryMethodUpdate_orderUpdateDelivery_errors {
  __typename: "Error";
  field: string | null;
  message: string | null;
}

export interface TaskDeliveryMethodUpdate_orderUpdateDelivery_order_availableDeliveryMethods {
  __typename: "DeliveryMethod";
  id: string;
  name: string;
}

export interface TaskDeliveryMethodUpdate_orderUpdateDelivery_order_deliveryMethod_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskDeliveryMethodUpdate_orderUpdateDelivery_order_deliveryMethod {
  __typename: "DeliveryMethod";
  id: string;
  name: string;
  price: TaskDeliveryMethodUpdate_orderUpdateDelivery_order_deliveryMethod_price | null;
}

export interface TaskDeliveryMethodUpdate_orderUpdateDelivery_order_deliveryPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskDeliveryMethodUpdate_orderUpdateDelivery_order_deliveryPrice {
  __typename: "TaxedMoney";
  gross: TaskDeliveryMethodUpdate_orderUpdateDelivery_order_deliveryPrice_gross;
}

export interface TaskDeliveryMethodUpdate_orderUpdateDelivery_order {
  __typename: "Task";
  availableDeliveryMethods: (TaskDeliveryMethodUpdate_orderUpdateDelivery_order_availableDeliveryMethods | null)[] | null;
  id: string;
  deliveryMethod: TaskDeliveryMethodUpdate_orderUpdateDelivery_order_deliveryMethod | null;
  deliveryMethodName: string | null;
  deliveryPrice: TaskDeliveryMethodUpdate_orderUpdateDelivery_order_deliveryPrice | null;
}

export interface TaskDeliveryMethodUpdate_orderUpdateDelivery {
  __typename: "TaskUpdateDelivery";
  errors: TaskDeliveryMethodUpdate_orderUpdateDelivery_errors[] | null;
  task: TaskDeliveryMethodUpdate_orderUpdateDelivery_order | null;
}

export interface TaskDeliveryMethodUpdate {
  orderUpdateDelivery: TaskDeliveryMethodUpdate_orderUpdateDelivery | null;
}

export interface TaskDeliveryMethodUpdateVariables {
  id: string;
  input: TaskUpdateDeliveryInput;
}
