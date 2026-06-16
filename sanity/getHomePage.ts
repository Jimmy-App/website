import { cacheLife, cacheTag } from 'next/cache'
import { client } from './client'
import {
  HOME_QUERY,
  NAVIGATION_QUERY,
  FOOTER_QUERY,
  PRICING_PAGE_QUERY,
  PRICING_PLANS_QUERY,
  SITE_SETTINGS_QUERY,
  AFFILIATE_PAGE_QUERY,
  AFFILIATE_SETTINGS_QUERY,
  POSTS_QUERY,
  POST_QUERY,
  POST_SLUGS_QUERY,
  GUIDES_QUERY,
  GUIDE_QUERY,
  GUIDE_SLUGS_QUERY,
} from './queries'
import type {
  HOME_QUERY_RESULT,
  NAVIGATION_QUERY_RESULT,
  FOOTER_QUERY_RESULT,
  PRICING_PAGE_QUERY_RESULT,
  PRICING_PLANS_QUERY_RESULT,
  SITE_SETTINGS_QUERY_RESULT,
  AFFILIATE_PAGE_QUERY_RESULT,
  AFFILIATE_SETTINGS_QUERY_RESULT,
  POSTS_QUERY_RESULT,
  POST_QUERY_RESULT,
  POST_SLUGS_QUERY_RESULT,
  GUIDES_QUERY_RESULT,
  GUIDE_QUERY_RESULT,
  GUIDE_SLUGS_QUERY_RESULT,
} from '../sanity.types'

export async function getHomePage(locale: string): Promise<HOME_QUERY_RESULT> {
  'use cache'
  cacheLife('hours')
  cacheTag(`homePage-${locale}`)
  return client.fetch<HOME_QUERY_RESULT>(HOME_QUERY, { locale })
}

export async function getNavigation(locale: string): Promise<NAVIGATION_QUERY_RESULT> {
  'use cache'
  cacheLife('hours')
  cacheTag(`navigation-${locale}`)
  return client.fetch<NAVIGATION_QUERY_RESULT>(NAVIGATION_QUERY, { locale })
}

export async function getFooter(locale: string): Promise<FOOTER_QUERY_RESULT> {
  'use cache'
  cacheLife('hours')
  cacheTag(`footer-${locale}`)
  return client.fetch<FOOTER_QUERY_RESULT>(FOOTER_QUERY, { locale })
}

export async function getPricingPage(locale: string): Promise<PRICING_PAGE_QUERY_RESULT> {
  'use cache'
  cacheLife('hours')
  cacheTag(`pricingPage-${locale}`)
  return client.fetch<PRICING_PAGE_QUERY_RESULT>(PRICING_PAGE_QUERY, { locale })
}

export async function getSiteSettings(locale: string): Promise<SITE_SETTINGS_QUERY_RESULT> {
  'use cache'
  cacheLife('hours')
  cacheTag(`siteSettings-${locale}`)
  return client.fetch<SITE_SETTINGS_QUERY_RESULT>(SITE_SETTINGS_QUERY, { locale })
}

export async function getPricingPlans(): Promise<PRICING_PLANS_QUERY_RESULT> {
  'use cache'
  cacheLife('hours')
  cacheTag('pricingPlans')
  return client.fetch<PRICING_PLANS_QUERY_RESULT>(PRICING_PLANS_QUERY, {})
}

export async function getAffiliatePage(locale: string): Promise<AFFILIATE_PAGE_QUERY_RESULT> {
  'use cache'
  cacheLife('hours')
  cacheTag(`affiliatePage-${locale}`)
  return client.fetch<AFFILIATE_PAGE_QUERY_RESULT>(AFFILIATE_PAGE_QUERY, { locale })
}

export async function getAffiliateSettings(): Promise<AFFILIATE_SETTINGS_QUERY_RESULT> {
  'use cache'
  cacheLife('hours')
  cacheTag('affiliateSettings')
  return client.fetch<AFFILIATE_SETTINGS_QUERY_RESULT>(AFFILIATE_SETTINGS_QUERY, {})
}

// Blog posts are not localized; `locale` only scopes the cache tag so the Sanity
// revalidation webhook ({_type}-{language}) invalidates them like everything else.
export async function getPosts(locale: string): Promise<POSTS_QUERY_RESULT> {
  'use cache'
  cacheLife('hours')
  cacheTag(`post-${locale}`)
  return client.fetch<POSTS_QUERY_RESULT>(POSTS_QUERY, {})
}

export async function getPost(locale: string, slug: string): Promise<POST_QUERY_RESULT> {
  'use cache'
  cacheLife('hours')
  cacheTag(`post-${locale}`)
  return client.fetch<POST_QUERY_RESULT>(POST_QUERY, { slug })
}

export async function getPostSlugs(): Promise<POST_SLUGS_QUERY_RESULT> {
  'use cache'
  cacheLife('hours')
  cacheTag('post-en')
  return client.fetch<POST_SLUGS_QUERY_RESULT>(POST_SLUGS_QUERY, {})
}

// Guides are not localized; `locale` only scopes the cache tag so the Sanity
// revalidation webhook ({_type}-{language}) invalidates them like everything else.
export async function getGuides(locale: string): Promise<GUIDES_QUERY_RESULT> {
  'use cache'
  cacheLife('hours')
  cacheTag(`guide-${locale}`)
  return client.fetch<GUIDES_QUERY_RESULT>(GUIDES_QUERY, {})
}

export async function getGuide(locale: string, slug: string): Promise<GUIDE_QUERY_RESULT> {
  'use cache'
  cacheLife('hours')
  cacheTag(`guide-${locale}`)
  return client.fetch<GUIDE_QUERY_RESULT>(GUIDE_QUERY, { slug })
}

export async function getGuideSlugs(): Promise<GUIDE_SLUGS_QUERY_RESULT> {
  'use cache'
  cacheLife('hours')
  cacheTag('guide-en')
  return client.fetch<GUIDE_SLUGS_QUERY_RESULT>(GUIDE_SLUGS_QUERY, {})
}
