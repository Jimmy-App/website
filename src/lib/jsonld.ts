import { SITE_URL, SITE_NAME } from './seo'

type Schema = Record<string, unknown>

const LOGO_URL = `${SITE_URL}/icon-512.png`
const ORG_DESCRIPTION =
  'The retention platform for modern fitness coaches — structured workouts, community, payments and a white-label app for your members.'

// Brand social profiles — the `sameAs` entity signal for Knowledge Graph / AI.
const SOCIAL_PROFILES = [
  'https://www.instagram.com/jimmycoach.app',
  'https://www.linkedin.com/company/jimmycoach',
  'https://discord.gg/Rsqh6yZmEM',
]

/** Reusable publisher/author node. */
const ORG_NODE = {
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: { '@type': 'ImageObject', url: LOGO_URL },
}

export function organizationSchema(): Schema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    legalName: 'Just Jimmy LLC',
    url: SITE_URL,
    logo: LOGO_URL,
    image: `${SITE_URL}/og.jpg`,
    description: ORG_DESCRIPTION,
    sameAs: SOCIAL_PROFILES,
  }
}

export function websiteSchema(locale: string): Schema {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: locale,
    publisher: ORG_NODE,
  }
}

export interface FaqItem {
  question?: string | null
  answer?: string | null
}

export function faqSchema(items: FaqItem[]): Schema | null {
  const entities = items
    .filter((it) => it.question && it.answer)
    .map((it) => ({
      '@type': 'Question',
      name: it.question,
      acceptedAnswer: { '@type': 'Answer', text: it.answer },
    }))
  if (!entities.length) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: entities,
  }
}

/** SoftwareApplication (the Jimmy app) with a free + paid offer range. */
export function softwareApplicationSchema(opts: {
  lowPrice?: number
  highPrice?: number
  currency?: string
}): Schema {
  const { lowPrice = 0, highPrice, currency = 'EUR' } = opts
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: SITE_NAME,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'iOS, Android, Web',
    description: ORG_DESCRIPTION,
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: currency,
      lowPrice: String(lowPrice),
      ...(highPrice ? { highPrice: String(highPrice) } : {}),
      offerCount: highPrice ? undefined : 1,
    },
    publisher: ORG_NODE,
  }
}

export function articleSchema(opts: {
  headline: string
  description?: string
  url: string
  image?: string
  datePublished?: string
  locale: string
}): Schema {
  const { headline, description, url, image, datePublished, locale } = opts
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline,
    ...(description ? { description } : {}),
    url,
    mainEntityOfPage: url,
    ...(image ? { image: [image] } : {}),
    ...(datePublished ? { datePublished } : {}),
    inLanguage: locale,
    author: ORG_NODE,
    publisher: ORG_NODE,
  }
}

export function breadcrumbSchema(items: { name: string; url: string }[]): Schema {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  }
}
