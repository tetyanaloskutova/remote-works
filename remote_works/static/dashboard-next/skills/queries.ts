import gql from "graphql-tag";

import { TypedQuery } from "../queries";
import {
  CategorySearch,
  CategorySearchVariables
} from "./types/CategorySearch";
import {
  CollectionSearch,
  CollectionSearchVariables
} from "./types/CollectionSearch";
import { SkillCreateData } from "./types/SkillCreateData";
import {
  SkillDetails,
  SkillDetailsVariables
} from "./types/SkillDetails";
import {
  SkillImageById,
  SkillImageByIdVariables
} from "./types/SkillImageById";
import { SkillList, SkillListVariables } from "./types/SkillList";
import {
  SkillVariantCreateData,
  SkillVariantCreateDataVariables
} from "./types/SkillVariantCreateData";
import {
  SkillVariantDetails,
  SkillVariantDetailsVariables
} from "./types/SkillVariantDetails";

export const fragmentMoney = gql`
  fragment Money on Money {
    amount
    currency
  }
`;

export const fragmentSkillImage = gql`
  fragment SkillImageFragment on SkillImage {
    id
    alt
    sortTask
    url
  }
`;

export const fragmentSkill = gql`
  ${fragmentSkillImage}
  ${fragmentMoney}
  fragment Skill on Skill {
    id
    name
    descriptionJson
    seoTitle
    seoDescription
    category {
      id
      name
    }
    collections {
      id
      name
    }
    price {
      ...Money
    }
    margin {
      start
      stop
    }
    purchaseCost {
      start {
        ...Money
      }
      stop {
        ...Money
      }
    }
    isPublished
    chargeTaxes
    publicationDate
    attributes {
      attribute {
        id
        slug
        name
        values {
          name
          slug
        }
      }
      value {
        id
        name
        slug
      }
    }
    availability {
      available
      priceRange {
        start {
          net {
            ...Money
          }
        }
        stop {
          net {
            ...Money
          }
        }
      }
    }
    images {
      ...SkillImageFragment
    }
    variants {
      id
      sku
      name
      priceOverride {
        ...Money
      }
      margin
      quantity
      quantityAllocated
      stockQuantity
    }
    productType {
      id
      name
      hasVariants
    }
    url
  }
`;

export const fragmentVariant = gql`
  ${fragmentMoney}
  ${fragmentSkillImage}
  fragment SkillVariant on SkillVariant {
    id
    attributes {
      attribute {
        id
        name
        slug
        values {
          id
          name
          slug
        }
      }
      value {
        id
        name
        slug
      }
    }
    costPrice {
      ...Money
    }
    images {
      id
      url
    }
    name
    priceOverride {
      ...Money
    }
    skill {
      id
      images {
        ...SkillImageFragment
      }
      name
      thumbnail {
        url
      }
      variants {
        id
        name
        sku
        images {
          id
          url
        }
      }
    }
    sku
    quantity
    quantityAllocated
  }
`;

const productListQuery = gql`
  ${fragmentMoney}
  query SkillList(
    $first: Int
    $after: String
    $last: Int
    $before: String
    $stockAvailability: StockAvailability
  ) {
    products(
      before: $before
      after: $after
      first: $first
      last: $last
      stockAvailability: $stockAvailability
    ) {
      edges {
        node {
          id
          name
          thumbnail {
            url
          }
          availability {
            available
          }
          price {
            ...Money
          }
          productType {
            id
            name
          }
        }
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
`;
export const TypedSkillListQuery = TypedQuery<
  SkillList,
  SkillListVariables
>(productListQuery);

const productDetailsQuery = gql`
  ${fragmentSkill}
  query SkillDetails($id: ID!) {
    product(id: $id) {
      ...Skill
    }
  }
`;
export const TypedSkillDetailsQuery = TypedQuery<
  SkillDetails,
  SkillDetailsVariables
>(productDetailsQuery);

const productVariantQuery = gql`
  ${fragmentVariant}
  query SkillVariantDetails($id: ID!) {
    productVariant(id: $id) {
      ...SkillVariant
    }
  }
`;
export const TypedSkillVariantQuery = TypedQuery<
  SkillVariantDetails,
  SkillVariantDetailsVariables
>(productVariantQuery);

const productCreateQuery = gql`
  query SkillCreateData {
    productTypes(first: 20) {
      edges {
        node {
          id
          name
          hasVariants
          productAttributes {
            id
            slug
            name
            values {
              id
              sortTask
              name
              slug
            }
          }
        }
      }
    }
  }
`;
export const TypedSkillCreateQuery = TypedQuery<SkillCreateData, {}>(
  productCreateQuery
);

const productVariantCreateQuery = gql`
  query SkillVariantCreateData($id: ID!) {
    product(id: $id) {
      id
      images {
        id
        sortTask
        url
      }
      productType {
        id
        variantAttributes {
          id
          slug
          name
          values {
            id
            sortTask
            name
            slug
          }
        }
      }
      variants {
        id
        name
        sku
        images {
          id
          url
        }
      }
    }
  }
`;
export const TypedSkillVariantCreateQuery = TypedQuery<
  SkillVariantCreateData,
  SkillVariantCreateDataVariables
>(productVariantCreateQuery);

const productImageQuery = gql`
  query SkillImageById($productId: ID!, $imageId: ID!) {
    product(id: $productId) {
      id
      mainImage: imageById(id: $imageId) {
        id
        alt
        url
      }
      images {
        id
        url(size: 48)
      }
    }
  }
`;
export const TypedSkillImageQuery = TypedQuery<
  SkillImageById,
  SkillImageByIdVariables
>(productImageQuery);

const categorySearch = gql`
  query CategorySearch($query: String) {
    categories(first: 5, query: $query) {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;
export const TypedCategorySearchQuery = TypedQuery<
  CategorySearch,
  CategorySearchVariables
>(categorySearch);

const collectionSearch = gql`
  query CollectionSearch($query: String) {
    collections(first: 5, query: $query) {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;
export const TypedCollectionSearchQuery = TypedQuery<
  CollectionSearch,
  CollectionSearchVariables
>(collectionSearch);
