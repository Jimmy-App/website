import Link from "next/link";

import {
  LANDING_SECTION_BADGE_CLASS,
  LANDING_SECTION_TITLE_CLASS,
} from "@/components/landing/constants";
import FadeIn from "@/components/ui/FadeIn";
import {
  DEFAULT_FOR_CLIENTS_CTA_CONTENT,
  type ForClientsCtaContent,
} from "./forClientsContent";

type ForClientsCtaSectionProps = {
  waitlistHref: string;
  coachesHref: string;
  content?: ForClientsCtaContent | null;
};

const ForClientsCtaSection = ({
  waitlistHref,
  coachesHref,
  content,
}: ForClientsCtaSectionProps) => {
  const badgeText = content?.badgeText ?? DEFAULT_FOR_CLIENTS_CTA_CONTENT.badgeText;
  const title = content?.title ?? DEFAULT_FOR_CLIENTS_CTA_CONTENT.title;
  const subtitle = content?.subtitle ?? DEFAULT_FOR_CLIENTS_CTA_CONTENT.subtitle;
  const primaryButtonLabel =
    content?.primaryButtonLabel ?? DEFAULT_FOR_CLIENTS_CTA_CONTENT.primaryButtonLabel;
  const secondaryButtonLabel =
    content?.secondaryButtonLabel ??
    DEFAULT_FOR_CLIENTS_CTA_CONTENT.secondaryButtonLabel;

  return (
    <section className="relative overflow-hidden border-t border-[#edf1f6] bg-white py-14 md:py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-140px] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[#f7f4ff] blur-[110px]" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-4 text-center sm:px-6 lg:px-8">
        <FadeIn direction="up">
          <div className={`mb-8 ${LANDING_SECTION_BADGE_CLASS}`}>
            {badgeText}
          </div>
        </FadeIn>

        <FadeIn delay={0.08} direction="up">
          <h2 className={`mb-8 ${LANDING_SECTION_TITLE_CLASS}`}>
            <span className="block text-slate-900">{title}</span>
          </h2>
        </FadeIn>

        <FadeIn delay={0.14} direction="up">
          <p className="mx-auto mt-5 max-w-2xl text-[22px] leading-relaxed text-slate-500">
            {subtitle}
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
              href={coachesHref}
              className="inline-flex items-center justify-center rounded-full border border-[#d9e2ef] bg-white px-7 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 sm:text-base"
            >
              {secondaryButtonLabel}
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default ForClientsCtaSection;
