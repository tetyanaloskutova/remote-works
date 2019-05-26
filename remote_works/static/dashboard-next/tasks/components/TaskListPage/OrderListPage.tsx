import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import AddIcon from "@material-ui/icons/Add";
import * as React from "react";

import Container from "../../../components/Container";
import PageHeader from "../../../components/PageHeader";
import { Filter } from "../../../components/TableFilter";
import i18n from "../../../i18n";
import { PageListProps } from "../../../types";
import { TaskList_orders_edges_node } from "../../types/TaskList";
import TaskList from "../TaskList";
import TaskListFilter, { TaskListFilterTabs } from "../TaskListFilter";

interface TaskListPageProps extends PageListProps {
  tasks: TaskList_orders_edges_node[];
  currentTab: TaskListFilterTabs;
  filtersList: Filter[];
  onAllSkills: () => void;
  onToFulfill: () => void;
  onToCapture: () => void;
  onCustomFilter: () => void;
}

const TaskListPage: React.StatelessComponent<TaskListPageProps> = ({
  disabled,
  tasks,
  pageInfo,
  onAdd,
  onNextPage,
  onPreviousPage,
  onRowClick,
  currentTab,
  filtersList,
  onAllSkills,
  onToFulfill,
  onToCapture,
  onCustomFilter
}) => (
  <Container width="md">
    <PageHeader title={i18n.t("Tasks")}>
      <Button
        color="secondary"
        variant="contained"
        disabled={disabled}
        onClick={onAdd}
      >
        {i18n.t("Create task", { context: "button" })} <AddIcon />
      </Button>
    </PageHeader>
    <Card>
      <TaskListFilter
        currentTab={currentTab}
        filtersList={filtersList}
        onAllSkills={onAllSkills}
        onToFulfill={onToFulfill}
        onToCapture={onToCapture}
        onCustomFilter={onCustomFilter}
      />
      <TaskList
        disabled={disabled}
        onRowClick={onRowClick}
        tasks={tasks}
        pageInfo={pageInfo}
        onNextPage={onNextPage}
        onPreviousPage={onPreviousPage}
      />
    </Card>
  </Container>
);
TaskListPage.displayName = "TaskListPage";
export default TaskListPage;
