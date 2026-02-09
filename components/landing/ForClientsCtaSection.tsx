import Link from "next/link";

import {
  LANDING_SECTION_BADGE_CLASS,
  LANDING_SECTION_TITLE_CLASS,
} from "@/components/landing/constants";
import FadeIn from "@/components/ui/FadeIn";

type ForClientsCtaSectionProps = {
  waitlistHref: string;
  coachesHref: string;
};

const ForClientsCtaSection = ({
  waitlistHref,
  coachesHref,
}: ForClientsCtaSectionProps) => {
  return (
    <section className="relative overflow-hidden border-t border-[#edf1f6] bg-white py-14 md:py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-140px] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[#f7f4ff] blur-[110px]" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-4 text-center sm:px-6 lg:px-8">
        <FadeIn direction="up">
          <div className={`mb-8 ${LANDING_SECTION_BADGE_CLASS}`}>
            FOR CLIENTS
          </div>
        </FadeIn>

        <FadeIn delay={0.08} direction="up">
          <h2 className={`mb-8 ${LANDING_SECTION_TITLE_CLASS}`}>
            <span className="block text-slate-900">Ready for your best workout?</span>
          </h2>
        </FadeIn>

        <FadeIn delay={0.14} direction="up">
          <p className="mx-auto mt-5 max-w-2xl text-[22px] leading-relaxed text-slate-500">
            If your coach is already on Jimmy, check your email for the invite.
            If not, show them this website and tell them to upgrade their game.
          </p>
        </FadeIn>

        <FadeIn delay={0.2} direction="up">
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={waitlistHref}
              className="inline-flex items-center justify-center rounded-full bg-purple-600 px-7 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_-18px_rgba(124,58,237,0.9)] transition-all hover:bg-purple-700 sm:text-base"
            >
              Download the App
            </Link>
            <Link
              href={coachesHref}
              className="inline-flex items-center justify-center rounded-full border border-[#d9e2ef] bg-white px-7 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 sm:text-base"
            >
              Show This to My Coach
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default ForClientsCtaSection;
