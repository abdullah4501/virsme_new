# Needs human verification

The website implementation is ready for review. Public launch still requires the editorial and operational items below. All 17 pages have English and Arabic URLs; that does not imply the source supplied complete Arabic translations.

## Operational configuration

- Set the final production origin. The current local production configuration uses the private Sites preview origin. `virsme.example` is the safe fallback in source and `.env.example`, not an asserted company domain.
- Deploy the included server endpoint, or provide an equivalent endpoint, and configure `VITE_DEMO_ENDPOINT`. Static-only hosting cannot execute the included Node server.
- Set server-only `DEMO_DELIVERY_URL`, optional `DEMO_DELIVERY_TOKEN`, and exact `SITE_ORIGIN`. No real destination or recipient was supplied. Without it, the endpoint returns a failure and the form never claims successful delivery.
- Confirm required/optional form choices. Name, company, email, country, employee range, workflow and language are required. Phone, current tools and preferred meeting time are optional. Employee ranges are interface choices, not product pricing tiers.
- Choose an analytics provider and connect `window.virsmeAnalytics`. No third-party analytics is loaded or personal form data transmitted to analytics by default.
- Privacy, Terms and Cookie notice are visibly labelled preparation notices in dialogs, not approved legal documents. Supply approved copy before public launch. No nonessential cookies are currently set.
- The security template is unregistered and omitted from navigation and sitemap. Supply verified material before enabling it.

## Arabic source gaps

Supplied Arabic copy is used where present. Missing marketing sections were not machine-translated and are not silently replaced with English. The following table records absent or shorter material relative to the English source.

| Page | Content needing approved Arabic |
| --- | --- |
| Home | Research/proof paragraph; fourth value block on human control; module descriptions; separate workflow example; differentiation; adoption; urgency sections; several contextual CTAs |
| Platform | Workflow engine description; operating relationships and configuration sections; fuller shared-record explanation |
| Applications | Expanded People detail and final explanation of Core/AI in the shared workflow |
| Connect | Connected collaboration section and fourth outcome |
| People | Five business outcomes |
| Work | Business-context section and business outcomes |
| Sales | Five business outcomes |
| AI | Both worked examples and Arabic equivalents of the four-layer descriptions outside Section 8 |
| Workflows | Client-request-to-action example and closing workflow-starting-point paragraph |
| Implementation | Seventh step, expansion |
| Why VirSME | Detailed explanations under the six differentiators and fuller single-department explanation |
| Pricing | Future-expansion factor and how-pricing-works paragraph |
| Ecosystem | Dedicated Finance paragraph; separate Country Packs and Industry Editions descriptions; roadmap principle |
| About | Future-direction section and final two product principles |
| Facts | Audience, Core definition and future-direction answers |
| Book Demo | Final workflow example and all form/validation/success microcopy |
| Resources | Eighth category and all eight launch article titles |

Arabic source text extraction contained glyph-order and font-mapping errors. Transcription was checked against rendered pages for key sections. A native business-language review remains required, including punctuation and diacritics. The supplied colloquial demo headline is retained rather than independently rewritten.

## New interface copy and metadata

- `src/content/ui.ts` contains newly authored navigation, form errors/success, legal preparation notices, diagram labels and accessibility labels. Arabic versions need native review. The primary Arabic CTA is the exact string from the user's request.
- `src/content/previews.ts` contains the user-requested dashboard concept labels. All records are anonymous illustrative labels. They contain no real employee/customer identities or commercial metrics. The controls demonstrate a local visual transition only and do not operate VirSME or approve an actual business action.
- All 17 Arabic metadata titles are derived from the supplied Arabic headline, prefixed with VirSME. Descriptions reuse the supplied intro; Resources uses its headline. These are proposed metadata, not supplied approved SEO lines.
- English metadata is transcribed from the PDF. A line-break artifact in the Why VirSME description was normalized from `SOP- aware` to `SOP-aware`.
- Resources editorial instructions about publishing/search strategy were omitted from audience-facing introductions in both locales. The approved headline, categories and available titles are retained. Articles remain upcoming; no fake articles or Article schema are published.
- The Facts maintenance instruction is omitted from public prose. The visible September 2026 date is retained.
- Primary actions consistently use Book a Workflow Demo. Contextual PDF CTA wording is retained as secondary links where applicable. This resolves the conflict between global and page-specific CTA wording.
- The later user direction authorizes logo-color gradients and dashboard-style visuals. These supersede the initial restrictions against decorative gradients. Main copy stays dark; accents are restrained.

## Product claims and assets

- Current product positioning, testing claims, active onboarding, Core/AI descriptions and module depth come from the supplied specification. The site does not independently verify product readiness or technical implementation. Obtain product-owner sign-off before public launch.
- Four established application modules are distinct from future areas. Finance is only in future-direction content.
- No customer names, testimonials, revenue, ROI, customer totals, certifications or integration claims were added.
- The Salesforce research paragraph and its four figures are the sole external quantitative claim. The supplied report is linked. Reconfirm the report citation before public launch.
- The original logo is preserved. Cropped icon and resized favicons preserve geometry/colors; the white monochrome variant follows Appendix A. The 613px source limits useful raster resolution; supply official vectors if larger physical reproduction is needed.
- Dashboard images are exported from the authored conceptual components, not photographs or verified live application screenshots. Their captions make that distinction visible. No private names from the user's reference screenshot are reproduced.
- Two abstract image explorations were rejected by the user and are not included in the website.

## QA limits

- Automated accessibility checks and keyboard tests are evidence, not a WCAG certification.
- Lighthouse values are simulated local mobile lab measurements. Real-user Core Web Vitals, especially INP, require post-launch field data.
- Form success was tested against a local webhook in both languages. Live provider delivery cannot be verified until a real endpoint is configured.
- English and Arabic content-key parity passes structurally. The missing Arabic editorial content above remains an explicit launch blocker for full translation parity.
