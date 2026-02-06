'use client';

import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

const HERO_COACH_AVATARS = [
  '/assets/photo/coach/Coach%201.png',
  '/assets/photo/coach/Coach%202.png',
  '/assets/photo/coach/Coach%203.png',
];

type HeroContent = {
  badgeText?: string;
  title?: string;
  titleHighlight?: string;
  subtitle?: string;
  inputPlaceholder?: string;
  mockupUrlLabel?: string;
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
  const resolvedSubtitleTemplate = content?.subtitle || 'Stop hacking together Excel and WhatsApp. {brand} is the workspace built for solopreneurs to manage clients, programming, and progress.';
  const resolvedInputPlaceholder = content?.inputPlaceholder || 'Enter your email...';
  const resolvedSocialProofText = content?.socialProofText || 'Join 400+ other coaches waiting for access.';
  const resolvedSuccessMessage = content?.successMessage || "You're on the list! Keep an eye on your inbox.";
  const subtitleParts = resolvedSubtitleTemplate.split('{brand}');
  const subtitleHasBrand = resolvedSubtitleTemplate.includes('{brand}');
  const resolvedDesktopTitleLines = resolvedTitle.includes('.')
    ? resolvedTitle
        .split('.')
        .map((part) => part.trim())
        .filter(Boolean)
        .map((part) => `${part}.`)
    : [resolvedTitle];
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isSubmitting = status === 'submitting';
  const isSuccess = status === 'success';
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const confettiFiredRef = useRef(false);

  const fireConfetti = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const colors = ['#7c3aed', '#22c55e', '#f59e0b', '#ec4899', '#ffffff'];

    canvas.width = canvas.offsetWidth || 600;
    canvas.height = canvas.offsetHeight || 600;

    const particles = Array.from({ length: 50 }).map(() => ({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 12,
      vy: (Math.random() - 2) * 10,
      life: 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 4 + 2,
    }));

    const animate = () => {
      if (particles.length === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.5;
        p.life -= 2;

        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.life / 100);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        if (p.life <= 0) {
          particles.splice(i, 1);
          i -= 1;
        }
      }

      requestAnimationFrame(animate);
    };

    animate();
  };

  useEffect(() => {
    if (isSuccess && !confettiFiredRef.current) {
      confettiFiredRef.current = true;
      fireConfetti();
    }
    if (!isSuccess) {
      confettiFiredRef.current = false;
    }
  }, [isSuccess]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email || isSubmitting) return;
    setStatus('submitting');
    setErrorMessage(null);
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || 'Unable to join the waitlist.');
      }
      setStatus('success');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to join the waitlist.';
      setErrorMessage(message);
      setStatus('error');
    }
  };

  return (
    <section className="relative pt-20 lg:pt-40 pb-0 overflow-hidden border-b border-[#e3e8f1] bg-[#f5f7fb] lg:bg-white" id="waitlist">
      <style jsx>{`
        @keyframes bounce-in {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }
          50% {
            transform: scale(1.05);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes success-pulse {
          0% {
            transform: scale(0.6);
            opacity: 0;
          }
          50% {
            transform: scale(1.08);
          }
          70% {
            transform: scale(0.98);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes success-glow {
          0%,
          100% {
            box-shadow: 0 0 20px rgba(16, 185, 129, 0.35);
          }
          50% {
            box-shadow:
              0 0 50px rgba(16, 185, 129, 0.55),
              0 0 80px rgba(16, 185, 129, 0.35);
          }
        }
        @keyframes checkmark-draw {
          0% {
            stroke-dashoffset: 24;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
        @keyframes celebration-ring {
          0% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0;
          }
        }
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
        .animate-success-pulse {
          animation: success-pulse 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)
            forwards;
        }
        .animate-success-glow {
          animation: success-glow 2s ease-in-out infinite;
        }
        .animate-bounce-in {
          animation: bounce-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)
            forwards;
        }
        .animate-checkmark {
          stroke-dasharray: 24;
          stroke-dashoffset: 24;
          animation: checkmark-draw 0.4s ease-out 0.3s forwards;
        }
        .animate-ring {
          animation: celebration-ring 0.8s ease-out forwards;
        }
        .hand-reveal {
          animation: hand-reveal 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
          transform-origin: 50% 100%;
          will-change: transform, opacity;
        }
        .hand-float {
          animation: hand-float 7s ease-in-out 1s infinite;
          will-change: transform;
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
        @media (prefers-reduced-motion: reduce) {
          .hand-reveal,
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start lg:min-h-[calc(100vh-10rem)] lg:gap-10 xl:gap-14">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full bg-white border border-purple-100 shadow-[0_2px_10px_-3px_rgba(124,58,237,0.1)] hover:border-purple-200 transition-colors lg:self-start hero-reveal hero-delay-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-600"></span>
              </span>
              <span className="text-[11px] font-bold text-purple-900 tracking-wider uppercase">
                {resolvedBadgeText}
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-gray-900 mb-6 leading-[1.1] max-w-4xl lg:max-w-2xl hero-reveal hero-delay-2">
              <span className="lg:hidden">{resolvedTitle}</span>
              <span className="hidden lg:block">
                {resolvedDesktopTitleLines.map((line, index) => (
                  <span key={`desktop-title-line-${index}`} className="block">
                    {line}
                  </span>
                ))}
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600">
                {resolvedTitleHighlight}
              </span>
            </h1>

            <p className="mt-4 max-w-2xl text-lg sm:text-xl text-gray-500 mb-10 leading-relaxed lg:max-w-xl hero-reveal hero-delay-3">
              {subtitleHasBrand ? (
                <>
                  {subtitleParts[0]}
                  <span className="text-gray-900 font-medium">{resolvedBrandLabel}</span>
                  {subtitleParts[1]}
                </>
              ) : (
                resolvedSubtitleTemplate
              )}
            </p>

            <div className="w-full max-w-md relative group mb-0 z-20 mx-auto lg:mx-0 hero-reveal hero-delay-4">
              <div
                className="relative w-full min-h-[60px] perspective-1000"
                style={{ perspective: '1000px' }}
              >
                <canvas
                  ref={canvasRef}
                  className="absolute top-1/2 left-1/2 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50"
                />

                <div
                  className={`absolute inset-0 flex items-center justify-center rounded-full border border-green-200 bg-green-50 text-green-800 px-4 text-sm font-semibold transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                    isSuccess
                      ? 'opacity-100 animate-success-pulse animate-success-glow'
                      : 'opacity-0 pointer-events-none'
                  }`}
                  style={{
                    transform: isSuccess ? 'rotateX(0deg) scale(1)' : 'rotateX(-90deg) scale(0.95)',
                  }}
                >
                  {isSuccess && (
                    <>
                      <div
                        className="absolute top-1/2 left-1/2 h-full w-full rounded-full border-2 border-emerald-400 animate-ring"
                        style={{ animationDelay: '0s' }}
                      />
                      <div
                        className="absolute top-1/2 left-1/2 h-full w-full rounded-full border-2 border-emerald-300 animate-ring"
                        style={{ animationDelay: '0.15s' }}
                      />
                      <div
                        className="absolute top-1/2 left-1/2 h-full w-full rounded-full border-2 border-emerald-200 animate-ring"
                        style={{ animationDelay: '0.3s' }}
                      />
                    </>
                  )}
                  <div className={`flex items-center gap-2 ${isSuccess ? 'animate-bounce-in' : ''}`}>
                    <div className="bg-green-100 p-1 rounded-full text-green-700">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          className={isSuccess ? 'animate-checkmark' : ''}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span className="text-center leading-snug">{resolvedSuccessMessage}</span>
                  </div>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className={`relative w-full h-[60px] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                    isSuccess ? 'opacity-0 pointer-events-none' : 'opacity-100'
                  }`}
                  style={{
                    transform: isSuccess ? 'rotateX(90deg) scale(0.96)' : 'rotateX(0deg) scale(1)',
                  }}
                >
                  <div className="relative h-full w-full">
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-200 to-indigo-200 rounded-full blur opacity-20 group-hover:opacity-50 transition duration-500"></div>
                    <div className="relative flex h-full items-center bg-white p-1.5 rounded-full border border-gray-200 shadow-xl shadow-purple-900/5 focus-within:ring-2 focus-within:ring-purple-100 focus-within:border-purple-300 transition-all duration-300">
                      <div className="flex-1 pl-5">
                        <input
                          type="email"
                          placeholder={resolvedInputPlaceholder}
                          className="w-full bg-transparent border-none p-2 text-gray-900 placeholder-gray-400 focus:ring-0 focus:outline-none text-base outline-none"
                          value={email}
                          onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            setEmail(event.target.value);
                            if (status === 'error') {
                              setStatus('idle');
                              setErrorMessage(null);
                            }
                          }}
                          disabled={isSubmitting}
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-shrink-0 px-6 py-3.5 rounded-full font-bold text-white bg-purple-600 shadow-md flex items-center gap-2 hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-500/25 active:scale-95 transition-all duration-200 min-w-[132px] justify-center"
                      >
                        {isSubmitting ? (
                          <svg
                            className="animate-spin h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                        ) : (
                          <>
                            {resolvedWaitlistLabel} <ArrowRight size={16} />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {errorMessage && (
                <p className="mt-4 text-sm text-red-500 font-medium">{errorMessage}</p>
              )}
              <div className="mt-8 relative z-30 text-xs text-gray-500 font-medium flex items-center justify-center lg:justify-start gap-2">
                <div className="flex -space-x-2">
                  {HERO_COACH_AVATARS.map((url) => (
                    <Image
                      key={url}
                      src={url}
                      alt="Coach"
                      width={24}
                      height={24}
                      sizes="24px"
                      className="w-6 h-6 rounded-full border-2 border-white ring-1 ring-gray-100"
                      loading="lazy"
                    />
                  ))}
                </div>
                <span>{resolvedSocialProofText}</span>
              </div>

              <div className="mt-4 -mb-1 flex w-full justify-center lg:hidden hero-reveal hero-delay-5">
                <div className="hand-reveal">
                  <div className="hand-float">
                    <Image
                      src="/assets/photo/mock/hand-mock-hero.png"
                      alt="Jimmy app hand mockup"
                      width={1041}
                      height={1323}
                      sizes="(max-width: 639px) 78vw, (max-width: 1023px) 68vw, 0px"
                      className="h-[430px] w-auto object-contain select-none sm:h-[500px]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative hidden lg:flex lg:h-[calc(100svh-10rem)] lg:self-end items-end justify-end">
            <div className="relative flex w-full justify-end lg:-translate-x-[7%]">
              <div className="hand-reveal">
                <div className="hand-float">
                  <Image
                    src="/assets/photo/mock/hand-mock-hero.png"
                    alt="Jimmy app hand mockup"
                    width={1041}
                    height={1323}
                    sizes="(max-width: 700px) 0px, (max-width: 1439px) 500px, 580px"
                    className="h-[620px] max-h-full w-auto max-w-none object-contain select-none xl:h-[710px] 2xl:h-[760px]"
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
