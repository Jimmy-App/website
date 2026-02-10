'use client';

import Image from 'next/image';
import WaitlistSignupForm from './WaitlistSignupForm';

type HeroContent = {
  badgeText?: string;
  title?: string;
  titleHighlight?: string;
  subtitle?: string;
  inputPlaceholder?: string;
  socialProofText?: string;
  successMessage?: string;
};

type HeroProps = {
  waitlistLabel?: string;
  brandLabel?: string;
  content?: HeroContent | null;
};

const Hero = ({ waitlistLabel, brandLabel, content }: HeroProps) => {
  const resolvedWaitlistLabel = waitlistLabel || 'Join Waitlist';
  const resolvedBadgeText = content?.badgeText || 'Waitlist Open';
  const resolvedTitle = content?.title || 'The operating system for';
  const resolvedTitleHighlight = content?.titleHighlight || 'independent coaches';
  const resolvedBrandLabel = brandLabel || 'Jimmy';
  const resolvedSubtitleTemplate =
    content?.subtitle ||
    'Stop hacking together Excel and WhatsApp. {brand} is the workspace built for solopreneurs to manage clients, programming, and progress.';
  const resolvedInputPlaceholder = content?.inputPlaceholder || 'Enter your email...';
  const resolvedSocialProofText =
    content?.socialProofText || 'Join 400+ other coaches waiting for access.';
  const resolvedSuccessMessage =
    content?.successMessage || "You're on the list! Keep an eye on your inbox.";
  const subtitleParts = resolvedSubtitleTemplate.split('{brand}');
  const subtitleHasBrand = resolvedSubtitleTemplate.includes('{brand}');
  const resolvedDesktopTitleLines = resolvedTitle.includes('.')
    ? resolvedTitle
        .split('.')
        .map((part) => part.trim())
        .filter(Boolean)
        .map((part) => `${part}.`)
    : [resolvedTitle];

  return (
    <section
      className="relative overflow-hidden border-b border-[#e3e8f1] bg-[#f5f7fb] pb-0 pt-20 lg:bg-white lg:pt-40"
      id="waitlist"
    >
      <style jsx>{`
        @keyframes hand-reveal {
          0% {
            opacity: 0;
            transform: translateY(24px) scale(0.97) rotate(15deg);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1) rotate(0deg);
          }
        }
        @keyframes hand-float {
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
        .hand-float {
          will-change: transform;
        }
        .hand-reveal-desktop {
          transform-origin: 50% 100%;
          will-change: transform, opacity;
        }
        .hero-reveal {
          opacity: 1;
        }
        @media (min-width: 1024px) {
          .hand-reveal-desktop {
            animation: hand-reveal 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
          }
          .hand-float {
            animation: hand-float 7s ease-in-out 1s infinite;
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
        }
        @media (prefers-reduced-motion: reduce) {
          .hand-reveal-desktop,
          .hand-float,
          .hero-reveal {
            animation: none;
            opacity: 1;
            transform: none;
            filter: none;
          }
        }
      `}</style>
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-x-0 top-0 h-[100svh] overflow-hidden">
          <div className="absolute inset-0 bg-[#f5f7fb]" />
          <div className="absolute inset-x-0 top-0 h-px bg-[#edf1f7]" />
          <div className="absolute right-[-44%] top-[20%] h-[420px] w-[420px] rounded-full bg-[#eee8ff]/55 blur-[145px] md:right-[-24%] md:top-[16%] md:h-[520px] md:w-[520px] lg:right-[-10%] lg:h-[560px] lg:w-[560px]" />
          <div className="absolute right-[10%] top-[24%] h-[180px] w-[180px] rounded-full bg-[#f8f5ff] opacity-70 blur-[88px] md:right-[12%] md:top-[20%] md:h-[230px] md:w-[230px]" />
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:min-h-[calc(100vh-10rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start lg:gap-10 xl:gap-14">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <div className="hero-reveal hero-delay-1 mb-8 inline-flex items-center gap-2 rounded-full border border-purple-100 bg-white px-3 py-1 shadow-[0_2px_10px_-3px_rgba(124,58,237,0.1)] transition-colors hover:border-purple-200 lg:self-start">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-purple-600"></span>
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-900">
                {resolvedBadgeText}
              </span>
            </div>

            <h1 className="hero-reveal hero-delay-2 mb-6 max-w-4xl text-5xl font-bold leading-[1.1] tracking-tight text-gray-900 sm:text-6xl md:text-7xl lg:max-w-2xl">
              <span className="lg:hidden">{resolvedTitle}</span>
              <span className="hidden lg:block">
                {resolvedDesktopTitleLines.map((line, index) => (
                  <span key={`desktop-title-line-${index}`} className="block">
                    {line}
                  </span>
                ))}
              </span>
              <span className="block bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent">
                {resolvedTitleHighlight}
              </span>
            </h1>

            <p className="hero-reveal hero-delay-3 mb-10 mt-4 max-w-2xl text-lg leading-relaxed text-gray-500 sm:text-xl lg:max-w-xl">
              {subtitleHasBrand ? (
                <>
                  {subtitleParts[0]}
                  <span className="font-medium text-gray-900">{resolvedBrandLabel}</span>
                  {subtitleParts[1]}
                </>
              ) : (
                resolvedSubtitleTemplate
              )}
            </p>

            <div className="hero-reveal hero-delay-4 relative z-20 mb-0 mx-auto w-full max-w-md lg:mx-0">
              <WaitlistSignupForm
                waitlistLabel={resolvedWaitlistLabel}
                inputPlaceholder={resolvedInputPlaceholder}
                successMessage={resolvedSuccessMessage}
                socialProofText={resolvedSocialProofText}
                className="relative w-full group"
                socialProofClassName="mt-8 relative z-30 flex items-center justify-center gap-2 text-xs font-medium text-gray-500 lg:justify-start"
              />
            </div>
          </div>

          <div className="relative -mb-1 mt-4 flex w-full items-end justify-center lg:mt-0 lg:h-[calc(100svh-10rem)] lg:justify-end lg:self-end">
            <div className="relative flex w-full justify-center lg:justify-end lg:-translate-x-[7%]">
              <div className="hand-reveal-desktop">
                <div className="hand-float">
                  <Image
                    src="/assets/photo/mock/hand-mock-hero.png"
                    alt="Jimmy app hand mockup"
                    width={1041}
                    height={1323}
                    fetchPriority="high"
                    quality={60}
                    sizes="(max-width: 639px) 70vw, (max-width: 1023px) 62vw, (max-width: 1439px) 500px, 580px"
                    className="h-[400px] w-auto max-w-none select-none object-contain sm:h-[540px] lg:h-[620px] lg:max-h-full xl:h-[710px] 2xl:h-[760px]"
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

export default Hero;
