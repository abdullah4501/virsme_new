import type { Locale } from "../content/types";
import { ui } from "../content/ui";
const names = ["Connect", "People", "Work", "Sales"];
export function OperatingChoiceIcon({ connected = false }: { connected?: boolean }) {
  return connected ? (
    <svg className="operating-choice-svg" viewBox="0 0 64 64" aria-hidden="true">
      <path className="choice-link" d="M18 17 29 28M46 17 35 28M18 47l11-11M46 47 35 36" />
      <circle className="choice-node node-blue" cx="14" cy="14" r="7" />
      <circle className="choice-node node-purple" cx="50" cy="14" r="7" />
      <circle className="choice-node node-green" cx="14" cy="50" r="7" />
      <circle className="choice-node node-blue" cx="50" cy="50" r="7" />
      <path className="choice-core" d="m32 22 10 6v12l-10 6-10-6V28l10-6Z" />
      <path className="choice-check" d="m27.5 34 3 3 6-7" />
    </svg>
  ) : (
    <svg className="operating-choice-svg" viewBox="0 0 64 64" aria-hidden="true">
      <rect className="choice-window" x="10" y="10" width="44" height="44" rx="11" />
      <path className="choice-window-top" d="M10 22h44" />
      <circle className="choice-dot node-green" cx="18" cy="16" r="2" />
      <circle className="choice-dot node-blue" cx="25" cy="16" r="2" />
      <path className="choice-focus" d="M20 31h24v14H20z" />
      <path className="choice-focus-line" d="M25 36h14M25 41h9" />
    </svg>
  );
}
export function ModuleIcon({ index }: { index: number }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {index === 0 ? (
        <>
          <path d="M5 4h14v11H9l-4 4V4Z" />
          <path d="M9 8h6M9 11h4" />
        </>
      ) : index === 1 ? (
        <>
          <circle cx="9" cy="8" r="3" />
          <path d="M3 20v-3a6 6 0 0 1 12 0v3M17 5a3 3 0 0 1 0 6M18 14a5 5 0 0 1 3 4v2" />
        </>
      ) : index === 2 ? (
        <>
          <rect x="4" y="4" width="16" height="16" rx="3" />
          <path d="m8 12 3 3 5-6" />
        </>
      ) : (
        <>
          <path d="M4 20V10m6 10V6m6 14V3M3 4l4 1 6-3" />
          <path d="M3 20h18" />
        </>
      )}
    </svg>
  );
}
export function CoreArchitectureDiagram({ locale }: { locale: Locale }) {
  const t = ui(locale);
  return (
    <figure className="architecture">
      <figcaption>
        <span className="live-dot" />
        {t.concept}
      </figcaption>
      <div className="architecture-stage">
        <svg
          className="connections"
          viewBox="0 0 540 410"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M125 108H270V205M415 108H270M125 303H270V205M415 303H270" />
          <circle cx="270" cy="205" r="77" />
          <circle className="orbit" cx="270" cy="205" r="101" />
        </svg>
        <div className="core-node">
          <img src="/brand/icon.png" alt="" width="38" height="44" />
          <strong dir="ltr">VirSME Core</strong>
          <span>{t.foundation}</span>
        </div>
        {names.map((name, i) => (
          <div key={name} className={`module-node module-${i}`}>
            <span className={`module-icon accent-${i}`}>
              <ModuleIcon index={i} />
            </span>
            <strong dir="ltr">{name}</strong>
            <small>{t.modules[i]}</small>
          </div>
        ))}
      </div>
      <div className="ai-rail">
        <span className="sparkle" aria-hidden="true">
          ✧
        </span>
        <strong dir="ltr">VirSME AI</strong>
        <span>{t.ai}</span>
        <span className="rail-dot" />
      </div>
    </figure>
  );
}
export function WorkflowVisual({
  locale,
  variant = 0,
}: {
  locale: Locale;
  variant?: number;
}) {
  const t = ui(locale),
    steps = [t.steps, t.salesSteps, t.requestSteps, t.approvalSteps][variant],
    artwork = ["people", "policy", "work", "connect"],
    moduleIcons = variant === 1 ? [3, -1, 2, 0] : [1, -1, 2, 0];
  return (
    <figure className="workflow-visual">
      <figcaption>{t.concept}</figcaption>
      <div className="workflow-start">
        <span className="live-dot" />
        {t.event}
      </div>
      <ol className="workflow-chain">
        {steps.map((step, i) => (
          <li key={step}>
            <div className="workflow-step-art" aria-hidden="true">
              <img src={`/images/workflow-${artwork[i]}.webp`} alt="" />
              <span className="workflow-module-mark">
                {moduleIcons[i] < 0 ? (
                  <img src="/brand/icon.png" alt="" />
                ) : (
                  <ModuleIcon index={moduleIcons[i]} />
                )}
              </span>
            </div>
            <div className="workflow-step-copy">
              <span className="step-number">{i + 1}</span>
              <span>
                <strong>{step}</strong>
                <small dir="ltr">
                  {
                    (variant === 1
                      ? ["Sales", "Core", "Work", "Connect"]
                      : ["People", "Core", "Work", "Connect"])[i]
                  }
                </small>
              </span>
            </div>
          </li>
        ))}
      </ol>
      <div className="approval-point">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <path d="m12 3 8 4v5c0 5-8 9-8 9s-8-4-8-9V7l8-4Z" />
          <path d="m8 12 3 3 5-6" />
        </svg>
        {t.approval}
        <span>{t.completed}</span>
      </div>
    </figure>
  );
}
export function AiOperatingModelDiagram({ locale }: { locale: Locale }) {
  const t = ui(locale);
  return (
    <figure className="ai-model">
      <figcaption>{t.concept}</figcaption>
      <div className="ai-layers">
        {[t.context, t.process, t.controls, t.authority].map((s, i) => (
          <div key={s}>
            <span className="layer-symbol" aria-hidden="true">
              {["◈", "≡", "◇", "◎"][i]}
            </span>
            <strong>{s}</strong>
          </div>
        ))}
      </div>
      <div className="ai-core">
        <span aria-hidden="true">✧</span>
        <strong dir="ltr">VirSME AI</strong>
        <small>{t.approval}</small>
      </div>
    </figure>
  );
}
