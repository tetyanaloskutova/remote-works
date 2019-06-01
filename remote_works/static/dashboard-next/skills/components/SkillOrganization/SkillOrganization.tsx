import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import * as React from "react";

import CardTitle from "../../../components/CardTitle";
import { FormSpacer } from "../../../components/FormSpacer";
import MultiAutocompleteSelectField from "../../../components/MultiAutocompleteSelectField";
import SingleAutocompleteSelectField from "../../../components/SingleAutocompleteSelectField";
import SingleSelectField from "../../../components/SingleSelectField";
import Skeleton from "../../../components/Skeleton";
import i18n from "../../../i18n";
import { maybe } from "../../../misc";
import { SkillCreateData_skillTypes_edges_node_skillAttributes } from "../../types/SkillCreateData";

interface ChoiceType {
  label: string;
  value: string;
}
interface SkillType {
  hasVariants: boolean;
  id: string;
  name: string;
  skillAttributes: SkillCreateData_skillTypes_edges_node_skillAttributes[];
}

const styles = (theme: Theme) =>
  createStyles({
    card: {
      overflow: "visible"
    },
    cardSubtitle: {
      fontSize: "1rem",
      margin: `${theme.spacing.unit * 3}px 0`
    },
    hr: {
      backgroundColor: "#eaeaea",
      border: "none",
      height: 1,
      margin: `0 -${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`
    }
  });

interface SkillOrganizationProps extends WithStyles<typeof styles> {
  categories?: Array<{ value: string; label: string }>;
  collections?: Array<{ value: string; label: string }>;
  data: {
    attributes: Array<{
      slug: string;
      value: string;
    }>;
    category: ChoiceType;
    collections: ChoiceType[];
    skillType: {
      label: string;
      value: {
        hasVariants: boolean;
        id: string;
        name: string;
        skillAttributes: SkillCreateData_skillTypes_edges_node_skillAttributes[];
      };
    };
  };
  disabled: boolean;
  errors: { [key: string]: string };
  skill?: {
    skillType?: {
      hasVariants?: boolean;
      name?: string;
    };
  };
  skillTypes?: SkillType[];
  fetchCategories: (query: string) => void;
  fetchCollections: (query: string) => void;
  onChange: (event: React.ChangeEvent<any>, cb?: () => void) => void;
}

const SkillOrganization = withStyles(styles, { name: "SkillOrganization" })(
  ({
    categories,
    classes,
    collections,
    data,
    disabled,
    fetchCategories,
    fetchCollections,
    skill,
    skillTypes,
    onChange
  }: SkillOrganizationProps) => {
    const unrolledAttributes = maybe(
      () => data.skillType.value.skillAttributes,
      []
    );
    const getAttributeName = (slug: string) =>
      unrolledAttributes.filter(a => a.slug === slug)[0].name;
    const getAttributeValue = (slug: string) => {
      if (unrolledAttributes.length > 0) {
        const value = data.attributes.filter(a => a.slug === slug)[0];
        const matches = unrolledAttributes
          .filter(a => a.slug === slug)[0]
          .values.filter(v => v.slug === value.value);
        const label = matches.length > 0 ? matches[0].name : value.value;
        return {
          label,
          value
        };
      }
      return {
        label: "",
        value: ""
      };
    };
    const getAttributeValues = (slug: string) =>
      unrolledAttributes.filter(a => a.slug === slug)[0].values;
    const handleSkillTypeSelect = (
      event: React.ChangeEvent<{
        name: string;
        value: {
          label: string;
          value: SkillType;
        };
      }>
    ) => {
      onChange(event, () =>
        onChange({
          ...event,
          target: {
            ...event.target,
            name: "attributes",
            value: event.target.value.value.skillAttributes.map(
              attribute => ({
                slug: attribute.slug,
                value: ""
              })
            )
          }
        })
      );
    };
    const handleAttributeValueSelect = (
      event: React.ChangeEvent<{
        name: string;
        value: {
          label: string;
          value: string;
        };
      }>
    ) => {
      onChange({
        ...event,
        target: {
          ...event.target,
          name: "attributes",
          value: data.attributes.map(a =>
            a.slug === event.target.name
              ? { slug: a.slug, value: event.target.value.value }
              : a
          )
        }
      });
    };
    return (
      <Card className={classes.card}>
        <CardTitle title={i18n.t("Organize Skill")} />
        <CardContent>
          <SingleAutocompleteSelectField
            name="skillType"
            disabled={!!skill || disabled}
            label={i18n.t("Skill Type")}
            choices={
              skill &&
              skill.skillType &&
              skill.skillType.name !== undefined
                ? [{ label: skill.skillType.name, value: "1" }]
                : skillTypes
                ? skillTypes.map(pt => ({ label: pt.name, value: pt }))
                : []
            }
            value={data.skillType}
            onChange={handleSkillTypeSelect}
          />
          <FormSpacer />
          <SingleSelectField
            disabled={true}
            name="hasVariants"
            label={i18n.t("Is it configurable?")}
            choices={[
              { label: i18n.t("Yes"), value: "true" },
              { label: i18n.t("No"), value: "false" }
            ]}
            value={
              skill &&
              skill.skillType &&
              skill.skillType.hasVariants !== undefined
                ? skill.skillType.hasVariants + ""
                : data.skillType
                ? data.skillType.value.hasVariants + ""
                : false + ""
            }
            onChange={onChange}
          />
          {!(data && data.attributes && data.attributes.length === 0) ? (
            <Typography className={classes.cardSubtitle}>
              {i18n.t("Attributes")}
            </Typography>
          ) : (
            <FormSpacer />
          )}
          {data.attributes ? (
            data.attributes.map((item, index) => {
              return (
                <React.Fragment key={index}>
                  <SingleAutocompleteSelectField
                    disabled={disabled}
                    name={item.slug}
                    label={getAttributeName(item.slug)}
                    onChange={handleAttributeValueSelect}
                    value={getAttributeValue(item.slug)}
                    choices={getAttributeValues(item.slug).map(v => ({
                      label: v.name,
                      value: v.slug
                    }))}
                    custom
                  />
                  <FormSpacer />
                </React.Fragment>
              );
            })
          ) : (
            <Skeleton />
          )}
          <hr className={classes.hr} />
          <SingleAutocompleteSelectField
            disabled={disabled}
            label={i18n.t("Category")}
            choices={disabled ? [] : categories}
            name="category"
            value={data.category}
            onChange={onChange}
            fetchChoices={fetchCategories}
          />
          <FormSpacer />
          <hr className={classes.hr} />
          <MultiAutocompleteSelectField
            label={i18n.t("Collections")}
            choices={disabled ? [] : collections}
            name="collections"
            value={data.collections}
            onChange={onChange}
            fetchChoices={fetchCollections}
          />
        </CardContent>
      </Card>
    );
  }
);
SkillOrganization.displayName = "SkillOrganization";
export default SkillOrganization;
