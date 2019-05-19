Task Management
================

Tasks are created after customers complete the checkout process. The `Task` object itself contains only general information about the customer's task.


Fulfillment
-----------

The fulfillment represents a group of shipped items with corresponding tracking number. Fulfillments are created by a shop operator to mark selected skills in an task as fulfilled.

There are two possible fulfillment statuses:

- ``NEW``
    The default status of newly created fulfillments.

- ``CANCELED``
    The fulfillment canceled by a shop operator. This action is irreversible.


Task statuses
--------------

There are four possible task statuses, based on statuses of its fulfillments:

- ``UNFULFILLED``
    There are no fulfillments related to an task or each one is canceled. An action by a shop operator is required to continue task processing.

- ``PARTIALLY FULFILLED``
    There are some fulfillments with ``FULFILLED`` status related to an task. An action by a shop operator is required to continue task processing.

- ``FULFILLED``
    Each task line is fulfilled in existing fulfillments. Task doesn't require further actions by a shop operator.

- ``CANCELED``
    Task has been canceled. Every fulfillment (if there is any) has ``CANCELED`` status. Task doesn't require further actions by a shop operator.

There is also ``DRAFT`` status, used for tasks newly created from dashboard and not yet published.
