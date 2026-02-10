import { notFound } from "next/navigation";

import Navbar from "@/components/landing/Navbar";
import type { LandingPageContent } from "@/components/landing/LandingPage";
import {
  PricingSectionWithComparison,
  type PricingSectionWithComparisonContent,
  type PricingSectionWithComparisonFeaturesContent,
} from "@/components/ui/pricing-section-with-comparison";
import { isSupportedLocale, localeBasePath } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import type { SeoFields } from "@/lib/seo";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  landingPageByLanguageQuery,
  navigationByLanguageQuery,
  pricingByLanguageQuery,
  pricingFeaturesByLanguageQuery,
  pricingSeoByLanguageQuery,
} from "@/sanity/lib/queries";

type PageProps = {
  params: Promise<{ lang: string }>;
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
  pricing?: PricingSectionWithComparisonContent | null;
};

type PricingFeaturesDocumentData = PricingSectionWithComparisonFeaturesContent | null;

type PricingSeoData = {
  title?: string | null;
  seo?: SeoFields | null;
};

export async function generateMetadata({ params }: PageProps) {
  const { lang } = await params;

  if (!isSupportedLocale(lang)) {
    return {};
  }

  const pricingSeo = await sanityFetch<PricingSeoData>({
    query: pricingSeoByLanguageQuery,
    params: { language: lang },
  });
  const fallbackPricingSeo =
    !pricingSeo && lang !== "en"
      ? await sanityFetch<PricingSeoData>({
          query: pricingSeoByLanguageQuery,
          params: { language: "en" },
        })
      : null;
  const resolvedPricingSeo = pricingSeo || fallbackPricingSeo;

  return buildMetadata({
    title: resolvedPricingSeo?.title || "Pricing",
    description:
      "Simple pricing for independent coaches. Start free and upgrade as your coaching business grows.",
    seo: resolvedPricingSeo?.seo,
    path: `${localeBasePath(lang)}/pricing`,
    locale: lang,
  });
}

export default async function PricingPage({ params }: PageProps) {
  const { lang } = await params;

  if (!isSupportedLocale(lang)) {
    notFound();
  }

  const homeHref = localeBasePath(lang);
  const waitlistHref = `${homeHref}#waitlist`;
  const pricingContent = await sanityFetch<LandingPageContent>({
    query: landingPageByLanguageQuery,
    params: { language: lang },
  });
  const pricingDocument = await sanityFetch<PricingDocumentData>({
    query: pricingByLanguageQuery,
    params: { language: lang },
  });
  const pricingFeaturesDocument = await sanityFetch<PricingFeaturesDocumentData>({
    query: pricingFeaturesByLanguageQuery,
    params: { language: lang },
  });
  const fallbackPricingDocument =
    !pricingDocument?.pricing && lang !== "en"
      ? await sanityFetch<PricingDocumentData>({
          query: pricingByLanguageQuery,
          params: { language: "en" },
        })
      : null;
  const fallbackPricingFeaturesDocument =
    (!pricingFeaturesDocument?.rows || pricingFeaturesDocument.rows.length === 0) &&
    lang !== "en"
      ? await sanityFetch<PricingFeaturesDocumentData>({
          query: pricingFeaturesByLanguageQuery,
          params: { language: "en" },
        })
      : null;
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

  const resolvedWaitlistLabel = pricingContent?.cta?.waitlistLabel || "Join Waitlist";
  const resolvedPricingContent =
    pricingDocument?.pricing || fallbackPricingDocument?.pricing;
  const resolvedPricingFeaturesContent =
    (pricingFeaturesDocument?.rows?.length ? pricingFeaturesDocument : null) ||
    (fallbackPricingFeaturesDocument?.rows?.length
      ? fallbackPricingFeaturesDocument
      : null);

  return (
    <>
      <Navbar
        navigation={normalizedNavigation}
        waitlistLabel={resolvedWaitlistLabel}
        brandHref={homeHref}
        currentLocale={lang}
      />

      <div className="relative overflow-hidden bg-[#f5f7fb] lg:bg-white">
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute inset-x-0 top-0 h-[120svh] overflow-hidden">
            <div className="absolute inset-0 bg-[#f5f7fb]" />
            <div className="absolute inset-x-0 top-0 h-px bg-[#edf1f7]" />
            <div className="absolute right-[-40%] top-[18%] h-[420px] w-[420px] rounded-full bg-[#eee8ff]/55 blur-[145px] md:right-[-20%] md:h-[520px] md:w-[520px]" />
            <div className="absolute left-[-30%] top-[34%] h-[300px] w-[300px] rounded-full bg-[#dbeafe]/55 blur-[130px] md:left-[-14%] md:h-[360px] md:w-[360px]" />
          </div>
        </div>

        <div className="relative z-10">
          <PricingSectionWithComparison
            content={resolvedPricingContent}
            featuresContent={resolvedPricingFeaturesContent}
            waitlistHref={waitlistHref}
            currentLocale={lang}
          />
        </div>
      </div>
    </>
  );
}
