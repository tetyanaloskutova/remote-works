import { parse as parseQs } from "qs";
import * as React from "react";
import { Route, RouteComponentProps, Switch } from "react-router-dom";

import { WindowTitle } from "../components/WindowTitle";
import i18n from "../i18n";
import {
  productTypeAddPath,
  productTypeListPath,
  productTypePath
} from "./urls";
import SkillTypeCreate from "./views/SkillTypeCreate";
import SkillTypeListComponent, {
  SkillTypeListQueryParams
} from "./views/SkillTypeList";
import SkillTypeUpdateComponent from "./views/SkillTypeUpdate";

const SkillTypeList: React.StatelessComponent<RouteComponentProps<{}>> = ({
  location
}) => {
  const qs = parseQs(location.search.substr(1));
  const params: SkillTypeListQueryParams = {
    after: qs.after,
    before: qs.before
  };
  return <SkillTypeListComponent params={params} />;
};

interface SkillTypeUpdateRouteParams {
  id: string;
}
const SkillTypeUpdate: React.StatelessComponent<
  RouteComponentProps<SkillTypeUpdateRouteParams>
> = ({ match }) => (
  <SkillTypeUpdateComponent id={decodeURIComponent(match.params.id)} />
);

export const SkillTypeRouter: React.StatelessComponent<
  RouteComponentProps<any>
> = () => (
  <>
    <WindowTitle title={i18n.t("Skill types")} />
    <Switch>
      <Route exact path={productTypeListPath} component={SkillTypeList} />
      <Route exact path={productTypeAddPath} component={SkillTypeCreate} />
      <Route path={productTypePath(":id")} component={SkillTypeUpdate} />
    </Switch>
  </>
);
SkillTypeRouter.displayName = "SkillTypeRouter";
export default SkillTypeRouter;
