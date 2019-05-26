import { empty, only } from "../misc";
import { TaskStatusFilter } from "../types/globalTypes";
import { TaskListFilterTabs } from "./components/TaskListFilter";
import { TaskListQueryParams } from "./views/TaskList";

export const getTabName = (qs: TaskListQueryParams): TaskListFilterTabs => {
  const filters = {
    status: qs.status
  };
  if (empty(filters)) {
    return "all";
  }
  if (only(filters, "status")) {
    switch (filters.status) {
      case TaskStatusFilter.READY_TO_CAPTURE:
        return "toCapture";
      case TaskStatusFilter.READY_TO_FULFILL:
        return "toFulfill";
    }
  }
  return "custom";
};
