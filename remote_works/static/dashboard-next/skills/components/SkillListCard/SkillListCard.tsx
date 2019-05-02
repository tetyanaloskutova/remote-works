import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import AddIcon from "@material-ui/icons/Add";
import * as React from "react";

import { CategoryDetails_category_products_edges_node } from "../../../categories/types/CategoryDetails";
import Container from "../../../components/Container";
import PageHeader from "../../../components/PageHeader";
import SkillList from "../../../components/SkillList";
import { Filter } from "../../../components/TableFilter";
import i18n from "../../../i18n";
import { PageListProps } from "../../../types";
import SkillListFilter, { SkillListFilterTabs } from "../SkillListFilter";

interface SkillListCardProps extends PageListProps {
  currentTab: SkillListFilterTabs;
  filtersList: Filter[];
  products: CategoryDetails_category_products_edges_node[];
  onAllSkills: () => void;
  onAvailable: () => void;
  onOfStock: () => void;
  onCustomFilter: () => void;
}

export const SkillListCard: React.StatelessComponent<
  SkillListCardProps
> = ({
  products,
  disabled,
  pageInfo,
  onAdd,
  onNextPage,
  onPreviousPage,
  onRowClick,
  filtersList,
  currentTab,
  onAllSkills,
  onAvailable,
  onOfStock,
  onCustomFilter
}) => (
  <Container width="md">
    <PageHeader title={i18n.t("Skills")}>
      <Button onClick={onAdd} color="secondary" variant="contained">
        {i18n.t("Add product")} <AddIcon />
      </Button>
    </PageHeader>
    <Card>
      <SkillListFilter
        currentTab={currentTab}
        filtersList={filtersList}
        onAvailable={onAvailable}
        onAllSkills={onAllSkills}
        onOfStock={onOfStock}
        onCustomFilter={onCustomFilter}
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
  </Container>
);
SkillListCard.displayName = "SkillListCard";
export default SkillListCard;
