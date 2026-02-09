import { notFound } from "next/navigation";

import ForClientsCtaSection from "@/components/landing/ForClientsCtaSection";
import type { ForClientsPageContent } from "@/components/landing/forClientsContent";
import ForClientsFeaturesSection from "@/components/landing/ForClientsFeaturesSection";
import ForClientsHeroSection from "@/components/landing/ForClientsHeroSection";
import ForClientsWhySection from "@/components/landing/ForClientsWhySection";
import Navbar from "@/components/landing/Navbar";
import { isSupportedLocale, localeBasePath } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import type { SeoFields } from "@/lib/seo";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  forClientsPageByLanguageQuery,
  forClientsPageSeoByLanguageQuery,
  navigationByLanguageQuery,
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

type ForClientsPageSeoData = {
  title?: string | null;
  seo?: SeoFields | null;
};

export async function generateMetadata({ params }: PageProps) {
  const { lang } = await params;

  if (!isSupportedLocale(lang)) {
    return {};
  }

  const pageSeo = await sanityFetch<ForClientsPageSeoData>({
    query: forClientsPageSeoByLanguageQuery,
    params: { language: lang },
  });
  const fallbackPageSeo =
    !pageSeo && lang !== "en"
      ? await sanityFetch<ForClientsPageSeoData>({
          query: forClientsPageSeoByLanguageQuery,
          params: { language: "en" },
        })
      : null;
  const resolvedPageSeo = pageSeo || fallbackPageSeo;

  return buildMetadata({
    title: resolvedPageSeo?.title || "For Clients",
    description:
      "See how Jimmy gives clients a clean workout app to follow plans, log sessions, and stay connected with coaches.",
    seo: resolvedPageSeo?.seo,
    path: `${localeBasePath(lang)}/for-clients`,
    locale: lang,
  });
}

export default async function ForClientsPage({ params }: PageProps) {
  const { lang } = await params;

  if (!isSupportedLocale(lang)) {
    notFound();
  }

  const homeHref = localeBasePath(lang);
  const waitlistHref = `${homeHref}#waitlist`;
  const coachesHref = `${homeHref}/for-coaches`;
  const pageContent = await sanityFetch<ForClientsPageContent>({
    query: forClientsPageByLanguageQuery,
    params: { language: lang },
  });
  const fallbackPageContent =
    !pageContent && lang !== "en"
      ? await sanityFetch<ForClientsPageContent>({
          query: forClientsPageByLanguageQuery,
          params: { language: "en" },
        })
      : null;
  const resolvedPageContent = pageContent || fallbackPageContent;
  const navigation = await sanityFetch<NavigationData>({
    query: navigationByLanguageQuery,
    params: { language: lang },
  });
  const fallbackNavigation =
    !navigation && lang !== "en"
      ? await sanityFetch<NavigationData>({
          query: navigationByLanguageQuery,
          params: { language: "en" },
        })
      : null;
  const resolvedNavigation = navigation || fallbackNavigation;
  const normalizedNavigation = resolvedNavigation
    ? {
        brandLabel: resolvedNavigation.brandLabel ?? undefined,
        mobileHelperText: resolvedNavigation.mobileHelperText ?? undefined,
        items: resolvedNavigation.items?.map((item) => ({
          label: item?.label ?? undefined,
          href: item?.href ?? undefined,
        })),
        featuresDropdown: resolvedNavigation.featuresDropdown
          ? {
              coaches: resolvedNavigation.featuresDropdown.coaches
                ? {
                    badgeLabel:
                      resolvedNavigation.featuresDropdown.coaches.badgeLabel ??
                      undefined,
                    items: resolvedNavigation.featuresDropdown.coaches.items?.map(
                      (item) => ({
                        label: item?.label ?? undefined,
                        href: item?.href ?? undefined,
                      }),
                    ),
                    viewAllLabel:
                      resolvedNavigation.featuresDropdown.coaches.viewAllLabel ??
                      undefined,
                    viewAllHref:
                      resolvedNavigation.featuresDropdown.coaches.viewAllHref ??
                      undefined,
                  }
                : undefined,
              clients: resolvedNavigation.featuresDropdown.clients
                ? {
                    badgeLabel:
                      resolvedNavigation.featuresDropdown.clients.badgeLabel ??
                      undefined,
                    items: resolvedNavigation.featuresDropdown.clients.items?.map(
                      (item) => ({
                        label: item?.label ?? undefined,
                        href: item?.href ?? undefined,
                      }),
                    ),
                    viewAllLabel:
                      resolvedNavigation.featuresDropdown.clients.viewAllLabel ??
                      undefined,
                    viewAllHref:
                      resolvedNavigation.featuresDropdown.clients.viewAllHref ??
                      undefined,
                  }
                : undefined,
              platform: resolvedNavigation.featuresDropdown.platform
                ? {
                    badgeText:
                      resolvedNavigation.featuresDropdown.platform.badgeText ??
                      undefined,
                    headline:
                      resolvedNavigation.featuresDropdown.platform.headline ??
                      undefined,
                    subheadline:
                      resolvedNavigation.featuresDropdown.platform.subheadline ??
                      undefined,
                    buttonLabel:
                      resolvedNavigation.featuresDropdown.platform.buttonLabel ??
                      undefined,
                    buttonHref:
                      resolvedNavigation.featuresDropdown.platform.buttonHref ??
                      undefined,
                  }
                : undefined,
            }
          : undefined,
      }
    : null;

  return (
    <>
      <Navbar
        navigation={normalizedNavigation}
        brandHref={homeHref}
        currentLocale={lang}
      />
      <ForClientsHeroSection
        homeHref={homeHref}
        waitlistHref={waitlistHref}
        content={resolvedPageContent?.hero}
      />
      <ForClientsWhySection content={resolvedPageContent?.why} />
      <ForClientsFeaturesSection content={resolvedPageContent?.features} />
      <ForClientsCtaSection
        waitlistHref={waitlistHref}
        coachesHref={coachesHref}
        content={resolvedPageContent?.cta}
      />
    </>
  );
}
