import * as urlJoin from "url-join";

const skillTypeSection = "/skill-types/";

export const skillTypeListPath = skillTypeSection;
export const skillTypeListUrl = skillTypeListPath;

export const skillTypeAddPath = urlJoin(skillTypeSection, "add");
export const skillTypeAddUrl = skillTypeAddPath;

export const skillTypePath = (id: string) => urlJoin(skillTypeSection, id);
export const skillTypeUrl = (id: string) =>
  skillTypePath(encodeURIComponent(id));
