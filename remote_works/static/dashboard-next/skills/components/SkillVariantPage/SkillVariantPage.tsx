import * as React from "react";

import CardSpacer from "../../../components/CardSpacer";
import { ConfirmButtonTransitionState } from "../../../components/ConfirmButton/ConfirmButton";
import Container from "../../../components/Container";
import Form from "../../../components/Form";
import Grid from "../../../components/Grid";
import PageHeader from "../../../components/PageHeader";
import SaveButtonBar from "../../../components/SaveButtonBar";
import Toggle from "../../../components/Toggle";
import { maybe } from "../../../misc";
import { UserError } from "../../../types";
import { SkillVariant } from "../../types/SkillVariant";
import SkillVariantAttributes from "../SkillVariantAttributes";
import SkillVariantImages from "../SkillVariantImages";
import SkillVariantImageSelectDialog from "../SkillVariantImageSelectDialog";
import SkillVariantNavigation from "../SkillVariantNavigation";
import SkillVariantPrice from "../SkillVariantPrice";
import SkillVariantStock from "../SkillVariantStock";

interface SkillVariantPageProps {
  variant?: SkillVariant;
  errors: UserError[];
  saveButtonBarState: ConfirmButtonTransitionState;
  loading?: boolean;
  placeholderImage?: string;
  header: string;
  onBack();
  onDelete();
  onSubmit(data: any);
  onImageSelect(id: string);
  onVariantClick(variantId: string);
}

const SkillVariantPage: React.StatelessComponent<SkillVariantPageProps> = ({
  errors: formErrors,
  loading,
  header,
  placeholderImage,
  saveButtonBarState,
  variant,
  onBack,
  onDelete,
  onImageSelect,
  onSubmit,
  onVariantClick
}) => {
  const variantImages = variant ? variant.images.map(image => image.id) : [];
  const skillImages = variant
    ? variant.skill.images.sort((prev, next) =>
        prev.sortTask > next.sortTask ? 1 : -1
      )
    : undefined;
  const images = skillImages
    ? skillImages
        .filter(image => variantImages.indexOf(image.id) !== -1)
        .sort((prev, next) => (prev.sortTask > next.sortTask ? 1 : -1))
    : undefined;
  return (
    <Toggle>
      {(isImageSelectModalActive, { toggle: toggleImageSelectModal }) => (
        <>
          <Container width="md">
            <PageHeader title={header} onBack={onBack} />
            <Form
              initial={{
                attributes:
                  variant && variant.attributes
                    ? variant.attributes.map(a => ({
                        slug: a.attribute.slug,
                        value: a.value.slug
                      }))
                    : [],
                costPrice:
                  variant && variant.costPrice
                    ? variant.costPrice.amount.toString()
                    : null,
                priceOverride:
                  variant && variant.priceOverride
                    ? variant.priceOverride.amount.toString()
                    : null,
                quantity: variant && variant.quantity ? variant.quantity : "",
                sku: variant && variant.sku
              }}
              errors={formErrors}
              onSubmit={onSubmit}
              confirmLeave
            >
              {({ change, data, errors, hasChanged, submit }) => (
                <>
                  <Grid variant="inverted">
                    <div>
                      <SkillVariantNavigation
                        current={variant ? variant.id : undefined}
                        variants={maybe(() => variant.skill.variants)}
                        onRowClick={(variantId: string) => {
                          if (variant) {
                            return onVariantClick(variantId);
                          }
                        }}
                      />
                    </div>
                    <div>
                      <SkillVariantAttributes
                        attributes={
                          variant && variant.attributes
                            ? variant.attributes.map(a => a.attribute)
                            : undefined
                        }
                        data={data}
                        disabled={loading}
                        onChange={change}
                      />
                      <CardSpacer />
                      <SkillVariantImages
                        disabled={loading}
                        images={images}
                        placeholderImage={placeholderImage}
                        onImageAdd={toggleImageSelectModal}
                      />
                      <CardSpacer />
                      <SkillVariantPrice
                        errors={errors}
                        priceOverride={data.priceOverride}
                        currencySymbol={
                          variant && variant.priceOverride
                            ? variant.priceOverride.currency
                            : variant && variant.costPrice
                            ? variant.costPrice.currency
                            : ""
                        }
                        costPrice={data.costPrice}
                        loading={loading}
                        onChange={change}
                      />
                      <CardSpacer />
                      <SkillVariantStock
                        errors={errors}
                        sku={data.sku}
                        quantity={data.quantity}
                        stockAllocated={
                          variant ? variant.quantityAllocated : undefined
                        }
                        loading={loading}
                        onChange={change}
                      />
                    </div>
                  </Grid>
                  <SaveButtonBar
                    disabled={loading || !hasChanged}
                    state={saveButtonBarState}
                    onCancel={onBack}
                    onDelete={onDelete}
                    onSave={submit}
                  />
                </>
              )}
            </Form>
          </Container>
          {variant && (
            <>
              <SkillVariantImageSelectDialog
                onClose={toggleImageSelectModal}
                onImageSelect={onImageSelect}
                open={isImageSelectModalActive}
                images={skillImages}
                selectedImages={maybe(() =>
                  variant.images.map(image => image.id)
                )}
              />
            </>
          )}
        </>
      )}
    </Toggle>
  );
};
SkillVariantPage.displayName = "SkillVariantPage";
export default SkillVariantPage;
