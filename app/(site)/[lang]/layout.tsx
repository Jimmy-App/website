import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { isSupportedLocale, localeBasePath, supportedLocales } from "@/lib/i18n";

export function generateStaticParams() {
  return supportedLocales.map((lang) => ({ lang }));
}

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ lang: string }>;
};

const navItems = [
  { label: "Home", href: "" },
  { label: "Solutions", href: "#solutions", hasMenu: true },
  { label: "Resources", href: "#resources", hasMenu: true },
  { label: "Pricing", href: "#pricing" },
];

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { lang } = await params;

  if (!isSupportedLocale(lang)) {
    notFound();
  }
  const basePath = localeBasePath(lang) || "/";

  return (
    <div className="site">
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
                const href = localeBasePath(locale) || "/";

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
      <main>{children}</main>
    </div>
  );
}
