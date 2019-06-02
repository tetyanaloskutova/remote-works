import * as urlJoin from "url-join";
import { skillVariantEditPath } from "../../urls";

export const skillVariantRemovePath = (
  skillId: string,
  variantId: string
) => urlJoin(skillVariantEditPath(skillId, variantId), "remove");
export const skillVariantRemoveUrl = (skillId: string, variantId: string) =>
  skillVariantRemovePath(
    encodeURIComponent(skillId),
    encodeURIComponent(variantId)
  );
