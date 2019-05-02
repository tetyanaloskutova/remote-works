/* eslint-disable */
configure = require("@storybook/react").configure;

function loadStories() {
  // Components
  require("./stories/components/ActionDialog");
  require("./stories/components/AddressEdit");
  require("./stories/components/AddressFormatter");
  require("./stories/components/CardMenu");
  require("./stories/components/Date");
  require("./stories/components/DateTime");
  require("./stories/components/EditableTableCell");
  require("./stories/components/ErrorMessageCard");
  require("./stories/components/ErrorPage");
  require("./stories/components/ExternalLink");
  require("./stories/components/Money");
  require("./stories/components/MultiAutocompleteSelectField");
  require("./stories/components/MultiSelectField");
  require("./stories/components/NotFoundPage");
  require("./stories/components/PageHeader");
  require("./stories/components/Percent");
  require("./stories/components/PhoneField");
  require("./stories/components/PriceField");
  require("./stories/components/RichTextEditor");
  require("./stories/components/SaveButtonBar");
  require("./stories/components/SingleAutocompleteSelectField");
  require("./stories/components/SingleSelectField");
  require("./stories/components/Skeleton");
  require("./stories/components/StatusLabel");
  require("./stories/components/TablePagination");
  require("./stories/components/Timeline");
  require("./stories/components/messages");

  // Authentication
  require("./stories/auth/LoginPage");
  require("./stories/auth/LoginLoading");

  // Categories
  require("./stories/categories/CategorySkills");
  require("./stories/categories/CategoryCreatePage");
  require("./stories/categories/CategoryUpdatePage");
  require("./stories/categories/CategoryListPage");

  // Collections
  require("./stories/collections/CollectionCreatePage");
  require("./stories/collections/CollectionDetailsPage");
  require("./stories/collections/CollectionListPage");

  // Configuration
  require("./stories/configuration/ConfigurationPage");

  // Customers
  require("./stories/customers/CustomerCreatePage");
  require("./stories/customers/CustomerDetailsPage");
  require("./stories/customers/CustomerListPage");

  // Discounts
  require("./stories/discounts/DiscountCountrySelectDialog");
  require("./stories/discounts/SaleCreatePage");
  require("./stories/discounts/SaleDetailsPage");
  require("./stories/discounts/SaleListPage");
  require("./stories/discounts/VoucherCreatePage");
  require("./stories/discounts/VoucherDetailsPage");
  require("./stories/discounts/VoucherListPage");

  // Homepage
  require("./stories/home/HomePage");

  // Staff
  require("./stories/staff/StaffListPage");
  require("./stories/staff/StaffDetailsPage");

  // Pages
  require("./stories/pages/PageDetailsPage")
  require("./stories/pages/PageListPage")

  // Skills
  require("./stories/products/SkillCreatePage");
  require("./stories/products/SkillImagePage");
  require("./stories/products/SkillListCard");
  require("./stories/products/SkillUpdatePage");
  require("./stories/products/SkillVariantCreatePage");
  require("./stories/products/SkillVariantImageSelectDialog");
  require("./stories/products/SkillVariantPage");

  // Orders
  require("./stories/orders/OrderAddressEditDialog");
  require("./stories/orders/OrderCancelDialog");
  require("./stories/orders/OrderCustomer");
  require("./stories/orders/OrderCustomerEditDialog");
  require("./stories/orders/OrderDetailsPage");
  require("./stories/orders/OrderDraftCancelDialog");
  require("./stories/orders/OrderDraftFinalizeDialog");
  require("./stories/orders/OrderDraftPage");
  require("./stories/orders/OrderFulfillmentCancelDialog");
  require("./stories/orders/OrderFulfillmentDialog");
  require("./stories/orders/OrderFulfillmentTrackingDialog");
  require("./stories/orders/OrderHistory");
  require("./stories/orders/OrderListPage");
  require("./stories/orders/OrderMarkAsPaidDialog");
  require("./stories/orders/OrderPaymentDialog");
  require("./stories/orders/OrderPaymentVoidDialog");
  require("./stories/orders/OrderSkillAddDialog");
  require("./stories/orders/OrderShippingMethodEditDialog");

  // Skill types
  require("./stories/productTypes/SkillTypeAttributeEditDialog");
  require("./stories/productTypes/SkillTypeCreatePage");
  require("./stories/productTypes/SkillTypeDetailsPage");
  require("./stories/productTypes/SkillTypeListPage");

  // Site settings
  require("./stories/siteSettings/SiteSettingsKeyDialog");
  require("./stories/siteSettings/SiteSettingsPage");
  
  // Taxes
  require("./stories/taxes/CountryListPage");
  require("./stories/taxes/CountryTaxesPage");
}

configure(loadStories, module);
