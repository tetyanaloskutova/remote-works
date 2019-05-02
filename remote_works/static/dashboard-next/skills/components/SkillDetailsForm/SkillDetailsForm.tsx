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
import FormSpacer from "../../../components/FormSpacer";
import RichTextEditor from "../../../components/RichTextEditor";
import i18n from "../../../i18n";
import { maybe } from "../../../misc";
import { SkillDetails_product } from "../../types/SkillDetails";
import { FormData as CreateFormData } from "../SkillCreatePage";
import { FormData as UpdateFormData } from "../SkillUpdatePage";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: "grid",
      gridColumnGap: theme.spacing.unit * 2 + "px",
      gridTemplateColumns: `3fr 1fr`
    }
  });

interface SkillDetailsFormProps extends WithStyles<typeof styles> {
  data: CreateFormData & UpdateFormData;
  disabled?: boolean;
  errors: { [key: string]: string };
  product?: SkillDetails_product;
  onChange(event: any);
}

export const SkillDetailsForm = withStyles(styles, {
  name: "SkillDetailsForm"
})(
  ({
    classes,
    data,
    disabled,
    errors,
    product,
    onChange
  }: SkillDetailsFormProps) => (
    <Card>
      <CardTitle title={i18n.t("General information")} />
      <CardContent>
        <div className={classes.root}>
          <TextField
            error={!!errors.name}
            helperText={errors.name}
            disabled={disabled}
            fullWidth
            label={i18n.t("Name")}
            name="name"
            rows={5}
            value={data.name}
            onChange={onChange}
          />
        </div>
        <FormSpacer />
        <RichTextEditor
          disabled={disabled}
          error={!!errors.descriptionJson}
          helperText={errors.descriptionJson}
          initial={maybe(() => JSON.parse(product.descriptionJson))}
          label={i18n.t("Description")}
          name="description"
          onChange={onChange}
        />
      </CardContent>
    </Card>
  )
);
SkillDetailsForm.displayName = "SkillDetailsForm";
export default SkillDetailsForm;
