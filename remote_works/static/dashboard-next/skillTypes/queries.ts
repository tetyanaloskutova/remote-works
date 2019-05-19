import gql from "graphql-tag";

import { TypedQuery } from "../queries";
import { SkillTypeCreateData } from "./types/SkillTypeCreateData";
import {
  SkillTypeDetails,
  SkillTypeDetailsVariables
} from "./types/SkillTypeDetails";
import {
  SkillTypeList,
  SkillTypeListVariables
} from "./types/SkillTypeList";
import {
  SearchAttribute,
  SearchAttributeVariables
} from "./types/SearchAttribute";

export const attributeFragment = gql`
  fragment AttributeFragment on Attribute {
    id
    name
    slug
    values {
      id
      name
      slug
    }
  }
`;
export const productTypeFragment = gql`
  fragment SkillTypeFragment on SkillType {
    id
    name
    hasVariants
    isDeliveryRequired
    taxRate
  }
`;

export const productTypeDetailsFragment = gql`
  ${attributeFragment}
  ${productTypeFragment}
  fragment SkillTypeDetailsFragment on SkillType {
    ...SkillTypeFragment
    productAttributes {
      ...AttributeFragment
    }
    variantAttributes {
      ...AttributeFragment
    }
    weight {
      unit
      value
    }
  }
`;

export const productTypeListQuery = gql`
  ${productTypeFragment}
  query SkillTypeList(
    $after: String
    $before: String
    $first: Int
    $last: Int
  ) {
    productTypes(after: $after, before: $before, first: $first, last: $last) {
      edges {
        node {
          ...SkillTypeFragment
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;
export const TypedSkillTypeListQuery = TypedQuery<
  SkillTypeList,
  SkillTypeListVariables
>(productTypeListQuery);

export const productTypeDetailsQuery = gql`
  ${productTypeDetailsFragment}
  query SkillTypeDetails($id: ID!) {
    productType(id: $id) {
      ...SkillTypeDetailsFragment
    }
    shop {
      defaultWeightUnit
    }
  }
`;
export const TypedSkillTypeDetailsQuery = TypedQuery<
  SkillTypeDetails,
  SkillTypeDetailsVariables
>(productTypeDetailsQuery);

export const productTypeCreateDataQuery = gql`
  query SkillTypeCreateData {
    shop {
      defaultWeightUnit
    }
  }
`;
export const TypedSkillTypeCreateDataQuery = TypedQuery<
  SkillTypeCreateData,
  {}
>(productTypeCreateDataQuery);

export const searchAttributeQuery = gql`
  ${attributeFragment}
  query SearchAttribute($search: String!) {
    attributes(query: $search, first: 5) {
      edges {
        node {
          ...AttributeFragment
        }
      }
    }
  }
`;
export const TypedSearchAttributeQuery = TypedQuery<
  SearchAttribute,
  SearchAttributeVariables
>(searchAttributeQuery);
