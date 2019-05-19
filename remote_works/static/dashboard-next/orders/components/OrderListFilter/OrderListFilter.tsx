import * as React from "react";

import {
  Filter,
  FilterChips,
  FilterTab,
  FilterTabs
} from "../../../components/TableFilter";
import i18n from "../../../i18n";

export type TaskListFilterTabs = "all" | "toFulfill" | "toCapture" | "custom";

interface TaskListFilterProps {
  currentTab: TaskListFilterTabs;
  filtersList: Filter[];
  onAllSkills: () => void;
  onToFulfill: () => void;
  onToCapture: () => void;
  onCustomFilter: () => void;
}

const TaskListFilter: React.StatelessComponent<TaskListFilterProps> = ({
  filtersList,
  currentTab,
  onAllSkills,
  onToFulfill,
  onToCapture,
  onCustomFilter
}) => (
  <>
    <FilterTabs
      currentTab={["all", "toFulfill", "toCapture", "custom"].indexOf(
        currentTab
      )}
    >
      <FilterTab label={i18n.t("All Tasks")} onClick={onAllSkills} />
      <FilterTab label={i18n.t("Ready to fulfill")} onClick={onToFulfill} />
      <FilterTab label={i18n.t("Ready to capture")} onClick={onToCapture} />
      {currentTab === "custom" && filtersList && filtersList.length > 0 && (
        <FilterTab
          onClick={onCustomFilter}
          value={0}
          label={i18n.t("Custom Filter")}
        />
      )}
    </FilterTabs>
    {currentTab === "custom" && filtersList && filtersList.length > 0 && (
      <FilterChips filtersList={filtersList} />
    )}
  </>
);
TaskListFilter.displayName = "TaskListFilter";
export default TaskListFilter;
