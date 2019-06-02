import * as urlJoin from "url-join";

import { AttributeTypeEnum } from "../../../types/globalTypes";
import { skillTypePath } from "../../urls";

export const addAttributePath = (
  skillTypeId: string,
  type: AttributeTypeEnum
) =>
  type === AttributeTypeEnum.PRODUCT
    ? urlJoin(skillTypePath(skillTypeId), "attribute/skill/add")
    : urlJoin(skillTypePath(skillTypeId), "attribute/variant/add");
export const addAttributeUrl = (
  skillTypeId: string,
  type: AttributeTypeEnum
) => addAttributePath(encodeURIComponent(skillTypeId), type);

export const editAttributePath = (skillTypeId: string, attributeId: string) =>
  urlJoin(skillTypePath(skillTypeId), "attribute", attributeId);
export const editAttributeUrl = (skillTypeId: string, attributeId: string) =>
  editAttributePath(
    encodeURIComponent(skillTypeId),
    encodeURIComponent(attributeId)
  );
export const skillTypeRemovePath = (id: string) =>
  urlJoin(skillTypePath(id), "remove");
export const skillTypeRemoveUrl = (id: string) =>
  skillTypeRemovePath(encodeURIComponent(id));
