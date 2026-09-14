import { useId, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import type { Locale } from "../content/types";
import { previewCopy } from "../content/previews";
import type { PreviewMode } from "../content/previews";
import { ModuleIcon } from "./Diagrams";
const modes: PreviewMode[] = ["people", "work", "sales", "connect"];
const iconMap = [1, 2, 3, 0];
export function DashboardPreview({
  locale,
  initial = "people",
  compact = false,
}: {
  locale: Locale;
  initial?: PreviewMode;
  compact?: boolean;
}) {
  const [active, setActive] = useState(initial),
    [progress, setProgress] = useState(false),
    id = useId(),
    tabs = useRef<(HTMLButtonElement | null)[]>([]),
    t = previewCopy(locale),
    copy = t.modes[active];
  function select(mode: PreviewMode) {
    setActive(mode);
    setProgress(false);
  }
  function keyboard(e: KeyboardEvent<HTMLButtonElement>, i: number) {
    let next: number;
    if (e.key === "ArrowRight") next = (i + (locale === "ar" ? 3 : 1)) % 4;
    else if (e.key === "ArrowLeft") next = (i + (locale === "ar" ? 1 : 3)) % 4;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = 3;
    else return;
    e.preventDefault();
    select(modes[next]);
    tabs.current[next]?.focus();
  }
  return (
    <figure
      className={`dashboard-preview ${compact ? "preview-compact" : ""}`}
      data-module={active}
    >
      <div className="preview-glow" aria-hidden="true" />
      <div className="dashboard-window">
        <div className="dashboard-topbar">
          <div className="window-controls" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
          <span>{t.workspace}</span>
          <span className="workspace-state">
            <i />
            {t.connected}
          </span>
        </div>
        <div className="dashboard-workspace">
          <aside className="dashboard-sidebar" aria-hidden="true">
            <img src="/brand/icon.png" width="25" height="29" alt="" />
            {iconMap.map((index, i) => (
              <span
                key={index}
                className={modes[i] === active ? "selected" : ""}
              >
                <ModuleIcon index={index} />
              </span>
            ))}
            <span className="sidebar-ai">✧</span>
          </aside>
          <div className="dashboard-main">
            <div
              className="dashboard-tabs"
              role="tablist"
              aria-label={t.workspace}
            >
              {modes.map((mode, i) => (
                <button
                  ref={(node) => {
                    tabs.current[i] = node;
                  }}
                  key={mode}
                  type="button"
                  role="tab"
                  id={`${id}-${mode}-tab`}
                  aria-selected={mode === active}
                  aria-controls={`${id}-panel`}
                  tabIndex={mode === active ? 0 : -1}
                  onKeyDown={(e) => keyboard(e, i)}
                  onClick={() => select(mode)}
                >
                  <ModuleIcon index={iconMap[i]} />
                  <bdi>{t.modules[i]}</bdi>
                </button>
              ))}
            </div>
            <div
              role="tabpanel"
              id={`${id}-panel`}
              aria-labelledby={`${id}-${active}-tab`}
              className="dashboard-panel"
              key={active}
            >
              <div className="dashboard-title">
                <div>
                  <strong>{copy.title}</strong>
                  <p>{copy.subtitle}</p>
                </div>
                <span className="dashboard-filter" aria-hidden="true">
                  ≡
                </span>
              </div>
              <div className="dashboard-summary">
                {copy.cards.map((label, i) => (
                  <div key={label}>
                    <span>
                      {label}
                      <i aria-hidden="true">{["◈", "◇", "▦"][i]}</i>
                    </span>
                    <strong>{copy.values[i]}</strong>
                    <div className="summary-track" aria-hidden="true">
                      <i style={{ width: `${[85, 58, 72][i]}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="dashboard-records">
                <strong className="records-title">
                  {t.tableTitle}
                  <span aria-hidden="true">···</span>
                </strong>
                <div className="records-columns" aria-hidden="true">
                  {t.columns.map((c) => (
                    <span key={c}>{c}</span>
                  ))}
                </div>
                <div className="record-rows">
                  {copy.rows.map((row, i) => (
                    <div
                      className={`record-row ${progress && i === 1 ? "record-updated" : ""}`}
                      key={row[0]}
                    >
                      <span className="record-name">
                        <i
                          className={`record-avatar avatar-${i}`}
                          aria-hidden="true"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            width="15"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          >
                            <circle cx="12" cy="8" r="3" />
                            <path d="M5 20v-2a7 7 0 0 1 14 0v2" />
                          </svg>
                        </i>
                        {row[0]}
                      </span>
                      <span>{row[1]}</span>
                      <span className={`record-status status-${i}`}>
                        {progress && i === 1 ? "✓" : row[2]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div
                className={`dashboard-assistant ${progress ? "is-progressed" : ""}`}
              >
                <span className="assistant-spark" aria-hidden="true">
                  ✧
                </span>
                <div>
                  <strong dir="ltr">VirSME AI</strong>
                  <p role="status">{progress ? t.complete : t.pending}</p>
                </div>
                <button type="button" onClick={() => setProgress((v) => !v)}>
                  {progress ? t.reset : t.control}
                  <span aria-hidden="true">↗</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <figcaption>
        <span className="concept-dot" />
        {t.caption}
      </figcaption>
    </figure>
  );
}
export function IntelligencePreview({ locale }: { locale: Locale }) {
  const t = previewCopy(locale);
  return (
    <figure className="intelligence-preview">
      <figcaption>{t.caption}</figcaption>
      <div className="intelligence-top">
        <span className="intelligence-symbol" aria-hidden="true">
          ✧
        </span>
        <span dir="ltr">VirSME AI</span>
        <i />
      </div>
      <h2>{t.aiTitle}</h2>
      <p>{t.aiBody}</p>
      <div className="intelligence-context">
        {[t.context, t.policy, t.human].map((label, i) => (
          <div key={label}>
            <span
              className={`intelligence-check intelligence-check-${i}`}
              aria-hidden="true"
            >
              {i === 2 ? "◇" : "✓"}
            </span>
            <strong>{label}</strong>
            <span className="context-bar" aria-hidden="true">
              <i />
            </span>
          </div>
        ))}
      </div>
      <div className="intelligence-handoff">
        <span dir="ltr">People</span>
        <i aria-hidden="true" />
        <span dir="ltr">Work</span>
        <i aria-hidden="true" />
        <span dir="ltr">Connect</span>
      </div>
    </figure>
  );
}
