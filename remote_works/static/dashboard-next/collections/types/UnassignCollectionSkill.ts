/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UnassignCollectionSkill
// ====================================================

export interface UnassignCollectionSkill_collectionRemoveSkills_errors {
  __typename: "Error";
  field: string | null;
  message: string | null;
}

export interface UnassignCollectionSkill_collectionRemoveSkills_collection_skills_edges_node_skillType {
  __typename: "SkillType";
  id: string;
  name: string;
}

export interface UnassignCollectionSkill_collectionRemoveSkills_collection_skills_edges_node {
  __typename: "Skill";
  id: string;
  isPublished: boolean;
  name: string;
  skillType: UnassignCollectionSkill_collectionRemoveSkills_collection_skills_edges_node_skillType;
  thumbnailUrl: string | null;
}

export interface UnassignCollectionSkill_collectionRemoveSkills_collection_skills_edges {
  __typename: "SkillCountableEdge";
  node: UnassignCollectionSkill_collectionRemoveSkills_collection_skills_edges_node;
}

export interface UnassignCollectionSkill_collectionRemoveSkills_collection_skills_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface UnassignCollectionSkill_collectionRemoveSkills_collection_skills {
  __typename: "SkillCountableConnection";
  edges: UnassignCollectionSkill_collectionRemoveSkills_collection_skills_edges[];
  pageInfo: UnassignCollectionSkill_collectionRemoveSkills_collection_skills_pageInfo;
}

export interface UnassignCollectionSkill_collectionRemoveSkills_collection {
  __typename: "Collection";
  id: string;
  skills: UnassignCollectionSkill_collectionRemoveSkills_collection_skills | null;
}

export interface UnassignCollectionSkill_collectionRemoveSkills {
  __typename: "CollectionRemoveSkills";
  errors: UnassignCollectionSkill_collectionRemoveSkills_errors[] | null;
  collection: UnassignCollectionSkill_collectionRemoveSkills_collection | null;
}

export interface UnassignCollectionSkill {
  collectionRemoveSkills: UnassignCollectionSkill_collectionRemoveSkills | null;
}

export interface UnassignCollectionSkillVariables {
  collectionId: string;
  skillId: string;
  first?: number | null;
  after?: string | null;
  last?: number | null;
  before?: string | null;
}
