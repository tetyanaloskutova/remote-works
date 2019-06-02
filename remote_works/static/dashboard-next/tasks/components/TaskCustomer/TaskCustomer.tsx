import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import * as React from "react";

import CardTitle from "../../../components/CardTitle";
import ExternalLink from "../../../components/ExternalLink";
import Form from "../../../components/Form";
import Hr from "../../../components/Hr";
import SingleAutocompleteSelectField from "../../../components/SingleAutocompleteSelectField";
import Skeleton from "../../../components/Skeleton";
import Toggle from "../../../components/Toggle";
import i18n from "../../../i18n";
import { maybe } from "../../../misc";
import { TaskDetails_task } from "../../types/TaskDetails";
import { UserSearch_customers_edges_node } from "../../types/UserSearch";

const styles = (theme: Theme) =>
  createStyles({
    sectionHeader: {
      alignItems: "center",
      display: "flex",
      marginBottom: theme.spacing.unit * 3
    },
    sectionHeaderTitle: {
      flex: 1,
      fontWeight: 600 as 600,
      lineHeight: 1,
      textTransform: "uppercase"
    },
    sectionHeaderToolbar: {
      marginRight: -theme.spacing.unit * 2
    },
    userEmail: {
      fontWeight: 600 as 600,
      marginBottom: theme.spacing.unit
    }
  });

export interface TaskCustomerProps extends WithStyles<typeof styles> {
  task: TaskDetails_task;
  users?: UserSearch_customers_edges_node[];
  loading?: boolean;
  canEditAddresses: boolean;
  canEditCustomer: boolean;
  fetchUsers?: (query: string) => void;
  onCustomerEdit?: (
    data: {
      user?: string;
      userEmail?: string;
    }
  ) => void;
  onBillingAddressEdit?: () => void;
  onDeliveryAddressEdit?: () => void;
}

const TaskCustomer = withStyles(styles, { name: "TaskCustomer" })(
  ({
    classes,
    canEditAddresses,
    canEditCustomer,
    fetchUsers,
    loading,
    task,
    users,
    onCustomerEdit,
    onBillingAddressEdit,
    onDeliveryAddressEdit
  }: TaskCustomerProps) => {
    const billingAddress = maybe(() => task.billingAddress);
    const deliveryAddress = maybe(() => task.deliveryAddress);
    const user = maybe(() => task.user);
    return (
      <Card>
        <Toggle>
          {(editMode, { toggle: toggleEditMode }) => (
            <>
              <CardTitle
                title={i18n.t("Customer")}
                toolbar={
                  !!canEditCustomer && (
                    <Button
                      color="secondary"
                      variant="text"
                      disabled={!onCustomerEdit}
                      onClick={toggleEditMode}
                    >
                      {i18n.t("Edit")}
                    </Button>
                  )
                }
              />
              <CardContent>
                {user === undefined ? (
                  <Skeleton />
                ) : editMode && canEditCustomer ? (
                  <Form initial={{ query: { label: "", value: "" } }}>
                    {({ change, data }) => {
                      const handleChange = (event: React.ChangeEvent<any>) => {
                        change(event);
                        onCustomerEdit({
                          [event.target.value.value.includes("@")
                            ? "userEmail"
                            : "user"]: event.target.value.value
                        });
                        toggleEditMode();
                      };
                      return (
                        <SingleAutocompleteSelectField
                          custom={true}
                          choices={maybe(() => users, []).map(user => ({
                            label: user.email,
                            value: user.id
                          }))}
                          fetchChoices={fetchUsers}
                          loading={loading}
                          placeholder={i18n.t("Search Customers")}
                          onChange={handleChange}
                          name="query"
                          value={data.query}
                        />
                      );
                    }}
                  </Form>
                ) : user === null ? (
                  <Typography>{i18n.t("Anonymous user")}</Typography>
                ) : (
                  <>
                    <Typography className={classes.userEmail}>
                      {user.email}
                    </Typography>
                    {/* TODO: uncomment after adding customer section */}
                    {/* <div>
                      <Link underline={false}>{i18n.t("View Profile")}</Link>
                    </div>
                    <div>
                      <Link underline={false}>{i18n.t("View Tasks")}</Link>
                    </div> */}
                  </>
                )}
              </CardContent>
            </>
          )}
        </Toggle>
        <Hr />
        <CardContent>
          <div className={classes.sectionHeader}>
            <Typography className={classes.sectionHeaderTitle}>
              {i18n.t("Contact information")}
            </Typography>
          </div>

          {maybe(() => task.userEmail) === undefined ? (
            <Skeleton />
          ) : task.userEmail === null ? (
            <Typography>{i18n.t("Not set")}</Typography>
          ) : (
            <ExternalLink
              href={`mailto:${maybe(() => task.userEmail)}`}
              typographyProps={{ color: "primary" }}
            >
              {maybe(() => task.userEmail)}
            </ExternalLink>
          )}
        </CardContent>
        <Hr />
        <CardContent>
          <div className={classes.sectionHeader}>
            <Typography className={classes.sectionHeaderTitle}>
              {i18n.t("Delivery Address")}
            </Typography>
            {canEditAddresses && (
              <div className={classes.sectionHeaderToolbar}>
                <Button
                  color="secondary"
                  variant="text"
                  onClick={onDeliveryAddressEdit}
                  disabled={!onDeliveryAddressEdit && user === undefined}
                >
                  {i18n.t("Edit")}
                </Button>
              </div>
            )}
          </div>
          {deliveryAddress === undefined ? (
            <Skeleton />
          ) : deliveryAddress === null ? (
            <Typography>{i18n.t("Not set")}</Typography>
          ) : (
            <>
              {deliveryAddress.companyName && (
                <Typography>{deliveryAddress.companyName}</Typography>
              )}
              <Typography>
                {deliveryAddress.firstName} {deliveryAddress.lastName}
              </Typography>
              <Typography>
                {deliveryAddress.streetAddress1}
                <br />
                {deliveryAddress.streetAddress2}
              </Typography>
              <Typography>
                {deliveryAddress.postalCode} {deliveryAddress.city}
                {deliveryAddress.cityArea
                  ? ", " + deliveryAddress.cityArea
                  : ""}
              </Typography>
              <Typography>
                {deliveryAddress.countryArea
                  ? deliveryAddress.countryArea +
                    ", " +
                    deliveryAddress.country.country
                  : deliveryAddress.country.country}
              </Typography>
              <Typography>{deliveryAddress.phone}</Typography>
            </>
          )}
        </CardContent>
        <Hr />
        <CardContent>
          <div className={classes.sectionHeader}>
            <Typography className={classes.sectionHeaderTitle}>
              {i18n.t("Billing Address")}
            </Typography>
            {canEditAddresses && (
              <div className={classes.sectionHeaderToolbar}>
                <Button
                  color="secondary"
                  variant="text"
                  onClick={onBillingAddressEdit}
                  disabled={!onBillingAddressEdit && user === undefined}
                >
                  {i18n.t("Edit")}
                </Button>
              </div>
            )}
          </div>
          {billingAddress === undefined ? (
            <Skeleton />
          ) : billingAddress === null ? (
            <Typography>{i18n.t("Not set")}</Typography>
          ) : maybe(() => deliveryAddress.id) === billingAddress.id ? (
            <Typography>{i18n.t("Same as delivery address")}</Typography>
          ) : (
            <>
              {billingAddress.companyName && (
                <Typography>{billingAddress.companyName}</Typography>
              )}
              <Typography>
                {billingAddress.firstName} {billingAddress.lastName}
              </Typography>
              <Typography>
                {billingAddress.streetAddress1}
                <br />
                {billingAddress.streetAddress2}
              </Typography>
              <Typography>
                {billingAddress.postalCode} {billingAddress.city}
                {billingAddress.cityArea ? ", " + billingAddress.cityArea : ""}
              </Typography>
              <Typography>
                {billingAddress.countryArea
                  ? billingAddress.countryArea +
                    ", " +
                    billingAddress.country.country
                  : billingAddress.country.country}
              </Typography>
              <Typography>{billingAddress.phone}</Typography>
            </>
          )}
        </CardContent>
      </Card>
    );
  }
);
TaskCustomer.displayName = "TaskCustomer";
export default TaskCustomer;
