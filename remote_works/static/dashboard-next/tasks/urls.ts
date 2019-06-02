import { stringify as stringifyQs } from "qs";
import * as urlJoin from "url-join";

import { TaskListQueryParams } from "./views/TaskList";

const taskSectionUrl = "/tasks/";

export const taskListPath = taskSectionUrl;
export const taskListUrl = (params?: TaskListQueryParams): string => {
  const taskList = taskSectionUrl;
  if (params === undefined) {
    return taskList;
  } else {
    return urlJoin(taskList, "?" + stringifyQs(params));
  }
};

export const taskPath = (id: string) => urlJoin(taskSectionUrl, id);
export const taskUrl = (id: string) => taskPath(encodeURIComponent(id));
