"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type FeatureItem = {
  anchorId: string;
  category: string;
  headline: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
};

const featureItems: FeatureItem[] = [
  {
    anchorId: "for-clients-the-app",
    category: "The App",
    headline: "An app you won't hate using.",
    description:
      "Clean design, no clutter. We stripped away the complex menus so you can focus on your form, not on fighting the interface.",
    imageSrc: "/assets/photo/mock/jimmy-screen-home.svg",
    imageAlt: "Client app home preview",
  },
  {
    anchorId: "for-clients-track-results",
    category: "Track Results",
    headline: "Your personal Hall of Fame.",
    description:
      "Watch your numbers go up. Visualize your strength gains, track body weight trends, and compare progress photos side-by-side to see how far you've come.",
    imageSrc: "/assets/photo/mock/jimmy-screen-progress.svg",
    imageAlt: "Client progress tracking preview",
  },
  {
    anchorId: "for-clients-training-log",
    category: "Training Log",
    headline: "Log sets in seconds.",
    description:
      "Easily record weight, reps, and RPE. We show you your history from last week right on the screen, so you never have to guess, \"Wait, how much did I lift last time?\"",
    imageSrc: "/assets/photo/mock/jimmy-screen-workout.svg",
    imageAlt: "Client workout logging preview",
  },
  {
    anchorId: "for-clients-stay-connected",
    category: "Stay Connected",
    headline: "Feedback, exactly when you need it.",
    description:
      "Not sure about your squat depth? Record a video and send it to your coach directly inside the exercise chat. Get feedback, corrections, and high-fives without leaving the app.",
    imageSrc: "/assets/photo/mock/jimmy-screen-chats.svg",
    imageAlt: "Client chat preview",
  },
];

const ForClientsFeaturesSection = () => {
  return (
    <section
      id="for-clients-features"
      className="scroll-mt-24 bg-white py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
            Built for training.
            <br className="hidden sm:inline" /> Not for friction.
          </h2>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            The App, Track Results, Training Log, and Stay Connected.
          </p>
        </div>

        <div className="mt-16 space-y-20 lg:mt-24 lg:space-y-32">
          {featureItems.map((feature, featureIdx) => (
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
                className={`${
                  featureIdx % 2 === 1 ? "lg:order-first" : ""
                }`}
              >
                <div className="relative mx-auto w-full max-w-[230px] sm:max-w-[260px]">
                  <Image
                    src={feature.imageSrc}
                    alt={feature.imageAlt}
                    width={900}
                    height={1800}
                    className="h-auto w-full object-contain"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ForClientsFeaturesSection;
