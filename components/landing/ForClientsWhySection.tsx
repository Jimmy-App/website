import {
  Clock3,
  WifiOff,
  ZoomIn,
  type LucideIcon,
} from "lucide-react";

import FadeIn from "@/components/ui/FadeIn";

type WhyJimmyPoint = {
  title: string;
  body: string;
  icon: LucideIcon;
};

const whyJimmyPoints: WhyJimmyPoint[] = [
  {
    title: "Stop Pinching-to-Zoom",
    body: "No more squinting at a tiny PDF on your phone screen. Your workout is interactive, clear, and easy to read, even with sweat in your eyes.",
    icon: ZoomIn,
  },
  {
    title: "The Timer That Multitasks",
    body: "Our rest timer lives on your Lock Screen (Live Activity). Go ahead, scroll Instagram between sets, we'll ping you when it's time to lift again.",
    icon: Clock3,
  },
  {
    title: "Works in the Basement",
    body: "Is your gym in a bunker with zero Wi-Fi? No problem. Jimmy works offline and syncs your results the moment you get back to civilization.",
    icon: WifiOff,
  },
];

const ForClientsWhySection = () => {
  return (
    <section className="border-b border-[#e3e8f1] bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn direction="up">
          <div className="mx-auto max-w-4xl text-center">
            <p className="inline-flex items-center rounded-full border border-[#dfe7f2] bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              Why Clients Choose Jimmy
            </p>
            <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl md:leading-[1.05]">
              We know what annoys you at the gym. So we fixed it.
            </h2>
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

export default ForClientsWhySection;
