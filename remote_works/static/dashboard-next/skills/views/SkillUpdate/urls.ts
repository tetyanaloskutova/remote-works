import * as urlJoin from "url-join";
import { skillPath } from "../../urls";

export const skillRemovePath = (id: string) =>
  urlJoin(skillPath(id), "remove");
export const skillRemoveUrl = (id: string) =>
  skillRemovePath(encodeURIComponent(id));
