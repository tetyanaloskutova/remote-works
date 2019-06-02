import * as React from "react";

import { TypedMutationInnerProps } from "../../mutations";
import { TypedSkillImagesReorder } from "../mutations";
import {
  SkillImageReorder,
  SkillImageReorderVariables
} from "../types/SkillImageReorder";

interface SkillImagesRetaskProviderProps
  extends TypedMutationInnerProps<
    SkillImageReorder,
    SkillImageReorderVariables
  > {
  skillId: string;
  skillImages: Array<{
    id: string;
    url: string;
  }>;
}

const SkillImagesRetaskProvider: React.StatelessComponent<
  SkillImagesRetaskProviderProps
> = ({ children, skillId, skillImages, ...mutationProps }) => (
  <TypedSkillImagesReorder {...mutationProps}>
    {(mutate, mutationResult) =>
      children(opts => {
        const skillImagesMap = skillImages.reduce((prev, curr) => {
          prev[curr.id] = curr;
          return prev;
        }, {});
        const newSkillImages = opts.variables.imagesIds.map((id, index) => ({
          __typename: "SkillImage",
          ...skillImagesMap[id],
          sortTask: index
        }));
        const optimisticResponse: typeof mutationResult["data"] = {
          skillImageReorder: {
            __typename: "SkillImageReorder",
            errors: null,
            skill: {
              __typename: "Skill",
              id: skillId,
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

export default SkillImagesRetaskProvider;
