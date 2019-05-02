import gql from "graphql-tag";

import { TypedMutation } from "../mutations";
import {
  collectionDetailsFragment,
  collectionSkillFragment
} from "./queries";
import {
  CollectionAssignSkill,
  CollectionAssignSkillVariables
} from "./types/CollectionAssignSkill";
import {
  CollectionUpdate,
  CollectionUpdateVariables
} from "./types/CollectionUpdate";
import {
  CollectionUpdateWithHomepage,
  CollectionUpdateWithHomepageVariables
} from "./types/CollectionUpdateWithHomepage";
import {
  CreateCollection,
  CreateCollectionVariables
} from "./types/CreateCollection";
import {
  RemoveCollection,
  RemoveCollectionVariables
} from "./types/RemoveCollection";
import {
  UnassignCollectionSkill,
  UnassignCollectionSkillVariables
} from "./types/UnassignCollectionSkill";

const collectionUpdate = gql`
  ${collectionDetailsFragment}
  mutation CollectionUpdate($id: ID!, $input: CollectionInput!) {
    collectionUpdate(id: $id, input: $input) {
      errors {
        field
        message
      }
      collection {
        ...CollectionDetailsFragment
      }
    }
  }
`;
export const TypedCollectionUpdateMutation = TypedMutation<
  CollectionUpdate,
  CollectionUpdateVariables
>(collectionUpdate);

const collectionUpdateWithHomepage = gql`
  ${collectionDetailsFragment}
  mutation CollectionUpdateWithHomepage(
    $id: ID!
    $input: CollectionInput!
    $homepageId: ID
  ) {
    homepageCollectionUpdate(collection: $homepageId) {
      errors {
        field
        message
      }
      shop {
        homepageCollection {
          id
        }
      }
    }
    collectionUpdate(id: $id, input: $input) {
      errors {
        field
        message
      }
      collection {
        ...CollectionDetailsFragment
      }
    }
  }
`;
export const TypedCollectionUpdateWithHomepageMutation = TypedMutation<
  CollectionUpdateWithHomepage,
  CollectionUpdateWithHomepageVariables
>(collectionUpdateWithHomepage);

const assignCollectionSkill = gql`
  ${collectionSkillFragment}
  mutation CollectionAssignSkill(
    $collectionId: ID!
    $productIds: [ID!]!
    $first: Int
    $after: String
    $last: Int
    $before: String
  ) {
    collectionAddSkills(collectionId: $collectionId, products: $productIds) {
      errors {
        field
        message
      }
      collection {
        id
        products(first: $first, after: $after, before: $before, last: $last) {
          edges {
            node {
              ...CollectionSkillFragment
            }
          }
          pageInfo {
            endCursor
            hasNextPage
            hasPreviousPage
            startCursor
          }
        }
      }
    }
  }
`;
export const TypedCollectionAssignSkillMutation = TypedMutation<
  CollectionAssignSkill,
  CollectionAssignSkillVariables
>(assignCollectionSkill);

const createCollection = gql`
  ${collectionDetailsFragment}
  mutation CreateCollection($input: CollectionCreateInput!) {
    collectionCreate(input: $input) {
      errors {
        field
        message
      }
      collection {
        ...CollectionDetailsFragment
      }
    }
  }
`;
export const TypedCollectionCreateMutation = TypedMutation<
  CreateCollection,
  CreateCollectionVariables
>(createCollection);

const removeCollection = gql`
  mutation RemoveCollection($id: ID!) {
    collectionDelete(id: $id) {
      errors {
        field
        message
      }
    }
  }
`;
export const TypedCollectionRemoveMutation = TypedMutation<
  RemoveCollection,
  RemoveCollectionVariables
>(removeCollection);

const unassignCollectionSkill = gql`
  mutation UnassignCollectionSkill(
    $collectionId: ID!
    $productId: ID!
    $first: Int
    $after: String
    $last: Int
    $before: String
  ) {
    collectionRemoveSkills(
      collectionId: $collectionId
      products: [$productId]
    ) {
      errors {
        field
        message
      }
      collection {
        id
        products(first: $first, after: $after, before: $before, last: $last) {
          edges {
            node {
              id
              isPublished
              name
              productType {
                id
                name
              }
              thumbnailUrl
            }
          }
          pageInfo {
            endCursor
            hasNextPage
            hasPreviousPage
            startCursor
          }
        }
      }
    }
  }
`;
export const TypedUnassignCollectionSkillMutation = TypedMutation<
  UnassignCollectionSkill,
  UnassignCollectionSkillVariables
>(unassignCollectionSkill);
