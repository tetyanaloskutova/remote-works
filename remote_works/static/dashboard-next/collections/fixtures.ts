import { content } from "../storybook/stories/components/RichTextEditor";
import { CollectionDetails_collection } from "./types/CollectionDetails";
import { CollectionList_collections_edges_node } from "./types/CollectionList";

export const collections: CollectionList_collections_edges_node[] = [
  {
    __typename: "Collection",
    id: "Q29sbGVjdGlvbjox",
    isPublished: true,
    name: "Summer collection",
    skills: {
      __typename: "SkillCountableConnection",
      totalCount: 4
    }
  },
  {
    __typename: "Collection",
    id: "Q29sbGVjdGlvbjoy",
    isPublished: true,
    name: "Winter sale",
    skills: {
      __typename: "SkillCountableConnection",
      totalCount: 4
    }
  }
];
export const collection: (
  placeholderCollectionImage: string,
  placeholderSkillImage: string
) => CollectionDetails_collection = (
  placeholderCollectionImage,
  placeholderImage
) => ({
  __typename: "Collection",
  backgroundImage: {
    __typename: "Image",
    alt: "Alt text",
    url: placeholderCollectionImage
  },
  descriptionJson: JSON.stringify(content),
  id: "Q29sbGVjdGlvbjox",
  isPublished: true,
  name: "Summer collection",
  seoDescription: null,
  seoTitle: null
  skills: {
    __typename: "SkillCountableConnection",
    edges: [
      {
        __typename: "SkillCountableEdge",
        cursor: "YXJyYXljb25uZWN0aW9uOjA=",
        node: {
          __typename: "Skill",
          id: "UHJvZHVjdDoxNw==",
          isPublished: true,
          name: "Murray Inc",
          skillType: {
            __typename: "SkillType",
            id: "UHJvZHVjdFR5cGU6Mg==",
            name: "Mugs"
          },
          thumbnail: { __typename: "Image", url: placeholderImage }
        }
      },
      {
        __typename: "SkillCountableEdge",
        cursor: "YXJyYXljb25uZWN0aW9uOjE=",
        node: {
          __typename: "Skill",
          id: "UHJvZHVjdDoyNw==",
          isPublished: true,
          name: "Williams-Taylor",
          skillType: {
            __typename: "SkillType",
            id: "UHJvZHVjdFR5cGU6Mw==",
            name: "Coffee"
          },
          thumbnail: { __typename: "Image", url: placeholderImage }
        }
      },
      {
        __typename: "SkillCountableEdge",
        cursor: "YXJyYXljb25uZWN0aW9uOjI=",
        node: {
          __typename: "Skill",
          id: "UHJvZHVjdDoyOQ==",
          isPublished: true,
          name: "Hebert-Sherman",
          skillType: {
            __typename: "SkillType",
            id: "UHJvZHVjdFR5cGU6Mw==",
            name: "Coffee"
          },
          thumbnail: { __typename: "Image", url: placeholderImage }
        }
      },
      {
        __typename: "SkillCountableEdge",
        cursor: "YXJyYXljb25uZWN0aW9uOjM=",
        node: {
          __typename: "Skill",
          id: "UHJvZHVjdDo1Mw==",
          isPublished: true,
          name: "Estes, Johnson and Graham",
          skillType: {
            __typename: "SkillType",
            id: "UHJvZHVjdFR5cGU6Ng==",
            name: "Books"
          },
          thumbnail: { __typename: "Image", url: placeholderImage }
        }
      }
    ],
    pageInfo: {
      __typename: "PageInfo",
      endCursor: "",
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: ""
    }
  },
});
