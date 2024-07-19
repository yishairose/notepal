import { UrlWithStringQuery } from "url";

export function capitalise(string: string): string {
  const firstLetter = string[0].toUpperCase();
  return `${firstLetter}${string.slice(1)}`;
}

export function dateStamp(isoDate: string | number | Date) {
  const date = new Date(isoDate);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return date.toLocaleString("en-us", options);
}
