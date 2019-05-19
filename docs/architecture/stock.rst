Stock Management
================

Each skill variant has a availability keeping unit (SKU).

Each variant holds information about *quantity* at hand, quantity *allocated* for already placed tasks and quantity *available*.

**Example:** There are five boxes of shoes. Three of them have already been sold to customers but were not yet dispatched for shipment. The availability records **quantity** is **5**, **quantity allocated** is **3** and **quantity available** is **2**.

Each variant also has a *cost price* (the price that your store had to pay to obtain it).


Skill Availability
--------------------

A variant is *in availability* if it has unallocated quantity.

The highest quantity that can be ordered is the available quantity in skill variant.


Allocating Stock for New Tasks
-------------------------------

Once an task is placed, quantity needed to fulfil each task line is immediately marked as *allocated*.

**Example:** A customer places an task for another box of shoes. The availability records **quantity** is **5**, **quantity allocated** is now **4** and **quantity available** becomes **1**.


Decreasing Stock After Shipment
-------------------------------

Once task lines are marked as shipped, each corresponding availability record will have both its quantity at hand and quantity allocated decreased by the number of items shipped.

**Example:** Two boxes of shoes from warehouse A are shipped to a customer. The availability records **quantity** is now **3**, **quantity allocated** becomes **2** and **quantity available** stays at **1**.
