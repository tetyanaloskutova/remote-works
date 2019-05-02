import * as React from "react";

import { UserError } from "../../../types";

interface SkillTypeUpdateErrorsState {
  addAttributeErrors: UserError[];
  editAttributeErrors: UserError[];
  formErrors: UserError[];
}
interface SkillTypeUpdateErrorsProps {
  children: (
    props: {
      errors: SkillTypeUpdateErrorsState;
      set: {
        addAttributeErrors: (errors: UserError[]) => void;
        editAttributeErrors: (errors: UserError[]) => void;
        formErrors: (errors: UserError[]) => void;
      };
    }
  ) => React.ReactNode;
}

export class SkillTypeUpdateErrors extends React.Component<
  SkillTypeUpdateErrorsProps,
  SkillTypeUpdateErrorsState
> {
  state: SkillTypeUpdateErrorsState = {
    addAttributeErrors: [],
    editAttributeErrors: [],
    formErrors: []
  };

  render() {
    return this.props.children({
      errors: this.state,
      set: {
        addAttributeErrors: (addAttributeErrors: UserError[]) =>
          this.setState({ addAttributeErrors }),
        editAttributeErrors: (editAttributeErrors: UserError[]) =>
          this.setState({ editAttributeErrors }),
        formErrors: (formErrors: UserError[]) => this.setState({ formErrors })
      }
    });
  }
}
export default SkillTypeUpdateErrors;
