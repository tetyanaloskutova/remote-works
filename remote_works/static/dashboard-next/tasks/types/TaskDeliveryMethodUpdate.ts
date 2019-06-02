/* tslint:disable */
// This file was automatically generated and should not be edited.

import { TaskUpdateDeliveryInput } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: TaskDeliveryMethodUpdate
// ====================================================

export interface TaskDeliveryMethodUpdate_taskUpdateDelivery_errors {
  __typename: "Error";
  field: string | null;
  message: string | null;
}

export interface TaskDeliveryMethodUpdate_taskUpdateDelivery_task_availableDeliveryMethods {
  __typename: "DeliveryMethod";
  id: string;
  name: string;
}

export interface TaskDeliveryMethodUpdate_taskUpdateDelivery_task_deliveryMethod_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskDeliveryMethodUpdate_taskUpdateDelivery_task_deliveryMethod {
  __typename: "DeliveryMethod";
  id: string;
  name: string;
  price: TaskDeliveryMethodUpdate_taskUpdateDelivery_task_deliveryMethod_price | null;
}

export interface TaskDeliveryMethodUpdate_taskUpdateDelivery_task_deliveryPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskDeliveryMethodUpdate_taskUpdateDelivery_task_deliveryPrice {
  __typename: "TaxedMoney";
  gross: TaskDeliveryMethodUpdate_taskUpdateDelivery_task_deliveryPrice_gross;
}

export interface TaskDeliveryMethodUpdate_taskUpdateDelivery_order {
  __typename: "Task";
  availableDeliveryMethods: (TaskDeliveryMethodUpdate_taskUpdateDelivery_task_availableDeliveryMethods | null)[] | null;
  id: string;
  deliveryMethod: TaskDeliveryMethodUpdate_taskUpdateDelivery_task_deliveryMethod | null;
  deliveryMethodName: string | null;
  deliveryPrice: TaskDeliveryMethodUpdate_taskUpdateDelivery_task_deliveryPrice | null;
}

export interface TaskDeliveryMethodUpdate_taskUpdateDelivery {
  __typename: "TaskUpdateDelivery";
  errors: TaskDeliveryMethodUpdate_taskUpdateDelivery_errors[] | null;
  task: TaskDeliveryMethodUpdate_taskUpdateDelivery_order | null;
}

export interface TaskDeliveryMethodUpdate {
  taskUpdateDelivery: TaskDeliveryMethodUpdate_taskUpdateDelivery | null;
}

export interface TaskDeliveryMethodUpdateVariables {
  id: string;
  input: TaskUpdateDeliveryInput;
}
