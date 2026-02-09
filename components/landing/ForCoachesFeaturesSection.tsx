"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  DEFAULT_FOR_COACHES_FEATURE_ITEMS,
  DEFAULT_FOR_COACHES_FEATURES_CONTENT,
  type ForCoachesFeaturesContent,
} from "./forCoachesContent";

type FeatureItem = {
  anchorId: string;
  category: string;
  headline: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
};

type ForCoachesFeaturesSectionProps = {
  content?: ForCoachesFeaturesContent | null;
};

const ForCoachesFeaturesSection = ({
  content,
}: ForCoachesFeaturesSectionProps) => {
  const title = content?.title ?? DEFAULT_FOR_COACHES_FEATURES_CONTENT.title;
  const subtitle =
    content?.subtitle ?? DEFAULT_FOR_COACHES_FEATURES_CONTENT.subtitle;
  const sourceItems =
    content?.items && content.items.length > 0
      ? content.items
      : DEFAULT_FOR_COACHES_FEATURE_ITEMS;
  const resolvedItems: FeatureItem[] = sourceItems.map((item, index) => {
    const fallbackItem =
      DEFAULT_FOR_COACHES_FEATURE_ITEMS[index] ||
      DEFAULT_FOR_COACHES_FEATURE_ITEMS[0];

    return {
      anchorId:
        item?.anchorId ||
        fallbackItem.anchorId ||
        `for-coaches-feature-${index + 1}`,
      category: item?.category || fallbackItem.category || "Feature",
      headline: item?.headline || fallbackItem.headline || "",
      description: item?.description || fallbackItem.description || "",
      imageSrc:
        item?.imageSrc ||
        fallbackItem.imageSrc ||
        "/assets/photo/dashboard.png",
      imageAlt: item?.imageAlt || fallbackItem.imageAlt || "Feature preview",
    };
  });

  return (
    <section
      id="for-coaches-features"
      className="scroll-mt-24 bg-white py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
            {title}
          </h2>
          <p className="mt-6 text-lg leading-8 text-slate-600">{subtitle}</p>
        </div>

        <div className="mt-16 space-y-20 lg:mt-24 lg:space-y-32">
          {resolvedItems.map((feature, featureIdx) => (
            <motion.div
              id={feature.anchorId}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              key={feature.category}
              className="scroll-mt-24 flex flex-col gap-12 lg:grid lg:grid-cols-2 lg:items-center lg:gap-20"
            >
              <div
                className={`flex flex-col ${featureIdx % 2 === 1 ? "lg:order-last" : ""}`}
              >
                <div className="mb-4 inline-flex w-fit self-start items-center rounded-xl border border-purple-200 bg-purple-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-purple-700">
                  {feature.category}
                </div>
                <h3 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  {feature.headline}
                </h3>
                <p className="mt-6 text-lg leading-relaxed text-slate-600">
                  {feature.description}
                </p>
              </div>

              <div
                className={`relative rounded-3xl border border-slate-100 bg-slate-50 p-4 shadow-xl shadow-slate-200/50 ${
                  featureIdx % 2 === 1 ? "lg:order-first" : ""
                }`}
              >
                <div className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white">
                  <div className="flex h-10 items-center gap-2 border-b border-slate-100 bg-slate-50/50 px-4">
                    <div className="size-2.5 rounded-full bg-rose-300" />
                    <div className="size-2.5 rounded-full bg-amber-300" />
                    <div className="size-2.5 rounded-full bg-emerald-300" />
                  </div>
                  <div className="relative w-full bg-slate-50">
                    <Image
                      src={feature.imageSrc}
                      alt={feature.imageAlt}
                      width={2000}
                      height={1250}
                      className="h-auto w-full"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ForCoachesFeaturesSection;
