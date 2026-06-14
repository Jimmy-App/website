import { createClient } from 'next-sanity'
import { env } from './env'

export const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: env.SANITY_API_VERSION,
  useCdn: process.env.NODE_ENV === 'production',
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
