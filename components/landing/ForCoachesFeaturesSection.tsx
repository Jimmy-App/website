"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type FeatureItem = {
  category: string;
  headline: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
};

const featureItems: FeatureItem[] = [
  {
    category: "Create Programs",
    headline: "Program faster than they can complain.",
    description:
      'Drag, drop, done. Build complex programs in minutes, not hours. Save your best workouts as templates so you never have to type "Barbell Back Squat" from scratch again.',
    imageSrc: "/assets/photo/dashboard.png",
    imageAlt: "Create Programs feature preview",
  },
  {
    category: "Exercise Database",
    headline: "A library that actually makes sense.",
    description:
      "Access hundreds of built-in exercises or add your own custom videos from YouTube. No more sending clients random Instagram links to explain a lunge.",
    imageSrc: "/assets/photo/dashboard.png",
    imageAlt: "Exercise Database feature preview",
  },
  {
    category: "Manage Clients",
    headline: "Your entire roster, sorted.",
    description:
      "See who’s active, who’s slacking, and who owes you a check-in—all in one view. It’s like having a personal assistant who loves organizing lists.",
    imageSrc: "/assets/photo/dashboard.png",
    imageAlt: "Manage Clients feature preview",
  },
  {
    category: "Team Chat",
    headline: "Keep your WhatsApp for memes.",
    description:
      "Stop mixing client check-ins with your family group chat. Keep all coaching communication, feedback, and videos in one dedicated professional channel.",
    imageSrc: "/assets/photo/dashboard.png",
    imageAlt: "Team Chat feature preview",
  },
];

const ForCoachesFeaturesSection = () => {
  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
            Everything you need. <br className="hidden sm:inline" />
            Nothing you don&apos;t.
          </h2>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            Directly mapped to your screenshot list: Create Programs, Exercise
            Database, Manage Clients, Team Chat.
          </p>
        </div>

        <div className="mt-16 space-y-20 lg:mt-24 lg:space-y-32">
          {featureItems.map((feature, featureIdx) => (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              key={feature.category}
              className="flex flex-col gap-12 lg:grid lg:grid-cols-2 lg:items-center lg:gap-20"
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
                className={`relative rounded-3xl bg-slate-50 p-4 border border-slate-100 shadow-xl shadow-slate-200/50 ${
                  featureIdx % 2 === 1 ? "lg:order-first" : ""
                }`}
              >
                <div className="overflow-hidden rounded-2xl bg-white border border-slate-200/60">
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
