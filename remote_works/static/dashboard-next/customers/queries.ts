import gql from "graphql-tag";

import { fragmentAddress } from "../tasks/queries";
import { TypedQuery } from "../queries";
import { CustomerCreateData } from "./types/CustomerCreateData";
import {
  CustomerDetails,
  CustomerDetailsVariables
} from "./types/CustomerDetails";
import { ListCustomers, ListCustomersVariables } from "./types/ListCustomers";

export const customerFragment = gql`
  fragment CustomerFragment on User {
    id
    email
    firstName
    lastName
  }
`;

export const customerDetailsFragment = gql`
  ${customerFragment}
  ${fragmentAddress}
  fragment CustomerDetailsFragment on User {
    ...CustomerFragment
    dateJoined
    lastLogin
    defaultDeliveryAddress {
      ...AddressFragment
    }
    defaultBillingAddress {
      ...AddressFragment
    }
    note
    isActive
  }
`;

const customerList = gql`
  ${customerFragment}
  query ListCustomers(
    $after: String
    $before: String
    $first: Int
    $last: Int
  ) {
    customers(after: $after, before: $before, first: $first, last: $last) {
      edges {
        node {
          ...CustomerFragment
          tasks {
            totalCount
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
export const TypedCustomerListQuery = TypedQuery<
  ListCustomers,
  ListCustomersVariables
>(customerList);

const customerDetails = gql`
  ${customerDetailsFragment}
  query CustomerDetails($id: ID!) {
    user(id: $id) {
      ...CustomerDetailsFragment
      tasks(last: 5) {
        edges {
          node {
            id
            created
            number
            paymentStatus
            total {
              gross {
                currency
                amount
              }
            }
          }
        }
      }
      lastPlacedTask: tasks(last: 1) {
        edges {
          node {
            id
            created
          }
        }
      }
    }
  }
`;
export const TypedCustomerDetailsQuery = TypedQuery<
  CustomerDetails,
  CustomerDetailsVariables
>(customerDetails);

const customerCreateData = gql`
  query CustomerCreateData {
    shop {
      countries {
        code
        country
      }
    }
  }
`;
export const TypedCustomerCreateDataQuery = TypedQuery<CustomerCreateData, {}>(
  customerCreateData
);
