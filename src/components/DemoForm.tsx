import { useRef, useState } from "react";
import type { FormEvent } from "react";
import type { Locale } from "../content/types";
import { ui } from "../content/ui";
import { demoSchema } from "../../shared/demo-schema";
import { track } from "../lib/analytics";
const fields = [
  "name",
  "company",
  "email",
  "phone",
  "country",
  "employees",
  "workflow",
  "tools",
  "language",
  "meetingTime",
] as const;
const mandatory = [
  "name",
  "company",
  "email",
  "country",
  "employees",
  "workflow",
  "language",
];
export function DemoForm({ locale }: { locale: Locale }) {
  const t = ui(locale),
    [errors, setErrors] = useState<Record<string, string>>({}),
    [state, setState] = useState<"idle" | "sending" | "success">("idle"),
    [failure, setFailure] = useState(""),
    start = useRef(0),
    form = useRef<HTMLFormElement>(null),
    success = useRef<HTMLDivElement>(null);
  const message = (code: string) =>
    code === "email"
      ? t.errorEmail
      : code === "length"
        ? t.errorLength
        : code === "number"
          ? t.errorNumber
          : t.errorRequired;
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state === "sending") return;
    setFailure("");
    setErrors({});
    track("demo_form_submit", { locale });
    const values = Object.fromEntries(new FormData(e.currentTarget));
    const data = { ...values, startedAt: start.current };
    const parsed = demoSchema.safeParse(data);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues)
        errs[String(issue.path[0])] = message(issue.message);
      setErrors(errs);
      requestAnimationFrame(() =>
        form.current
          ?.querySelector<HTMLElement>(`[name="${Object.keys(errs)[0]}"]`)
          ?.focus(),
      );
      return;
    }
    setState("sending");
    try {
      const response = await fetch(
        import.meta.env.VITE_DEMO_ENDPOINT || "/api/demo",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsed.data),
        },
      );
      const result = await response.json();
      if (!response.ok || result.ok !== true) {
        setFailure(
          response.status === 503
            ? t.errorUnavailable
            : response.status === 429
              ? t.errorSpam
              : t.errorGeneral,
        );
        setState("idle");
        return;
      }
      setState("success");
      track("demo_form_success", { locale });
      requestAnimationFrame(() => success.current?.focus());
    } catch {
      setFailure(t.errorGeneral);
      setState("idle");
    }
  }
  if (state === "success")
    return (
      <div className="form-success" ref={success} tabIndex={-1} role="status">
        <span aria-hidden="true">✓</span>
        <h2>{t.successTitle}</h2>
        <p>{t.success}</p>
      </div>
    );
  return (
    <form
      className="demo-form"
      ref={form}
      onSubmit={submit}
      noValidate
      onFocusCapture={() => {
        if (!start.current) {
          start.current = Date.now();
          track("demo_form_start", { locale });
        }
      }}
    >
      <h2>{t.formTitle}</h2>
      <p>{t.formIntro}</p>
      {Object.keys(errors).length > 0 && (
        <p className="form-alert" role="alert">
          {t.errorsTitle}
        </p>
      )}
      <div className="form-grid">
        {fields.map((name, i) => (
          <div className={`field field-${name}`} key={name}>
            <label htmlFor={`demo-${name}`}>
              {t.fields[i]}{" "}
              <span>{mandatory.includes(name) ? "*" : `(${t.optional})`}</span>
            </label>
            {name === "employees" || name === "language" ? (
              <select
                id={`demo-${name}`}
                name={name}
                defaultValue={name === "language" ? locale : ""}
                required={mandatory.includes(name)}
                aria-invalid={!!errors[name]}
                aria-describedby={errors[name] ? `error-${name}` : undefined}
              >
                {name === "employees" ? (
                  <>
                    <option value="">{t.select}</option>
                    {["1-10", "11-50", "51-200", "201-500", "501+"].map(
                      (v, j) => (
                        <option key={v} value={v}>
                          {t.employeeOptions[j]}
                        </option>
                      ),
                    )}
                  </>
                ) : (
                  ["en", "ar"].map((v, j) => (
                    <option key={v} value={v}>
                      {t.languages[j]}
                    </option>
                  ))
                )}
              </select>
            ) : name === "workflow" || name === "tools" ? (
              <textarea
                id={`demo-${name}`}
                name={name}
                rows={name === "workflow" ? 4 : 2}
                maxLength={name === "workflow" ? 3000 : 1000}
                required={mandatory.includes(name)}
                aria-invalid={!!errors[name]}
                aria-describedby={errors[name] ? `error-${name}` : undefined}
              />
            ) : (
              <input
                id={`demo-${name}`}
                name={name}
                type={
                  name === "email" ? "email" : name === "phone" ? "tel" : "text"
                }
                dir={name === "email" || name === "phone" ? "ltr" : undefined}
                autoComplete={
                  {
                    name: "name",
                    company: "organization",
                    email: "email",
                    phone: "tel",
                    country: "country-name",
                    meetingTime: "off",
                  }[name]
                }
                maxLength={name === "email" ? 254 : name === "phone" ? 80 : 200}
                required={mandatory.includes(name)}
                aria-invalid={!!errors[name]}
                aria-describedby={errors[name] ? `error-${name}` : undefined}
              />
            )}{" "}
            {errors[name] && (
              <p className="field-error" id={`error-${name}`}>
                {errors[name]}
              </p>
            )}
          </div>
        ))}
      </div>
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="website">{t.honeypot}</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      {failure && (
        <p className="form-alert" role="alert">
          {failure}
        </p>
      )}
      <button
        className="button form-submit"
        disabled={state === "sending"}
        type="submit"
      >
        {state === "sending" ? t.sending : t.submit}
      </button>
      <p className="required-note">* {t.required}</p>
    </form>
  );
}
