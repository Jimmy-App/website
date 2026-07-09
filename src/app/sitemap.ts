import type { MetadataRoute } from 'next'
import { getFeatureSlugs, getPostSlugs } from '../../sanity/getHomePage'
import { LOCALES, localizedUrl, languageAlternates } from '@/lib/seo'

// Static, indexable routes (guides are excluded — hidden/404 on production).
const STATIC_PATHS = [
  '',
  '/pricing',
  '/affiliate',
  '/blog',
  '/changelog',
  '/roadmap',
  '/privacy',
  '/terms',
  '/cookie-policy',
] as const

function priorityFor(path: string): number {
  if (path === '') return 1
  if (path === '/pricing') return 0.9
  if (/^\/(blog|features)\//.test(path)) return 0.6
  return 0.7
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [featureSlugs, postSlugs] = await Promise.all([
    getFeatureSlugs(),
    getPostSlugs(),
  ])

  const paths: string[] = [
    ...STATIC_PATHS,
    ...featureSlugs
      .map((f) => f.slug)
      .filter((s): s is string => !!s)
      .map((s) => `/features/${s}`),
    ...postSlugs
      .map((p) => p.slug)
      .filter((s): s is string => !!s)
      .map((s) => `/blog/${s}`),
  ]

  const now = new Date()
  // One entry per (locale, path), each carrying the hreflang alternates.
  return paths.flatMap((path) =>
    LOCALES.map((locale) => ({
      url: localizedUrl(locale, path),
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: priorityFor(path),
      alternates: { languages: languageAlternates(path) },
    })),
  )
}
