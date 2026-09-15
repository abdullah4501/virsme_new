import { readFile, writeFile, mkdir } from "node:fs/promises";
import { render } from "../dist-ssr/entry-server.js";
import {loadEnv} from 'vite';
const names = [
  "",
  "platform",
  "applications",
  "applications/connect",
  "applications/people",
  "applications/work",
  "applications/sales",
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
];
const origin = (
  process.env.VITE_SITE_ORIGIN || loadEnv('production',process.cwd(),'VITE_').VITE_SITE_ORIGIN || "https://virsme.example"
).replace(/\/$/, "");
const template = (await readFile("dist/index.html", "utf8"))
  .replace(/<title>.*?<\/title>/s, "")
  .replace(/<meta name="description"[^>]*>/g, "");
const escape = (s) =>
  s.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");
for (const locale of ["en", "ar"])
  for (const name of names) {
    const path = `/${locale}/${name}`,
      html = render(path);
    const head = [];
    const body = html.replace(
      /<title[\s\S]*?<\/title>|<meta\b[^>]*\/?\s*>|<link\b[^>]*\/?\s*>/g,
      (tag) => {
        head.push(tag);
        return "";
      },
    );
    let output = template
      .replace(
        '<html lang="en">',
        `<html lang="${locale}" dir="${locale === "ar" ? "rtl" : "ltr"}">`,
      )
      .replace("</head>", head.join("") + "</head>")
      .replace('<div id="root"></div>', `<div id="root">${body}</div>`);
    if (!/<h1[ >]/.test(output)) throw new Error(`No content at ${path}`);
    const folder = `dist${path}`;
    await mkdir(folder, { recursive: true });
    await writeFile(`${folder}/index.html`, output);
  }
await writeFile(
  "dist/index.html",
  template.replace(
    "</head>",
    '<meta http-equiv="refresh" content="0;url=/en/"><title>VirSME</title><link rel="canonical" href="' +
      escape(origin) +
      '/en/"></head>',
  ),
);
await writeFile(
  "dist/404.html",
  template
    .replace(
      '<div id="root"></div>',
      `<div id="root">${render("/en/not-found")}</div>`,
    )
    .replace(
      "</head>",
      '<meta name="robots" content="noindex"><title>VirSME | Page not found</title></head>',
    ),
);
const alternate = (name, locale) => `${origin}/${locale}/${name}`;
await writeFile(
  "dist/sitemap.xml",
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">' +
    names
      .flatMap((name) =>
        ["en", "ar"].map(
          (locale) =>
            `<url><loc>${escape(alternate(name, locale))}</loc>${["en", "ar", "x-default"].map((l) => `<xhtml:link rel="alternate" hreflang="${l}" href="${escape(alternate(name, l === "x-default" ? "en" : l))}"/>`).join("")}</url>`,
        ),
      )
      .join("\n") +
    "</urlset>",
);
await writeFile(
  "dist/robots.txt",
  `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`,
);
console.log("Prerendered all 34 locale URLs with sitemap and robots.");
