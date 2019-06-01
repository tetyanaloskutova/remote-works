import * as urlJoin from "url-join";

import { taskPath } from "../../urls";

export const taskCancelPath = (id: string) => urlJoin(taskPath(id), "cancel");
export const taskCancelUrl = (id: string) =>
  taskCancelPath(encodeURIComponent(id));

export const taskMarkAsPaidPath = (id: string) =>
  urlJoin(taskPath(id), "markAsPaid");
export const taskMarkAsPaidUrl = (id: string) =>
  taskMarkAsPaidPath(encodeURIComponent(id));

export const taskPaymentVoidPath = (id: string) =>
  urlJoin(taskPath(id), "voidPayment");
export const taskPaymentVoidUrl = (id: string) =>
  taskPaymentVoidPath(encodeURIComponent(id));

export const taskPaymentRefundPath = (id: string) =>
  urlJoin(taskPath(id), "refundPayment");
export const taskPaymentRefundUrl = (id: string) =>
  taskPaymentRefundPath(encodeURIComponent(id));

export const taskPaymentCapturePath = (id: string) =>
  urlJoin(taskPath(id), "capturePayment");
export const taskPaymentCaptureUrl = (id: string) =>
  taskPaymentCapturePath(encodeURIComponent(id));

export const taskFulfillPath = (id: string) =>
  urlJoin(taskPath(id), "fulfill");
export const taskFulfillUrl = (id: string) =>
  taskFulfillPath(encodeURIComponent(id));

export const taskFulfillmentCancelPath = (
  taskId: string,
  fulfillmentId: string
) => urlJoin(taskPath(taskId), "fulfillment", fulfillmentId, "cancel");
export const taskFulfillmentCancelUrl = (
  taskId: string,
  fulfillmentId: string
) =>
  taskFulfillmentCancelPath(
    encodeURIComponent(taskId),
    encodeURIComponent(fulfillmentId)
  );

export const taskFulfillmentEditTrackingPath = (
  taskId: string,
  fulfillmentId: string
) => urlJoin(taskPath(taskId), "fulfillment", fulfillmentId, "tracking");
export const taskFulfillmentEditTrackingUrl = (
  taskId: string,
  fulfillmentId: string
) =>
  taskFulfillmentEditTrackingPath(
    encodeURIComponent(taskId),
    encodeURIComponent(fulfillmentId)
  );

export const taskBillingAddressEditPath = (id: string) =>
  urlJoin(taskPath(id), "editAddress", "billing");
export const taskBillingAddressEditUrl = (id: string) =>
  taskBillingAddressEditPath(encodeURIComponent(id));

export const taskDeliveryAddressEditPath = (id: string) =>
  urlJoin(taskPath(id), "editAddress", "delivery");
export const taskDeliveryAddressEditUrl = (id: string) =>
  taskDeliveryAddressEditPath(encodeURIComponent(id));

export const taskDraftFinalizePath = (id: string) =>
  urlJoin(taskPath(id), "finalize");
export const taskDraftFinalizeUrl = (id: string) =>
  taskDraftFinalizePath(encodeURIComponent(id));

export const taskDraftDeliveryMethodPath = (id: string) =>
  urlJoin(taskPath(id), "delivery");
export const taskDraftDeliveryMethodUrl = (id: string) =>
  taskDraftDeliveryMethodPath(encodeURIComponent(id));

export const taskDraftLineAddPath = (id: string) =>
  urlJoin(taskPath(id), "addLine");
export const taskDraftLineAddUrl = (id: string) =>
  taskDraftLineAddPath(encodeURIComponent(id));
