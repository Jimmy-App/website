import { groq } from 'next-sanity'

export const SITE_SETTINGS_QUERY = groq`
  *[_type == "siteSettings" && language == $locale][0]{
    siteName,
    siteDescription,
    seo
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
