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
export const skillTypeFragment = gql`
  fragment SkillTypeFragment on SkillType {
    id
    name
    hasVariants
    isDeliveryRequired
    taxRate
  }
`;

export const skillTypeDetailsFragment = gql`
  ${attributeFragment}
  ${skillTypeFragment}
  fragment SkillTypeDetailsFragment on SkillType {
    ...SkillTypeFragment
    skillAttributes {
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

export const skillTypeListQuery = gql`
  ${skillTypeFragment}
  query SkillTypeList(
    $after: String
    $before: String
    $first: Int
    $last: Int
  ) {
    skillTypes(after: $after, before: $before, first: $first, last: $last) {
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
>(skillTypeListQuery);

export const skillTypeDetailsQuery = gql`
  ${skillTypeDetailsFragment}
  query SkillTypeDetails($id: ID!) {
    skillType(id: $id) {
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
>(skillTypeDetailsQuery);

export const skillTypeCreateDataQuery = gql`
  query SkillTypeCreateData {
    shop {
      defaultWeightUnit
    }
  }
`;
export const TypedSkillTypeCreateDataQuery = TypedQuery<
  SkillTypeCreateData,
  {}
>(skillTypeCreateDataQuery);

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
