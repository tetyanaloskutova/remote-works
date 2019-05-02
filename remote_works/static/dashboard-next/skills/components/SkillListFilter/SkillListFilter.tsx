import * as React from "react";

import {
  Filter,
  FilterChips,
  FilterTab,
  FilterTabs
} from "../../../components/TableFilter";
import i18n from "../../../i18n";

export type SkillListFilterTabs =
  | "all"
  | "available"
  | "outOfStock"
  | "custom";

interface SkillListFilterProps {
  currentTab: SkillListFilterTabs;
  filtersList: Filter[];
  onAllSkills: () => void;
  onAvailable: () => void;
  onOfStock: () => void;
  onCustomFilter: () => void;
}

const SkillListFilter: React.StatelessComponent<SkillListFilterProps> = ({
  filtersList,
  currentTab,
  onAllSkills,
  onAvailable,
  onOfStock,
  onCustomFilter
}) => (
  <>
    <FilterTabs
      currentTab={["all", "available", "outOfStock", "custom"].indexOf(
        currentTab
      )}
    >
      <FilterTab label={i18n.t("All Skills")} onClick={onAllSkills} />
      <FilterTab label={i18n.t("Available")} onClick={onAvailable} />
      <FilterTab label={i18n.t("Out Of Stock")} onClick={onOfStock} />
      {currentTab === "custom" && filtersList && filtersList.length > 0 && (
        <FilterTab
          onClick={onCustomFilter}
          value={0}
          label={i18n.t("Custom Filter")}
        />
      )}
    </FilterTabs>
    {currentTab === "custom" && filtersList && filtersList.length > 0 && (
      <FilterChips filtersList={filtersList} />
    )}
  </>
);
SkillListFilter.displayName = "SkillListFilter";
export default SkillListFilter;
