import type { LandingPageContent } from "@/components/landing/LandingPage";
import { localeBasePath, type SupportedLocale } from "@/lib/i18n";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  landingPageByLanguageQuery,
  navigationByLanguageQuery,
} from "@/sanity/lib/queries";

import Navbar from "./Navbar";

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

type LegalNavbarProps = {
  lang: SupportedLocale;
};

export default async function LegalNavbar({ lang }: LegalNavbarProps) {
  const homeHref = localeBasePath(lang);
  const landingPage = await sanityFetch<LandingPageContent>({
    query: landingPageByLanguageQuery,
    params: { language: lang },
  });
  const fallbackLandingPage =
    !landingPage && lang !== "en"
      ? await sanityFetch<LandingPageContent>({
          query: landingPageByLanguageQuery,
          params: { language: "en" },
        })
      : null;
  const resolvedWaitlistLabel =
    landingPage?.cta?.waitlistLabel ||
    fallbackLandingPage?.cta?.waitlistLabel ||
    "Join Waitlist";

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
    <Navbar
      navigation={normalizedNavigation}
      waitlistLabel={resolvedWaitlistLabel}
      brandHref={homeHref}
      currentLocale={lang}
    />
  );
}
