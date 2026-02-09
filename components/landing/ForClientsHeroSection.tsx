"use client";

import Image from "next/image";
import Link from "next/link";
import {
  DEFAULT_FOR_CLIENTS_HERO_CONTENT,
  type ForClientsHeroContent,
} from "./forClientsContent";

type ForClientsHeroSectionProps = {
  homeHref: string;
  waitlistHref: string;
  content?: ForClientsHeroContent | null;
};

const ForClientsHeroSection = ({
  homeHref,
  waitlistHref,
  content,
}: ForClientsHeroSectionProps) => {
  const badgeText =
    content?.badgeText ?? DEFAULT_FOR_CLIENTS_HERO_CONTENT.badgeText;
  const title = content?.title ?? DEFAULT_FOR_CLIENTS_HERO_CONTENT.title;
  const titleHighlight =
    content?.titleHighlight ?? DEFAULT_FOR_CLIENTS_HERO_CONTENT.titleHighlight;
  const subtitle =
    content?.subtitle ?? DEFAULT_FOR_CLIENTS_HERO_CONTENT.subtitle;
  const primaryButtonLabel =
    content?.primaryButtonLabel ??
    DEFAULT_FOR_CLIENTS_HERO_CONTENT.primaryButtonLabel;
  const secondaryButtonLabel =
    content?.secondaryButtonLabel ??
    DEFAULT_FOR_CLIENTS_HERO_CONTENT.secondaryButtonLabel;
  const imageAlt = content?.imageAlt ?? DEFAULT_FOR_CLIENTS_HERO_CONTENT.imageAlt;

  return (
    <section className="relative overflow-hidden bg-[#f5f7fb] pb-16 pt-20 lg:bg-white lg:pt-40">
      <style jsx>{`
        @keyframes hero-fade-up {
          0% {
            opacity: 0;
            transform: translateY(18px) scale(0.99);
            filter: blur(4px);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }
        @keyframes mockup-reveal {
          0% {
            opacity: 0;
            transform: translateY(24px) scale(0.985);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes mockup-unveil {
          0% {
            opacity: 0.2;
            clip-path: inset(100% 0 0 0);
            transform: translateY(14px);
          }
          100% {
            opacity: 1;
            clip-path: inset(0 0 0 0);
            transform: translateY(0);
          }
        }
        @keyframes mockup-float {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-7px);
          }
          100% {
            transform: translateY(0);
          }
        }
        .hero-reveal {
          opacity: 0;
          animation: hero-fade-up 0.72s cubic-bezier(0.22, 1, 0.36, 1) both;
          will-change: transform, opacity, filter;
        }
        .hero-delay-1 {
          animation-delay: 70ms;
        }
        .hero-delay-2 {
          animation-delay: 150ms;
        }
        .hero-delay-3 {
          animation-delay: 230ms;
        }
        .hero-delay-4 {
          animation-delay: 320ms;
        }
        .hero-delay-5 {
          animation-delay: 420ms;
        }
        .mockup-reveal {
          opacity: 0;
          animation: mockup-reveal 0.86s cubic-bezier(0.22, 1, 0.36, 1) 260ms
            both;
          will-change: transform, opacity;
        }
        .mockup-float {
          animation: mockup-float 8s ease-in-out 1.2s infinite;
          will-change: transform;
        }
        .mockup-unveil {
          opacity: 0;
          clip-path: inset(100% 0 0 0);
          animation: mockup-unveil 0.96s cubic-bezier(0.22, 1, 0.36, 1) 420ms
            both;
          will-change: clip-path, transform, opacity;
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-reveal,
          .mockup-reveal,
          .mockup-float,
          .mockup-unveil {
            animation: none;
            opacity: 1;
            transform: none;
            filter: none;
            clip-path: inset(0 0 0 0);
          }
        }
      `}</style>

      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-x-0 top-0 h-[100svh] overflow-hidden">
          <div className="absolute inset-0 bg-[#f5f7fb]" />
          <div className="absolute right-[-44%] top-[20%] h-[420px] w-[420px] rounded-full bg-[#eee8ff]/55 blur-[145px] md:right-[-24%] md:top-[16%] md:h-[520px] md:w-[520px] lg:right-[-10%] lg:h-[560px] lg:w-[560px]" />
          <div className="absolute left-[-34%] top-[34%] h-[300px] w-[300px] rounded-full bg-[#dbeafe]/55 blur-[130px] md:left-[-16%] md:h-[360px] md:w-[360px]" />
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)] lg:items-center lg:gap-10 xl:gap-14">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <p className="hero-reveal hero-delay-1 mb-7 inline-flex items-center gap-2 rounded-full border border-purple-100 bg-white px-3 py-1 shadow-[0_2px_10px_-3px_rgba(124,58,237,0.1)] lg:self-start">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-purple-600" />
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-900">
                {badgeText}
              </span>
            </p>

            <h1 className="hero-reveal hero-delay-2 max-w-4xl text-5xl font-bold leading-[1.1] tracking-tight text-gray-900 sm:text-6xl md:text-7xl lg:max-w-2xl">
              {title}{" "}
              <span className="bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent">
                {titleHighlight}
              </span>
            </h1>

            <p className="hero-reveal hero-delay-3 mb-10 mt-6 max-w-2xl text-lg leading-relaxed text-gray-500 sm:text-xl lg:max-w-xl">
              {subtitle}
            </p>

            <div className="hero-reveal hero-delay-4 flex w-full flex-nowrap items-center justify-center gap-3 sm:w-auto lg:justify-start">
              <Link
                href={waitlistHref}
                className="inline-flex whitespace-nowrap items-center justify-center rounded-full bg-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_-18px_rgba(124,58,237,0.9)] transition-all hover:bg-purple-700"
              >
                {primaryButtonLabel}
              </Link>
              <Link
                href={homeHref}
                className="inline-flex whitespace-nowrap items-center justify-center rounded-full border border-[#d9e2ef] bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                {secondaryButtonLabel}
              </Link>
            </div>
          </div>

          <div className="hero-reveal hero-delay-5 relative mx-auto mt-12 w-full max-w-3xl lg:mt-0 lg:-mr-8">
            <div className="mockup-reveal">
              <div className="mockup-float">
                <div className="mockup-unveil">
                  <Image
                    src="/assets/photo/mock/mobileapp-screen.gif"
                    alt={imageAlt}
                    width={960}
                    height={720}
                    sizes="(max-width: 1024px) 68vw, 360px"
                    className="mx-auto h-auto w-auto max-h-[640px] rounded-[28px] object-contain"
                    unoptimized
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForClientsHeroSection;
