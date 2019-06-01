/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: TaskLineFragment
// ====================================================

export interface TaskLineFragment_unitPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskLineFragment_unitPrice_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface TaskLineFragment_unitPrice {
  __typename: "TaxedMoney";
  gross: TaskLineFragment_unitPrice_gross;
  net: TaskLineFragment_unitPrice_net;
}

export interface TaskLineFragment {
  __typename: "TaskLine";
  id: string;
  isDeliveryRequired: boolean;
  productName: string;
  productSku: string;
  quantity: number;
  quantityFulfilled: number;
  unitPrice: TaskLineFragment_unitPrice | null;
  thumbnailUrl: string | null;
}
