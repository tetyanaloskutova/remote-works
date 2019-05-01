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
import { maybe } from "../../../misc";
import { UserError } from "../../../types";
import {
  ProductDetails_skill,
  ProductDetails_skill_attributes_attribute,
  ProductDetails_skill_images,
  ProductDetails_skill_variants
} from "../../types/ProductDetails";
import ProductAvailabilityForm from "../ProductAvailabilityForm";
import ProductDetailsForm from "../ProductDetailsForm";
import ProductImages from "../ProductImages";
import ProductOrganization from "../ProductOrganization";
import ProductPricing from "../ProductPricing";
import ProductStock from "../ProductStock";
import ProductVariants from "../ProductVariants";

interface ProductUpdateProps {
  errors: UserError[];
  placeholderImage: string;
  collections?: Array<{
    id: string;
    name: string;
  }>;
  categories?: Array<{
    id: string;
    name: string;
  }>;
  disabled?: boolean;
  skillCollections?: Array<{
    id: string;
    name: string;
  }>;
  variants: ProductDetails_skill_variants[];
  images?: ProductDetails_skill_images[];
  skill?: ProductDetails_skill;
  header: string;
  saveButtonBarState: ConfirmButtonTransitionState;
  fetchCategories: (query: string) => void;
  fetchCollections: (query: string) => void;
  onVariantShow: (id: string) => () => void;
  onImageDelete: (id: string) => () => void;
  onAttributesEdit: () => void;
  onBack?();
  onDelete();
  onImageEdit?(id: string);
  onImageReorder?(event: { oldIndex: number; newIndex: number });
  onImageUpload(file: File);
  onProductShow?();
  onSeoClick?();
  onSubmit?(data: any);
  onVariantAdd?();
}

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
  category: ChoiceType | null;
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
      skillAttributes: Array<
        Exclude<ProductDetails_skill_attributes_attribute, "__typename">
      >;
    };
  } | null;
  publicationDate: string;
  seoDescription: string;
  seoTitle: string;
  sku: string;
  stockQuantity: number;
}

export const ProductUpdate: React.StatelessComponent<ProductUpdateProps> = ({
  disabled,
  categories: categoryChoiceList,
  collections: collectionChoiceList,
  errors: userErrors,
  fetchCategories,
  fetchCollections,
  images,
  header,
  placeholderImage,
  skill,
  skillCollections,
  saveButtonBarState,
  variants,
  onAttributesEdit,
  onBack,
  onDelete,
  onImageDelete,
  onImageEdit,
  onImageReorder,
  onImageUpload,
  onSeoClick,
  onSubmit,
  onVariantAdd,
  onVariantShow
}) => {
  const initialData: FormData = {
    attributes: maybe(
      () =>
        skill.attributes.map(a => ({
          slug: a.attribute.slug,
          value: a.value ? a.value.slug : null
        })),
      []
    ),
    available: maybe(() => skill.isPublished, false),
    category: maybe(() => ({
      label: skill.category.name,
      value: skill.category.id
    })),
    chargeTaxes: maybe(() => skill.chargeTaxes, false),
    collections: skillCollections
      ? skillCollections.map(collection => ({
          label: collection.name,
          value: collection.id
        }))
      : [],
    description: maybe(() => JSON.parse(skill.descriptionJson)),
    name: maybe(() => skill.name),
    price: maybe(() => skill.price.amount),
    skillType: maybe(() => ({
      label: skill.skillType.name,
      value: {
        hasVariants: skill.skillType.hasVariants,
        id: skill.skillType.id,
        name: skill.skillType.name,
        skillAttributes: skill.attributes.map(a => a.attribute)
      }
    })),
    publicationDate: maybe(() => skill.publicationDate),
    seoDescription: maybe(() => skill.seoDescription),
    seoTitle: maybe(() => skill.seoTitle),
    sku: maybe(() =>
      skill.skillType.hasVariants
        ? undefined
        : variants && variants[0]
        ? variants[0].sku
        : undefined
    ),
    stockQuantity: maybe(() =>
      skill.skillType.hasVariants
        ? undefined
        : variants && variants[0]
        ? variants[0].quantity
        : undefined
    )
  };
  const categories =
    categoryChoiceList !== undefined
      ? categoryChoiceList.map(category => ({
          label: category.name,
          value: category.id
        }))
      : [];
  const collections =
    collectionChoiceList !== undefined
      ? collectionChoiceList.map(collection => ({
          label: collection.name,
          value: collection.id
        }))
      : [];
  const currency =
    skill && skill.price ? skill.price.currency : undefined;
  const hasVariants =
    skill && skill.skillType && skill.skillType.hasVariants;

  return (
    <Form
      onSubmit={onSubmit}
      errors={userErrors}
      initial={initialData}
      confirmLeave
    >
      {({ change, data, errors, hasChanged, submit }) => (
        <>
          <Container width="md">
            <PageHeader title={header} onBack={onBack} />
            <Grid>
              <div>
                <ProductDetailsForm
                  data={data}
                  disabled={disabled}
                  errors={errors}
                  skill={skill}
                  onChange={change}
                />
                <CardSpacer />
                <ProductImages
                  images={images}
                  placeholderImage={placeholderImage}
                  onImageDelete={onImageDelete}
                  onImageReorder={onImageReorder}
                  onImageEdit={onImageEdit}
                  onImageUpload={onImageUpload}
                />
                <CardSpacer />
                <ProductPricing
                  currency={currency}
                  data={data}
                  disabled={disabled}
                  onChange={change}
                />
                <CardSpacer />
                {hasVariants ? (
                  <ProductVariants
                    variants={variants}
                    fallbackPrice={skill ? skill.price : undefined}
                    onAttributesEdit={onAttributesEdit}
                    onRowClick={onVariantShow}
                    onVariantAdd={onVariantAdd}
                  />
                ) : (
                  <ProductStock
                    data={data}
                    disabled={disabled}
                    skill={skill}
                    onChange={change}
                  />
                )}
                <CardSpacer />
                <SeoForm
                  title={data.seoTitle}
                  titlePlaceholder={data.name}
                  description={data.seoDescription}
                  descriptionPlaceholder={data.description}
                  loading={disabled}
                  onClick={onSeoClick}
                  onChange={change}
                />
              </div>
              <div>
                <ProductOrganization
                  categories={categories}
                  errors={errors}
                  fetchCategories={fetchCategories}
                  fetchCollections={fetchCollections}
                  collections={collections}
                  skill={skill}
                  data={data}
                  disabled={disabled}
                  onChange={change}
                />
                <CardSpacer />
                <ProductAvailabilityForm
                  data={data}
                  errors={errors}
                  loading={disabled}
                  onChange={change}
                />
              </div>
            </Grid>
            <SaveButtonBar
              onCancel={onBack}
              onDelete={onDelete}
              onSave={submit}
              state={saveButtonBarState}
              disabled={disabled || !hasChanged}
            />
          </Container>
        </>
      )}
    </Form>
  );
};
ProductUpdate.displayName = "ProductUpdate";
export default ProductUpdate;
