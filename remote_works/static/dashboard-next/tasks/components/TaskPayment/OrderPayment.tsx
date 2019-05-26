import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import * as React from "react";

import CardTitle from "../../../components/CardTitle";
import { Hr } from "../../../components/Hr";
import Money, { subtractMoney } from "../../../components/Money";
import Skeleton from "../../../components/Skeleton";
import StatusLabel from "../../../components/StatusLabel";
import i18n from "../../../i18n";
import { maybe, transformPaymentStatus } from "../../../misc";
import { TaskAction, TaskStatus } from "../../../types/globalTypes";
import { TaskDetails_order } from "../../types/TaskDetails";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      ...theme.typography.body1,
      lineHeight: 1.9,
      width: "100%"
    },
    textRight: {
      textAlign: "right"
    },
    totalRow: {
      fontWeight: 600
    }
  });

interface TaskPaymentProps extends WithStyles<typeof styles> {
  task: TaskDetails_order;
  onCapture: () => void;
  onMarkAsPaid: () => void;
  onRefund: () => void;
  onVoid: () => void;
}

const TaskPayment = withStyles(styles, { name: "TaskPayment" })(
  ({
    classes,
    task,
    onCapture,
    onMarkAsPaid,
    onRefund,
    onVoid
  }: TaskPaymentProps) => {
    const canCapture = maybe(() => task.actions, []).includes(
      TaskAction.CAPTURE
    );
    const canVoid = maybe(() => task.actions, []).includes(TaskAction.VOID);
    const canRefund = maybe(() => task.actions, []).includes(
      TaskAction.REFUND
    );
    const canMarkAsPaid = maybe(() => task.actions, []).includes(
      TaskAction.MARK_AS_PAID
    );
    const payment = transformPaymentStatus(maybe(() => task.paymentStatus));
    return (
      <Card>
        <CardTitle
          title={
            maybe(() => task.paymentStatus) === undefined ? (
              <Skeleton />
            ) : (
              <StatusLabel label={payment.localized} status={payment.status} />
            )
          }
        />
        <CardContent>
          <table className={classes.root}>
            <tbody>
              <tr>
                <td>{i18n.t("Subtotal")}</td>
                <td>
                  {maybe(() => task.lines) === undefined ? (
                    <Skeleton />
                  ) : (
                    i18n.t("{{ quantity }} items", {
                      quantity: task.lines
                        .map(line => line.quantity)
                        .reduce((curr, prev) => prev + curr, 0)
                    })
                  )}
                </td>
                <td className={classes.textRight}>
                  {maybe(() => task.subtotal.gross) === undefined ? (
                    <Skeleton />
                  ) : (
                    <Money money={task.subtotal.gross} />
                  )}
                </td>
              </tr>
              <tr>
                <td>{i18n.t("Taxes")}</td>
                <td>
                  {maybe(() => task.total.tax) === undefined ? (
                    <Skeleton />
                  ) : task.total.tax.amount > 0 ? (
                    i18n.t("VAT included")
                  ) : (
                    i18n.t("does not apply")
                  )}
                </td>
                <td className={classes.textRight}>
                  {maybe(() => task.total.tax) === undefined ? (
                    <Skeleton />
                  ) : (
                    <Money money={task.total.tax} />
                  )}
                </td>
              </tr>
              <tr>
                <td>{i18n.t("Delivery")}</td>
                <td>
                  {maybe(() => task.deliveryMethodName) === undefined &&
                  maybe(() => task.deliveryPrice) === undefined ? (
                    <Skeleton />
                  ) : task.deliveryMethodName === null ? (
                    i18n.t("does not apply")
                  ) : (
                    task.deliveryMethodName
                  )}
                </td>
                <td className={classes.textRight}>
                  {maybe(() => task.deliveryPrice.gross) === undefined ? (
                    <Skeleton />
                  ) : (
                    <Money money={task.deliveryPrice.gross} />
                  )}
                </td>
              </tr>
              <tr className={classes.totalRow}>
                <td>{i18n.t("Total")}</td>
                <td />
                <td className={classes.textRight}>
                  {maybe(() => task.total.gross) === undefined ? (
                    <Skeleton />
                  ) : (
                    <Money money={task.total.gross} />
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </CardContent>
        <Hr />
        <CardContent>
          <table className={classes.root}>
            <tbody>
              <tr>
                <td>{i18n.t("Preauthorized amount")}</td>
                <td className={classes.textRight}>
                  {maybe(() => task.totalAuthorized.amount) === undefined ? (
                    <Skeleton />
                  ) : (
                    <Money money={task.totalAuthorized} />
                  )}
                </td>
              </tr>
              <tr>
                <td>{i18n.t("Captured amount")}</td>
                <td className={classes.textRight}>
                  {maybe(() => task.totalCaptured.amount) === undefined ? (
                    <Skeleton />
                  ) : (
                    <Money money={task.totalCaptured} />
                  )}
                </td>
              </tr>
              <tr className={classes.totalRow}>
                <td>{i18n.t("Balance")}</td>
                <td className={classes.textRight}>
                  {maybe(
                    () => task.total.gross.amount && task.totalCaptured.amount
                  ) === undefined ? (
                    <Skeleton />
                  ) : (
                    <Money
                      money={subtractMoney(
                        task.totalCaptured,
                        task.total.gross
                      )}
                    />
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </CardContent>
        {maybe(() => task.status) !== TaskStatus.CANCELED &&
          (canCapture || canRefund || canVoid || canMarkAsPaid) && (
            <>
              <Hr />
              <CardActions>
                {canCapture && (
                  <Button color="secondary" variant="text" onClick={onCapture}>
                    {i18n.t("Capture", { context: "button" })}
                  </Button>
                )}
                {canRefund && (
                  <Button color="secondary" variant="text" onClick={onRefund}>
                    {i18n.t("Refund", { context: "button" })}
                  </Button>
                )}
                {canVoid && (
                  <Button color="secondary" variant="text" onClick={onVoid}>
                    {i18n.t("Void", { context: "button" })}
                  </Button>
                )}
                {canMarkAsPaid && (
                  <Button
                    color="secondary"
                    variant="text"
                    onClick={onMarkAsPaid}
                  >
                    {i18n.t("Mark as paid", { context: "button" })}
                  </Button>
                )}
              </CardActions>
            </>
          )}
      </Card>
    );
  }
);
TaskPayment.displayName = "TaskPayment";
export default TaskPayment;
