/* tslint:disable */
// This file was automatically generated and should not be edited.

import { TaskUpdateInput } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: TaskUpdate
// ====================================================

export interface TaskUpdate_orderUpdate_errors {
  __typename: "Error";
  field: string | null;
  message: string | null;
}

export interface TaskUpdate_orderUpdate_task_billingAddress_country {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface TaskUpdate_orderUpdate_task_billingAddress {
  __typename: "Address";
  city: string;
  cityArea: string;
  companyName: string;
  country: TaskUpdate_orderUpdate_task_billingAddress_country;
  countryArea: string;
  firstName: string;
  id: string;
  lastName: string;
  phone: string | null;
  postalCode: string;
  streetAddress1: string;
  streetAddress2: string;
}

export interface TaskUpdate_orderUpdate_task_deliveryAddress_country {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface TaskUpdate_orderUpdate_task_deliveryAddress {
  __typename: "Address";
  city: string;
  cityArea: string;
  companyName: string;
  country: TaskUpdate_orderUpdate_task_deliveryAddress_country;
  countryArea: string;
  firstName: string;
  id: string;
  lastName: string;
  phone: string | null;
  postalCode: string;
  streetAddress1: string;
  streetAddress2: string;
}

export interface TaskUpdate_orderUpdate_order {
  __typename: "Task";
  id: string;
  userEmail: string | null;
  billingAddress: TaskUpdate_orderUpdate_task_billingAddress | null;
  deliveryAddress: TaskUpdate_orderUpdate_task_deliveryAddress | null;
}

export interface TaskUpdate_orderUpdate {
  __typename: "TaskUpdate";
  errors: TaskUpdate_orderUpdate_errors[] | null;
  task: TaskUpdate_orderUpdate_order | null;
}

export interface TaskUpdate {
  orderUpdate: TaskUpdate_orderUpdate | null;
}

export interface TaskUpdateVariables {
  id: string;
  input: TaskUpdateInput;
}
