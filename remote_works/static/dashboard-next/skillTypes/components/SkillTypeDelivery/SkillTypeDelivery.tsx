import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import TextField from "@material-ui/core/TextField";
import * as React from "react";

import CardTitle from "../../../components/CardTitle";
import { ControlledCheckbox } from "../../../components/ControlledCheckbox";
import i18n from "../../../i18n";
import { WeightUnitsEnum } from "../../../types/globalTypes";

interface SkillTypeDeliveryProps {
  data: {
    isDeliveryRequired: boolean;
    weight: number | null;
  };
  defaultWeightUnit: WeightUnitsEnum;
  disabled: boolean;
  onChange: (event: React.ChangeEvent<any>) => void;
}

const SkillTypeDelivery: React.StatelessComponent<
  SkillTypeDeliveryProps
> = ({ data, defaultWeightUnit, disabled, onChange }) => (
  <Card>
    <CardTitle title={i18n.t("Delivery")} />
    <CardContent>
      <ControlledCheckbox
        checked={data.isDeliveryRequired}
        disabled={disabled}
        label={i18n.t("Is this skill shippable?")}
        name="isDeliveryRequired"
        onChange={onChange}
      />
      {data.isDeliveryRequired && (
        <TextField
          disabled={disabled}
          InputProps={{ endAdornment: defaultWeightUnit }}
          label={i18n.t("Weight")}
          name="weight"
          helperText={i18n.t(
            "Used to calculate rates for delivery for skills of this skill type, when specific weight is not given"
          )}
          type="number"
          value={data.weight}
          onChange={onChange}
        />
      )}
    </CardContent>
  </Card>
);

SkillTypeDelivery.displayName = "SkillTypeDelivery";
export default SkillTypeDelivery;
