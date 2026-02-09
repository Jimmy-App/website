import { notFound } from "next/navigation";

import Footer from "@/components/landing/Footer";
import Navbar from "@/components/landing/Navbar";
import type { LandingPageContent } from "@/components/landing/LandingPage";
import { PricingSectionWithComparison } from "@/components/ui/pricing-section-with-comparison";
import { isSupportedLocale, localeBasePath } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  landingPageByLanguageQuery,
  navigationByLanguageQuery,
} from "@/sanity/lib/queries";

type PageProps = {
  params: Promise<{ lang: string }>;
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

  return buildMetadata({
    title: "Pricing",
    description:
      "Simple pricing for independent coaches. Start free and upgrade as your coaching business grows.",
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

  const resolvedWaitlistLabel = pricingContent?.cta?.waitlistLabel || "Join Waitlist";

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
            content={pricingContent?.pricing}
            waitlistHref={waitlistHref}
          />
          <Footer content={pricingContent?.footer} />
        </div>
      </div>
    </>
  );
}
