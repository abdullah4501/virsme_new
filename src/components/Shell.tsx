import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import type { Locale, PageName } from "../content/types";
import { pageNames } from "../content/types";
import { ui } from "../content/ui";
import { pathFor } from "../lib/routes";
import { track } from "../lib/analytics";
const navPages: PageName[] = [
  "home",
  "platform",
  "applications",
  "ai",
  "workflows",
  "why-virsme",
  "resources",
  "pricing",
];
export function Header({ locale, page }: { locale: Locale; page: PageName }) {
  const t = ui(locale),
    dialog = useRef<HTMLDialogElement>(null),
    location = useLocation();
  const other: Locale = locale === "en" ? "ar" : "en";
  useEffect(() => {
    dialog.current?.close();
  }, [location.pathname]);
  const switchLocale = () => {
    sessionStorage.setItem("virsme-scroll", String(window.scrollY));
    track("locale_switch", { locale: other });
  };
  const links = (
    <>
      {navPages.map((p, i) => (
        <Link
          key={p}
          to={pathFor(p, locale)}
          aria-current={p === page ? "page" : undefined}
        >
          {t.nav[i]}
        </Link>
      ))}
    </>
  );
  return (
    <>
      <a className="skip-link" href="#main">
        {t.skip}
      </a>
      <header className="site-header">
        <div className="header-inner">
          <Link
            className="brand"
            to={pathFor("home", locale)}
            aria-label={t.home}
          >
            <img src="/brand/logo.png" width="613" height="161" alt="VirSME" />
          </Link>
          <nav className="desktop-nav" aria-label={t.navigation}>
            {links}
          </nav>
          <div className="header-actions">
            <Link
              className="locale-switch"
              to={`${pathFor(page, other)}${location.search}${location.hash}`}
              onClick={switchLocale}
              lang={other}
              aria-label={t.languageLabel}
            >
              <span aria-hidden="true">◎</span>
              {t.language}
            </Link>
            <Link
              className="button header-cta"
              to={pathFor("book-demo", locale)}
              onClick={() => track("nav_demo_click", { locale })}
            >
              {t.demo}
            </Link>
            <button
              className="menu-button"
              onClick={() => dialog.current?.showModal()}
              aria-label={t.menu}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>
      <dialog
        className="mobile-dialog"
        ref={dialog}
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current?.close();
        }}
      >
        <div className="mobile-panel">
          <div className="mobile-top">
            <img src="/brand/logo.png" width="150" height="39" alt="VirSME" />
            <button
              className="icon-button"
              onClick={() => dialog.current?.close()}
              aria-label={t.close}
            >
              ×
            </button>
          </div>
          <nav aria-label={t.navigation}>{links}</nav>
          <Link
            className="button"
            to={pathFor("book-demo", locale)}
            onClick={() => track("nav_demo_click", { locale })}
          >
            {t.demo}
          </Link>
        </div>
      </dialog>
    </>
  );
}
export function Footer({ locale }: { locale: Locale }) {
  const t = ui(locale),
    [legal, setLegal] = useState(""),
    dialog = useRef<HTMLDialogElement>(null);
  const groups: PageName[][] = [
    ["platform", "applications", "ai", "workflows", "ecosystem"],
    ["about", "facts", "book-demo"],
    ["resources", "implementation"],
  ];
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Link to={pathFor("home", locale)}>
            <img src="/brand/logo.png" alt="VirSME" width="613" height="161" />
          </Link>
          <p>{t.footerNote}</p>
        </div>
        {groups.map((items, i) => (
          <div key={i}>
            <h2>{t.groups[i]}</h2>
            {items.map((p) => (
              <Link key={p} to={pathFor(p, locale)}>
                {t.pageNames[pageNames.indexOf(p)]}
              </Link>
            ))}
          </div>
        ))}
        <div>
          <h2>{t.groups[3]}</h2>
          {t.legal.map((label) => (
            <button
              className="footer-link"
              key={label}
              onClick={() => {
                setLegal(label);
                dialog.current?.showModal();
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 {t.copyright}</span>
        <span>{t.tagline}</span>
      </div>
      <dialog ref={dialog} className="legal-dialog">
        <button
          className="icon-button"
          onClick={() => dialog.current?.close()}
          aria-label={t.close}
        >
          ×
        </button>
        <h2>{legal}</h2>
        <p>{t.legalPending}</p>
      </dialog>
    </footer>
  );
}
export function Breadcrumbs({
  locale,
  page,
}: {
  locale: Locale;
  page: PageName;
}) {
  const t = ui(locale);
  return (
    <nav className="breadcrumbs" aria-label={t.breadcrumb}>
      <Link to={pathFor("home", locale)}>{t.pageNames[0]}</Link>
      <span aria-hidden="true">/</span>
      {["connect", "people", "work", "sales"].includes(page) && (
        <>
          <Link to={pathFor("applications", locale)}>{t.pageNames[2]}</Link>
          <span aria-hidden="true">/</span>
        </>
      )}
      <span aria-current="page">{t.pageNames[pageNames.indexOf(page)]}</span>
    </nav>
  );
}
