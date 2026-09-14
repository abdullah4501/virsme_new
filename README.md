# VirSME website

Bilingual marketing website built with React, TypeScript and Vite. Seventeen pages are statically prerendered in English and Arabic, producing 34 real HTML URLs. The site includes an accessible responsive shell, conceptual dashboard previews, workflow diagrams, a validated demo form and configurable delivery.

## Run locally

Use Node 24 LTS (the tested runtime) and npm.

```sh
npm ci
npm run dev
```

Open the URL Vite prints, normally `http://localhost:5173/en/`. The root redirects to English. Arabic starts at `/ar/`.

```sh
npm run typecheck
npm run lint
npm test
npm run build
npm run preview
```

`build` checks content parity, typechecks, builds the browser and server-rendering entries, then writes one HTML file per locale route, `sitemap.xml`, `robots.txt` and a 404 page into `dist/`. `dist-ssr/` is a build intermediate and is not deployed as public assets. `preview` serves the generated files and the demo API at `http://127.0.0.1:4173`. It returns real 404 responses for unknown paths. `npm start` uses the same server.

## Environment

Copy `.env.example` to `.env` for local configuration. Do not commit credentials. The Vite development endpoint and Node preview read local environment configuration. Restart the server after editing it.

| Variable | Where | Purpose |
| --- | --- | --- |
| `VITE_SITE_ORIGIN` | Build time | Canonical, alternate, social and sitemap origin, with no trailing slash |
| `VITE_DEMO_ENDPOINT` | Browser build | Public form API URL, defaults to `/api/demo` |
| `DEMO_DELIVERY_URL` | Server only | Webhook that receives validated demo requests |
| `DEMO_DELIVERY_TOKEN` | Server only | Optional Bearer credential for the webhook |
| `SITE_ORIGIN` | Server only | Exact website origin allowed to post, including scheme/port |
| `PORT` | Node server | Defaults to 4173 |

`VITE_` variables are public and embedded in browser JavaScript. Never put secrets in them. `virsme.example` is a placeholder, not a company-domain claim. A private preview build may use its private Sites origin. Rebuild after changing public environment variables.

## Hosting and demo delivery

The static site can be hosted from `dist/`. Serve directory index files for locale paths and use the generated 404 document. Do not rewrite every unknown URL into an empty application shell.

Static-only hosting cannot run the included Node API. Either deploy the Node server behind your application host/reverse proxy, or deploy an equivalent serverless adapter around `server/demo-handler.ts` and point `VITE_DEMO_ENDPOINT` to it. The Sites preview is static unless an external API is explicitly configured.

The server applies the shared Zod schema, body-size and content-type limits, exact Origin checks, a honeypot and elapsed-time validation. The delivery adapter performs an HTTPS JSON POST and accepts success only after the destination returns a successful response. It does not follow webhook redirects. Local HTTP destinations are allowed only outside production, for testing.

Request fields: `name`, `company`, `email`, `phone`, `country`, `employees`, `workflow`, `tools`, `language`, `meetingTime`, `website` (honeypot), and `startedAt` (milliseconds). The webhook receives `type: workflow_demo` and the business fields; spam fields are removed. Optional Bearer authorization is configured server-side.

To switch delivery provider, change the environment URL/token if the provider accepts this webhook contract, or replace the outbound adapter in `handleDemo`. Keep shared validation and return `{ "ok": true }` only after confirmed delivery. Missing configuration returns 503. Failed delivery returns 502. The browser shows an accessible failure, never a false success. Development logging reports the missing configuration without logging submitted personal data.

## Content and localization

Each page has paired `src/content/<page>/en.json` and `ar.json` files. Content components accept data rather than embedding page prose. `src/content/types.ts` defines the contract; `src/content/index.ts` rejects missing namespaces instead of falling back to another language.

`src/content/ui.ts` contains shared navigation, form and accessibility copy. `src/content/previews.ts` contains anonymous dashboard concept text. When adding a string, add it to both locales and run `npm run check:content`. Structured page keys, block structures and shared UI keys are checked during builds. Array length differences in approved page copy are explicitly documented, not treated as complete translation parity.

The original PDF contains shorter Arabic sections. Only supplied page copy was transcribed; missing marketing passages were not independently translated. See [Needs human verification](docs/needs-human-verification.md) for the exact gaps and newly authored utility copy needing review.

English and Arabic use locale-prefixed routes and appropriate document language/direction. Fonts are self-hosted Inter and Noto Sans Arabic. Layout uses logical properties; product names use bidirectional isolation. The language switch preserves the page, query/hash and requested scroll offset.

## Components and visuals

- `Shell.tsx`: header, locale switch, native modal mobile menu, footer and breadcrumbs.
- `Content.tsx`: content blocks, headings, CTA bands and related links.
- `Diagrams.tsx`: Core architecture, workflow and AI operating-model diagrams.
- `DashboardPreview.tsx`: keyboard-operable People, Work, Sales and Connect concept tabs, anonymous records, reversible sample-step animation and intelligence preview.
- `DemoForm.tsx`: accessible validation, errors, pending and focused success states.
- `FaqAccordion.tsx`: native keyboard-operable disclosure.
- `SeoMeta.tsx`: metadata and safe JSON-LD serialization.
- `pages/Home.tsx` and `pages/Page.tsx`: outcome-led home and varied page-family compositions.
- `styles/tokens.css`: palette, font, radius, spacing and container tokens. `pages.css` defines section treatments; `refinements.css` adds the requested restrained logo-color gradients and dashboard visual system.

The dashboard previews are explicitly illustrative. They contain anonymous record labels, no employee names or profile photos, and no business performance numbers. Their controls change only the local demonstration. Animations are short, lightweight CSS transitions and keyframes. Reduced-motion preferences disable them.

Optimized WebP dashboard images in `public/images/` are exported from those same components with `node scripts/export-dashboard-images.mjs` while the production preview is running. They illustrate upcoming resource cards. They are not live product screenshots.

## Brand assets

`public/brand/logo.png` is the supplied original. Resized logo variants, a cropped icon and 16/32/180/512 favicons preserve geometry and color. `logo-white.png` follows the monochrome variant in Appendix A. Do not replace the logo with the different mark in the reference dashboard screenshot. Do not redraw, recolor or stretch it.

English and Arabic social images are generated from the approved logo and site typography by `scripts/social-assets.mjs`, with Vite running on port 5173. No stock or generated abstract artwork is used in the final site.

## SEO and analytics

Every page emits a unique title/description, canonical URL, English/Arabic/x-default alternatives and social metadata. Organization schema appears on Home, About and Facts. Internal pages have BreadcrumbList schema. No ratings, customer counts, prices or unsupported certifications are emitted. The Facts page exposes its September 2026 update date. Robots allows normal crawling; sitemap lists all 34 routes.

Install an analytics adapter by assigning `window.virsmeAnalytics = (event, detail) => { ... }` in your provider integration. `src/lib/analytics.ts` defines the approved event names. Event details contain locale/page context, not form fields. No provider is selected or loaded by default. Upcoming articles do not emit a fake click event; wire `resource_article_click` when real articles become available.

## Add a resource article

The hub presents only the supplied upcoming titles. Add approved bilingual article content and a verified author/date. Use `src/templates/ResourceArticle.tsx`, register the locale routes, add them to prerender/sitemap generation and link the card. The template emits Article schema only when rendered with actual article data. Until then it remains unregistered. Do not invent article bodies, authors or dates.

The security template is also unregistered and cannot be reached through navigation or sitemap. Enable it only after verified content is supplied.

## QA and handover

```sh
npx playwright install chromium
npm run preview
# In another terminal:
npm run test:browser
node tests/e2e-delivery.mjs
node scripts/qa-views.mjs
node scripts/lighthouse.mjs
```

Browser tests cover all 34 routes at 320, 375, 768, 1024, 1280 and 1600px, metadata, runtime errors, internal links, keyboard interactions, form states, reduced motion and axe checks. Local end-to-end delivery tests exercise the browser, actual API and a local webhook in both languages, without contacting a real recipient.

See [QA report](docs/qa-report.md), [screenshot index](docs/screenshots.md), and [Needs human verification](docs/needs-human-verification.md). Lighthouse measures local simulated mobile performance; real-user Core Web Vitals require post-launch field data.
