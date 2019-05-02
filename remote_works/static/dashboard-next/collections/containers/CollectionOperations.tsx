import * as React from "react";

import { getMutationProviderData } from "../../misc";
import { PartialMutationProviderOutput } from "../../types";
import {
  TypedCollectionAssignSkillMutation,
  TypedCollectionRemoveMutation,
  TypedCollectionUpdateMutation,
  TypedCollectionUpdateWithHomepageMutation,
  TypedUnassignCollectionSkillMutation
} from "../mutations";
import {
  CollectionAssignSkill,
  CollectionAssignSkillVariables
} from "../types/CollectionAssignSkill";
import {
  CollectionUpdate,
  CollectionUpdateVariables
} from "../types/CollectionUpdate";
import {
  CollectionUpdateWithHomepage,
  CollectionUpdateWithHomepageVariables
} from "../types/CollectionUpdateWithHomepage";
import {
  RemoveCollection,
  RemoveCollectionVariables
} from "../types/RemoveCollection";
import {
  UnassignCollectionSkill,
  UnassignCollectionSkillVariables
} from "../types/UnassignCollectionSkill";

interface CollectionUpdateOperationsProps {
  children: (
    props: {
      updateCollectionWithHomepage: PartialMutationProviderOutput<
        CollectionUpdateWithHomepage,
        CollectionUpdateWithHomepageVariables
      >;
      assignSkill: PartialMutationProviderOutput<
        CollectionAssignSkill,
        CollectionAssignSkillVariables
      >;
      unassignSkill: PartialMutationProviderOutput<
        UnassignCollectionSkill,
        UnassignCollectionSkillVariables
      >;
      updateCollection: PartialMutationProviderOutput<
        CollectionUpdate,
        CollectionUpdateVariables
      >;
      removeCollection: PartialMutationProviderOutput<
        RemoveCollection,
        RemoveCollectionVariables
      >;
    }
  ) => React.ReactNode;
  onUpdate: (data: CollectionUpdate) => void;
  onSkillAssign: (data: CollectionAssignSkill) => void;
  onSkillUnassign: (data: UnassignCollectionSkill) => void;
  onRemove: (data: RemoveCollection) => void;
}

const CollectionOperations: React.StatelessComponent<
  CollectionUpdateOperationsProps
> = ({ children, onUpdate, onSkillAssign, onSkillUnassign, onRemove }) => (
  <TypedCollectionUpdateMutation onCompleted={onUpdate}>
    {(...updateCollection) => (
      <TypedCollectionRemoveMutation onCompleted={onRemove}>
        {(...removeCollection) => (
          <TypedCollectionAssignSkillMutation onCompleted={onSkillAssign}>
            {(...assignSkill) => (
              <TypedCollectionUpdateWithHomepageMutation onCompleted={onUpdate}>
                {(...updateWithHomepage) => (
                  <TypedUnassignCollectionSkillMutation
                    onCompleted={onSkillUnassign}
                  >
                    {(...unassignSkill) =>
                      children({
                        assignSkill: getMutationProviderData(
                          ...assignSkill
                        ),
                        removeCollection: getMutationProviderData(
                          ...removeCollection
                        ),
                        unassignSkill: getMutationProviderData(
                          ...unassignSkill
                        ),
                        updateCollection: getMutationProviderData(
                          ...updateCollection
                        ),
                        updateCollectionWithHomepage: getMutationProviderData(
                          ...updateWithHomepage
                        )
                      })
                    }
                  </TypedUnassignCollectionSkillMutation>
                )}
              </TypedCollectionUpdateWithHomepageMutation>
            )}
          </TypedCollectionAssignSkillMutation>
        )}
      </TypedCollectionRemoveMutation>
    )}
  </TypedCollectionUpdateMutation>
);
export default CollectionOperations;
