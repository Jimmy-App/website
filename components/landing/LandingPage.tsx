import dynamic from 'next/dynamic';
import Navbar from './Navbar';
import Hero from './Hero';
import { localeBasePath, type SupportedLocale } from '@/lib/i18n';

const ProblemSection = dynamic(() => import('./ProblemSection'));
const CoreFeaturesSection = dynamic(() => import('./CoreFeaturesSection'));
const ClientExperienceSection = dynamic(() => import('./ClientExperienceSection'));
const PricingSection = dynamic(() => import('./PricingSection'));
const ManifestoSection = dynamic(() => import('./ManifestoSection'));

export type LandingPageContent = {
  cta?: {
    waitlistLabel?: string;
    pricingSecondaryLabel?: string;
  };
  hero?: {
    badgeText?: string;
    title?: string;
    titleHighlight?: string;
    subtitle?: string;
    inputPlaceholder?: string;
    socialProofText?: string;
    successMessage?: string;
  };
  problem?: {
    title?: string;
    titleHighlight?: string;
    subtitle?: string;
    cards?: {
      key?: string;
      title?: string;
      body?: string;
      badge?: string;
      ctaLabel?: string;
      uiActionLabel?: string;
      uiStatusLabel?: string;
    }[];
  };
  coachFeatures?: {
    badgeText?: string;
    title?: string;
    titleHighlight?: string;
    subtitle?: string;
    builder?: {
      title?: string;
      body?: string;
      weekLabel?: string;
      exerciseItems?: string[];
      exerciseDetail?: string;
    };
    payments?: {
      title?: string;
      body?: string;
      revenueLabel?: string;
      revenueDelta?: string;
      revenueAmount?: string;
      notificationTitle?: string;
      notificationBody?: string;
    };
    chat?: {
      title?: string;
      body?: string;
      messageText?: string;
      avatarInitials?: string;
    };
    health?: {
      title?: string;
      body?: string;
      stats?: { label?: string; value?: string }[];
      syncedLabel?: string;
      appleHealthAlt?: string;
      googleFitAlt?: string;
    };
    video?: {
      title?: string;
      body?: string;
    };
    ctaLabel?: string;
    ctaHelperText?: string;
  };
  clientExperience?: {
    badgeText?: string;
    title?: string;
    subtitle?: string;
    logging?: {
      title?: string;
      body?: string;
    };
    progress?: {
      title?: string;
      body?: string;
    };
    workouts?: {
      title?: string;
      body?: string;
    };
    timer?: {
      title?: string;
      body?: string;
    };
    offline?: {
      title?: string;
      body?: string;
    };
    chat?: {
      title?: string;
      body?: string;
    };
    ctaLabel?: string;
    ctaHelperText?: string;
  };
  pricing?: {
    badgeText?: string;
    title?: string;
    titleHighlight?: string;
    subtitle?: string;
    monthlyLabel?: string;
    yearlyLabel?: string;
    yearlySaveLabel?: string;
    yearlyFreeMonths?: number;
    currency?: string;
    popularBadgeLabel?: string;
    secondaryHelperText?: string;
    plans?: {
      name?: string;
      prices?: {
        usd?: number;
        eur?: number;
        gbp?: number;
      };
      period?: string;
      clients?: string;
      description?: string;
      isFeatured?: boolean;
      features?: { label?: string; isAddon?: boolean }[];
    }[];
  };
  manifesto?: {
    badgeText?: string;
    title?: string;
    titleHighlight?: string;
    bodyPrefix?: string;
    bodyEmphasis?: string;
    bodyMiddle?: string;
    bodyStrong?: string;
    inputPlaceholder?: string;
    socialProofText?: string;
    successMessage?: string;
  };
};

type LandingPageProps = {
  content?: LandingPageContent | null;
  brandHref?: string;
  currentLocale?: SupportedLocale;
  navigation?: {
    brandLabel?: string;
    mobileHelperText?: string;
    items?: { label?: string; href?: string }[];
    featuresDropdown?: {
      coaches?: {
        badgeLabel?: string;
        items?: { label?: string; href?: string }[];
        viewAllLabel?: string;
        viewAllHref?: string;
      };
      clients?: {
        badgeLabel?: string;
        items?: { label?: string; href?: string }[];
        viewAllLabel?: string;
        viewAllHref?: string;
      };
      platform?: {
        badgeText?: string;
        headline?: string;
        subheadline?: string;
        buttonLabel?: string;
        buttonHref?: string;
      };
    };
  } | null;
};

const LandingPage = ({
  content,
  brandHref,
  currentLocale,
  navigation,
}: LandingPageProps) => {
  const waitlistLabel = content?.cta?.waitlistLabel;
  const pricingSecondaryLabel =
    content?.cta?.pricingSecondaryLabel || 'See all pricing plans';
  const brandLabel = navigation?.brandLabel;
  const pricingSecondaryHref = currentLocale
    ? `${localeBasePath(currentLocale)}/pricing`
    : '/pricing';
  const waitlistHref = currentLocale
    ? `${localeBasePath(currentLocale)}#waitlist`
    : '#waitlist';
  const forCoachesHref = currentLocale
    ? `${localeBasePath(currentLocale)}/for-coaches`
    : '/for-coaches';
  const forClientsHref = currentLocale
    ? `${localeBasePath(currentLocale)}/for-clients`
    : '/for-clients';

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-purple-100 selection:text-purple-900">
      <Navbar
        navigation={navigation}
        waitlistLabel={waitlistLabel}
        brandHref={brandHref}
        currentLocale={currentLocale}
      />
      <Hero content={content?.hero} waitlistLabel={waitlistLabel} brandLabel={brandLabel} />
      <ProblemSection content={content?.problem} ctaHref={forCoachesHref} />
      <CoreFeaturesSection content={content?.coachFeatures} ctaHref={forCoachesHref} />
      <ClientExperienceSection content={content?.clientExperience} ctaHref={forClientsHref} />
      <PricingSection
        content={content?.pricing}
        waitlistLabel={waitlistLabel}
        waitlistHref={waitlistHref}
        pricingSecondaryLabel={pricingSecondaryLabel}
        pricingSecondaryHref={pricingSecondaryHref}
        currentLocale={currentLocale}
      />
      <ManifestoSection content={content?.manifesto} waitlistLabel={waitlistLabel} />
    </div>
  );
};

export default LandingPage;
