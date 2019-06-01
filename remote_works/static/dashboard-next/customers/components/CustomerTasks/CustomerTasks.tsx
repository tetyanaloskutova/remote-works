import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import * as React from "react";

import CardTitle from "../../../components/CardTitle";
import { DateTime } from "../../../components/Date";
import Money from "../../../components/Money";
import Skeleton from "../../../components/Skeleton";
import StatusLabel from "../../../components/StatusLabel";
import i18n from "../../../i18n";
import { maybe, renderCollection, transformPaymentStatus } from "../../../misc";
import { CustomerDetails_user_orders_edges_node } from "../../types/CustomerDetails";

const styles = createStyles({
  link: {
    cursor: "pointer"
  },
  textRight: {
    textAlign: "right"
  }
});

export interface CustomerTasksProps extends WithStyles<typeof styles> {
  tasks: CustomerDetails_user_orders_edges_node[];
  onViewAllTasksClick: () => void;
  onRowClick: (id: string) => void;
}

const CustomerTasks = withStyles(styles, { name: "CustomerTasks" })(
  ({
    classes,
    tasks,
    onRowClick,
    onViewAllTasksClick
  }: CustomerTasksProps) => {
    const orderList = tasks
      ? tasks.map(task => ({
          ...task,
          paymentStatus: transformPaymentStatus(task.paymentStatus)
        }))
      : undefined;
    return (
      <Card>
        <CardTitle
          title={i18n.t("Recent tasks")}
          toolbar={
            <Button
              variant="text"
              color="secondary"
              onClick={onViewAllTasksClick}
            >
              {i18n.t("View all tasks")}
            </Button>
          }
        />
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="dense">
                {i18n.t("No. of Task", { context: "table header" })}
              </TableCell>
              <TableCell padding="dense">
                {i18n.t("Date", { context: "table header" })}
              </TableCell>
              <TableCell padding="dense">
                {i18n.t("Status", { context: "table header" })}
              </TableCell>
              <TableCell className={classes.textRight} padding="dense">
                {i18n.t("Total", { context: "table header" })}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {renderCollection(
              orderList,
              task => (
                <TableRow
                  hover={!!task}
                  className={!!task ? classes.link : undefined}
                  onClick={task ? () => onRowClick(task.id) : undefined}
                  key={task ? task.id : "skeleton"}
                >
                  <TableCell padding="dense">
                    {maybe(() => task.number) ? (
                      "#" + task.number
                    ) : (
                      <Skeleton />
                    )}
                  </TableCell>
                  <TableCell padding="dense">
                    {maybe(() => task.created) ? (
                      <DateTime date={task.created} />
                    ) : (
                      <Skeleton />
                    )}
                  </TableCell>
                  <TableCell padding="dense">
                    {maybe(() => task.paymentStatus.status) !== undefined ? (
                      task.paymentStatus.status === null ? null : (
                        <StatusLabel
                          status={task.paymentStatus.status}
                          label={task.paymentStatus.localized}
                        />
                      )
                    ) : (
                      <Skeleton />
                    )}
                  </TableCell>
                  <TableCell className={classes.textRight} padding="dense">
                    {maybe(() => task.total.gross) ? (
                      <Money money={task.total.gross} />
                    ) : (
                      <Skeleton />
                    )}
                  </TableCell>
                </TableRow>
              ),
              () => (
                <TableRow>
                  <TableCell colSpan={6}>{i18n.t("No tasks found")}</TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </Card>
    );
  }
);
CustomerTasks.displayName = "CustomerTasks";
export default CustomerTasks;
