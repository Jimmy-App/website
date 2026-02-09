import { notFound } from "next/navigation";

import ForClientsCtaSection from "@/components/landing/ForClientsCtaSection";
import ForClientsFeaturesSection from "@/components/landing/ForClientsFeaturesSection";
import ForClientsHeroSection from "@/components/landing/ForClientsHeroSection";
import ForClientsWhySection from "@/components/landing/ForClientsWhySection";
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
    title: "For Clients",
    description:
      "See how Jimmy gives clients a clean workout app to follow plans, log sessions, and stay connected with coaches.",
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

  return (
    <>
      <Navbar brandHref={homeHref} currentLocale={lang} />
      <ForClientsHeroSection homeHref={homeHref} waitlistHref={waitlistHref} />
      <ForClientsWhySection />
      <ForClientsFeaturesSection />
      <ForClientsCtaSection
        waitlistHref={waitlistHref}
        coachesHref={coachesHref}
      />
    </>
  );
}
