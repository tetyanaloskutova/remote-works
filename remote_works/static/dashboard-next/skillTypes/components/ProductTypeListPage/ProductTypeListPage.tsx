import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import * as React from "react";

import Container from "../../../components/Container";
import PageHeader from "../../../components/PageHeader";
import i18n from "../../../i18n";
import { PageListProps } from "../../../types";
import { SkillTypeList_productTypes_edges_node } from "../../types/SkillTypeList";
import SkillTypeList from "../SkillTypeList";

interface SkillTypeListPageProps extends PageListProps {
  productTypes: SkillTypeList_productTypes_edges_node[];
}

const SkillTypeListPage: React.StatelessComponent<
  SkillTypeListPageProps
> = ({
  productTypes,
  disabled,
  pageInfo,
  onAdd,
  onNextPage,
  onPreviousPage,
  onRowClick
}) => (
  <Container width="md">
    <PageHeader title={i18n.t("Skill types")}>
      <Button
        color="secondary"
        variant="contained"
        disabled={disabled}
        onClick={onAdd}
      >
        {i18n.t("Add product type")} <AddIcon />
      </Button>
    </PageHeader>
    <SkillTypeList
      productTypes={productTypes}
      disabled={disabled}
      pageInfo={pageInfo}
      onNextPage={onNextPage}
      onPreviousPage={onPreviousPage}
      onRowClick={onRowClick}
    />
  </Container>
);
SkillTypeListPage.displayName = "SkillTypeListPage";
export default SkillTypeListPage;
