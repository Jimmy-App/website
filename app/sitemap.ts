import type { MetadataRoute } from "next";

import { supportedLocales } from "@/lib/i18n";
import { getSiteUrl } from "@/lib/site";

type SiteLocale = (typeof supportedLocales)[number];

const HREF_LANG_BY_LOCALE: Record<SiteLocale, string> = {
  en: "en",
  es: "es",
  fr: "fr",
  ua: "uk",
};

const STATIC_PATHS = [
  "",
  "/for-coaches",
  "/for-clients",
  "/pricing",
] as const;

function withLocale(siteUrl: string, locale: SiteLocale, path: string) {
  return `${siteUrl}/${locale}${path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const now = new Date();

  return STATIC_PATHS.flatMap((path) => {
    const alternates = Object.fromEntries(
      supportedLocales.map((locale) => [
        HREF_LANG_BY_LOCALE[locale],
        withLocale(siteUrl, locale, path),
      ]),
    ) as Record<string, string>;

    return supportedLocales.map((locale) => ({
      url: withLocale(siteUrl, locale, path),
      lastModified: now,
      changeFrequency: path ? "monthly" : "weekly",
      priority: path ? 0.7 : 1,
      alternates: {
        languages: alternates,
      },
    }));
  });
}
