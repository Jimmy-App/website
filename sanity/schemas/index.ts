import { navItem } from './objects/navItem'
import { seo } from './objects/seo'
import { socialLink } from './objects/socialLink'
import { portableTextBlock } from './objects/portableTextBlock'
import { siteSettings } from './documents/siteSettings'
import { homePage } from './documents/homePage'
import { navigation } from './documents/navigation'
import { footer } from './documents/footer'
import { pricing } from './documents/pricing'
import { pricingFeatures } from './documents/pricingFeatures'

export const schemaTypes = [
  // Objects (must come before documents that reference them)
  navItem,
  seo,
  socialLink,
  portableTextBlock,
  // Documents
  siteSettings,
  homePage,
  navigation,
  footer,
  pricing,
  pricingFeatures,
]
