import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import * as React from "react";

import Form from "../../../components/Form";
import PageHeader from "../../../components/PageHeader";
import Skeleton from "../../../components/Skeleton";
import {
  Timeline,
  TimelineAddNote,
  TimelineEvent,
  TimelineNote
} from "../../../components/Timeline";
import i18n from "../../../i18n";
import { TaskEvents, TaskEventsEmails } from "../../../types/globalTypes";
import { TaskDetails_task_events } from "../../types/TaskDetails";

export interface FormData {
  message: string;
}

const getEventMessage = (event: TaskDetails_task_events) => {
  switch (event.type) {
    case TaskEvents.CANCELED:
      return i18n.t("Task has been cancelled", {
        context: "task history message"
      });
    case TaskEvents.EMAIL_SENT:
      switch (event.emailType) {
        case TaskEventsEmails.FULFILLMENT:
          return i18n.t("Fulfillment confirmation has been sent to customer", {
            context: "task history message"
          });
        case TaskEventsEmails.TASK:
          return i18n.t("Task confirmation has been sent to customer", {
            context: "task history message"
          });
        case TaskEventsEmails.PAYMENT:
          return i18n.t("Payment confirmation has been sent to customer", {
            context: "task history message"
          });
        case TaskEventsEmails.DELIVERY:
          return i18n.t("Delivery details has been sent to customer", {
            context: "task history message"
          });
      }
    case TaskEvents.FULFILLMENT_CANCELED:
      return i18n.t("Fulfillment has been cancelled", {
        context: "task history message"
      });
    case TaskEvents.FULFILLMENT_FULFILLED_ITEMS:
      return i18n.t("Fulfilled {{ quantity }} items", {
        context: "task history message",
        quantity: event.quantity
      });
    case TaskEvents.FULFILLMENT_REAVAILED_ITEMS:
      return i18n.t("Reavailed {{ quantity }} items", {
        context: "task history message",
        quantity: event.quantity
      });
    case TaskEvents.TASK_FULLY_PAID:
      return i18n.t("Task has been fully paid", {
        context: "task history message"
      });
    case TaskEvents.TASK_MARKED_AS_PAID:
      return i18n.t("Marked task as paid", {
        context: "task history message"
      });
    case TaskEvents.OTHER:
      return event.message;
    case TaskEvents.OVERSOLD_ITEMS:
      return i18n.t("Oversold {{ quantity }} items", {
        context: "task history message",
        quantity: event.quantity
      });
    case TaskEvents.PAYMENT_CAPTURED:
      return i18n.t("Payment has been captured", {
        context: "task history message"
      });
    case TaskEvents.PAYMENT_REFUNDED:
      return i18n.t("Payment has been refunded", {
        context: "task history message"
      });
    case TaskEvents.PAYMENT_VOIDED:
      return i18n.t("Payment has been voided", {
        context: "task history message"
      });
    case TaskEvents.PLACED:
      return i18n.t("Task has been placed", {
        context: "task history message"
      });
    case TaskEvents.PLACED_FROM_DRAFT:
      return i18n.t("Task has been created from draft", {
        context: "task history message"
      });
    case TaskEvents.TRACKING_UPDATED:
      return i18n.t("Updated fulfillment group's tracking number", {
        context: "task history message"
      });
    case TaskEvents.UPDATED:
      return i18n.t("Task has been updated", {
        context: "task history message"
      });
  }
};

const styles = (theme: Theme) =>
  createStyles({
    root: { marginTop: theme.spacing.unit * 2 },
    user: {
      marginBottom: theme.spacing.unit
    }
  });

interface TaskHistoryProps extends WithStyles<typeof styles> {
  history: TaskDetails_task_events[];
  onNoteAdd: (data: FormData) => void;
}

const TaskHistory = withStyles(styles, { name: "TaskHistory" })(
  ({ classes, history, onNoteAdd }: TaskHistoryProps) => (
    <div className={classes.root}>
      <PageHeader
        title={i18n.t("Task timeline", {
          context: "section name"
        })}
      />
      {history ? (
        <Timeline>
          <Form initial={{ message: "" }} onSubmit={onNoteAdd}>
            {({ change, data, submit }) => (
              <TimelineAddNote
                message={data.message}
                onChange={change}
                onSubmit={submit}
              />
            )}
          </Form>
          {history
            .slice()
            .reverse()
            .map(event => {
              if (event.type === TaskEvents.NOTE_ADDED) {
                return (
                  <TimelineNote
                    date={event.date}
                    user={event.user}
                    message={event.message}
                    key={event.id}
                  />
                );
              }
              return (
                <TimelineEvent
                  date={event.date}
                  title={getEventMessage(event)}
                  key={event.id}
                />
              );
            })}
        </Timeline>
      ) : (
        <Skeleton />
      )}
    </div>
  )
);
TaskHistory.displayName = "TaskHistory";
export default TaskHistory;
