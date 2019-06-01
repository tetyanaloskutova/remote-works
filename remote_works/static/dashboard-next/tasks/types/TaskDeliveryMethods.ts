/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: TaskDeliveryMethods
// ====================================================

export interface TaskDeliveryMethods_deliveryZones_edges_node_deliveryMethods {
  __typename: "DeliveryMethod";
  id: string;
  name: string;
}

export interface TaskDeliveryMethods_deliveryZones_edges_node {
  __typename: "DeliveryZone";
  deliveryMethods: (TaskDeliveryMethods_deliveryZones_edges_node_deliveryMethods | null)[] | null;
}

export interface TaskDeliveryMethods_deliveryZones_edges {
  __typename: "DeliveryZoneCountableEdge";
  node: TaskDeliveryMethods_deliveryZones_edges_node;
}

export interface TaskDeliveryMethods_deliveryZones {
  __typename: "DeliveryZoneCountableConnection";
  edges: TaskDeliveryMethods_deliveryZones_edges[];
}

export interface TaskDeliveryMethods {
  deliveryZones: TaskDeliveryMethods_deliveryZones | null;
}
