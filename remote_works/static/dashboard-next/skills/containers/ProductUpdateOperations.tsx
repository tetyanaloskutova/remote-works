import * as React from "react";

import { getMutationProviderData, maybe } from "../../misc";
import { PartialMutationProviderOutput } from "../../types";
import {
  TypedSkillDeleteMutation,
  TypedSkillImageCreateMutation,
  TypedSkillImageDeleteMutation,
  TypedSkillUpdateMutation,
  TypedSimpleSkillUpdateMutation
} from "../mutations";
import { SkillDelete, SkillDeleteVariables } from "../types/SkillDelete";
import { SkillDetails_skill } from "../types/SkillDetails";
import {
  SkillImageCreate,
  SkillImageCreateVariables
} from "../types/SkillImageCreate";
import {
  SkillImageDelete,
  SkillImageDeleteVariables
} from "../types/SkillImageDelete";
import {
  SkillImageReorder,
  SkillImageReorderVariables
} from "../types/SkillImageReorder";
import { SkillUpdate, SkillUpdateVariables } from "../types/SkillUpdate";
import {
  SimpleSkillUpdate,
  SimpleSkillUpdateVariables
} from "../types/SimpleSkillUpdate";
import SkillImagesReorderProvider from "./SkillImagesReorder";

interface SkillUpdateOperationsProps {
  product: SkillDetails_product;
  children: (
    props: {
      createSkillImage: PartialMutationProviderOutput<
        SkillImageCreate,
        SkillImageCreateVariables
      >;
      deleteSkill: PartialMutationProviderOutput<
        SkillDelete,
        SkillDeleteVariables
      >;
      deleteSkillImage: PartialMutationProviderOutput<
        SkillImageDelete,
        SkillImageDeleteVariables
      >;
      reorderSkillImages: PartialMutationProviderOutput<
        SkillImageReorder,
        SkillImageReorderVariables
      >;
      updateSkill: PartialMutationProviderOutput<
        SkillUpdate,
        SkillUpdateVariables
      >;
      updateSimpleSkill: PartialMutationProviderOutput<
        SimpleSkillUpdate,
        SimpleSkillUpdateVariables
      >;
    }
  ) => React.ReactNode;
  onDelete?: (data: SkillDelete) => void;
  onImageCreate?: (data: SkillImageCreate) => void;
  onImageDelete?: (data: SkillImageDelete) => void;
  onImageReorder?: (data: SkillImageReorder) => void;
  onUpdate?: (data: SkillUpdate) => void;
}

const SkillUpdateOperations: React.StatelessComponent<
  SkillUpdateOperationsProps
> = ({
  product,
  children,
  onDelete,
  onImageDelete,
  onImageCreate,
  onImageReorder,
  onUpdate
}) => {
  const productId = skill ? product.id : "";
  return (
    <TypedSkillUpdateMutation onCompleted={onUpdate}>
      {(...updateSkill) => (
        <SkillImagesReorderProvider
          productId={productId}
          productImages={maybe(() => product.images, [])}
          onCompleted={onImageReorder}
        >
          {(...reorderSkillImages) => (
            <TypedSkillImageCreateMutation onCompleted={onImageCreate}>
              {(...createSkillImage) => (
                <TypedSkillDeleteMutation onCompleted={onDelete}>
                  {(...deleteSkill) => (
                    <TypedSkillImageDeleteMutation
                      onCompleted={onImageDelete}
                    >
                      {(...deleteSkillImage) => (
                        <TypedSimpleSkillUpdateMutation
                          onCompleted={onUpdate}
                        >
                          {(...updateSimpleSkill) =>
                            children({
                              createSkillImage: getMutationProviderData(
                                ...createSkillImage
                              ),
                              deleteSkill: getMutationProviderData(
                                ...deleteSkill
                              ),
                              deleteSkillImage: getMutationProviderData(
                                ...deleteSkillImage
                              ),
                              reorderSkillImages: getMutationProviderData(
                                ...reorderSkillImages
                              ),
                              updateSkill: getMutationProviderData(
                                ...updateSkill
                              ),
                              updateSimpleSkill: getMutationProviderData(
                                ...updateSimpleSkill
                              )
                            })
                          }
                        </TypedSimpleSkillUpdateMutation>
                      )}
                    </TypedSkillImageDeleteMutation>
                  )}
                </TypedSkillDeleteMutation>
              )}
            </TypedSkillImageCreateMutation>
          )}
        </SkillImagesReorderProvider>
      )}
    </TypedSkillUpdateMutation>
  );
};
export default SkillUpdateOperations;
