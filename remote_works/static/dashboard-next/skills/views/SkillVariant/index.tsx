import * as React from "react";
import { Route } from "react-router-dom";

import * as placeholderImg from "../../../../images/placeholder255x255.png";
import ErrorMessageCard from "../../../components/ErrorMessageCard";
import Messages from "../../../components/messages";
import Navigator from "../../../components/Navigator";
import { WindowTitle } from "../../../components/WindowTitle";
import i18n from "../../../i18n";
import { decimal, getMutationState, maybe } from "../../../misc";
import SkillVariantDeleteDialog from "../../components/SkillVariantDeleteDialog";
import SkillVariantPage from "../../components/SkillVariantPage";
import SkillVariantOperations from "../../containers/SkillVariantOperations";
import { TypedSkillVariantQuery } from "../../queries";
import { VariantUpdate } from "../../types/VariantUpdate";
import { skillUrl, skillVariantEditUrl } from "../../urls";
import { skillVariantRemovePath, skillVariantRemoveUrl } from "./urls";

interface SkillUpdateProps {
  variantId: string;
  skillId: string;
}

interface FormData {
  id: string;
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
  variantId,
  skillId
}) => (
  <Navigator>
    {navigate => (
      <Messages>
        {pushMessage => (
          <TypedSkillVariantQuery
            displayLoader
            variables={{ id: variantId }}
            require={["skillVariant"]}
          >
            {({ data, loading, error }) => {
              if (error) {
                return <ErrorMessageCard message="Something went wrong" />;
              }
              const variant = data ? data.skillVariant : undefined;
              const handleBack = () => navigate(skillUrl(skillId));
              const handleDelete = () => {
                pushMessage({ text: i18n.t("Variant removed") });
                navigate(skillUrl(skillId));
              };
              const handleUpdate = (data: VariantUpdate) => {
                if (!maybe(() => data.skillVariantUpdate.errors.length)) {
                  pushMessage({ text: i18n.t("Changes saved") });
                }
              };

              return (
                <SkillVariantOperations
                  onDelete={handleDelete}
                  onUpdate={handleUpdate}
                >
                  {({
                    assignImage,
                    deleteVariant,
                    updateVariant,
                    unassignImage
                  }) => {
                    const disableFormSave =
                      loading ||
                      deleteVariant.opts.loading ||
                      updateVariant.opts.loading ||
                      assignImage.opts.loading ||
                      unassignImage.opts.loading;
                    const formTransitionState = getMutationState(
                      updateVariant.opts.called,
                      updateVariant.opts.loading,
                      maybe(
                        () =>
                          updateVariant.opts.data.skillVariantUpdate.errors
                      )
                    );
                    const removeTransitionState = getMutationState(
                      deleteVariant.opts.called,
                      deleteVariant.opts.loading,
                      maybe(
                        () =>
                          deleteVariant.opts.data.skillVariantDelete.errors
                      )
                    );
                    const handleImageSelect = (id: string) => () => {
                      if (variant) {
                        if (
                          variant.images &&
                          variant.images.map(image => image.id).indexOf(id) !==
                            -1
                        ) {
                          unassignImage.mutate({
                            imageId: id,
                            variantId: variant.id
                          });
                        } else {
                          assignImage.mutate({
                            imageId: id,
                            variantId: variant.id
                          });
                        }
                      }
                    };

                    return (
                      <>
                        <WindowTitle
                          title={maybe(() => data.skillVariant.name)}
                        />
                        <SkillVariantPage
                          errors={maybe(
                            () =>
                              updateVariant.opts.data.skillVariantUpdate
                                .errors,
                            []
                          )}
                          saveButtonBarState={formTransitionState}
                          loading={disableFormSave}
                          placeholderImage={placeholderImg}
                          variant={variant}
                          header={
                            variant ? variant.name || variant.sku : undefined
                          }
                          onBack={handleBack}
                          onDelete={() =>
                            navigate(
                              skillVariantRemoveUrl(skillId, variantId)
                            )
                          }
                          onImageSelect={handleImageSelect}
                          onSubmit={(data: FormData) => {
                            if (variant) {
                              updateVariant.mutate({
                                attributes: data.attributes
                                  ? data.attributes
                                  : null,
                                costPrice: decimal(data.costPrice),
                                id: variantId,
                                priceOverride: decimal(data.priceOverride),
                                quantity: data.quantity || null,
                                sku: data.sku,
                                trackInventory: true // FIXME: missing in UI
                              });
                            }
                          }}
                          onVariantClick={variantId => {
                            navigate(
                              skillVariantEditUrl(skillId, variantId)
                            );
                          }}
                        />
                        <Route
                          path={skillVariantRemovePath(
                            ":skillId",
                            ":variantId"
                          )}
                          render={({ match }) => (
                            <SkillVariantDeleteDialog
                              confirmButtonState={removeTransitionState}
                              onClose={() =>
                                navigate(
                                  skillVariantEditUrl(skillId, variantId)
                                )
                              }
                              onConfirm={() =>
                                deleteVariant.mutate({
                                  id: variantId
                                })
                              }
                              open={!!match}
                              name={maybe(() => data.skillVariant.name)}
                            />
                          )}
                        />
                      </>
                    );
                  }}
                </SkillVariantOperations>
              );
            }}
          </TypedSkillVariantQuery>
        )}
      </Messages>
    )}
  </Navigator>
);
export default SkillVariant;
