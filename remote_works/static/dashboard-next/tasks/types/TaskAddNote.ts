/* tslint:disable */
// This file was automatically generated and should not be edited.

import { TaskAddNoteInput, TaskEventsEmails, TaskEvents } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: TaskAddNote
// ====================================================

export interface TaskAddNote_taskAddNote_errors {
  __typename: "Error";
  field: string | null;
  message: string | null;
}

export interface TaskAddNote_taskAddNote_task_events_user {
  __typename: "User";
  email: string;
}

export interface TaskAddNote_taskAddNote_task_events {
  __typename: "TaskEvent";
  id: string;
  amount: number | null;
  date: any | null;
  email: string | null;
  emailType: TaskEventsEmails | null;
  message: string | null;
  quantity: number | null;
  type: TaskEvents | null;
  user: TaskAddNote_taskAddNote_task_events_user | null;
}

export interface TaskAddNote_taskAddNote_task {
  __typename: "Task";
  id: string;
  events: (TaskAddNote_taskAddNote_task_events | null)[] | null;
}

export interface TaskAddNote_taskAddNote {
  __typename: "TaskAddNote";
  errors: TaskAddNote_taskAddNote_errors[] | null;
  task: TaskAddNote_taskAddNote_task | null;
}

export interface TaskAddNote {
  taskAddNote: TaskAddNote_taskAddNote | null;
}

export interface TaskAddNoteVariables {
  task: string;
  input: TaskAddNoteInput;
}
