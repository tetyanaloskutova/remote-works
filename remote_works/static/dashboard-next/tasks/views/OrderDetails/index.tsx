import * as React from "react";
import { Route } from "react-router-dom";

import ErrorMessageCard from "../../../components/ErrorMessageCard";
import Navigator from "../../../components/Navigator";
import { WindowTitle } from "../../../components/WindowTitle";
import { getMutationState, maybe, transformAddressToForm } from "../../../misc";
import { productUrl } from "../../../products/urls";
import { TaskStatus } from "../../../types/globalTypes";
import TaskAddressEditDialog from "../../components/TaskAddressEditDialog";
import TaskCancelDialog from "../../components/TaskCancelDialog";
import TaskDetailsPage from "../../components/TaskDetailsPage";
import TaskDraftCancelDialog from "../../components/TaskDraftCancelDialog/TaskDraftCancelDialog";
import TaskDraftFinalizeDialog, {
  TaskDraftFinalizeWarning
} from "../../components/TaskDraftFinalizeDialog";
import TaskDraftPage from "../../components/TaskDraftPage";
import TaskFulfillmentCancelDialog from "../../components/TaskFulfillmentCancelDialog";
import TaskFulfillmentDialog from "../../components/TaskFulfillmentDialog";
import TaskFulfillmentTrackingDialog from "../../components/TaskFulfillmentTrackingDialog";
import TaskMarkAsPaidDialog from "../../components/TaskMarkAsPaidDialog/TaskMarkAsPaidDialog";
import TaskPaymentDialog from "../../components/TaskPaymentDialog";
import TaskPaymentVoidDialog from "../../components/TaskPaymentVoidDialog";
import TaskSkillAddDialog from "../../components/TaskSkillAddDialog";
import TaskDeliveryMethodEditDialog from "../../components/TaskDeliveryMethodEditDialog";
import TaskOperations from "../../containers/TaskOperations";
import { TaskVariantSearchProvider } from "../../containers/TaskVariantSearch";
import { UserSearchProvider } from "../../containers/UserSearch";
import { TypedTaskDetailsQuery } from "../../queries";
import { TaskDetails_order } from "../../types/TaskDetails";
import { orderListUrl, orderUrl } from "../../urls";
import { TaskDetailsMessages } from "./TaskDetailsMessages";
import {
  orderBillingAddressEditPath,
  orderBillingAddressEditUrl,
  orderCancelPath,
  orderCancelUrl,
  orderDraftFinalizePath,
  orderDraftFinalizeUrl,
  orderDraftLineAddPath,
  orderDraftLineAddUrl,
  orderDraftDeliveryMethodPath,
  orderDraftDeliveryMethodUrl,
  orderFulfillmentCancelPath,
  orderFulfillmentCancelUrl,
  orderFulfillmentEditTrackingPath,
  orderFulfillmentEditTrackingUrl,
  orderFulfillPath,
  orderFulfillUrl,
  orderMarkAsPaidPath,
  orderMarkAsPaidUrl,
  orderPaymentCapturePath,
  orderPaymentCaptureUrl,
  orderPaymentRefundPath,
  orderPaymentRefundUrl,
  orderPaymentVoidPath,
  orderPaymentVoidUrl,
  orderDeliveryAddressEditPath,
  orderDeliveryAddressEditUrl
} from "./urls";

const orderDraftFinalizeWarnings = (task: TaskDetails_order) => {
  const warnings = [] as TaskDraftFinalizeWarning[];
  if (!(task && task.deliveryAddress)) {
    warnings.push("no-delivery");
  }
  if (!(task && task.billingAddress)) {
    warnings.push("no-billing");
  }
  if (!(task && (task.user || task.userEmail))) {
    warnings.push("no-user");
  }
  if (
    task &&
    task.lines &&
    task.lines.filter(line => line.isDeliveryRequired).length > 0 &&
    task.deliveryMethod === null
  ) {
    warnings.push("no-delivery-method");
  }
  if (
    task &&
    task.lines &&
    task.lines.filter(line => line.isDeliveryRequired).length === 0 &&
    task.deliveryMethod !== null
  ) {
    warnings.push("unnecessary-delivery-method");
  }
  return warnings;
};

interface TaskDetailsProps {
  id: string;
}

export const TaskDetails: React.StatelessComponent<TaskDetailsProps> = ({
  id
}) => (
  <Navigator>
    {navigate => (
      <TypedTaskDetailsQuery
        displayLoader
        variables={{ id }}
        require={["task"]}
      >
        {({ data, error, loading }) => {
          if (error) {
            return <ErrorMessageCard message="Something went wrong" />;
          }
          const task = maybe(() => data.task);
          const onModalClose = () => navigate(orderUrl(id), true);
          return (
            <UserSearchProvider>
              {users => (
                <TaskDetailsMessages>
                  {orderMessages => (
                    <TaskOperations
                      task={id}
                      onTaskFulfillmentCreate={
                        orderMessages.handleTaskFulfillmentCreate
                      }
                      onNoteAdd={orderMessages.handleNoteAdd}
                      onTaskCancel={orderMessages.handleTaskCancel}
                      onTaskVoid={orderMessages.handleTaskVoid}
                      onPaymentCapture={orderMessages.handlePaymentCapture}
                      onPaymentRefund={orderMessages.handlePaymentRefund}
                      onUpdate={orderMessages.handleUpdate}
                      onDraftUpdate={orderMessages.handleDraftUpdate}
                      onDeliveryMethodUpdate={
                        orderMessages.handleDeliveryMethodUpdate
                      }
                      onTaskLineDelete={orderMessages.handleTaskLineDelete}
                      onTaskLineAdd={orderMessages.handleTaskLineAdd}
                      onTaskLineUpdate={orderMessages.handleTaskLineUpdate}
                      onTaskFulfillmentCancel={
                        orderMessages.handleTaskFulfillmentCancel
                      }
                      onTaskFulfillmentUpdate={
                        orderMessages.handleTaskFulfillmentUpdate
                      }
                      onDraftFinalize={orderMessages.handleDraftFinalize}
                      onDraftCancel={orderMessages.handleDraftCancel}
                      onTaskMarkAsPaid={orderMessages.handleTaskMarkAsPaid}
                    >
                      {({
                        orderAddNote,
                        orderCancel,
                        orderCreateFulfillment,
                        orderDraftUpdate,
                        orderLineAdd,
                        orderLineDelete,
                        orderLineUpdate,
                        orderPaymentCapture,
                        orderPaymentRefund,
                        orderVoid,
                        orderDeliveryMethodUpdate,
                        orderUpdate,
                        orderFulfillmentCancel,
                        orderFulfillmentUpdateTracking,
                        orderDraftCancel,
                        orderDraftFinalize,
                        orderPaymentMarkAsPaid
                      }) => {
                        const finalizeTransitionState = getMutationState(
                          orderDraftFinalize.opts.called,
                          orderDraftFinalize.opts.loading,
                          maybe(
                            () =>
                              orderDraftFinalize.opts.data.draftTaskComplete
                                .errors
                          )
                        );
                        return (
                          <>
                            {maybe(() => task.status !== TaskStatus.DRAFT) ? (
                              <>
                                <WindowTitle
                                  title={maybe(
                                    () => "Task #" + data.task.number
                                  )}
                                />
                                <TaskDetailsPage
                                  onNoteAdd={variables =>
                                    orderAddNote.mutate({
                                      input: variables,
                                      task: id
                                    })
                                  }
                                  onBack={() => navigate(orderListUrl())}
                                  task={task}
                                  deliveryMethods={maybe(
                                    () => data.task.availableDeliveryMethods,
                                    []
                                  )}
                                  onTaskCancel={() =>
                                    navigate(orderCancelUrl(id))
                                  }
                                  onTaskFulfill={() =>
                                    navigate(orderFulfillUrl(id))
                                  }
                                  onFulfillmentCancel={fulfillmentId =>
                                    navigate(
                                      orderFulfillmentCancelUrl(
                                        id,
                                        fulfillmentId
                                      )
                                    )
                                  }
                                  onFulfillmentTrackingNumberUpdate={fulfillmentId =>
                                    navigate(
                                      orderFulfillmentEditTrackingUrl(
                                        id,
                                        fulfillmentId
                                      )
                                    )
                                  }
                                  onPaymentCapture={() =>
                                    navigate(orderPaymentCaptureUrl(id))
                                  }
                                  onPaymentVoid={() =>
                                    navigate(orderPaymentVoidUrl(id))
                                  }
                                  onPaymentRefund={() =>
                                    navigate(orderPaymentRefundUrl(id))
                                  }
                                  onSkillClick={id => () =>
                                    navigate(productUrl(id))}
                                  onBillingAddressEdit={() =>
                                    navigate(orderBillingAddressEditUrl(id))
                                  }
                                  onDeliveryAddressEdit={() =>
                                    navigate(orderDeliveryAddressEditUrl(id))
                                  }
                                  onPaymentPaid={() =>
                                    navigate(orderMarkAsPaidUrl(id))
                                  }
                                />
                                <Route
                                  path={orderCancelPath(":id")}
                                  render={({ match }) => (
                                    <TaskCancelDialog
                                      confirmButtonState={getMutationState(
                                        orderCancel.opts.called,
                                        orderCancel.opts.loading,
                                        maybe(
                                          () =>
                                            orderCancel.opts.data.orderCancel
                                              .errors
                                        )
                                      )}
                                      number={maybe(() => task.number)}
                                      open={!!match}
                                      onClose={onModalClose}
                                      onSubmit={variables =>
                                        orderCancel.mutate({
                                          id,
                                          ...variables
                                        })
                                      }
                                    />
                                  )}
                                />
                                <Route
                                  path={orderMarkAsPaidPath(":id")}
                                  render={({ match }) => (
                                    <TaskMarkAsPaidDialog
                                      confirmButtonState={getMutationState(
                                        orderPaymentMarkAsPaid.opts.called,
                                        orderPaymentMarkAsPaid.opts.loading,
                                        maybe(
                                          () =>
                                            orderPaymentMarkAsPaid.opts.data
                                              .orderMarkAsPaid.errors
                                        )
                                      )}
                                      onClose={onModalClose}
                                      onConfirm={() =>
                                        orderPaymentMarkAsPaid.mutate({
                                          id
                                        })
                                      }
                                      open={!!match}
                                    />
                                  )}
                                />
                                <Route
                                  path={orderPaymentVoidPath(":id")}
                                  render={({ match }) => (
                                    <TaskPaymentVoidDialog
                                      confirmButtonState={getMutationState(
                                        orderVoid.opts.called,
                                        orderVoid.opts.loading,
                                        maybe(
                                          () =>
                                            orderVoid.opts.data.orderVoid.errors
                                        )
                                      )}
                                      open={!!match}
                                      onClose={onModalClose}
                                      onConfirm={() => orderVoid.mutate({ id })}
                                    />
                                  )}
                                />
                                <Route
                                  path={orderPaymentCapturePath(":id")}
                                  render={({ match }) => (
                                    <TaskPaymentDialog
                                      confirmButtonState={getMutationState(
                                        orderPaymentCapture.opts.called,
                                        orderPaymentCapture.opts.loading,
                                        maybe(
                                          () =>
                                            orderPaymentCapture.opts.data
                                              .orderCapture.errors
                                        )
                                      )}
                                      initial={maybe(
                                        () => task.total.gross.amount
                                      )}
                                      open={!!match}
                                      variant="capture"
                                      onClose={onModalClose}
                                      onSubmit={variables =>
                                        orderPaymentCapture.mutate({
                                          ...variables,
                                          id
                                        })
                                      }
                                    />
                                  )}
                                />
                                <Route
                                  path={orderPaymentRefundPath(":id")}
                                  render={({ match }) => (
                                    <TaskPaymentDialog
                                      confirmButtonState={getMutationState(
                                        orderPaymentRefund.opts.called,
                                        orderPaymentRefund.opts.loading,
                                        maybe(
                                          () =>
                                            orderPaymentRefund.opts.data
                                              .orderRefund.errors
                                        )
                                      )}
                                      initial={maybe(
                                        () => task.total.gross.amount
                                      )}
                                      open={!!match}
                                      variant="refund"
                                      onClose={onModalClose}
                                      onSubmit={variables =>
                                        orderPaymentRefund.mutate({
                                          ...variables,
                                          id
                                        })
                                      }
                                    />
                                  )}
                                />
                                <Route
                                  path={orderFulfillPath(":id")}
                                  render={({ match }) => (
                                    <TaskFulfillmentDialog
                                      confirmButtonState={getMutationState(
                                        orderCreateFulfillment.opts.called,
                                        orderCreateFulfillment.opts.loading,
                                        maybe(
                                          () =>
                                            orderCreateFulfillment.opts.data
                                              .orderFulfillmentCreate.errors
                                        )
                                      )}
                                      open={!!match}
                                      lines={maybe(
                                        () => task.lines,
                                        []
                                      ).filter(
                                        line =>
                                          line.quantityFulfilled < line.quantity
                                      )}
                                      onClose={onModalClose}
                                      onSubmit={variables =>
                                        orderCreateFulfillment.mutate({
                                          input: {
                                            ...variables,
                                            lines: maybe(() => task.lines, [])
                                              .filter(
                                                line =>
                                                  line.quantityFulfilled <
                                                  line.quantity
                                              )
                                              .map((line, lineIndex) => ({
                                                orderLineId: line.id,
                                                quantity:
                                                  variables.lines[lineIndex]
                                              }))
                                              .filter(line => line.quantity > 0)
                                          },
                                          task: task.id
                                        })
                                      }
                                    />
                                  )}
                                />
                                <Route
                                  path={orderFulfillmentCancelPath(
                                    ":orderId",
                                    ":fulfillmentId"
                                  )}
                                  render={({ match }) => (
                                    <TaskFulfillmentCancelDialog
                                      confirmButtonState={getMutationState(
                                        orderFulfillmentCancel.opts.called,
                                        orderFulfillmentCancel.opts.loading,
                                        maybe(
                                          () =>
                                            orderFulfillmentCancel.opts.data
                                              .orderFulfillmentCancel.errors
                                        )
                                      )}
                                      open={!!match}
                                      onConfirm={variables =>
                                        orderFulfillmentCancel.mutate({
                                          id: decodeURIComponent(
                                            match.params.fulfillmentId
                                          ),
                                          input: variables
                                        })
                                      }
                                      onClose={onModalClose}
                                    />
                                  )}
                                />
                                <Route
                                  path={orderFulfillmentEditTrackingPath(
                                    ":orderId",
                                    ":fulfillmentId"
                                  )}
                                  render={({ match }) => (
                                    <TaskFulfillmentTrackingDialog
                                      confirmButtonState={getMutationState(
                                        orderFulfillmentUpdateTracking.opts
                                          .called,
                                        orderFulfillmentUpdateTracking.opts
                                          .loading,
                                        maybe(
                                          () =>
                                            orderFulfillmentUpdateTracking.opts
                                              .data
                                              .orderFulfillmentUpdateTracking
                                              .errors
                                        )
                                      )}
                                      open={!!match}
                                      trackingNumber={maybe(
                                        () =>
                                          data.task.fulfillments.find(
                                            fulfillment =>
                                              fulfillment.id ===
                                              decodeURIComponent(
                                                match.params.fulfillmentId
                                              )
                                          ).trackingNumber
                                      )}
                                      onConfirm={variables =>
                                        orderFulfillmentUpdateTracking.mutate({
                                          id: decodeURIComponent(
                                            match.params.fulfillmentId
                                          ),
                                          input: {
                                            ...variables,
                                            notifyCustomer: true
                                          }
                                        })
                                      }
                                      onClose={onModalClose}
                                    />
                                  )}
                                />
                              </>
                            ) : (
                              <>
                                <WindowTitle
                                  title={maybe(
                                    () => "Draft task #" + data.task.number
                                  )}
                                />
                                <TaskDraftPage
                                  disabled={loading}
                                  onNoteAdd={variables =>
                                    orderAddNote.mutate({
                                      input: variables,
                                      task: id
                                    })
                                  }
                                  users={maybe(
                                    () =>
                                      users.searchOpts.data.customers.edges.map(
                                        edge => edge.node
                                      ),
                                    []
                                  )}
                                  fetchUsers={users.search}
                                  usersLoading={users.searchOpts.loading}
                                  onCustomerEdit={data =>
                                    orderDraftUpdate.mutate({
                                      id,
                                      input: data
                                    })
                                  }
                                  onDraftFinalize={() =>
                                    navigate(orderDraftFinalizeUrl(id), true)
                                  }
                                  onDraftRemove={() =>
                                    navigate(orderCancelUrl(id))
                                  }
                                  onTaskLineAdd={() =>
                                    navigate(orderDraftLineAddUrl(id))
                                  }
                                  onBack={() => navigate(orderListUrl())}
                                  task={task}
                                  countries={maybe(
                                    () => data.shop.countries,
                                    []
                                  ).map(country => ({
                                    code: country.code,
                                    label: country.country
                                  }))}
                                  onSkillClick={id => () =>
                                    navigate(
                                      productUrl(encodeURIComponent(id))
                                    )}
                                  onBillingAddressEdit={() =>
                                    navigate(orderBillingAddressEditUrl(id))
                                  }
                                  onDeliveryAddressEdit={() =>
                                    navigate(orderDeliveryAddressEditUrl(id))
                                  }
                                  onDeliveryMethodEdit={() =>
                                    navigate(orderDraftDeliveryMethodUrl(id))
                                  }
                                  onTaskLineRemove={id =>
                                    orderLineDelete.mutate({ id })
                                  }
                                  onTaskLineChange={(id, data) =>
                                    orderLineUpdate.mutate({
                                      id,
                                      input: data
                                    })
                                  }
                                  saveButtonBarState="default"
                                />
                                <Route
                                  path={orderCancelPath(":id")}
                                  render={({ match }) => (
                                    <TaskDraftCancelDialog
                                      confirmButtonState={getMutationState(
                                        orderDraftCancel.opts.called,
                                        orderDraftCancel.opts.loading,
                                        maybe(
                                          () =>
                                            orderDraftCancel.opts.data
                                              .draftTaskDelete.errors
                                        )
                                      )}
                                      onClose={onModalClose}
                                      onConfirm={() =>
                                        orderDraftCancel.mutate({ id })
                                      }
                                      open={!!match}
                                      orderNumber={maybe(() => task.number)}
                                    />
                                  )}
                                />
                                <Route
                                  path={orderDraftFinalizePath(":id")}
                                  render={({ match }) => (
                                    <TaskDraftFinalizeDialog
                                      confirmButtonState={
                                        finalizeTransitionState
                                      }
                                      onClose={onModalClose}
                                      onConfirm={() =>
                                        orderDraftFinalize.mutate({ id })
                                      }
                                      open={!!match}
                                      orderNumber={maybe(() => task.number)}
                                      warnings={orderDraftFinalizeWarnings(
                                        task
                                      )}
                                    />
                                  )}
                                />
                                <Route
                                  path={orderDraftDeliveryMethodPath(":id")}
                                  render={({ match }) => (
                                    <TaskDeliveryMethodEditDialog
                                      confirmButtonState={getMutationState(
                                        orderDeliveryMethodUpdate.opts.called,
                                        orderDeliveryMethodUpdate.opts.loading,
                                        maybe(
                                          () =>
                                            orderDeliveryMethodUpdate.opts.data
                                              .orderUpdateDelivery.errors
                                        )
                                      )}
                                      open={!!match}
                                      deliveryMethod={maybe(
                                        () => task.deliveryMethod.id,
                                        ""
                                      )}
                                      deliveryMethods={maybe(
                                        () => task.availableDeliveryMethods
                                      )}
                                      onClose={onModalClose}
                                      onSubmit={variables =>
                                        orderDeliveryMethodUpdate.mutate({
                                          id,
                                          input: {
                                            deliveryMethod:
                                              variables.deliveryMethod
                                          }
                                        })
                                      }
                                    />
                                  )}
                                />
                                <Route
                                  path={orderDraftLineAddPath(":id")}
                                  render={({ match }) => (
                                    <TaskVariantSearchProvider>
                                      {({
                                        variants: {
                                          search: variantSearch,
                                          searchOpts: variantSearchOpts
                                        }
                                      }) => {
                                        const fetchMore = () =>
                                          variantSearchOpts.loadMore(
                                            (prev, next) => {
                                              if (
                                                prev.products.pageInfo
                                                  .endCursor ===
                                                next.products.pageInfo.endCursor
                                              ) {
                                                return prev;
                                              }
                                              return {
                                                ...prev,
                                                products: {
                                                  ...prev.products,
                                                  edges: [
                                                    ...prev.products.edges,
                                                    ...next.products.edges
                                                  ],
                                                  pageInfo:
                                                    next.products.pageInfo
                                                }
                                              };
                                            },
                                            {
                                              after:
                                                variantSearchOpts.data.products
                                                  .pageInfo.endCursor
                                            }
                                          );
                                        return (
                                          <TaskSkillAddDialog
                                            confirmButtonState={getMutationState(
                                              orderLineAdd.opts.called,
                                              orderLineAdd.opts.loading,
                                              maybe(
                                                () =>
                                                  orderLineAdd.opts.data
                                                    .draftTaskLinesCreate
                                                    .errors
                                              )
                                            )}
                                            loading={variantSearchOpts.loading}
                                            open={!!match}
                                            hasMore={maybe(
                                              () =>
                                                variantSearchOpts.data.products
                                                  .pageInfo.hasNextPage
                                            )}
                                            products={maybe(() =>
                                              variantSearchOpts.data.products.edges.map(
                                                edge => edge.node
                                              )
                                            )}
                                            onClose={onModalClose}
                                            onFetch={variantSearch}
                                            onFetchMore={fetchMore}
                                            onSubmit={formData =>
                                              orderLineAdd.mutate({
                                                id,
                                                input: formData.variants.map(
                                                  variant => ({
                                                    quantity: 1,
                                                    variantId: variant.id
                                                  })
                                                )
                                              })
                                            }
                                          />
                                        );
                                      }}
                                    </TaskVariantSearchProvider>
                                  )}
                                />
                              </>
                            )}
                            <Route
                              path={orderDeliveryAddressEditPath(":id")}
                              render={({ match }) => (
                                <TaskAddressEditDialog
                                  confirmButtonState={getMutationState(
                                    orderUpdate.opts.called,
                                    orderUpdate.opts.loading,
                                    maybe(
                                      () =>
                                        orderUpdate.opts.data.orderUpdate.errors
                                    )
                                  )}
                                  address={transformAddressToForm(
                                    maybe(() => task.deliveryAddress)
                                  )}
                                  countries={maybe(
                                    () => data.shop.countries,
                                    []
                                  ).map(country => ({
                                    code: country.code,
                                    label: country.country
                                  }))}
                                  errors={maybe(
                                    () =>
                                      orderUpdate.opts.data.orderUpdate.errors,
                                    []
                                  )}
                                  open={!!match}
                                  variant="delivery"
                                  onClose={onModalClose}
                                  onConfirm={variables =>
                                    orderUpdate.mutate({
                                      id,
                                      input: {
                                        deliveryAddress: {
                                          ...variables,
                                          country: variables.country.value
                                        }
                                      }
                                    })
                                  }
                                />
                              )}
                            />
                            <Route
                              path={orderBillingAddressEditPath(":id")}
                              render={({ match }) => (
                                <TaskAddressEditDialog
                                  confirmButtonState={getMutationState(
                                    orderUpdate.opts.called,
                                    orderUpdate.opts.loading,
                                    maybe(
                                      () =>
                                        orderUpdate.opts.data.orderUpdate.errors
                                    )
                                  )}
                                  address={transformAddressToForm(
                                    maybe(() => task.billingAddress)
                                  )}
                                  countries={maybe(
                                    () => data.shop.countries,
                                    []
                                  ).map(country => ({
                                    code: country.code,
                                    label: country.country
                                  }))}
                                  errors={maybe(
                                    () =>
                                      orderUpdate.opts.data.orderUpdate.errors,
                                    []
                                  )}
                                  open={!!match}
                                  variant="billing"
                                  onClose={onModalClose}
                                  onConfirm={variables =>
                                    orderUpdate.mutate({
                                      id,
                                      input: {
                                        billingAddress: {
                                          ...variables,
                                          country: variables.country.value
                                        }
                                      }
                                    })
                                  }
                                />
                              )}
                            />
                          </>
                        );
                      }}
                    </TaskOperations>
                  )}
                </TaskDetailsMessages>
              )}
            </UserSearchProvider>
          );
        }}
      </TypedTaskDetailsQuery>
    )}
  </Navigator>
);

export default TaskDetails;
