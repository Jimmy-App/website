import type { Metadata } from 'next'
import { routing } from '@/i18n/routing'

/**
 * Central SEO config. Canonical/hreflang/OG all derive from SITE_URL, so the
 * whole site points at one production origin. Override with NEXT_PUBLIC_SITE_URL
 * (trailing slash tolerated).
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://jimmycoach.com'
).replace(/\/+$/, '')

export const SITE_NAME = 'Jimmy'
export const DEFAULT_TITLE = 'Jimmy — The Skool of Fitness'
export const DEFAULT_OG_IMAGE = '/og.jpg'

export const LOCALES = routing.locales
export const DEFAULT_LOCALE = routing.defaultLocale

/** Map an internal locale to its BCP-47 OpenGraph locale tag. */
const OG_LOCALE: Record<string, string> = {
  en: 'en_US',
  fr: 'fr_FR',
  es: 'es_ES',
}

/** Absolute URL for a locale + app-relative path ('' = home, '/pricing', …). */
export function localizedUrl(locale: string, path = ''): string {
  return `${SITE_URL}/${locale}${path}`
}

/** hreflang alternates for every locale + x-default (→ default locale). */
export function languageAlternates(path = ''): Record<string, string> {
  const langs: Record<string, string> = {}
  for (const l of LOCALES) langs[l] = localizedUrl(l, path)
  langs['x-default'] = localizedUrl(DEFAULT_LOCALE, path)
  return langs
}

export interface PageMetaInput {
  locale: string
  /** App-relative path, '' for home, '/pricing', '/blog/slug', … */
  path?: string
  title?: string
  description?: string
  /** Absolute or app-relative image URL; defaults to the site OG image. */
  image?: string
  /** Article/website — defaults to 'website'. */
  type?: 'website' | 'article'
  /** Set true for pages that must not be indexed. */
  noIndex?: boolean
}

/**
 * Build a full Metadata object for a page: canonical + hreflang + OpenGraph +
 * Twitter, all absolute. Use inside `generateMetadata`.
 */
export function pageMetadata({
  locale,
  path = '',
  title,
  description,
  image = DEFAULT_OG_IMAGE,
  type = 'website',
  noIndex = false,
}: PageMetaInput): Metadata {
  const url = localizedUrl(locale, path)
  const ogTitle = title ?? DEFAULT_TITLE
  const images = [{ url: image, width: 1200, height: 630, alt: ogTitle }]

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: languageAlternates(path),
    },
    openGraph: {
      type,
      siteName: SITE_NAME,
      locale: OG_LOCALE[locale] ?? 'en_US',
      url,
      title: ogTitle,
      description: description ?? undefined,
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: description ?? undefined,
      images,
    },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  }
}
