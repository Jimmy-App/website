/**
 * Per-section content prop types, derived from generated Sanity query types.
 * Sections receive these as props instead of reading next-intl messages.
 */
import type {
  HOME_QUERY_RESULT,
  NAVIGATION_QUERY_RESULT,
  FOOTER_QUERY_RESULT,
  SITE_SETTINGS_QUERY_RESULT,
  PRICING_PLANS_QUERY_RESULT,
  PRICING_PAGE_QUERY_RESULT,
} from '../../sanity.types'

export type HomeData = NonNullable<HOME_QUERY_RESULT>

export type HeroData = NonNullable<HomeData['hero']>
export type FeaturesData = NonNullable<HomeData['features']>
export type WhyData = NonNullable<HomeData['why']>
export type StepsData = NonNullable<HomeData['steps']>
export type PlatformData = NonNullable<HomeData['platform']>
export type TechData = NonNullable<HomeData['tech']>
export type ComparisonData = NonNullable<HomeData['comparison']>
export type PricingData = NonNullable<HomeData['pricing']>
export type BetaData = NonNullable<HomeData['beta']>
export type TeamData = NonNullable<HomeData['team']>
export type FaqData = NonNullable<HomeData['faq']>
export type ManifestoData = NonNullable<HomeData['manifesto']>
export type FinalCtaData = NonNullable<HomeData['finalCta']>

export type NavigationData = NonNullable<NAVIGATION_QUERY_RESULT>
export type FooterData = NonNullable<FOOTER_QUERY_RESULT>

export type SiteSettingsData = NonNullable<SITE_SETTINGS_QUERY_RESULT>
export type NotFoundData = NonNullable<SiteSettingsData['notFound']>

export type PricingPlansData = NonNullable<PRICING_PLANS_QUERY_RESULT>
export type PricingPageData = NonNullable<PRICING_PAGE_QUERY_RESULT>
export type FinalCtaContent = NonNullable<PricingPageData['finalCta']>
