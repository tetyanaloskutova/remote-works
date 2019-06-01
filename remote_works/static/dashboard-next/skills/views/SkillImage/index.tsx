import DialogContentText from "@material-ui/core/DialogContentText";
import * as React from "react";
import { Route } from "react-router-dom";

import ActionDialog from "../../../components/ActionDialog";
import Messages from "../../../components/messages";
import Navigator from "../../../components/Navigator";
import i18n from "../../../i18n";
import { getMutationState, maybe } from "../../../misc";
import SkillImagePage from "../../components/SkillImagePage";
import {
  TypedSkillImageDeleteMutation,
  TypedSkillImageUpdateMutation
} from "../../mutations";
import { TypedSkillImageQuery } from "../../queries";
import { SkillImageUpdate } from "../../types/SkillImageUpdate";
import { skillImageUrl, skillUrl } from "../../urls";
import { skillImageRemovePath, skillImageRemoveUrl } from "./urls";

interface SkillImageProps {
  imageId: string;
  skillId: string;
}

export const SkillImage: React.StatelessComponent<SkillImageProps> = ({
  imageId,
  skillId
}) => (
  <Messages>
    {pushMessage => (
      <Navigator>
        {navigate => {
          const handleBack = () => navigate(skillUrl(skillId));
          const handleUpdateSuccess = (data: SkillImageUpdate) => {
            if (data.skillImageUpdate.errors.length === 0) {
              pushMessage({ text: "Saved changes" });
            }
          };
          return (
            <TypedSkillImageQuery
              displayLoader
              variables={{
                imageId,
                skillId
              }}
              require={["skill"]}
            >
              {({ data, loading }) => {
                return (
                  <TypedSkillImageUpdateMutation
                    onCompleted={handleUpdateSuccess}
                  >
                    {(updateImage, updateResult) => (
                      <TypedSkillImageDeleteMutation onCompleted={handleBack}>
                        {(deleteImage, deleteResult) => {
                          const handleDelete = () =>
                            deleteImage({ variables: { id: imageId } });
                          const handleImageClick = (id: string) => () =>
                            navigate(skillImageUrl(skillId, id));
                          const handleUpdate = (formData: {
                            description: string;
                          }) => {
                            updateImage({
                              variables: {
                                alt: formData.description,
                                id: imageId
                              }
                            });
                          };
                          const image =
                            data && data.skill && data.skill.mainImage;

                          const formTransitionState = getMutationState(
                            updateResult.called,
                            updateResult.loading,
                            maybe(
                              () => updateResult.data.skillImageUpdate.errors
                            )
                          );
                          const deleteTransitionState = getMutationState(
                            deleteResult.called,
                            deleteResult.loading,
                            []
                          );
                          return (
                            <>
                              <SkillImagePage
                                disabled={loading}
                                image={image || null}
                                images={maybe(() => data.skill.images)}
                                onBack={handleBack}
                                onDelete={() =>
                                  navigate(
                                    skillImageRemoveUrl(skillId, imageId)
                                  )
                                }
                                onRowClick={handleImageClick}
                                onSubmit={handleUpdate}
                                saveButtonBarState={formTransitionState}
                              />
                              <Route
                                path={skillImageRemovePath(
                                  ":skillId",
                                  ":imageId"
                                )}
                                render={({ match }) => (
                                  <ActionDialog
                                    onClose={() =>
                                      navigate(
                                        skillImageUrl(skillId, imageId)
                                      )
                                    }
                                    onConfirm={handleDelete}
                                    open={!!match}
                                    title={i18n.t("Remove image", {
                                      context: "modal title"
                                    })}
                                    variant="delete"
                                    confirmButtonState={deleteTransitionState}
                                  >
                                    <DialogContentText>
                                      {i18n.t(
                                        "Are you sure you want to remove this image?",
                                        {
                                          context: "modal content"
                                        }
                                      )}
                                    </DialogContentText>
                                  </ActionDialog>
                                )}
                              />
                            </>
                          );
                        }}
                      </TypedSkillImageDeleteMutation>
                    )}
                  </TypedSkillImageUpdateMutation>
                );
              }}
            </TypedSkillImageQuery>
          );
        }}
      </Navigator>
    )}
  </Messages>
);
export default SkillImage;
