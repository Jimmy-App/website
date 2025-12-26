import { notFound } from "next/navigation";

import LandingPage from "@/components/landing/LandingPage";
import type { LandingPageContent } from "@/components/landing/LandingPage";
import { isSupportedLocale, localeBasePath } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import type { SeoFields } from "@/lib/seo";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  landingPageByLanguageQuery,
  landingPageSeoByLanguageQuery,
  navigationByLanguageQuery,
} from "@/sanity/lib/queries";

type PageProps = {
  params: Promise<{ lang: string }>;
};

type LandingPageSeoData = {
  title?: string | null;
  seo?: SeoFields | null;
};

type NavigationData = {
  brandLabel?: string | null;
  mobileHelperText?: string | null;
  items?: { label?: string; href?: string }[] | null;
};

export async function generateMetadata({ params }: PageProps) {
  const { lang } = await params;

  if (!isSupportedLocale(lang)) {
    return {};
  }

  const landingPageSeo = await sanityFetch<LandingPageSeoData>({
    query: landingPageSeoByLanguageQuery,
    params: { language: lang },
  });

  const path = localeBasePath(lang);

  return buildMetadata({
    title: landingPageSeo?.title || "Home Page",
    seo: landingPageSeo?.seo,
    path,
    locale: lang,
  });
}

export default async function HomePage({ params }: PageProps) {
  const { lang } = await params;

  if (!isSupportedLocale(lang)) {
    notFound();
  }

  const landingPage = await sanityFetch<LandingPageContent>({
    query: landingPageByLanguageQuery,
    params: { language: lang },
  });
  const navigation = await sanityFetch<NavigationData>({
    query: navigationByLanguageQuery,
    params: { language: lang },
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

  const basePath = localeBasePath(lang);

  return (
    <LandingPage
      content={landingPage}
      brandHref={basePath}
      currentLocale={lang}
      navigation={normalizedNavigation}
    />
  );
}
