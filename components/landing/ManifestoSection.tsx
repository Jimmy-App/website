'use client';

import { Heart } from 'lucide-react';
import {
  LANDING_SECTION_BADGE_CLASS,
  LANDING_SECTION_TITLE_CLASS,
} from './constants';
import WaitlistSignupForm from './WaitlistSignupForm';

type ManifestoContent = {
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

type ManifestoSectionProps = {
  waitlistLabel?: string;
  content?: ManifestoContent | null;
};

const ManifestoSection = ({ waitlistLabel, content }: ManifestoSectionProps) => {
  const resolvedWaitlistLabel = waitlistLabel || 'Join Waitlist';
  const resolvedBadgeText = content?.badgeText || 'Our Mission';
  const resolvedTitle = content?.title || 'Built for the';
  const resolvedTitleHighlight = content?.titleHighlight || 'Independent.';
  const resolvedBodyPrefix =
    content?.bodyPrefix ||
    'We are building Jimmy because we believe the future of fitness is ';
  const resolvedBodyEmphasis = content?.bodyEmphasis || 'independent coaches';
  const resolvedBodyMiddle =
    content?.bodyMiddle ||
    ', not faceless franchises. We are here to give you the same tools the big guys have, ';
  const resolvedBodyStrong =
    content?.bodyStrong || 'without the enterprise price tag.';
  const resolvedInputPlaceholder = content?.inputPlaceholder || 'Enter your email...';
  const resolvedSocialProofText =
    content?.socialProofText || 'Join 400+ other coaches waiting for access.';
  const resolvedSuccessMessage =
    content?.successMessage || "You're on the list! Keep an eye on your inbox.";

  return (
    <section
      className="relative overflow-hidden border-t border-[#edf1f6] bg-white py-14 md:py-24"
      id="manifesto"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-140px] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[#f7f4ff] blur-[110px]" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-4 text-center sm:px-6 lg:px-8">
        <div className={`mb-8 ${LANDING_SECTION_BADGE_CLASS}`}>
          <Heart size={12} className="text-[#5b47ff]" />
          {resolvedBadgeText}
        </div>

        <h2 className={`mb-8 ${LANDING_SECTION_TITLE_CLASS}`}>
          {resolvedTitle}{' '}
          <span className="bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent">
            {resolvedTitleHighlight}
          </span>
        </h2>

        <p className="mb-14 mx-auto mt-5 max-w-2xl text-[22px] leading-relaxed text-slate-500">
          {resolvedBodyPrefix}
          <span className="font-semibold text-gray-900 underline decoration-purple-200 decoration-2 underline-offset-4">
            {resolvedBodyEmphasis}
          </span>
          {resolvedBodyMiddle}
          <span className="font-semibold text-gray-900">{resolvedBodyStrong}</span>
        </p>

        <WaitlistSignupForm
          waitlistLabel={resolvedWaitlistLabel}
          inputPlaceholder={resolvedInputPlaceholder}
          successMessage={resolvedSuccessMessage}
          socialProofText={resolvedSocialProofText}
          className="relative w-full max-w-md group"
          socialProofClassName="mt-8 flex items-center justify-center gap-2 text-sm font-medium text-gray-500"
        />
      </div>
    </section>
  );
};

export default ManifestoSection;
