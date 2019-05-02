import * as React from "react";

import ErrorMessageCard from "../../components/ErrorMessageCard";
import Messages from "../../components/messages";
import Navigator from "../../components/Navigator";
import Shop from "../../components/Shop";
import { WindowTitle } from "../../components/WindowTitle";
import i18n from "../../i18n";
import { decimal, getMutationState, maybe } from "../../misc";
import SkillVariantCreatePage from "../components/SkillVariantCreatePage";
import { TypedVariantCreateMutation } from "../mutations";
import { TypedSkillVariantCreateQuery } from "../queries";
import { VariantCreate } from "../types/VariantCreate";
import { productUrl, productVariantEditUrl } from "../urls";

interface SkillUpdateProps {
  productId: string;
}

interface FormData {
  attributes?: Array<{
    slug: string;
    value: string;
  }>;
  costPrice?: string;
  priceOverride?: string;
  quantity: number;
  sku: string;
}

export const SkillVariant: React.StatelessComponent<SkillUpdateProps> = ({
  productId
}) => (
  <Shop>
    {shop => (
      <Navigator>
        {navigate => (
          <Messages>
            {pushMessage => (
              <TypedSkillVariantCreateQuery
                displayLoader
                variables={{ id: productId }}
                require={["product"]}
              >
                {({ data, loading: productLoading }) => {
                  const handleCreateSuccess = (data: VariantCreate) => {
                    if (data.productVariantCreate.errors.length === 0) {
                      pushMessage({ text: i18n.t("Skill created") });
                      navigate(
                        productVariantEditUrl(
                          productId,
                          data.productVariantCreate.productVariant.id
                        )
                      );
                    }
                  };

                  return (
                    <TypedVariantCreateMutation
                      onCompleted={handleCreateSuccess}
                    >
                      {(variantCreate, variantCreateResult) => {
                        if (variantCreateResult.error) {
                          return (
                            <ErrorMessageCard
                              message={i18n.t("Something went wrong")}
                            />
                          );
                        }

                        const handleBack = () =>
                          navigate(productUrl(productId));
                        const handleSubmit = (formData: FormData) =>
                          variantCreate({
                            variables: {
                              attributes: formData.attributes,
                              costPrice: decimal(formData.costPrice),
                              priceOverride: decimal(formData.priceOverride),
                              product: productId,
                              quantity: formData.quantity || null,
                              sku: formData.sku,
                              trackInventory: true
                            }
                          });
                        const handleVariantClick = (id: string) =>
                          navigate(productVariantEditUrl(productId, id));

                        const disableForm =
                          productLoading || variantCreateResult.loading;

                        const formTransitionstate = getMutationState(
                          variantCreateResult.called,
                          variantCreateResult.loading,
                          maybe(
                            () =>
                              variantCreateResult.data.productVariantCreate
                                .errors
                          )
                        );
                        return (
                          <>
                            <WindowTitle title={i18n.t("Create variant")} />
                            <SkillVariantCreatePage
                              currencySymbol={maybe(() => shop.defaultCurrency)}
                              errors={maybe(
                                () =>
                                  variantCreateResult.data.productVariantCreate
                                    .errors,
                                []
                              )}
                              header={i18n.t("Add Variant")}
                              loading={disableForm}
                              product={maybe(() => data.product)}
                              onBack={handleBack}
                              onSubmit={handleSubmit}
                              onVariantClick={handleVariantClick}
                              saveButtonBarState={formTransitionstate}
                            />
                          </>
                        );
                      }}
                    </TypedVariantCreateMutation>
                  );
                }}
              </TypedSkillVariantCreateQuery>
            )}
          </Messages>
        )}
      </Navigator>
    )}
  </Shop>
);
export default SkillVariant;
