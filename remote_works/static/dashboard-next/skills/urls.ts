import { stringify as stringifyQs } from "qs";
import * as urlJoin from "url-join";
import { SkillListQueryParams } from "./views/SkillList";

const skillSection = "/skills/";

export const skillAddPath = urlJoin(skillSection, "add");
export const skillAddUrl = skillAddPath;

export const skillListPath = skillSection;
export const skillListUrl = (params?: SkillListQueryParams): string => {
  if (params === undefined) {
    return skillListPath;
  } else {
    return urlJoin(skillListPath, "?" + stringifyQs(params));
  }
};

export const skillPath = (id: string) => urlJoin(skillSection, id);
export const skillUrl = (id: string) => skillPath(encodeURIComponent(id));

export const skillVariantEditPath = (skillId: string, variantId: string) =>
  urlJoin(skillSection, skillId, "variant", variantId);
export const skillVariantEditUrl = (skillId: string, variantId: string) =>
  skillVariantEditPath(
    encodeURIComponent(skillId),
    encodeURIComponent(variantId)
  );

export const skillVariantAddPath = (skillId: string) =>
  urlJoin(skillSection, skillId, "variant/add");
export const skillVariantAddUrl = (skillId: string) =>
  skillVariantAddPath(encodeURIComponent(skillId));

export const skillImagePath = (skillId: string, imageId: string) =>
  urlJoin(skillSection, skillId, "image", imageId);
export const skillImageUrl = (skillId: string, imageId: string) =>
  skillImagePath(encodeURIComponent(skillId), encodeURIComponent(imageId));
