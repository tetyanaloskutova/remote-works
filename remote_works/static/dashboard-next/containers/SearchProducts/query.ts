import gql from "graphql-tag";

import { TypedQuery } from "../../queries";
import {
  SearchSkills,
  SearchSkillsVariables
} from "./types/SearchSkills";

export const searchSkills = gql`
  query SearchSkills($query: String!) {
    products(first: 5, query: $query) {
      edges {
        node {
          id
          thumbnail {
            url
          }
          name
        }
      }
    }
  }
`;
export const TypedSearchSkillsQuery = TypedQuery<
  SearchSkills,
  SearchSkillsVariables
>(searchSkills);
