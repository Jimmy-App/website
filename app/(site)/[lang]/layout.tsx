import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { isSupportedLocale, supportedLocales } from "@/lib/i18n";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import type { SiteFooterContent } from "@/components/site/SiteFooter";
import CookieBanner, { type CookieBannerContent } from "@/components/cookie-banner";
import { sanityFetch } from "@/sanity/lib/fetch";
import { cookieBannerByLanguageQuery, footerByLanguageQuery } from "@/sanity/lib/queries";

export function generateStaticParams() {
  return supportedLocales.map((lang) => ({ lang }));
}

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ lang: string }>;
};

type FooterData = SiteFooterContent | null;
type CookieBannerData = CookieBannerContent | null;

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { lang } = await params;

  if (!isSupportedLocale(lang)) {
    notFound();
  }

  const footer = await sanityFetch<FooterData>({
    query: footerByLanguageQuery,
    params: { language: lang },
  });
  const cookieBanner = await sanityFetch<CookieBannerData>({
    query: cookieBannerByLanguageQuery,
    params: { language: lang },
  });
  const fallbackFooter =
    !footer && lang !== "en"
      ? await sanityFetch<FooterData>({
          query: footerByLanguageQuery,
          params: { language: "en" },
        })
      : null;
  const fallbackCookieBanner =
    !cookieBanner && lang !== "en"
      ? await sanityFetch<CookieBannerData>({
          query: cookieBannerByLanguageQuery,
          params: { language: "en" },
        })
      : null;

  return (
    <div className="site">
      <SiteHeader lang={lang} />
      <main>{children}</main>
      <SiteFooter content={footer || fallbackFooter} currentLocale={lang} />
      <CookieBanner
        content={cookieBanner || fallbackCookieBanner}
        currentLocale={lang}
      />
    </div>
  );
}
