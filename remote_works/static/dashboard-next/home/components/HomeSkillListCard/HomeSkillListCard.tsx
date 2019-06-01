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
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import * as classNames from "classnames";
import * as React from "react";

import CardTitle from "../../../components/CardTitle";
import Money from "../../../components/Money";
import Skeleton from "../../../components/Skeleton";
import TableCellAvatar from "../../../components/TableCellAvatar";
import i18n from "../../../i18n";
import { maybe, renderCollection } from "../../../misc";
import { Home_skillTopToday_edges_node } from "../../types/Home";

const styles = (theme: Theme) =>
  createStyles({
    avatarProps: {
      height: 64,
      width: 64
    },
    avatarSpacing: {
      paddingBottom: theme.spacing.unit * 2,
      paddingTop: theme.spacing.unit * 2
    },
    noSkills: {
      paddingBottom: 20,
      paddingTop: 20
    },
    tableRow: {
      cursor: "pointer"
    }
  });

interface HomeSkillListProps extends WithStyles<typeof styles> {
  topSkills: Home_skillTopToday_edges_node[];
  onRowClick: (skillId: string, variantId: string) => void;
}

export const HomeSkillList = withStyles(styles, { name: "HomeSkillList" })(
  ({ classes, topSkills, onRowClick }: HomeSkillListProps) => (
    <Card>
      <CardTitle title={i18n.t("Top skills")} />
      <Table>
        <TableBody>
          {renderCollection(
            topSkills,
            variant => (
              <TableRow
                key={variant ? variant.id : "skeleton"}
                hover={!!variant}
                className={classNames({
                  [classes.tableRow]: !!variant
                })}
                onClick={
                  !!variant
                    ? () => onRowClick(variant.skill.id, variant.id)
                    : undefined
                }
              >
                <TableCellAvatar
                  className={classes.avatarSpacing}
                  thumbnail={maybe(() => variant.skill.thumbnail.url)}
                  avatarProps={classes.avatarProps}
                />

                <TableCell>
                  {variant ? (
                    <>
                      <Typography color={"primary"}>
                        {variant.skill.name}
                      </Typography>
                      <Typography color={"textSecondary"}>
                        {maybe(() =>
                          variant.attributes
                            .map(attribute => attribute.value)
                            .sort((a, b) =>
                              a.sortTask > b.sortTask ? 1 : -1
                            )
                            .map(attribute => attribute.name)
                            .join(" / ")
                        )}
                      </Typography>
                      <Typography color={"textSecondary"}>
                        {i18n.t("{{ordersCount}} Tasks", {
                          ordersCount: variant.quantityTasked
                        })}
                      </Typography>
                    </>
                  ) : (
                    <Skeleton />
                  )}
                </TableCell>

                <TableCell>
                  <Typography align={"right"}>
                    {maybe(
                      () => (
                        <Money money={variant.revenue.gross} />
                      ),
                      <Skeleton />
                    )}
                  </Typography>
                </TableCell>
              </TableRow>
            ),
            () => (
              <TableRow>
                <TableCell className={classes.noSkills}>
                  <Typography>{i18n.t("No skills found")}</Typography>
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </Card>
  )
);

HomeSkillList.displayName = "HomeSkillList";
export default HomeSkillList;
