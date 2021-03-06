import { TaskEvents } from "../types/globalTypes";
import { Home } from "./types/Home";

export const shop: (placeholderImage: string) => Home = (
  placeholderImage: string
) => ({
  activities: {
    __typename: "TaskEventCountableConnection",
    edges: [
      {
        __typename: "TaskEventCountableEdge",
        node: {
          __typename: "TaskEvent",
          amount: null,
          composedId: null,
          date: "2018-09-14T16:10:27.137126+00:00",
          email: null,
          emailType: null,
          id: "T3JkZXJFdmVudDoxOA==",
          message: null,
          taskNumber: "15",
          oversoldItems: null,
          quantity: null,
          type: TaskEvents.PLACED_FROM_DRAFT,
          user: {
            __typename: "User",
            email: "admin@example.com",
            id: "VXNlcjoyMQ=="
          }
        }
      },
      {
        __typename: "TaskEventCountableEdge",
        node: {
          __typename: "TaskEvent",
          amount: null,
          composedId: null,
          date: "2018-10-03T13:28:46.325279+00:00",
          email: null,
          emailType: null,
          id: "T3JkZXJFdmVudDozNQ==",
          message: null,
          taskNumber: "15",
          oversoldItems: null,
          quantity: null,
          type: TaskEvents.PLACED,
          user: null
        }
      },
      {
        __typename: "TaskEventCountableEdge",
        node: {
          __typename: "TaskEvent",
          amount: null,
          composedId: null,
          date: "2018-10-03T13:29:01.837496+00:00",
          email: null,
          emailType: null,
          id: "T3JkZXJFdmVudDozNw==",
          message: null,
          taskNumber: "15",
          oversoldItems: null,
          quantity: null,
          type: TaskEvents.TASK_FULLY_PAID,
          user: null
        }
      },
      {
        __typename: "TaskEventCountableEdge",
        node: {
          __typename: "TaskEvent",
          amount: null,
          composedId: null,
          date: "2018-10-04T01:01:51.243723+00:00",
          email: null,
          emailType: null,
          id: "T3JkZXJFdmVudDo1OA==",
          message: null,
          taskNumber: "15",
          oversoldItems: null,
          quantity: null,
          type: TaskEvents.PLACED_FROM_DRAFT,
          user: {
            __typename: "User",
            email: "admin@example.com",
            id: "VXNlcjoyMQ=="
          }
        }
      },
      {
        __typename: "TaskEventCountableEdge",
        node: {
          __typename: "TaskEvent",
          amount: null,
          composedId: null,
          date: "2018-10-04T19:36:18.831561+00:00",
          email: null,
          emailType: null,
          id: "T3JkZXJFdmVudDo2Nw==",
          message: null,
          taskNumber: "15",
          oversoldItems: null,
          quantity: null,
          type: TaskEvents.PLACED_FROM_DRAFT,
          user: {
            __typename: "User",
            email: "admin@example.com",
            id: "VXNlcjoyMQ=="
          }
        }
      },
      {
        __typename: "TaskEventCountableEdge",
        node: {
          __typename: "TaskEvent",
          amount: null,
          composedId: null,
          date: "2018-10-04T19:38:01.420365+00:00",
          email: null,
          emailType: null,
          id: "T3JkZXJFdmVudDo2OA==",
          message: null,
          taskNumber: "15",
          oversoldItems: null,
          quantity: null,
          type: TaskEvents.PLACED_FROM_DRAFT,
          user: {
            __typename: "User",
            email: "admin@example.com",
            id: "VXNlcjoyMQ=="
          }
        }
      },
      {
        __typename: "TaskEventCountableEdge",
        node: {
          __typename: "TaskEvent",
          amount: null,
          composedId: null,
          date: "2018-10-05T12:30:57.268592+00:00",
          email: null,
          emailType: null,
          id: "T3JkZXJFdmVudDo3MQ==",
          message: null,
          taskNumber: "15",
          oversoldItems: null,
          quantity: null,
          type: TaskEvents.PLACED_FROM_DRAFT,
          user: {
            __typename: "User",
            email: "admin@example.com",
            id: "VXNlcjoyMQ=="
          }
        }
      },
      {
        __typename: "TaskEventCountableEdge",
        node: {
          __typename: "TaskEvent",
          amount: null,
          composedId: null,
          date: "2018-10-08T09:50:42.622253+00:00",
          email: null,
          emailType: null,
          id: "T3JkZXJFdmVudDo3Mw==",
          message: null,
          taskNumber: "15",
          oversoldItems: null,
          quantity: null,
          type: TaskEvents.PLACED,
          user: null
        }
      },
      {
        __typename: "TaskEventCountableEdge",
        node: {
          __typename: "TaskEvent",
          amount: null,
          composedId: null,
          date: "2018-10-12T15:51:11.665838+00:00",
          email: null,
          emailType: null,
          id: "T3JkZXJFdmVudDo3Nw==",
          message: null,
          taskNumber: "15",
          oversoldItems: null,
          quantity: null,
          type: TaskEvents.PLACED_FROM_DRAFT,
          user: {
            __typename: "User",
            email: "admin@example.com",
            id: "VXNlcjoyMQ=="
          }
        }
      },
      {
        __typename: "TaskEventCountableEdge",
        node: {
          __typename: "TaskEvent",
          amount: null,
          composedId: null,
          date: "2018-10-25T11:25:58.843860+00:00",
          email: null,
          emailType: null,
          id: "T3JkZXJFdmVudDo3OA==",
          message: null,
          taskNumber: "15",
          oversoldItems: null,
          quantity: null,
          type: TaskEvents.PLACED,
          user: null
        }
      },
      {
        __typename: "TaskEventCountableEdge",
        node: {
          __typename: "TaskEvent",
          amount: null,
          composedId: null,
          date: "2018-10-26T09:34:57.580167+00:00",
          email: null,
          emailType: null,
          id: "T3JkZXJFdmVudDo4MA==",
          message: null,
          taskNumber: "15",
          oversoldItems: null,
          quantity: null,
          type: TaskEvents.PLACED,
          user: null
        }
      },
      {
        __typename: "TaskEventCountableEdge",
        node: {
          __typename: "TaskEvent",
          amount: null,
          composedId: null,
          date: "2018-10-26T09:38:02.440061+00:00",
          email: null,
          emailType: null,
          id: "T3JkZXJFdmVudDo4Mg==",
          message: null,
          taskNumber: "15",
          oversoldItems: null,
          quantity: null,
          type: TaskEvents.TASK_FULLY_PAID,
          user: null
        }
      },
      {
        __typename: "TaskEventCountableEdge",
        node: {
          __typename: "TaskEvent",
          amount: null,
          composedId: null,
          date: "2018-10-26T09:38:02.467443+00:00",
          email: null,
          emailType: null,
          id: "T3JkZXJFdmVudDo4NA==",
          message: null,
          taskNumber: "15",
          oversoldItems: null,
          quantity: null,
          type: TaskEvents.TASK_FULLY_PAID,
          user: null
        }
      }
    ]
  },
  ordersToCapture: {
    __typename: "TaskCountableConnection",
    totalCount: 0
  },
  ordersToFulfill: {
    __typename: "TaskCountableConnection",
    totalCount: 1
  },
  ordersToday: {
    __typename: "TaskCountableConnection",
    totalCount: 1
  },
  skillTopToday: {
    __typename: "SkillVariantCountableConnection",
    edges: [
      {
        __typename: "SkillVariantCountableEdge",
        node: {
          __typename: "SkillVariant",
          attributes: [
            {
              __typename: "SelectedAttribute",
              value: {
                __typename: "AttributeValue",
                id: "QXR0cmlidXRlVmFsdWU6OTI=",
                name: "XS",
                sortTask: 0
              }
            }
          ],
          id: "UHJvZHVjdFZhcmlhbnQ6NDM=",
          skill: {
            __typename: "Skill",
            id: "UHJvZHVjdDo4",
            name: "Gardner-Martin",
            price: {
              __typename: "Money",
              amount: 37.65,
              currency: "USD"
            },
            thumbnail: {
              __typename: "Image",
              url: placeholderImage
            }
          },
          quantityTasked: 1,
          revenue: {
            __typename: "TaxedMoney",
            gross: {
              __typename: "Money",
              amount: 37.65,
              currency: "USD"
            }
          }
        }
      }
    ]
  },
  skillsOutOfStock: {
    __typename: "SkillCountableConnection",
    totalCount: 0
  },
  salesToday: {
    __typename: "TaxedMoney",
    gross: {
      __typename: "Money",
      amount: 57.15,
      currency: "USD"
    }
  }
});
