import { DocumentNode } from "graphql";
import gql from "graphql-tag";
import * as React from "react";
import { Query, QueryResult } from "react-apollo";

import { ApolloQueryResult } from "apollo-client";
import AppProgress from "./components/AppProgress";
import ErrorPage from "./components/ErrorPage/ErrorPage";
import Messages from "./components/messages";
import Navigator from "./components/Navigator";
import i18n from "./i18n";
import { RequireAtLeastOne } from "./misc";

export interface LoadMore<TData, TVariables> {
  loadMore: (
    mergeFunc: (prev: TData, next: TData) => TData,
    extraVariables: RequireAtLeastOne<TVariables>
  ) => Promise<ApolloQueryResult<TData>>;
}


export const pageInfoFragment = gql`
  fragment PageInfoFragment on PageInfo {
    endCursor
    hasNextPage
    hasPreviousPage
    startCursor
  }
`;
