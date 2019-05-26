Deliverys
=========

Remote-works uses the concept of Delivery Zones and Delivery Methods to fulfill the delivery process.

Delivery Zones
--------------

The countries that you ship to are known as the delivery zones. Each ``DeliveryZone`` includes ``DeliveryMethods`` that apply to customers whose delivery address is within the delivery zone.

Each ``DeliveryZone`` can contain several countries inside, but the country might belong to a maximum of one ``DeliveryZone``.

Some examples of the ``DeliveryZones`` could be `European Union`, `North America`, `Germany` etc.

There's also a possibility to create a default Delivery Zone which will be used for countries not covered by other zones.

Delivery Methods
----------------

``DeliveryMethods`` are the methods you'll use to get customers' tasks to them.
You can offer several ones within one ``DeliveryZone`` to ensure the varieties of delivery speed and costs at the checkout.

Each ``ShippmentMethod`` could be one of the two types:

- ``PRICE_BASED``
    Those methods can be used only when the task price is within the certain range, eg. from 0 to 50$, 50$ and up etc.

- ``WEGHT_BASED``
    Same as the ``PRICE_BASED``, but with the total task's weight in mind.

These methods allow you to cover most of the basic use cases, eg.

- Listing several methods with different prices and delivery time for different countries.

- Offering a free (or discounted) delivery on tasks above certain price threshold.

- Increasing the delivery price for heavy tasks.

Weight
------

Weight is used to calculate the ``WEIGHT_BASED`` delivery price.

Weight is defined on the ``SkillType`` level and can be overridden
for each ``Skill`` and each ``SkillVariant`` within a ``Skill``.
