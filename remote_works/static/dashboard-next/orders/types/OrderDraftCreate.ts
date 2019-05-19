/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: TaskDraftCreate
// ====================================================

export interface TaskDraftCreate_draftTaskCreate_errors {
  __typename: "Error";
  field: string | null;
  message: string | null;
}

export interface TaskDraftCreate_draftTaskCreate_order {
  __typename: "Task";
  id: string;
}

export interface TaskDraftCreate_draftTaskCreate {
  __typename: "DraftTaskCreate";
  errors: TaskDraftCreate_draftTaskCreate_errors[] | null;
  task: TaskDraftCreate_draftTaskCreate_order | null;
}

export interface TaskDraftCreate {
  draftTaskCreate: TaskDraftCreate_draftTaskCreate | null;
}
