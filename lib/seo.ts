import type { Metadata } from "next";

import { urlFor } from "@/sanity/lib/image";

import { defaultLocale } from "./i18n";
import { getSiteUrl } from "./site";

type LocaleKey = "en" | "es" | "fr" | "uk" | "ua";
type LocalizedString = Partial<Record<LocaleKey, string | null>>;
type OgImage = Parameters<typeof urlFor>[0] | null;

export type SeoFields = {
  title?: string | LocalizedString | null;
  description?: string | LocalizedString | null;
  ogImage?: OgImage | null;
  noIndex?: boolean | null;
};

type MetadataInput = {
  title?: string | null;
  description?: string | null;
  seo?: SeoFields | null;
  ogImage?: OgImage | null;
  path?: string;
  locale?: LocaleKey;
};

const localeAliases: Partial<Record<LocaleKey, LocaleKey>> = {
  ua: "uk",
};

function normalizeLocale(locale?: LocaleKey) {
  if (!locale) {
    return defaultLocale as LocaleKey;
  }
  return localeAliases[locale] || locale;
}

function resolveLocalizedValue(
  value?: string | LocalizedString | null,
  locale?: LocaleKey,
) {
  if (!value) {
    return "";
  }
  if (typeof value === "string") {
    return value;
  }
  const normalizedLocale = normalizeLocale(locale);
  const fallbackLocale = (defaultLocale as LocaleKey) || normalizedLocale;
  return value[normalizedLocale] || (locale ? value[locale] : undefined) || value[fallbackLocale] || "";
}

function resolveOgImage(ogImage?: OgImage | null) {
  if (!ogImage) {
    return undefined;
  }
  if (typeof ogImage === "string") {
    return ogImage;
  }
  if (
    typeof ogImage === "object" &&
    "asset" in ogImage &&
    (ogImage.asset?._ref || ogImage.asset?._id)
  ) {
    return urlFor(ogImage).width(1200).height(630).fit("crop").url();
  }
  return urlFor(ogImage).width(1200).height(630).fit("crop").url();
}

export function buildMetadata({
  title,
  description,
  seo,
  ogImage,
  path,
  locale,
}: MetadataInput) {
  const resolvedTitle = resolveLocalizedValue(seo?.title, locale) || title || "";
  const resolvedDescription =
    resolveLocalizedValue(seo?.description, locale) || description || "";
  const siteUrl = getSiteUrl();
  const canonical = path ? `${siteUrl}${path}` : siteUrl;
  const resolvedOgImage = resolveOgImage(seo?.ogImage || ogImage);
  const openGraphImages = resolvedOgImage
    ? [
        {
          url: resolvedOgImage,
          width: 1200,
          height: 630,
          alt: resolvedTitle || undefined,
        },
      ]
    : undefined;

  const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: resolvedTitle || undefined,
    description: resolvedDescription || undefined,
    alternates: { canonical },
    openGraph: {
      title: resolvedTitle || undefined,
      description: resolvedDescription || undefined,
      url: canonical,
      type: "website",
      images: openGraphImages,
    },
    twitter: {
      card: resolvedOgImage ? "summary_large_image" : "summary",
      title: resolvedTitle || undefined,
      description: resolvedDescription || undefined,
      images: resolvedOgImage ? [resolvedOgImage] : undefined,
    },
  };

  if (seo?.noIndex) {
    metadata.robots = { index: false, follow: false };
  }

  return metadata;
}
