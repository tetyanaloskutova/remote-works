import { RawDraftContentState } from "draft-js";
import * as React from "react";

import { CardSpacer } from "../../../components/CardSpacer";
import { ConfirmButtonTransitionState } from "../../../components/ConfirmButton/ConfirmButton";
import Container from "../../../components/Container";
import Form from "../../../components/Form";
import PageHeader from "../../../components/PageHeader";
import SaveButtonBar from "../../../components/SaveButtonBar/SaveButtonBar";
import SeoForm from "../../../components/SeoForm";
import { Tab } from "../../../components/Tab";
import TabContainer from "../../../components/Tab/TabContainer";
import i18n from "../../../i18n";
import { maybe } from "../../../misc";
import { UserError } from "../../../types";
import CategoryDetailsForm from "../../components/CategoryDetailsForm";
import CategoryList from "../../components/CategoryList";
import {
  CategoryDetails_category,
  CategoryDetails_category_children_edges_node,
  CategoryDetails_category_skills_edges_node
} from "../../types/CategoryDetails";
import CategoryBackground from "../CategoryBackground";
import CategorySkillsCard from "../CategorySkillsCard";

export interface FormData {
  backgroundImageAlt: string;
  description: RawDraftContentState;
  name: string;
  seoTitle: string;
  seoDescription: string;
}

export enum CategoryPageTab {
  categories = "categories",
  skills = "skills"
}

export interface CategoryUpdatePageProps {
  changeTab: (index: CategoryPageTab) => void;
  currentTab: CategoryPageTab;
  errors: UserError[];
  disabled: boolean;
  category: CategoryDetails_category;
  skills: CategoryDetails_category_skills_edges_node[];
  subcategories: CategoryDetails_category_children_edges_node[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  saveButtonBarState: ConfirmButtonTransitionState;
  onImageDelete: () => void;
  onSubmit: (data: FormData) => void;
  onImageUpload(file: File);
  onNextPage();
  onPreviousPage();
  onSkillClick(id: string): () => void;
  onAddSkill();
  onBack();
  onDelete();
  onAddCategory();
  onCategoryClick(id: string): () => void;
}

const CategoriesTab = Tab(CategoryPageTab.categories);
const SkillsTab = Tab(CategoryPageTab.skills);

export const CategoryUpdatePage: React.StatelessComponent<
  CategoryUpdatePageProps
> = ({
  changeTab,
  currentTab,
  category,
  disabled,
  errors: userErrors,
  pageInfo,
  skills,
  saveButtonBarState,
  subcategories,
  onAddCategory,
  onAddSkill,
  onBack,
  onCategoryClick,
  onDelete,
  onNextPage,
  onPreviousPage,
  onSkillClick,
  onSubmit,
  onImageDelete,
  onImageUpload
}: CategoryUpdatePageProps) => {
  const initialData: FormData = category
    ? {
        backgroundImageAlt: maybe(() => category.backgroundImage.alt, ""),
        description: maybe(() => JSON.parse(category.descriptionJson)),
        name: category.name || "",
        seoDescription: category.seoDescription || "",
        seoTitle: category.seoTitle || ""
      }
    : {
        backgroundImageAlt: "",
        description: "",
        name: "",
        seoDescription: "",
        seoTitle: ""
      };
  return (
    <Form
      onSubmit={onSubmit}
      initial={initialData}
      errors={userErrors}
      confirmLeave
    >
      {({ data, change, errors, submit, hasChanged }) => (
        <Container width="md">
          <PageHeader
            title={category ? category.name : undefined}
            onBack={onBack}
          />
          <CategoryDetailsForm
            category={category}
            data={data}
            disabled={disabled}
            errors={errors}
            onChange={change}
          />
          <CardSpacer />
          <CategoryBackground
            data={data}
            onImageUpload={onImageUpload}
            onImageDelete={onImageDelete}
            image={maybe(() => category.backgroundImage)}
            onChange={change}
          />
          <CardSpacer />
          <SeoForm
            helperText={i18n.t(
              "Add search engine title and description to make this category easier to find"
            )}
            title={data.seoTitle}
            titlePlaceholder={data.name}
            description={data.seoDescription}
            descriptionPlaceholder={data.name}
            loading={!category}
            onChange={change}
            disabled={disabled}
          />
          <CardSpacer />
          <TabContainer>
            <CategoriesTab
              isActive={currentTab === CategoryPageTab.categories}
              changeTab={changeTab}
            >
              {i18n.t("Subcategories")}
            </CategoriesTab>
            <SkillsTab
              isActive={currentTab === CategoryPageTab.skills}
              changeTab={changeTab}
            >
              {i18n.t("Skills")}
            </SkillsTab>
          </TabContainer>
          <CardSpacer />
          {currentTab === CategoryPageTab.categories && (
            <CategoryList
              disabled={disabled}
              isRoot={false}
              categories={subcategories}
              onAdd={onAddCategory}
              onRowClick={onCategoryClick}
              onNextPage={onNextPage}
              onPreviousPage={onPreviousPage}
              pageInfo={pageInfo}
            />
          )}
          {currentTab === CategoryPageTab.skills && (
            <CategorySkillsCard
              categoryName={maybe(() => category.name)}
              skills={skills}
              disabled={disabled}
              pageInfo={pageInfo}
              onNextPage={onNextPage}
              onPreviousPage={onPreviousPage}
              onRowClick={onSkillClick}
              onAdd={onAddSkill}
            />
          )}
          <SaveButtonBar
            onCancel={onBack}
            onDelete={onDelete}
            onSave={submit}
            labels={{
              delete: i18n.t("Delete category")
            }}
            state={saveButtonBarState}
            disabled={disabled || !hasChanged}
          />
        </Container>
      )}
    </Form>
  );
};
CategoryUpdatePage.displayName = "CategoryUpdatePage";
export default CategoryUpdatePage;
