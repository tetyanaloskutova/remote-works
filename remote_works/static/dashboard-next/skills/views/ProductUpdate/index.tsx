import DialogContentText from "@material-ui/core/DialogContentText";
import * as React from "react";
import { Route } from "react-router-dom";
import { arrayMove } from "react-sortable-hoc";

import * as placeholderImg from "../../../../images/placeholder255x255.png";
import ActionDialog from "../../../components/ActionDialog";
import Messages from "../../../components/messages";
import Navigator from "../../../components/Navigator";
import { WindowTitle } from "../../../components/WindowTitle";
import i18n from "../../../i18n";
import { decimal, getMutationState, maybe } from "../../../misc";
import { skillTypeUrl } from "../../../skillTypes/urls";
import SkillUpdatePage, {
  FormData
} from "../../components/SkillUpdatePage";
import { CategorySearchProvider } from "../../containers/CategorySearch";
import { CollectionSearchProvider } from "../../containers/CollectionSearch";
import SkillUpdateOperations from "../../containers/SkillUpdateOperations";
import { TypedSkillDetailsQuery } from "../../queries";
import {
  SkillImageCreate,
  SkillImageCreateVariables
} from "../../types/SkillImageCreate";
import {
  skillImageUrl,
  skillListUrl,
  skillUrl,
  skillVariantAddUrl,
  skillVariantEditUrl
} from "../../urls";
import { skillRemovePath, skillRemoveUrl } from "./urls";

interface SkillUpdateProps {
  id: string;
}

export const SkillUpdate: React.StatelessComponent<SkillUpdateProps> = ({
  id
}) => (
  <Messages>
    {pushMessage => {
      return (
        <Navigator>
          {navigate => {
            return (
              <CategorySearchProvider>
                {({
                  search: searchCategories,
                  searchOpts: searchCategoriesOpts
                }) => (
                  <CollectionSearchProvider>
                    {({
                      search: searchCollections,
                      searchOpts: searchCollectionsOpts
                    }) => (
                      <TypedSkillDetailsQuery
                        displayLoader
                        require={["skill"]}
                        variables={{ id }}
                      >
                        {({ data, loading }) => {
                          const handleDelete = () => {
                            pushMessage({ text: i18n.t("Skill removed") });
                            navigate(skillListUrl());
                          };
                          const handleUpdate = () =>
                            pushMessage({ text: i18n.t("Saved changes") });
                          const handleImageCreate = (
                            data: SkillImageCreate
                          ) => {
                            const imageError = data.skillImageCreate.errors.find(
                              error =>
                                error.field ===
                                ("image" as keyof SkillImageCreateVariables)
                            );
                            if (imageError) {
                              pushMessage({
                                text: imageError.message
                              });
                            }
                          };
                          const handleImageDeleteSuccess = () =>
                            pushMessage({
                              text: i18n.t("Image successfully deleted")
                            });
                          const handleVariantAdd = () =>
                            navigate(skillVariantAddUrl(id));

                          const skill = data ? data.skill : undefined;
                          return (
                            <SkillUpdateOperations
                              skill={skill}
                              onDelete={handleDelete}
                              onImageCreate={handleImageCreate}
                              onImageDelete={handleImageDeleteSuccess}
                              onUpdate={handleUpdate}
                            >
                              {({
                                createSkillImage,
                                deleteSkill,
                                deleteSkillImage,
                                reorderSkillImages,
                                updateSkill,
                                updateSimpleSkill
                              }) => {
                                const handleImageDelete = (id: string) => () =>
                                  deleteSkillImage.mutate({ id });
                                const handleImageEdit = (
                                  imageId: string
                                ) => () =>
                                  navigate(skillImageUrl(id, imageId));
                                const handleSubmit = (data: FormData) => {
                                  if (skill) {
                                    if (skill.skillType.hasVariants) {
                                      updateSkill.mutate({
                                        attributes: data.attributes,
                                        category: data.category.value,
                                        chargeTaxes: data.chargeTaxes,
                                        collections: data.collections.map(
                                          collection => collection.value
                                        ),
                                        descriptionJson: JSON.stringify(
                                          data.description
                                        ),
                                        id: skill.id,
                                        isPublished: data.available,
                                        name: data.name,
                                        price: decimal(data.price),
                                        publicationDate:
                                          data.publicationDate !== ""
                                            ? data.publicationDate
                                            : null
                                      });
                                    } else {
                                      updateSimpleSkill.mutate({
                                        attributes: data.attributes,
                                        category: data.category.value,
                                        chargeTaxes: data.chargeTaxes,
                                        collections: data.collections.map(
                                          collection => collection.value
                                        ),
                                        descriptionJson: JSON.stringify(
                                          data.description
                                        ),
                                        id: skill.id,
                                        isPublished: data.available,
                                        name: data.name,
                                        price: decimal(data.price),
                                        skillVariantId:
                                          skill.variants[0].id,
                                        skillVariantInput: {
                                          quantity: data.stockQuantity,
                                          sku: data.sku
                                        },
                                        publicationDate:
                                          data.publicationDate !== ""
                                            ? data.publicationDate
                                            : null
                                      });
                                    }
                                  }
                                };

                                const disableFormSave =
                                  createSkillImage.opts.loading ||
                                  deleteSkill.opts.loading ||
                                  reorderSkillImages.opts.loading ||
                                  updateSkill.opts.loading ||
                                  loading;
                                const formTransitionState = getMutationState(
                                  updateSkill.opts.called ||
                                    updateSimpleSkill.opts.called,
                                  updateSkill.opts.loading ||
                                    updateSimpleSkill.opts.loading,
                                  maybe(
                                    () =>
                                      updateSkill.opts.data.skillUpdate
                                        .errors
                                  ),
                                  maybe(
                                    () =>
                                      updateSimpleSkill.opts.data
                                        .skillUpdate.errors
                                  ),
                                  maybe(
                                    () =>
                                      updateSimpleSkill.opts.data
                                        .skillVariantUpdate.errors
                                  )
                                );
                                const deleteTransitionState = getMutationState(
                                  deleteSkill.opts.called,
                                  deleteSkill.opts.loading,
                                  maybe(
                                    () =>
                                      deleteSkill.opts.data.skillDelete
                                        .errors
                                  )
                                );
                                return (
                                  <>
                                    <WindowTitle
                                      title={maybe(() => data.skill.name)}
                                    />
                                    <SkillUpdatePage
                                      categories={maybe(
                                        () =>
                                          searchCategoriesOpts.data.categories
                                            .edges,
                                        []
                                      ).map(edge => edge.node)}
                                      collections={maybe(
                                        () =>
                                          searchCollectionsOpts.data.collections
                                            .edges,
                                        []
                                      ).map(edge => edge.node)}
                                      disabled={disableFormSave}
                                      errors={maybe(
                                        () =>
                                          updateSkill.opts.data.skillUpdate
                                            .errors,
                                        []
                                      )}
                                      fetchCategories={searchCategories}
                                      fetchCollections={searchCollections}
                                      saveButtonBarState={formTransitionState}
                                      images={maybe(() => data.skill.images)}
                                      header={maybe(() => skill.name)}
                                      placeholderImage={placeholderImg}
                                      skill={skill}
                                      skillCollections={maybe(
                                        () => skill.collections
                                      )}
                                      variants={maybe(() => skill.variants)}
                                      onAttributesEdit={() =>
                                        navigate(
                                          skillTypeUrl(
                                            data.skill.skillType.id
                                          )
                                        )
                                      }
                                      onBack={() => {
                                        navigate(skillListUrl());
                                      }}
                                      onDelete={() =>
                                        navigate(skillRemoveUrl(id))
                                      }
                                      onSkillShow={() => {
                                        if (skill) {
                                          window.open(skill.url);
                                        }
                                      }}
                                      onImageReorder={({
                                        newIndex,
                                        oldIndex
                                      }) => {
                                        if (skill) {
                                          let ids = skill.images.map(
                                            image => image.id
                                          );
                                          ids = arrayMove(
                                            ids,
                                            oldIndex,
                                            newIndex
                                          );
                                          reorderSkillImages.mutate({
                                            imagesIds: ids,
                                            skillId: skill.id
                                          });
                                        }
                                      }}
                                      onSubmit={handleSubmit}
                                      onVariantAdd={handleVariantAdd}
                                      onVariantShow={variantId => () =>
                                        navigate(
                                          skillVariantEditUrl(
                                            skill.id,
                                            variantId
                                          )
                                        )}
                                      onImageUpload={file => {
                                        if (skill) {
                                          createSkillImage.mutate({
                                            alt: "",
                                            image: file,
                                            skill: skill.id
                                          });
                                        }
                                      }}
                                      onImageEdit={handleImageEdit}
                                      onImageDelete={handleImageDelete}
                                    />
                                    <Route
                                      path={skillRemovePath(":id")}
                                      render={({ match }) => (
                                        <ActionDialog
                                          open={!!match}
                                          onClose={() =>
                                            navigate(skillUrl(id))
                                          }
                                          confirmButtonState={
                                            deleteTransitionState
                                          }
                                          onConfirm={() =>
                                            deleteSkill.mutate({ id })
                                          }
                                          variant="delete"
                                          title={i18n.t("Remove skill")}
                                        >
                                          <DialogContentText
                                            dangerouslySetInnerHTML={{
                                              __html: i18n.t(
                                                "Are you sure you want to remove <strong>{{ name }}</strong>?",
                                                {
                                                  name: skill
                                                    ? skill.name
                                                    : undefined
                                                }
                                              )
                                            }}
                                          />
                                        </ActionDialog>
                                      )}
                                    />
                                  </>
                                );
                              }}
                            </SkillUpdateOperations>
                          );
                        }}
                      </TypedSkillDetailsQuery>
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
);
export default SkillUpdate;
