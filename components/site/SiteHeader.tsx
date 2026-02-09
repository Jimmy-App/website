"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { localeBasePath, supportedLocales } from "@/lib/i18n";
import type { SupportedLocale } from "@/lib/i18n";

type SiteHeaderProps = {
  lang: SupportedLocale;
};

const navItems = [
  { label: "Home", href: "" },
  { label: "Solutions", href: "#solutions", hasMenu: true },
  { label: "Resources", href: "#resources", hasMenu: true },
  { label: "Pricing", href: "pricing" },
];

const SiteHeader = ({ lang }: SiteHeaderProps) => {
  const pathname = usePathname();
  const normalizedPath =
    pathname && pathname.endsWith("/") && pathname !== "/"
      ? pathname.slice(0, -1)
      : pathname;
  const isHome = normalizedPath === `/${lang}` || (normalizedPath === "/" && lang === "en");
  const isForCoachesPage = normalizedPath?.endsWith("/for-coaches");
  const isForClientsPage = normalizedPath?.endsWith("/for-clients");
  const isPricingPage = normalizedPath?.endsWith("/pricing");

  if (isHome || isForCoachesPage || isForClientsPage || isPricingPage) {
    return null;
  }

  const basePath = localeBasePath(lang);

  return (
    <header className="site-header">
      <Link className="brand" href={basePath}>
        <span className="brand-mark" aria-hidden="true" />
        <span className="brand-text">Jimmy</span>
      </Link>
      <nav className="nav-pill glass" aria-label="Primary">
        {navItems.map((item) => {
          const href = item.href.startsWith("#")
            ? `${basePath}${item.href}`
            : `${basePath}${item.href ? `/${item.href}` : ""}`;
          const isActive = item.label === "Home";

          return (
            <Link
              className={`nav-item${isActive ? " is-active" : ""}`}
              href={href}
              key={item.label}
            >
              <span>{item.label}</span>
              {item.hasMenu ? <span className="nav-caret" aria-hidden="true" /> : null}
            </Link>
          );
        })}
      </nav>
      <div className="header-actions">
        <details className="lang-menu glass">
          <summary className="lang-summary" aria-label="Language">
            <span className="lang-dot" aria-hidden="true" />
            {lang.toUpperCase()}
            <span className="nav-caret" aria-hidden="true" />
          </summary>
          <div className="lang-dropdown">
            {supportedLocales.map((locale) => {
              const href = localeBasePath(locale);

              return (
                <Link
                  className={`lang-link${locale === lang ? " is-active" : ""}`}
                  href={href}
                  key={locale}
                >
                  {locale.toUpperCase()}
                </Link>
              );
            })}
          </div>
        </details>
        <Link className="btn btn-primary" href={`${basePath}#get-started`}>
          Join Waitlist
        </Link>
      </div>
    </header>
  );
};

export default SiteHeader;
