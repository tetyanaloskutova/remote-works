import i18n from "../../../i18n";
import { TaskEvents } from "../../../types/globalTypes";
import { Home_activities_edges_node } from "../../types/Home";

export const getActivityMessage = (activity: Home_activities_edges_node) => {
  switch (activity.type) {
    case TaskEvents.ORDER_FULLY_PAID:
      return i18n.t("Task #{{ orderId }} had been fully paid", {
        orderId: activity.orderNumber
      });
    case TaskEvents.PLACED:
      return i18n.t("Task #{{ orderId }} had been placed", {
        orderId: activity.orderNumber
      });
    case TaskEvents.PLACED_FROM_DRAFT:
      return i18n.t(
        "Task #{{ orderId }} had been placed from draft by {{ user }}",
        {
          orderId: activity.orderNumber,
          user: activity.user.email
        }
      );
    default:
      return activity.message;
  }
};
