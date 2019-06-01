import * as React from "react";
import { Route } from "react-router-dom";

import ErrorMessageCard from "../../../components/ErrorMessageCard";
import Navigator from "../../../components/Navigator";
import { WindowTitle } from "../../../components/WindowTitle";
import { getMutationState, maybe, transformAddressToForm } from "../../../misc";
import { skillUrl } from "../../../skills/urls";
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
import { TaskDetails_task } from "../../types/TaskDetails";
import { taskListUrl, taskUrl } from "../../urls";
import { TaskDetailsMessages } from "./TaskDetailsMessages";
import {
  taskBillingAddressEditPath,
  taskBillingAddressEditUrl,
  taskCancelPath,
  taskCancelUrl,
  taskDraftFinalizePath,
  taskDraftFinalizeUrl,
  taskDraftLineAddPath,
  taskDraftLineAddUrl,
  taskDraftDeliveryMethodPath,
  taskDraftDeliveryMethodUrl,
  taskFulfillmentCancelPath,
  taskFulfillmentCancelUrl,
  taskFulfillmentEditTrackingPath,
  taskFulfillmentEditTrackingUrl,
  taskFulfillPath,
  taskFulfillUrl,
  taskMarkAsPaidPath,
  taskMarkAsPaidUrl,
  taskPaymentCapturePath,
  taskPaymentCaptureUrl,
  taskPaymentRefundPath,
  taskPaymentRefundUrl,
  taskPaymentVoidPath,
  taskPaymentVoidUrl,
  taskDeliveryAddressEditPath,
  taskDeliveryAddressEditUrl
} from "./urls";

const taskDraftFinalizeWarnings = (task: TaskDetails_task) => {
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
          const onModalClose = () => navigate(taskUrl(id), true);
          return (
            <UserSearchProvider>
              {users => (
                <TaskDetailsMessages>
                  {taskMessages => (
                    <TaskOperations
                      task={id}
                      onTaskFulfillmentCreate={
                        taskMessages.handleTaskFulfillmentCreate
                      }
                      onNoteAdd={taskMessages.handleNoteAdd}
                      onTaskCancel={taskMessages.handleTaskCancel}
                      onTaskVoid={taskMessages.handleTaskVoid}
                      onPaymentCapture={taskMessages.handlePaymentCapture}
                      onPaymentRefund={taskMessages.handlePaymentRefund}
                      onUpdate={taskMessages.handleUpdate}
                      onDraftUpdate={taskMessages.handleDraftUpdate}
                      onDeliveryMethodUpdate={
                        taskMessages.handleDeliveryMethodUpdate
                      }
                      onTaskLineDelete={taskMessages.handleTaskLineDelete}
                      onTaskLineAdd={taskMessages.handleTaskLineAdd}
                      onTaskLineUpdate={taskMessages.handleTaskLineUpdate}
                      onTaskFulfillmentCancel={
                        taskMessages.handleTaskFulfillmentCancel
                      }
                      onTaskFulfillmentUpdate={
                        taskMessages.handleTaskFulfillmentUpdate
                      }
                      onDraftFinalize={taskMessages.handleDraftFinalize}
                      onDraftCancel={taskMessages.handleDraftCancel}
                      onTaskMarkAsPaid={taskMessages.handleTaskMarkAsPaid}
                    >
                      {({
                        taskAddNote,
                        taskCancel,
                        taskCreateFulfillment,
                        taskDraftUpdate,
                        taskLineAdd,
                        taskLineDelete,
                        taskLineUpdate,
                        taskPaymentCapture,
                        taskPaymentRefund,
                        taskVoid,
                        taskDeliveryMethodUpdate,
                        taskUpdate,
                        taskFulfillmentCancel,
                        taskFulfillmentUpdateTracking,
                        taskDraftCancel,
                        taskDraftFinalize,
                        taskPaymentMarkAsPaid
                      }) => {
                        const finalizeTransitionState = getMutationState(
                          taskDraftFinalize.opts.called,
                          taskDraftFinalize.opts.loading,
                          maybe(
                            () =>
                              taskDraftFinalize.opts.data.draftTaskComplete
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
                                    taskAddNote.mutate({
                                      input: variables,
                                      task: id
                                    })
                                  }
                                  onBack={() => navigate(taskListUrl())}
                                  task={task}
                                  deliveryMethods={maybe(
                                    () => data.task.availableDeliveryMethods,
                                    []
                                  )}
                                  onTaskCancel={() =>
                                    navigate(taskCancelUrl(id))
                                  }
                                  onTaskFulfill={() =>
                                    navigate(taskFulfillUrl(id))
                                  }
                                  onFulfillmentCancel={fulfillmentId =>
                                    navigate(
                                      taskFulfillmentCancelUrl(
                                        id,
                                        fulfillmentId
                                      )
                                    )
                                  }
                                  onFulfillmentTrackingNumberUpdate={fulfillmentId =>
                                    navigate(
                                      taskFulfillmentEditTrackingUrl(
                                        id,
                                        fulfillmentId
                                      )
                                    )
                                  }
                                  onPaymentCapture={() =>
                                    navigate(taskPaymentCaptureUrl(id))
                                  }
                                  onPaymentVoid={() =>
                                    navigate(taskPaymentVoidUrl(id))
                                  }
                                  onPaymentRefund={() =>
                                    navigate(taskPaymentRefundUrl(id))
                                  }
                                  onSkillClick={id => () =>
                                    navigate(skillUrl(id))}
                                  onBillingAddressEdit={() =>
                                    navigate(taskBillingAddressEditUrl(id))
                                  }
                                  onDeliveryAddressEdit={() =>
                                    navigate(taskDeliveryAddressEditUrl(id))
                                  }
                                  onPaymentPaid={() =>
                                    navigate(taskMarkAsPaidUrl(id))
                                  }
                                />
                                <Route
                                  path={taskCancelPath(":id")}
                                  render={({ match }) => (
                                    <TaskCancelDialog
                                      confirmButtonState={getMutationState(
                                        taskCancel.opts.called,
                                        taskCancel.opts.loading,
                                        maybe(
                                          () =>
                                            taskCancel.opts.data.taskCancel
                                              .errors
                                        )
                                      )}
                                      number={maybe(() => task.number)}
                                      open={!!match}
                                      onClose={onModalClose}
                                      onSubmit={variables =>
                                        taskCancel.mutate({
                                          id,
                                          ...variables
                                        })
                                      }
                                    />
                                  )}
                                />
                                <Route
                                  path={taskMarkAsPaidPath(":id")}
                                  render={({ match }) => (
                                    <TaskMarkAsPaidDialog
                                      confirmButtonState={getMutationState(
                                        taskPaymentMarkAsPaid.opts.called,
                                        taskPaymentMarkAsPaid.opts.loading,
                                        maybe(
                                          () =>
                                            taskPaymentMarkAsPaid.opts.data
                                              .taskMarkAsPaid.errors
                                        )
                                      )}
                                      onClose={onModalClose}
                                      onConfirm={() =>
                                        taskPaymentMarkAsPaid.mutate({
                                          id
                                        })
                                      }
                                      open={!!match}
                                    />
                                  )}
                                />
                                <Route
                                  path={taskPaymentVoidPath(":id")}
                                  render={({ match }) => (
                                    <TaskPaymentVoidDialog
                                      confirmButtonState={getMutationState(
                                        taskVoid.opts.called,
                                        taskVoid.opts.loading,
                                        maybe(
                                          () =>
                                            taskVoid.opts.data.taskVoid.errors
                                        )
                                      )}
                                      open={!!match}
                                      onClose={onModalClose}
                                      onConfirm={() => taskVoid.mutate({ id })}
                                    />
                                  )}
                                />
                                <Route
                                  path={taskPaymentCapturePath(":id")}
                                  render={({ match }) => (
                                    <TaskPaymentDialog
                                      confirmButtonState={getMutationState(
                                        taskPaymentCapture.opts.called,
                                        taskPaymentCapture.opts.loading,
                                        maybe(
                                          () =>
                                            taskPaymentCapture.opts.data
                                              .taskCapture.errors
                                        )
                                      )}
                                      initial={maybe(
                                        () => task.total.gross.amount
                                      )}
                                      open={!!match}
                                      variant="capture"
                                      onClose={onModalClose}
                                      onSubmit={variables =>
                                        taskPaymentCapture.mutate({
                                          ...variables,
                                          id
                                        })
                                      }
                                    />
                                  )}
                                />
                                <Route
                                  path={taskPaymentRefundPath(":id")}
                                  render={({ match }) => (
                                    <TaskPaymentDialog
                                      confirmButtonState={getMutationState(
                                        taskPaymentRefund.opts.called,
                                        taskPaymentRefund.opts.loading,
                                        maybe(
                                          () =>
                                            taskPaymentRefund.opts.data
                                              .taskRefund.errors
                                        )
                                      )}
                                      initial={maybe(
                                        () => task.total.gross.amount
                                      )}
                                      open={!!match}
                                      variant="refund"
                                      onClose={onModalClose}
                                      onSubmit={variables =>
                                        taskPaymentRefund.mutate({
                                          ...variables,
                                          id
                                        })
                                      }
                                    />
                                  )}
                                />
                                <Route
                                  path={taskFulfillPath(":id")}
                                  render={({ match }) => (
                                    <TaskFulfillmentDialog
                                      confirmButtonState={getMutationState(
                                        taskCreateFulfillment.opts.called,
                                        taskCreateFulfillment.opts.loading,
                                        maybe(
                                          () =>
                                            taskCreateFulfillment.opts.data
                                              .taskFulfillmentCreate.errors
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
                                        taskCreateFulfillment.mutate({
                                          input: {
                                            ...variables,
                                            lines: maybe(() => task.lines, [])
                                              .filter(
                                                line =>
                                                  line.quantityFulfilled <
                                                  line.quantity
                                              )
                                              .map((line, lineIndex) => ({
                                                taskLineId: line.id,
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
                                  path={taskFulfillmentCancelPath(
                                    ":taskId",
                                    ":fulfillmentId"
                                  )}
                                  render={({ match }) => (
                                    <TaskFulfillmentCancelDialog
                                      confirmButtonState={getMutationState(
                                        taskFulfillmentCancel.opts.called,
                                        taskFulfillmentCancel.opts.loading,
                                        maybe(
                                          () =>
                                            taskFulfillmentCancel.opts.data
                                              .taskFulfillmentCancel.errors
                                        )
                                      )}
                                      open={!!match}
                                      onConfirm={variables =>
                                        taskFulfillmentCancel.mutate({
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
                                  path={taskFulfillmentEditTrackingPath(
                                    ":taskId",
                                    ":fulfillmentId"
                                  )}
                                  render={({ match }) => (
                                    <TaskFulfillmentTrackingDialog
                                      confirmButtonState={getMutationState(
                                        taskFulfillmentUpdateTracking.opts
                                          .called,
                                        taskFulfillmentUpdateTracking.opts
                                          .loading,
                                        maybe(
                                          () =>
                                            taskFulfillmentUpdateTracking.opts
                                              .data
                                              .taskFulfillmentUpdateTracking
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
                                        taskFulfillmentUpdateTracking.mutate({
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
                                    taskAddNote.mutate({
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
                                    taskDraftUpdate.mutate({
                                      id,
                                      input: data
                                    })
                                  }
                                  onDraftFinalize={() =>
                                    navigate(taskDraftFinalizeUrl(id), true)
                                  }
                                  onDraftRemove={() =>
                                    navigate(taskCancelUrl(id))
                                  }
                                  onTaskLineAdd={() =>
                                    navigate(taskDraftLineAddUrl(id))
                                  }
                                  onBack={() => navigate(taskListUrl())}
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
                                      skillUrl(encodeURIComponent(id))
                                    )}
                                  onBillingAddressEdit={() =>
                                    navigate(taskBillingAddressEditUrl(id))
                                  }
                                  onDeliveryAddressEdit={() =>
                                    navigate(taskDeliveryAddressEditUrl(id))
                                  }
                                  onDeliveryMethodEdit={() =>
                                    navigate(taskDraftDeliveryMethodUrl(id))
                                  }
                                  onTaskLineRemove={id =>
                                    taskLineDelete.mutate({ id })
                                  }
                                  onTaskLineChange={(id, data) =>
                                    taskLineUpdate.mutate({
                                      id,
                                      input: data
                                    })
                                  }
                                  saveButtonBarState="default"
                                />
                                <Route
                                  path={taskCancelPath(":id")}
                                  render={({ match }) => (
                                    <TaskDraftCancelDialog
                                      confirmButtonState={getMutationState(
                                        taskDraftCancel.opts.called,
                                        taskDraftCancel.opts.loading,
                                        maybe(
                                          () =>
                                            taskDraftCancel.opts.data
                                              .draftTaskDelete.errors
                                        )
                                      )}
                                      onClose={onModalClose}
                                      onConfirm={() =>
                                        taskDraftCancel.mutate({ id })
                                      }
                                      open={!!match}
                                      taskNumber={maybe(() => task.number)}
                                    />
                                  )}
                                />
                                <Route
                                  path={taskDraftFinalizePath(":id")}
                                  render={({ match }) => (
                                    <TaskDraftFinalizeDialog
                                      confirmButtonState={
                                        finalizeTransitionState
                                      }
                                      onClose={onModalClose}
                                      onConfirm={() =>
                                        taskDraftFinalize.mutate({ id })
                                      }
                                      open={!!match}
                                      taskNumber={maybe(() => task.number)}
                                      warnings={taskDraftFinalizeWarnings(
                                        task
                                      )}
                                    />
                                  )}
                                />
                                <Route
                                  path={taskDraftDeliveryMethodPath(":id")}
                                  render={({ match }) => (
                                    <TaskDeliveryMethodEditDialog
                                      confirmButtonState={getMutationState(
                                        taskDeliveryMethodUpdate.opts.called,
                                        taskDeliveryMethodUpdate.opts.loading,
                                        maybe(
                                          () =>
                                            taskDeliveryMethodUpdate.opts.data
                                              .taskUpdateDelivery.errors
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
                                        taskDeliveryMethodUpdate.mutate({
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
                                  path={taskDraftLineAddPath(":id")}
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
                                                prev.skills.pageInfo
                                                  .endCursor ===
                                                next.skills.pageInfo.endCursor
                                              ) {
                                                return prev;
                                              }
                                              return {
                                                ...prev,
                                                skills: {
                                                  ...prev.skills,
                                                  edges: [
                                                    ...prev.skills.edges,
                                                    ...next.skills.edges
                                                  ],
                                                  pageInfo:
                                                    next.skills.pageInfo
                                                }
                                              };
                                            },
                                            {
                                              after:
                                                variantSearchOpts.data.skills
                                                  .pageInfo.endCursor
                                            }
                                          );
                                        return (
                                          <TaskSkillAddDialog
                                            confirmButtonState={getMutationState(
                                              taskLineAdd.opts.called,
                                              taskLineAdd.opts.loading,
                                              maybe(
                                                () =>
                                                  taskLineAdd.opts.data
                                                    .draftTaskLinesCreate
                                                    .errors
                                              )
                                            )}
                                            loading={variantSearchOpts.loading}
                                            open={!!match}
                                            hasMore={maybe(
                                              () =>
                                                variantSearchOpts.data.skills
                                                  .pageInfo.hasNextPage
                                            )}
                                            skills={maybe(() =>
                                              variantSearchOpts.data.skills.edges.map(
                                                edge => edge.node
                                              )
                                            )}
                                            onClose={onModalClose}
                                            onFetch={variantSearch}
                                            onFetchMore={fetchMore}
                                            onSubmit={formData =>
                                              taskLineAdd.mutate({
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
                              path={taskDeliveryAddressEditPath(":id")}
                              render={({ match }) => (
                                <TaskAddressEditDialog
                                  confirmButtonState={getMutationState(
                                    taskUpdate.opts.called,
                                    taskUpdate.opts.loading,
                                    maybe(
                                      () =>
                                        taskUpdate.opts.data.taskUpdate.errors
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
                                      taskUpdate.opts.data.taskUpdate.errors,
                                    []
                                  )}
                                  open={!!match}
                                  variant="delivery"
                                  onClose={onModalClose}
                                  onConfirm={variables =>
                                    taskUpdate.mutate({
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
                              path={taskBillingAddressEditPath(":id")}
                              render={({ match }) => (
                                <TaskAddressEditDialog
                                  confirmButtonState={getMutationState(
                                    taskUpdate.opts.called,
                                    taskUpdate.opts.loading,
                                    maybe(
                                      () =>
                                        taskUpdate.opts.data.taskUpdate.errors
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
                                      taskUpdate.opts.data.taskUpdate.errors,
                                    []
                                  )}
                                  open={!!match}
                                  variant="billing"
                                  onClose={onModalClose}
                                  onConfirm={variables =>
                                    taskUpdate.mutate({
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
