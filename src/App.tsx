import { useEffect } from "react";
import { Link, useLocation, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ui } from "./content/ui";
import { identify, pathFor } from "./lib/routes";
import { track } from "./lib/analytics";
import type { AnalyticsEvent } from "./lib/analytics";
import { Header, Footer } from "./components/Shell";
import { SeoMeta } from "./components/SeoMeta";
import Home from "./pages/Home";
import Page from "./pages/Page";
export default function App() {
  const location = useLocation(),
    { locale, page } = identify(location.pathname);
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    const y = sessionStorage.getItem("virsme-scroll");
    sessionStorage.removeItem("virsme-scroll");
    window.scrollTo({ top: y ? Number(y) : 0, behavior: "instant" });
    const event: AnalyticsEvent | undefined =
      page && ["connect", "people", "work", "sales"].includes(page)
        ? "module_page_view"
        : page === "ai"
          ? "ai_page_view"
          : page === "why-virsme"
            ? "why_virsme_view"
            : page === "pricing"
              ? "pricing_view"
              : page === "facts"
                ? "facts_page_view"
                : undefined;
    if (event) track(event, { locale, page: page! });
  }, [location.pathname, locale, page]);
  if (location.pathname === "/") return <Navigate to="/en/" replace />;
  const t = ui(locale);
  return (
    <HelmetProvider>
      {page && <SeoMeta locale={locale} page={page} />}
      <Header locale={locale} page={page ?? "home"} />
      <main id="main" tabIndex={-1}>
        {page === "home" ? (
          <Home locale={locale} />
        ) : page ? (
          <Page locale={locale} page={page} />
        ) : (
          <div className="container section">
            <h1>{t.notFound}</h1>
            <Link className="text-link" to={pathFor("home", locale)}>
              {t.backHome}
            </Link>
          </div>
        )}
      </main>
      <Footer locale={locale} />
    </HelmetProvider>
  );
}
