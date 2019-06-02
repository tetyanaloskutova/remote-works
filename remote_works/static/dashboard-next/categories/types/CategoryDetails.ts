/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: CategoryDetails
// ====================================================

export interface CategoryDetails_category_backgroundImage {
  __typename: "Image";
  alt: string | null;
  url: string;
}

export interface CategoryDetails_category_parent {
  __typename: "Category";
  id: string;
}

export interface CategoryDetails_category_children_edges_node_children {
  __typename: "CategoryCountableConnection";
  totalCount: number | null;
}

export interface CategoryDetails_category_children_edges_node_skills {
  __typename: "SkillCountableConnection";
  totalCount: number | null;
}

export interface CategoryDetails_category_children_edges_node {
  __typename: "Category";
  id: string;
  name: string;
  children: CategoryDetails_category_children_edges_node_children | null;
  skills: CategoryDetails_category_children_edges_node_skills | null;
}

export interface CategoryDetails_category_children_edges {
  __typename: "CategoryCountableEdge";
  node: CategoryDetails_category_children_edges_node;
}

export interface CategoryDetails_category_children {
  __typename: "CategoryCountableConnection";
  edges: CategoryDetails_category_children_edges[];
}

export interface CategoryDetails_category_skills_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface CategoryDetails_category_skills_edges_node_availability {
  __typename: "SkillAvailability";
  available: boolean | null;
}

export interface CategoryDetails_category_skills_edges_node_thumbnail {
  __typename: "Image";
  url: string;
}

export interface CategoryDetails_category_skills_edges_node_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface CategoryDetails_category_skills_edges_node_skillType {
  __typename: "SkillType";
  id: string;
  name: string;
}

export interface CategoryDetails_category_skills_edges_node {
  __typename: "Skill";
  id: string;
  name: string;
  availability: CategoryDetails_category_skills_edges_node_availability | null;
  thumbnail: CategoryDetails_category_skills_edges_node_thumbnail | null;
  price: CategoryDetails_category_skills_edges_node_price | null;
  skillType: CategoryDetails_category_skills_edges_node_skillType;
}

export interface CategoryDetails_category_skills_edges {
  __typename: "SkillCountableEdge";
  cursor: string;
  node: CategoryDetails_category_skills_edges_node;
}

export interface CategoryDetails_category_skills {
  __typename: "SkillCountableConnection";
  pageInfo: CategoryDetails_category_skills_pageInfo;
  edges: CategoryDetails_category_skills_edges[];
}

export interface CategoryDetails_category {
  __typename: "Category";
  id: string;
  backgroundImage: CategoryDetails_category_backgroundImage | null;
  name: string;
  descriptionJson: any;
  seoDescription: string | null;
  seoTitle: string | null;
  parent: CategoryDetails_category_parent | null;
  children: CategoryDetails_category_children | null;
  skills: CategoryDetails_category_skills | null;
}

export interface CategoryDetails {
  category: CategoryDetails_category | null;
}

export interface CategoryDetailsVariables {
  id: string;
  first?: number | null;
  after?: string | null;
  last?: number | null;
  before?: string | null;
}
