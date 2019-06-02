import gql from "graphql-tag";

import { TypedMutation } from "../mutations";
import { attributeFragment, skillTypeDetailsFragment } from "./queries";
import {
  AttributeCreate,
  AttributeCreateVariables
} from "./types/AttributeCreate";
import {
  AttributeDelete,
  AttributeDeleteVariables
} from "./types/AttributeDelete";
import {
  AttributeUpdate,
  AttributeUpdateVariables
} from "./types/AttributeUpdate";
import {
  SkillTypeCreate,
  SkillTypeCreateVariables
} from "./types/SkillTypeCreate";
import {
  SkillTypeDelete,
  SkillTypeDeleteVariables
} from "./types/SkillTypeDelete";
import {
  SkillTypeUpdate,
  SkillTypeUpdateVariables
} from "./types/SkillTypeUpdate";

export const skillTypeDeleteMutation = gql`
  mutation SkillTypeDelete($id: ID!) {
    skillTypeDelete(id: $id) {
      errors {
        field
        message
      }
      skillType {
        id
      }
    }
  }
`;
export const TypedSkillTypeDeleteMutation = TypedMutation<
  SkillTypeDelete,
  SkillTypeDeleteVariables
>(skillTypeDeleteMutation);

export const skillTypeUpdateMutation = gql`
  ${skillTypeDetailsFragment}
  mutation SkillTypeUpdate($id: ID!, $input: SkillTypeInput!) {
    skillTypeUpdate(id: $id, input: $input) {
      errors {
        field
        message
      }
      skillType {
        ...SkillTypeDetailsFragment
      }
    }
  }
`;
export const TypedSkillTypeUpdateMutation = TypedMutation<
  SkillTypeUpdate,
  SkillTypeUpdateVariables
>(skillTypeUpdateMutation);

export const skillTypeCreateMutation = gql`
  ${skillTypeDetailsFragment}
  mutation SkillTypeCreate($input: SkillTypeInput!) {
    skillTypeCreate(input: $input) {
      errors {
        field
        message
      }
      skillType {
        ...SkillTypeDetailsFragment
      }
    }
  }
`;
export const TypedSkillTypeCreateMutation = TypedMutation<
  SkillTypeCreate,
  SkillTypeCreateVariables
>(skillTypeCreateMutation);

export const attributeCreateMutation = gql`
  ${skillTypeDetailsFragment}
  mutation AttributeCreate(
    $id: ID!
    $input: AttributeCreateInput!
    $type: AttributeTypeEnum!
  ) {
    attributeCreate(id: $id, input: $input, type: $type) {
      errors {
        field
        message
      }
      skillType {
        ...SkillTypeDetailsFragment
      }
    }
  }
`;
export const TypedAttributeCreateMutation = TypedMutation<
  AttributeCreate,
  AttributeCreateVariables
>(attributeCreateMutation);

export const attributeUpdateMutation = gql`
  ${attributeFragment}
  mutation AttributeUpdate($id: ID!, $input: AttributeUpdateInput!) {
    attributeUpdate(id: $id, input: $input) {
      errors {
        field
        message
      }
      attribute {
        ...AttributeFragment
      }
    }
  }
`;
export const TypedAttributeUpdateMutation = TypedMutation<
  AttributeUpdate,
  AttributeUpdateVariables
>(attributeUpdateMutation);

export const attributeDeleteMutation = gql`
  ${skillTypeDetailsFragment}
  mutation AttributeDelete($id: ID!) {
    attributeDelete(id: $id) {
      errors {
        field
        message
      }
      skillType {
        ...SkillTypeDetailsFragment
      }
    }
  }
`;
export const TypedAttributeDeleteMutation = TypedMutation<
  AttributeDelete,
  AttributeDeleteVariables
>(attributeDeleteMutation);
