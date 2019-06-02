import gql from "graphql-tag";

import { TypedMutation } from "../mutations";
import { SkillCreate, SkillCreateVariables } from "./types/SkillCreate";
import { SkillDelete, SkillDeleteVariables } from "./types/SkillDelete";
import {
  SkillImageCreate,
  SkillImageCreateVariables
} from "./types/SkillImageCreate";
import {
  SkillImageDelete,
  SkillImageDeleteVariables
} from "./types/SkillImageDelete";
import {
  SkillImageReorder,
  SkillImageReorderVariables
} from "./types/SkillImageReorder";
import {
  SkillImageUpdate,
  SkillImageUpdateVariables
} from "./types/SkillImageUpdate";
import { SkillUpdate, SkillUpdateVariables } from "./types/SkillUpdate";
import {
  SimpleSkillUpdate,
  SimpleSkillUpdateVariables
} from "./types/SimpleSkillUpdate";
import { VariantCreate, VariantCreateVariables } from "./types/VariantCreate";
import { VariantDelete, VariantDeleteVariables } from "./types/VariantDelete";
import {
  VariantImageAssign,
  VariantImageAssignVariables
} from "./types/VariantImageAssign";
import {
  VariantImageUnassign,
  VariantImageUnassignVariables
} from "./types/VariantImageUnassign";
import { VariantUpdate, VariantUpdateVariables } from "./types/VariantUpdate";

import { fragmentSkill, fragmentVariant } from "./queries";

export const skillImageCreateMutation = gql`
  ${fragmentSkill}
  mutation SkillImageCreate($skill: ID!, $image: Upload!, $alt: String) {
    skillImageCreate(input: { alt: $alt, image: $image, skill: $skill }) {
      errors {
        field
        message
      }
      skill {
        ...Skill
      }
    }
  }
`;
export const TypedSkillImageCreateMutation = TypedMutation<
  SkillImageCreate,
  SkillImageCreateVariables
>(skillImageCreateMutation);

export const skillDeleteMutation = gql`
  mutation SkillDelete($id: ID!) {
    skillDelete(id: $id) {
      errors {
        field
        message
      }
      skill {
        id
      }
    }
  }
`;
export const TypedSkillDeleteMutation = TypedMutation<
  SkillDelete,
  SkillDeleteVariables
>(skillDeleteMutation);

export const skillImagesReorder = gql`
  mutation SkillImageReorder($skillId: ID!, $imagesIds: [ID]!) {
    skillImageReorder(skillId: $skillId, imagesIds: $imagesIds) {
      errors {
        field
        message
      }
      skill {
        id
        images {
          id
          alt
          sortTask
          url
        }
      }
    }
  }
`;
export const TypedSkillImagesReorder = TypedMutation<
  SkillImageReorder,
  SkillImageReorderVariables
>(skillImagesReorder);

export const skillUpdateMutation = gql`
  ${fragmentSkill}
  mutation SkillUpdate(
    $id: ID!
    $attributes: [AttributeValueInput]
    $publicationDate: Date
    $category: ID
    $chargeTaxes: Boolean!
    $collections: [ID]
    $descriptionJson: JSONString
    $isPublished: Boolean!
    $name: String
    $price: Decimal
  ) {
    skillUpdate(
      id: $id
      input: {
        attributes: $attributes
        publicationDate: $publicationDate
        category: $category
        chargeTaxes: $chargeTaxes
        collections: $collections
        descriptionJson: $descriptionJson
        isPublished: $isPublished
        name: $name
        price: $price
      }
    ) {
      errors {
        field
        message
      }
      skill {
        ...Skill
      }
    }
  }
`;
export const TypedSkillUpdateMutation = TypedMutation<
  SkillUpdate,
  SkillUpdateVariables
>(skillUpdateMutation);

export const simpleSkillUpdateMutation = gql`
  ${fragmentSkill}
  ${fragmentVariant}
  mutation SimpleSkillUpdate(
    $id: ID!
    $attributes: [AttributeValueInput]
    $publicationDate: Date
    $category: ID
    $chargeTaxes: Boolean!
    $collections: [ID]
    $descriptionJson: JSONString
    $isPublished: Boolean!
    $name: String
    $price: Decimal
    $skillVariantId: ID!
    $skillVariantInput: SkillVariantInput!
  ) {
    skillUpdate(
      id: $id
      input: {
        attributes: $attributes
        publicationDate: $publicationDate
        category: $category
        chargeTaxes: $chargeTaxes
        collections: $collections
        descriptionJson: $descriptionJson
        isPublished: $isPublished
        name: $name
        price: $price
      }
    ) {
      errors {
        field
        message
      }
      skill {
        ...Skill
      }
    }
    skillVariantUpdate(id: $skillVariantId, input: $skillVariantInput) {
      errors {
        field
        message
      }
      skillVariant {
        ...SkillVariant
      }
    }
  }
`;
export const TypedSimpleSkillUpdateMutation = TypedMutation<
  SimpleSkillUpdate,
  SimpleSkillUpdateVariables
>(simpleSkillUpdateMutation);

export const skillCreateMutation = gql`
  ${fragmentSkill}
  mutation SkillCreate(
    $attributes: [AttributeValueInput]
    $publicationDate: Date
    $category: ID!
    $chargeTaxes: Boolean!
    $collections: [ID]
    $descriptionJson: JSONString
    $isPublished: Boolean!
    $name: String!
    $price: Decimal
    $skillType: ID!
  ) {
    skillCreate(
      input: {
        attributes: $attributes
        publicationDate: $publicationDate
        category: $category
        chargeTaxes: $chargeTaxes
        collections: $collections
        descriptionJson: $descriptionJson
        isPublished: $isPublished
        name: $name
        price: $price
        skillType: $skillType
      }
    ) {
      errors {
        field
        message
      }
      skill {
        ...Skill
      }
    }
  }
`;
export const TypedSkillCreateMutation = TypedMutation<
  SkillCreate,
  SkillCreateVariables
>(skillCreateMutation);

export const variantDeleteMutation = gql`
  mutation VariantDelete($id: ID!) {
    skillVariantDelete(id: $id) {
      errors {
        field
        message
      }
      skillVariant {
        id
      }
    }
  }
`;
export const TypedVariantDeleteMutation = TypedMutation<
  VariantDelete,
  VariantDeleteVariables
>(variantDeleteMutation);

export const variantUpdateMutation = gql`
  ${fragmentVariant}
  mutation VariantUpdate(
    $id: ID!
    $attributes: [AttributeValueInput]
    $costPrice: Decimal
    $priceOverride: Decimal
    $sku: String
    $quantity: Int
    $trackInventory: Boolean!
  ) {
    skillVariantUpdate(
      id: $id
      input: {
        attributes: $attributes
        costPrice: $costPrice
        priceOverride: $priceOverride
        sku: $sku
        quantity: $quantity
        trackInventory: $trackInventory
      }
    ) {
      errors {
        field
        message
      }
      skillVariant {
        ...SkillVariant
      }
    }
  }
`;
export const TypedVariantUpdateMutation = TypedMutation<
  VariantUpdate,
  VariantUpdateVariables
>(variantUpdateMutation);

export const variantCreateMutation = gql`
  ${fragmentVariant}
  mutation VariantCreate(
    $attributes: [AttributeValueInput]!
    $costPrice: Decimal
    $priceOverride: Decimal
    $skill: ID!
    $sku: String
    $quantity: Int
    $trackInventory: Boolean!
  ) {
    skillVariantCreate(
      input: {
        attributes: $attributes
        costPrice: $costPrice
        priceOverride: $priceOverride
        skill: $skill
        sku: $sku
        quantity: $quantity
        trackInventory: $trackInventory
      }
    ) {
      errors {
        field
        message
      }
      skillVariant {
        ...SkillVariant
      }
    }
  }
`;
export const TypedVariantCreateMutation = TypedMutation<
  VariantCreate,
  VariantCreateVariables
>(variantCreateMutation);

export const skillImageDeleteMutation = gql`
  mutation SkillImageDelete($id: ID!) {
    skillImageDelete(id: $id) {
      skill {
        id
        images {
          id
        }
      }
    }
  }
`;
export const TypedSkillImageDeleteMutation = TypedMutation<
  SkillImageDelete,
  SkillImageDeleteVariables
>(skillImageDeleteMutation);

export const skillImageUpdateMutation = gql`
  ${fragmentSkill}
  mutation SkillImageUpdate($id: ID!, $alt: String!) {
    skillImageUpdate(id: $id, input: { alt: $alt }) {
      errors {
        field
        message
      }
      skill {
        ...Skill
      }
    }
  }
`;
export const TypedSkillImageUpdateMutation = TypedMutation<
  SkillImageUpdate,
  SkillImageUpdateVariables
>(skillImageUpdateMutation);

export const variantImageAssignMutation = gql`
  ${fragmentVariant}
  mutation VariantImageAssign($variantId: ID!, $imageId: ID!) {
    variantImageAssign(variantId: $variantId, imageId: $imageId) {
      errors {
        field
        message
      }
      skillVariant {
        ...SkillVariant
      }
    }
  }
`;
export const TypedVariantImageAssignMutation = TypedMutation<
  VariantImageAssign,
  VariantImageAssignVariables
>(variantImageAssignMutation);

export const variantImageUnassignMutation = gql`
  ${fragmentVariant}
  mutation VariantImageUnassign($variantId: ID!, $imageId: ID!) {
    variantImageUnassign(variantId: $variantId, imageId: $imageId) {
      errors {
        field
        message
      }
      skillVariant {
        ...SkillVariant
      }
    }
  }
`;
export const TypedVariantImageUnassignMutation = TypedMutation<
  VariantImageUnassign,
  VariantImageUnassignVariables
>(variantImageUnassignMutation);
