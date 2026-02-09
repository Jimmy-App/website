import Image from "next/image";
import Link from "next/link";

import {
  defaultLocale,
  localeBasePath,
  type SupportedLocale,
} from "@/lib/i18n";
import CookieSettingsButton from "@/components/site/CookieSettingsButton";

type SiteFooterContent = {
  brandLabel?: string;
  copyrightText?: string;
};

type SiteFooterProps = {
  content?: SiteFooterContent | null;
  currentLocale?: SupportedLocale;
};

const SiteFooter = ({ content, currentLocale }: SiteFooterProps) => {
  const currentYear = new Date().getFullYear();
  const locale = currentLocale || defaultLocale;
  const localeBase = localeBasePath(locale);
  const legalLinks = [
    { label: "Privacy Policy", href: `${localeBase}/privacy` },
    { label: "Terms", href: `${localeBase}/terms` },
    { label: "Cookie Policy", href: `${localeBase}/cookie-policy` },
  ];
  const resolvedBrandLabel = content?.brandLabel || "Jimmy";
  const resolvedCopyright =
    content?.copyrightText || "© {year} Just Jimmy LLC. Built for freedom.";
  const copyrightText = resolvedCopyright
    .replace("{year}", currentYear.toString())
    .replace("{{year}}", currentYear.toString());

  return (
    <footer className="border-t border-gray-100 bg-white py-8">
      <div className="mx-auto max-w-7xl px-4 text-center">
        <div className="mb-3 select-none">
          <Image
            src="/assets/logo/logo-full.svg"
            alt={`${resolvedBrandLabel} Logo`}
            width={180}
            height={72}
            className="mx-auto h-10 w-auto object-contain"
          />
        </div>
        <nav
          aria-label="Legal"
          className="mt-2 flex flex-wrap items-center justify-center gap-4"
        >
          {legalLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-800"
            >
              {link.label}
            </Link>
          ))}
          <CookieSettingsButton className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-800">
            Cookie Settings
          </CookieSettingsButton>
        </nav>
        <p className="mt-1 text-sm text-gray-400">{copyrightText}</p>
      </div>
    </footer>
  );
};

export type { SiteFooterContent };
export default SiteFooter;
