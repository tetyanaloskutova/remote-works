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
import { skillListUrl, skillUrl } from "../urls";

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
                const handleBack = () => navigate(skillListUrl());

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
                                if (data.skillCreate.errors.length === 0) {
                                  pushMessage({
                                    text: i18n.t("Skill created")
                                  });
                                  navigate(
                                    skillUrl(data.skillCreate.skill.id)
                                  );
                                }
                              };

                              return (
                                <TypedSkillCreateMutation
                                  onCompleted={handleSuccess}
                                >
                                  {(
                                    skillCreate,
                                    {
                                      called: skillCreateCalled,
                                      data: skillCreateData,
                                      loading: skillCreateDataLoading
                                    }
                                  ) => {
                                    const handleSubmit = (
                                      formData: FormData
                                    ) => {
                                      skillCreate({
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
                                          skillType:
                                            formData.skillType.value.id,
                                          publicationDate:
                                            formData.publicationDate !== ""
                                              ? formData.publicationDate
                                              : null
                                        }
                                      });
                                    };

                                    const disabled =
                                      loading || skillCreateDataLoading;

                                    const formTransitionState = getMutationState(
                                      skillCreateCalled,
                                      skillCreateDataLoading,
                                      maybe(
                                        () =>
                                          skillCreateData.skillCreate.errors
                                      )
                                    );
                                    return (
                                      <>
                                        <WindowTitle
                                          title={i18n.t("Create skill")}
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
                                            skillCreateData &&
                                            skillCreateData.skillCreate &&
                                            skillCreateData.skillCreate
                                              .errors
                                              ? skillCreateData.skillCreate
                                                  .errors
                                              : []
                                          }
                                          fetchCategories={searchCategory}
                                          fetchCollections={searchCollection}
                                          header={i18n.t("New Skill")}
                                          skillTypes={
                                            data && data.skillTypes
                                              ? data.skillTypes.edges.map(
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
