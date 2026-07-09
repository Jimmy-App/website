import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo'
import { isProduction } from '@/lib/env'

export default function robots(): MetadataRoute.Robots {
  // Preview / non-production deploys must never be indexed.
  if (!isProduction) {
    return { rules: { userAgent: '*', disallow: '/' } }
  }
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/studio', '/api/'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
