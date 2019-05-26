/* tslint:disable */
// This file was automatically generated and should not be edited.

import { TaskEventsEmails, TaskEvents } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: TaskEventFragment
// ====================================================

export interface TaskEventFragment_user {
  __typename: "User";
  email: string;
}

export interface TaskEventFragment {
  __typename: "TaskEvent";
  id: string;
  amount: number | null;
  date: any | null;
  email: string | null;
  emailType: TaskEventsEmails | null;
  message: string | null;
  quantity: number | null;
  type: TaskEvents | null;
  user: TaskEventFragment_user | null;
}
