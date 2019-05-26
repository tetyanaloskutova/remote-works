import { stringify as stringifyQs } from "qs";
import * as React from "react";

import Navigator from "../../components/Navigator";
import { createPaginationState, Paginator } from "../../components/Paginator";
import { maybe } from "../../misc";
import { StockAvailability } from "../../types/globalTypes";
import SkillListCard from "../components/SkillListCard";
import { getTabName } from "../misc";
import { TypedSkillListQuery } from "../queries";
import { productAddUrl, productUrl } from "../urls";

export interface SkillListFilters {
  status: StockAvailability;
}
export type SkillListQueryParams = Partial<
  {
    after: string;
    before: string;
  } & SkillListFilters
>;

interface SkillListProps {
  params: SkillListQueryParams;
}

const PAGINATE_BY = 20;

export const SkillList: React.StatelessComponent<SkillListProps> = ({
  params
}) => (
  <Navigator>
    {navigate => {
      const changeFilters = (newParams: SkillListQueryParams) =>
        navigate(
          "?" +
            stringifyQs({
              ...params,
              ...newParams
            })
        );
      const paginationState = createPaginationState(PAGINATE_BY, params);
      return (
        <TypedSkillListQuery
          displayLoader
          variables={{
            ...paginationState,
            stockAvailability: params.status
          }}
        >
          {({ data, loading }) => {
            const currentTab = getTabName(params);
            return (
              <Paginator
                pageInfo={maybe(() => data.products.pageInfo)}
                paginationState={paginationState}
                queryString={params}
              >
                {({ loadNextPage, loadPreviousPage, pageInfo }) => (
                  <SkillListCard
                    currentTab={currentTab}
                    filtersList={[]}
                    onAdd={() => navigate(productAddUrl)}
                    disabled={loading}
                    products={
                      data &&
                      data.skills !== undefined &&
                      data.skills !== null
                        ? data.products.edges.map(p => p.node)
                        : undefined
                    }
                    onNextPage={loadNextPage}
                    onPreviousPage={loadPreviousPage}
                    pageInfo={pageInfo}
                    onRowClick={id => () => navigate(productUrl(id))}
                    onAllSkills={() =>
                      changeFilters({
                        status: undefined
                      })
                    }
                    onCustomFilter={() => undefined}
                    onAvailable={() =>
                      changeFilters({
                        status: StockAvailability.IN_STOCK
                      })
                    }
                    onOfStock={() =>
                      changeFilters({
                        status: StockAvailability.OUT_OF_STOCK
                      })
                    }
                  />
                )}
              </Paginator>
            );
          }}
        </TypedSkillListQuery>
      );
    }}
  </Navigator>
);
export default SkillList;
