import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { isSupportedLocale, supportedLocales } from "@/lib/i18n";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import type { SiteFooterContent } from "@/components/site/SiteFooter";
import { sanityFetch } from "@/sanity/lib/fetch";
import { footerByLanguageQuery } from "@/sanity/lib/queries";

export function generateStaticParams() {
  return supportedLocales.map((lang) => ({ lang }));
}

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ lang: string }>;
};

type FooterData = SiteFooterContent | null;

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
  const fallbackFooter =
    !footer && lang !== "en"
      ? await sanityFetch<FooterData>({
          query: footerByLanguageQuery,
          params: { language: "en" },
        })
      : null;

  return (
    <div className="site">
      <SiteHeader lang={lang} />
      <main>{children}</main>
      <SiteFooter content={footer || fallbackFooter} />
    </div>
  );
}
