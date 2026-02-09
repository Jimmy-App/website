import { notFound } from "next/navigation";
import ForCoachesCtaSection from "@/components/landing/ForCoachesCtaSection";
import ForCoachesFeaturesSection from "@/components/landing/ForCoachesFeaturesSection";
import ForCoachesHeroSection from "@/components/landing/ForCoachesHeroSection";
import ForCoachesWhySection from "@/components/landing/ForCoachesWhySection";
import Navbar from "@/components/landing/Navbar";
import { isSupportedLocale, localeBasePath } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

type PageProps = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { lang } = await params;

  if (!isSupportedLocale(lang)) {
    return {};
  }

  return buildMetadata({
    title: "For Coaches",
    description:
      "Discover how Jimmy helps coaches create programs, manage clients, and keep communication in one place.",
    path: `${localeBasePath(lang)}/for-coaches`,
    locale: lang,
  });
}

export default async function ForCoachesPage({ params }: PageProps) {
  const { lang } = await params;

  if (!isSupportedLocale(lang)) {
    notFound();
  }

  const homeHref = localeBasePath(lang);
  const waitlistHref = `${homeHref}#waitlist`;
  const pricingHref = `${homeHref}#pricing`;

  return (
    <>
      <Navbar brandHref={homeHref} currentLocale={lang} />
      <ForCoachesHeroSection homeHref={homeHref} waitlistHref={waitlistHref} />
      <ForCoachesWhySection />
      <ForCoachesFeaturesSection />
      <ForCoachesCtaSection
        waitlistHref={waitlistHref}
        pricingHref={pricingHref}
      />
    </>
  );
}
