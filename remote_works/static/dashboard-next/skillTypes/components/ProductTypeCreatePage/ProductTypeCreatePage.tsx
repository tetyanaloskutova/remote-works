import * as React from "react";

import CardSpacer from "../../../components/CardSpacer";
import { ConfirmButtonTransitionState } from "../../../components/ConfirmButton/ConfirmButton";
import Container from "../../../components/Container";
import Form from "../../../components/Form";
import Grid from "../../../components/Grid";
import PageHeader from "../../../components/PageHeader";
import SaveButtonBar from "../../../components/SaveButtonBar";
import { TaxRateType, WeightUnitsEnum } from "../../../types/globalTypes";
import SkillTypeDetails from "../SkillTypeDetails/SkillTypeDetails";
import SkillTypeShipping from "../SkillTypeShipping/SkillTypeShipping";
import SkillTypeTaxes from "../SkillTypeTaxes/SkillTypeTaxes";

export interface SkillTypeForm {
  chargeTaxes: boolean;
  name: string;
  isShippingRequired: boolean;
  taxRate: TaxRateType;
  weight: number;
}

export interface SkillTypeCreatePageProps {
  errors: Array<{
    field: string;
    message: string;
  }>;
  defaultWeightUnit: WeightUnitsEnum;
  disabled: boolean;
  pageTitle: string;
  saveButtonBarState: ConfirmButtonTransitionState;
  onBack: () => void;
  onSubmit: (data: SkillTypeForm) => void;
}

const SkillTypeCreatePage: React.StatelessComponent<
  SkillTypeCreatePageProps
> = ({
  defaultWeightUnit,
  disabled,
  errors,
  pageTitle,
  saveButtonBarState,
  onBack,
  onSubmit
}: SkillTypeCreatePageProps) => {
  const formInitialData: SkillTypeForm = {
    chargeTaxes: true,
    isShippingRequired: false,
    name: "",
    taxRate: TaxRateType.STANDARD,
    weight: 0
  };
  return (
    <Form
      errors={errors}
      initial={formInitialData}
      onSubmit={onSubmit}
      confirmLeave
    >
      {({ change, data, hasChanged, submit }) => (
        <Container width="md">
          <PageHeader title={pageTitle} onBack={onBack} />
          <Grid>
            <div>
              <SkillTypeDetails
                data={data}
                disabled={disabled}
                onChange={change}
              />
            </div>
            <div>
              <SkillTypeShipping
                disabled={disabled}
                data={data}
                defaultWeightUnit={defaultWeightUnit}
                onChange={change}
              />
              <CardSpacer />
              <SkillTypeTaxes
                disabled={disabled}
                data={data}
                onChange={change}
              />
            </div>
          </Grid>
          <SaveButtonBar
            onCancel={onBack}
            onSave={submit}
            disabled={disabled || !hasChanged}
            state={saveButtonBarState}
          />
        </Container>
      )}
    </Form>
  );
};
SkillTypeCreatePage.displayName = "SkillTypeCreatePage";
export default SkillTypeCreatePage;
