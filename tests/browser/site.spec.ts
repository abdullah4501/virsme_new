import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir, writeFile } from "node:fs/promises";
const paths = [
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
const captures = [
  "",
  "platform",
  "ai",
  "applications/sales",
  "workflows",
  "pricing",
  "facts",
  "book-demo",
];
for (const locale of ["en", "ar"]) {
  test(`${locale}: all routes, metadata, headings and responsive widths`, async ({
    page,
  }) => {
    test.setTimeout(240000);
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    for (const path of paths) {
      const response = await page.goto(`/${locale}/${path}`);
      expect(response?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      await expect(page.locator("html")).toHaveAttribute(
        "dir",
        locale === "ar" ? "rtl" : "ltr",
      );
      await expect(page.locator("head title")).toHaveCount(1);
      await expect(page.locator('head link[rel="canonical"]')).toHaveCount(1);
      await expect(page.locator("head link[hreflang]")).toHaveCount(3);
      for (const width of [320, 375, 768, 1024, 1280, 1600]) {
        await page.setViewportSize({ width, height: 900 });
        await page.evaluate(() => document.fonts.ready);
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth > window.innerWidth,
        );
        expect(overflow, `${locale}/${path} at ${width}px`).toBe(false);
      }
    }
    expect(errors).toEqual([]);
  });
  test(`${locale}: accessibility audit all pages`, async ({ page }) => {
    test.setTimeout(240000);
    await page.setViewportSize({ width: 1280, height: 900 });
    const report = [];
    for (const path of paths) {
      await page.goto(`/${locale}/${path}`);
      await page.evaluate(() => document.fonts.ready);
      const result = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      report.push({ path, violations: result.violations });
    }
    await mkdir("docs", { recursive: true });
    await writeFile(`docs/axe-${locale}.json`, JSON.stringify(report, null, 2));
    expect(
      report.flatMap((r) =>
        r.violations.map((v) => ({
          path: r.path,
          id: v.id,
          targets: v.nodes.map((n) => n.target),
        })),
      ),
    ).toEqual([]);
  });
  test(`${locale}: keyboard drawer and locale preserve route`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`/${locale}/platform`);
    await page.locator(".menu-button").focus();
    await page.keyboard.press("Enter");
    await expect(page.locator(".mobile-dialog")).toBeVisible();
    await page.keyboard.press("Tab");
    expect(
      await page.evaluate(() => !!document.activeElement?.closest("dialog")),
    ).toBe(true);
    await page.keyboard.press("Escape");
    await expect(page.locator(".mobile-dialog")).not.toBeVisible();
    await expect(page.locator(".menu-button")).toBeFocused();
    await page.locator(".locale-switch").click();
    await expect(page).toHaveURL(
      new RegExp(`/${locale === "en" ? "ar" : "en"}/platform$`),
    );
  });
  test(`${locale}: form validation, unavailable and success states`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/book-demo`);
    await page.locator(".form-submit").click();
    await expect(page.locator('[name="name"]')).toBeFocused();
    await expect(page.locator("#error-name")).toBeVisible();
    for (const [name, value] of Object.entries({
      name: "QA Example",
      company: "Local Test Fixture",
      email: "qa@example.test",
      country: "Test",
      workflow: "Employee onboarding",
    }))
      await page.locator(`[name="${name}"]`).fill(value);
    await page.locator('[name="employees"]').selectOption("11-50");
    await page.route("**/api/demo", (r) =>
      r.fulfill({
        status: 503,
        contentType: "application/json",
        body: JSON.stringify({ ok: false, error: "unavailable" }),
      }),
    );
    await page.locator(".form-submit").click();
    await expect(page.locator(".form-alert")).toBeVisible();
    await page.unroute("**/api/demo");
    await page.route("**/api/demo", async (r) => {
      const body = r.request().postDataJSON();
      expect(body.language).toBe(locale);
      await r.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true }),
      });
    });
    await page.locator(".form-submit").click();
    await expect(page.locator(".form-success")).toBeVisible();
    await expect(page.locator(".form-success")).toBeFocused();
  });
  test(`${locale}: requested desktop and mobile screenshots`, async ({
    page,
  }) => {
    test.setTimeout(180000);
    await mkdir("docs/screenshots", { recursive: true });
    for (const path of captures)
      for (const [device, width] of [
        ["desktop", 1440],
        ["mobile", 375],
      ] as const) {
        await page.setViewportSize({
          width,
          height: device === "desktop" ? 1000 : 812,
        });
        await page.goto(`/${locale}/${path}`);
        await page.evaluate(() => document.fonts.ready);
        await page.screenshot({
          path: `docs/screenshots/${locale}-${path.replaceAll("/", "-") || "home"}-${device}.png`,
          fullPage: true,
        });
      }
  });
}
test("all internal links resolve; route output contains visible copy without JavaScript", async ({
  page,
  request,
}) => {
  const seen = new Set<string>();
  for (const locale of ["en", "ar"])
    for (const path of paths) {
      const response = await request.get(`/${locale}/${path}`);
      const html = await response.text();
      expect(html).toContain("<h1");
      expect(html).not.toContain(">app_2<");
      await page.goto(`/${locale}/${path}`);
      for (const href of await page
        .locator('a[href^="/"]')
        .evaluateAll((nodes) => nodes.map((n) => n.getAttribute("href")!)))
        seen.add(href);
    }
  for (const href of seen)
    expect((await request.get(href)).status(), href).toBe(200);
  expect((await request.get("/en/missing-page")).status()).toBe(404);
});
