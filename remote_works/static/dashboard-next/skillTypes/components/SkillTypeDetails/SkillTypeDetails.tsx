import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import * as React from "react";

import CardTitle from "../../../components/CardTitle";
import i18n from "../../../i18n";

const styles = createStyles({
  root: {
    overflow: "visible"
  }
});

interface SkillTypeDetailsProps extends WithStyles<typeof styles> {
  data?: {
    name: string;
  };
  disabled: boolean;
  onChange: (event: React.ChangeEvent<any>) => void;
}

const SkillTypeDetails = withStyles(styles, { name: "SkillTypeDetails" })(
  ({ classes, data, disabled, onChange }: SkillTypeDetailsProps) => (
    <Card className={classes.root}>
      <CardTitle title={i18n.t("Information")} />
      <CardContent>
        <TextField
          disabled={disabled}
          fullWidth
          label={i18n.t("Skill Type Name")}
          name="name"
          onChange={onChange}
          value={data.name}
        />
      </CardContent>
    </Card>
  )
);
SkillTypeDetails.displayName = "SkillTypeDetails";
export default SkillTypeDetails;
