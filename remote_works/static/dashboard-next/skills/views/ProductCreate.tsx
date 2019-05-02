import * as React from "react";

import Messages from "../../components/messages";
import Navigator from "../../components/Navigator";
import Shop from "../../components/Shop";
import { WindowTitle } from "../../components/WindowTitle";
import i18n from "../../i18n";
import { decimal, getMutationState, maybe } from "../../misc";
import SkillCreatePage, { FormData } from "../components/SkillCreatePage";
import { CategorySearchProvider } from "../containers/CategorySearch";
import { CollectionSearchProvider } from "../containers/CollectionSearch";
import { TypedSkillCreateMutation } from "../mutations";
import { TypedSkillCreateQuery } from "../queries";
import { SkillCreate } from "../types/SkillCreate";
import { productListUrl, productUrl } from "../urls";

interface SkillUpdateProps {
  id: string;
}

export const SkillUpdate: React.StatelessComponent<
  SkillUpdateProps
> = () => (
  <Shop>
    {shop => (
      <Messages>
        {pushMessage => {
          return (
            <Navigator>
              {navigate => {
                const handleAttributesEdit = undefined;
                const handleBack = () => navigate(productListUrl());

                return (
                  <CategorySearchProvider>
                    {({
                      search: searchCategory,
                      searchOpts: searchCategoryOpts
                    }) => (
                      <CollectionSearchProvider>
                        {({
                          search: searchCollection,
                          searchOpts: searchCollectionOpts
                        }) => (
                          <TypedSkillCreateQuery displayLoader>
                            {({ data, loading }) => {
                              const handleSuccess = (data: SkillCreate) => {
                                if (data.productCreate.errors.length === 0) {
                                  pushMessage({
                                    text: i18n.t("Skill created")
                                  });
                                  navigate(
                                    productUrl(data.productCreate.product.id)
                                  );
                                }
                              };

                              return (
                                <TypedSkillCreateMutation
                                  onCompleted={handleSuccess}
                                >
                                  {(
                                    productCreate,
                                    {
                                      called: productCreateCalled,
                                      data: productCreateData,
                                      loading: productCreateDataLoading
                                    }
                                  ) => {
                                    const handleSubmit = (
                                      formData: FormData
                                    ) => {
                                      productCreate({
                                        variables: {
                                          attributes: formData.attributes,
                                          category: formData.category.value,
                                          chargeTaxes: formData.chargeTaxes,
                                          collections: formData.collections.map(
                                            collection => collection.value
                                          ),
                                          descriptionJson: JSON.stringify(
                                            formData.description
                                          ),
                                          isPublished: formData.available,
                                          name: formData.name,
                                          price: decimal(formData.price),
                                          productType:
                                            formData.productType.value.id,
                                          publicationDate:
                                            formData.publicationDate !== ""
                                              ? formData.publicationDate
                                              : null
                                        }
                                      });
                                    };

                                    const disabled =
                                      loading || productCreateDataLoading;

                                    const formTransitionState = getMutationState(
                                      productCreateCalled,
                                      productCreateDataLoading,
                                      maybe(
                                        () =>
                                          productCreateData.productCreate.errors
                                      )
                                    );
                                    return (
                                      <>
                                        <WindowTitle
                                          title={i18n.t("Create product")}
                                        />
                                        <SkillCreatePage
                                          currency={maybe(
                                            () => shop.defaultCurrency
                                          )}
                                          categories={maybe(
                                            () =>
                                              searchCategoryOpts.data.categories
                                                .edges,
                                            []
                                          ).map(edge => edge.node)}
                                          collections={maybe(
                                            () =>
                                              searchCollectionOpts.data
                                                .collections.edges,
                                            []
                                          ).map(edge => edge.node)}
                                          disabled={disabled}
                                          errors={
                                            productCreateData &&
                                            productCreateData.productCreate &&
                                            productCreateData.productCreate
                                              .errors
                                              ? productCreateData.productCreate
                                                  .errors
                                              : []
                                          }
                                          fetchCategories={searchCategory}
                                          fetchCollections={searchCollection}
                                          header={i18n.t("New Skill")}
                                          productTypes={
                                            data && data.productTypes
                                              ? data.productTypes.edges.map(
                                                  edge => edge.node
                                                )
                                              : undefined
                                          }
                                          onAttributesEdit={
                                            handleAttributesEdit
                                          }
                                          onBack={handleBack}
                                          onSubmit={handleSubmit}
                                          saveButtonBarState={
                                            formTransitionState
                                          }
                                        />
                                      </>
                                    );
                                  }}
                                </TypedSkillCreateMutation>
                              );
                            }}
                          </TypedSkillCreateQuery>
                        )}
                      </CollectionSearchProvider>
                    )}
                  </CategorySearchProvider>
                );
              }}
            </Navigator>
          );
        }}
      </Messages>
    )}
  </Shop>
);
export default SkillUpdate;
