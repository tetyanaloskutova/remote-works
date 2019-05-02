import { parse as parseQs } from "qs";
import * as React from "react";
import { Route, RouteComponentProps, Switch } from "react-router-dom";

import { WindowTitle } from "../components/WindowTitle";
import i18n from "../i18n";
import {
  productAddPath,
  productImagePath,
  productListPath,
  productPath,
  productVariantAddPath,
  productVariantEditPath
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
      productId={decodeURIComponent(match.params.productId)}
    />
  );
};

const SkillImage: React.StatelessComponent<RouteComponentProps<any>> = ({
  match
}) => {
  return (
    <SkillImageComponent
      imageId={decodeURIComponent(match.params.imageId)}
      productId={decodeURIComponent(match.params.productId)}
    />
  );
};

const SkillVariantCreate: React.StatelessComponent<
  RouteComponentProps<any>
> = ({ match }) => {
  return (
    <SkillVariantCreateComponent
      productId={decodeURIComponent(match.params.id)}
    />
  );
};

const Component = () => (
  <>
    <WindowTitle title={i18n.t("Skills")} />
    <Switch>
      <Route exact path={productListPath} component={SkillList} />
      <Route exact path={productAddPath} component={SkillCreate} />
      <Route
        exact
        path={productVariantAddPath(":id")}
        component={SkillVariantCreate}
      />
      <Route
        path={productVariantEditPath(":productId", ":variantId")}
        component={SkillVariant}
      />
      <Route
        path={productImagePath(":productId", ":imageId")}
        component={SkillImage}
      />
      <Route path={productPath(":id")} component={SkillUpdate} />
    </Switch>
  </>
);

export default Component;
