import * as React from "react";
import { QueryResult } from "react-apollo";
import { TypedSearchSkillsQuery } from "./query";
import {
  SearchSkills,
  SearchSkillsVariables
} from "./types/SearchSkills";

interface SearchSkillsProviderProps {
  children: ((
    search: (query: string) => void,
    searchOpts: QueryResult<SearchSkills, SearchSkillsVariables>
  ) => React.ReactElement<any>);
}
interface SearchSkillsProviderState {
  query: string;
}

export class SearchSkillsProvider extends React.Component<
  SearchSkillsProviderProps,
  SearchSkillsProviderState
> {
  state: SearchSkillsProviderState = { query: "" };

  search = (query: string) => this.setState({ query });

  render() {
    const { children } = this.props;
    return (
      <TypedSearchSkillsQuery variables={{ query: this.state.query }}>
        {searchOpts => children(this.search, searchOpts)}
      </TypedSearchSkillsQuery>
    );
  }
}
