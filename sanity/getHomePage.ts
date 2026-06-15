import { cacheLife, cacheTag } from 'next/cache'
import { client } from './client'
import {
  HOME_QUERY,
  NAVIGATION_QUERY,
  FOOTER_QUERY,
  PRICING_PAGE_QUERY,
  PRICING_PLANS_QUERY,
  SITE_SETTINGS_QUERY,
} from './queries'
import type {
  HOME_QUERY_RESULT,
  NAVIGATION_QUERY_RESULT,
  FOOTER_QUERY_RESULT,
  PRICING_PAGE_QUERY_RESULT,
  PRICING_PLANS_QUERY_RESULT,
  SITE_SETTINGS_QUERY_RESULT,
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
