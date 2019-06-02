import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import * as React from "react";

import Link from "../../../components/Link";
import Money from "../../../components/Money";
import Skeleton from "../../../components/Skeleton";
import i18n from "../../../i18n";
import { maybe } from "../../../misc";
import { TaskDetails_task } from "../../types/TaskDetails";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      ...theme.typography.body1,
      lineHeight: 1.9,
      width: "100%"
    },
    textRight: {
      textAlign: "right"
    }
  });

interface TaskDraftDetailsSummaryProps extends WithStyles<typeof styles> {
  task: TaskDetails_task;
  onDeliveryMethodEdit: () => void;
}

const TaskDraftDetailsSummary = withStyles(styles, {
  name: "TaskDraftDetailsSummary"
})(
  ({ classes, task, onDeliveryMethodEdit }: TaskDraftDetailsSummaryProps) => (
    <table className={classes.root}>
      <tbody>
        <tr>
          {maybe(() => task.subtotal) ? (
            <>
              <td>{i18n.t("Subtotal")}</td>
              <td className={classes.textRight}>
                <Money money={task.subtotal.gross} />
              </td>
            </>
          ) : (
            <td colSpan={2}>
              <Skeleton />
            </td>
          )}
        </tr>
        <tr>
          {task &&
          task.deliveryMethod !== undefined &&
          task.deliveryMethodName !== undefined ? (
            task.deliveryMethod === null ? (
              task.availableDeliveryMethods &&
              task.availableDeliveryMethods.length > 0 ? (
                <td>
                  <Link onClick={onDeliveryMethodEdit}>
                    {i18n.t("Add delivery carrier")}
                  </Link>
                </td>
              ) : (
                <td>{i18n.t("No applicable delivery carriers")}</td>
              )
            ) : (
              <>
                <td>
                  <Link onClick={onDeliveryMethodEdit}>
                    {task.deliveryMethodName}
                  </Link>
                </td>
                <td className={classes.textRight}>
                  {maybe(() => task.deliveryPrice) ? (
                    <Money money={task.deliveryPrice.gross} />
                  ) : (
                    "---"
                  )}
                </td>
              </>
            )
          ) : (
            <td colSpan={2}>
              <Skeleton />
            </td>
          )}
        </tr>
        <tr>
          {maybe(() => task.total.tax) !== undefined ? (
            <>
              <td>{i18n.t("Taxes (VAT included)")}</td>
              <td className={classes.textRight}>
                <Money money={task.total.tax} />
              </td>
            </>
          ) : (
            <td colSpan={2}>
              <Skeleton />
            </td>
          )}
        </tr>
        <tr>
          {maybe(() => task.total.gross) !== undefined ? (
            <>
              <td>{i18n.t("Total")}</td>
              <td className={classes.textRight}>
                <Money money={task.total.gross} />
              </td>
            </>
          ) : (
            <td colSpan={2}>
              <Skeleton />
            </td>
          )}
        </tr>
      </tbody>
    </table>
  )
);
TaskDraftDetailsSummary.displayName = "TaskDraftDetailsSummary";
export default TaskDraftDetailsSummary;
