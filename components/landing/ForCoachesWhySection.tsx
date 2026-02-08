import { Layers, PiggyBank, WifiOff, type LucideIcon } from "lucide-react";

import FadeIn from "@/components/ui/FadeIn";

type WhyJimmyPoint = {
  title: string;
  body: string;
  icon: LucideIcon;
};

const whyJimmyPoints: WhyJimmyPoint[] = [
  {
    title: 'Zero "Bloatware"',
    body: "No payroll systems. No complex turnstile integrations. Just the tools you actually need to coach, programmed to be faster than your old Excel sheet.",
    icon: Layers,
  },
  {
    title: "Works Where You Work",
    body: 'Basement gym with zero signal? No problem. Jimmy is "offline-first," so your data syncs whenever the internet decides to wake up.',
    icon: WifiOff,
  },
  {
    title: "Your Wallet Will Thank You",
    body: 'Manage up to 5 clients for free, forever. No "14-day trials" that ask for a credit card. Grow at your own pace; we only make money when you do.',
    icon: PiggyBank,
  },
];

const ForCoachesWhySection = () => {
  return (
    <section className="border-b border-[#e3e8f1] bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn direction="up">
          <div className="mx-auto max-w-4xl text-center">
            <p className="inline-flex items-center rounded-full border border-[#dfe7f2] bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              Why Jimmy?
            </p>
            <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl md:leading-[1.05]">
              The app that doesn&apos;t require a PhD to use.
            </h2>
            <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-slate-500 sm:text-lg md:text-xl">
              Most coaching apps are built for giant gym chains with 50-page
              manuals. Jimmy is built for you—the coach who just wants to assign
              a squat without clicking 15 buttons.
            </p>
          </div>
        </FadeIn>

        <div className="mt-10 grid gap-5 md:mt-12 md:grid-cols-3">
          {whyJimmyPoints.map((point, index) => (
            <FadeIn
              key={point.title}
              delay={0.08 + index * 0.08}
              direction="up"
            >
              <article className="rounded-2xl border border-[#dfe7f2] bg-[#f8fbff] p-6 shadow-[0_18px_34px_-28px_rgba(15,23,42,0.28)]">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#e8ddff] bg-[#f5f0ff] text-[#6d28d9]">
                  <point.icon size={20} />
                </div>
                <h3 className="mt-4 text-xl font-bold tracking-tight text-slate-900">
                  {point.title}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-slate-600">
                  {point.body}
                </p>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ForCoachesWhySection;
