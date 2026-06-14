import { groq } from 'next-sanity'

export const SITE_SETTINGS_QUERY = groq`
  *[_type == "siteSettings" && language == $locale][0] {
    siteName,
    siteDescription,
    seo
  }
`

export const HOME_QUERY = groq`
  *[_type == "homePage" && language == $locale][0] {
    title,
    hero {
      heading,
      subheading,
      ctaText,
      ctaUrl
    },
    seo
  }
`

export const NAVIGATION_QUERY = groq`
  *[_type == "navigation" && language == $locale][0] {
    items[] {
      label,
      href,
      external
    }
  }
`

export const FOOTER_QUERY = groq`
  *[_type == "footer" && language == $locale][0] {
    columns[] {
      title,
      links[] { label, href, external }
    },
    socialLinks[] { platform, url },
    legalText
  }
`

export const PRICING_QUERY = groq`
  *[_type == "pricing" && language == $locale] | order(_createdAt asc) {
    _id,
    name,
    description,
    priceMonthly,
    priceYearly,
    highlighted,
    features[]-> {
      _id,
      title,
      included
    }
  }
`
