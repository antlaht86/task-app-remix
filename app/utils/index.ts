import moment from "moment";
export const ICON_COLOR = "hsl(277, 85%, 38%)";

export function getISOString(value?: string | null) {
  if (!value) return null;

  if (moment(value ?? "").isValid())
    return moment(value ?? "").toISOString(true);

  return null;
}

export function getUrlDay(value: string) {
  return encodeURIComponent(moment(value).calendar("L"));
}

export function cssc(selector: boolean, first: string, second = "") {
  const retVal = selector ? first : second;
  return retVal ? " " + retVal : "";
}
