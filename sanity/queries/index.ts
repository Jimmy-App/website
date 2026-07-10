import { groq } from 'next-sanity'

export const SITE_SETTINGS_QUERY = groq`
  *[_type == "siteSettings" && language == $locale][0]{
    siteName,
    siteDescription,
    seo,
    notFound
  }
`

export const PRICING_PAGE_QUERY = groq`
  *[_type == "pricingPage" && language == $locale][0]{
    title,
    faq,
    finalCta,
    seo
  }
`

// Global, non-localized single source of truth for prices.
export const PRICING_PLANS_QUERY = groq`
  *[_type == "pricingPlans"][0]{
    tiers[]{ clients, priceEur, priceUsd },
    betaDiscountPct,
    feesFree{ stripePctEur, stripePctUsd, stripeFixedEur, stripeFixedUsd, jimmyPct },
    feesClub{ stripePctEur, stripePctUsd, stripeFixedEur, stripeFixedUsd, jimmyPct }
  }
`

export const AFFILIATE_PAGE_QUERY = groq`
  *[_type == "affiliatePage" && language == $locale][0]{
    title,
    hero,
    calc,
    how,
    why,
    who,
    faq,
    finalCta,
    seo
  }
`

// Global, non-localized calculator numbers.
export const AFFILIATE_SETTINGS_QUERY = groq`
  *[_type == "affiliateSettings"][0]{
    rate, sliderMin, sliderMax, sliderDefault, ticks,
    eur{ avg, lo, hi },
    usd{ avg, lo, hi }
  }
`

export const HOME_QUERY = groq`
  *[_type == "homePage" && language == $locale][0]{
    title,
    hero,
    features,
    why,
    steps,
    platform,
    tech,
    comparison,
    pricing,
    beta,
    team,
    faq,
    manifesto,
    finalCta,
    seo
  }
`

export const NAVIGATION_QUERY = groq`
  *[_type == "navigation" && language == $locale][0]{
    featuresLabel,
    featuresForCoaches,
    featuresForMembers,
    featuresItems[]{ key, title, subtitle, href },
    featuresCta,
    resourcesLabel,
    resourcesContent,
    resourcesCommunity,
    resourcesItems[]{ key, title, subtitle, href },
    pricing,
    affiliate,
    newBadge,
    login,
    getStarted,
    getStartedShort,
    openMenu,
    close,
    menu
  }
`

export const FOOTER_QUERY = groq`
  *[_type == "footer" && language == $locale][0]{
    taglinePrefix,
    taglineEmphasis,
    productHeading,
    productLinks[]{ label, href, external },
    companyHeading,
    companyLinks[]{ label, href, external },
    legalHeading,
    legalLinks[]{ label, href, external },
    copy
  }
`

// ── Blog ────────────────────────────────────────────────────────────────────
// Posts are not localized (English content on all locales); the page chrome is
// localized via next-intl. Card projection omits `body` to keep the list light.
const POST_CARD = `
  "slug": slug.current,
  category,
  title,
  excerpt,
  publishedAt,
  readMin,
  featured,
  pick,
  coverImage
`

export const POSTS_QUERY = groq`
  *[_type == "post" && defined(slug.current)]|order(publishedAt desc){
    ${POST_CARD}
  }
`

export const POST_QUERY = groq`
  *[_type == "post" && slug.current == $slug][0]{
    ${POST_CARD},
    lead,
    coverImage{ ..., alt },
    body[]{
      ...,
      _type == "image" => { ..., asset, alt, caption }
    }
  }
`

export const POST_SLUGS_QUERY = groq`
  *[_type == "post" && defined(slug.current)]{ "slug": slug.current }
`

// ── Guides ───────────────────────────────────────────────────────────────────
// Guides are not localized (English content on all locales); the page chrome is
// localized via next-intl. Card projection omits `body` to keep the list light.
const GUIDE_CARD = `
  "slug": slug.current,
  category,
  title,
  lead,
  level,
  readMin,
  updatedAt,
  popular,
  order
`

export const GUIDES_QUERY = groq`
  *[_type == "guide" && defined(slug.current)] | order(category asc, order asc){
    ${GUIDE_CARD}
  }
`

export const GUIDE_QUERY = groq`
  *[_type == "guide" && slug.current == $slug][0]{
    ${GUIDE_CARD},
    seo,
    body[]{
      ...,
      _type == "image" => { ..., asset, alt, caption },
      _type == "guideSteps" => {
        ...,
        items[]{
          title,
          body[]{
            ...,
            _type == "image" => { ..., asset, alt, caption }
          }
        }
      }
    }
  }
`

export const GUIDE_SLUGS_QUERY = groq`
  *[_type == "guide" && defined(slug.current)]{ "slug": slug.current }
`

// ── Features ──────────────────────────────────────────────────────────────────
// Not localized (English content on all locales); page chrome localized via
// next-intl. The demo / icon / media are resolved code-side from string keys.
// Card projection (related lists, static params) omits the heavy hero fields.
const FEATURE_CARD = `
  "slug": slug.current,
  audience,
  name,
  sub,
  iconKey,
  order
`

export const FEATURES_QUERY = groq`
  *[_type == "feature" && defined(slug.current) && language == $locale] | order(order asc){
    ${FEATURE_CARD}
  }
`

export const FEATURE_QUERY = groq`
  *[_type == "feature" && slug.current == $slug && language == $locale][0]{
    ${FEATURE_CARD},
    demoKey,
    title{ prefix, accent, suffix },
    highlight{ prefix, accent },
    highlightSub,
    lead,
    tags,
    capsTitle,
    caps[]{ iconKey, title, desc },
    seo
  }
`

// Slugs are shared across languages; the English docs are the canonical set.
export const FEATURE_SLUGS_QUERY = groq`
  *[_type == "feature" && defined(slug.current) && language == "en"]{ "slug": slug.current }
`

// ── Changelog ─────────────────────────────────────────────────────────────────
// Not localized (English content on all locales); chrome localized via next-intl.
// Newest first. `image` keeps the asset ref + alt for urlFor().
export const CHANGELOG_QUERY = groq`
  *[_type == "changelogRelease" && defined(date) && language == $locale] | order(date desc){
    version,
    date,
    title,
    lead,
    image{ ..., alt },
    changes[]{ type, text }
  }
`

// ── Roadmap ───────────────────────────────────────────────────────────────────
// Not localized; chrome localized via next-intl. Grouped into Now/Next/Later in
// code. `id` (= _id) is the per-card upvote key. Ordered within column.
export const ROADMAP_QUERY = groq`
  *[_type == "roadmapItem"] | order(order asc){
    "id": _id,
    column,
    category,
    title,
    desc,
    eta,
    votes
  }
`
