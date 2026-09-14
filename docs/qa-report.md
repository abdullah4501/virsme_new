# Website verification

## Scope

The site contains 17 pages in two locales, with 34 prerendered HTML URLs. The latest design pass adds original conceptual dashboards for People, Work, Sales and Connect, an AI workflow preview, four locally exported WebP illustrations, restrained logo-color gradients and motion. All preview records are anonymous and explicitly illustrative.

## Checks

| Area | Result |
| --- | --- |
| Production build | TypeScript, client build, SSR build and all 34 prerendered routes pass |
| Lint | Pass |
| Clean installation | Fresh `npm ci` and production build pass in an isolated temporary directory |
| Content structure | All 17 paired namespaces pass; shared interface and dashboard keys and array lengths match |
| Functional browser suite | 13 tests cover both locales, dashboard keyboard tabs and replay, form states, dialogs, links, metadata and screenshots |
| Responsive layouts | All 34 URLs checked at 320, 375, 768, 1024, 1280 and 1600px with no horizontal overflow |
| Automated accessibility | axe WCAG checks across all 34 pages; reports in `axe-en.json` and `axe-ar.json` |
| Keyboard and motion | Native menu focus/Escape behavior, locale-aware tab arrows and reduced motion checked |
| Demo endpoint | Seven server tests pass, including validation, spam controls, absent configuration and delivery failures |
| End-to-end delivery | Both locales exercised through a real local API and temporary local webhook; no external recipient contacted |
| SEO | One H1, title, description, canonical, locale alternates, sitemap and robots; contextual structured data |
| Visual captures | Eight pages, two locales, desktop/mobile: 32 screenshots; see `screenshots.md` |
| Dashboard privacy | No names or identities copied from the reference screenshot |

## Performance

Eight mobile Lighthouse reports cover Home, Platform, AI and Book Demo in both locales. See `lighthouse-summary.json` for measured scores and the ignored local `lighthouse/` directory for complete reports. These are local simulated mobile runs, not field Core Web Vitals. The local preview serves uncompressed responses; performance still needs measurement on the intended production host. Scores are reported as measured rather than claiming a performance target is met.

## Review limits

Automated accessibility checks and visual inspection do not replace testing by native Arabic readers or assistive-technology users. Supplied Arabic marketing content is shorter than English on several pages. Missing text has not been invented. Legal content, final origin and live demo delivery require owner input before public launch. See `needs-human-verification.md` for the detailed ledger.

The Sites build helper was attempted but its Windows npm shim resolved an invalid local npm path. The equivalent `npm run build` completed successfully and produced the validated static output.
