import type { Locale, PageContent, PageName } from "./types";
const files = import.meta.glob<{ default: PageContent }>("./*/*.json", {
  eager: true,
});
export function content(page: PageName, locale: Locale): PageContent {
  const entry = files[`./${page}/${locale}.json`];
  if (!entry) throw new Error(`Missing content: ${page}/${locale}`);
  return entry.default;
}
