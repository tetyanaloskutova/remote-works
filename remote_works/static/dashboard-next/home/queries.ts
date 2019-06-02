import gql from "graphql-tag";

import { TypedQuery } from "../queries";
import { Home } from "./types/Home";

const home = gql`
  query Home {
    salesToday: ordersTotal(period: TODAY) {
      gross {
        amount
        currency
      }
    }
    ordersToday: tasks(created: TODAY) {
      totalCount
    }
    ordersToFulfill: tasks(status: READY_TO_FULFILL) {
      totalCount
    }
    ordersToCapture: tasks(status: READY_TO_CAPTURE) {
      totalCount
    }
    skillsOutOfStock: skills(stockAvailability: OUT_OF_STOCK) {
      totalCount
    }
    skillTopToday: reportSkillSales(period: TODAY, first: 5) {
      edges {
        node {
          id
          revenue(period: TODAY) {
            gross {
              amount
              currency
            }
          }
          attributes {
            value {
              id
              name
              sortTask
            }
          }
          skill {
            id
            name
            thumbnail {
              url
            }
          }
          quantityTasked
        }
      }
    }
    activities: homepageEvents(last: 10) {
      edges {
        node {
          amount
          composedId
          date
          email
          emailType
          id
          message
          orderNumber
          oversoldItems
          quantity
          type
          user {
            id
            email
          }
        }
      }
    }
  }
`;
export const HomePageQuery = TypedQuery<Home, {}>(home);
