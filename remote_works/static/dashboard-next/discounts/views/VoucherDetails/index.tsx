import DialogContentText from "@material-ui/core/DialogContentText";
import { stringify as stringifyQs } from "qs";
import * as React from "react";
import { Route } from "react-router-dom";

import { categoryUrl } from "../../../categories/urls";
import { collectionUrl } from "../../../collections/urls";
import ActionDialog from "../../../components/ActionDialog";
import AssignCategoriesDialog from "../../../components/AssignCategoryDialog";
import AssignCollectionDialog from "../../../components/AssignCollectionDialog";
import AssignSkillDialog from "../../../components/AssignSkillDialog";
import Messages from "../../../components/messages";
import Navigator from "../../../components/Navigator";
import {
  createPaginationState,
  Paginator
} from "../../../components/Paginator";
import Shop from "../../../components/Shop";
import { WindowTitle } from "../../../components/WindowTitle";
import { SearchCategoriesProvider } from "../../../containers/SearchCategories";
import { SearchCollectionsProvider } from "../../../containers/SearchCollections";
import { SearchSkillsProvider } from "../../../containers/SearchSkills";
import i18n from "../../../i18n";
import { decimal, getMutationState, maybe } from "../../../misc";
import { skillUrl } from "../../../skills/urls";
import {
  DiscountValueTypeEnum,
  VoucherDiscountValueType
} from "../../../types/globalTypes";
import DiscountCountrySelectDialog from "../../components/DiscountCountrySelectDialog";
import VoucherDetailsPage, {
  VoucherDetailsPageTab
} from "../../components/VoucherDetailsPage";
import {
  TypedVoucherCataloguesAdd,
  TypedVoucherCataloguesRemove,
  TypedVoucherDelete,
  TypedVoucherUpdate
} from "../../mutations";
import { TypedVoucherDetails } from "../../queries";
import { VoucherCataloguesAdd } from "../../types/VoucherCataloguesAdd";
import { VoucherDelete } from "../../types/VoucherDelete";
import { VoucherUpdate } from "../../types/VoucherUpdate";
import { voucherListUrl, voucherUrl } from "../../urls";
import {
  voucherAssignCategoriesPath,
  voucherAssignCategoriesUrl,
  voucherAssignCollectionsPath,
  voucherAssignCollectionsUrl,
  voucherAssignCountriesPath,
  voucherAssignCountriesUrl,
  voucherAssignSkillsPath,
  voucherAssignSkillsUrl,
  voucherDeletePath,
  voucherDeleteUrl
} from "./urls";

const PAGINATE_BY = 20;

export type VoucherDetailsQueryParams = Partial<{
  after: string;
  before: string;
  tab: VoucherDetailsPageTab;
}>;

interface VoucherDetailsProps {
  id: string;
  params: VoucherDetailsQueryParams;
}

function discountValueTypeEnum(
  type: VoucherDiscountValueType
): DiscountValueTypeEnum {
  return type.toString() === DiscountValueTypeEnum.FIXED
    ? DiscountValueTypeEnum.FIXED
    : DiscountValueTypeEnum.PERCENTAGE;
}

export const VoucherDetails: React.StatelessComponent<VoucherDetailsProps> = ({
  id,
  params
}) => (
  <>
    <WindowTitle title={i18n.t("Vouchers")} />
    <Shop>
      {shop => (
        <Messages>
          {pushMessage => (
            <Navigator>
              {navigate => {
                const paginationState = createPaginationState(
                  PAGINATE_BY,
                  params
                );
                const changeTab = (tab: VoucherDetailsPageTab) =>
                  navigate(
                    "?" +
                      stringifyQs({
                        tab
                      })
                  );

                const handleCatalogueAdd = (data: VoucherCataloguesAdd) => {
                  if (data.voucherCataloguesAdd.errors.length === 0) {
                    navigate(voucherUrl(id), true, true);
                  }
                };

                const handleVoucherDelete = (data: VoucherDelete) => {
                  if (data.voucherDelete.errors.length === 0) {
                    pushMessage({
                      text: i18n.t("Removed voucher", {
                        context: "notification"
                      })
                    });
                    navigate(voucherListUrl, true);
                  }
                };

                const handleVoucherUpdate = (data: VoucherUpdate) => {
                  if (data.voucherUpdate.errors.length === 0) {
                    navigate(voucherUrl(id), true, true);
                  }
                  pushMessage({
                    text: i18n.t("Updated voucher", {
                      context: "notification"
                    })
                  });
                };

                return (
                  <TypedVoucherCataloguesRemove>
                    {(voucherCataloguesRemove, voucherCataloguesRemoveOpts) => (
                      <TypedVoucherCataloguesAdd
                        onCompleted={handleCatalogueAdd}
                      >
                        {(voucherCataloguesAdd, voucherCataloguesAddOpts) => (
                          <TypedVoucherUpdate onCompleted={handleVoucherUpdate}>
                            {(voucherUpdate, voucherUpdateOpts) => (
                              <TypedVoucherDelete
                                onCompleted={handleVoucherDelete}
                              >
                                {(voucherDelete, voucherDeleteOpts) => (
                                  <TypedVoucherDetails
                                    displayLoader
                                    variables={{ id, ...paginationState }}
                                  >
                                    {({ data, loading }) => {
                                      const pageInfo =
                                        params.tab ===
                                        VoucherDetailsPageTab.categories
                                          ? maybe(
                                              () =>
                                                data.voucher.categories.pageInfo
                                            )
                                          : params.tab ===
                                            VoucherDetailsPageTab.collections
                                          ? maybe(
                                              () =>
                                                data.voucher.collections
                                                  .pageInfo
                                            )
                                          : maybe(
                                              () =>
                                                data.voucher.skills.pageInfo
                                            );
                                      const formTransitionState = getMutationState(
                                        voucherUpdateOpts.called,
                                        voucherUpdateOpts.loading,
                                        maybe(
                                          () =>
                                            voucherUpdateOpts.data.voucherUpdate
                                              .errors
                                        )
                                      );
                                      const assignTransitionState = getMutationState(
                                        voucherCataloguesAddOpts.called,
                                        voucherCataloguesAddOpts.loading,
                                        maybe(
                                          () =>
                                            voucherCataloguesAddOpts.data
                                              .voucherCataloguesAdd.errors
                                        )
                                      );
                                      const removeTransitionState = getMutationState(
                                        voucherDeleteOpts.called,
                                        voucherDeleteOpts.loading,
                                        maybe(
                                          () =>
                                            voucherDeleteOpts.data.voucherDelete
                                              .errors
                                        )
                                      );

                                      return (
                                        <Paginator
                                          pageInfo={pageInfo}
                                          paginationState={paginationState}
                                          queryString={params}
                                        >
                                          {({
                                            loadNextPage,
                                            loadPreviousPage,
                                            pageInfo
                                          }) => (
                                            <>
                                              <VoucherDetailsPage
                                                defaultCurrency={maybe(
                                                  () => shop.defaultCurrency
                                                )}
                                                voucher={maybe(
                                                  () => data.voucher
                                                )}
                                                disabled={
                                                  loading ||
                                                  voucherCataloguesRemoveOpts.loading
                                                }
                                                errors={maybe(
                                                  () =>
                                                    voucherUpdateOpts.data
                                                      .voucherUpdate.errors
                                                )}
                                                pageInfo={pageInfo}
                                                onNextPage={loadNextPage}
                                                onPreviousPage={
                                                  loadPreviousPage
                                                }
                                                onCategoryAssign={() =>
                                                  navigate(
                                                    voucherAssignCategoriesUrl(
                                                      id
                                                    ),
                                                    false,
                                                    true
                                                  )
                                                }
                                                onCategoryClick={id => () =>
                                                  navigate(categoryUrl(id))}
                                                onCollectionAssign={() =>
                                                  navigate(
                                                    voucherAssignCollectionsUrl(
                                                      id
                                                    ),
                                                    false,
                                                    true
                                                  )
                                                }
                                                onCollectionUnassign={collectionId =>
                                                  voucherCataloguesRemove({
                                                    variables: {
                                                      ...paginationState,
                                                      id,
                                                      input: {
                                                        collections: [
                                                          collectionId
                                                        ]
                                                      }
                                                    }
                                                  })
                                                }
                                                onCountryAssign={() =>
                                                  navigate(
                                                    voucherAssignCountriesUrl(
                                                      id
                                                    ),
                                                    false,
                                                    true
                                                  )
                                                }
                                                onCountryUnassign={countryCode =>
                                                  voucherUpdate({
                                                    variables: {
                                                      ...paginationState,
                                                      id,
                                                      input: {
                                                        countries: data.voucher.countries
                                                          .filter(
                                                            country =>
                                                              country.code !==
                                                              countryCode
                                                          )
                                                          .map(
                                                            country =>
                                                              country.code
                                                          )
                                                      }
                                                    }
                                                  })
                                                }
                                                onCategoryUnassign={categoryId =>
                                                  voucherCataloguesRemove({
                                                    variables: {
                                                      ...paginationState,
                                                      id,
                                                      input: {
                                                        categories: [categoryId]
                                                      }
                                                    }
                                                  })
                                                }
                                                onCollectionClick={id => () =>
                                                  navigate(collectionUrl(id))}
                                                onSkillAssign={() =>
                                                  navigate(
                                                    voucherAssignSkillsUrl(
                                                      id
                                                    ),
                                                    false,
                                                    true
                                                  )
                                                }
                                                onSkillUnassign={skillId =>
                                                  voucherCataloguesRemove({
                                                    variables: {
                                                      ...paginationState,
                                                      id,
                                                      input: {
                                                        skills: [skillId]
                                                      }
                                                    }
                                                  })
                                                }
                                                onSkillClick={id => () =>
                                                  navigate(skillUrl(id))}
                                                activeTab={params.tab}
                                                onBack={() =>
                                                  navigate(voucherListUrl)
                                                }
                                                onTabClick={changeTab}
                                                onSubmit={formData =>
                                                  voucherUpdate({
                                                    variables: {
                                                      id,
                                                      input: {
                                                        discountValue: decimal(
                                                          formData.value
                                                        ),
                                                        discountValueType: discountValueTypeEnum(
                                                          formData.discountType
                                                        ),
                                                        endDate:
                                                          formData.endDate ===
                                                          ""
                                                            ? null
                                                            : formData.endDate,
                                                        name: formData.name,
                                                        startDate:
                                                          formData.startDate ===
                                                          ""
                                                            ? null
                                                            : formData.startDate
                                                      }
                                                    }
                                                  })
                                                }
                                                onRemove={() =>
                                                  navigate(voucherDeleteUrl(id))
                                                }
                                                saveButtonBarState={
                                                  formTransitionState
                                                }
                                              />
                                              <Route
                                                path={voucherAssignSkillsPath(
                                                  ":id"
                                                )}
                                                render={({ match }) => (
                                                  <SearchSkillsProvider>
                                                    {(
                                                      searchSkills,
                                                      searchSkillsOpts
                                                    ) => (
                                                      <AssignSkillDialog
                                                        confirmButtonState={
                                                          assignTransitionState
                                                        }
                                                        open={!!match}
                                                        onFetch={searchSkills}
                                                        loading={
                                                          searchSkillsOpts.loading
                                                        }
                                                        onClose={() =>
                                                          navigate(
                                                            voucherUrl(id),
                                                            true,
                                                            true
                                                          )
                                                        }
                                                        onSubmit={formData =>
                                                          voucherCataloguesAdd({
                                                            variables: {
                                                              ...paginationState,
                                                              id,
                                                              input: {
                                                                skills: formData.skills.map(
                                                                  skill =>
                                                                    skill.id
                                                                )
                                                              }
                                                            }
                                                          })
                                                        }
                                                        skills={maybe(() =>
                                                          searchSkillsOpts.data.skills.edges
                                                            .map(
                                                              edge => edge.node
                                                            )
                                                            .filter(
                                                              suggestedSkill =>
                                                                suggestedSkill.id
                                                            )
                                                        )}
                                                      />
                                                    )}
                                                  </SearchSkillsProvider>
                                                )}
                                              />
                                              <Route
                                                path={voucherAssignCategoriesPath(
                                                  ":id"
                                                )}
                                                render={({ match }) => (
                                                  <SearchCategoriesProvider>
                                                    {(
                                                      searchCategories,
                                                      searchCategoriesOpts
                                                    ) => (
                                                      <AssignCategoriesDialog
                                                        categories={maybe(() =>
                                                          searchCategoriesOpts.data.categories.edges
                                                            .map(
                                                              edge => edge.node
                                                            )
                                                            .filter(
                                                              suggestedCategory =>
                                                                suggestedCategory.id
                                                            )
                                                        )}
                                                        confirmButtonState={
                                                          assignTransitionState
                                                        }
                                                        open={!!match}
                                                        onFetch={
                                                          searchCategories
                                                        }
                                                        loading={
                                                          searchCategoriesOpts.loading
                                                        }
                                                        onClose={() =>
                                                          navigate(
                                                            voucherUrl(id),
                                                            true,
                                                            true
                                                          )
                                                        }
                                                        onSubmit={formData =>
                                                          voucherCataloguesAdd({
                                                            variables: {
                                                              ...paginationState,
                                                              id,
                                                              input: {
                                                                categories: formData.categories.map(
                                                                  skill =>
                                                                    skill.id
                                                                )
                                                              }
                                                            }
                                                          })
                                                        }
                                                      />
                                                    )}
                                                  </SearchCategoriesProvider>
                                                )}
                                              />
                                              <Route
                                                path={voucherAssignCollectionsPath(
                                                  ":id"
                                                )}
                                                render={({ match }) => (
                                                  <SearchCollectionsProvider>
                                                    {(
                                                      searchCollections,
                                                      searchCollectionsOpts
                                                    ) => (
                                                      <AssignCollectionDialog
                                                        collections={maybe(() =>
                                                          searchCollectionsOpts.data.collections.edges
                                                            .map(
                                                              edge => edge.node
                                                            )
                                                            .filter(
                                                              suggestedCategory =>
                                                                suggestedCategory.id
                                                            )
                                                        )}
                                                        confirmButtonState={
                                                          assignTransitionState
                                                        }
                                                        open={!!match}
                                                        onFetch={
                                                          searchCollections
                                                        }
                                                        loading={
                                                          searchCollectionsOpts.loading
                                                        }
                                                        onClose={() =>
                                                          navigate(
                                                            voucherUrl(id),
                                                            true,
                                                            true
                                                          )
                                                        }
                                                        onSubmit={formData =>
                                                          voucherCataloguesAdd({
                                                            variables: {
                                                              ...paginationState,
                                                              id,
                                                              input: {
                                                                collections: formData.collections.map(
                                                                  skill =>
                                                                    skill.id
                                                                )
                                                              }
                                                            }
                                                          })
                                                        }
                                                      />
                                                    )}
                                                  </SearchCollectionsProvider>
                                                )}
                                              />
                                              <Route
                                                path={voucherDeletePath(":id")}
                                                render={({ match }) => (
                                                  <ActionDialog
                                                    open={!!match}
                                                    title={i18n.t(
                                                      "Remove Voucher"
                                                    )}
                                                    confirmButtonState={
                                                      removeTransitionState
                                                    }
                                                    onClose={() =>
                                                      navigate(voucherUrl(id))
                                                    }
                                                    variant="delete"
                                                    onConfirm={() =>
                                                      voucherDelete({
                                                        variables: { id }
                                                      })
                                                    }
                                                  >
                                                    <DialogContentText
                                                      dangerouslySetInnerHTML={{
                                                        __html: i18n.t(
                                                          "Are you sure you want to remove <strong>{{ voucherName }}</strong>?",
                                                          {
                                                            voucherName: maybe(
                                                              () =>
                                                                data.voucher
                                                                  .name
                                                            )
                                                          }
                                                        )
                                                      }}
                                                    />
                                                  </ActionDialog>
                                                )}
                                              />
                                              <Route
                                                path={voucherAssignCountriesPath(
                                                  ":id"
                                                )}
                                                render={({ match }) => (
                                                  <DiscountCountrySelectDialog
                                                    confirmButtonState={
                                                      formTransitionState
                                                    }
                                                    countries={maybe(
                                                      () => shop.countries,
                                                      []
                                                    )}
                                                    onClose={() =>
                                                      navigate(voucherUrl(id))
                                                    }
                                                    onConfirm={formData =>
                                                      voucherUpdate({
                                                        variables: {
                                                          id,
                                                          input: {
                                                            countries:
                                                              formData.countries
                                                          }
                                                        }
                                                      })
                                                    }
                                                    open={!!match}
                                                    initial={maybe(
                                                      () =>
                                                        data.voucher.countries.map(
                                                          country =>
                                                            country.code
                                                        ),
                                                      []
                                                    )}
                                                  />
                                                )}
                                              />
                                            </>
                                          )}
                                        </Paginator>
                                      );
                                    }}
                                  </TypedVoucherDetails>
                                )}
                              </TypedVoucherDelete>
                            )}
                          </TypedVoucherUpdate>
                        )}
                      </TypedVoucherCataloguesAdd>
                    )}
                  </TypedVoucherCataloguesRemove>
                );
              }}
            </Navigator>
          )}
        </Messages>
      )}
    </Shop>
  </>
);
export default VoucherDetails;
