import * as React from "react";

import ErrorMessageCard from "../../components/ErrorMessageCard";
import Navigator from "../../components/Navigator";
import { createPaginationState, Paginator } from "../../components/Paginator";
import { maybe } from "../../misc";
import SkillTypeListPage from "../components/SkillTypeListPage";
import { TypedSkillTypeListQuery } from "../queries";
import { skillTypeAddUrl, skillTypeUrl } from "../urls";

export type SkillTypeListQueryParams = Partial<{
  after: string;
  before: string;
}>;

interface SkillTypeListProps {
  params: SkillTypeListQueryParams;
}

const PAGINATE_BY = 20;

export const SkillTypeList: React.StatelessComponent<
  SkillTypeListProps
> = ({ params }) => (
  <Navigator>
    {navigate => {
      const paginationState = createPaginationState(PAGINATE_BY, params);
      return (
        <TypedSkillTypeListQuery displayLoader variables={paginationState}>
          {({ data, loading, error }) => {
            if (error) {
              return <ErrorMessageCard message="Something went wrong" />;
            }
            return (
              <Paginator
                pageInfo={maybe(() => data.skillTypes.pageInfo)}
                paginationState={paginationState}
                queryString={params}
              >
                {({ loadNextPage, loadPreviousPage, pageInfo }) => (
                  <SkillTypeListPage
                    disabled={loading}
                    skillTypes={maybe(() =>
                      data.skillTypes.edges.map(edge => edge.node)
                    )}
                    pageInfo={pageInfo}
                    onAdd={() => navigate(skillTypeAddUrl)}
                    onNextPage={loadNextPage}
                    onPreviousPage={loadPreviousPage}
                    onRowClick={id => () => navigate(skillTypeUrl(id))}
                  />
                )}
              </Paginator>
            );
          }}
        </TypedSkillTypeListQuery>
      );
    }}
  </Navigator>
);
SkillTypeList.displayName = "SkillTypeList";
export default SkillTypeList;
