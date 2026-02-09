'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { LucideIcon } from 'lucide-react';
import {
  BarChart3,
  Dumbbell,
  MessageCircle,
  Smartphone,
  Sparkles,
} from 'lucide-react';
import {
  LANDING_SECTION_BADGE_CLASS,
  LANDING_SECTION_TITLE_CLASS,
} from './constants';

type ClientExperienceContent = {
  badgeText?: string;
  title?: string;
  subtitle?: string;
  logging?: {
    title?: string;
    body?: string;
  };
  progress?: {
    title?: string;
    body?: string;
  };
  workouts?: {
    title?: string;
    body?: string;
  };
  chat?: {
    title?: string;
    body?: string;
  };
  ctaLabel?: string;
  ctaHelperText?: string;
};

type ClientExperienceProps = {
  content?: ClientExperienceContent | null;
  ctaHref?: string;
};

type FeatureKey = 'intuitive' | 'progress' | 'workouts' | 'chats';

type FeatureCard = {
  key: FeatureKey;
  title: string;
  description: string;
  icon: LucideIcon;
  preview: {
    src: string;
    background: string;
    spotlight: string;
    phoneTransform: string;
  };
};

const defaultScreenSrc = '/assets/photo/mock/jimmy-screen-home.svg';

const ClientExperienceSection = ({
  content,
  ctaHref = '/for-clients',
}: ClientExperienceProps) => {
  const resolvedBadgeText = content?.badgeText || 'The Client Experience';
  const resolvedTitle = content?.title || 'Frictionless, fun workout tracking.';
  const resolvedSubtitle =
    content?.subtitle ||
    "Your clients don't want a spreadsheet on their phone. They want an experience.";
  const resolvedCtaLabel = content?.ctaLabel || 'See the app experience →';
  const resolvedCtaHelperText =
    content?.ctaHelperText ||
    'No more PDFs or messy chats. A clean, simple app your clients will actually love using.';

  const features = useMemo<FeatureCard[]>(
    () => [
      {
        key: 'intuitive',
        title: content?.logging?.title || 'Intuitive by design',
        description:
          content?.logging?.body ||
          'Modern interface, big buttons, easy input. Your clients will love logging their workouts.',
        icon: Sparkles,
        preview: {
          src: defaultScreenSrc,
          background: 'rgb(245, 247, 252)',
          spotlight: 'rgba(124, 58, 237, 0.04)',
          phoneTransform: 'translate3d(0px, 0px, 0px) scale(1) rotate(0deg)',
        },
      },
      {
        key: 'progress',
        title: content?.progress?.title || 'My Progress',
        description:
          content?.progress?.body ||
          'Clear personal records, consistency trends, and milestones that keep clients engaged.',
        icon: BarChart3,
        preview: {
          src: '/assets/photo/mock/jimmy-screen-progress.svg',
          background: 'rgb(245, 247, 252)',
          spotlight: 'rgba(124, 58, 237, 0.04)',
          phoneTransform: 'translate3d(0px, 0px, 0px) scale(1) rotate(1deg)',
        },
      },
      {
        key: 'workouts',
        title: content?.workouts?.title || 'Workouts',
        description:
          content?.workouts?.body ||
          'Open today plan, start training instantly, and log each set without breaking flow.',
        icon: Dumbbell,
        preview: {
          src: '/assets/photo/mock/jimmy-screen-workout.svg',
          background: 'rgb(245, 247, 252)',
          spotlight: 'rgba(124, 58, 237, 0.04)',
          phoneTransform: 'translate3d(0px, 0px, 0px) scale(1) rotate(-0.8deg)',
        },
      },
      {
        key: 'chats',
        title: content?.chat?.title || 'Chats',
        description:
          content?.chat?.body ||
          'Direct coach feedback and support that keeps clients moving when motivation drops.',
        icon: MessageCircle,
        preview: {
          src: '/assets/photo/mock/jimmy-screen-chats.svg',
          background: 'rgb(245, 247, 252)',
          spotlight: 'rgba(124, 58, 237, 0.04)',
          phoneTransform: 'translate3d(0px, 0px, 0px) scale(1) rotate(0.8deg)',
        },
      },
    ],
    [
      content?.chat?.body,
      content?.chat?.title,
      content?.logging?.body,
      content?.logging?.title,
      content?.progress?.body,
      content?.progress?.title,
      content?.workouts?.body,
      content?.workouts?.title,
    ]
  );

  const [activeFeature, setActiveFeature] = useState<FeatureKey>('intuitive');
  const [isPreviewHovered, setIsPreviewHovered] = useState(false);
  const activeFeatureData =
    features.find((feature) => feature.key === activeFeature) || features[0];
  const ActiveIcon = activeFeatureData.icon;
  const mockupTransform = activeFeatureData.preview.phoneTransform.includes('scale(')
    ? activeFeatureData.preview.phoneTransform.replace(
        /scale\([^)]+\)/,
        `scale(${isPreviewHovered ? 1.05 : 1})`
      )
    : `${activeFeatureData.preview.phoneTransform} scale(${isPreviewHovered ? 1.05 : 1})`;

  return (
    <section
      className="border-t border-[#edf1f6] bg-white py-14 md:py-24"
      id="experience"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className={`mb-5 ${LANDING_SECTION_BADGE_CLASS}`}>
            <Smartphone size={12} />
            {resolvedBadgeText}
          </div>
          <h2 className={LANDING_SECTION_TITLE_CLASS}>
            {resolvedTitle}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-500 sm:text-lg md:text-xl">
            {resolvedSubtitle}
          </p>
        </div>

        <div className="mt-10">
          {/* Main Grid Layout */}
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:gap-8">
            
            {/* Left Column: Feature List */}
            <div className="space-y-3">
              {features.map((feature) => {
                const FeatureIcon = feature.icon;
                const isActive = feature.key === activeFeature;

                return (
                  <button
                    key={feature.key}
                    type="button"
                    // Added onClick for mobile interaction
                    onClick={() => setActiveFeature(feature.key)}
                    onMouseEnter={() => setActiveFeature(feature.key)}
                    onFocus={() => setActiveFeature(feature.key)}
                    aria-pressed={isActive}
                    className={`relative w-full overflow-hidden rounded-2xl border bg-white p-4 text-left transition-all duration-300 sm:p-5 ${
                      isActive
                        ? 'border-[#c7d3e4] shadow-[0_14px_30px_-24px_rgba(15,23,42,0.5)]'
                        : 'border-[#dfe7f2] hover:border-[#c7d3e4]'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                          isActive
                            ? 'border-[#cfd9e7] bg-[#f1f5fb] text-slate-700'
                            : 'border-[#e2e8f2] bg-white text-slate-500'
                        }`}
                      >
                        <FeatureIcon size={16} />
                      </span>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-lg font-semibold text-slate-900 sm:text-xl">
                            {feature.title}
                          </p>
                        </div>
                        <p className="mt-1.5 text-base leading-relaxed text-slate-600 sm:text-lg">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right Column: Sticky Preview Area */}
            <div
              className="relative h-full min-h-[500px] overflow-hidden rounded-[26px] border border-[#dbe5f1] bg-white lg:sticky lg:top-8"
              onMouseEnter={() => setIsPreviewHovered(true)}
              onMouseLeave={() => setIsPreviewHovered(false)}
            >
              {/* Dynamic Backgrounds */}
              <div
                className="absolute inset-0 transition-[background] duration-500"
                style={{ background: activeFeatureData.preview.background }}
              />
              <div
                className="absolute inset-0 transition-[background] duration-500"
                style={{ background: activeFeatureData.preview.spotlight }}
              />

              {/* Flex Container for Vertical Layout */}
              <div className="relative z-10 flex h-full flex-col">
                
                {/* Top Section: Header */}
                <div>
                  <div className="flex items-center justify-between px-5 pt-5 sm:px-6 sm:pt-6">
                    <div className="inline-flex items-center gap-2 rounded-full border border-[#dfe7f2] bg-white/90 px-3 py-1 text-sm font-semibold uppercase tracking-[0.12em] text-slate-500 backdrop-blur-sm">
                      <ActiveIcon size={12} />
                      {activeFeatureData.title}
                    </div>
                  </div>
                </div>

                {/* Bottom Section: Image */}
                <div className="relative flex w-full flex-1 items-center justify-center">
                  <div className="relative h-[360px] w-[210px] sm:h-[430px] sm:w-[250px] lg:h-[470px] lg:w-[280px]">
                     {/* Shadow blur moved inside relative container to stay with phone */}
                    <div className="absolute bottom-6 left-1/2 h-12 w-[60%] -translate-x-1/2 rounded-full bg-black/[0.06] blur-2xl" />
                    
                    <Image
                      src={activeFeatureData.preview.src}
                      alt={`${activeFeatureData.title} preview`}
                      fill
                      priority
                      sizes="(max-width: 640px) 260px, (max-width: 1024px) 320px, 360px"
                      className="object-contain drop-shadow-[0_14px_18px_rgba(15,23,42,0.14)] transition-transform duration-500 ease-out"
                      style={{ transform: mockupTransform }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              href={ctaHref}
              className="group inline-flex items-center gap-2 text-base font-bold text-gray-900 transition-colors hover:text-purple-600"
            >
              {resolvedCtaLabel}
            </Link>
            <p className="mt-2 text-base text-gray-400">
              {resolvedCtaHelperText}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientExperienceSection;
