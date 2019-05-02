import gql from "graphql-tag";

import { TypedMutation } from "../mutations";
import { attributeFragment, productTypeDetailsFragment } from "./queries";
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

export const productTypeDeleteMutation = gql`
  mutation SkillTypeDelete($id: ID!) {
    productTypeDelete(id: $id) {
      errors {
        field
        message
      }
      productType {
        id
      }
    }
  }
`;
export const TypedSkillTypeDeleteMutation = TypedMutation<
  SkillTypeDelete,
  SkillTypeDeleteVariables
>(productTypeDeleteMutation);

export const productTypeUpdateMutation = gql`
  ${productTypeDetailsFragment}
  mutation SkillTypeUpdate($id: ID!, $input: SkillTypeInput!) {
    productTypeUpdate(id: $id, input: $input) {
      errors {
        field
        message
      }
      productType {
        ...SkillTypeDetailsFragment
      }
    }
  }
`;
export const TypedSkillTypeUpdateMutation = TypedMutation<
  SkillTypeUpdate,
  SkillTypeUpdateVariables
>(productTypeUpdateMutation);

export const productTypeCreateMutation = gql`
  ${productTypeDetailsFragment}
  mutation SkillTypeCreate($input: SkillTypeInput!) {
    productTypeCreate(input: $input) {
      errors {
        field
        message
      }
      productType {
        ...SkillTypeDetailsFragment
      }
    }
  }
`;
export const TypedSkillTypeCreateMutation = TypedMutation<
  SkillTypeCreate,
  SkillTypeCreateVariables
>(productTypeCreateMutation);

export const attributeCreateMutation = gql`
  ${productTypeDetailsFragment}
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
      productType {
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
  ${productTypeDetailsFragment}
  mutation AttributeDelete($id: ID!) {
    attributeDelete(id: $id) {
      errors {
        field
        message
      }
      productType {
        ...SkillTypeDetailsFragment
      }
    }
  }
`;
export const TypedAttributeDeleteMutation = TypedMutation<
  AttributeDelete,
  AttributeDeleteVariables
>(attributeDeleteMutation);
