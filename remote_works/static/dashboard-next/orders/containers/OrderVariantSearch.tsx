import * as React from "react";
import { QueryResult } from "react-apollo";

import { LoadMore } from "../../queries";
import { TypedTaskVariantSearch } from "../queries";
import {
  TaskVariantSearch,
  TaskVariantSearchVariables
} from "../types/TaskVariantSearch";

interface TaskVariantSearchProviderProps {
  children: ((
    props: {
      variants: {
        search: (query: string) => void;
        searchOpts: QueryResult<
          TaskVariantSearch,
          TaskVariantSearchVariables
        > &
          LoadMore<TaskVariantSearch, TaskVariantSearchVariables>;
      };
    }
  ) => React.ReactElement<any>);
}
interface TaskVariantSearchProviderState {
  query: string;
}

export class TaskVariantSearchProvider extends React.Component<
  TaskVariantSearchProviderProps,
  TaskVariantSearchProviderState
> {
  state: TaskVariantSearchProviderState = { query: "" };

  search = (query: string) => this.setState({ query });

  render() {
    const { children } = this.props;
    return (
      <TypedTaskVariantSearch variables={{ search: this.state.query }}>
        {searchOpts =>
          children({ variants: { search: this.search, searchOpts } })
        }
      </TypedTaskVariantSearch>
    );
  }
}
