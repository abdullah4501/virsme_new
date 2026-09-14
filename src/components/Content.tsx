import { Fragment } from "react";
import { Link } from "react-router-dom";
import type { Block, Locale, PageName } from "../content/types";
import type {ContentSection} from '../lib/sections';
import { ui } from "../content/ui";
import { pathFor } from "../lib/routes";
import { track } from "../lib/analytics";
export function Text({ children }: { children: string }) {
  return (
    <>
      {children
        .split(
          /(VirSME(?: (?:AI|Core|Connect|People|Work|Sales|Experts))?|Country Packs|Industry Editions|Connect|People|Work|Sales|Core|AI|CRM|HCM|SOPs?)/g,
        )
        .map((part, i) =>
          /^(VirSME|Country Packs|Industry Editions|Connect|People|Work|Sales|Core|AI|CRM|HCM|SOP)/.test(
            part,
          ) ? (
            <bdi key={i} dir="ltr">
              {part}
            </bdi>
          ) : (
            <Fragment key={i}>{part}</Fragment>
          ),
        )}
    </>
  );
}
export function CopyBlocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) =>
        b.kind === "text" ? (
          <p key={i}>
            <Text>{b.text}</Text>
          </p>
        ) : b.kind === "list" ? (
          <ul className="check-list" key={i}>
            {b.items.map((item) => (
              <li key={item}>
                <Text>{item}</Text>
              </li>
            ))}
          </ul>
        ) : b.kind === "message" ? (
          <p className="message-line" key={i}>
            <Text>{b.text}</Text>
          </p>
        ) : null,
      )}
    </>
  );
}
export function SectionCopy({
  section,
  small = false,
  level,
}: {
  section: ContentSection;
  small?: boolean;
  level?: 2 | 3;
}) {
  return (
    <div className="section-copy">
      {(level===3 || (small && level!==2)) ? (
        <h3>
          <Text>{section.heading}</Text>
        </h3>
      ) : (
        <h2>
          <Text>{section.heading}</Text>
        </h2>
      )}
      <CopyBlocks blocks={section.blocks} />
    </div>
  );
}
export function CtaBand({
  locale,
  heading,
  body,
  secondary,
}: {
  locale: Locale;
  heading: string;
  body?: string;
  secondary?: string;
}) {
  const t = ui(locale);
  return (
    <section className="cta-band">
      <div className="container cta-inner">
        <div>
          <h2>
            <Text>{heading}</Text>
          </h2>
          {body && (
            <p>
              <Text>{body}</Text>
            </p>
          )}
        </div>
        <div className="cta-actions">
          <Link
            className="button"
            to={pathFor("book-demo", locale)}
            onClick={() => track("workflow_demo_click", { locale })}
          >
            {t.demo}
            <span aria-hidden="true">↗</span>
          </Link>
          {secondary && secondary !== t.demo && (
            <Link className="context-link" to={pathFor("book-demo", locale)}>
              {secondary}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
export function RelatedLinks({
  locale,
  pages,
}: {
  locale: Locale;
  pages: PageName[];
}) {
  const t = ui(locale);
  return (
    <div className="related-links">
      {pages.map((p) => (
        <Link key={p} to={pathFor(p, locale)}>
          {p === "platform"
            ? t.platform
            : p === "applications"
              ? t.applications
              : p === "ai"
                ? t.aiExplore
                : t.seeWorkflows}
        </Link>
      ))}
    </div>
  );
}
