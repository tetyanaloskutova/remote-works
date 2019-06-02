import * as urlJoin from "url-join";

import { skillImagePath } from "../../urls";

export const skillImageRemovePath = (skillId: string, imageId: string) =>
  urlJoin(skillImagePath(skillId, imageId), "remove");
export const skillImageRemoveUrl = (skillId: string, imageId: string) =>
  skillImageRemovePath(
    encodeURIComponent(skillId),
    encodeURIComponent(imageId)
  );
