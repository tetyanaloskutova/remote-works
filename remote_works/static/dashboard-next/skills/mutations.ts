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

export const productImageCreateMutation = gql`
  ${fragmentSkill}
  mutation SkillImageCreate($product: ID!, $image: Upload!, $alt: String) {
    productImageCreate(input: { alt: $alt, image: $image, product: $skill }) {
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
>(productImageCreateMutation);

export const productDeleteMutation = gql`
  mutation SkillDelete($id: ID!) {
    productDelete(id: $id) {
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
>(productDeleteMutation);

export const productImagesReorder = gql`
  mutation SkillImageReorder($productId: ID!, $imagesIds: [ID]!) {
    productImageReorder(productId: $productId, imagesIds: $imagesIds) {
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
>(productImagesReorder);

export const productUpdateMutation = gql`
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
    productUpdate(
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
>(productUpdateMutation);

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
    $productVariantId: ID!
    $productVariantInput: SkillVariantInput!
  ) {
    productUpdate(
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
    productVariantUpdate(id: $productVariantId, input: $productVariantInput) {
      errors {
        field
        message
      }
      productVariant {
        ...SkillVariant
      }
    }
  }
`;
export const TypedSimpleSkillUpdateMutation = TypedMutation<
  SimpleSkillUpdate,
  SimpleSkillUpdateVariables
>(simpleSkillUpdateMutation);

export const productCreateMutation = gql`
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
    $productType: ID!
  ) {
    productCreate(
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
        productType: $productType
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
>(productCreateMutation);

export const variantDeleteMutation = gql`
  mutation VariantDelete($id: ID!) {
    productVariantDelete(id: $id) {
      errors {
        field
        message
      }
      productVariant {
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
    productVariantUpdate(
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
      productVariant {
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
    $product: ID!
    $sku: String
    $quantity: Int
    $trackInventory: Boolean!
  ) {
    productVariantCreate(
      input: {
        attributes: $attributes
        costPrice: $costPrice
        priceOverride: $priceOverride
        product: $product
        sku: $sku
        quantity: $quantity
        trackInventory: $trackInventory
      }
    ) {
      errors {
        field
        message
      }
      productVariant {
        ...SkillVariant
      }
    }
  }
`;
export const TypedVariantCreateMutation = TypedMutation<
  VariantCreate,
  VariantCreateVariables
>(variantCreateMutation);

export const productImageDeleteMutation = gql`
  mutation SkillImageDelete($id: ID!) {
    productImageDelete(id: $id) {
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
>(productImageDeleteMutation);

export const productImageUpdateMutation = gql`
  ${fragmentSkill}
  mutation SkillImageUpdate($id: ID!, $alt: String!) {
    productImageUpdate(id: $id, input: { alt: $alt }) {
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
>(productImageUpdateMutation);

export const variantImageAssignMutation = gql`
  ${fragmentVariant}
  mutation VariantImageAssign($variantId: ID!, $imageId: ID!) {
    variantImageAssign(variantId: $variantId, imageId: $imageId) {
      errors {
        field
        message
      }
      productVariant {
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
      productVariant {
        ...SkillVariant
      }
    }
  }
`;
export const TypedVariantImageUnassignMutation = TypedMutation<
  VariantImageUnassign,
  VariantImageUnassignVariables
>(variantImageUnassignMutation);
