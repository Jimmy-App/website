import { navItem } from './objects/navItem'
import { navMegaItem } from './objects/navMegaItem'
import { seo } from './objects/seo'
import { socialLink } from './objects/socialLink'
import { portableTextBlock } from './objects/portableTextBlock'
import { featureTab } from './objects/featureTab'
import { platformStep } from './objects/platformStep'
import { pricingTier } from './objects/pricingTier'
import { pricingAddon } from './objects/pricingAddon'
import { teamMember } from './objects/teamMember'
import { teamStat } from './objects/teamStat'
import { faqItem } from './objects/faqItem'
import { callout } from './objects/callout'
import { pullquote } from './objects/pullquote'
import { guideCallout } from './objects/guideCallout'
import { checklist } from './objects/checklist'
import { guideSteps } from './objects/guideSteps'
import { guideFaq } from './objects/guideFaq'
import { guideVideo } from './objects/guideVideo'

import { siteSettings } from './documents/siteSettings'
import { homePage } from './documents/homePage'
import { pricingPage } from './documents/pricingPage'
import { pricingPlans } from './documents/pricingPlans'
import { affiliatePage } from './documents/affiliatePage'
import { affiliateSettings } from './documents/affiliateSettings'
import { navigation } from './documents/navigation'
import { footer } from './documents/footer'
import { pricing } from './documents/pricing'
import { pricingFeatures } from './documents/pricingFeatures'
import { post } from './documents/post'
import { guide } from './documents/guide'

export const schemaTypes = [
  // Objects (must come before documents that reference them)
  navItem,
  navMegaItem,
  seo,
  socialLink,
  portableTextBlock,
  featureTab,
  platformStep,
  pricingTier,
  pricingAddon,
  teamMember,
  teamStat,
  faqItem,
  callout,
  pullquote,
  guideCallout,
  checklist,
  guideSteps,
  guideFaq,
  guideVideo,
  // Documents
  siteSettings,
  homePage,
  pricingPage,
  pricingPlans,
  affiliatePage,
  affiliateSettings,
  navigation,
  footer,
  pricing,
  pricingFeatures,
  post,
  guide,
]
