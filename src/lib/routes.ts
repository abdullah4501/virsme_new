import { pageNames } from "../content/types";
import type { Locale, PageName } from "../content/types";
export const pathFor = (page: PageName, locale: Locale) =>
  `/${locale}/${page === "home" ? "" : ["connect", "people", "work", "sales"].includes(page) ? `applications/${page}` : page}`;
export const identify = (
  pathname: string,
): { locale: Locale; page: PageName | null } => {
  const locale = pathname.split("/")[1] === "ar" ? "ar" : "en";
  return {
    locale,
    page:
      pageNames.find(
        (p) =>
          pathFor(p, locale).replace(/\/$/, "") === pathname.replace(/\/$/, ""),
      ) ?? null,
  };
};
