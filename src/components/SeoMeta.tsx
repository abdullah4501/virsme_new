import { Helmet } from "react-helmet-async";
import { content } from "../content";
import { pageNames } from "../content/types";
import type { Locale, PageName } from "../content/types";
import { ui } from "../content/ui";
import { pathFor } from "../lib/routes";
const siteOrigin = (
  import.meta.env.VITE_SITE_ORIGIN || "https://virsme.example"
).replace(/\/$/, "");
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
export function SeoMeta({ locale, page }: { locale: Locale; page: PageName }) {
  const p = content(page, locale),
    t = ui(locale),
    url = siteOrigin + pathFor(page, locale);
  const desc = p.description || p.hero;
  const schema: Record<string, unknown>[] = [];
  if (["home", "about", "facts"].includes(page))
    schema.push({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "VirSME",
      url: siteOrigin,
      logo: siteOrigin + "/brand/logo.png",
      description: t.category,
    });
  if (page !== "home") {
    const items = [
      { name: t.pageNames[0], item: siteOrigin + pathFor("home", locale) },
    ];
    if (["connect", "people", "work", "sales"].includes(page))
      items.push({
        name: t.pageNames[2],
        item: siteOrigin + pathFor("applications", locale),
      });
    items.push({ name: t.pageNames[pageNames.indexOf(page)], item: url });
    schema.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items.map((v, i) => ({
        "@type": "ListItem",
        position: i + 1,
        ...v,
      })),
    });
  }
  return (
    <>
      <Helmet>
        <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} />
        <title>{p.title}</title>
        <meta name="description" content={desc} />
        <link rel="canonical" href={url} />
        <link
          rel="alternate"
          hrefLang="en"
          href={siteOrigin + pathFor(page, "en")}
        />
        <link
          rel="alternate"
          hrefLang="ar"
          href={siteOrigin + pathFor(page, "ar")}
        />
        <link
          rel="alternate"
          hrefLang="x-default"
          href={siteOrigin + pathFor(page, "en")}
        />
        <meta property="og:title" content={p.title} />
        <meta property="og:description" content={desc} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content={locale === "ar" ? "ar" : "en_US"} />
        <meta
          property="og:image"
          content={siteOrigin + `/brand/og-${locale}.png`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={p.title} />
        <meta name="twitter:description" content={desc} />
        <meta
          name="twitter:image"
          content={siteOrigin + `/brand/og-${locale}.png`}
        />
      </Helmet>
      {schema.map((data, i) => (
        <JsonLd key={i} data={data} />
      ))}
    </>
  );
}
