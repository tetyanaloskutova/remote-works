import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import * as React from "react";

import FormSpacer from "../../../components/FormSpacer";
import MultiSelectField from "../../../components/MultiSelectField";
import PageHeader from "../../../components/PageHeader";
import SingleSelectField from "../../../components/SingleSelectField";
import i18n from "../../../i18n";

interface SkillCategoryAndCollectionsFormProps {
  categories?: Array<{ value: string; label: string }>;
  collections?: Array<{ value: string; label: string }>;
  errors: { [key: string]: string };
  skillCollections?: string[];
  category?: string;
  loading?: boolean;
  onChange: (event: React.ChangeEvent<any>) => void;
}

const SkillCategoryAndCollectionsForm = ({
  categories,
  collections,
  errors,
  skillCollections,
  category,
  loading,
  onChange
}: SkillCategoryAndCollectionsFormProps) => (
  <Card>
    <PageHeader title={i18n.t("Organisation")} />
    <CardContent>
      <SingleSelectField
        disabled={loading}
        error={!!errors.category}
        hint={errors.category}
        label={i18n.t("Category")}
        choices={loading ? [] : categories}
        name="category"
        value={category}
        onChange={onChange}
      />
      <FormSpacer />
      <MultiSelectField
        disabled={loading}
        error={!!errors.collections}
        hint={errors.collections}
        label={i18n.t("Collections")}
        choices={loading ? [] : collections}
        name="collections"
        value={skillCollections}
        onChange={onChange}
      />
    </CardContent>
  </Card>
);
SkillCategoryAndCollectionsForm.displayName =
  "SkillCategoryAndCollectionsForm";
export default SkillCategoryAndCollectionsForm;
