import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import * as React from "react";

import { CardMenu } from "../../../components/CardMenu/CardMenu";
import CardTitle from "../../../components/CardTitle";
import Money from "../../../components/Money";
import Skeleton from "../../../components/Skeleton";
import StatusLabel from "../../../components/StatusLabel/StatusLabel";
import TableCellAvatar from "../../../components/TableCellAvatar";
import i18n from "../../../i18n";
import { maybe, renderCollection } from "../../../misc";
import { FulfillmentStatus } from "../../../types/globalTypes";
import { TaskDetails_task_fulfillments } from "../../types/TaskDetails";

const styles = (theme: Theme) =>
  createStyles({
    clickableRow: {
      cursor: "pointer"
    },
    orderNumber: {
      display: "inline",
      marginLeft: theme.spacing.unit
    },
    statusBar: {
      paddingTop: 0
    },
    textCenter: {
      textAlign: "center"
    },
    textRight: {
      textAlign: "right"
    },
    wideCell: {
      width: "50%"
    }
  });

interface TaskFulfillmentProps extends WithStyles<typeof styles> {
  fulfillment: TaskDetails_task_fulfillments;
  orderNumber: string;
  onTaskFulfillmentCancel: () => void;
  onTrackingCodeAdd: () => void;
}

const TaskFulfillment = withStyles(styles, { name: "TaskFulfillment" })(
  ({
    classes,
    fulfillment,
    orderNumber,
    onTaskFulfillmentCancel,
    onTrackingCodeAdd
  }: TaskFulfillmentProps) => {
    const lines = maybe(() => fulfillment.lines);
    const status = maybe(() => fulfillment.status);
    return (
      <Card>
        <CardTitle
          title={
            !!lines ? (
              <StatusLabel
                label={
                  <>
                    {status === FulfillmentStatus.FULFILLED
                      ? i18n.t("Fulfilled ({{ quantity }})", {
                          quantity: lines
                            .map(line => line.quantity)
                            .reduce((prev, curr) => prev + curr, 0)
                        })
                      : i18n.t("Cancelled ({{ quantity }})", {
                          quantity: lines
                            .map(line => line.quantity)
                            .reduce((prev, curr) => prev + curr, 0)
                        })}
                    <Typography className={classes.orderNumber} variant="body1">
                      {maybe(
                        () => `#${orderNumber}-${fulfillment.fulfillmentTask}`
                      )}
                    </Typography>
                  </>
                }
                status={
                  status === FulfillmentStatus.FULFILLED ? "success" : "error"
                }
              />
            ) : (
              <Skeleton />
            )
          }
          toolbar={
            maybe(() => fulfillment.status) === FulfillmentStatus.FULFILLED && (
              <CardMenu
                menuItems={[
                  {
                    label: i18n.t("Cancel shipment", {
                      context: "button"
                    }),
                    onSelect: onTaskFulfillmentCancel
                  }
                ]}
              />
            )
          }
        />
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className={classes.wideCell} colSpan={2}>
                {i18n.t("Skill")}
              </TableCell>
              <TableCell className={classes.textCenter}>
                {i18n.t("Quantity")}
              </TableCell>
              <TableCell className={classes.textRight}>
                {i18n.t("Price")}
              </TableCell>
              <TableCell className={classes.textRight}>
                {i18n.t("Total")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {renderCollection(lines, line => (
              <TableRow
                className={!!line ? classes.clickableRow : undefined}
                hover={!!line}
                key={maybe(() => line.id)}
              >
                <TableCellAvatar
                  thumbnail={maybe(() => line.taskLine.thumbnailUrl)}
                />
                <TableCell>
                  {maybe(() => line.taskLine.skillName) || <Skeleton />}
                </TableCell>
                <TableCell className={classes.textCenter}>
                  {maybe(() => line.quantity) || <Skeleton />}
                </TableCell>
                <TableCell className={classes.textRight}>
                  {maybe(() => line.taskLine.unitPrice.gross) ? (
                    <Money money={line.taskLine.unitPrice.gross} />
                  ) : (
                    <Skeleton />
                  )}
                </TableCell>
                <TableCell className={classes.textRight}>
                  {maybe(
                    () => line.quantity * line.taskLine.unitPrice.gross.amount
                  ) ? (
                    <Money
                      money={{
                        amount:
                          line.quantity * line.taskLine.unitPrice.gross.amount,
                        currency: line.taskLine.unitPrice.gross.currency
                      }}
                    />
                  ) : (
                    <Skeleton />
                  )}
                </TableCell>
              </TableRow>
            ))}
            {maybe(() => fulfillment.trackingNumber) && (
              <TableRow>
                <TableCell colSpan={4}>
                  {i18n.t("Tracking Number: {{ trackingNumber }}", {
                    trackingNumber: fulfillment.trackingNumber
                  })}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {status === FulfillmentStatus.FULFILLED && !fulfillment.trackingNumber && (
          <CardActions>
            <Button color="secondary" onClick={onTrackingCodeAdd}>
              {i18n.t("Add tracking")}
            </Button>
          </CardActions>
        )}
      </Card>
    );
  }
);
TaskFulfillment.displayName = "TaskFulfillment";
export default TaskFulfillment;
