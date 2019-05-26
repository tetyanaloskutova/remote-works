Taxes
=====

Remote-works gives a possibility to configure taxes. It can be done in dashboard ``Taxes`` tab.

Taxes are charged according to the rates applicable in the country to which the task is delivered. If tax rate set for the skill is not available, standard tax rate is used by default.

For now, only taxes in European Union are handled.


Configuring taxes
-----------------

There are three ways in which you can configure taxes:

#. All skills prices are entered with tax included

   If selected, all prices entered and displayed in dashboard will be treated as gross prices. For example: skill with entered price 4.00 € and 19% VAT will have net price calculated to 3.36 € (rounded).

#. Show gross prices to customers in the storefront

   If selected, prices displayed for customers in storefront will be gross. Taxes will be properly calculated at checkout. Changing this setting has no effect on displaying tasks placed in the past.

#. Charge taxes on delivery rates

   If selected, standard tax rate will be charged on delivery price.


Tax rates preview
-----------------

You can preview tax rates in dashboard ``Taxes`` tab. It lists all countries taxes are handled for. You can see all available tax rates for each country in its details view.


Fetching taxes
--------------

  Assuming you have provided a valid ``VATLAYER_ACCESS_KEY``, taxes can be fetched via following command:

  .. code-block:: console

    $ python manage.py get_vat_rates


  If you do not have a VatLayer API key, you can get one by `subscribing for free here <https://vatlayer.com/signup?plan=9>`_.


  .. warning::

    By default, Remote-works is making requests to the VatLayer API through HTTP (insecure),
    if you are using a paid VatLayer subscription, you may want to set the settings ``VATLAYER_USE_HTTPS`` to ``True``.
