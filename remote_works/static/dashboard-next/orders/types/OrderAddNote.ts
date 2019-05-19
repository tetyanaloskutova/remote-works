/* tslint:disable */
// This file was automatically generated and should not be edited.

import { TaskAddNoteInput, TaskEventsEmails, TaskEvents } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: TaskAddNote
// ====================================================

export interface TaskAddNote_orderAddNote_errors {
  __typename: "Error";
  field: string | null;
  message: string | null;
}

export interface TaskAddNote_orderAddNote_order_events_user {
  __typename: "User";
  email: string;
}

export interface TaskAddNote_orderAddNote_order_events {
  __typename: "TaskEvent";
  id: string;
  amount: number | null;
  date: any | null;
  email: string | null;
  emailType: TaskEventsEmails | null;
  message: string | null;
  quantity: number | null;
  type: TaskEvents | null;
  user: TaskAddNote_orderAddNote_order_events_user | null;
}

export interface TaskAddNote_orderAddNote_order {
  __typename: "Task";
  id: string;
  events: (TaskAddNote_orderAddNote_order_events | null)[] | null;
}

export interface TaskAddNote_orderAddNote {
  __typename: "TaskAddNote";
  errors: TaskAddNote_orderAddNote_errors[] | null;
  task: TaskAddNote_orderAddNote_order | null;
}

export interface TaskAddNote {
  orderAddNote: TaskAddNote_orderAddNote | null;
}

export interface TaskAddNoteVariables {
  task: string;
  input: TaskAddNoteInput;
}
