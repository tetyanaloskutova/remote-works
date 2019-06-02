import { parse as parseQs } from "qs";
import * as React from "react";
import { Route, RouteComponentProps, Switch } from "react-router-dom";

import { WindowTitle } from "../components/WindowTitle";
import i18n from "../i18n";
import { taskListPath, taskPath } from "./urls";
import TaskDetailsComponent from "./views/TaskDetails";
import TaskListComponent, { TaskListQueryParams } from "./views/TaskList";

const TaskList: React.StatelessComponent<RouteComponentProps<any>> = ({
  location
}) => {
  const qs = parseQs(location.search.substr(1));
  const params: TaskListQueryParams = {
    after: qs.after,
    before: qs.before,
    status: qs.status
  };
  return <TaskListComponent params={params} />;
};

const TaskDetails: React.StatelessComponent<RouteComponentProps<any>> = ({
  match
}) => {
  return <TaskDetailsComponent id={decodeURIComponent(match.params.id)} />;
};

const Component = () => (
  <>
    <WindowTitle title={i18n.t("Tasks")} />
    <Switch>
      <Route exact path={taskListPath} component={TaskList} />
      <Route path={taskPath(":id")} component={TaskDetails} />
    </Switch>
  </>
);

export default Component;
