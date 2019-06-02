import { empty, only } from "../misc";
import { StockAvailability } from "../types/globalTypes";
import { SkillListFilterTabs } from "./components/SkillListFilter";
import { SkillListQueryParams } from "./views/SkillList";

export const getTabName = (
  qs: SkillListQueryParams
): SkillListFilterTabs => {
  const filters = {
    status: qs.status
  };
  if (empty(filters)) {
    return "all";
  }
  if (only(filters, "status")) {
    return filters.status === StockAvailability.IN_AVAILABILITY
      ? "available"
      : "outOfStock";
  }
  return "custom";
};
