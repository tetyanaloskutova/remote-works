import * as React from "react";

import { getMutationProviderData } from "../../misc";
import { PartialMutationProviderOutput } from "../../types";
import {
  TypedAttributeCreateMutation,
  TypedAttributeDeleteMutation,
  TypedAttributeUpdateMutation,
  TypedSkillTypeDeleteMutation,
  TypedSkillTypeUpdateMutation
} from "../mutations";
import {
  AttributeCreate,
  AttributeCreateVariables
} from "../types/AttributeCreate";
import {
  AttributeDelete,
  AttributeDeleteVariables
} from "../types/AttributeDelete";
import {
  AttributeUpdate,
  AttributeUpdateVariables
} from "../types/AttributeUpdate";
import {
  SkillTypeDelete,
  SkillTypeDeleteVariables
} from "../types/SkillTypeDelete";
import {
  SkillTypeUpdate,
  SkillTypeUpdateVariables
} from "../types/SkillTypeUpdate";

interface SkillTypeOperationsProps {
  children: (
    props: {
      attributeCreate: PartialMutationProviderOutput<
        AttributeCreate,
        AttributeCreateVariables
      >;
      deleteAttribute: PartialMutationProviderOutput<
        AttributeDelete,
        AttributeDeleteVariables
      >;
      deleteSkillType: PartialMutationProviderOutput<
        SkillTypeDelete,
        SkillTypeDeleteVariables
      >;
      updateAttribute: PartialMutationProviderOutput<
        AttributeUpdate,
        AttributeUpdateVariables
      >;
      updateSkillType: PartialMutationProviderOutput<
        SkillTypeUpdate,
        SkillTypeUpdateVariables
      >;
    }
  ) => React.ReactNode;
  onAttributeCreate: (data: AttributeCreate) => void;
  onAttributeDelete: (data: AttributeDelete) => void;
  onAttributeUpdate: (data: AttributeUpdate) => void;
  onSkillTypeDelete: (data: SkillTypeDelete) => void;
  onSkillTypeUpdate: (data: SkillTypeUpdate) => void;
}

const SkillTypeOperations: React.StatelessComponent<
  SkillTypeOperationsProps
> = ({
  children,
  onAttributeCreate,
  onAttributeDelete,
  onAttributeUpdate,
  onSkillTypeDelete,
  onSkillTypeUpdate
}) => {
  return (
    <TypedSkillTypeDeleteMutation onCompleted={onSkillTypeDelete}>
      {(...deleteSkillType) => (
        <TypedSkillTypeUpdateMutation onCompleted={onSkillTypeUpdate}>
          {(...updateSkillType) => (
            <TypedAttributeCreateMutation onCompleted={onAttributeCreate}>
              {(...createAttribute) => (
                <TypedAttributeDeleteMutation onCompleted={onAttributeDelete}>
                  {(...deleteAttribute) => (
                    <TypedAttributeUpdateMutation
                      onCompleted={onAttributeUpdate}
                    >
                      {(...updateAttribute) =>
                        children({
                          attributeCreate: getMutationProviderData(
                            ...createAttribute
                          ),
                          deleteAttribute: getMutationProviderData(
                            ...deleteAttribute
                          ),
                          deleteSkillType: getMutationProviderData(
                            ...deleteSkillType
                          ),
                          updateAttribute: getMutationProviderData(
                            ...updateAttribute
                          ),
                          updateSkillType: getMutationProviderData(
                            ...updateSkillType
                          )
                        })
                      }
                    </TypedAttributeUpdateMutation>
                  )}
                </TypedAttributeDeleteMutation>
              )}
            </TypedAttributeCreateMutation>
          )}
        </TypedSkillTypeUpdateMutation>
      )}
    </TypedSkillTypeDeleteMutation>
  );
};
export default SkillTypeOperations;
