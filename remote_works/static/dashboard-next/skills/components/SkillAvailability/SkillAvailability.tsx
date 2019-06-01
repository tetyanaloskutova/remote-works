import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import * as React from "react";

import CardTitle from "../../../components/CardTitle";
import i18n from "../../../i18n";
import { maybe } from "../../../misc";
import { SkillDetails_skill } from "../../types/SkillDetails";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: "grid",
      gridColumnGap: theme.spacing.unit * 2 + "px",
      gridTemplateColumns: "1fr 1fr"
    }
  });

interface SkillStockProps extends WithStyles<typeof styles> {
  data: {
    sku: string;
    stockQuantity: number;
  };
  disabled: boolean;
  skill: SkillDetails_skill;
  onChange: (event: React.ChangeEvent<any>) => void;
}

const SkillStock = withStyles(styles, { name: "SkillStock" })(
  ({ classes, data, disabled, skill, onChange }: SkillStockProps) => (
    <Card>
      <CardTitle title={i18n.t("Inventory")} />
      <CardContent>
        <div className={classes.root}>
          <TextField
            disabled={disabled}
            name="sku"
            label={i18n.t("SKU (Stock Keeping Unit)")}
            value={data.sku}
            onChange={onChange}
          />
          <TextField
            disabled={disabled}
            name="stockQuantity"
            label={i18n.t("Inventory")}
            value={data.stockQuantity}
            type="number"
            onChange={onChange}
            helperText={i18n.t("Allocated: {{ quantity }}", {
              quantity: maybe(() => skill.variants[0].quantityAllocated)
            })}
          />
        </div>
      </CardContent>
    </Card>
  )
);
SkillStock.displayName = "SkillStock";
export default SkillStock;
