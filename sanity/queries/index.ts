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
    betaDiscountPct
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
