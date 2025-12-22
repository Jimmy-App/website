export const defaultLocale = "en";
export const supportedLocales = ["en", "fr", "es"] as const;
export type SupportedLocale = (typeof supportedLocales)[number];

export function isSupportedLocale(locale: string): locale is SupportedLocale {
  return supportedLocales.includes(locale as SupportedLocale);
}

export function localeBasePath(locale: SupportedLocale) {
  if (locale === defaultLocale) {
    return "";
  }

  return `/${locale}`;
}
