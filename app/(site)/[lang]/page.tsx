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
  pricingByLanguageQuery,
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
  featuresDropdown?: {
    coaches?: {
      badgeLabel?: string | null;
      items?: { label?: string; href?: string }[] | null;
      viewAllLabel?: string | null;
      viewAllHref?: string | null;
    } | null;
    clients?: {
      badgeLabel?: string | null;
      items?: { label?: string; href?: string }[] | null;
      viewAllLabel?: string | null;
      viewAllHref?: string | null;
    } | null;
    platform?: {
      badgeText?: string | null;
      headline?: string | null;
      subheadline?: string | null;
      buttonLabel?: string | null;
      buttonHref?: string | null;
    } | null;
  } | null;
};

type PricingDocumentData = {
  cta?: {
    pricingSecondaryLabel?: string | null;
  } | null;
  pricing?: LandingPageContent["pricing"] | null;
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
  const pricingDocument = await sanityFetch<PricingDocumentData>({
    query: pricingByLanguageQuery,
    params: { language: lang },
  });
  const fallbackPricingDocument =
    !pricingDocument?.pricing && lang !== "en"
      ? await sanityFetch<PricingDocumentData>({
          query: pricingByLanguageQuery,
          params: { language: "en" },
        })
      : null;
  const normalizedNavigation = navigation
    ? {
        brandLabel: navigation.brandLabel ?? undefined,
        mobileHelperText: navigation.mobileHelperText ?? undefined,
        items: navigation.items?.map((item) => ({
          label: item?.label ?? undefined,
          href: item?.href ?? undefined,
        })),
        featuresDropdown: navigation.featuresDropdown
          ? {
              coaches: navigation.featuresDropdown.coaches
                ? {
                    badgeLabel:
                      navigation.featuresDropdown.coaches.badgeLabel ??
                      undefined,
                    items: navigation.featuresDropdown.coaches.items?.map(
                      (item) => ({
                        label: item?.label ?? undefined,
                        href: item?.href ?? undefined,
                      }),
                    ),
                    viewAllLabel:
                      navigation.featuresDropdown.coaches.viewAllLabel ??
                      undefined,
                    viewAllHref:
                      navigation.featuresDropdown.coaches.viewAllHref ??
                      undefined,
                  }
                : undefined,
              clients: navigation.featuresDropdown.clients
                ? {
                    badgeLabel:
                      navigation.featuresDropdown.clients.badgeLabel ??
                      undefined,
                    items: navigation.featuresDropdown.clients.items?.map(
                      (item) => ({
                        label: item?.label ?? undefined,
                        href: item?.href ?? undefined,
                      }),
                    ),
                    viewAllLabel:
                      navigation.featuresDropdown.clients.viewAllLabel ??
                      undefined,
                    viewAllHref:
                      navigation.featuresDropdown.clients.viewAllHref ??
                      undefined,
                  }
                : undefined,
              platform: navigation.featuresDropdown.platform
                ? {
                    badgeText:
                      navigation.featuresDropdown.platform.badgeText ??
                      undefined,
                    headline:
                      navigation.featuresDropdown.platform.headline ??
                      undefined,
                    subheadline:
                      navigation.featuresDropdown.platform.subheadline ??
                      undefined,
                    buttonLabel:
                      navigation.featuresDropdown.platform.buttonLabel ??
                      undefined,
                    buttonHref:
                      navigation.featuresDropdown.platform.buttonHref ??
                      undefined,
                  }
                : undefined,
            }
          : undefined,
      }
    : null;
  const mergedLandingPage: LandingPageContent | null =
    landingPage || pricingDocument
      ? {
          ...(landingPage || {}),
          cta: {
            ...(landingPage?.cta || {}),
            pricingSecondaryLabel:
              pricingDocument?.cta?.pricingSecondaryLabel ??
              fallbackPricingDocument?.cta?.pricingSecondaryLabel ??
              undefined,
          },
          pricing:
            pricingDocument?.pricing ||
            fallbackPricingDocument?.pricing ||
            undefined,
        }
      : null;

  const basePath = localeBasePath(lang);

  return (
    <LandingPage
      content={mergedLandingPage}
      brandHref={basePath}
      currentLocale={lang}
      navigation={normalizedNavigation}
    />
  );
}
