import gql from "graphql-tag";

import { TypedQuery } from "../queries";
import { TaskDetails, TaskDetailsVariables } from "./types/TaskDetails";
import { TaskList, TaskListVariables } from "./types/TaskList";
import {
  TaskVariantSearch,
  TaskVariantSearchVariables
} from "./types/TaskVariantSearch";
import { UserSearch, UserSearchVariables } from "./types/UserSearch";

export const fragmentTaskEvent = gql`
  fragment TaskEventFragment on TaskEvent {
    id
    amount
    date
    email
    emailType
    message
    quantity
    type
    user {
      email
    }
  }
`;
export const fragmentAddress = gql`
  fragment AddressFragment on Address {
    city
    cityArea
    companyName
    country {
      __typename
      code
      country
    }
    countryArea
    firstName
    id
    lastName
    phone
    postalCode
    streetAddress1
    streetAddress2
  }
`;
export const fragmentTaskLine = gql`
  fragment TaskLineFragment on TaskLine {
    id
    isDeliveryRequired
    skillName
    skillSku
    quantity
    quantityFulfilled
    unitPrice {
      gross {
        amount
        currency
      }
      net {
        amount
        currency
      }
    }
    thumbnailUrl
  }
`;

export const fragmentTaskDetails = gql`
  ${fragmentAddress}
  ${fragmentTaskEvent}
  ${fragmentTaskLine}
  fragment TaskDetailsFragment on Task {
    id
    billingAddress {
      ...AddressFragment
    }
    canFinalize
    created
    customerNote
    events {
      ...TaskEventFragment
    }
    fulfillments {
      id
      lines {
        id
        quantity
        taskLine {
          ...TaskLineFragment
        }
      }
      fulfillmentTask
      status
      trackingNumber
    }
    lines {
      ...TaskLineFragment
    }
    number
    paymentStatus
    deliveryAddress {
      ...AddressFragment
    }
    deliveryMethod {
      id
    }
    deliveryMethodName
    deliveryPrice {
      gross {
        amount
        currency
      }
    }
    status
    subtotal {
      gross {
        amount
        currency
      }
    }
    total {
      gross {
        amount
        currency
      }
      tax {
        amount
        currency
      }
    }
    actions
    totalAuthorized {
      amount
      currency
    }
    totalCaptured {
      amount
      currency
    }
    user {
      id
      email
    }
    userEmail
    availableDeliveryMethods {
      id
      name
      price {
        amount
        currency
      }
    }
  }
`;

export const taskListQuery = gql`
  ${fragmentAddress}
  query TaskList(
    $first: Int
    $after: String
    $last: Int
    $before: String
    $status: TaskStatusFilter
  ) {
    tasks(
      before: $before
      after: $after
      first: $first
      last: $last
      status: $status
    ) {
      edges {
        node {
          __typename
          billingAddress {
            ...AddressFragment
          }
          created
          id
          number
          paymentStatus
          status
          total {
            __typename
            gross {
              __typename
              amount
              currency
            }
          }
          userEmail
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
export const TypedTaskListQuery = TypedQuery<TaskList, TaskListVariables>(
  taskListQuery
);

export const orderDetailsQuery = gql`
  ${fragmentTaskDetails}
  query TaskDetails($id: ID!) {
    task(id: $id) {
      ...TaskDetailsFragment
    }
    shop {
      countries {
        code
        country
      }
      defaultWeightUnit
    }
  }
`;
export const TypedTaskDetailsQuery = TypedQuery<
  TaskDetails,
  TaskDetailsVariables
>(orderDetailsQuery);

export const orderVariantSearchQuery = gql`
  query TaskVariantSearch($search: String!, $after: String) {
    skills(query: $search, first: 5, after: $after) {
      edges {
        node {
          id
          name
          thumbnail {
            url
          }
          variants {
            id
            name
            sku
            price {
              amount
              currency
            }
          }
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
`;
export const TypedTaskVariantSearch = TypedQuery<
  TaskVariantSearch,
  TaskVariantSearchVariables
>(orderVariantSearchQuery);

export const userSearchQuery = gql`
  query UserSearch($search: String!) {
    customers(query: $search, first: 5) {
      edges {
        node {
          id
          email
        }
      }
    }
  }
`;
export const TypedUserSearch = TypedQuery<UserSearch, UserSearchVariables>(
  userSearchQuery
);
