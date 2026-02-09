import { seo } from "./schemas/objects/seo";
import { navItem } from "./schemas/objects/navItem";
import { textBlock } from "./schemas/objects/textBlock";
import { socialLink } from "./schemas/objects/socialLink";
import { author } from "./schemas/documents/author";
import { category } from "./schemas/documents/category";
import { cookieBanner } from "./schemas/documents/cookieBanner";
import { docPage } from "./schemas/documents/docPage";
import { footer } from "./schemas/documents/footer";
import { forClientsPage } from "./schemas/documents/forClientsPage";
import { forCoachesPage } from "./schemas/documents/forCoachesPage";
import { navigation } from "./schemas/documents/navigation";
import { page } from "./schemas/documents/page";
import { post } from "./schemas/documents/post";
import { pricing } from "./schemas/documents/pricing";
import { pricingFeatures } from "./schemas/documents/pricingFeatures";
import { siteSettings } from "./schemas/documents/siteSettings";
import { landingPage } from "./schemas/documents/landingPage";

export const schemaTypes = [
  seo,
  navItem,
  textBlock,
  socialLink,
  author,
  category,
  cookieBanner,
  siteSettings,
  landingPage,
  forClientsPage,
  forCoachesPage,
  pricing,
  pricingFeatures,
  page,
  post,
  docPage,
  navigation,
  footer,
];
