import Card from "@material-ui/core/Card";
import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import * as React from "react";

import Skeleton from "../../../components/Skeleton";
import TablePagination from "../../../components/TablePagination";
import i18n from "../../../i18n";
import { maybe, renderCollection, translatedTaxRates } from "../../../misc";
import { ListProps } from "../../../types";
import { SkillTypeList_skillTypes_edges_node } from "../../types/SkillTypeList";

const styles = createStyles({
  leftText: {
    textAlign: "left"
  },
  link: {
    cursor: "pointer"
  },
  wideCell: {
    width: "60%"
  }
});

interface SkillTypeListProps extends ListProps, WithStyles<typeof styles> {
  skillTypes: SkillTypeList_skillTypes_edges_node[];
}

const SkillTypeList = withStyles(styles, { name: "SkillTypeList" })(
  ({
    classes,
    disabled,
    skillTypes,
    pageInfo,
    onNextPage,
    onPreviousPage,
    onRowClick
  }: SkillTypeListProps) => (
    <Card>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell className={classes.wideCell}>
              {i18n.t("Type Name", { context: "table header" })}
            </TableCell>
            <TableCell className={classes.leftText}>
              {i18n.t("Type", { context: "table header" })}
            </TableCell>
            <TableCell className={classes.leftText}>
              {i18n.t("Tax", { context: "table header" })}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableFooter>
          <TableRow>
            <TablePagination
              colSpan={3}
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
            skillTypes,
            skillType => (
              <TableRow
                className={!!skillType ? classes.link : undefined}
                hover={!!skillType}
                key={skillType ? skillType.id : "skeleton"}
              >
                <TableCell
                  onClick={skillType ? onRowClick(skillType.id) : undefined}
                >
                  {skillType ? (
                    <>
                      {skillType.name}
                      <Typography variant="caption">
                        {maybe(() => skillType.hasVariants)
                          ? i18n.t("Configurable", { context: "skill type" })
                          : i18n.t("Simple skill", {
                              context: "skill type"
                            })}
                      </Typography>
                    </>
                  ) : (
                    <Skeleton />
                  )}
                </TableCell>
                <TableCell className={classes.leftText}>
                  {maybe(() => skillType.isDeliveryRequired) !== undefined ? (
                    skillType.isDeliveryRequired ? (
                      <>{i18n.t("Physical", { context: "skill type" })}</>
                    ) : (
                      <>{i18n.t("Digital", { context: "skill type" })}</>
                    )
                  ) : (
                    <Skeleton />
                  )}
                </TableCell>
                <TableCell className={classes.leftText}>
                  {maybe(() => skillType.taxRate) ? (
                    translatedTaxRates()[skillType.taxRate]
                  ) : (
                    <Skeleton />
                  )}
                </TableCell>
              </TableRow>
            ),
            () => (
              <TableRow>
                <TableCell colSpan={3}>
                  {i18n.t("No skill types found")}
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </Card>
  )
);
SkillTypeList.displayName = "SkillTypeList";
export default SkillTypeList;
