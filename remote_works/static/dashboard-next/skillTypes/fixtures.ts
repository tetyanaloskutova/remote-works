import {
  SkillCreateData_productTypes_edges_node,
  SkillCreateData_productTypes_edges_node_productAttributes
} from "../products/types/SkillCreateData";
import { TaxRateType } from "../types/globalTypes";
import { SkillTypeDetails_productType } from "./types/SkillTypeDetails";
import { SkillTypeList_productTypes_edges_node } from "./types/SkillTypeList";

export const attributes: SkillCreateData_productTypes_edges_node_productAttributes[] = [
  {
    node: {
      __typename: "Attribute" as "Attribute",
      id: "UHJvZHVjdEF0dHJpYnV0ZTo5",
      name: "Author",
      slug: "author",
      values: [
        {
          __typename: "AttributeValue" as "AttributeValue",
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjI0",
          name: "John Doe",
          slug: "john-doe",
          sortTask: 0,
          type: "STRING",
          value: ""
        },
        {
          __typename: "AttributeValue" as "AttributeValue",
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjI1",
          name: "Milionare Pirate",
          slug: "milionare-pirate",
          sortTask: 1,
          type: "STRING",
          value: ""
        }
      ]
    }
  },
  {
    node: {
      __typename: "Attribute" as "Attribute",
      id: "UHJvZHVjdEF0dHJpYnV0ZTo2",
      name: "Box Size",
      slug: "box-size",
      values: [
        {
          __typename: "AttributeValue" as "AttributeValue",
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjE1",
          name: "100g",
          slug: "100g",
          sortTask: 0,
          type: "STRING",
          value: ""
        },
        {
          __typename: "AttributeValue" as "AttributeValue",
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjE2",
          name: "250g",
          slug: "250g",
          sortTask: 1,
          type: "STRING",
          value: ""
        },
        {
          __typename: "AttributeValue" as "AttributeValue",
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjE3",
          name: "500g",
          slug: "500g",
          sortTask: 2,
          type: "STRING",
          value: ""
        },
        {
          __typename: "AttributeValue" as "AttributeValue",
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjE4",
          name: "1kg",
          slug: "1kg",
          sortTask: 3,
          type: "STRING",
          value: ""
        }
      ]
    }
  },
  {
    node: {
      __typename: "Attribute" as "Attribute",
      id: "UHJvZHVjdEF0dHJpYnV0ZToz",
      name: "Brand",
      slug: "brand",
      values: [
        {
          __typename: "AttributeValue" as "AttributeValue",
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjY=",
          name: "Saleor",
          slug: "saleor",
          sortTask: 0,
          type: "STRING",
          value: ""
        }
      ]
    }
  },
  {
    node: {
      __typename: "Attribute" as "Attribute",
      id: "UHJvZHVjdEF0dHJpYnV0ZTo4",
      name: "Candy Box Size",
      slug: "candy-box-size",
      values: [
        {
          __typename: "AttributeValue" as "AttributeValue",
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjIx",
          name: "100g",
          slug: "100g",
          sortTask: 0,
          type: "STRING",
          value: ""
        },
        {
          __typename: "AttributeValue" as "AttributeValue",
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjIy",
          name: "250g",
          slug: "250g",
          sortTask: 1,
          type: "STRING",
          value: ""
        },
        {
          __typename: "AttributeValue" as "AttributeValue",
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjIz",
          name: "500g",
          slug: "500g",
          sortTask: 2,
          type: "STRING",
          value: ""
        }
      ]
    }
  },
  {
    node: {
      __typename: "Attribute" as "Attribute",
      id: "UHJvZHVjdEF0dHJpYnV0ZTo1",
      name: "Coffee Genre",
      slug: "coffee-genre",
      values: [
        {
          __typename: "AttributeValue" as "AttributeValue",
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjEz",
          name: "Arabica",
          slug: "arabica",
          sortTask: 0,
          type: "STRING",
          value: ""
        },
        {
          __typename: "AttributeValue" as "AttributeValue",
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjE0",
          name: "Robusta",
          slug: "robusta",
          sortTask: 1,
          type: "STRING",
          value: ""
        }
      ]
    }
  },
  {
    node: {
      __typename: "Attribute" as "Attribute",
      id: "UHJvZHVjdEF0dHJpYnV0ZToy",
      name: "Collar",
      slug: "collar",
      values: [
        {
          __typename: "AttributeValue" as "AttributeValue",
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjM=",
          name: "Round",
          slug: "round",
          sortTask: 0,
          type: "STRING",
          value: ""
        },
        {
          __typename: "AttributeValue" as "AttributeValue",
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjQ=",
          name: "V-Neck",
          slug: "v-neck",
          sortTask: 1,
          type: "STRING",
          value: ""
        },
        {
          __typename: "AttributeValue" as "AttributeValue",
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjU=",
          name: "Polo",
          slug: "polo",
          sortTask: 2,
          type: "STRING",
          value: ""
        }
      ]
    }
  },
  {
    node: {
      __typename: "Attribute" as "Attribute",
      id: "UHJvZHVjdEF0dHJpYnV0ZTox",
      name: "Color",
      slug: "color",
      values: [
        {
          __typename: "AttributeValue" as "AttributeValue",
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjE=",
          name: "Blue",
          slug: "blue",
          sortTask: 0,
          type: "STRING",
          value: ""
        },
        {
          __typename: "AttributeValue" as "AttributeValue",
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjI=",
          name: "White",
          slug: "white",
          sortTask: 1,
          type: "STRING",
          value: ""
        }
      ]
    }
  },
  {
    node: {
      __typename: "Attribute" as "Attribute",
      id: "UHJvZHVjdEF0dHJpYnV0ZToxMg==",
      name: "Cover",
      slug: "cover",
      values: [
        {
          __typename: "AttributeValue" as "AttributeValue",
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjMw",
          name: "Soft",
          slug: "soft",
          sortTask: 0,
          type: "STRING",
          value: ""
        },
        {
          __typename: "AttributeValue" as "AttributeValue",
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjMx",
          name: "Hard",
          slug: "hard",
          sortTask: 1,
          type: "STRING",
          value: ""
        },
        {
          __typename: "AttributeValue" as "AttributeValue",
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjMy",
          name: "Middle soft",
          slug: "middle-soft",
          sortTask: 2,
          type: "STRING",
          value: ""
        },
        {
          __typename: "AttributeValue" as "AttributeValue",
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjMz",
          name: "Middle hard",
          slug: "middle-hard",
          sortTask: 3,
          type: "STRING",
          value: ""
        },
        {
          __typename: "AttributeValue" as "AttributeValue",
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjM0",
          name: "Middle",
          slug: "middle",
          sortTask: 4,
          type: "STRING",
          value: ""
        },
        {
          __typename: "AttributeValue" as "AttributeValue",
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjM1",
          name: "Very hard",
          slug: "very-hard",
          sortTask: 5,
          type: "STRING",
          value: ""
        }
      ]
    }
  },
  {
    node: {
      __typename: "Attribute" as "Attribute",
      id: "UHJvZHVjdEF0dHJpYnV0ZTo3",
      name: "Flavor",
      slug: "flavor",
      values: [
        {
          __typename: "AttributeValue" as "AttributeValue",
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjE5",
          name: "Sour",
          slug: "sour",
          sortTask: 0,
          type: "STRING",
          value: ""
        },
        {
          __typename: "AttributeValue" as "AttributeValue",
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjIw",
          name: "Sweet",
          slug: "sweet",
          sortTask: 1,
          type: "STRING",
          value: ""
        }
      ]
    }
  },
  {
    node: {
      __typename: "Attribute" as "Attribute",
      id: "UHJvZHVjdEF0dHJpYnV0ZToxMQ==",
      name: "Language",
      slug: "language",
      values: [
        {
          __typename: "AttributeValue" as "AttributeValue",
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjI4",
          name: "English",
          slug: "english",
          sortTask: 0,
          type: "STRING",
          value: ""
        },
        {
          __typename: "AttributeValue" as "AttributeValue",
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjI5",
          name: "Pirate",
          slug: "pirate",
          sortTask: 1,
          type: "STRING",
          value: ""
        }
      ]
    }
  },
  {
    node: {
      __typename: "Attribute" as "Attribute",
      id: "UHJvZHVjdEF0dHJpYnV0ZToxMA==",
      name: "Publisher",
      slug: "publisher",
      values: [
        {
          __typename: "AttributeValue" as "AttributeValue",
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjI2",
          name: "Mirumee Press",
          slug: "mirumee-press",
          sortTask: 0,
          type: "STRING",
          value: ""
        },
        {
          __typename: "AttributeValue" as "AttributeValue",
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjI3",
          name: "Saleor Publishing",
          slug: "saleor-publishing",
          sortTask: 1,
          type: "STRING",
          value: ""
        }
      ]
    }
  },
  {
    node: {
      __typename: "Attribute" as "Attribute",
      id: "UHJvZHVjdEF0dHJpYnV0ZTo0",
      name: "Size",
      slug: "size",
      values: [
        {
          __typename: "AttributeValue" as "AttributeValue",
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjc=",
          name: "XS",
          slug: "xs",
          sortTask: 0,
          type: "STRING",
          value: ""
        },
        {
          __typename: "AttributeValue" as "AttributeValue",
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjg=",
          name: "S",
          slug: "s",
          sortTask: 1,
          type: "STRING",
          value: ""
        },
        {
          __typename: "AttributeValue" as "AttributeValue",
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjk=",
          name: "M",
          slug: "m",
          sortTask: 2,
          type: "STRING",
          value: ""
        },
        {
          __typename: "AttributeValue" as "AttributeValue",
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjEw",
          name: "L",
          slug: "l",
          sortTask: 3,
          type: "STRING",
          value: ""
        },
        {
          __typename: "AttributeValue" as "AttributeValue",
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjEx",
          name: "XL",
          slug: "xl",
          sortTask: 4,
          type: "STRING",
          value: ""
        },
        {
          __typename: "AttributeValue" as "AttributeValue",
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjEy",
          name: "XXL",
          slug: "xxl",
          sortTask: 5,
          type: "STRING",
          value: ""
        }
      ]
    }
  }
].map(edge => edge.node);

export const productTypes: Array<
  SkillCreateData_productTypes_edges_node &
    SkillTypeList_productTypes_edges_node
> = [
  {
    __typename: "SkillType" as "SkillType",
    hasVariants: true,
    id: "UHJvZHVjdFR5cGU6NA==",
    isDeliveryRequired: true,
    name: "Candy",
    productAttributes: [attributes[0]],
    taxRate: "FOODSTUFFS" as TaxRateType,
    variantAttributes: [attributes[1], attributes[2]]
  },
  {
    __typename: "SkillType" as "SkillType",
    hasVariants: false,
    id: "UHJvZHVjdFR5cGU6NQ==",
    isDeliveryRequired: false,
    name: "E-books",
    productAttributes: [attributes[5]],
    taxRate: "STANDARD" as TaxRateType,
    variantAttributes: [attributes[0], attributes[3]]
  },
  {
    __typename: "SkillType" as "SkillType",
    hasVariants: false,
    id: "UHJvZHVjdFR5cGU6Mg==",
    isDeliveryRequired: true,
    name: "Mugs",
    productAttributes: [attributes[7]],
    taxRate: "STANDARD" as TaxRateType,
    variantAttributes: [attributes[2], attributes[5]]
  },
  {
    __typename: "SkillType" as "SkillType",
    hasVariants: true,
    id: "UHJvZHVjdFR5cGU6Mw==",
    isDeliveryRequired: true,
    name: "Coffee",
    productAttributes: [attributes[8]],
    taxRate: "STANDARD" as TaxRateType,
    variantAttributes: [attributes[1], attributes[4]]
  },
  {
    __typename: "SkillType" as "SkillType",
    hasVariants: true,
    id: "UHJvZHVjdFR5cGU6MQ==",
    isDeliveryRequired: true,
    name: "T-Shirt",
    productAttributes: [attributes[4]],
    taxRate: "STANDARD" as TaxRateType,
    variantAttributes: [attributes[1], attributes[6]]
  }
].map(productType => ({
  __typename: "SkillType" as "SkillType",
  ...productType
}));
export const productType: SkillTypeDetails_productType = {
  __typename: "SkillType" as "SkillType",
  hasVariants: false,
  id: "UHJvZHVjdFR5cGU6NQ==",
  isDeliveryRequired: false,
  name: "E-books",
  productAttributes: [
    {
      __typename: "Attribute" as "Attribute",
      id: "UHJvZHVjdEF0dHJpYnV0ZTo5",
      name: "Author",
      slug: "author",
      values: [
        {
          __typename: "AttributeValue" as "AttributeValue",
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjI0",
          name: "John Doe",
          slug: "john-doe"
        },
        {
          __typename: "AttributeValue" as "AttributeValue",
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjI1",
          name: "Milionare Pirate",
          slug: "milionare-pirate"
        }
      ]
    },
    {
      __typename: "Attribute" as "Attribute",
      id: "UHJvZHVjdEF0dHJpYnV0ZToxMQ==",
      name: "Language",
      slug: "language",
      values: [
        {
          __typename: "AttributeValue" as "AttributeValue",
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjI4",
          name: "English",
          slug: "english"
        },
        {
          __typename: "AttributeValue" as "AttributeValue",
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjI5",
          name: "Pirate",
          slug: "pirate"
        }
      ]
    },
    {
      __typename: "Attribute" as "Attribute",
      id: "UHJvZHVjdEF0dHJpYnV0ZToxMA==",
      name: "Publisher",
      slug: "publisher",
      values: [
        {
          __typename: "AttributeValue" as "AttributeValue",
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjI2",
          name: "Mirumee Press",
          slug: "mirumee-press"
        },
        {
          __typename: "AttributeValue" as "AttributeValue",
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjI3",
          name: "Saleor Publishing",
          slug: "saleor-publishing"
        }
      ]
    }
  ],
  taxRate: "STANDARD" as TaxRateType,
  variantAttributes: [],
  weight: {
    __typename: "Weight",
    unit: "kg",
    value: 7.82
  }
};
