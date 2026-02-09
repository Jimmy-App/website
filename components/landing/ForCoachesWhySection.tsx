import { Layers, PiggyBank, WifiOff, type LucideIcon } from "lucide-react";

import FadeIn from "@/components/ui/FadeIn";
import {
  DEFAULT_FOR_COACHES_WHY_CONTENT,
  DEFAULT_FOR_COACHES_WHY_POINTS,
  type ForCoachesWhyContent,
  type ForCoachesWhyIconKey,
} from "./forCoachesContent";

const whyIconMap: Record<ForCoachesWhyIconKey, LucideIcon> = {
  layers: Layers,
  wifiOff: WifiOff,
  piggyBank: PiggyBank,
};

type ForCoachesWhySectionProps = {
  content?: ForCoachesWhyContent | null;
};

const ForCoachesWhySection = ({ content }: ForCoachesWhySectionProps) => {
  const badgeText =
    content?.badgeText ?? DEFAULT_FOR_COACHES_WHY_CONTENT.badgeText;
  const title = content?.title ?? DEFAULT_FOR_COACHES_WHY_CONTENT.title;
  const subtitle =
    content?.subtitle ?? DEFAULT_FOR_COACHES_WHY_CONTENT.subtitle;
  const sourcePoints =
    content?.points && content.points.length > 0
      ? content.points
      : DEFAULT_FOR_COACHES_WHY_POINTS;
  const resolvedPoints = sourcePoints.map((point, index) => {
    const fallbackPoint =
      DEFAULT_FOR_COACHES_WHY_POINTS[index] || DEFAULT_FOR_COACHES_WHY_POINTS[0];

    return {
      title: point?.title ?? fallbackPoint.title,
      body: point?.body ?? fallbackPoint.body,
      iconKey: point?.icon ?? fallbackPoint.icon,
    };
  });

  return (
    <section className="border-b border-[#e3e8f1] bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn direction="up">
          <div className="mx-auto max-w-4xl text-center">
            <p className="inline-flex items-center rounded-full border border-[#dfe7f2] bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              {badgeText}
            </p>
            <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl md:leading-[1.05]">
              {title}
            </h2>
            <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-slate-500 sm:text-lg md:text-xl">
              {subtitle}
            </p>
          </div>
        </FadeIn>

        <div className="mt-10 grid gap-5 md:mt-12 md:grid-cols-3">
          {resolvedPoints.map((point, index) => {
            const Icon = whyIconMap[point.iconKey] || Layers;

            return (
              <FadeIn
                key={`${point.title}-${index}`}
                delay={0.08 + index * 0.08}
                direction="up"
              >
                <article className="rounded-2xl border border-[#dfe7f2] bg-[#f8fbff] p-6 shadow-[0_18px_34px_-28px_rgba(15,23,42,0.28)]">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#e8ddff] bg-[#f5f0ff] text-[#6d28d9]">
                    <Icon size={20} />
                  </div>
                  <h3 className="mt-4 text-xl font-bold tracking-tight text-slate-900">
                    {point.title}
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-slate-600">
                    {point.body}
                  </p>
                </article>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ForCoachesWhySection;
