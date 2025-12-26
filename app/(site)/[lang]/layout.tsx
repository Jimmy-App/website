import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { isSupportedLocale, supportedLocales } from "@/lib/i18n";
import SiteHeader from "@/components/site/SiteHeader";

export function generateStaticParams() {
  return supportedLocales.map((lang) => ({ lang }));
}

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ lang: string }>;
};

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { lang } = await params;

  if (!isSupportedLocale(lang)) {
    notFound();
  }

  return (
    <div className="site">
      <SiteHeader lang={lang} />
      <main>{children}</main>
    </div>
  );
}
