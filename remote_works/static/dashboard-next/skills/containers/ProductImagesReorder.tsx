import * as React from "react";

import { TypedMutationInnerProps } from "../../mutations";
import { TypedSkillImagesReorder } from "../mutations";
import {
  SkillImageReorder,
  SkillImageReorderVariables
} from "../types/SkillImageReorder";

interface SkillImagesReorderProviderProps
  extends TypedMutationInnerProps<
    SkillImageReorder,
    SkillImageReorderVariables
  > {
  productId: string;
  productImages: Array<{
    id: string;
    url: string;
  }>;
}

const SkillImagesReorderProvider: React.StatelessComponent<
  SkillImagesReorderProviderProps
> = ({ children, productId, productImages, ...mutationProps }) => (
  <TypedSkillImagesReorder {...mutationProps}>
    {(mutate, mutationResult) =>
      children(opts => {
        const productImagesMap = productImages.reduce((prev, curr) => {
          prev[curr.id] = curr;
          return prev;
        }, {});
        const newSkillImages = opts.variables.imagesIds.map((id, index) => ({
          __typename: "SkillImage",
          ...productImagesMap[id],
          sortOrder: index
        }));
        const optimisticResponse: typeof mutationResult["data"] = {
          productImageReorder: {
            __typename: "SkillImageReorder",
            errors: null,
            product: {
              __typename: "Skill",
              id: productId,
              images: newSkillImages
            }
          }
        };
        return mutate({
          ...opts,
          optimisticResponse
        });
      }, mutationResult)
    }
  </TypedSkillImagesReorder>
);

export default SkillImagesReorderProvider;
