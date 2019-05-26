/* tslint:disable */
//  This file was automatically generated and should not be edited.

export interface FulfillmentCreateInput {
  // ID of the task to be fulfilled.
  task?: string | null;
  // Fulfillment tracking number
  trackingNumber?: string | null;
  // If true, send an email notification to the customer.
  notifyCustomer?: boolean | null;
  // Item line to be fulfilled.
  lines?: Array<FulfillmentLineInput | null> | null;
}

export interface FulfillmentLineInput {
  // The ID of the task line.
  orderLineId?: string | null;
  // The number of line item(s) to be fulfiled.
  quantity?: number | null;
}

// An enumeration.
export enum TaskStatus {
  CANCELED = "CANCELED", // Canceled
  DRAFT = "DRAFT", // Draft
  FULFILLED = "FULFILLED", // Fulfilled
  PARTIALLY_FULFILLED = "PARTIALLY_FULFILLED", // Partially fulfilled
  UNFULFILLED = "UNFULFILLED" // Unfulfilled
}

// An enumeration.
export enum AddressCountry {
  AD = "AD", // Andorra
  AE = "AE", // United Arab Emirates
  AF = "AF", // Afghanistan
  AG = "AG", // Antigua and Barbuda
  AI = "AI", // Anguilla
  AL = "AL", // Albania
  AM = "AM", // Armenia
  AO = "AO", // Angola
  AQ = "AQ", // Antarctica
  AR = "AR", // Argentina
  AS = "AS", // American Samoa
  AT = "AT", // Austria
  AU = "AU", // Australia
  AW = "AW", // Aruba
  AX = "AX", // Åland Islands
  AZ = "AZ", // Azerbaijan
  BA = "BA", // Bosnia and Herzegovina
  BB = "BB", // Barbados
  BD = "BD", // Bangladesh
  BE = "BE", // Belgium
  BF = "BF", // Burkina Faso
  BG = "BG", // Bulgaria
  BH = "BH", // Bahrain
  BI = "BI", // Burundi
  BJ = "BJ", // Benin
  BL = "BL", // Saint Barthélemy
  BM = "BM", // Bermuda
  BN = "BN", // Brunei
  BO = "BO", // Bolivia
  BQ = "BQ", // Bonaire, Sint Eustatius and Saba
  BR = "BR", // Brazil
  BS = "BS", // Bahamas
  BT = "BT", // Bhutan
  BV = "BV", // Bouvet Island
  BW = "BW", // Botswana
  BY = "BY", // Belarus
  BZ = "BZ", // Belize
  CA = "CA", // Canada
  CC = "CC", // Cocos (Keeling) Islands
  CD = "CD", // Congo (the Democratic Republic of the)
  CF = "CF", // Central African Republic
  CG = "CG", // Congo
  CH = "CH", // Switzerland
  CI = "CI", // Côte d'Ivoire
  CK = "CK", // Cook Islands
  CL = "CL", // Chile
  CM = "CM", // Cameroon
  CN = "CN", // China
  CO = "CO", // Colombia
  CR = "CR", // Costa Rica
  CU = "CU", // Cuba
  CV = "CV", // Cabo Verde
  CW = "CW", // Curaçao
  CX = "CX", // Christmas Island
  CY = "CY", // Cyprus
  CZ = "CZ", // Czechia
  DE = "DE", // Germany
  DJ = "DJ", // Djibouti
  DK = "DK", // Denmark
  DM = "DM", // Dominica
  DO = "DO", // Dominican Republic
  DZ = "DZ", // Algeria
  EC = "EC", // Ecuador
  EE = "EE", // Estonia
  EG = "EG", // Egypt
  EH = "EH", // Western Sahara
  ER = "ER", // Eritrea
  ES = "ES", // Spain
  ET = "ET", // Ethiopia
  EU = "EU", // European Union
  FI = "FI", // Finland
  FJ = "FJ", // Fiji
  FK = "FK", // Falkland Islands  [Malvinas]
  FM = "FM", // Micronesia (Federated States of)
  FO = "FO", // Faroe Islands
  FR = "FR", // France
  GA = "GA", // Gabon
  GB = "GB", // United Kingdom
  GD = "GD", // Grenada
  GE = "GE", // Georgia
  GF = "GF", // French Guiana
  GG = "GG", // Guernsey
  GH = "GH", // Ghana
  GI = "GI", // Gibraltar
  GL = "GL", // Greenland
  GM = "GM", // Gambia
  GN = "GN", // Guinea
  GP = "GP", // Guadeloupe
  GQ = "GQ", // Equatorial Guinea
  GR = "GR", // Greece
  GS = "GS", // South Georgia and the South Sandwich Islands
  GT = "GT", // Guatemala
  GU = "GU", // Guam
  GW = "GW", // Guinea-Bissau
  GY = "GY", // Guyana
  HK = "HK", // Hong Kong
  HM = "HM", // Heard Island and McDonald Islands
  HN = "HN", // Honduras
  HR = "HR", // Croatia
  HT = "HT", // Haiti
  HU = "HU", // Hungary
  ID = "ID", // Indonesia
  IE = "IE", // Ireland
  IL = "IL", // Israel
  IM = "IM", // Isle of Man
  IN = "IN", // India
  IO = "IO", // British Indian Ocean Territory
  IQ = "IQ", // Iraq
  IR = "IR", // Iran
  IS = "IS", // Iceland
  IT = "IT", // Italy
  JE = "JE", // Jersey
  JM = "JM", // Jamaica
  JO = "JO", // Jordan
  JP = "JP", // Japan
  KE = "KE", // Kenya
  KG = "KG", // Kyrgyzstan
  KH = "KH", // Cambodia
  KI = "KI", // Kiribati
  KM = "KM", // Comoros
  KN = "KN", // Saint Kitts and Nevis
  KP = "KP", // North Korea
  KR = "KR", // South Korea
  KW = "KW", // Kuwait
  KY = "KY", // Cayman Islands
  KZ = "KZ", // Kazakhstan
  LA = "LA", // Laos
  LB = "LB", // Lebanon
  LC = "LC", // Saint Lucia
  LI = "LI", // Liechtenstein
  LK = "LK", // Sri Lanka
  LR = "LR", // Liberia
  LS = "LS", // Lesotho
  LT = "LT", // Lithuania
  LU = "LU", // Luxembourg
  LV = "LV", // Latvia
  LY = "LY", // Libya
  MA = "MA", // Morocco
  MC = "MC", // Monaco
  MD = "MD", // Moldova
  ME = "ME", // Montenegro
  MF = "MF", // Saint Martin (French part)
  MG = "MG", // Madagascar
  MH = "MH", // Marshall Islands
  MK = "MK", // Macedonia
  ML = "ML", // Mali
  MM = "MM", // Myanmar
  MN = "MN", // Mongolia
  MO = "MO", // Macao
  MP = "MP", // Northern Mariana Islands
  MQ = "MQ", // Martinique
  MR = "MR", // Mauritania
  MS = "MS", // Montserrat
  MT = "MT", // Malta
  MU = "MU", // Mauritius
  MV = "MV", // Maldives
  MW = "MW", // Malawi
  MX = "MX", // Mexico
  MY = "MY", // Malaysia
  MZ = "MZ", // Mozambique
  NA = "NA", // Namibia
  NC = "NC", // New Caledonia
  NE = "NE", // Niger
  NF = "NF", // Norfolk Island
  NG = "NG", // Nigeria
  NI = "NI", // Nicaragua
  NL = "NL", // Netherlands
  NO = "NO", // Norway
  NP = "NP", // Nepal
  NR = "NR", // Nauru
  NU = "NU", // Niue
  NZ = "NZ", // New Zealand
  OM = "OM", // Oman
  PA = "PA", // Panama
  PE = "PE", // Peru
  PF = "PF", // French Polynesia
  PG = "PG", // Papua New Guinea
  PH = "PH", // Philippines
  PK = "PK", // Pakistan
  PL = "PL", // Poland
  PM = "PM", // Saint Pierre and Miquelon
  PN = "PN", // Pitcairn
  PR = "PR", // Puerto Rico
  PS = "PS", // Palestine, State of
  PT = "PT", // Portugal
  PW = "PW", // Palau
  PY = "PY", // Paraguay
  QA = "QA", // Qatar
  RE = "RE", // Réunion
  RO = "RO", // Romania
  RS = "RS", // Serbia
  RU = "RU", // Russia
  RW = "RW", // Rwanda
  SA = "SA", // Saudi Arabia
  SB = "SB", // Solomon Islands
  SC = "SC", // Seychelles
  SD = "SD", // Sudan
  SE = "SE", // Sweden
  SG = "SG", // Singapore
  SH = "SH", // Saint Helena, Ascension and Tristan da Cunha
  SI = "SI", // Slovenia
  SJ = "SJ", // Svalbard and Jan Mayen
  SK = "SK", // Slovakia
  SL = "SL", // Sierra Leone
  SM = "SM", // San Marino
  SN = "SN", // Senegal
  SO = "SO", // Somalia
  SR = "SR", // Suriname
  SS = "SS", // South Sudan
  ST = "ST", // Sao Tome and Principe
  SV = "SV", // El Salvador
  SX = "SX", // Sint Maarten (Dutch part)
  SY = "SY", // Syria
  SZ = "SZ", // Swaziland
  TC = "TC", // Turks and Caicos Islands
  TD = "TD", // Chad
  TF = "TF", // French Southern Territories
  TG = "TG", // Togo
  TH = "TH", // Thailand
  TJ = "TJ", // Tajikistan
  TK = "TK", // Tokelau
  TL = "TL", // Timor-Leste
  TM = "TM", // Turkmenistan
  TN = "TN", // Tunisia
  TO = "TO", // Tonga
  TR = "TR", // Turkey
  TT = "TT", // Trinidad and Tobago
  TV = "TV", // Tuvalu
  TW = "TW", // Taiwan
  TZ = "TZ", // Tanzania
  UA = "UA", // Ukraine
  UG = "UG", // Uganda
  UM = "UM", // United States Minor Outlying Islands
  US = "US", // United States of America
  UY = "UY", // Uruguay
  UZ = "UZ", // Uzbekistan
  VA = "VA", // Holy See
  VC = "VC", // Saint Vincent and the Grenadines
  VE = "VE", // Venezuela
  VG = "VG", // Virgin Islands (British)
  VI = "VI", // Virgin Islands (U.S.)
  VN = "VN", // Vietnam
  VU = "VU", // Vanuatu
  WF = "WF", // Wallis and Futuna
  WS = "WS", // Samoa
  YE = "YE", // Yemen
  YT = "YT", // Mayotte
  ZA = "ZA", // South Africa
  ZM = "ZM", // Zambia
  ZW = "ZW" // Zimbabwe
}

// An enumeration.
export enum TaskEvents {
  CANCELED = "CANCELED",
  EMAIL_SENT = "EMAIL_SENT",
  FULFILLMENT_CANCELED = "FULFILLMENT_CANCELED",
  FULFILLMENT_FULFILLED_ITEMS = "FULFILLMENT_FULFILLED_ITEMS",
  FULFILLMENT_RESTOCKED_ITEMS = "FULFILLMENT_RESTOCKED_ITEMS",
  NOTE_ADDED = "NOTE_ADDED",
  ORDER_FULLY_PAID = "ORDER_FULLY_PAID",
  ORDER_MARKED_AS_PAID = "ORDER_MARKED_AS_PAID",
  OTHER = "OTHER",
  PAYMENT_CAPTURED = "PAYMENT_CAPTURED",
  PAYMENT_REFUNDED = "PAYMENT_REFUNDED",
  PAYMENT_VOIDED = "PAYMENT_VOIDED",
  PLACED = "PLACED",
  PLACED_FROM_DRAFT = "PLACED_FROM_DRAFT",
  UPDATED = "UPDATED"
}

// An enumeration.
export enum FulfillmentStatus {
  CANCELED = "CANCELED", // Canceled
  FULFILLED = "FULFILLED" // Fulfilled
}

export interface AttributeValueInput {
  // Slug of an attribute.
  slug: string;
  // Value of an attribute.
  value: string;
}

export interface TokenAuthMutationVariables {
  email: string;
  password: string;
}

export interface TokenAuthMutation {
  tokenCreate: {
    token: string | null;
    errors: Array<{
      // Name of a field that caused the error. A value of
      // `null` indicates that the error isn't associated with a particular
      // field.
      field: string | null;
      // The error message.
      message: string | null;
    } | null> | null;
    user: {
      // The ID of the object.
      id: string;
      email: string;
      isStaff: boolean;
      note: string | null;
      permissions: Array<{
        // Internal code for permission.
        code: string;
        // Describe action(s) allowed to do by permission.
        name: string;
      } | null> | null;
    } | null;
  } | null;
}

export interface VerifyTokenMutationVariables {
  token: string;
}

export interface VerifyTokenMutation {
  tokenVerify: {
    payload: string | null;
    user: {
      // The ID of the object.
      id: string;
      email: string;
      isStaff: boolean;
      note: string | null;
      permissions: Array<{
        // Internal code for permission.
        code: string;
        // Describe action(s) allowed to do by permission.
        name: string;
      } | null> | null;
    } | null;
  } | null;
}

export interface CategoryDeleteMutationVariables {
  id: string;
}

export interface CategoryDeleteMutation {
  categoryDelete: {
    // List of errors that occurred executing the mutation.
    errors: Array<{
      // Name of a field that caused the error. A value of
      // `null` indicates that the error isn't associated with a particular
      // field.
      field: string | null;
      // The error message.
      message: string | null;
    } | null> | null;
  } | null;
}

export interface CategoryCreateMutationVariables {
  name?: string | null;
  description?: string | null;
  parent?: string | null;
}

export interface CategoryCreateMutation {
  categoryCreate: {
    // List of errors that occurred executing the mutation.
    errors: Array<{
      // Name of a field that caused the error. A value of
      // `null` indicates that the error isn't associated with a particular
      // field.
      field: string | null;
      // The error message.
      message: string | null;
    } | null> | null;
    category: {
      // The ID of the object.
      id: string;
      name: string;
      description: string;
      parent: {
        // The ID of the object.
        id: string;
      } | null;
    } | null;
  } | null;
}

export interface CategoryUpdateMutationVariables {
  id: string;
  name?: string | null;
  description?: string | null;
}

export interface CategoryUpdateMutation {
  categoryUpdate: {
    // List of errors that occurred executing the mutation.
    errors: Array<{
      // Name of a field that caused the error. A value of
      // `null` indicates that the error isn't associated with a particular
      // field.
      field: string | null;
      // The error message.
      message: string | null;
    } | null> | null;
    category: {
      // The ID of the object.
      id: string;
      name: string;
      description: string;
      parent: {
        // The ID of the object.
        id: string;
      } | null;
    } | null;
  } | null;
}

export interface CategoryDetailsQueryVariables {
  id: string;
}

export interface CategoryDetailsQuery {
  // Lookup a category by ID.
  category: {
    // The ID of the object.
    id: string;
    name: string;
    description: string;
    parent: {
      // The ID of the object.
      id: string;
    } | null;
  } | null;
}

export interface RootCategoryChildrenQuery {
  // List of the shop's categories.
  categories: {
    edges: Array<{
      // A cursor for use in pagination
      cursor: string;
      // The item at the end of the edge
      node: {
        // The ID of the object.
        id: string;
        name: string;
        // List of children of the category.
        children: {
          // A total count of items in the collection
          totalCount: number | null;
        } | null;
        // List of skills in the category.
        products: {
          // A total count of items in the collection
          totalCount: number | null;
        } | null;
      };
    }>;
  } | null;
}

export interface CategoryPropertiesQueryVariables {
  id: string;
  first?: number | null;
  after?: string | null;
  last?: number | null;
  before?: string | null;
}

export interface CategoryPropertiesQuery {
  // Lookup a category by ID.
  category: {
    // The ID of the object.
    id: string;
    name: string;
    description: string;
    parent: {
      // The ID of the object.
      id: string;
    } | null;
    // List of children of the category.
    children: {
      edges: Array<{
        // The item at the end of the edge
        node: {
          // The ID of the object.
          id: string;
          name: string;
          // List of children of the category.
          children: {
            // A total count of items in the collection
            totalCount: number | null;
          } | null;
          // List of skills in the category.
          products: {
            // A total count of items in the collection
            totalCount: number | null;
          } | null;
        };
      }>;
    } | null;
    // List of skills in the category.
    products: {
      // A total count of items in the collection
      totalCount: number | null;
      pageInfo: {
        // When paginating forwards, the cursor to continue.
        endCursor: string | null;
        // When paginating forwards, are there more items?
        hasNextPage: boolean;
        // When paginating backwards, are there more items?
        hasPreviousPage: boolean;
        // When paginating backwards, the cursor to continue.
        startCursor: string | null;
      };
      edges: Array<{
        // A cursor for use in pagination
        cursor: string;
        // The item at the end of the edge
        node: {
          // The ID of the object.
          id: string;
          name: string;
          // The URL of a main thumbnail for a product.
          thumbnailUrl: string | null;
          productType: {
            // The ID of the object.
            id: string;
            name: string;
          };
        };
      }>;
    } | null;
  } | null;
}

export interface TaskCancelMutationVariables {
  id: string;
}

export interface TaskCancelMutation {
  orderCancel: {
    // Canceled task.
    task: {
      // The ID of the object.
      id: string;
      billingAddress: {
        // The ID of the object.
        id: string;
        city: string;
        cityArea: string;
        companyName: string;
        country: AddressCountry;
        countryArea: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        postalCode: string;
        streetAddress1: string;
        streetAddress2: string;
      } | null;
      created: string;
      // List of events associated with the task.
      events: Array<{
        // The ID of the object.
        id: string;
        // Amount of money.
        amount: number | null;
        // Date when event happened at in ISO 8601 format.
        date: string | null;
        // Email of the customer
        email: string | null;
        // Type of an email sent to the customer
        emailType: string | null;
        // Content of a note added to the task.
        message: string | null;
        // Number of items.
        quantity: number | null;
        // Task event type
        type: TaskEvents | null;
        // User who performed the action.
        user: {
          email: string;
        } | null;
      } | null> | null;
      // List of shipments for the task.
      fulfillments: Array<{
        // The ID of the object.
        id: string;
        lines: {
          edges: Array<{
            // The item at the end of the edge
            node: {
              // The ID of the object.
              id: string;
              orderLine: {
                // The ID of the object.
                id: string;
                productName: string;
              };
              quantity: number;
            };
          }>;
        } | null;
        status: FulfillmentStatus;
        trackingNumber: string;
      } | null>;
      lines: {
        edges: Array<{
          // The item at the end of the edge
          node: {
            // The ID of the object.
            id: string;
            productName: string;
            productSku: string;
            quantity: number;
            quantityFulfilled: number;
            unitPrice: {
              // Amount of money including taxes.
              gross: {
                // Amount of money.
                amount: number;
                // Currency code.
                currency: string;
              };
              // Amount of money without taxes.
              net: {
                // Amount of money.
                amount: number;
                // Currency code.
                currency: string;
              };
            } | null;
          };
        }>;
      } | null;
      // User-friendly number of an task.
      number: string | null;
      // Internal payment status.
      paymentStatus: string | null;
      deliveryAddress: {
        // The ID of the object.
        id: string;
        city: string;
        cityArea: string;
        companyName: string;
        country: AddressCountry;
        countryArea: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        postalCode: string;
        streetAddress1: string;
        streetAddress2: string;
      } | null;
      deliveryMethod: {
        // The ID of the object.
        id: string;
      } | null;
      deliveryMethodName: string | null;
      deliveryPrice: {
        // Amount of money including taxes.
        gross: {
          // Amount of money.
          amount: number;
          // Currency code.
          currency: string;
        };
      } | null;
      status: TaskStatus;
      // The sum of line prices not including delivery.
      subtotal: {
        // Amount of money including taxes.
        gross: {
          // Amount of money.
          amount: number;
          // Currency code.
          currency: string;
        };
      } | null;
      total: {
        // Amount of money including taxes.
        gross: {
          // Amount of money.
          amount: number;
          // Currency code.
          currency: string;
        };
        // Amount of taxes.
        tax: {
          // Amount of money.
          amount: number;
          // Currency code.
          currency: string;
        };
      } | null;
      // Amount authorized for the task.
      totalAuthorized: {
        // Amount of money.
        amount: number;
        // Currency code.
        currency: string;
      } | null;
      // Amount captured by payment.
      totalCaptured: {
        // Amount of money.
        amount: number;
        // Currency code.
        currency: string;
      } | null;
      user: {
        // The ID of the object.
        id: string;
        email: string;
      } | null;
    } | null;
  } | null;
}

export interface TaskRefundMutationVariables {
  id: string;
  amount: string;
}

export interface TaskRefundMutation {
  orderRefund: {
    // List of errors that occurred executing the mutation.
    errors: Array<{
      // Name of a field that caused the error. A value of
      // `null` indicates that the error isn't associated with a particular
      // field.
      field: string | null;
      // The error message.
      message: string | null;
    } | null> | null;
    // A refunded task.
    task: {
      // The ID of the object.
      id: string;
      billingAddress: {
        // The ID of the object.
        id: string;
        city: string;
        cityArea: string;
        companyName: string;
        country: AddressCountry;
        countryArea: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        postalCode: string;
        streetAddress1: string;
        streetAddress2: string;
      } | null;
      created: string;
      // List of events associated with the task.
      events: Array<{
        // The ID of the object.
        id: string;
        // Amount of money.
        amount: number | null;
        // Date when event happened at in ISO 8601 format.
        date: string | null;
        // Email of the customer
        email: string | null;
        // Type of an email sent to the customer
        emailType: string | null;
        // Content of a note added to the task.
        message: string | null;
        // Number of items.
        quantity: number | null;
        // Task event type
        type: TaskEvents | null;
        // User who performed the action.
        user: {
          email: string;
        } | null;
      } | null> | null;
      // List of shipments for the task.
      fulfillments: Array<{
        // The ID of the object.
        id: string;
        lines: {
          edges: Array<{
            // The item at the end of the edge
            node: {
              // The ID of the object.
              id: string;
              orderLine: {
                // The ID of the object.
                id: string;
                productName: string;
              };
              quantity: number;
            };
          }>;
        } | null;
        status: FulfillmentStatus;
        trackingNumber: string;
      } | null>;
      lines: {
        edges: Array<{
          // The item at the end of the edge
          node: {
            // The ID of the object.
            id: string;
            productName: string;
            productSku: string;
            quantity: number;
            quantityFulfilled: number;
            unitPrice: {
              // Amount of money including taxes.
              gross: {
                // Amount of money.
                amount: number;
                // Currency code.
                currency: string;
              };
              // Amount of money without taxes.
              net: {
                // Amount of money.
                amount: number;
                // Currency code.
                currency: string;
              };
            } | null;
          };
        }>;
      } | null;
      // User-friendly number of an task.
      number: string | null;
      // Internal payment status.
      paymentStatus: string | null;
      deliveryAddress: {
        // The ID of the object.
        id: string;
        city: string;
        cityArea: string;
        companyName: string;
        country: AddressCountry;
        countryArea: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        postalCode: string;
        streetAddress1: string;
        streetAddress2: string;
      } | null;
      deliveryMethod: {
        // The ID of the object.
        id: string;
      } | null;
      deliveryMethodName: string | null;
      deliveryPrice: {
        // Amount of money including taxes.
        gross: {
          // Amount of money.
          amount: number;
          // Currency code.
          currency: string;
        };
      } | null;
      status: TaskStatus;
      // The sum of line prices not including delivery.
      subtotal: {
        // Amount of money including taxes.
        gross: {
          // Amount of money.
          amount: number;
          // Currency code.
          currency: string;
        };
      } | null;
      total: {
        // Amount of money including taxes.
        gross: {
          // Amount of money.
          amount: number;
          // Currency code.
          currency: string;
        };
        // Amount of taxes.
        tax: {
          // Amount of money.
          amount: number;
          // Currency code.
          currency: string;
        };
      } | null;
      // Amount authorized for the task.
      totalAuthorized: {
        // Amount of money.
        amount: number;
        // Currency code.
        currency: string;
      } | null;
      // Amount captured by payment.
      totalCaptured: {
        // Amount of money.
        amount: number;
        // Currency code.
        currency: string;
      } | null;
      user: {
        // The ID of the object.
        id: string;
        email: string;
      } | null;
    } | null;
  } | null;
}

export interface TaskVoidMutationVariables {
  id: string;
}

export interface TaskVoidMutation {
  orderVoid: {
    // A voided task.
    task: {
      // The ID of the object.
      id: string;
      billingAddress: {
        // The ID of the object.
        id: string;
        city: string;
        cityArea: string;
        companyName: string;
        country: AddressCountry;
        countryArea: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        postalCode: string;
        streetAddress1: string;
        streetAddress2: string;
      } | null;
      created: string;
      // List of events associated with the task.
      events: Array<{
        // The ID of the object.
        id: string;
        // Amount of money.
        amount: number | null;
        // Date when event happened at in ISO 8601 format.
        date: string | null;
        // Email of the customer
        email: string | null;
        // Type of an email sent to the customer
        emailType: string | null;
        // Content of a note added to the task.
        message: string | null;
        // Number of items.
        quantity: number | null;
        // Task event type
        type: TaskEvents | null;
        // User who performed the action.
        user: {
          email: string;
        } | null;
      } | null> | null;
      // List of shipments for the task.
      fulfillments: Array<{
        // The ID of the object.
        id: string;
        lines: {
          edges: Array<{
            // The item at the end of the edge
            node: {
              // The ID of the object.
              id: string;
              orderLine: {
                // The ID of the object.
                id: string;
                productName: string;
              };
              quantity: number;
            };
          }>;
        } | null;
        status: FulfillmentStatus;
        trackingNumber: string;
      } | null>;
      lines: {
        edges: Array<{
          // The item at the end of the edge
          node: {
            // The ID of the object.
            id: string;
            productName: string;
            productSku: string;
            quantity: number;
            quantityFulfilled: number;
            unitPrice: {
              // Amount of money including taxes.
              gross: {
                // Amount of money.
                amount: number;
                // Currency code.
                currency: string;
              };
              // Amount of money without taxes.
              net: {
                // Amount of money.
                amount: number;
                // Currency code.
                currency: string;
              };
            } | null;
          };
        }>;
      } | null;
      // User-friendly number of an task.
      number: string | null;
      // Internal payment status.
      paymentStatus: string | null;
      deliveryAddress: {
        // The ID of the object.
        id: string;
        city: string;
        cityArea: string;
        companyName: string;
        country: AddressCountry;
        countryArea: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        postalCode: string;
        streetAddress1: string;
        streetAddress2: string;
      } | null;
      deliveryMethod: {
        // The ID of the object.
        id: string;
      } | null;
      deliveryMethodName: string | null;
      deliveryPrice: {
        // Amount of money including taxes.
        gross: {
          // Amount of money.
          amount: number;
          // Currency code.
          currency: string;
        };
      } | null;
      status: TaskStatus;
      // The sum of line prices not including delivery.
      subtotal: {
        // Amount of money including taxes.
        gross: {
          // Amount of money.
          amount: number;
          // Currency code.
          currency: string;
        };
      } | null;
      total: {
        // Amount of money including taxes.
        gross: {
          // Amount of money.
          amount: number;
          // Currency code.
          currency: string;
        };
        // Amount of taxes.
        tax: {
          // Amount of money.
          amount: number;
          // Currency code.
          currency: string;
        };
      } | null;
      // Amount authorized for the task.
      totalAuthorized: {
        // Amount of money.
        amount: number;
        // Currency code.
        currency: string;
      } | null;
      // Amount captured by payment.
      totalCaptured: {
        // Amount of money.
        amount: number;
        // Currency code.
        currency: string;
      } | null;
      user: {
        // The ID of the object.
        id: string;
        email: string;
      } | null;
    } | null;
  } | null;
}

export interface TaskCaptureMutationVariables {
  id: string;
  amount: string;
}

export interface TaskCaptureMutation {
  orderCapture: {
    // List of errors that occurred executing the mutation.
    errors: Array<{
      // Name of a field that caused the error. A value of
      // `null` indicates that the error isn't associated with a particular
      // field.
      field: string | null;
      // The error message.
      message: string | null;
    } | null> | null;
    // Captured task.
    task: {
      // The ID of the object.
      id: string;
      billingAddress: {
        // The ID of the object.
        id: string;
        city: string;
        cityArea: string;
        companyName: string;
        country: AddressCountry;
        countryArea: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        postalCode: string;
        streetAddress1: string;
        streetAddress2: string;
      } | null;
      created: string;
      // List of events associated with the task.
      events: Array<{
        // The ID of the object.
        id: string;
        // Amount of money.
        amount: number | null;
        // Date when event happened at in ISO 8601 format.
        date: string | null;
        // Email of the customer
        email: string | null;
        // Type of an email sent to the customer
        emailType: string | null;
        // Content of a note added to the task.
        message: string | null;
        // Number of items.
        quantity: number | null;
        // Task event type
        type: TaskEvents | null;
        // User who performed the action.
        user: {
          email: string;
        } | null;
      } | null> | null;
      // List of shipments for the task.
      fulfillments: Array<{
        // The ID of the object.
        id: string;
        lines: {
          edges: Array<{
            // The item at the end of the edge
            node: {
              // The ID of the object.
              id: string;
              orderLine: {
                // The ID of the object.
                id: string;
                productName: string;
              };
              quantity: number;
            };
          }>;
        } | null;
        status: FulfillmentStatus;
        trackingNumber: string;
      } | null>;
      lines: {
        edges: Array<{
          // The item at the end of the edge
          node: {
            // The ID of the object.
            id: string;
            productName: string;
            productSku: string;
            quantity: number;
            quantityFulfilled: number;
            unitPrice: {
              // Amount of money including taxes.
              gross: {
                // Amount of money.
                amount: number;
                // Currency code.
                currency: string;
              };
              // Amount of money without taxes.
              net: {
                // Amount of money.
                amount: number;
                // Currency code.
                currency: string;
              };
            } | null;
          };
        }>;
      } | null;
      // User-friendly number of an task.
      number: string | null;
      // Internal payment status.
      paymentStatus: string | null;
      deliveryAddress: {
        // The ID of the object.
        id: string;
        city: string;
        cityArea: string;
        companyName: string;
        country: AddressCountry;
        countryArea: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        postalCode: string;
        streetAddress1: string;
        streetAddress2: string;
      } | null;
      deliveryMethod: {
        // The ID of the object.
        id: string;
      } | null;
      deliveryMethodName: string | null;
      deliveryPrice: {
        // Amount of money including taxes.
        gross: {
          // Amount of money.
          amount: number;
          // Currency code.
          currency: string;
        };
      } | null;
      status: TaskStatus;
      // The sum of line prices not including delivery.
      subtotal: {
        // Amount of money including taxes.
        gross: {
          // Amount of money.
          amount: number;
          // Currency code.
          currency: string;
        };
      } | null;
      total: {
        // Amount of money including taxes.
        gross: {
          // Amount of money.
          amount: number;
          // Currency code.
          currency: string;
        };
        // Amount of taxes.
        tax: {
          // Amount of money.
          amount: number;
          // Currency code.
          currency: string;
        };
      } | null;
      // Amount authorized for the task.
      totalAuthorized: {
        // Amount of money.
        amount: number;
        // Currency code.
        currency: string;
      } | null;
      // Amount captured by payment.
      totalCaptured: {
        // Amount of money.
        amount: number;
        // Currency code.
        currency: string;
      } | null;
      user: {
        // The ID of the object.
        id: string;
        email: string;
      } | null;
    } | null;
  } | null;
}

export interface TaskCreateFulfillmentMutationVariables {
  input: FulfillmentCreateInput;
}

export interface TaskCreateFulfillmentMutation {
  fulfillmentCreate: {
    // List of errors that occurred executing the mutation.
    errors: Array<{
      // Name of a field that caused the error. A value of
      // `null` indicates that the error isn't associated with a particular
      // field.
      field: string | null;
      // The error message.
      message: string | null;
    } | null> | null;
  } | null;
}

export interface TaskListQueryVariables {
  first?: number | null;
  after?: string | null;
  last?: number | null;
  before?: string | null;
}

export interface TaskListQuery {
  // List of the shop's tasks.
  tasks: {
    edges: Array<{
      // A cursor for use in pagination
      cursor: string;
      // The item at the end of the edge
      node: {
        // The ID of the object.
        id: string;
        // User-friendly number of an task.
        number: string | null;
        created: string;
        // Internal payment status.
        paymentStatus: string | null;
        status: TaskStatus;
        total: {
          // Amount of money including taxes.
          gross: {
            // Amount of money.
            amount: number;
            // Currency code.
            currency: string;
          };
        } | null;
        userEmail: string;
      };
    }>;
    pageInfo: {
      // When paginating backwards, are there more items?
      hasPreviousPage: boolean;
      // When paginating forwards, are there more items?
      hasNextPage: boolean;
      // When paginating backwards, the cursor to continue.
      startCursor: string | null;
      // When paginating forwards, the cursor to continue.
      endCursor: string | null;
    };
  } | null;
}

export interface TaskDetailsQueryVariables {
  id: string;
}

export interface TaskDetailsQuery {
  // Lookup an task by ID.
  task: {
    // The ID of the object.
    id: string;
    billingAddress: {
      // The ID of the object.
      id: string;
      city: string;
      cityArea: string;
      companyName: string;
      country: AddressCountry;
      countryArea: string;
      firstName: string;
      lastName: string;
      phone: string | null;
      postalCode: string;
      streetAddress1: string;
      streetAddress2: string;
    } | null;
    created: string;
    // List of events associated with the task.
    events: Array<{
      // The ID of the object.
      id: string;
      // Amount of money.
      amount: number | null;
      // Date when event happened at in ISO 8601 format.
      date: string | null;
      // Email of the customer
      email: string | null;
      // Type of an email sent to the customer
      emailType: string | null;
      // Content of a note added to the task.
      message: string | null;
      // Number of items.
      quantity: number | null;
      // Task event type
      type: TaskEvents | null;
      // User who performed the action.
      user: {
        email: string;
      } | null;
    } | null> | null;
    // List of shipments for the task.
    fulfillments: Array<{
      // The ID of the object.
      id: string;
      lines: {
        edges: Array<{
          // The item at the end of the edge
          node: {
            // The ID of the object.
            id: string;
            orderLine: {
              // The ID of the object.
              id: string;
              productName: string;
            };
            quantity: number;
          };
        }>;
      } | null;
      status: FulfillmentStatus;
      trackingNumber: string;
    } | null>;
    lines: {
      edges: Array<{
        // The item at the end of the edge
        node: {
          // The ID of the object.
          id: string;
          productName: string;
          productSku: string;
          quantity: number;
          quantityFulfilled: number;
          unitPrice: {
            // Amount of money including taxes.
            gross: {
              // Amount of money.
              amount: number;
              // Currency code.
              currency: string;
            };
            // Amount of money without taxes.
            net: {
              // Amount of money.
              amount: number;
              // Currency code.
              currency: string;
            };
          } | null;
        };
      }>;
    } | null;
    // User-friendly number of an task.
    number: string | null;
    // Internal payment status.
    paymentStatus: string | null;
    deliveryAddress: {
      // The ID of the object.
      id: string;
      city: string;
      cityArea: string;
      companyName: string;
      country: AddressCountry;
      countryArea: string;
      firstName: string;
      lastName: string;
      phone: string | null;
      postalCode: string;
      streetAddress1: string;
      streetAddress2: string;
    } | null;
    deliveryMethod: {
      // The ID of the object.
      id: string;
    } | null;
    deliveryMethodName: string | null;
    deliveryPrice: {
      // Amount of money including taxes.
      gross: {
        // Amount of money.
        amount: number;
        // Currency code.
        currency: string;
      };
    } | null;
    status: TaskStatus;
    // The sum of line prices not including delivery.
    subtotal: {
      // Amount of money including taxes.
      gross: {
        // Amount of money.
        amount: number;
        // Currency code.
        currency: string;
      };
    } | null;
    total: {
      // Amount of money including taxes.
      gross: {
        // Amount of money.
        amount: number;
        // Currency code.
        currency: string;
      };
      // Amount of taxes.
      tax: {
        // Amount of money.
        amount: number;
        // Currency code.
        currency: string;
      };
    } | null;
    // Amount authorized for the task.
    totalAuthorized: {
      // Amount of money.
      amount: number;
      // Currency code.
      currency: string;
    } | null;
    // Amount captured by payment.
    totalCaptured: {
      // Amount of money.
      amount: number;
      // Currency code.
      currency: string;
    } | null;
    user: {
      // The ID of the object.
      id: string;
      email: string;
    } | null;
  } | null;
}

export interface TaskDeliveryMethodsQuery {
  // List of the shop's delivery zones.
  deliveryZones: {
    edges: Array<{
      // The item at the end of the edge
      node: {
        deliveryMethods: {
          edges: Array<{
            // The item at the end of the edge
            node: {
              // The ID of the object.
              id: string;
              name: string;
            } | null;
          } | null>;
        } | null;
      };
    }>;
  } | null;
}

export interface PageDeleteMutationVariables {
  id: string;
}

export interface PageDeleteMutation {
  pageDelete: {
    // List of errors that occurred executing the mutation.
    errors: Array<{
      // Name of a field that caused the error. A value of
      // `null` indicates that the error isn't associated with a particular
      // field.
      field: string | null;
      // The error message.
      message: string | null;
    } | null> | null;
  } | null;
}

export interface PageUpdateMutationVariables {
  id: string;
  title: string;
  content: string;
  slug: string;
  isPublished: boolean;
  publicationDate?: string | null;
}

export interface PageUpdateMutation {
  pageUpdate: {
    page: {
      // The ID of the object.
      id: string;
      slug: string;
      title: string;
      content: string;
      isPublished: boolean;
      publicationDate: string | null;
    } | null;
    // List of errors that occurred executing the mutation.
    errors: Array<{
      // Name of a field that caused the error. A value of
      // `null` indicates that the error isn't associated with a particular
      // field.
      field: string | null;
      // The error message.
      message: string | null;
    } | null> | null;
  } | null;
}

export interface PageCreateMutationVariables {
  title: string;
  content: string;
  slug: string;
  isPublished: boolean;
  publicationDate?: string | null;
}

export interface PageCreateMutation {
  pageCreate: {
    page: {
      // The ID of the object.
      id: string;
      slug: string;
      title: string;
      content: string;
      isPublished: boolean;
      publicationDate: string | null;
      created: string;
    } | null;
    // List of errors that occurred executing the mutation.
    errors: Array<{
      // Name of a field that caused the error. A value of
      // `null` indicates that the error isn't associated with a particular
      // field.
      field: string | null;
      // The error message.
      message: string | null;
    } | null> | null;
  } | null;
}

export interface PageListQueryVariables {
  first?: number | null;
  after?: string | null;
  last?: number | null;
  before?: string | null;
}

export interface PageListQuery {
  // List of the shop's pages.
  pages: {
    edges: Array<{
      // A cursor for use in pagination
      cursor: string;
      // The item at the end of the edge
      node: {
        // The ID of the object.
        id: string;
        slug: string;
        title: string;
        isPublished: boolean;
      };
    }>;
    pageInfo: {
      // When paginating backwards, are there more items?
      hasPreviousPage: boolean;
      // When paginating forwards, are there more items?
      hasNextPage: boolean;
      // When paginating backwards, the cursor to continue.
      startCursor: string | null;
      // When paginating forwards, the cursor to continue.
      endCursor: string | null;
    };
  } | null;
}

export interface PageDetailsQueryVariables {
  id: string;
}

export interface PageDetailsQuery {
  // Lookup a page by ID or by slug.
  page: {
    // The ID of the object.
    id: string;
    slug: string;
    title: string;
    content: string;
    created: string;
    isPublished: boolean;
    publicationDate: string | null;
  } | null;
}

export interface SkillImageCreateMutationVariables {
  product: string;
  image: string;
  alt?: string | null;
}

export interface SkillImageCreateMutation {
  productImageCreate: {
    // List of errors that occurred executing the mutation.
    errors: Array<{
      // Name of a field that caused the error. A value of
      // `null` indicates that the error isn't associated with a particular
      // field.
      field: string | null;
      // The error message.
      message: string | null;
    } | null> | null;
    product: {
      // The ID of the object.
      id: string;
      name: string;
      description: string;
      seoTitle: string | null;
      seoDescription: string | null;
      category: {
        // The ID of the object.
        id: string;
        name: string;
      };
      collections: {
        edges: Array<{
          // The item at the end of the edge
          node: {
            // The ID of the object.
            id: string;
            name: string;
          };
        }>;
      } | null;
      // The product's base price (without any discounts
      // applied).
      price: {
        // Amount of money.
        amount: number;
        // Currency code.
        currency: string;
      } | null;
      margin: {
        start: number | null;
        stop: number | null;
      } | null;
      purchaseCost: {
        // Lower bound of a price range.
        start: {
          // Amount of money.
          amount: number;
          // Currency code.
          currency: string;
        } | null;
        // Upper bound of a price range.
        stop: {
          // Amount of money.
          amount: number;
          // Currency code.
          currency: string;
        } | null;
      } | null;
      isPublished: boolean;
      chargeTaxes: boolean;
      publicationDate: string | null;
      // List of skill attributes assigned to this product.
      attributes: Array<{
        // Name of an attribute
        attribute: {
          // The ID of the object.
          id: string;
          // Internal representation of an attribute name.
          slug: string | null;
          // Visible name for display purposes.
          name: string | null;
          // List of attribute's values.
          values: Array<{
            // Visible name for display purposes.
            name: string | null;
            // Internal representation of an attribute name.
            slug: string | null;
          } | null> | null;
        } | null;
        // Value of an attribute.
        value: {
          // The ID of the object.
          id: string;
          // Visible name for display purposes.
          name: string | null;
          // Internal representation of an attribute name.
          slug: string | null;
        } | null;
      } | null> | null;
      // Informs about product's availability in the storefront,
      // current price and discounts.
      availability: {
        available: boolean | null;
        priceRange: {
          // Lower bound of a price range.
          start: {
            // Amount of money without taxes.
            net: {
              // Amount of money.
              amount: number;
              // Currency code.
              currency: string;
            };
          } | null;
          // Upper bound of a price range.
          stop: {
            // Amount of money without taxes.
            net: {
              // Amount of money.
              amount: number;
              // Currency code.
              currency: string;
            };
          } | null;
        } | null;
      } | null;
      images: {
        edges: Array<{
          // The item at the end of the edge
          node: {
            // The ID of the object.
            id: string;
            alt: string;
            sortTask: number;
            // The URL of the image.
            url: string;
          };
        }>;
      } | null;
      variants: {
        edges: Array<{
          // The item at the end of the edge
          node: {
            // The ID of the object.
            id: string;
            sku: string;
            name: string;
            // Override the base price of a skill if necessary.
            // A value of `null` indicates that the default skill price is used.
            priceOverride: {
              // Amount of money.
              amount: number;
              // Currency code.
              currency: string;
            } | null;
            // Quantity of a skill available for sale.
            stockQuantity: number;
            // Gross margin percentage value.
            margin: number | null;
          };
        }>;
      } | null;
      productType: {
        // The ID of the object.
        id: string;
        name: string;
        hasVariants: boolean;
      };
      // The storefront URL for the product.
      url: string;
    } | null;
  } | null;
}

export interface SkillDeleteMutationVariables {
  id: string;
}

export interface SkillDeleteMutation {
  productDelete: {
    // List of errors that occurred executing the mutation.
    errors: Array<{
      // Name of a field that caused the error. A value of
      // `null` indicates that the error isn't associated with a particular
      // field.
      field: string | null;
      // The error message.
      message: string | null;
    } | null> | null;
    product: {
      // The ID of the object.
      id: string;
    } | null;
  } | null;
}

export interface SkillImageReorderMutationVariables {
  productId: string;
  imagesIds: Array<string | null>;
}

export interface SkillImageReorderMutation {
  productImageReorder: {
    // List of errors that occurred executing the mutation.
    errors: Array<{
      // Name of a field that caused the error. A value of
      // `null` indicates that the error isn't associated with a particular
      // field.
      field: string | null;
      // The error message.
      message: string | null;
    } | null> | null;
    product: {
      // The ID of the object.
      id: string;
      images: {
        edges: Array<{
          // The item at the end of the edge
          node: {
            // The ID of the object.
            id: string;
            alt: string;
            sortTask: number;
            // The URL of the image.
            url: string;
          };
        }>;
      } | null;
    } | null;
  } | null;
}

export interface SkillUpdateMutationVariables {
  id: string;
  attributes?: Array<AttributeValueInput | null> | null;
  publicationDate?: string | null;
  category?: string | null;
  chargeTaxes: boolean;
  collections?: Array<string | null> | null;
  description?: string | null;
  isPublished: boolean;
  name?: string | null;
  price?: string | null;
}

export interface SkillUpdateMutation {
  productUpdate: {
    // List of errors that occurred executing the mutation.
    errors: Array<{
      // Name of a field that caused the error. A value of
      // `null` indicates that the error isn't associated with a particular
      // field.
      field: string | null;
      // The error message.
      message: string | null;
    } | null> | null;
    product: {
      // The ID of the object.
      id: string;
      name: string;
      description: string;
      seoTitle: string | null;
      seoDescription: string | null;
      category: {
        // The ID of the object.
        id: string;
        name: string;
      };
      collections: {
        edges: Array<{
          // The item at the end of the edge
          node: {
            // The ID of the object.
            id: string;
            name: string;
          };
        }>;
      } | null;
      // The product's base price (without any discounts
      // applied).
      price: {
        // Amount of money.
        amount: number;
        // Currency code.
        currency: string;
      } | null;
      margin: {
        start: number | null;
        stop: number | null;
      } | null;
      purchaseCost: {
        // Lower bound of a price range.
        start: {
          // Amount of money.
          amount: number;
          // Currency code.
          currency: string;
        } | null;
        // Upper bound of a price range.
        stop: {
          // Amount of money.
          amount: number;
          // Currency code.
          currency: string;
        } | null;
      } | null;
      isPublished: boolean;
      chargeTaxes: boolean;
      publicationDate: string | null;
      // List of skill attributes assigned to this product.
      attributes: Array<{
        // Name of an attribute
        attribute: {
          // The ID of the object.
          id: string;
          // Internal representation of an attribute name.
          slug: string | null;
          // Visible name for display purposes.
          name: string | null;
          // List of attribute's values.
          values: Array<{
            // Visible name for display purposes.
            name: string | null;
            // Internal representation of an attribute name.
            slug: string | null;
          } | null> | null;
        } | null;
        // Value of an attribute.
        value: {
          // The ID of the object.
          id: string;
          // Visible name for display purposes.
          name: string | null;
          // Internal representation of an attribute name.
          slug: string | null;
        } | null;
      } | null> | null;
      // Informs about product's availability in the storefront,
      // current price and discounts.
      availability: {
        available: boolean | null;
        priceRange: {
          // Lower bound of a price range.
          start: {
            // Amount of money without taxes.
            net: {
              // Amount of money.
              amount: number;
              // Currency code.
              currency: string;
            };
          } | null;
          // Upper bound of a price range.
          stop: {
            // Amount of money without taxes.
            net: {
              // Amount of money.
              amount: number;
              // Currency code.
              currency: string;
            };
          } | null;
        } | null;
      } | null;
      images: {
        edges: Array<{
          // The item at the end of the edge
          node: {
            // The ID of the object.
            id: string;
            alt: string;
            sortTask: number;
            // The URL of the image.
            url: string;
          };
        }>;
      } | null;
      variants: {
        edges: Array<{
          // The item at the end of the edge
          node: {
            // The ID of the object.
            id: string;
            sku: string;
            name: string;
            // Override the base price of a skill if necessary.
            // A value of `null` indicates that the default skill price is used.
            priceOverride: {
              // Amount of money.
              amount: number;
              // Currency code.
              currency: string;
            } | null;
            // Quantity of a skill available for sale.
            stockQuantity: number;
            // Gross margin percentage value.
            margin: number | null;
          };
        }>;
      } | null;
      productType: {
        // The ID of the object.
        id: string;
        name: string;
        hasVariants: boolean;
      };
      // The storefront URL for the product.
      url: string;
    } | null;
  } | null;
}

export interface SkillCreateMutationVariables {
  attributes?: Array<AttributeValueInput | null> | null;
  publicationDate?: string | null;
  category: string;
  chargeTaxes: boolean;
  collections?: Array<string | null> | null;
  description?: string | null;
  isPublished: boolean;
  name: string;
  price?: string | null;
  productType: string;
}

export interface SkillCreateMutation {
  productCreate: {
    // List of errors that occurred executing the mutation.
    errors: Array<{
      // Name of a field that caused the error. A value of
      // `null` indicates that the error isn't associated with a particular
      // field.
      field: string | null;
      // The error message.
      message: string | null;
    } | null> | null;
    product: {
      // The ID of the object.
      id: string;
      name: string;
      description: string;
      seoTitle: string | null;
      seoDescription: string | null;
      category: {
        // The ID of the object.
        id: string;
        name: string;
      };
      collections: {
        edges: Array<{
          // The item at the end of the edge
          node: {
            // The ID of the object.
            id: string;
            name: string;
          };
        }>;
      } | null;
      // The product's base price (without any discounts
      // applied).
      price: {
        // Amount of money.
        amount: number;
        // Currency code.
        currency: string;
      } | null;
      margin: {
        start: number | null;
        stop: number | null;
      } | null;
      purchaseCost: {
        // Lower bound of a price range.
        start: {
          // Amount of money.
          amount: number;
          // Currency code.
          currency: string;
        } | null;
        // Upper bound of a price range.
        stop: {
          // Amount of money.
          amount: number;
          // Currency code.
          currency: string;
        } | null;
      } | null;
      isPublished: boolean;
      chargeTaxes: boolean;
      publicationDate: string | null;
      // List of skill attributes assigned to this product.
      attributes: Array<{
        // Name of an attribute
        attribute: {
          // The ID of the object.
          id: string;
          // Internal representation of an attribute name.
          slug: string | null;
          // Visible name for display purposes.
          name: string | null;
          // List of attribute's values.
          values: Array<{
            // Visible name for display purposes.
            name: string | null;
            // Internal representation of an attribute name.
            slug: string | null;
          } | null> | null;
        } | null;
        // Value of an attribute.
        value: {
          // The ID of the object.
          id: string;
          // Visible name for display purposes.
          name: string | null;
          // Internal representation of an attribute name.
          slug: string | null;
        } | null;
      } | null> | null;
      // Informs about product's availability in the storefront,
      // current price and discounts.
      availability: {
        available: boolean | null;
        priceRange: {
          // Lower bound of a price range.
          start: {
            // Amount of money without taxes.
            net: {
              // Amount of money.
              amount: number;
              // Currency code.
              currency: string;
            };
          } | null;
          // Upper bound of a price range.
          stop: {
            // Amount of money without taxes.
            net: {
              // Amount of money.
              amount: number;
              // Currency code.
              currency: string;
            };
          } | null;
        } | null;
      } | null;
      images: {
        edges: Array<{
          // The item at the end of the edge
          node: {
            // The ID of the object.
            id: string;
            alt: string;
            sortTask: number;
            // The URL of the image.
            url: string;
          };
        }>;
      } | null;
      variants: {
        edges: Array<{
          // The item at the end of the edge
          node: {
            // The ID of the object.
            id: string;
            sku: string;
            name: string;
            // Override the base price of a skill if necessary.
            // A value of `null` indicates that the default skill price is used.
            priceOverride: {
              // Amount of money.
              amount: number;
              // Currency code.
              currency: string;
            } | null;
            // Quantity of a skill available for sale.
            stockQuantity: number;
            // Gross margin percentage value.
            margin: number | null;
          };
        }>;
      } | null;
      productType: {
        // The ID of the object.
        id: string;
        name: string;
        hasVariants: boolean;
      };
      // The storefront URL for the product.
      url: string;
    } | null;
  } | null;
}

export interface VariantDeleteMutationVariables {
  id: string;
}

export interface VariantDeleteMutation {
  productVariantDelete: {
    // List of errors that occurred executing the mutation.
    errors: Array<{
      // Name of a field that caused the error. A value of
      // `null` indicates that the error isn't associated with a particular
      // field.
      field: string | null;
      // The error message.
      message: string | null;
    } | null> | null;
    productVariant: {
      // The ID of the object.
      id: string;
    } | null;
  } | null;
}

export interface VariantUpdateMutationVariables {
  id: string;
  attributes?: Array<AttributeValueInput | null> | null;
  costPrice?: string | null;
  priceOverride?: string | null;
  sku?: string | null;
  quantity?: number | null;
  trackInventory: boolean;
}

export interface VariantUpdateMutation {
  productVariantUpdate: {
    // List of errors that occurred executing the mutation.
    errors: Array<{
      // Name of a field that caused the error. A value of
      // `null` indicates that the error isn't associated with a particular
      // field.
      field: string | null;
      // The error message.
      message: string | null;
    } | null> | null;
    productVariant: {
      // The ID of the object.
      id: string;
      // List of attributes assigned to this variant.
      attributes: Array<{
        // Name of an attribute
        attribute: {
          // The ID of the object.
          id: string;
          // Visible name for display purposes.
          name: string | null;
          // Internal representation of an attribute name.
          slug: string | null;
          // List of attribute's values.
          values: Array<{
            // The ID of the object.
            id: string;
            // Visible name for display purposes.
            name: string | null;
            // Internal representation of an attribute name.
            slug: string | null;
          } | null> | null;
        } | null;
        // Value of an attribute.
        value: {
          // The ID of the object.
          id: string;
          // Visible name for display purposes.
          name: string | null;
          // Internal representation of an attribute name.
          slug: string | null;
        } | null;
      } | null> | null;
      // Cost price of the variant.
      costPrice: {
        // Amount of money.
        amount: number;
        // Currency code.
        currency: string;
      } | null;
      images: {
        edges: Array<{
          // The item at the end of the edge
          node: {
            // The ID of the object.
            id: string;
          };
        }>;
      } | null;
      name: string;
      // Override the base price of a skill if necessary.
      // A value of `null` indicates that the default skill price is used.
      priceOverride: {
        // Amount of money.
        amount: number;
        // Currency code.
        currency: string;
      } | null;
      product: {
        // The ID of the object.
        id: string;
        images: {
          edges: Array<{
            // The item at the end of the edge
            node: {
              // The ID of the object.
              id: string;
              alt: string;
              sortTask: number;
              // The URL of the image.
              url: string;
            };
          }>;
        } | null;
        name: string;
        // The URL of a main thumbnail for a product.
        thumbnailUrl: string | null;
        variants: {
          // A total count of items in the collection
          totalCount: number | null;
          edges: Array<{
            // The item at the end of the edge
            node: {
              // The ID of the object.
              id: string;
              name: string;
              sku: string;
              image: {
                edges: Array<{
                  // The item at the end of the edge
                  node: {
                    // The ID of the object.
                    id: string;
                    // The URL of the image.
                    url: string;
                  };
                }>;
              } | null;
            };
          }>;
        } | null;
      };
      sku: string;
      quantity: number;
      quantityAllocated: number;
    } | null;
  } | null;
}

export interface VariantCreateMutationVariables {
  attributes?: Array<AttributeValueInput | null> | null;
  costPrice?: string | null;
  priceOverride?: string | null;
  product: string;
  sku?: string | null;
  quantity?: number | null;
  trackInventory: boolean;
}

export interface VariantCreateMutation {
  productVariantCreate: {
    // List of errors that occurred executing the mutation.
    errors: Array<{
      // Name of a field that caused the error. A value of
      // `null` indicates that the error isn't associated with a particular
      // field.
      field: string | null;
      // The error message.
      message: string | null;
    } | null> | null;
    productVariant: {
      // The ID of the object.
      id: string;
      // List of attributes assigned to this variant.
      attributes: Array<{
        // Name of an attribute
        attribute: {
          // The ID of the object.
          id: string;
          // Visible name for display purposes.
          name: string | null;
          // Internal representation of an attribute name.
          slug: string | null;
          // List of attribute's values.
          values: Array<{
            // The ID of the object.
            id: string;
            // Visible name for display purposes.
            name: string | null;
            // Internal representation of an attribute name.
            slug: string | null;
          } | null> | null;
        } | null;
        // Value of an attribute.
        value: {
          // The ID of the object.
          id: string;
          // Visible name for display purposes.
          name: string | null;
          // Internal representation of an attribute name.
          slug: string | null;
        } | null;
      } | null> | null;
      // Cost price of the variant.
      costPrice: {
        // Amount of money.
        amount: number;
        // Currency code.
        currency: string;
      } | null;
      images: {
        edges: Array<{
          // The item at the end of the edge
          node: {
            // The ID of the object.
            id: string;
          };
        }>;
      } | null;
      name: string;
      // Override the base price of a skill if necessary.
      // A value of `null` indicates that the default skill price is used.
      priceOverride: {
        // Amount of money.
        amount: number;
        // Currency code.
        currency: string;
      } | null;
      product: {
        // The ID of the object.
        id: string;
        images: {
          edges: Array<{
            // The item at the end of the edge
            node: {
              // The ID of the object.
              id: string;
              alt: string;
              sortTask: number;
              // The URL of the image.
              url: string;
            };
          }>;
        } | null;
        name: string;
        // The URL of a main thumbnail for a product.
        thumbnailUrl: string | null;
        variants: {
          // A total count of items in the collection
          totalCount: number | null;
          edges: Array<{
            // The item at the end of the edge
            node: {
              // The ID of the object.
              id: string;
              name: string;
              sku: string;
              image: {
                edges: Array<{
                  // The item at the end of the edge
                  node: {
                    // The ID of the object.
                    id: string;
                    // The URL of the image.
                    url: string;
                  };
                }>;
              } | null;
            };
          }>;
        } | null;
      };
      sku: string;
      quantity: number;
      quantityAllocated: number;
    } | null;
  } | null;
}

export interface SkillImageDeleteMutationVariables {
  id: string;
}

export interface SkillImageDeleteMutation {
  productImageDelete: {
    product: {
      // The ID of the object.
      id: string;
      images: {
        edges: Array<{
          // The item at the end of the edge
          node: {
            // The ID of the object.
            id: string;
          };
        }>;
      } | null;
    } | null;
  } | null;
}

export interface SkillImageUpdateMutationVariables {
  id: string;
  alt: string;
}

export interface SkillImageUpdateMutation {
  productImageUpdate: {
    // List of errors that occurred executing the mutation.
    errors: Array<{
      // Name of a field that caused the error. A value of
      // `null` indicates that the error isn't associated with a particular
      // field.
      field: string | null;
      // The error message.
      message: string | null;
    } | null> | null;
    product: {
      // The ID of the object.
      id: string;
      name: string;
      description: string;
      seoTitle: string | null;
      seoDescription: string | null;
      category: {
        // The ID of the object.
        id: string;
        name: string;
      };
      collections: {
        edges: Array<{
          // The item at the end of the edge
          node: {
            // The ID of the object.
            id: string;
            name: string;
          };
        }>;
      } | null;
      // The product's base price (without any discounts
      // applied).
      price: {
        // Amount of money.
        amount: number;
        // Currency code.
        currency: string;
      } | null;
      margin: {
        start: number | null;
        stop: number | null;
      } | null;
      purchaseCost: {
        // Lower bound of a price range.
        start: {
          // Amount of money.
          amount: number;
          // Currency code.
          currency: string;
        } | null;
        // Upper bound of a price range.
        stop: {
          // Amount of money.
          amount: number;
          // Currency code.
          currency: string;
        } | null;
      } | null;
      isPublished: boolean;
      chargeTaxes: boolean;
      publicationDate: string | null;
      // List of skill attributes assigned to this product.
      attributes: Array<{
        // Name of an attribute
        attribute: {
          // The ID of the object.
          id: string;
          // Internal representation of an attribute name.
          slug: string | null;
          // Visible name for display purposes.
          name: string | null;
          // List of attribute's values.
          values: Array<{
            // Visible name for display purposes.
            name: string | null;
            // Internal representation of an attribute name.
            slug: string | null;
          } | null> | null;
        } | null;
        // Value of an attribute.
        value: {
          // The ID of the object.
          id: string;
          // Visible name for display purposes.
          name: string | null;
          // Internal representation of an attribute name.
          slug: string | null;
        } | null;
      } | null> | null;
      // Informs about product's availability in the storefront,
      // current price and discounts.
      availability: {
        available: boolean | null;
        priceRange: {
          // Lower bound of a price range.
          start: {
            // Amount of money without taxes.
            net: {
              // Amount of money.
              amount: number;
              // Currency code.
              currency: string;
            };
          } | null;
          // Upper bound of a price range.
          stop: {
            // Amount of money without taxes.
            net: {
              // Amount of money.
              amount: number;
              // Currency code.
              currency: string;
            };
          } | null;
        } | null;
      } | null;
      images: {
        edges: Array<{
          // The item at the end of the edge
          node: {
            // The ID of the object.
            id: string;
            alt: string;
            sortTask: number;
            // The URL of the image.
            url: string;
          };
        }>;
      } | null;
      variants: {
        edges: Array<{
          // The item at the end of the edge
          node: {
            // The ID of the object.
            id: string;
            sku: string;
            name: string;
            // Override the base price of a skill if necessary.
            // A value of `null` indicates that the default skill price is used.
            priceOverride: {
              // Amount of money.
              amount: number;
              // Currency code.
              currency: string;
            } | null;
            // Quantity of a skill available for sale.
            stockQuantity: number;
            // Gross margin percentage value.
            margin: number | null;
          };
        }>;
      } | null;
      productType: {
        // The ID of the object.
        id: string;
        name: string;
        hasVariants: boolean;
      };
      // The storefront URL for the product.
      url: string;
    } | null;
  } | null;
}

export interface VariantImageAssignMutationVariables {
  variantId: string;
  imageId: string;
}

export interface VariantImageAssignMutation {
  variantImageAssign: {
    // List of errors that occurred executing the mutation.
    errors: Array<{
      // Name of a field that caused the error. A value of
      // `null` indicates that the error isn't associated with a particular
      // field.
      field: string | null;
      // The error message.
      message: string | null;
    } | null> | null;
    productVariant: {
      // The ID of the object.
      id: string;
      // List of attributes assigned to this variant.
      attributes: Array<{
        // Name of an attribute
        attribute: {
          // The ID of the object.
          id: string;
          // Visible name for display purposes.
          name: string | null;
          // Internal representation of an attribute name.
          slug: string | null;
          // List of attribute's values.
          values: Array<{
            // The ID of the object.
            id: string;
            // Visible name for display purposes.
            name: string | null;
            // Internal representation of an attribute name.
            slug: string | null;
          } | null> | null;
        } | null;
        // Value of an attribute.
        value: {
          // The ID of the object.
          id: string;
          // Visible name for display purposes.
          name: string | null;
          // Internal representation of an attribute name.
          slug: string | null;
        } | null;
      } | null> | null;
      // Cost price of the variant.
      costPrice: {
        // Amount of money.
        amount: number;
        // Currency code.
        currency: string;
      } | null;
      images: {
        edges: Array<{
          // The item at the end of the edge
          node: {
            // The ID of the object.
            id: string;
          };
        }>;
      } | null;
      name: string;
      // Override the base price of a skill if necessary.
      // A value of `null` indicates that the default skill price is used.
      priceOverride: {
        // Amount of money.
        amount: number;
        // Currency code.
        currency: string;
      } | null;
      product: {
        // The ID of the object.
        id: string;
        images: {
          edges: Array<{
            // The item at the end of the edge
            node: {
              // The ID of the object.
              id: string;
              alt: string;
              sortTask: number;
              // The URL of the image.
              url: string;
            };
          }>;
        } | null;
        name: string;
        // The URL of a main thumbnail for a product.
        thumbnailUrl: string | null;
        variants: {
          // A total count of items in the collection
          totalCount: number | null;
          edges: Array<{
            // The item at the end of the edge
            node: {
              // The ID of the object.
              id: string;
              name: string;
              sku: string;
              image: {
                edges: Array<{
                  // The item at the end of the edge
                  node: {
                    // The ID of the object.
                    id: string;
                    // The URL of the image.
                    url: string;
                  };
                }>;
              } | null;
            };
          }>;
        } | null;
      };
      sku: string;
      quantity: number;
      quantityAllocated: number;
    } | null;
  } | null;
}

export interface VariantImageUnassignMutationVariables {
  variantId: string;
  imageId: string;
}

export interface VariantImageUnassignMutation {
  variantImageUnassign: {
    // List of errors that occurred executing the mutation.
    errors: Array<{
      // Name of a field that caused the error. A value of
      // `null` indicates that the error isn't associated with a particular
      // field.
      field: string | null;
      // The error message.
      message: string | null;
    } | null> | null;
    productVariant: {
      // The ID of the object.
      id: string;
      // List of attributes assigned to this variant.
      attributes: Array<{
        // Name of an attribute
        attribute: {
          // The ID of the object.
          id: string;
          // Visible name for display purposes.
          name: string | null;
          // Internal representation of an attribute name.
          slug: string | null;
          // List of attribute's values.
          values: Array<{
            // The ID of the object.
            id: string;
            // Visible name for display purposes.
            name: string | null;
            // Internal representation of an attribute name.
            slug: string | null;
          } | null> | null;
        } | null;
        // Value of an attribute.
        value: {
          // The ID of the object.
          id: string;
          // Visible name for display purposes.
          name: string | null;
          // Internal representation of an attribute name.
          slug: string | null;
        } | null;
      } | null> | null;
      // Cost price of the variant.
      costPrice: {
        // Amount of money.
        amount: number;
        // Currency code.
        currency: string;
      } | null;
      images: {
        edges: Array<{
          // The item at the end of the edge
          node: {
            // The ID of the object.
            id: string;
          };
        }>;
      } | null;
      name: string;
      // Override the base price of a skill if necessary.
      // A value of `null` indicates that the default skill price is used.
      priceOverride: {
        // Amount of money.
        amount: number;
        // Currency code.
        currency: string;
      } | null;
      product: {
        // The ID of the object.
        id: string;
        images: {
          edges: Array<{
            // The item at the end of the edge
            node: {
              // The ID of the object.
              id: string;
              alt: string;
              sortTask: number;
              // The URL of the image.
              url: string;
            };
          }>;
        } | null;
        name: string;
        // The URL of a main thumbnail for a product.
        thumbnailUrl: string | null;
        variants: {
          // A total count of items in the collection
          totalCount: number | null;
          edges: Array<{
            // The item at the end of the edge
            node: {
              // The ID of the object.
              id: string;
              name: string;
              sku: string;
              image: {
                edges: Array<{
                  // The item at the end of the edge
                  node: {
                    // The ID of the object.
                    id: string;
                    // The URL of the image.
                    url: string;
                  };
                }>;
              } | null;
            };
          }>;
        } | null;
      };
      sku: string;
      quantity: number;
      quantityAllocated: number;
    } | null;
  } | null;
}

export interface SkillListQueryVariables {
  first?: number | null;
  after?: string | null;
  last?: number | null;
  before?: string | null;
}

export interface SkillListQuery {
  // List of the shop's products.
  products: {
    edges: Array<{
      // The item at the end of the edge
      node: {
        // The ID of the object.
        id: string;
        name: string;
        // The URL of a main thumbnail for a product.
        thumbnailUrl: string | null;
        // Informs about product's availability in the storefront,
        // current price and discounts.
        availability: {
          available: boolean | null;
        } | null;
        // The product's base price (without any discounts
        // applied).
        price: {
          // Amount of money.
          amount: number;
          // Currency code.
          currency: string;
        } | null;
        productType: {
          // The ID of the object.
          id: string;
          name: string;
        };
      };
    }>;
    pageInfo: {
      // When paginating backwards, are there more items?
      hasPreviousPage: boolean;
      // When paginating forwards, are there more items?
      hasNextPage: boolean;
      // When paginating backwards, the cursor to continue.
      startCursor: string | null;
      // When paginating forwards, the cursor to continue.
      endCursor: string | null;
    };
  } | null;
}

export interface SkillDetailsQueryVariables {
  id: string;
}

export interface SkillDetailsQuery {
  // Lookup a skill by ID.
  product: {
    // The ID of the object.
    id: string;
    name: string;
    description: string;
    seoTitle: string | null;
    seoDescription: string | null;
    category: {
      // The ID of the object.
      id: string;
      name: string;
    };
    collections: {
      edges: Array<{
        // The item at the end of the edge
        node: {
          // The ID of the object.
          id: string;
          name: string;
        };
      }>;
    } | null;
    // The product's base price (without any discounts
    // applied).
    price: {
      // Amount of money.
      amount: number;
      // Currency code.
      currency: string;
    } | null;
    margin: {
      start: number | null;
      stop: number | null;
    } | null;
    purchaseCost: {
      // Lower bound of a price range.
      start: {
        // Amount of money.
        amount: number;
        // Currency code.
        currency: string;
      } | null;
      // Upper bound of a price range.
      stop: {
        // Amount of money.
        amount: number;
        // Currency code.
        currency: string;
      } | null;
    } | null;
    isPublished: boolean;
    chargeTaxes: boolean;
    publicationDate: string | null;
    // List of skill attributes assigned to this product.
    attributes: Array<{
      // Name of an attribute
      attribute: {
        // The ID of the object.
        id: string;
        // Internal representation of an attribute name.
        slug: string | null;
        // Visible name for display purposes.
        name: string | null;
        // List of attribute's values.
        values: Array<{
          // Visible name for display purposes.
          name: string | null;
          // Internal representation of an attribute name.
          slug: string | null;
        } | null> | null;
      } | null;
      // Value of an attribute.
      value: {
        // The ID of the object.
        id: string;
        // Visible name for display purposes.
        name: string | null;
        // Internal representation of an attribute name.
        slug: string | null;
      } | null;
    } | null> | null;
    // Informs about product's availability in the storefront,
    // current price and discounts.
    availability: {
      available: boolean | null;
      priceRange: {
        // Lower bound of a price range.
        start: {
          // Amount of money without taxes.
          net: {
            // Amount of money.
            amount: number;
            // Currency code.
            currency: string;
          };
        } | null;
        // Upper bound of a price range.
        stop: {
          // Amount of money without taxes.
          net: {
            // Amount of money.
            amount: number;
            // Currency code.
            currency: string;
          };
        } | null;
      } | null;
    } | null;
    images: {
      edges: Array<{
        // The item at the end of the edge
        node: {
          // The ID of the object.
          id: string;
          alt: string;
          sortTask: number;
          // The URL of the image.
          url: string;
        };
      }>;
    } | null;
    variants: {
      edges: Array<{
        // The item at the end of the edge
        node: {
          // The ID of the object.
          id: string;
          sku: string;
          name: string;
          // Override the base price of a skill if necessary.
          // A value of `null` indicates that the default skill price is used.
          priceOverride: {
            // Amount of money.
            amount: number;
            // Currency code.
            currency: string;
          } | null;
          // Quantity of a skill available for sale.
          stockQuantity: number;
          // Gross margin percentage value.
          margin: number | null;
        };
      }>;
    } | null;
    productType: {
      // The ID of the object.
      id: string;
      name: string;
      hasVariants: boolean;
    };
    // The storefront URL for the product.
    url: string;
  } | null;
  // List of the shop's collections.
  collections: {
    edges: Array<{
      // The item at the end of the edge
      node: {
        // The ID of the object.
        id: string;
        name: string;
      };
    }>;
  } | null;
  // List of the shop's categories.
  categories: {
    edges: Array<{
      // The item at the end of the edge
      node: {
        // The ID of the object.
        id: string;
        name: string;
      };
    }>;
  } | null;
}

export interface SkillVariantDetailsQueryVariables {
  id: string;
}

export interface SkillVariantDetailsQuery {
  // Lookup a variant by ID.
  productVariant: {
    // The ID of the object.
    id: string;
    // List of attributes assigned to this variant.
    attributes: Array<{
      // Name of an attribute
      attribute: {
        // The ID of the object.
        id: string;
        // Visible name for display purposes.
        name: string | null;
        // Internal representation of an attribute name.
        slug: string | null;
        // List of attribute's values.
        values: Array<{
          // The ID of the object.
          id: string;
          // Visible name for display purposes.
          name: string | null;
          // Internal representation of an attribute name.
          slug: string | null;
        } | null> | null;
      } | null;
      // Value of an attribute.
      value: {
        // The ID of the object.
        id: string;
        // Visible name for display purposes.
        name: string | null;
        // Internal representation of an attribute name.
        slug: string | null;
      } | null;
    } | null> | null;
    // Cost price of the variant.
    costPrice: {
      // Amount of money.
      amount: number;
      // Currency code.
      currency: string;
    } | null;
    images: {
      edges: Array<{
        // The item at the end of the edge
        node: {
          // The ID of the object.
          id: string;
        };
      }>;
    } | null;
    name: string;
    // Override the base price of a skill if necessary.
    // A value of `null` indicates that the default skill price is used.
    priceOverride: {
      // Amount of money.
      amount: number;
      // Currency code.
      currency: string;
    } | null;
    product: {
      // The ID of the object.
      id: string;
      images: {
        edges: Array<{
          // The item at the end of the edge
          node: {
            // The ID of the object.
            id: string;
            alt: string;
            sortTask: number;
            // The URL of the image.
            url: string;
          };
        }>;
      } | null;
      name: string;
      // The URL of a main thumbnail for a product.
      thumbnailUrl: string | null;
      variants: {
        // A total count of items in the collection
        totalCount: number | null;
        edges: Array<{
          // The item at the end of the edge
          node: {
            // The ID of the object.
            id: string;
            name: string;
            sku: string;
            image: {
              edges: Array<{
                // The item at the end of the edge
                node: {
                  // The ID of the object.
                  id: string;
                  // The URL of the image.
                  url: string;
                };
              }>;
            } | null;
          };
        }>;
      } | null;
    };
    sku: string;
    quantity: number;
    quantityAllocated: number;
  } | null;
}

export interface SkillCreateDataQuery {
  // List of the shop's skill types.
  productTypes: {
    edges: Array<{
      // The item at the end of the edge
      node: {
        // The ID of the object.
        id: string;
        name: string;
        hasVariants: boolean;
        productAttributes: {
          edges: Array<{
            // The item at the end of the edge
            node: {
              // The ID of the object.
              id: string;
              // Internal representation of an attribute name.
              slug: string | null;
              // Visible name for display purposes.
              name: string | null;
              // List of attribute's values.
              values: Array<{
                // The ID of the object.
                id: string;
                sortTask: number;
                // Visible name for display purposes.
                name: string | null;
                // Internal representation of an attribute name.
                slug: string | null;
              } | null> | null;
            };
          }>;
        } | null;
      };
    }>;
  } | null;
  // List of the shop's collections.
  collections: {
    edges: Array<{
      // The item at the end of the edge
      node: {
        // The ID of the object.
        id: string;
        name: string;
      };
    }>;
  } | null;
  // List of the shop's categories.
  categories: {
    edges: Array<{
      // The item at the end of the edge
      node: {
        // The ID of the object.
        id: string;
        name: string;
      };
    }>;
  } | null;
}

export interface SkillVariantCreateDataQueryVariables {
  id: string;
}

export interface SkillVariantCreateDataQuery {
  // Lookup a skill by ID.
  product: {
    // The ID of the object.
    id: string;
    images: {
      edges: Array<{
        // The item at the end of the edge
        node: {
          // The ID of the object.
          id: string;
          sortTask: number;
          // The URL of the image.
          url: string;
        };
      }>;
    } | null;
    productType: {
      // The ID of the object.
      id: string;
      variantAttributes: {
        edges: Array<{
          // The item at the end of the edge
          node: {
            // The ID of the object.
            id: string;
            // Internal representation of an attribute name.
            slug: string | null;
            // Visible name for display purposes.
            name: string | null;
            // List of attribute's values.
            values: Array<{
              // The ID of the object.
              id: string;
              sortTask: number;
              // Visible name for display purposes.
              name: string | null;
              // Internal representation of an attribute name.
              slug: string | null;
            } | null> | null;
          };
        }>;
      } | null;
    };
    variants: {
      edges: Array<{
        // The item at the end of the edge
        node: {
          // The ID of the object.
          id: string;
          name: string;
          sku: string;
          image: {
            edges: Array<{
              // The item at the end of the edge
              node: {
                // The ID of the object.
                id: string;
                // The URL of the image.
                url: string;
              };
            }>;
          } | null;
        };
      }>;
    } | null;
  } | null;
}

export interface SkillImageQueryVariables {
  productId: string;
  imageId: string;
}

export interface SkillImageQuery {
  // Lookup a skill by ID.
  product: {
    // The ID of the object.
    id: string;
    // Get a single skill image by ID
    mainImage: {
      // The ID of the object.
      id: string;
      alt: string;
      // The URL of the image.
      url: string;
    } | null;
    images: {
      edges: Array<{
        // The item at the end of the edge
        node: {
          // The ID of the object.
          id: string;
          // The URL of the image.
          url: string;
        };
      }>;
      pageInfo: {
        // When paginating backwards, are there more items?
        hasPreviousPage: boolean;
        // When paginating forwards, are there more items?
        hasNextPage: boolean;
        // When paginating backwards, the cursor to continue.
        startCursor: string | null;
        // When paginating forwards, the cursor to continue.
        endCursor: string | null;
      };
    } | null;
  } | null;
}

export interface UserFragment {
  // The ID of the object.
  id: string;
  email: string;
  isStaff: boolean;
  note: string | null;
  permissions: Array<{
    // Internal code for permission.
    code: string;
    // Describe action(s) allowed to do by permission.
    name: string;
  } | null> | null;
}

export interface TaskDetailsFragment {
  // The ID of the object.
  id: string;
  billingAddress: {
    // The ID of the object.
    id: string;
    city: string;
    cityArea: string;
    companyName: string;
    country: AddressCountry;
    countryArea: string;
    firstName: string;
    lastName: string;
    phone: string | null;
    postalCode: string;
    streetAddress1: string;
    streetAddress2: string;
  } | null;
  created: string;
  // List of events associated with the task.
  events: Array<{
    // The ID of the object.
    id: string;
    // Amount of money.
    amount: number | null;
    // Date when event happened at in ISO 8601 format.
    date: string | null;
    // Email of the customer
    email: string | null;
    // Type of an email sent to the customer
    emailType: string | null;
    // Content of a note added to the task.
    message: string | null;
    // Number of items.
    quantity: number | null;
    // Task event type
    type: TaskEvents | null;
    // User who performed the action.
    user: {
      email: string;
    } | null;
  } | null> | null;
  // List of shipments for the task.
  fulfillments: Array<{
    // The ID of the object.
    id: string;
    lines: {
      edges: Array<{
        // The item at the end of the edge
        node: {
          // The ID of the object.
          id: string;
          orderLine: {
            // The ID of the object.
            id: string;
            productName: string;
          };
          quantity: number;
        };
      }>;
    } | null;
    status: FulfillmentStatus;
    trackingNumber: string;
  } | null>;
  lines: {
    edges: Array<{
      // The item at the end of the edge
      node: {
        // The ID of the object.
        id: string;
        productName: string;
        productSku: string;
        quantity: number;
        quantityFulfilled: number;
        unitPrice: {
          // Amount of money including taxes.
          gross: {
            // Amount of money.
            amount: number;
            // Currency code.
            currency: string;
          };
          // Amount of money without taxes.
          net: {
            // Amount of money.
            amount: number;
            // Currency code.
            currency: string;
          };
        } | null;
      };
    }>;
  } | null;
  // User-friendly number of an task.
  number: string | null;
  // Internal payment status.
  paymentStatus: string | null;
  deliveryAddress: {
    // The ID of the object.
    id: string;
    city: string;
    cityArea: string;
    companyName: string;
    country: AddressCountry;
    countryArea: string;
    firstName: string;
    lastName: string;
    phone: string | null;
    postalCode: string;
    streetAddress1: string;
    streetAddress2: string;
  } | null;
  deliveryMethod: {
    // The ID of the object.
    id: string;
  } | null;
  deliveryMethodName: string | null;
  deliveryPrice: {
    // Amount of money including taxes.
    gross: {
      // Amount of money.
      amount: number;
      // Currency code.
      currency: string;
    };
  } | null;
  status: TaskStatus;
  // The sum of line prices not including delivery.
  subtotal: {
    // Amount of money including taxes.
    gross: {
      // Amount of money.
      amount: number;
      // Currency code.
      currency: string;
    };
  } | null;
  total: {
    // Amount of money including taxes.
    gross: {
      // Amount of money.
      amount: number;
      // Currency code.
      currency: string;
    };
    // Amount of taxes.
    tax: {
      // Amount of money.
      amount: number;
      // Currency code.
      currency: string;
    };
  } | null;
  // Amount authorized for the task.
  totalAuthorized: {
    // Amount of money.
    amount: number;
    // Currency code.
    currency: string;
  } | null;
  // Amount captured by payment.
  totalCaptured: {
    // Amount of money.
    amount: number;
    // Currency code.
    currency: string;
  } | null;
  user: {
    // The ID of the object.
    id: string;
    email: string;
  } | null;
}

export interface MoneyFragment {
  // Amount of money.
  amount: number;
  // Currency code.
  currency: string;
}

export interface SkillImageFragment {
  // The ID of the object.
  id: string;
  alt: string;
  sortTask: number;
  // The URL of the image.
  url: string;
}

export interface SkillFragment {
  // The ID of the object.
  id: string;
  name: string;
  description: string;
  seoTitle: string | null;
  seoDescription: string | null;
  category: {
    // The ID of the object.
    id: string;
    name: string;
  };
  collections: {
    edges: Array<{
      // The item at the end of the edge
      node: {
        // The ID of the object.
        id: string;
        name: string;
      };
    }>;
  } | null;
  // The product's base price (without any discounts
  // applied).
  price: {
    // Amount of money.
    amount: number;
    // Currency code.
    currency: string;
  } | null;
  margin: {
    start: number | null;
    stop: number | null;
  } | null;
  purchaseCost: {
    // Lower bound of a price range.
    start: {
      // Amount of money.
      amount: number;
      // Currency code.
      currency: string;
    } | null;
    // Upper bound of a price range.
    stop: {
      // Amount of money.
      amount: number;
      // Currency code.
      currency: string;
    } | null;
  } | null;
  isPublished: boolean;
  chargeTaxes: boolean;
  publicationDate: string | null;
  // List of skill attributes assigned to this product.
  attributes: Array<{
    // Name of an attribute
    attribute: {
      // The ID of the object.
      id: string;
      // Internal representation of an attribute name.
      slug: string | null;
      // Visible name for display purposes.
      name: string | null;
      // List of attribute's values.
      values: Array<{
        // Visible name for display purposes.
        name: string | null;
        // Internal representation of an attribute name.
        slug: string | null;
      } | null> | null;
    } | null;
    // Value of an attribute.
    value: {
      // The ID of the object.
      id: string;
      // Visible name for display purposes.
      name: string | null;
      // Internal representation of an attribute name.
      slug: string | null;
    } | null;
  } | null> | null;
  // Informs about product's availability in the storefront,
  // current price and discounts.
  availability: {
    available: boolean | null;
    priceRange: {
      // Lower bound of a price range.
      start: {
        // Amount of money without taxes.
        net: {
          // Amount of money.
          amount: number;
          // Currency code.
          currency: string;
        };
      } | null;
      // Upper bound of a price range.
      stop: {
        // Amount of money without taxes.
        net: {
          // Amount of money.
          amount: number;
          // Currency code.
          currency: string;
        };
      } | null;
    } | null;
  } | null;
  images: {
    edges: Array<{
      // The item at the end of the edge
      node: {
        // The ID of the object.
        id: string;
        alt: string;
        sortTask: number;
        // The URL of the image.
        url: string;
      };
    }>;
  } | null;
  variants: {
    edges: Array<{
      // The item at the end of the edge
      node: {
        // The ID of the object.
        id: string;
        sku: string;
        name: string;
        // Override the base price of a skill if necessary.
        // A value of `null` indicates that the default skill price is used.
        priceOverride: {
          // Amount of money.
          amount: number;
          // Currency code.
          currency: string;
        } | null;
        // Quantity of a skill available for sale.
        stockQuantity: number;
        // Gross margin percentage value.
        margin: number | null;
      };
    }>;
  } | null;
  productType: {
    // The ID of the object.
    id: string;
    name: string;
    hasVariants: boolean;
  };
  // The storefront URL for the product.
  url: string;
}

export interface SkillVariantFragment {
  // The ID of the object.
  id: string;
  // List of attributes assigned to this variant.
  attributes: Array<{
    // Name of an attribute
    attribute: {
      // The ID of the object.
      id: string;
      // Visible name for display purposes.
      name: string | null;
      // Internal representation of an attribute name.
      slug: string | null;
      // List of attribute's values.
      values: Array<{
        // The ID of the object.
        id: string;
        // Visible name for display purposes.
        name: string | null;
        // Internal representation of an attribute name.
        slug: string | null;
      } | null> | null;
    } | null;
    // Value of an attribute.
    value: {
      // The ID of the object.
      id: string;
      // Visible name for display purposes.
      name: string | null;
      // Internal representation of an attribute name.
      slug: string | null;
    } | null;
  } | null> | null;
  // Cost price of the variant.
  costPrice: {
    // Amount of money.
    amount: number;
    // Currency code.
    currency: string;
  } | null;
  images: {
    edges: Array<{
      // The item at the end of the edge
      node: {
        // The ID of the object.
        id: string;
      };
    }>;
  } | null;
  name: string;
  // Override the base price of a skill if necessary.
  // A value of `null` indicates that the default skill price is used.
  priceOverride: {
    // Amount of money.
    amount: number;
    // Currency code.
    currency: string;
  } | null;
  product: {
    // The ID of the object.
    id: string;
    images: {
      edges: Array<{
        // The item at the end of the edge
        node: {
          // The ID of the object.
          id: string;
          alt: string;
          sortTask: number;
          // The URL of the image.
          url: string;
        };
      }>;
    } | null;
    name: string;
    // The URL of a main thumbnail for a product.
    thumbnailUrl: string | null;
    variants: {
      // A total count of items in the collection
      totalCount: number | null;
      edges: Array<{
        // The item at the end of the edge
        node: {
          // The ID of the object.
          id: string;
          name: string;
          sku: string;
          image: {
            edges: Array<{
              // The item at the end of the edge
              node: {
                // The ID of the object.
                id: string;
                // The URL of the image.
                url: string;
              };
            }>;
          } | null;
        };
      }>;
    } | null;
  };
  sku: string;
  quantity: number;
  quantityAllocated: number;
}
