import Link from "next/link";
import { Heart } from "lucide-react";

import {
  LANDING_SECTION_BADGE_CLASS,
  LANDING_SECTION_TITLE_CLASS,
} from "@/components/landing/constants";
import FadeIn from "@/components/ui/FadeIn";

type ForCoachesCtaSectionProps = {
  waitlistHref: string;
  pricingHref: string;
};

const ForCoachesCtaSection = ({
  waitlistHref,
  pricingHref,
}: ForCoachesCtaSectionProps) => {
  return (
    <section className="relative overflow-hidden border-t border-[#edf1f6] bg-white py-14 md:py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-140px] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[#f7f4ff] blur-[110px]" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-4 text-center sm:px-6 lg:px-8">
        <FadeIn direction="up">
          <div className={`mb-8 ${LANDING_SECTION_BADGE_CLASS}`}>
            <Heart size={12} className="text-[#5b47ff]" />
            Start Free Today
          </div>
        </FadeIn>

        <FadeIn delay={0.08} direction="up">
          <h2 className={`mb-8 ${LANDING_SECTION_TITLE_CLASS}`}>
            <span className="block text-slate-900">
              Excel is for accountants.
            </span>
            <span className="block bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Jimmy is for you.
            </span>
          </h2>
        </FadeIn>

        <FadeIn delay={0.14} direction="up">
          <p className="mx-auto mt-5 max-w-2xl text-[22px] leading-relaxed text-slate-500">
            Stop wasting your Sunday evenings coloring cells. Get a{" "}
            <span className="font-semibold text-gray-900 underline decoration-purple-200 decoration-2 underline-offset-4">
              professional system
            </span>{" "}
            that doesn&apos;t require a science degree to use. Managing your{" "}
            <span className="font-semibold text-gray-900 underline decoration-purple-200 decoration-2 underline-offset-4">
              first 5 clients is free, forever
            </span>
            .{" "}
            <span className="font-semibold text-gray-900 underline decoration-purple-200 decoration-2 underline-offset-4">
              No credit card required
            </span>
            .
          </p>
        </FadeIn>

        <FadeIn delay={0.2} direction="up">
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={waitlistHref}
              className="inline-flex items-center justify-center rounded-full bg-purple-600 px-7 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_-18px_rgba(124,58,237,0.9)] transition-all hover:bg-purple-700 sm:text-base"
            >
              Start for Free
            </Link>
            <Link
              href={pricingHref}
              className="inline-flex items-center justify-center rounded-full border border-[#d9e2ef] bg-white px-7 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 sm:text-base"
            >
              See Pricing
            </Link>
          </div>
        </FadeIn>

        <FadeIn delay={0.26} direction="up">
          <p className="mt-6 text-sm font-medium text-slate-500">
            Takes less than 60 seconds. Seriously.
          </p>
        </FadeIn>
      </div>
    </section>
  );
};

export default ForCoachesCtaSection;
