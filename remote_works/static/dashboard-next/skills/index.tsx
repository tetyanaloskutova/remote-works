import { parse as parseQs } from "qs";
import * as React from "react";
import { Route, RouteComponentProps, Switch } from "react-router-dom";

import { WindowTitle } from "../components/WindowTitle";
import i18n from "../i18n";
import {
  skillAddPath,
  skillImagePath,
  skillListPath,
  skillPath,
  skillVariantAddPath,
  skillVariantEditPath
} from "./urls";
import SkillCreate from "./views/SkillCreate";
import SkillImageComponent from "./views/SkillImage";
import SkillListComponent, {
  SkillListQueryParams
} from "./views/SkillList";
import SkillUpdateComponent from "./views/SkillUpdate";
import SkillVariantComponent from "./views/SkillVariant";
import SkillVariantCreateComponent from "./views/SkillVariantCreate";

const SkillList: React.StatelessComponent<RouteComponentProps<any>> = ({
  location
}) => {
  const qs = parseQs(location.search.substr(1));
  const params: SkillListQueryParams = {
    after: qs.after,
    before: qs.before,
    status: qs.status
  };
  return <SkillListComponent params={params} />;
};

const SkillUpdate: React.StatelessComponent<RouteComponentProps<any>> = ({
  match
}) => {
  return <SkillUpdateComponent id={decodeURIComponent(match.params.id)} />;
};

const SkillVariant: React.StatelessComponent<RouteComponentProps<any>> = ({
  match
}) => {
  return (
    <SkillVariantComponent
      variantId={decodeURIComponent(match.params.variantId)}
      skillId={decodeURIComponent(match.params.skillId)}
    />
  );
};

const SkillImage: React.StatelessComponent<RouteComponentProps<any>> = ({
  match
}) => {
  return (
    <SkillImageComponent
      imageId={decodeURIComponent(match.params.imageId)}
      skillId={decodeURIComponent(match.params.skillId)}
    />
  );
};

const SkillVariantCreate: React.StatelessComponent<
  RouteComponentProps<any>
> = ({ match }) => {
  return (
    <SkillVariantCreateComponent
      skillId={decodeURIComponent(match.params.id)}
    />
  );
};

const Component = () => (
  <>
    <WindowTitle title={i18n.t("Skills")} />
    <Switch>
      <Route exact path={skillListPath} component={SkillList} />
      <Route exact path={skillAddPath} component={SkillCreate} />
      <Route
        exact
        path={skillVariantAddPath(":id")}
        component={SkillVariantCreate}
      />
      <Route
        path={skillVariantEditPath(":skillId", ":variantId")}
        component={SkillVariant}
      />
      <Route
        path={skillImagePath(":skillId", ":imageId")}
        component={SkillImage}
      />
      <Route path={skillPath(":id")} component={SkillUpdate} />
    </Switch>
  </>
);

export default Component;
