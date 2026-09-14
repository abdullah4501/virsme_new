import { chromium } from "@playwright/test";
import { readFile } from "node:fs/promises";
const browser = await chromium.launch({ channel: "chromium", headless: true });
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
});
const logo = (await readFile("public/brand/logo.png")).toString("base64");
for (const locale of ["en", "ar"]) {
  const data = JSON.parse(
    await readFile(`src/content/home/${locale}.json`, "utf8"),
  );
  await page.goto("http://127.0.0.1:5173/en/");
  await page.setContent(
    `<html lang="${locale}" dir="${locale === "ar" ? "rtl" : "ltr"}"><head><style>@font-face{font-family:Inter;src:url('http://127.0.0.1:5173/node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2')}@font-face{font-family:Arabic;src:url('http://127.0.0.1:5173/node_modules/@fontsource-variable/noto-sans-arabic/files/noto-sans-arabic-arabic-wght-normal.woff2')}*{box-sizing:border-box}body{margin:0;background:#f8fafc;color:#0f172a;font-family:${locale === "ar" ? "Arabic" : "Inter"};padding:65px 80px;border-top:10px solid #2563eb;width:1200px;height:630px;position:relative}img{width:210px;height:auto}h1{font-size:${locale === "ar" ? 70 : 83}px;line-height:1.25;font-weight:600;letter-spacing:${locale === "ar" ? 0 : "-5px"};max-width:950px;margin:65px 0 30px}p{color:#475569;font-size:22px}.rule{position:absolute;bottom:65px;height:4px;width:80px;background:#2563eb}</style></head><body><img src="data:image/png;base64,${logo}"><h1>${data.hero}</h1><p>${data.eyebrow}</p><div class="rule"></div></body></html>`,
  );
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `public/brand/og-${locale}.png` });
}
await browser.close();
