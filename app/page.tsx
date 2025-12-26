import LandingPage from '../components/landing/LandingPage';
import type { LandingPageContent } from '../components/landing/LandingPage';
import { defaultLocale } from '../lib/i18n';
import { buildMetadata } from '../lib/seo';
import type { SeoFields } from '../lib/seo';
import { sanityFetch } from '../sanity/lib/fetch';
import {
  landingPageByLanguageQuery,
  landingPageSeoByLanguageQuery,
  navigationByLanguageQuery,
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

  return (
    <LandingPage
      content={landingPage}
      brandHref="/"
      currentLocale={defaultLocale}
      navigation={normalizedNavigation}
    />
  );
};

export default App;
