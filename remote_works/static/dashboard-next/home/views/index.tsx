import * as React from "react";

import { UserContext } from "../../auth";
import Navigator from "../../components/Navigator";
import { maybe } from "../../misc";
import { orderListUrl } from "../../tasks/urls";
import { productListUrl, productVariantEditUrl } from "../../products/urls";
import { TaskStatusFilter, StockAvailability } from "../../types/globalTypes";
import HomePage from "../components/HomePage";
import { HomePageQuery } from "../queries";

const HomeSection = () => (
  <Navigator>
    {navigate => (
      <UserContext.Consumer>
        {({ user }) => (
          <HomePageQuery displayLoader>
            {({ data }) => (
              <HomePage
                activities={maybe(() =>
                  data.activities.edges.map(edge => edge.node).reverse()
                )}
                tasks={maybe(() => data.ordersToday.totalCount)}
                sales={maybe(() => data.salesToday.gross)}
                topSkills={maybe(() =>
                  data.productTopToday.edges.map(edge => edge.node)
                )}
                onSkillClick={(productId, variantId) =>
                  navigate(productVariantEditUrl(productId, variantId))
                }
                onTasksToCaptureClick={() =>
                  navigate(
                    orderListUrl({
                      status: TaskStatusFilter.READY_TO_CAPTURE
                    })
                  )
                }
                onTasksToFulfillClick={() =>
                  navigate(
                    orderListUrl({
                      status: TaskStatusFilter.READY_TO_FULFILL
                    })
                  )
                }
                onSkillsOutOfStockClick={() =>
                  navigate(
                    productListUrl({
                      status: StockAvailability.OUT_OF_STOCK
                    })
                  )
                }
                ordersToCapture={maybe(() => data.ordersToCapture.totalCount)}
                ordersToFulfill={maybe(() => data.ordersToFulfill.totalCount)}
                productsOutOfStock={maybe(
                  () => data.productsOutOfStock.totalCount
                )}
                userName={user.email}
              />
            )}
          </HomePageQuery>
        )}
      </UserContext.Consumer>
    )}
  </Navigator>
);

export default HomeSection;
