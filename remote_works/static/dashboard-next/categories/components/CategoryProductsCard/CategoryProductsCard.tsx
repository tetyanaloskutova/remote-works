import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import * as React from "react";

import CardTitle from "../../../components/CardTitle";
import SkillList from "../../../components/SkillList";
import i18n from "../../../i18n";
import { PageListProps } from "../../../types";
import { CategoryDetails_category_products_edges_node } from "../../types/CategoryDetails";

interface CategorySkillsCardProps extends PageListProps {
  products: CategoryDetails_category_products_edges_node[];
  categoryName: string;
}

export const CategorySkillsCard: React.StatelessComponent<
  CategorySkillsCardProps
> = ({
  products,
  disabled,
  pageInfo,
  onAdd,
  onNextPage,
  onPreviousPage,
  onRowClick,
  categoryName
}) => (
  <Card>
    <CardTitle
      title={i18n.t("Skills in {{ categoryName }}", { categoryName })}
      toolbar={
        <Button color="secondary" variant="text" onClick={onAdd}>
          {i18n.t("Add product")}
        </Button>
      }
    />
    <SkillList
      products={products}
      disabled={disabled}
      pageInfo={pageInfo}
      onNextPage={onNextPage}
      onPreviousPage={onPreviousPage}
      onRowClick={onRowClick}
    />
  </Card>
);

CategorySkillsCard.displayName = "CategorySkillsCard";
export default CategorySkillsCard;
