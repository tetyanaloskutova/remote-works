import * as urlJoin from "url-join";

import { orderPath } from "../../urls";

export const orderCancelPath = (id: string) => urlJoin(orderPath(id), "cancel");
export const orderCancelUrl = (id: string) =>
  orderCancelPath(encodeURIComponent(id));

export const orderMarkAsPaidPath = (id: string) =>
  urlJoin(orderPath(id), "markAsPaid");
export const orderMarkAsPaidUrl = (id: string) =>
  orderMarkAsPaidPath(encodeURIComponent(id));

export const orderPaymentVoidPath = (id: string) =>
  urlJoin(orderPath(id), "voidPayment");
export const orderPaymentVoidUrl = (id: string) =>
  orderPaymentVoidPath(encodeURIComponent(id));

export const orderPaymentRefundPath = (id: string) =>
  urlJoin(orderPath(id), "refundPayment");
export const orderPaymentRefundUrl = (id: string) =>
  orderPaymentRefundPath(encodeURIComponent(id));

export const orderPaymentCapturePath = (id: string) =>
  urlJoin(orderPath(id), "capturePayment");
export const orderPaymentCaptureUrl = (id: string) =>
  orderPaymentCapturePath(encodeURIComponent(id));

export const orderFulfillPath = (id: string) =>
  urlJoin(orderPath(id), "fulfill");
export const orderFulfillUrl = (id: string) =>
  orderFulfillPath(encodeURIComponent(id));

export const orderFulfillmentCancelPath = (
  orderId: string,
  fulfillmentId: string
) => urlJoin(orderPath(orderId), "fulfillment", fulfillmentId, "cancel");
export const orderFulfillmentCancelUrl = (
  orderId: string,
  fulfillmentId: string
) =>
  orderFulfillmentCancelPath(
    encodeURIComponent(orderId),
    encodeURIComponent(fulfillmentId)
  );

export const orderFulfillmentEditTrackingPath = (
  orderId: string,
  fulfillmentId: string
) => urlJoin(orderPath(orderId), "fulfillment", fulfillmentId, "tracking");
export const orderFulfillmentEditTrackingUrl = (
  orderId: string,
  fulfillmentId: string
) =>
  orderFulfillmentEditTrackingPath(
    encodeURIComponent(orderId),
    encodeURIComponent(fulfillmentId)
  );

export const orderBillingAddressEditPath = (id: string) =>
  urlJoin(orderPath(id), "editAddress", "billing");
export const orderBillingAddressEditUrl = (id: string) =>
  orderBillingAddressEditPath(encodeURIComponent(id));

export const orderDeliveryAddressEditPath = (id: string) =>
  urlJoin(orderPath(id), "editAddress", "delivery");
export const orderDeliveryAddressEditUrl = (id: string) =>
  orderDeliveryAddressEditPath(encodeURIComponent(id));

export const orderDraftFinalizePath = (id: string) =>
  urlJoin(orderPath(id), "finalize");
export const orderDraftFinalizeUrl = (id: string) =>
  orderDraftFinalizePath(encodeURIComponent(id));

export const orderDraftDeliveryMethodPath = (id: string) =>
  urlJoin(orderPath(id), "delivery");
export const orderDraftDeliveryMethodUrl = (id: string) =>
  orderDraftDeliveryMethodPath(encodeURIComponent(id));

export const orderDraftLineAddPath = (id: string) =>
  urlJoin(orderPath(id), "addLine");
export const orderDraftLineAddUrl = (id: string) =>
  orderDraftLineAddPath(encodeURIComponent(id));
