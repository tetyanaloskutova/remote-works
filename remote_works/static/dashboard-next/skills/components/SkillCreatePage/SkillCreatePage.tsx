import { RawDraftContentState } from "draft-js";
import * as React from "react";

import CardSpacer from "../../../components/CardSpacer";
import { ConfirmButtonTransitionState } from "../../../components/ConfirmButton/ConfirmButton";
import Container from "../../../components/Container";
import Form from "../../../components/Form";
import Grid from "../../../components/Grid";
import PageHeader from "../../../components/PageHeader";
import SaveButtonBar from "../../../components/SaveButtonBar/SaveButtonBar";
import SeoForm from "../../../components/SeoForm";
import i18n from "../../../i18n";
import { UserError } from "../../../types";
import { SkillCreateData_skillTypes_edges_node_skillAttributes } from "../../types/SkillCreateData";
import SkillAvailabilityForm from "../SkillAvailabilityForm";
import SkillDetailsForm from "../SkillDetailsForm";
import SkillOrganization from "../SkillOrganization";
import SkillPricing from "../SkillPricing";

interface ChoiceType {
  label: string;
  value: string;
}
export interface FormData {
  attributes: Array<{
    slug: string;
    value: string;
  }>;
  available: boolean;
  publicationDate: string;
  category: ChoiceType;
  chargeTaxes: boolean;
  collections: ChoiceType[];
  description: RawDraftContentState;
  name: string;
  price: number;
  skillType: {
    label: string;
    value: {
      hasVariants: boolean;
      id: string;
      name: string;
      skillAttributes: SkillCreateData_skillTypes_edges_node_skillAttributes[];
    };
  };
  seoDescription: string;
  seoTitle: string;
  sku: string;
  stockQuantity: number;
}

interface SkillCreatePageProps {
  errors: UserError[];
  collections?: Array<{
    id: string;
    name: string;
  }>;
  currency: string;
  categories?: Array<{
    id: string;
    name: string;
  }>;
  disabled: boolean;
  skillTypes?: Array<{
    id: string;
    name: string;
    hasVariants: boolean;
    skillAttributes: SkillCreateData_skillTypes_edges_node_skillAttributes[];
  }>;
  header: string;
  saveButtonBarState: ConfirmButtonTransitionState;
  fetchCategories: (data: string) => void;
  fetchCollections: (data: string) => void;
  onAttributesEdit: () => void;
  onBack?();
  onSubmit?(data: FormData);
}

export const SkillCreatePage: React.StatelessComponent<
  SkillCreatePageProps
> = ({
  currency,
  disabled,
  categories,
  collections,
  errors: userErrors,
  fetchCategories,
  fetchCollections,
  header,
  skillTypes,
  saveButtonBarState,
  onBack,
  onSubmit
}: SkillCreatePageProps) => {
  const initialData: FormData = {
    attributes: [],
    available: false,
    category: {
      label: "",
      value: ""
    },
    chargeTaxes: false,
    collections: [],
    description: {} as any,
    name: "",
    price: 0,
    skillType: {
      label: "",
      value: {
        hasVariants: false,
        id: "",
        name: "",
        skillAttributes: [] as SkillCreateData_skillTypes_edges_node_skillAttributes[]
      }
    },
    publicationDate: "",
    seoDescription: "",
    seoTitle: "",
    sku: null,
    stockQuantity: null
  };
  return (
    <Form
      onSubmit={onSubmit}
      errors={userErrors}
      initial={initialData}
      confirmLeave
    >
      {({ change, data, errors, hasChanged, submit }) => (
        <Container width="md">
          <PageHeader title={header} onBack={onBack} />
          <Grid>
            <div>
              <SkillDetailsForm
                data={data}
                disabled={disabled}
                errors={errors}
                onChange={change}
              />
              <CardSpacer />
              <SkillPricing
                currency={currency}
                data={data}
                disabled={disabled}
                onChange={change}
              />
              <CardSpacer />
              <SeoForm
                helperText={i18n.t(
                  "Add search engine title and description to make this skill easier to find"
                )}
                title={data.seoTitle}
                titlePlaceholder={data.name}
                description={data.seoDescription}
                descriptionPlaceholder={data.seoTitle}
                loading={disabled}
                onChange={change}
              />
            </div>
            <div>
              <SkillOrganization
                categories={
                  categories !== undefined && categories !== null
                    ? categories.map(category => ({
                        label: category.name,
                        value: category.id
                      }))
                    : []
                }
                errors={errors}
                fetchCategories={fetchCategories}
                fetchCollections={fetchCollections}
                collections={
                  collections !== undefined && collections !== null
                    ? collections.map(collection => ({
                        label: collection.name,
                        value: collection.id
                      }))
                    : []
                }
                skillTypes={skillTypes}
                data={data}
                disabled={disabled}
                onChange={change}
              />
              <CardSpacer />
              <SkillAvailabilityForm
                data={data}
                errors={errors}
                loading={disabled}
                onChange={change}
              />
            </div>
          </Grid>
          <SaveButtonBar
            onCancel={onBack}
            onSave={submit}
            state={saveButtonBarState}
            disabled={disabled || !onSubmit || !hasChanged}
          />
        </Container>
      )}
    </Form>
  );
};
SkillCreatePage.displayName = "SkillCreatePage";
export default SkillCreatePage;
