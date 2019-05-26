import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import * as React from "react";

import { CardMenu } from "../../../components/CardMenu/CardMenu";
import { CardSpacer } from "../../../components/CardSpacer";
import { Container } from "../../../components/Container";
import { DateTime } from "../../../components/Date";
import Grid from "../../../components/Grid";
import PageHeader from "../../../components/PageHeader";
import Skeleton from "../../../components/Skeleton";
import i18n from "../../../i18n";
import { maybe, renderCollection } from "../../../misc";
import { TaskStatus } from "../../../types/globalTypes";
import { TaskDetails_order } from "../../types/TaskDetails";
import TaskCustomer from "../TaskCustomer";
import TaskCustomerNote from "../TaskCustomerNote";
import TaskFulfillment from "../TaskFulfillment";
import TaskHistory, { FormData as HistoryFormData } from "../TaskHistory";
import TaskPayment from "../TaskPayment/TaskPayment";
import TaskUnfulfilledItems from "../TaskUnfulfilledItems/TaskUnfulfilledItems";

const styles = (theme: Theme) =>
  createStyles({
    date: {
      marginBottom: theme.spacing.unit * 3,
      marginLeft: theme.spacing.unit * 7
    },
    header: {
      marginBottom: 0
    },
    menu: {
      marginRight: -theme.spacing.unit
    }
  });

export interface TaskDetailsPageProps extends WithStyles<typeof styles> {
  task: TaskDetails_order;
  deliveryMethods?: Array<{
    id: string;
    name: string;
  }>;
  countries?: Array<{
    code: string;
    label: string;
  }>;
  onBack();
  onBillingAddressEdit();
  onFulfillmentCancel(id: string);
  onFulfillmentTrackingNumberUpdate(id: string);
  onTaskFulfill();
  onSkillClick?(id: string);
  onPaymentCapture();
  onPaymentPaid();
  onPaymentRefund();
  onPaymentVoid();
  onDeliveryAddressEdit();
  onTaskCancel();
  onNoteAdd(data: HistoryFormData);
}

const TaskDetailsPage = withStyles(styles, { name: "TaskDetailsPage" })(
  ({
    classes,
    task,
    onTaskCancel,
    onBack,
    onBillingAddressEdit,
    onFulfillmentCancel,
    onFulfillmentTrackingNumberUpdate,
    onNoteAdd,
    onTaskFulfill,
    onPaymentCapture,
    onPaymentPaid,
    onPaymentRefund,
    onPaymentVoid,
    onDeliveryAddressEdit
  }: TaskDetailsPageProps) => {
    const canCancel = maybe(() => task.status) !== TaskStatus.CANCELED;
    const canEditAddresses = maybe(() => task.status) !== TaskStatus.CANCELED;
    const canFulfill = maybe(() => task.status) !== TaskStatus.CANCELED;
    const unfulfilled = maybe(() => task.lines, []).filter(
      line => line.quantityFulfilled < line.quantity
    );

    return (
      <Container width="md">
        <PageHeader
          className={classes.header}
          title={maybe(() => task.number) ? "#" + task.number : undefined}
          onBack={onBack}
        >
          {canCancel && (
            <CardMenu
              className={classes.menu}
              menuItems={[
                {
                  label: i18n.t("Cancel task", { context: "button" }),
                  onSelect: onTaskCancel
                }
              ]}
            />
          )}
        </PageHeader>
        <div className={classes.date}>
          {task && task.created ? (
            <Typography variant="caption">
              <DateTime date={task.created} />
            </Typography>
          ) : (
            <Skeleton style={{ width: "10em" }} />
          )}
        </div>
        <Grid>
          <div>
            {unfulfilled.length > 0 && (
              <TaskUnfulfilledItems
                canFulfill={canFulfill}
                lines={unfulfilled}
                onFulfill={onTaskFulfill}
              />
            )}
            {renderCollection(
              maybe(() => task.fulfillments),
              (fulfillment, fulfillmentIndex) => (
                <React.Fragment key={maybe(() => fulfillment.id, "loading")}>
                  {!(unfulfilled.length === 0 && fulfillmentIndex === 0) && (
                    <CardSpacer />
                  )}
                  <TaskFulfillment
                    fulfillment={fulfillment}
                    orderNumber={maybe(() => task.number)}
                    onTaskFulfillmentCancel={() =>
                      onFulfillmentCancel(fulfillment.id)
                    }
                    onTrackingCodeAdd={() =>
                      onFulfillmentTrackingNumberUpdate(fulfillment.id)
                    }
                  />
                </React.Fragment>
              )
            )}
            <CardSpacer />
            <TaskPayment
              task={task}
              onCapture={onPaymentCapture}
              onMarkAsPaid={onPaymentPaid}
              onRefund={onPaymentRefund}
              onVoid={onPaymentVoid}
            />
            <TaskHistory
              history={maybe(() => task.events)}
              onNoteAdd={onNoteAdd}
            />
          </div>
          <div>
            <TaskCustomer
              canEditAddresses={canEditAddresses}
              canEditCustomer={false}
              task={task}
              onBillingAddressEdit={onBillingAddressEdit}
              onDeliveryAddressEdit={onDeliveryAddressEdit}
            />
            <CardSpacer />
            <TaskCustomerNote note={maybe(() => task.customerNote)} />
          </div>
        </Grid>
      </Container>
    );
  }
);
TaskDetailsPage.displayName = "TaskDetailsPage";
export default TaskDetailsPage;
