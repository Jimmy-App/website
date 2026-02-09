import LandingPage from '../components/landing/LandingPage';
import type { LandingPageContent } from '../components/landing/LandingPage';
import SiteFooter from '../components/site/SiteFooter';
import type { SiteFooterContent } from '../components/site/SiteFooter';
import { defaultLocale } from '../lib/i18n';
import { buildMetadata } from '../lib/seo';
import type { SeoFields } from '../lib/seo';
import { sanityFetch } from '../sanity/lib/fetch';
import {
  landingPageByLanguageQuery,
  landingPageSeoByLanguageQuery,
  navigationByLanguageQuery,
  footerByLanguageQuery,
  pricingByLanguageQuery,
} from '../sanity/lib/queries';

type LandingPageSeoData = {
  title?: string | null;
  seo?: SeoFields | null;
};

type NavigationData = {
  brandLabel?: string | null;
  mobileHelperText?: string | null;
  items?: { label?: string; href?: string }[] | null;
};

type PricingDocumentData = {
  cta?: {
    pricingSecondaryLabel?: string | null;
  } | null;
  pricing?: LandingPageContent['pricing'] | null;
};

type FooterData = SiteFooterContent | null;

export async function generateMetadata() {
  const landingPageSeo = await sanityFetch<LandingPageSeoData>({
    query: landingPageSeoByLanguageQuery,
    params: { language: defaultLocale },
  });

  return buildMetadata({
    title: landingPageSeo?.title || 'Home Page',
    seo: landingPageSeo?.seo,
    path: '/',
    locale: defaultLocale,
  });
}

const App = async () => {
  const landingPage = await sanityFetch<LandingPageContent>({
    query: landingPageByLanguageQuery,
    params: { language: defaultLocale },
  });
  const navigation = await sanityFetch<NavigationData>({
    query: navigationByLanguageQuery,
    params: { language: defaultLocale },
  });
  const pricingDocument = await sanityFetch<PricingDocumentData>({
    query: pricingByLanguageQuery,
    params: { language: defaultLocale },
  });
  const footer = await sanityFetch<FooterData>({
    query: footerByLanguageQuery,
    params: { language: defaultLocale },
  });
  const normalizedNavigation = navigation
    ? {
        brandLabel: navigation.brandLabel ?? undefined,
        mobileHelperText: navigation.mobileHelperText ?? undefined,
        items: navigation.items?.map((item) => ({
          label: item?.label ?? undefined,
          href: item?.href ?? undefined,
        })),
      }
    : null;
  const mergedLandingPage: LandingPageContent | null =
    landingPage || pricingDocument
      ? {
          ...(landingPage || {}),
          cta: {
            ...(landingPage?.cta || {}),
            pricingSecondaryLabel:
              pricingDocument?.cta?.pricingSecondaryLabel ?? undefined,
          },
          pricing: pricingDocument?.pricing ?? undefined,
        }
      : null;

  return (
    <>
      <LandingPage
        content={mergedLandingPage}
        brandHref="/"
        currentLocale={defaultLocale}
        navigation={normalizedNavigation}
      />
      <SiteFooter content={footer} />
    </>
  );
};

export default App;
