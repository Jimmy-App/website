import { createClient } from 'next-sanity'
import { env } from './env'

export const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: env.SANITY_API_VERSION,
  // `useCdn: false` — read fresh from the Sanity API, not the ~60s-lagging CDN.
  // Every fetch is already wrapped in `'use cache'` + cacheLife('hours') (see
  // sanity/getHomePage.ts), so the CDN is redundant here and only adds a window
  // where a just-published doc reads as missing at build/render time, caching a
  // phantom 404 (e.g. /features/branded-mobile-app). Revalidation stays via the
  // Sanity webhook → /api/revalidate tags.
  useCdn: false,
  stega: {
    studioUrl: '/studio',
    enabled: process.env.NODE_ENV === 'development',
  },
})

export async function sanityFetch<T>({
  query,
  params = {},
}: {
  query: string
  params?: Record<string, unknown>
}): Promise<T> {
  return client.fetch<T>(query, params)
}
