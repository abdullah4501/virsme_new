export type Locale = "en" | "ar";
export type Block = { kind: string; text: string; items: string[] };
export type PageContent = {
  title: string;
  description: string;
  eyebrow: string;
  hero: string;
  intro: string;
  blocks: Block[];
};
export const pageNames = [
  "home",
  "platform",
  "applications",
  "connect",
  "people",
  "work",
  "sales",
  "ai",
  "workflows",
  "implementation",
  "why-virsme",
  "pricing",
  "ecosystem",
  "about",
  "facts",
  "book-demo",
  "resources",
] as const;
export type PageName = (typeof pageNames)[number];
