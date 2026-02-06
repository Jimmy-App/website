'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowRight, Check, Layers, LayoutGrid, Table2 } from 'lucide-react';

type ProblemCard = {
  key?: string;
  title?: string;
  body?: string;
  badge?: string;
  ctaLabel?: string;
  uiActionLabel?: string;
  uiStatusLabel?: string;
  uiAvatarInitials?: string;
};

type ProblemContent = {
  title?: string;
  titleHighlight?: string;
  subtitle?: string;
  cards?: ProblemCard[];
};

type ProblemSectionProps = {
  content?: ProblemContent | null;
};

const ProblemSection = ({ content }: ProblemSectionProps) => {
  const resolvedTitle = content?.title || 'Your expertise deserves better than a';
  const resolvedTitleHighlight = content?.titleHighlight || 'spreadsheet.';
  const resolvedSubtitle =
    content?.subtitle ||
    'You should spend your time coaching people, not fixing formulas, jumping across tabs, or wrestling bulky software.';

  const defaultCards: ProblemCard[] = [
    {
      key: 'spreadsheet',
      title: 'The "Spreadsheet" Hell',
      body: "You spend Sunday nights copy-pasting cells instead of resting. Formulas break. Links expire. It's not scalable.",
    },
    {
      key: 'enterprise',
      title: 'The "Enterprise" Overkill',
      body: "Built for big box gyms. You don't need turnstile integrations, payroll systems, or 15 clicks just to assign a squat.",
    },
    {
      key: 'jimmy',
      title: 'The Jimmy Way',
      body: 'One clean operating system for coaching. Program faster, manage clients easier, and keep everything in one place.',
      badge: 'New',
      ctaLabel: 'See the platform',
      uiActionLabel: 'Update Program',
      uiAvatarInitials: 'JD',
      uiStatusLabel: 'Active clients',
    },
  ];

  const resolvedCards = content?.cards?.length ? content.cards : defaultCards;
  const findCard = (key: string, fallback: ProblemCard) =>
    resolvedCards.find((card) => card.key === key) || fallback;

  const spreadsheetCard = findCard('spreadsheet', defaultCards[0]);
  const enterpriseCard = findCard('enterprise', defaultCards[1]);
  const jimmyCard = findCard('jimmy', defaultCards[2]);

  const jimmyBadge = jimmyCard.badge || 'Jimmy';
  const jimmyCtaLabel = jimmyCard.ctaLabel || 'See the platform';
  const jimmyStatusLabel = jimmyCard.uiStatusLabel || 'Active clients';
  const jimmyActionLabel = jimmyCard.uiActionLabel || 'Update Program';
  const highlightRef = useRef<HTMLSpanElement | null>(null);
  const [isHighlightInView, setIsHighlightInView] = useState(false);

  useEffect(() => {
    if (isHighlightInView) return;
    if (typeof window === 'undefined') return;

    if (!('IntersectionObserver' in window)) {
      const fallbackTimer = globalThis.setTimeout(() => {
        setIsHighlightInView(true);
      }, 0);
      return () => globalThis.clearTimeout(fallbackTimer);
    }

    const target = highlightRef.current;
    if (!target) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) {
          setIsHighlightInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.45, rootMargin: '0px 0px -8% 0px' }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [isHighlightInView]);

  return (
    <section className="relative overflow-hidden border-t border-[#edf1f6] bg-white py-14 md:py-24">
      <style jsx>{`
        @keyframes spreadsheetBoom {
          0% {
            opacity: 0;
            transform: translate3d(24px, -18px, 0) scale(2.05) rotate(-11deg);
          }
          46% {
            opacity: 1;
            transform: translate3d(1px, 3px, 0) scale(0.82) rotate(-1deg);
          }
          72% {
            opacity: 1;
            transform: translate3d(8px, -1px, 0) scale(1.13) rotate(-3.8deg);
          }
          100% {
            opacity: 1;
            transform: translate3d(5px, 0, 0) scale(1) rotate(-2deg);
          }
        }

        .spreadsheet-boom {
          display: inline-block;
          transform: translate3d(5px, 0, 0) rotate(-2deg);
        }

        .spreadsheet-boom-pending {
          opacity: 0;
          transform: translate3d(24px, -18px, 0) scale(2.05) rotate(-11deg);
        }

        .spreadsheet-boom-active {
          animation: spreadsheetBoom 680ms cubic-bezier(0.14, 0.92, 0.18, 1.28) 500ms both;
          will-change: transform, opacity;
        }

        @media (prefers-reduced-motion: reduce) {
          .spreadsheet-boom-pending,
          .spreadsheet-boom-active {
            animation: none;
            opacity: 1;
            transform: translate3d(5px, 0, 0) rotate(-2deg);
          }
        }
      `}</style>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#dfe7f2] bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
            <Layers size={12} />
            Built for modern coaches
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-5xl md:leading-[1.05]">
            {resolvedTitle}{' '}
            <span
              ref={highlightRef}
              className={`spreadsheet-boom bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent ${
                isHighlightInView ? 'spreadsheet-boom-active' : 'spreadsheet-boom-pending'
              }`}
            >
              {resolvedTitleHighlight}
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-500 md:text-xl">
            {resolvedSubtitle}
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <article className="flex flex-col rounded-[24px] border border-[#e1e8f2] bg-white p-6 shadow-[0_12px_24px_-20px_rgba(15,23,42,0.18)] transition-transform duration-200 hover:-translate-y-0.5">
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-[#e7edf5] bg-[#f8fbff] text-slate-500">
              <Table2 size={20} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">{spreadsheetCard.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">{spreadsheetCard.body}</p>

            <div className="mt-6 h-[170px] overflow-hidden rounded-2xl border border-[#dbe5f1] bg-white shadow-[inset_0_1px_0_#ffffff]">
              <div className="flex h-9 items-center justify-between border-b border-[#e7edf5] bg-[#f8fbff] px-3">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#c9d7ea]" />
                  <span className="h-2 w-2 rounded-full bg-[#c9d7ea]" />
                  <span className="h-2 w-2 rounded-full bg-[#c9d7ea]" />
                </div>
                <span className="rounded-full border border-[#e7edf5] bg-white px-2 py-0.5 text-[9px] font-semibold text-slate-400">
                  Sheet v9
                </span>
              </div>

              <div className="grid h-[calc(170px-36px)] grid-cols-5 gap-px bg-[#dfe7f2] p-px text-[9px] font-semibold text-slate-400">
                {Array.from({ length: 25 }).map((_, index) => {
                  const isBroken = index === 13;
                  return (
                    <div
                      key={`sheet-cell-${index}`}
                      className={`flex items-center px-2 ${
                        isBroken
                          ? 'bg-[#fff1f2] font-bold text-[#e11d48]'
                          : 'bg-white'
                      }`}
                    >
                      {isBroken ? '#REF!' : '---'}
                    </div>
                  );
                })}
              </div>
            </div>
          </article>

          <article className="flex flex-col rounded-[24px] border border-[#e1e8f2] bg-white p-6 shadow-[0_12px_24px_-20px_rgba(15,23,42,0.18)] transition-transform duration-200 hover:-translate-y-0.5">
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-[#e7edf5] bg-[#f8fbff] text-slate-500">
              <LayoutGrid size={20} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">{enterpriseCard.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">{enterpriseCard.body}</p>

            <div className="mt-6 h-[170px] overflow-hidden rounded-2xl border border-[#dbe5f1] bg-white shadow-[inset_0_1px_0_#ffffff]">
              <div className="flex h-9 items-center justify-between border-b border-[#e7edf5] bg-[#f8fbff] px-3">
                <span className="h-2 w-24 rounded-full bg-[#d7e1ef]" />
                <span className="rounded-full border border-[#e7edf5] bg-white px-2 py-0.5 text-[9px] font-semibold text-slate-400">
                  Pro Suite
                </span>
              </div>

              <div className="flex h-[calc(170px-36px)]">
                <div className="w-14 border-r border-[#e7edf5] bg-[#f8fbff] p-2">
                  <div className="space-y-2">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <div key={`menu-line-${index}`} className="h-1.5 rounded-full bg-[#d7e1ef]" />
                    ))}
                  </div>
                </div>

                <div className="flex-1 space-y-2.5 p-2.5">
                  <div className="h-10 rounded-lg border border-[#e7edf5] bg-[#f8fbff] p-2">
                    <div className="h-2 w-2/3 rounded-full bg-[#d7e1ef]" />
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="h-[68px] rounded-lg border border-[#e7edf5] bg-[#f8fbff] p-2">
                      <div className="h-2 w-12 rounded-full bg-[#d7e1ef]" />
                      <div className="mt-2 h-1.5 w-8 rounded-full bg-[#d7e1ef]" />
                      <div className="mt-1.5 h-1.5 w-10 rounded-full bg-[#d7e1ef]" />
                    </div>
                    <div className="h-[68px] rounded-lg border border-[#e7edf5] bg-[#f8fbff] p-2">
                      <div className="h-2 w-10 rounded-full bg-[#d7e1ef]" />
                      <div className="mt-2 h-1.5 w-9 rounded-full bg-[#d7e1ef]" />
                      <div className="mt-1.5 h-1.5 w-7 rounded-full bg-[#d7e1ef]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>

        <article className="mt-6 overflow-hidden rounded-[28px] border border-[#dfe7f2] bg-white p-5 shadow-[0_18px_34px_-26px_rgba(15,23,42,0.2)] sm:p-7">
          <div className="grid items-center gap-7 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#ece9ff] bg-[#f7f4ff] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#5b47ff]">
                <Check size={12} />
                {jimmyBadge}
              </div>

              <h3 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                {jimmyCard.title}
              </h3>

              <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-500 md:text-base">
                {jimmyCard.body}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                <span className="rounded-full border border-[#dce7f4] bg-[#f8fbff] px-3 py-1 text-xs font-semibold text-slate-600">
                  {jimmyStatusLabel}
                </span>
                <span className="rounded-full border border-[#dce7f4] bg-[#f8fbff] px-3 py-1 text-xs font-semibold text-slate-600">
                  {jimmyActionLabel}
                </span>
              </div>

              <div className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
                {jimmyCtaLabel}
                <ArrowRight size={16} />
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="rounded-[22px] border border-[#dce6f2] bg-[#f8fbff] p-2 sm:p-3">
                <Image
                  src="/assets/photo/dashboard.png"
                  alt="Jimmy dashboard platform preview"
                  width={3024}
                  height={1720}
                  sizes="(max-width: 1024px) 100vw, 56vw"
                  className="h-auto w-full rounded-[16px] border border-[#dbe5f0] object-cover"
                />
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
};

export default ProblemSection;
