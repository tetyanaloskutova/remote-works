/* tslint:disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum AttributeTypeEnum {
  TYPE = "TYPE",
  VARIANT = "VARIANT",
}

export enum AuthorizationKeyType {
  FACEBOOK = "FACEBOOK",
  GOOGLE_OAUTH2 = "GOOGLE_OAUTH2",
}

export enum DiscountValueTypeEnum {
  FIXED = "FIXED",
  PERCENTAGE = "PERCENTAGE",
}

export enum FulfillmentStatus {
  CANCELED = "CANCELED",
  FULFILLED = "FULFILLED",
}

export enum TaskAction {
  CAPTURE = "CAPTURE",
  MARK_AS_PAID = "MARK_AS_PAID",
  REFUND = "REFUND",
  VOID = "VOID",
}

export enum TaskEvents {
  CANCELED = "CANCELED",
  EMAIL_SENT = "EMAIL_SENT",
  FULFILLMENT_CANCELED = "FULFILLMENT_CANCELED",
  FULFILLMENT_FULFILLED_ITEMS = "FULFILLMENT_FULFILLED_ITEMS",
  FULFILLMENT_REAVAILED_ITEMS = "FULFILLMENT_REAVAILED_ITEMS",
  NOTE_ADDED = "NOTE_ADDED",
  TASK_FULLY_PAID = "TASK_FULLY_PAID",
  TASK_MARKED_AS_PAID = "TASK_MARKED_AS_PAID",
  OTHER = "OTHER",
  OVERSOLD_ITEMS = "OVERSOLD_ITEMS",
  PAYMENT_CAPTURED = "PAYMENT_CAPTURED",
  PAYMENT_REFUNDED = "PAYMENT_REFUNDED",
  PAYMENT_VOIDED = "PAYMENT_VOIDED",
  PLACED = "PLACED",
  PLACED_FROM_DRAFT = "PLACED_FROM_DRAFT",
  TRACKING_UPDATED = "TRACKING_UPDATED",
  UPDATED = "UPDATED",
}

export enum TaskEventsEmails {
  FULFILLMENT = "FULFILLMENT",
  TASK = "TASK",
  PAYMENT = "PAYMENT",
  DELIVERY = "DELIVERY",
}

export enum TaskStatus {
  CANCELED = "CANCELED",
  DRAFT = "DRAFT",
  FULFILLED = "FULFILLED",
  PARTIALLY_FULFILLED = "PARTIALLY_FULFILLED",
  UNFULFILLED = "UNFULFILLED",
}

export enum TaskStatusFilter {
  READY_TO_CAPTURE = "READY_TO_CAPTURE",
  READY_TO_FULFILL = "READY_TO_FULFILL",
}

export enum PaymentChargeStatusEnum {
  FULLY_CHARGED = "FULLY_CHARGED",
  FULLY_REFUNDED = "FULLY_REFUNDED",
  NOT_CHARGED = "NOT_CHARGED",
  PARTIALLY_CHARGED = "PARTIALLY_CHARGED",
  PARTIALLY_REFUNDED = "PARTIALLY_REFUNDED",
}

export enum PermissionEnum {
  IMPERSONATE_USERS = "IMPERSONATE_USERS",
  MANAGE_DISCOUNTS = "MANAGE_DISCOUNTS",
  MANAGE_MENUS = "MANAGE_MENUS",
  MANAGE_TASKS = "MANAGE_TASKS",
  MANAGE_PAGES = "MANAGE_PAGES",
  MANAGE_SKILLS = "MANAGE_SKILLS",
  MANAGE_SETTINGS = "MANAGE_SETTINGS",
  MANAGE_DELIVERY = "MANAGE_DELIVERY",
  MANAGE_STAFF = "MANAGE_STAFF",
  MANAGE_USERS = "MANAGE_USERS",
}

export enum SaleType {
  FIXED = "FIXED",
  PERCENTAGE = "PERCENTAGE",
}

export enum StockAvailability {
  IN_AVAILABILITY = "IN_AVAILABILITY",
  OUT_OF_AVAILABILITY = "OUT_OF_AVAILABILITY",
}

export enum TaxRateType {
  ACCOMMODATION = "ACCOMMODATION",
  ADMISSION_TO_CULTURAL_EVENTS = "ADMISSION_TO_CULTURAL_EVENTS",
  ADMISSION_TO_ENTERTAINMENT_EVENTS = "ADMISSION_TO_ENTERTAINMENT_EVENTS",
  ADMISSION_TO_SPORTING_EVENTS = "ADMISSION_TO_SPORTING_EVENTS",
  ADVERTISING = "ADVERTISING",
  AGRICULTURAL_SUPPLIES = "AGRICULTURAL_SUPPLIES",
  BABY_FOODSTUFFS = "BABY_FOODSTUFFS",
  BIKES = "BIKES",
  BOOKS = "BOOKS",
  CHILDRENS_CLOTHING = "CHILDRENS_CLOTHING",
  DOMESTIC_FUEL = "DOMESTIC_FUEL",
  DOMESTIC_SERVICES = "DOMESTIC_SERVICES",
  E_BOOKS = "E_BOOKS",
  FOODSTUFFS = "FOODSTUFFS",
  HOTELS = "HOTELS",
  MEDICAL = "MEDICAL",
  NEWSPAPERS = "NEWSPAPERS",
  PASSENGER_TRANSPORT = "PASSENGER_TRANSPORT",
  PHARMACEUTICALS = "PHARMACEUTICALS",
  PROPERTY_RENOVATIONS = "PROPERTY_RENOVATIONS",
  RESTAURANTS = "RESTAURANTS",
  SOCIAL_HOUSING = "SOCIAL_HOUSING",
  STANDARD = "STANDARD",
  WATER = "WATER",
  WINE = "WINE",
}

export enum VoucherDiscountValueType {
  FIXED = "FIXED",
  PERCENTAGE = "PERCENTAGE",
}

export enum VoucherType {
  CATEGORY = "CATEGORY",
  COLLECTION = "COLLECTION",
  TYPE = "TYPE",
  DELIVERY = "DELIVERY",
  VALUE = "VALUE",
}

export enum VoucherTypeEnum {
  CATEGORY = "CATEGORY",
  COLLECTION = "COLLECTION",
  TYPE = "TYPE",
  DELIVERY = "DELIVERY",
  VALUE = "VALUE",
}

export enum WeightUnitsEnum {
  g = "g",
  kg = "kg",
  lb = "lb",
  oz = "oz",
}

export interface AddressInput {
  firstName?: string | null;
  lastName?: string | null;
  companyName?: string | null;
  streetAddress1?: string | null;
  streetAddress2?: string | null;
  city?: string | null;
  cityArea?: string | null;
  postalCode?: string | null;
  country: string;
  countryArea?: string | null;
  phone?: string | null;
}

export interface AttributeCreateInput {
  name: string;
  values?: (AttributeValueCreateInput | null)[] | null;
}

export interface AttributeUpdateInput {
  name?: string | null;
  removeValues?: (string | null)[] | null;
  addValues?: (AttributeValueCreateInput | null)[] | null;
}

export interface AttributeValueCreateInput {
  name: string;
  value?: string | null;
}

export interface AttributeValueInput {
  slug: string;
  value: string;
}

export interface AuthorizationKeyInput {
  key: string;
  password: string;
}

export interface CatalogueInput {
  skills?: (string | null)[] | null;
  categories?: (string | null)[] | null;
  collections?: (string | null)[] | null;
}

export interface CategoryInput {
  description?: string | null;
  descriptionJson?: any | null;
  name?: string | null;
  slug?: string | null;
  seo?: SeoInput | null;
  backgroundImage?: any | null;
  backgroundImageAlt?: string | null;
}

export interface CollectionCreateInput {
  isPublished?: boolean | null;
  name?: string | null;
  slug?: string | null;
  description?: string | null;
  descriptionJson?: any | null;
  backgroundImage?: any | null;
  backgroundImageAlt?: string | null;
  seo?: SeoInput | null;
  publicationDate?: any | null;
  skills?: (string | null)[] | null;
}

export interface CollectionInput {
  isPublished?: boolean | null;
  name?: string | null;
  slug?: string | null;
  description?: string | null;
  descriptionJson?: any | null;
  backgroundImage?: any | null;
  backgroundImageAlt?: string | null;
  seo?: SeoInput | null;
  publicationDate?: any | null;
}

export interface CustomerInput {
  defaultBillingAddress?: AddressInput | null;
  defaultDeliveryAddress?: AddressInput | null;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  isActive?: boolean | null;
  note?: string | null;
}

export interface DraftTaskInput {
  billingAddress?: AddressInput | null;
  user?: string | null;
  userEmail?: string | null;
  discount?: any | null;
  deliveryAddress?: AddressInput | null;
  deliveryMethod?: string | null;
  voucher?: string | null;
}

export interface FulfillmentCancelInput {
  reavailability?: boolean | null;
}

export interface FulfillmentCreateInput {
  trackingNumber?: string | null;
  notifyCustomer?: boolean | null;
  lines: (FulfillmentLineInput | null)[];
}

export interface FulfillmentLineInput {
  taskLineId?: string | null;
  quantity?: number | null;
}

export interface FulfillmentUpdateTrackingInput {
  trackingNumber?: string | null;
  notifyCustomer?: boolean | null;
}

export interface TaskAddNoteInput {
  message?: string | null;
}

export interface TaskLineCreateInput {
  quantity: number;
  variantId: string;
}

export interface TaskLineInput {
  quantity: number;
}

export interface TaskUpdateInput {
  billingAddress?: AddressInput | null;
  userEmail?: string | null;
  deliveryAddress?: AddressInput | null;
}

export interface TaskUpdateDeliveryInput {
  deliveryMethod?: string | null;
}

export interface PageInput {
  slug?: string | null;
  title?: string | null;
  content?: string | null;
  contentJson?: any | null;
  isPublished?: boolean | null;
  publicationDate?: string | null;
  seo?: SeoInput | null;
}

export interface SkillTypeInput {
  name?: string | null;
  hasVariants?: boolean | null;
  skillAttributes?: (string | null)[] | null;
  variantAttributes?: (string | null)[] | null;
  isDeliveryRequired?: boolean | null;
  weight?: any | null;
  taxRate?: TaxRateType | null;
}

export interface SkillVariantInput {
  attributes?: (AttributeValueInput | null)[] | null;
  costPrice?: any | null;
  priceOverride?: any | null;
  sku?: string | null;
  quantity?: number | null;
  trackInventory?: boolean | null;
  weight?: any | null;
}

export interface SaleInput {
  name?: string | null;
  type?: DiscountValueTypeEnum | null;
  value?: any | null;
  skills?: (string | null)[] | null;
  categories?: (string | null)[] | null;
  collections?: (string | null)[] | null;
  startDate?: any | null;
  endDate?: any | null;
}

export interface SeoInput {
  title?: string | null;
  description?: string | null;
}

export interface ShopSettingsInput {
  headerText?: string | null;
  description?: string | null;
  includeTaxesInPrices?: boolean | null;
  displayGrossPrices?: boolean | null;
  chargeTaxesOnDelivery?: boolean | null;
  trackInventoryByDefault?: boolean | null;
  defaultWeightUnit?: WeightUnitsEnum | null;
}

export interface SiteDomainInput {
  domain?: string | null;
  name?: string | null;
}

export interface StaffCreateInput {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  isActive?: boolean | null;
  note?: string | null;
  permissions?: (PermissionEnum | null)[] | null;
  sendPasswordEmail?: boolean | null;
}

export interface StaffInput {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  isActive?: boolean | null;
  note?: string | null;
  permissions?: (PermissionEnum | null)[] | null;
}

export interface UserCreateInput {
  defaultBillingAddress?: AddressInput | null;
  defaultDeliveryAddress?: AddressInput | null;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  isActive?: boolean | null;
  note?: string | null;
  sendPasswordEmail?: boolean | null;
}

export interface VoucherInput {
  type?: VoucherTypeEnum | null;
  name?: string | null;
  code?: string | null;
  startDate?: any | null;
  endDate?: any | null;
  discountValueType?: DiscountValueTypeEnum | null;
  discountValue?: any | null;
  skills?: (string | null)[] | null;
  collections?: (string | null)[] | null;
  categories?: (string | null)[] | null;
  minAmountSpent?: any | null;
  countries?: (string | null)[] | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
