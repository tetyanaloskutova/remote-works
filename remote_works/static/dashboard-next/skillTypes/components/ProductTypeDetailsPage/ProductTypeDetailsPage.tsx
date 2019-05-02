import * as React from "react";

import CardSpacer from "../../../components/CardSpacer";
import { ConfirmButtonTransitionState } from "../../../components/ConfirmButton/ConfirmButton";
import Container from "../../../components/Container";
import { ControlledCheckbox } from "../../../components/ControlledCheckbox";
import Form from "../../../components/Form";
import Grid from "../../../components/Grid";
import PageHeader from "../../../components/PageHeader";
import SaveButtonBar from "../../../components/SaveButtonBar";
import i18n from "../../../i18n";
import { maybe } from "../../../misc";
import {
  AttributeTypeEnum,
  TaxRateType,
  WeightUnitsEnum
} from "../../../types/globalTypes";
import { SkillTypeDetails_productType } from "../../types/SkillTypeDetails";
import SkillTypeAttributes from "../SkillTypeAttributes/SkillTypeAttributes";
import SkillTypeDetails from "../SkillTypeDetails/SkillTypeDetails";
import SkillTypeShipping from "../SkillTypeShipping/SkillTypeShipping";
import SkillTypeTaxes from "../SkillTypeTaxes/SkillTypeTaxes";

interface ChoiceType {
  label: string;
  value: string;
}

export interface SkillTypeForm {
  name: string;
  hasVariants: boolean;
  isShippingRequired: boolean;
  taxRate: TaxRateType;
  productAttributes: ChoiceType[];
  variantAttributes: ChoiceType[];
  weight: number;
}

export interface SkillTypeDetailsPageProps {
  errors: Array<{
    field: string;
    message: string;
  }>;
  productType: SkillTypeDetails_productType;
  defaultWeightUnit: WeightUnitsEnum;
  disabled: boolean;
  pageTitle: string;
  saveButtonBarState: ConfirmButtonTransitionState;
  onAttributeAdd: (type: AttributeTypeEnum) => void;
  onAttributeDelete: (id: string, event: React.MouseEvent<any>) => void;
  onAttributeUpdate: (id: string) => void;
  onBack: () => void;
  onDelete: () => void;
  onSubmit: (data: SkillTypeForm) => void;
}

const SkillTypeDetailsPage: React.StatelessComponent<
  SkillTypeDetailsPageProps
> = ({
  defaultWeightUnit,
  disabled,
  errors,
  pageTitle,
  productType,
  saveButtonBarState,
  onAttributeAdd,
  onAttributeDelete,
  onAttributeUpdate,
  onBack,
  onDelete,
  onSubmit
}) => {
  const formInitialData: SkillTypeForm = {
    hasVariants:
      maybe(() => productType.hasVariants) !== undefined
        ? productType.hasVariants
        : false,
    isShippingRequired:
      maybe(() => productType.isShippingRequired) !== undefined
        ? productType.isShippingRequired
        : false,
    name: maybe(() => productType.name) !== undefined ? productType.name : "",
    productAttributes:
      maybe(() => productType.productAttributes) !== undefined
        ? productType.productAttributes.map(attribute => ({
            label: attribute.name,
            value: attribute.id
          }))
        : [],
    taxRate:
      maybe(() => productType.taxRate) !== undefined
        ? productType.taxRate
        : null,
    variantAttributes:
      maybe(() => productType.variantAttributes) !== undefined
        ? productType.variantAttributes.map(attribute => ({
            label: attribute.name,
            value: attribute.id
          }))
        : [],
    weight: maybe(() => productType.weight.value)
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
              <CardSpacer />
              <SkillTypeAttributes
                attributes={maybe(() => productType.productAttributes)}
                type={AttributeTypeEnum.PRODUCT}
                onAttributeAdd={onAttributeAdd}
                onAttributeDelete={onAttributeDelete}
                onAttributeUpdate={onAttributeUpdate}
              />
              <CardSpacer />
              <ControlledCheckbox
                checked={data.hasVariants}
                disabled={disabled}
                label={i18n.t("This product type has variants")}
                name="hasVariants"
                onChange={change}
              />
              {data.hasVariants && (
                <>
                  <CardSpacer />
                  <SkillTypeAttributes
                    attributes={maybe(() => productType.variantAttributes)}
                    type={AttributeTypeEnum.VARIANT}
                    onAttributeAdd={onAttributeAdd}
                    onAttributeDelete={onAttributeDelete}
                    onAttributeUpdate={onAttributeUpdate}
                  />
                </>
              )}
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
            onDelete={onDelete}
            onSave={submit}
            disabled={disabled || !hasChanged}
            state={saveButtonBarState}
          />
        </Container>
      )}
    </Form>
  );
};
SkillTypeDetailsPage.displayName = "SkillTypeDetailsPage";
export default SkillTypeDetailsPage;
