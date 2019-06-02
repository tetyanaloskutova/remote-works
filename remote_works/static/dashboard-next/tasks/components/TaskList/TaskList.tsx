import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import * as React from "react";

import { DateTime } from "../../../components/Date";
import Money from "../../../components/Money";
import Skeleton from "../../../components/Skeleton";
import StatusLabel from "../../../components/StatusLabel";
import TablePagination from "../../../components/TablePagination";
import i18n from "../../../i18n";
import {
  maybe,
  renderCollection,
  transformTaskStatus,
  transformPaymentStatus
} from "../../../misc";
import { ListProps } from "../../../types";
import { TaskList_orders_edges_node } from "../../types/TaskList";

const styles = createStyles({
  link: {
    cursor: "pointer"
  },
  textRight: {
    textAlign: "right"
  }
});

interface TaskListProps extends ListProps, WithStyles<typeof styles> {
  tasks: TaskList_orders_edges_node[];
}

export const TaskList = withStyles(styles, { name: "TaskList" })(
  ({
    classes,
    disabled,
    tasks,
    pageInfo,
    onPreviousPage,
    onNextPage,
    onRowClick
  }: TaskListProps) => {
    const taskList = tasks
      ? tasks.map(task => ({
          ...task,
          paymentStatus: transformPaymentStatus(task.paymentStatus),
          status: transformTaskStatus(task.status)
        }))
      : undefined;
    return (
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
              {i18n.t("Customer", { context: "table header" })}
            </TableCell>
            <TableCell padding="dense">
              {i18n.t("Payment", { context: "table header" })}
            </TableCell>
            <TableCell padding="dense">
              {i18n.t("Fulfillment status", { context: "table header" })}
            </TableCell>
            <TableCell className={classes.textRight} padding="dense">
              {i18n.t("Total", { context: "table header" })}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableFooter>
          <TableRow>
            <TablePagination
              colSpan={6}
              hasNextPage={pageInfo && !disabled ? pageInfo.hasNextPage : false}
              onNextPage={onNextPage}
              hasPreviousPage={
                pageInfo && !disabled ? pageInfo.hasPreviousPage : false
              }
              onPreviousPage={onPreviousPage}
            />
          </TableRow>
        </TableFooter>
        <TableBody>
          {renderCollection(
            taskList,
            task => (
              <TableRow
                hover={!!task}
                className={!!task ? classes.link : undefined}
                onClick={task ? onRowClick(task.id) : undefined}
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
                  {maybe(() => task.billingAddress) ? (
                    <>
                      {task.billingAddress.firstName}
                      &nbsp;
                      {task.billingAddress.lastName}
                    </>
                  ) : maybe(() => task.userEmail) !== undefined ? (
                    task.userEmail
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
                <TableCell padding="dense">
                  {maybe(() => task.status) ? (
                    <StatusLabel
                      status={task.status.status}
                      label={task.status.localized}
                    />
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
    );
  }
);
TaskList.displayName = "TaskList";
export default TaskList;
