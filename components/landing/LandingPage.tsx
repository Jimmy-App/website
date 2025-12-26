import dynamic from 'next/dynamic';
import Navbar from './Navbar';
import Hero from './Hero';
import FadeIn from '../ui/FadeIn';
import type { SupportedLocale } from '@/lib/i18n';

const ProblemSection = dynamic(() => import('./ProblemSection'));
const CoreFeaturesSection = dynamic(() => import('./CoreFeaturesSection'));
const ClientExperienceSection = dynamic(() => import('./ClientExperienceSection'));
const PricingSection = dynamic(() => import('./PricingSection'));
const ManifestoSection = dynamic(() => import('./ManifestoSection'));
const Footer = dynamic(() => import('./Footer'));

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
    mockupUrlLabel?: string;
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
      uiAvatarInitials?: string;
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
  };
  clientExperience?: {
    badgeText?: string;
    title?: string;
    subtitle?: string;
    logging?: {
      title?: string;
      body?: string;
      tagLabel?: string;
      uiExerciseName?: string;
      uiSetLabel?: string;
      uiWeightLabel?: string;
      uiIntensityLowLabel?: string;
      uiIntensityHighLabel?: string;
      uiRpeLabel?: string;
      uiButtonLabel?: string;
    };
    timer?: {
      title?: string;
      body?: string;
      uiRestLabel?: string;
      uiTimerValue?: string;
      uiLockLabel?: string;
      uiLockValue?: string;
    };
    offline?: {
      title?: string;
      body?: string;
      uiStatusLabel?: string;
    };
    chat?: {
      title?: string;
      body?: string;
      uiVoiceNoteLabel?: string;
    };
    sync?: {
      title?: string;
      body?: string;
      stats?: { label?: string; value?: string }[];
      appleHealthAlt?: string;
      googleFitAlt?: string;
    };
    video?: {
      title?: string;
      body?: string;
    };
  };
  pricing?: {
    badgeText?: string;
    title?: string;
    titleHighlight?: string;
    subtitle?: string;
    popularBadgeLabel?: string;
    secondaryHelperText?: string;
    plans?: {
      name?: string;
      price?: string;
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
  footer?: {
    brandLabel?: string;
    copyrightText?: string;
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
  } | null;
};

const LandingPage = ({
  content,
  brandHref,
  currentLocale,
  navigation,
}: LandingPageProps) => {
  const waitlistLabel = content?.cta?.waitlistLabel;
  const pricingSecondaryLabel = content?.cta?.pricingSecondaryLabel;
  const brandLabel = navigation?.brandLabel;

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-purple-100 selection:text-purple-900">
      <Navbar
        navigation={navigation}
        waitlistLabel={waitlistLabel}
        brandHref={brandHref}
        currentLocale={currentLocale}
      />
      <Hero content={content?.hero} waitlistLabel={waitlistLabel} brandLabel={brandLabel} />
      <FadeIn delay={0.2}><ProblemSection content={content?.problem} /></FadeIn>
      <FadeIn><CoreFeaturesSection content={content?.coachFeatures} /></FadeIn>
      <FadeIn><ClientExperienceSection content={content?.clientExperience} /></FadeIn>
      <FadeIn>
        <PricingSection
          content={content?.pricing}
          waitlistLabel={waitlistLabel}
          pricingSecondaryLabel={pricingSecondaryLabel}
        />
      </FadeIn>
      <FadeIn>
        <ManifestoSection content={content?.manifesto} waitlistLabel={waitlistLabel} />
      </FadeIn>
      <Footer content={content?.footer} />
    </div>
  );
};

export default LandingPage;
