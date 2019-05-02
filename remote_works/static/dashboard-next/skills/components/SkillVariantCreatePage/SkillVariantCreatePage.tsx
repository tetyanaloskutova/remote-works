import * as React from "react";

import { ConfirmButtonTransitionState } from "../../../components/ConfirmButton/ConfirmButton";
import Container from "../../../components/Container";
import Form from "../../../components/Form";
import Grid from "../../../components/Grid";
import PageHeader from "../../../components/PageHeader";
import SaveButtonBar from "../../../components/SaveButtonBar";
import i18n from "../../../i18n";
import { maybe } from "../../../misc";
import { UserError } from "../../../types";
import { SkillVariantCreateData_product } from "../../types/SkillVariantCreateData";
import SkillVariantAttributes from "../SkillVariantAttributes";
import SkillVariantNavigation from "../SkillVariantNavigation";
import SkillVariantPrice from "../SkillVariantPrice";
import SkillVariantStock from "../SkillVariantStock";

interface FormData {
  attributes?: Array<{
    slug: string;
    value: string;
  }>;
  costPrice?: string;
  images?: string[];
  priceOverride?: string;
  quantity?: number;
  sku?: string;
}

interface SkillVariantCreatePageProps {
  currencySymbol: string;
  errors: UserError[];
  header: string;
  loading: boolean;
  product: SkillVariantCreateData_product;
  saveButtonBarState: ConfirmButtonTransitionState;
  onBack: () => void;
  onSubmit: (data: FormData) => void;
  onVariantClick: (variantId: string) => void;
}

const SkillVariantCreatePage: React.StatelessComponent<
  SkillVariantCreatePageProps
> = ({
  currencySymbol,
  errors: formErrors,
  loading,
  header,
  product,
  saveButtonBarState,
  onBack,
  onSubmit,
  onVariantClick
}) => {
  const initialForm = {
    attributes: maybe(() =>
      product.productType.variantAttributes.map(attribute => ({
        slug: attribute.slug,
        value: ""
      }))
    ),
    costPrice: "",
    images: maybe(() => product.images.map(image => image.id)),
    priceOverride: "",
    quantity: 0,
    sku: ""
  };
  return (
    <Form
      initial={initialForm}
      errors={formErrors}
      onSubmit={onSubmit}
      key={product ? JSON.stringify(product) : "noproduct"}
    >
      {({ change, data, errors, hasChanged, submit }) => (
        <Container width="md">
          <PageHeader title={header} onBack={onBack} />
          <Grid variant="inverted">
            <div>
              <SkillVariantNavigation
                variants={maybe(() => product.variants)}
                onRowClick={(variantId: string) => {
                  if (product && product.variants) {
                    return onVariantClick(variantId);
                  }
                }}
              />
            </div>
            <div>
              <SkillVariantAttributes
                attributes={maybe(() => product.productType.variantAttributes)}
                data={data}
                disabled={loading}
                onChange={change}
              />
              <SkillVariantPrice
                errors={errors}
                priceOverride={data.priceOverride}
                currencySymbol={currencySymbol}
                costPrice={data.costPrice}
                loading={loading}
                onChange={change}
              />
              <SkillVariantStock
                errors={errors}
                sku={data.sku}
                quantity={data.quantity}
                loading={loading}
                onChange={change}
              />
            </div>
          </Grid>
          <SaveButtonBar
            disabled={loading || !onSubmit || !hasChanged}
            labels={{
              delete: i18n.t("Remove variant"),
              save: i18n.t("Save variant")
            }}
            state={saveButtonBarState}
            onCancel={onBack}
            onSave={submit}
          />
        </Container>
      )}
    </Form>
  );
};
SkillVariantCreatePage.displayName = "SkillVariantCreatePage";
export default SkillVariantCreatePage;
