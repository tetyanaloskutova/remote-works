import { stringify as stringifyQs } from "qs";
import * as React from "react";

import Messages from "../../components/messages";
import Navigator from "../../components/Navigator";
import { createPaginationState, Paginator } from "../../components/Paginator";
import i18n from "../../i18n";
import { maybe } from "../../misc";
import { TaskStatusFilter } from "../../types/globalTypes";
import TaskListPage from "../components/TaskListPage/TaskListPage";
import { getTabName } from "../misc";
import { TypedTaskDraftCreateMutation } from "../mutations";
import { TypedTaskListQuery } from "../queries";
import { TaskDraftCreate } from "../types/TaskDraftCreate";
import { orderUrl } from "../urls";

export interface TaskListFilters {
  status: TaskStatusFilter;
}
export type TaskListQueryParams = Partial<
  {
    after: string;
    before: string;
  } & TaskListFilters
>;

interface TaskListProps {
  params: TaskListQueryParams;
}

const PAGINATE_BY = 20;

export const TaskList: React.StatelessComponent<TaskListProps> = ({
  params
}) => (
  <Navigator>
    {navigate => (
      <Messages>
        {pushMessage => {
          const handleCreateTaskCreateSuccess = (data: TaskDraftCreate) => {
            pushMessage({
              text: i18n.t("Task draft succesfully created")
            });
            navigate(orderUrl(data.draftTaskCreate.task.id));
          };

          const changeFilters = (newParams: TaskListQueryParams) =>
            navigate(
              "?" +
                stringifyQs({
                  ...params,
                  ...newParams
                })
            );

          return (
            <TypedTaskDraftCreateMutation
              onCompleted={handleCreateTaskCreateSuccess}
            >
              {createTask => {
                const paginationState = createPaginationState(
                  PAGINATE_BY,
                  params
                );
                const currentTab = getTabName(params);

                return (
                  <TypedTaskListQuery
                    displayLoader
                    variables={{
                      ...paginationState,
                      status: params.status
                    }}
                  >
                    {({ data, loading }) => (
                      <Paginator
                        pageInfo={maybe(() => data.tasks.pageInfo)}
                        paginationState={paginationState}
                        queryString={params}
                      >
                        {({ loadNextPage, loadPreviousPage, pageInfo }) => (
                          <TaskListPage
                            filtersList={[]}
                            currentTab={currentTab}
                            disabled={loading}
                            tasks={maybe(() =>
                              data.tasks.edges.map(edge => edge.node)
                            )}
                            pageInfo={pageInfo}
                            onAdd={createTask}
                            onNextPage={loadNextPage}
                            onPreviousPage={loadPreviousPage}
                            onRowClick={id => () => navigate(orderUrl(id))}
                            onAllSkills={() =>
                              changeFilters({
                                status: undefined
                              })
                            }
                            onToFulfill={() =>
                              changeFilters({
                                status: TaskStatusFilter.READY_TO_FULFILL
                              })
                            }
                            onToCapture={() =>
                              changeFilters({
                                status: TaskStatusFilter.READY_TO_CAPTURE
                              })
                            }
                            onCustomFilter={() => undefined}
                          />
                        )}
                      </Paginator>
                    )}
                  </TypedTaskListQuery>
                );
              }}
            </TypedTaskDraftCreateMutation>
          );
        }}
      </Messages>
    )}
  </Navigator>
);

export default TaskList;
