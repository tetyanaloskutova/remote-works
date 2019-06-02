import * as React from "react";

import { CardSpacer } from "../../../components/CardSpacer";
import { ConfirmButtonTransitionState } from "../../../components/ConfirmButton/ConfirmButton";
import Container from "../../../components/Container";
import Form from "../../../components/Form";
import Grid from "../../../components/Grid";
import PageHeader from "../../../components/PageHeader";
import SaveButtonBar from "../../../components/SaveButtonBar";
import { getUserName, maybe } from "../../../misc";
import { UserError } from "../../../types";
import { CustomerDetails_user } from "../../types/CustomerDetails";
import CustomerAddresses from "../CustomerAddresses/CustomerAddresses";
import CustomerDetails from "../CustomerDetails/CustomerDetails";
import CustomerStats from "../CustomerStats/CustomerStats";
import CustomerTasks from "../CustomerTasks/CustomerTasks";

export interface CustomerDetailsPageFormData {
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  note: string;
}

export interface CustomerDetailsPageProps {
  customer: CustomerDetails_user;
  disabled: boolean;
  errors: UserError[];
  saveButtonBar: ConfirmButtonTransitionState;
  onBack: () => void;
  onSubmit: (data: CustomerDetailsPageFormData) => void;
  onViewAllTasksClick: () => void;
  onRowClick: (id: string) => void;
  onAddressManageClick: () => void;
  onDelete: () => void;
}

const CustomerDetailsPage: React.StatelessComponent<
  CustomerDetailsPageProps
> = ({
  customer,
  disabled,
  errors,
  saveButtonBar,
  onBack,
  onSubmit,
  onViewAllTasksClick,
  onRowClick,
  onAddressManageClick,
  onDelete
}: CustomerDetailsPageProps) => (
  <Form
    errors={errors}
    initial={{
      email: maybe(() => customer.email),
      firstName: maybe(() => customer.firstName),
      isActive: maybe(() => customer.isActive, false),
      lastName: maybe(() => customer.lastName),
      note: maybe(() => customer.note)
    }}
    onSubmit={onSubmit}
    confirmLeave
  >
    {({ change, data, errors: formErrors, hasChanged, submit }) => (
      <Container width="md">
        <PageHeader onBack={onBack} title={getUserName(customer, true)} />
        <Grid>
          <div>
            <CustomerDetails
              customer={customer}
              data={data}
              disabled={disabled}
              errors={formErrors}
              onChange={change}
            />
            <CardSpacer />
            <CustomerTasks
              tasks={maybe(() => customer.tasks.edges.map(edge => edge.node))}
              onViewAllTasksClick={onViewAllTasksClick}
              onRowClick={onRowClick}
            />
          </div>
          <div>
            <CustomerAddresses
              customer={customer}
              disabled={disabled}
              onAddressManageClick={onAddressManageClick}
            />
            <CardSpacer />
            <CustomerStats customer={customer} />
          </div>
        </Grid>
        <SaveButtonBar
          disabled={disabled || !hasChanged}
          state={saveButtonBar}
          onSave={submit}
          onCancel={onBack}
          onDelete={onDelete}
        />
      </Container>
    )}
  </Form>
);
CustomerDetailsPage.displayName = "CustomerDetailsPage";
export default CustomerDetailsPage;
