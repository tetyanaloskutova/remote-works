import DialogContentText from "@material-ui/core/DialogContentText";
import * as React from "react";
import { Route } from "react-router-dom";

import ActionDialog from "../../../components/ActionDialog";
import Messages from "../../../components/messages";
import Navigator from "../../../components/Navigator";
import { WindowTitle } from "../../../components/WindowTitle";
import i18n from "../../../i18n";
import { getMutationState, maybe } from "../../../misc";
import { AttributeTypeEnum } from "../../../types/globalTypes";
import SkillTypeAttributeEditDialog, {
  FormData as AttributeForm
} from "../../components/SkillTypeAttributeEditDialog";
import SkillTypeDetailsPage, {
  SkillTypeForm
} from "../../components/SkillTypeDetailsPage";
import SkillTypeOperations from "../../containers/SkillTypeOperations";
import { TypedSkillTypeDetailsQuery } from "../../queries";
import { AttributeCreate } from "../../types/AttributeCreate";
import { AttributeDelete } from "../../types/AttributeDelete";
import { AttributeUpdate } from "../../types/AttributeUpdate";
import { SkillTypeDelete } from "../../types/SkillTypeDelete";
import { SkillTypeUpdate as SkillTypeUpdateMutation } from "../../types/SkillTypeUpdate";
import { skillTypeListUrl, skillTypeUrl } from "../../urls";
import { SkillTypeUpdateErrors } from "./errors";
import {
  addAttributePath,
  addAttributeUrl,
  editAttributePath,
  editAttributeUrl,
  skillTypeRemovePath,
  skillTypeRemoveUrl
} from "./urls";

interface SkillTypeUpdateProps {
  id: string;
}

export const SkillTypeUpdate: React.StatelessComponent<
  SkillTypeUpdateProps
> = ({ id }) => (
  <Messages>
    {pushMessage => (
      <Navigator>
        {navigate => (
          <SkillTypeUpdateErrors>
            {({ errors, set: setErrors }) => (
              <TypedSkillTypeDetailsQuery
                displayLoader
                variables={{ id }}
                require={["skillType"]}
              >
                {({ data, loading: dataLoading }) => {
                  const closeModal = () => {
                    navigate(skillTypeUrl(id), true);
                    setErrors.addAttributeErrors([]);
                    setErrors.editAttributeErrors([]);
                  };
                  const handleAttributeCreateSuccess = (
                    data: AttributeCreate
                  ) => {
                    if (data.attributeCreate.errors.length === 0) {
                      pushMessage({
                        text: i18n.t("Attribute created", {
                          context: "notification"
                        })
                      });
                      closeModal();
                    } else if (
                      data.attributeCreate.errors !== null &&
                      data.attributeCreate.errors.length > 0
                    ) {
                      setErrors.addAttributeErrors(data.attributeCreate.errors);
                    }
                  };
                  const handleAttributeDeleteSuccess = (
                    data: AttributeDelete
                  ) => {
                    if (!data.attributeDelete.errors) {
                      pushMessage({
                        text: i18n.t("Attribute deleted", {
                          context: "notification"
                        })
                      });
                    }
                  };
                  const handleAttributeUpdateSuccess = (
                    data: AttributeUpdate
                  ) => {
                    if (data.attributeUpdate.errors.length === 0) {
                      pushMessage({
                        text: i18n.t("Attribute updated", {
                          context: "notification"
                        })
                      });
                      closeModal();
                    } else if (
                      data.attributeUpdate.errors !== null &&
                      data.attributeUpdate.errors.length > 0
                    ) {
                      setErrors.editAttributeErrors(
                        data.attributeUpdate.errors
                      );
                    }
                  };
                  const handleSkillTypeDeleteSuccess = (
                    deleteData: SkillTypeDelete
                  ) => {
                    if (deleteData.skillTypeDelete.errors.length === 0) {
                      pushMessage({
                        text: i18n.t("Skill type deleted", {
                          context: "notification"
                        })
                      });
                      navigate(skillTypeListUrl);
                    }
                  };
                  const handleSkillTypeUpdateSuccess = (
                    updateData: SkillTypeUpdateMutation
                  ) => {
                    if (
                      !updateData.skillTypeUpdate.errors ||
                      updateData.skillTypeUpdate.errors.length === 0
                    ) {
                      pushMessage({
                        text: i18n.t("Skill type updated", {
                          context: "notification"
                        })
                      });
                    } else if (
                      updateData.skillTypeUpdate.errors !== null &&
                      updateData.skillTypeUpdate.errors.length > 0
                    ) {
                      setErrors.formErrors(updateData.skillTypeUpdate.errors);
                    }
                  };

                  return (
                    <SkillTypeOperations
                      onAttributeCreate={handleAttributeCreateSuccess}
                      onAttributeDelete={handleAttributeDeleteSuccess}
                      onAttributeUpdate={handleAttributeUpdateSuccess}
                      onSkillTypeDelete={handleSkillTypeDeleteSuccess}
                      onSkillTypeUpdate={handleSkillTypeUpdateSuccess}
                    >
                      {({
                        attributeCreate,
                        deleteAttribute,
                        deleteSkillType,
                        updateAttribute,
                        updateSkillType
                      }) => {
                        const handleSkillTypeDelete = () =>
                          deleteSkillType.mutate({ id });
                        const handleSkillTypeUpdate = (
                          formData: SkillTypeForm
                        ) => {
                          updateSkillType.mutate({
                            id,
                            input: {
                              hasVariants: formData.hasVariants,
                              isDeliveryRequired: formData.isDeliveryRequired,
                              name: formData.name,
                              skillAttributes: formData.skillAttributes.map(
                                choice => choice.value
                              ),
                              taxRate: formData.taxRate,
                              variantAttributes: formData.variantAttributes.map(
                                choice => choice.value
                              ),
                              weight: formData.weight
                            }
                          });
                        };
                        const handleAttributeCreate = (
                          data: AttributeForm,
                          type: AttributeTypeEnum
                        ) =>
                          attributeCreate.mutate({
                            id,
                            input: {
                              name: data.name,
                              values: data.values.map(value => ({
                                name: value.label
                              }))
                            },
                            type
                          });
                        const handleAttributeDelete = (
                          id: string,
                          event: React.MouseEvent<any>
                        ) => {
                          event.stopPropagation();
                          deleteAttribute.mutate({ id });
                        };
                        const handleAttributeUpdate = (
                          id: string,
                          formData: AttributeForm
                        ) => {
                          const attribute = data.skillType.variantAttributes
                            .concat(data.skillType.skillAttributes)
                            .filter(attribute => attribute.id === id)[0];
                          updateAttribute.mutate({
                            id,
                            input: {
                              addValues: formData.values
                                .filter(
                                  value =>
                                    !attribute.values
                                      .map(value => value.id)
                                      .includes(value.value)
                                )
                                .map(value => ({
                                  name: value.label
                                })),
                              name: formData.name,
                              removeValues: attribute.values
                                .filter(
                                  value =>
                                    !formData.values
                                      .map(value => value.value)
                                      .includes(value.id)
                                )
                                .map(value => value.id)
                            }
                          });
                        };
                        const loading =
                          updateSkillType.opts.loading || dataLoading;
                        const deleteTransactionState = getMutationState(
                          deleteSkillType.opts.called,
                          deleteSkillType.opts.loading,
                          maybe(
                            () =>
                              deleteSkillType.opts.data.skillTypeDelete
                                .errors
                          )
                        );
                        return (
                          <>
                            <WindowTitle
                              title={maybe(() => data.skillType.name)}
                            />
                            <SkillTypeDetailsPage
                              defaultWeightUnit={maybe(
                                () => data.shop.defaultWeightUnit
                              )}
                              disabled={loading}
                              errors={errors.formErrors}
                              pageTitle={maybe(() => data.skillType.name)}
                              skillType={maybe(() => data.skillType)}
                              saveButtonBarState={
                                loading ? "loading" : "default"
                              }
                              onAttributeAdd={type =>
                                navigate(
                                  addAttributeUrl(encodeURIComponent(id), type)
                                )
                              }
                              onAttributeDelete={handleAttributeDelete}
                              onAttributeUpdate={attributeId =>
                                navigate(
                                  editAttributeUrl(
                                    encodeURIComponent(id),
                                    encodeURIComponent(attributeId)
                                  )
                                )
                              }
                              onBack={() => navigate(skillTypeListUrl)}
                              onDelete={() =>
                                navigate(skillTypeRemoveUrl(id))
                              }
                              onSubmit={handleSkillTypeUpdate}
                            />
                            {!dataLoading && (
                              <>
                                {Object.keys(AttributeTypeEnum).map(key => (
                                  <Route
                                    exact
                                    path={addAttributePath(
                                      encodeURIComponent(id),
                                      AttributeTypeEnum[key]
                                    )}
                                    key={key}
                                  >
                                    {({ match }) => (
                                      <SkillTypeAttributeEditDialog
                                        disabled={attributeCreate.opts.loading}
                                        errors={errors.addAttributeErrors}
                                        name=""
                                        values={[]}
                                        onClose={closeModal}
                                        onConfirm={data =>
                                          handleAttributeCreate(
                                            data,
                                            AttributeTypeEnum[key]
                                          )
                                        }
                                        opened={!!match}
                                        title={i18n.t("Add Attribute", {
                                          context: "modal title"
                                        })}
                                      />
                                    )}
                                  </Route>
                                ))}
                                <Route
                                  exact
                                  path={editAttributePath(
                                    ":skillTypeId",
                                    ":id"
                                  )}
                                >
                                  {({ match }) => {
                                    const attribute = maybe(
                                      () =>
                                        data.skillType.skillAttributes
                                          .concat(
                                            data.skillType.variantAttributes
                                          )
                                          .filter(
                                            attribute =>
                                              attribute.id ===
                                              decodeURIComponent(
                                                match.params.id
                                              )
                                          )[0]
                                    );
                                    return (
                                      <SkillTypeAttributeEditDialog
                                        disabled={updateAttribute.opts.loading}
                                        errors={errors.editAttributeErrors}
                                        name={maybe(() => attribute.name)}
                                        values={maybe(() =>
                                          attribute.values.map(value => ({
                                            label: value.name,
                                            value: value.id
                                          }))
                                        )}
                                        onClose={closeModal}
                                        onConfirm={data =>
                                          handleAttributeUpdate(
                                            decodeURIComponent(match.params.id),
                                            data
                                          )
                                        }
                                        opened={!!match}
                                        title={i18n.t("Edit Attribute", {
                                          context: "modal title"
                                        })}
                                      />
                                    );
                                  }}
                                </Route>
                                <Route
                                  path={skillTypeRemovePath(":id")}
                                  render={({ match }) => (
                                    <ActionDialog
                                      confirmButtonState={
                                        deleteTransactionState
                                      }
                                      open={!!match}
                                      onClose={() =>
                                        navigate(skillTypeUrl(id))
                                      }
                                      onConfirm={handleSkillTypeDelete}
                                      title={i18n.t("Remove skill type")}
                                      variant="delete"
                                    >
                                      <DialogContentText
                                        dangerouslySetInnerHTML={{
                                          __html: i18n.t(
                                            "Are you sure you want to remove <strong>{{ name }}</strong>?",
                                            {
                                              name: maybe(
                                                () => data.skillType.name
                                              )
                                            }
                                          )
                                        }}
                                      />
                                    </ActionDialog>
                                  )}
                                />
                              </>
                            )}
                          </>
                        );
                      }}
                    </SkillTypeOperations>
                  );
                }}
              </TypedSkillTypeDetailsQuery>
            )}
          </SkillTypeUpdateErrors>
        )}
      </Navigator>
    )}
  </Messages>
);
export default SkillTypeUpdate;
