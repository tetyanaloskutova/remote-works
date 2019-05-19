import { Omit } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import * as placeholderImage from "../../../../images/placeholder60x60.png";
import TaskDetailsPage, {
  TaskDetailsPageProps
} from "../../../tasks/components/TaskDetailsPage";
import { countries, order as orderFixture } from "../../../tasks/fixtures";
import {
  FulfillmentStatus,
  TaskStatus,
  PaymentChargeStatusEnum
} from "../../../types/globalTypes";
import Decorator from "../../Decorator";

const order = orderFixture(placeholderImage);

const props: Omit<TaskDetailsPageProps, "classes"> = {
  countries,
  onBack: () => undefined,
  onBillingAddressEdit: undefined,
  onFulfillmentCancel: () => undefined,
  onFulfillmentTrackingNumberUpdate: () => undefined,
  onNoteAdd: undefined,
  onTaskCancel: undefined,
  onTaskFulfill: undefined,
  onPaymentCapture: undefined,
  onPaymentPaid: undefined,
  onPaymentRefund: undefined,
  onPaymentVoid: undefined,
  onSkillClick: undefined,
  onDeliveryAddressEdit: undefined,
  order
};

storiesOf("Views / Tasks / Task details", module)
  .addDecorator(Decorator)
  .add("default", () => <TaskDetailsPage {...props} />)
  .add("loading", () => <TaskDetailsPage {...props} order={undefined} />)
  .add("pending payment", () => (
    <TaskDetailsPage
      {...props}
      order={{
        ...props.order,
        paymentStatus: PaymentChargeStatusEnum.NOT_CHARGED
      }}
    />
  ))
  .add("payment error", () => (
    <TaskDetailsPage
      {...props}
      order={{
        ...props.order,
        paymentStatus: PaymentChargeStatusEnum.NOT_CHARGED
      }}
    />
  ))
  .add("payment confirmed", () => (
    <TaskDetailsPage
      {...props}
      order={{
        ...props.order,
        paymentStatus: PaymentChargeStatusEnum.FULLY_CHARGED
      }}
    />
  ))
  .add("no payment", () => (
    <TaskDetailsPage
      {...props}
      order={{
        ...props.order,
        paymentStatus: null
      }}
    />
  ))
  .add("refunded payment", () => (
    <TaskDetailsPage
      {...props}
      order={{
        ...props.order,
        paymentStatus: PaymentChargeStatusEnum.FULLY_REFUNDED
      }}
    />
  ))
  .add("rejected payment", () => (
    <TaskDetailsPage
      {...props}
      order={{
        ...props.order,
        paymentStatus: PaymentChargeStatusEnum.NOT_CHARGED
      }}
    />
  ))
  .add("cancelled", () => (
    <TaskDetailsPage
      {...props}
      order={{
        ...props.order,
        fulfillments: props.order.fulfillments.map(fulfillment => ({
          ...fulfillment,
          status: FulfillmentStatus.CANCELED
        })),
        status: TaskStatus.CANCELED
      }}
    />
  ))
  .add("fulfilled", () => (
    <TaskDetailsPage
      {...props}
      order={{
        ...props.order,
        status: TaskStatus.FULFILLED
      }}
    />
  ))
  .add("partially fulfilled", () => (
    <TaskDetailsPage
      {...props}
      order={{
        ...props.order,
        status: TaskStatus.PARTIALLY_FULFILLED
      }}
    />
  ))
  .add("unfulfilled", () => (
    <TaskDetailsPage
      {...props}
      order={{
        ...props.order,
        status: TaskStatus.UNFULFILLED
      }}
    />
  ))
  .add("no delivery address", () => (
    <TaskDetailsPage
      {...props}
      order={{
        ...props.order,
        deliveryAddress: null
      }}
    />
  ))
  .add("no customer note", () => (
    <TaskDetailsPage
      {...props}
      order={{
        ...props.order,
        customerNote: ""
      }}
    />
  ));
