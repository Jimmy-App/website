import { defineQuery } from "next-sanity";

export const siteSettingsQuery = defineQuery(`
  *[_type == "siteSettings" && language == $language][0]{
    title,
    domain,
    socialLinks[]{title, url},
    defaultSeo,
    supportedLocales,
    defaultLocale
  }
`);

export const navigationByLanguageQuery = defineQuery(`
  *[_type == "navigation" && language == $language][0]{
    title,
    brandLabel,
    mobileHelperText,
    items[]{label, href}
  }
`);

export const landingPageByLanguageQuery = defineQuery(`
  *[_type == "landingPage" && language == $language][0]{
    title,
    cta{
      waitlistLabel,
      pricingSecondaryLabel
    },
    hero{
      badgeText,
      title,
      titleHighlight,
      subtitle,
      inputPlaceholder,
      mockupUrlLabel,
      socialProofText,
      successMessage
    },
    problem{
      title,
      titleHighlight,
      subtitle,
      cards[]{
        key,
        title,
        body,
        badge,
        ctaLabel,
        uiActionLabel,
        uiAvatarInitials,
        uiStatusLabel
      }
    },
    coachFeatures{
      badgeText,
      title,
      titleHighlight,
      subtitle,
      builder{
        title,
        body,
        weekLabel,
        exerciseItems,
        exerciseDetail
      },
      payments{
        title,
        body,
        revenueLabel,
        revenueDelta,
        revenueAmount,
        notificationTitle,
        notificationBody
      },
      chat{
        title,
        body,
        messageText,
        avatarInitials
      },
      health{
        title,
        body,
        stats[]{label, value},
        syncedLabel,
        appleHealthAlt,
        googleFitAlt
      }
    },
    clientExperience{
      badgeText,
      title,
      subtitle,
      logging{
        title,
        body
      },
      progress{
        title,
        body
      },
      workouts{
        title,
        body
      },
      chat{
        title,
        body
      },
      ctaLabel,
      ctaHelperText
    },
    pricing{
      badgeText,
      title,
      titleHighlight,
      subtitle,
      popularBadgeLabel,
      monthlyLabel,
      yearlyLabel,
      yearlySaveLabel,
      yearlyFreeMonths,
      secondaryHelperText,
      plans[]{
        name,
        price,
        period,
        clients,
        description,
        isFeatured,
        features[]{label, isAddon}
      }
    },
    manifesto{
      badgeText,
      title,
      titleHighlight,
      bodyPrefix,
      bodyEmphasis,
      bodyMiddle,
      bodyStrong,
      inputPlaceholder,
      socialProofText,
      successMessage
    },
    footer{
      brandLabel,
      copyrightText
    }
  }
`);

export const landingPageSeoByLanguageQuery = defineQuery(`
  *[_type == "landingPage" && language == $language][0]{
    title,
    seo{
      title,
      description,
      ogImage,
      noIndex
    }
  }
`);

export const footerByLanguageQuery = defineQuery(`
  *[_type == "footer" && language == $language][0]{
    title,
    items[]{label, href}
  }
`);

export const homePageQuery = defineQuery(`
  *[_type == "page" && slug.current == "home" && language == $language][0]{
    title,
    "slug": slug.current,
    seo,
    blocks[]
  }
`);

export const pageBySlugQuery = defineQuery(`
  *[_type == "page" && slug.current == $slug && language == $language][0]{
    title,
    "slug": slug.current,
    seo,
    blocks[]
  }
`);

export const postsByLanguageQuery = defineQuery(`
  *[_type == "post" && language == $language] | order(publishDate desc){
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishDate
  }
`);

export const postBySlugQuery = defineQuery(`
  *[_type == "post" && slug.current == $slug && language == $language][0]{
    title,
    "slug": slug.current,
    excerpt,
    publishDate,
    author->{name},
    categories[]->{title},
    body,
    seo
  }
`);

export const docsByLanguageQuery = defineQuery(`
  *[_type == "docPage" && language == $language] | order(order asc){
    _id,
    title,
    "slug": slug.current,
    order
  }
`);

export const docPageBySlugQuery = defineQuery(`
  *[_type == "docPage" && slug.current == $slug && language == $language][0]{
    title,
    "slug": slug.current,
    order,
    parent->{title, "slug": slug.current},
    body,
    seo
  }
`);
