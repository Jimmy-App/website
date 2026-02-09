import Link from "next/link";
import { Heart } from "lucide-react";

import {
  LANDING_SECTION_BADGE_CLASS,
  LANDING_SECTION_TITLE_CLASS,
} from "@/components/landing/constants";
import FadeIn from "@/components/ui/FadeIn";
import {
  DEFAULT_FOR_COACHES_CTA_CONTENT,
  type ForCoachesCtaContent,
} from "./forCoachesContent";

type ForCoachesCtaSectionProps = {
  waitlistHref: string;
  pricingHref: string;
  content?: ForCoachesCtaContent | null;
};

const ForCoachesCtaSection = ({
  waitlistHref,
  pricingHref,
  content,
}: ForCoachesCtaSectionProps) => {
  const badgeText = content?.badgeText ?? DEFAULT_FOR_COACHES_CTA_CONTENT.badgeText;
  const titleLineOne =
    content?.titleLineOne ?? DEFAULT_FOR_COACHES_CTA_CONTENT.titleLineOne;
  const titleLineTwo =
    content?.titleLineTwo ?? DEFAULT_FOR_COACHES_CTA_CONTENT.titleLineTwo;
  const bodyPrefix =
    content?.bodyPrefix ?? DEFAULT_FOR_COACHES_CTA_CONTENT.bodyPrefix;
  const bodyHighlightOne =
    content?.bodyHighlightOne ?? DEFAULT_FOR_COACHES_CTA_CONTENT.bodyHighlightOne;
  const bodyMiddle =
    content?.bodyMiddle ?? DEFAULT_FOR_COACHES_CTA_CONTENT.bodyMiddle;
  const bodyHighlightTwo =
    content?.bodyHighlightTwo ?? DEFAULT_FOR_COACHES_CTA_CONTENT.bodyHighlightTwo;
  const bodySuffix =
    content?.bodySuffix ?? DEFAULT_FOR_COACHES_CTA_CONTENT.bodySuffix;
  const bodyHighlightThree =
    content?.bodyHighlightThree ??
    DEFAULT_FOR_COACHES_CTA_CONTENT.bodyHighlightThree;
  const bodyEnd = content?.bodyEnd ?? DEFAULT_FOR_COACHES_CTA_CONTENT.bodyEnd;
  const primaryButtonLabel =
    content?.primaryButtonLabel ??
    DEFAULT_FOR_COACHES_CTA_CONTENT.primaryButtonLabel;
  const secondaryButtonLabel =
    content?.secondaryButtonLabel ??
    DEFAULT_FOR_COACHES_CTA_CONTENT.secondaryButtonLabel;
  const helperText =
    content?.helperText ?? DEFAULT_FOR_COACHES_CTA_CONTENT.helperText;

  return (
    <section className="relative overflow-hidden border-t border-[#edf1f6] bg-white py-14 md:py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-140px] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[#f7f4ff] blur-[110px]" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-4 text-center sm:px-6 lg:px-8">
        <FadeIn direction="up">
          <div className={`mb-8 ${LANDING_SECTION_BADGE_CLASS}`}>
            <Heart size={12} className="text-[#5b47ff]" />
            {badgeText}
          </div>
        </FadeIn>

        <FadeIn delay={0.08} direction="up">
          <h2 className={`mb-8 ${LANDING_SECTION_TITLE_CLASS}`}>
            <span className="block text-slate-900">{titleLineOne}</span>
            <span className="block bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent">
              {titleLineTwo}
            </span>
          </h2>
        </FadeIn>

        <FadeIn delay={0.14} direction="up">
          <p className="mx-auto mt-5 max-w-2xl text-[22px] leading-relaxed text-slate-500">
            {bodyPrefix}
            <span className="font-semibold text-gray-900 underline decoration-purple-200 decoration-2 underline-offset-4">
              {bodyHighlightOne}
            </span>{" "}
            {bodyMiddle}
            <span className="font-semibold text-gray-900 underline decoration-purple-200 decoration-2 underline-offset-4">
              {bodyHighlightTwo}
            </span>
            {bodySuffix}
            <span className="font-semibold text-gray-900 underline decoration-purple-200 decoration-2 underline-offset-4">
              {bodyHighlightThree}
            </span>
            {bodyEnd}
          </p>
        </FadeIn>

        <FadeIn delay={0.2} direction="up">
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={waitlistHref}
              className="inline-flex items-center justify-center rounded-full bg-purple-600 px-7 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_-18px_rgba(124,58,237,0.9)] transition-all hover:bg-purple-700 sm:text-base"
            >
              {primaryButtonLabel}
            </Link>
            <Link
              href={pricingHref}
              className="inline-flex items-center justify-center rounded-full border border-[#d9e2ef] bg-white px-7 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 sm:text-base"
            >
              {secondaryButtonLabel}
            </Link>
          </div>
        </FadeIn>

        <FadeIn delay={0.26} direction="up">
          <p className="mt-6 text-sm font-medium text-slate-500">
            {helperText}
          </p>
        </FadeIn>
      </div>
    </section>
  );
};

export default ForCoachesCtaSection;
