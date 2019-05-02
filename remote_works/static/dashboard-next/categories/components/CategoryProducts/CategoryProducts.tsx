import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import * as React from "react";

import CardTitle from "../../../components/CardTitle";
import Skeleton from "../../../components/Skeleton";
import TableCellAvatar from "../../../components/TableCellAvatar";
import TablePagination from "../../../components/TablePagination";
import i18n from "../../../i18n";
import { renderCollection } from "../../../misc";

const styles = (theme: Theme) =>
  createStyles({
    link: {
      color: theme.palette.secondary.main,
      cursor: "pointer"
    },
    textLeft: {
      textAlign: "left"
    }
  });

interface SkillListProps extends WithStyles<typeof styles> {
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  products?: Array<{
    id: string;
    name: string;
    productType: {
      name: string;
    };
    thumbnailUrl: string;
  }>;
  onAddSkill?();
  onNextPage?();
  onPreviousPage?();
  onRowClick?(id: string): () => void;
}

export const SkillList = withStyles(styles, { name: "SkillList" })(
  ({
    classes,
    hasNextPage,
    hasPreviousPage,
    products,
    onAddSkill,
    onNextPage,
    onPreviousPage,
    onRowClick
  }: SkillListProps) => (
    <Card>
      <CardTitle
        title={i18n.t("Skills")}
        toolbar={
          <Button variant="text" color="secondary" onClick={onAddSkill}>
            {i18n.t("Add product")}
          </Button>
        }
      />
      <Table>
        <TableHead>
          <TableRow>
            {(products === undefined || products.length > 0) && <TableCell />}
            <TableCell className={classes.textLeft}>
              {i18n.t("Name", { context: "object" })}
            </TableCell>
            <TableCell>{i18n.t("Type", { context: "object" })}</TableCell>
          </TableRow>
        </TableHead>
        <TableFooter>
          <TableRow>
            <TablePagination
              colSpan={3}
              hasNextPage={hasNextPage}
              onNextPage={onNextPage}
              hasPreviousPage={hasPreviousPage}
              onPreviousPage={onPreviousPage}
            />
          </TableRow>
        </TableFooter>
        <TableBody>
          {renderCollection(
            products,
            product => (
              <TableRow key={product ? product.id : "skeleton"}>
                <TableCellAvatar thumbnail={product && product.thumbnailUrl} />
                <TableCell className={classes.textLeft}>
                  {product ? (
                    <span
                      onClick={onRowClick && onRowClick(product.id)}
                      className={classes.link}
                    >
                      {product.name}
                    </span>
                  ) : (
                    <Skeleton />
                  )}
                </TableCell>
                <TableCell>
                  {product && product.productType ? (
                    product.productType.name
                  ) : (
                    <Skeleton />
                  )}
                </TableCell>
              </TableRow>
            ),
            () => (
              <TableRow>
                <TableCell colSpan={3}>{i18n.t("No products found")}</TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </Card>
  )
);
SkillList.displayName = "CategorySkillList";
export default SkillList;
