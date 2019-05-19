import IconButton from "@material-ui/core/IconButton";
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
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/Delete";
import * as React from "react";

import { DebounceForm } from "../../../components/DebounceForm";
import Form from "../../../components/Form";
import Money from "../../../components/Money";
import Skeleton from "../../../components/Skeleton";
import TableCellAvatar from "../../../components/TableCellAvatar";
import i18n from "../../../i18n";
import { maybe, renderCollection } from "../../../misc";
import { TaskDetails_order_lines } from "../../types/TaskDetails";

export interface FormData {
  quantity: number;
}

const styles = (theme: Theme) =>
  createStyles({
    iconCell: {
      "&:last-child": {
        paddingRight: 0
      },
      width: 48 + theme.spacing.unit / 2
    },
    quantityField: {
      "& input": {
        textAlign: "right"
      },
      width: 60
    },
    textRight: {
      textAlign: "right"
    }
  });

interface TaskDraftDetailsSkillsProps extends WithStyles<typeof styles> {
  lines: TaskDetails_order_lines[];
  onTaskLineChange: (id: string, data: FormData) => void;
  onTaskLineRemove: (id: string) => void;
}

const TaskDraftDetailsSkills = withStyles(styles, {
  name: "TaskDraftDetailsSkills"
})(
  ({
    classes,
    lines,
    onTaskLineChange,
    onTaskLineRemove
  }: TaskDraftDetailsSkillsProps) => (
    <Table>
      {maybe(() => !!lines.length) && (
        <TableHead>
          <TableRow>
            <TableCell colSpan={2}>
              {i18n.t("Skill", { context: "table header" })}
            </TableCell>
            <TableCell className={classes.textRight}>
              {i18n.t("Quantity", { context: "table header" })}
            </TableCell>
            <TableCell className={classes.textRight}>
              {i18n.t("Price", { context: "table header" })}
            </TableCell>
            <TableCell className={classes.textRight}>
              {i18n.t("Total", { context: "table header" })}
            </TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
      )}
      <TableBody>
        {maybe(() => lines.length) === 0 ? (
          <TableRow>
            <TableCell colSpan={5}>
              {i18n.t("No Skills added to Task")}
            </TableCell>
          </TableRow>
        ) : (
          renderCollection(lines, line => (
            <TableRow key={line ? line.id : "skeleton"}>
              <TableCellAvatar thumbnail={maybe(() => line.thumbnailUrl)} />
              <TableCell>
                {maybe(() => line.productName && line.productSku) ? (
                  <>
                    <Typography variant="body1">{line.productName}</Typography>
                    <Typography variant="caption">{line.productSku}</Typography>
                  </>
                ) : (
                  <Skeleton />
                )}
              </TableCell>
              <TableCell className={classes.textRight}>
                {maybe(() => line.quantity) ? (
                  <Form
                    initial={{ quantity: line.quantity }}
                    onSubmit={data => onTaskLineChange(line.id, data)}
                  >
                    {({ change, data, hasChanged, submit }) => (
                      <DebounceForm
                        change={change}
                        submit={hasChanged ? submit : undefined}
                        time={200}
                      >
                        {debounce => (
                          <TextField
                            className={classes.quantityField}
                            fullWidth
                            name="quantity"
                            type="number"
                            value={data.quantity}
                            onChange={debounce}
                          />
                        )}
                      </DebounceForm>
                    )}
                  </Form>
                ) : (
                  <Skeleton />
                )}
              </TableCell>
              <TableCell className={classes.textRight}>
                {maybe(() => line.unitPrice.net) ? (
                  <Money money={line.unitPrice.net} />
                ) : (
                  <Skeleton />
                )}
              </TableCell>
              <TableCell className={classes.textRight}>
                {maybe(() => line.unitPrice.net && line.quantity) ? (
                  <Money
                    money={{
                      amount: line.unitPrice.net.amount * line.quantity,
                      currency: line.unitPrice.net.currency
                    }}
                  />
                ) : (
                  <Skeleton />
                )}
              </TableCell>
              <TableCell className={classes.iconCell}>
                <IconButton onClick={() => onTaskLineRemove(line.id)}>
                  <DeleteIcon color="secondary" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
);
TaskDraftDetailsSkills.displayName = "TaskDraftDetailsSkills";
export default TaskDraftDetailsSkills;
