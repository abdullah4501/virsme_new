import { Link } from "react-router-dom";
import { content } from "../content";
import { ui } from "../content/ui";
import type { Locale, PageName } from "../content/types";
import { pathFor } from "../lib/routes";
import { track } from "../lib/analytics";
import {
  CoreArchitectureDiagram,
  WorkflowVisual,
  ModuleIcon,
  OperatingChoiceIcon,
} from "../components/Diagrams";
import { Text, SectionCopy, CopyBlocks, CtaBand } from "../components/Content";
import { sections } from "../lib/sections";
import {
  DashboardPreview,
  IntelligencePreview,
} from "../components/DashboardPreview";
export default function Home({ locale }: { locale: Locale }) {
  const p = content("home", locale),
    t = ui(locale),
    s = sections(p),
    split = p.hero.indexOf(",");
  const en = locale === "en";
  const problem = s[0],
    values = en ? s.slice(3, 7) : s.slice(2, 5),
    valueIntro = s[en ? 2 : 1],
    modules = s[en ? 7 : 5],
    ai = s[en ? 9 : 6],
    final = s.at(-1)!;
  const modulePages: PageName[] = ["connect", "people", "work", "sales"];
  return (
    <>
      <div className="home-hero-surface">
      <section className="home-hero container">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="live-dot" />
            {p.eyebrow}
          </div>
          <h1>
            {en ? (
              <>
                {p.hero.slice(0, split + 1)}
                <br />
                <span>{p.hero.slice(split + 2)}</span>
              </>
            ) : (
              <Text>{p.hero}</Text>
            )}
          </h1>
          <p className="hero-description">
            <Text>{p.intro}</Text>
          </p>
          <div className="hero-buttons">
            <Link
              className="button"
              to={pathFor("book-demo", locale)}
              onClick={() => track("hero_demo_click", { locale })}
            >
              {t.demo}
              <span aria-hidden="true">↗</span>
            </Link>
            <Link
              className="button button-secondary"
              to={pathFor("platform", locale)}
              onClick={() => track("platform_cta_click", { locale })}
            >
              {t.platform}
            </Link>
          </div>
          <p className="hero-message">
            <Text>
              {p.blocks.find((b) => b.kind === "message")?.text ?? ""}
            </Text>
          </p>
        </div>
        <DashboardPreview locale={locale} compact />
      </section>
      </div>
      <div className="trust-band">
        <div className="container">
          <span className="trust-mark" aria-hidden="true">
            ✓
          </span>
          <p>{p.blocks.find((b) => b.kind === "trust")?.text}</p>
        </div>
      </div>
      <section className="section container problem-section">
        <div className="problem-heading">
          <span className="section-rule" />
          <h2>
            <Text>{problem.heading}</Text>
          </h2>
          {problem.blocks
            .filter((b) => b.kind === "text")
            .map((b, i) => (
              <p key={i}>{b.text}</p>
            ))}
        </div>
        <div className="problem-list">
          <CopyBlocks
            blocks={problem.blocks.filter((b) => b.kind === "list")}
          />
        </div>
      </section>
      {en && (
        <section className="proof-section">
          <div className="container">
            <h2>{s[1].heading}</h2>
            <div className="stat-grid">
              {["7", "53%", "46%", "44%"].map((n, i) => (
                <div key={n}>
                  <strong>{n}</strong>
                  <span>{t.stats[i]}</span>
                </div>
              ))}
            </div>
            <p className="proof-description">{s[1].blocks[0].text}</p>
            <a
              className="source-link"
              href="https://www.salesforce.com/en-us/wp-content/uploads/sites/4/documents/resources/smb-trends-report-6th-edition_Salesforce.pdf"
              target="_blank"
              rel="noreferrer"
            >
              {t.source}
            </a>
          </div>
        </section>
      )}
      <section className="section container">
        <div className="value-intro">
          <div className="section-heading">
            <SectionCopy section={valueIntro} />
          </div>
          <CoreArchitectureDiagram locale={locale} />
        </div>
        <div className="value-grid">
          {values.map((v, i) => (
            <div className="value-item" key={v.heading}>
              <span className="value-symbol" aria-hidden="true">
                {["◇", "⇄", "≡", "◎"][i]}
              </span>
              <SectionCopy section={v} small />
            </div>
          ))}
        </div>
      </section>
      <section className="modules-section section">
        <div className="container">
          <div className="section-heading horizontal-heading">
            <SectionCopy
              section={{
                ...modules,
                blocks: modules.blocks.filter((b) => b.kind === "text"),
              }}
            />
            <Link className="text-link" to={pathFor("applications", locale)}>
              {t.applications}
            </Link>
          </div>
          <div className="module-grid">
            {modulePages.map((m, i) => (
              <Link
                key={m}
                to={pathFor(m, locale)}
                className={`module-card module-card-${i}`}
              >
                <span className={`module-icon accent-${i}`}>
                  <ModuleIcon index={i} />
                </span>
                <h3 dir="ltr">{["Connect", "People", "Work", "Sales"][i]}</h3>
                <p>
                  <Text>
                    {en
                      ? modules.blocks
                          .find((b) => b.kind === "list")!
                          .items[i].split(" - ")[1]
                      : t.modules[i]}
                  </Text>
                </p>
                <span className="module-card-link">
                  {t.viewModule}{" "}
                  <bdi>{["Connect", "People", "Work", "Sales"][i]}</bdi>
                  <span aria-hidden="true">↗</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      {en && (
        <section className="section container workflow-section">
          <SectionCopy section={s[8]} />
          <WorkflowVisual locale={locale} />
          <Link
            className="text-link"
            to={pathFor("workflows", locale)}
            onClick={() => track("workflow_demo_click", { locale })}
          >
            {t.seeWorkflows}
          </Link>
        </section>
      )}
      <section className="section ai-section">
        <div className="container split-section">
          <div>
            <span className="product-label">
              <span aria-hidden="true">✧</span> VirSME AI
            </span>
            <SectionCopy section={ai} />
            <Link className="text-link" to={pathFor("ai", locale)}>
              {t.aiExplore}
            </Link>
          </div>
          <IntelligencePreview locale={locale} />
        </div>
      </section>
      {en && (
        <>
          <section className="section container split-section why-home">
            <SectionCopy section={s[10]} />
            <div className="operating-fork">
              <div>
                <span className="fork-symbol" aria-hidden="true">
                  <OperatingChoiceIcon />
                </span>
                <p>{content("why-virsme", locale).blocks[0].text}</p>
              </div>
              <div>
                <span className="fork-symbol" aria-hidden="true">
                  <OperatingChoiceIcon connected />
                </span>
                <p>{sections(content("why-virsme", locale))[1].heading}</p>
                <Link className="text-link" to={pathFor("why-virsme", locale)}>
                  {t.pageNames[10]}
                </Link>
              </div>
            </div>
          </section>
          <section className="adoption-section">
            <div className="container split-section">
              <SectionCopy section={s[11]} />
              <div className="adoption-path">
                {sections(content("implementation", locale))
                  .slice(0, 3)
                  .map((v) => (
                    <div key={v.heading}>
                      <span className="path-dot" />
                      <strong>{v.heading.replace(/^\d+\. /, "")}</strong>
                      <p>{v.blocks[0].text}</p>
                    </div>
                  ))}
                <Link
                  className="text-link"
                  to={pathFor("implementation", locale)}
                >
                  {t.pageNames[9]}
                </Link>
              </div>
            </div>
          </section>
          <section className="section container urgency-section">
            <SectionCopy section={s[12]} />
          </section>
        </>
      )}
      <CtaBand
        locale={locale}
        heading={final.heading}
        body={final.blocks.find((b) => b.kind === "text")?.text}
      />
    </>
  );
}
