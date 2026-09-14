import { Link } from "react-router-dom";
import type { Locale, PageName } from "../content/types";
import { content } from "../content";
import { ui } from "../content/ui";
import { pathFor } from "../lib/routes";
import { track } from "../lib/analytics";
import { Breadcrumbs } from "../components/Shell";
import {
  AiOperatingModelDiagram,
  CoreArchitectureDiagram,
  WorkflowVisual,
  ModuleIcon,
} from "../components/Diagrams";
import {
  Text,
  SectionCopy,
  CopyBlocks,
  CtaBand,
  RelatedLinks,
} from "../components/Content";
import {sections} from '../lib/sections';
import {FaqAccordion} from '../components/FaqAccordion';
import { DemoForm } from "../components/DemoForm";
export default function Page({
  locale,
  page,
}: {
  locale: Locale;
  page: PageName;
}) {
  const p = content(page, locale),
    t = ui(locale),
    s = sections(p),
    moduleIndex = ["connect", "people", "work", "sales"].indexOf(page),
    isModule = moduleIndex >= 0;
  const visual =
    page === "ai" ? (
      <AiOperatingModelDiagram locale={locale} />
    ) : page === "platform" ? (
      <CoreArchitectureDiagram locale={locale} />
    ) : isModule ? (
      <WorkflowVisual
        locale={locale}
        variant={
          page === "sales"
            ? 1
            : page === "connect"
              ? 2
              : page === "work"
                ? 3
                : 0
        }
      />
    ) : null;
  const cta = p.blocks.findLast((b) => b.kind === "cta")?.text;
  return (
    <div className={`page page-${page}`}>
      <section className={`page-hero ${visual ? "has-visual" : ""}`}>
        <div className="container">
          <Breadcrumbs locale={locale} page={page} />
          <div className="page-hero-grid">
            <div>
              {isModule && (
                <div className="module-heading">
                  <span className={`module-icon accent-${moduleIndex}`}>
                    <ModuleIcon index={moduleIndex} />
                  </span>
                  <span dir="ltr">
                    VirSME{" "}
                    {
                      t.pageNames[
                        ["connect", "people", "work", "sales"].indexOf(page) + 3
                      ]
                    }
                  </span>
                  <span className="status-label">{t.established}</span>
                </div>
              )}
              <h1>
                <Text>{p.hero}</Text>
              </h1>
              {p.intro && (
                <p className="page-intro">
                  <Text>{p.intro}</Text>
                </p>
              )}
              {!["facts", "resources", "book-demo"].includes(page) && (
                <div className="hero-buttons">
                  <Link
                    className="button"
                    to={pathFor("book-demo", locale)}
                    onClick={() => track("hero_demo_click", { locale, page })}
                  >
                    {t.demo}
                    <span aria-hidden="true">↗</span>
                  </Link>
                </div>
              )}
              {page === "facts" && (
                <p className="updated">
                  {t.updated}: <time dateTime="2026-09">{t.factsDate}</time>
                </p>
              )}
            </div>
            {visual}
          </div>
        </div>
      </section>
      {page === "book-demo" ? (
        <div className="container demo-layout">
          <div className="demo-context">
            {s
              .filter((v) => !["Form fields"].includes(v.heading))
              .map((v,i) => i===0 ? <SectionCopy key={v.heading} section={v} small level={2}/> : <FaqAccordion key={v.heading} section={v}/>)}
          </div>
          <DemoForm locale={locale} />
        </div>
      ) : page === "facts" ? (
        <div className="container facts-layout">
          <aside>
            <img src="/brand/icon.png" alt="" width="50" height="58" />
            <p>{t.category}</p>
            <RelatedLinks
              locale={locale}
              pages={["platform", "applications", "ai"]}
            />
          </aside>
          <div className="facts-prose">
            {s
              .filter((v) => !["Last updated", "آخر تحديث"].includes(v.heading))
              .map((v) => (
                <section key={v.heading}>
                  <SectionCopy section={v} small level={2}/>
                </section>
              ))}
          </div>
        </div>
      ) : page === "implementation" ? (
        <div className="container section implementation-layout">
          <div className="implementation-aside">
            <span className="section-rule" />
            <h2>{p.intro}</h2>
            <Link className="text-link" to={pathFor("book-demo", locale)}>
              {t.demo}
            </Link>
          </div>
          <ol className="implementation-timeline">
            {s.map((v, i) => (
              <li key={v.heading}>
                <span>{i + 1}</span>
                <div>
                  <h2>
                    <Text>{v.heading.replace(/^\d+\.\s*/, "")}</Text>
                  </h2>
                  <CopyBlocks blocks={v.blocks} />
                </div>
              </li>
            ))}
          </ol>
        </div>
      ) : page === "applications" ? (
        <div className="container section application-list">
          {s.slice(0, 4).map((v, i) => (
            <section
              key={v.heading}
              className={`application-row application-row-${i}`}
            >
              <div className={`module-icon accent-${i}`}>
                <ModuleIcon index={i} />
              </div>
              <SectionCopy section={v} />
              <Link
                className="text-link"
                to={pathFor(
                  ["connect", "people", "work", "sales"][i] as PageName,
                  locale,
                )}
              >
                {t.viewModule} <bdi>{v.heading}</bdi>
                <span aria-hidden="true"> ↗</span>
              </Link>
            </section>
          ))}
          <div className="application-together">
            <SectionCopy section={s[4]} />
            <CoreArchitectureDiagram locale={locale} />
          </div>
        </div>
      ) : page === "workflows" ? (
        <div className="container section workflows-list">
          {s.map((v, i) => (
            <section className="workflow-example" key={v.heading}>
              <SectionCopy section={v} />
              {i < (locale === "en" ? 4 : 3) && (
                <WorkflowVisual
                  locale={locale}
                  variant={locale === "ar" && i === 2 ? 3 : i}
                />
              )}
            </section>
          ))}
        </div>
      ) : page === "why-virsme" ? (
        <div className="container section">
          <div className="decision-grid">
            {s.slice(0, 2).map((v, i) => (
              <div key={v.heading} className={`decision decision-${i}`}>
                <span className="decision-mark" aria-hidden="true">
                  {i ? "▦" : "◻"}
                </span>
                <SectionCopy section={v} />
              </div>
            ))}
          </div>
          <div className="difference-grid">
            {s.slice(2).map((v) => (
              <SectionCopy key={v.heading} section={v} small />
            ))}
          </div>
        </div>
      ) : page === "ecosystem" ? (
        <div className="container section ecosystem-content">
          <section className="established-block">
            <span className="status-label">{t.established}</span>
            <SectionCopy section={s[0]} />
          </section>
          <div className="roadmap-block">
            <span className="roadmap-label">{t.roadmap}</span>
            {s.slice(1).map((v) => (
              <section key={v.heading}>
                <SectionCopy section={v} small />
              </section>
            ))}
          </div>
        </div>
      ) : page === "resources" ? (
        <div className="container section resources-content">
          <div className="resource-categories">
            <h2>{s[0].heading}</h2>
            <div>
              {s[0].blocks
                .find((b) => b.kind === "list")
                ?.items.map((item) => (
                  <span key={item}>
                    <Text>{item}</Text>
                  </span>
                ))}
            </div>
          </div>
          {locale === "en" && (
            <>
              <h2 className="article-heading">{t.upcoming}</h2>
              <div className="article-grid">
                {s[1].blocks
                  .find((b) => b.kind === "list")
                  ?.items.map((item, i) => (
                    <article className="article-card" key={item}>
                      <div
                        className={`article-art article-art-${i % 4}`}
                        aria-hidden="true"
                      >
                        <span />
                        <span />
                        <span />
                      </div>
                      <span className="coming-soon">{t.soon}</span>
                      <h3>{item}</h3>
                    </article>
                  ))}
              </div>
            </>
          )}
        </div>
      ) : page === "pricing" ? (
        <div className="container section pricing-content">
          {s.map((v, i) => (
            <section
              className={`pricing-section pricing-section-${i}`}
              key={v.heading}
            >
              <SectionCopy section={v} />
            </section>
          ))}
        </div>
      ) : (
        <div
          className={`container section editorial-content ${isModule ? "module-content" : ""}`}
        >
          {s.map((v, i) => (
            <section
              key={`${v.heading}-${i}`}
              className={`editorial-section ${v.blocks.some((b) => b.kind === "list") ? "has-list" : ""}`}
            >
              <SectionCopy section={v} />
              {isModule && i === 0 && (
                <div
                  className={`module-monogram accent-${moduleIndex}`}
                  aria-hidden="true"
                >
                  <ModuleIcon index={moduleIndex} />
                  <span>
                    {["Connect", "People", "Work", "Sales"][moduleIndex]}
                  </span>
                </div>
              )}
            </section>
          ))}
        </div>
      )}
      {!["book-demo", "facts", "resources"].includes(page) && (
        <CtaBand
          locale={locale}
          heading={ui(locale).pageNames[15]}
          body={content("book-demo", locale).intro}
          secondary={cta}
        />
      )}
      {["facts", "resources"].includes(page) && (
        <div className="container related-section">
          <RelatedLinks
            locale={locale}
            pages={["platform", "applications", "ai", "workflows"]}
          />
        </div>
      )}
    </div>
  );
}
