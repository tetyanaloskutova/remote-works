import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
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
import DeleteIcon from "@material-ui/icons/Delete";
import * as React from "react";

import CardTitle from "../../../components/CardTitle";
import Skeleton from "../../../components/Skeleton";
import i18n from "../../../i18n";
import { maybe, renderCollection } from "../../../misc";
import { AttributeTypeEnum } from "../../../types/globalTypes";
import {
  SkillTypeDetails_skillType_skillAttributes,
  SkillTypeDetails_skillType_variantAttributes
} from "../../types/SkillTypeDetails";

const styles = (theme: Theme) =>
  createStyles({
    iconCell: {
      "&:last-child": {
        paddingRight: 0
      },
      width: 48 + theme.spacing.unit / 2
    },
    link: {
      cursor: "pointer"
    },
    textLeft: {
      textAlign: "left"
    }
  });

interface SkillTypeAttributesProps extends WithStyles<typeof styles> {
  attributes:
    | SkillTypeDetails_skillType_skillAttributes[]
    | SkillTypeDetails_skillType_variantAttributes[];
  type: AttributeTypeEnum;
  onAttributeAdd: (type: AttributeTypeEnum) => void;
  onAttributeDelete: (id: string, event: React.MouseEvent<any>) => void;
  onAttributeUpdate: (id: string) => void;
}

const SkillTypeAttributes = withStyles(styles, {
  name: "SkillTypeAttributes"
})(
  ({
    attributes,
    classes,
    type,
    onAttributeAdd,
    onAttributeDelete,
    onAttributeUpdate
  }: SkillTypeAttributesProps) => (
    <Card>
      <CardTitle
        title={
          type === AttributeTypeEnum.SKILL
            ? i18n.t("Skill Attributes")
            : i18n.t("Variant Attributes")
        }
        toolbar={
          <Button
            color="secondary"
            variant="text"
            onClick={() => onAttributeAdd(type)}
          >
            {i18n.t("Add attribute", { context: "button" })}
          </Button>
        }
      />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{i18n.t("Attribute name")}</TableCell>
            <TableCell className={classes.textLeft}>
              {i18n.t("Values")}
            </TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {renderCollection(
            attributes,
            attribute => (
              <TableRow
                className={!!attribute ? classes.link : undefined}
                hover={!!attribute}
                onClick={
                  !!attribute
                    ? () => onAttributeUpdate(attribute.id)
                    : undefined
                }
                key={maybe(() => attribute.id)}
              >
                <TableCell>
                  {maybe(() => attribute.name) ? attribute.name : <Skeleton />}
                </TableCell>
                <TableCell className={classes.textLeft}>
                  {maybe(() => attribute.values) !== undefined ? (
                    attribute.values.map(value => value.name).join(", ")
                  ) : (
                    <Skeleton />
                  )}
                </TableCell>
                <TableCell className={classes.iconCell}>
                  <IconButton
                    onClick={event => onAttributeDelete(attribute.id, event)}
                  >
                    <DeleteIcon color="secondary" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ),
            () => (
              <TableRow>
                <TableCell colSpan={2}>
                  {i18n.t("No attributes found")}
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </Card>
  )
);
SkillTypeAttributes.displayName = "SkillTypeAttributes";
export default SkillTypeAttributes;
