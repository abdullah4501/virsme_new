export type AnalyticsEvent =
  | "nav_demo_click"
  | "hero_demo_click"
  | "workflow_demo_click"
  | "demo_form_start"
  | "demo_form_submit"
  | "demo_form_success"
  | "locale_switch"
  | "platform_cta_click"
  | "module_page_view"
  | "ai_page_view"
  | "why_virsme_view"
  | "pricing_view"
  | "resource_article_click"
  | "facts_page_view";
declare global {
  interface Window {
    virsmeAnalytics?: (
      event: AnalyticsEvent,
      detail: Record<string, string>,
    ) => void;
  }
}
export function track(
  event: AnalyticsEvent,
  detail: Record<string, string> = {},
) {
  if (typeof window !== "undefined") window.virsmeAnalytics?.(event, detail);
}
