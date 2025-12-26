'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowRight,
  Check,
  LayoutGrid,
  Settings,
  Table2,
  Menu,
  MoreHorizontal,
  ChevronDown,
  Activity,
  PieChart
} from 'lucide-react';

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
  const resolvedTitle = content?.title || 'Why is fitness software so...';
  const resolvedTitleHighlight = content?.titleHighlight || 'painful?';
  const resolvedSubtitle = content?.subtitle || 'Most tools force you to choose between chaos and complexity. We chose neither.';
  const highlightLength = resolvedTitleHighlight.replace(/\s+/g, '').length;
  const slamScale = Math.max(4.5, Math.min(10, 14 - highlightLength * 0.4));
  const slamDelay = '1s';
  
  // ЛОГІКА ВИДИМОСТІ
  const [isVisible, setIsVisible] = useState(false);
  const highlightRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    setIsVisible(false);
    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsVisible(true);
          if (highlightRef.current) observer.unobserve(highlightRef.current);
        }
      },
      { threshold: 0.5, rootMargin: '0px 0px -20% 0px' }
    );

    const target = highlightRef.current;
    if (target) observer.observe(target);
    return () => {
      if (target) observer.unobserve(target);
      observer.disconnect();
    };
  }, [resolvedTitleHighlight]);

  // ... Картки (без змін)
  const defaultCards: ProblemCard[] = [
    { key: 'spreadsheet', title: 'The "Spreadsheet" Hell', body: "You spend Sunday nights copy-pasting cells instead of resting. Formulas break. Links expire. It's not scalable." },
    { key: 'enterprise', title: 'The "Enterprise" Overkill', body: "Built for big box gyms. You don't need turnstile integrations, payroll systems, or 15 clicks just to assign a squat." },
    { key: 'jimmy', title: 'The Jimmy Way', body: 'Just Coaching. Fast, intuitive, and built for the workflow of a solo business owner.', badge: 'New', ctaLabel: 'See how it works', uiActionLabel: 'Update Program', uiAvatarInitials: 'JD', uiStatusLabel: 'Active' }
  ];
  const resolvedCards = content?.cards?.length ? content.cards : defaultCards;
  const findCard = (key: string, fallback: ProblemCard) => resolvedCards.find((card) => card.key === key) || fallback;
  const spreadsheetCard = findCard('spreadsheet', defaultCards[0]);
  const enterpriseCard = findCard('enterprise', defaultCards[1]);
  const jimmyCard = findCard('jimmy', defaultCards[2]);

  return (
    <section className="mt-12 py-12 md:mt-0 md:py-24 bg-white relative overflow-hidden">
      
      {/* --- CSS СТИЛІ --- */}
      <style>{`
        /* 1. SLAM ANIMATION */
        @keyframes iMessageSlam {
          0% {
            opacity: 0;
            transform: scale(var(--slam-scale)) rotate(-5deg);
          }
          40% {
            opacity: 1;
            transform: scale(0.6) rotate(-3deg);
          }
          55% {
             transform: scale(1.1) rotate(-3deg) translate(-2px, 2px);
          }
          70% {
             transform: scale(0.95) rotate(-3deg) translate(2px, -2px);
          }
          85% {
             transform: scale(1.02) rotate(-3deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotate(-3deg);
          }
        }

        /* 2. DUST PARTICLES ANIMATION */
        @keyframes dust-puff {
          0% {
            opacity: 1;
            transform: translate(0, 0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(var(--tx), var(--ty)) scale(0);
          }
        }

        .animate-slam-text {
          animation: iMessageSlam 0.9s cubic-bezier(0.15, 0.85, 0.35, 1.1) forwards;
          animation-delay: var(--slam-delay, 0s);
          animation-fill-mode: both;
        }

        .dust-particle {
          position: absolute;
          /* Позиціонуємо по центру слова */
          left: 50%;
          bottom: 20%; 
          width: 6px;  /* ЗБІЛЬШИВ РОЗМІР */
          height: 6px; /* ЗБІЛЬШИВ РОЗМІР */
          background-color: #be185d; /* Яскраво-рожевий (pink-700) */
          border-radius: 50%;
          opacity: 0; 
          pointer-events: none;
          z-index: 0; /* Пил під текстом */
        }

        .trigger-dust .dust-particle {
          animation: dust-puff 0.5s ease-out forwards;
          animation-delay: calc(var(--slam-delay, 0s) + 0.22s); /* Синхронізація з ударом */
        }
      `}</style>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* HEADER */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-4 leading-tight">
            {resolvedTitle}{' '}
            
            {/* WRAPPER: 
                relative - щоб частинки позуціонувались відносно нього.
                z-0 - базовий рівень.
            */}
            <span
              ref={highlightRef}
              style={{ '--slam-scale': slamScale, '--slam-delay': slamDelay } as React.CSSProperties}
              className={`relative inline-block mx-1 z-0 ${isVisible ? 'trigger-dust' : ''}`}
            >
              
              {/* SLAM TEXT (z-10 щоб бути над пилом) */}
              <span
                className={`relative z-20 inline-block bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent font-extrabold origin-center drop-shadow-sm ${isVisible ? 'animate-slam-text' : 'opacity-0'}`}
              >
                {resolvedTitleHighlight}
              </span>

              {/* ЧАСТИНКИ ПИЛУ (Збільшив радіус розльоту - tx/ty) */}
              <span className="dust-particle" style={{ '--tx': '-30px', '--ty': '-25px', backgroundColor: '#9333ea' } as React.CSSProperties} />
              <span className="dust-particle" style={{ '--tx': '30px', '--ty': '-25px', backgroundColor: '#db2777' } as React.CSSProperties} />
              <span className="dust-particle" style={{ '--tx': '-45px', '--ty': '10px', backgroundColor: '#4f46e5' } as React.CSSProperties} />
              <span className="dust-particle" style={{ '--tx': '45px', '--ty': '10px', backgroundColor: '#e11d48' } as React.CSSProperties} />
              
              {/* Центральна частинка, що летить вище всіх */}
              <span className="dust-particle" style={{ '--tx': '0px', '--ty': '-40px', width: '4px', height: '4px' } as React.CSSProperties} />
            
            </span>
          </h2>
          <p className="text-lg text-gray-500">
            {resolvedSubtitle}
          </p>
        </div>

        {/* GRID (Без змін) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* 1. Spreadsheet */}
            <div className="group relative rounded-3xl bg-gray-50 border border-gray-200 p-8 flex flex-col transition-all duration-300 hover:bg-white hover:border-gray-300 hover:shadow-xl hover:shadow-gray-200/40">
                <div className="mb-6"><div className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300"><Table2 className="w-6 h-6 text-gray-400 group-hover:text-emerald-600 transition-colors" /></div><h3 className="text-lg font-bold text-gray-900 mb-2">{spreadsheetCard.title}</h3><p className="text-gray-500 text-sm leading-relaxed">{spreadsheetCard.body}</p></div>
                <div className="mt-auto relative rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden opacity-70 group-hover:opacity-100 transition-opacity"><div className="flex border-b border-gray-100 bg-gray-50 px-3 py-2 gap-2"><div className="h-1.5 w-1.5 rounded-full bg-emerald-200"></div><div className="h-1.5 w-1.5 rounded-full bg-emerald-200"></div></div><div className="p-3 grid grid-cols-4 gap-px bg-gray-100 text-[6px] text-gray-400 font-mono">{[...Array(16)].map((_, i) => (<div key={i} className={`bg-white h-5 flex items-center px-1 ${i === 7 ? 'bg-red-50 text-red-500 font-bold border border-red-100 z-10' : ''}`}>{i === 7 ? '#REF!' : '---'}</div>))}</div></div>
            </div>
            {/* 2. Enterprise */}
            <div className="group relative rounded-3xl bg-gray-50 border border-gray-200 p-8 flex flex-col transition-all duration-300 hover:bg-white hover:border-gray-300 hover:shadow-xl hover:shadow-gray-200/40">
                 <div className="mb-6"><div className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300"><LayoutGrid className="w-6 h-6 text-gray-400 group-hover:text-blue-600 transition-colors" /></div><h3 className="text-lg font-bold text-gray-900 mb-2">{enterpriseCard.title}</h3><p className="text-gray-500 text-sm leading-relaxed">{enterpriseCard.body}</p></div>
                 <div className="mt-auto relative rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col h-36 opacity-70 group-hover:opacity-100 transition-opacity select-none"><div className="h-7 border-b border-gray-100 bg-gray-50/80 flex items-center px-2 justify-between gap-2"><div className="flex gap-1 items-center"><div className="w-3 h-3 rounded-sm bg-blue-100 border border-blue-200"></div><div className="w-8 h-2 rounded-sm bg-gray-200"></div></div><Settings size={8} className="text-gray-300" /></div><div className="flex flex-1 overflow-hidden"><div className="w-10 border-r border-gray-100 bg-gray-50/50 flex flex-col py-2 px-1 gap-1">{[...Array(5)].map((_, i) => (<div key={i} className="h-1.5 w-full bg-gray-200 rounded-sm opacity-60"></div>))}</div><div className="flex-1 p-1.5 bg-white flex flex-col gap-1.5 overflow-hidden"><div className="flex gap-1.5 h-10"><div className="flex-1 border border-gray-100 rounded-[4px] p-1 flex flex-col bg-blue-50/50"></div></div><div className="flex-1 border border-gray-100 rounded-[4px] bg-gray-50"></div></div></div></div>
            </div>
            {/* 3. Jimmy */}
            <div className="group relative rounded-3xl bg-gradient-to-br from-purple-600 to-indigo-600 p-8 flex flex-col shadow-xl shadow-indigo-200 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-400/40 hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none mix-blend-overlay"></div><div className="relative z-10 mb-6"><div className="flex items-center justify-between mb-4"><div className="w-12 h-12 rounded-xl bg-white/20 border border-white/20 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-300"><Check className="w-6 h-6 text-white" /></div><span className="px-3 py-1 rounded-full bg-white/10 text-white text-[10px] font-bold uppercase tracking-wider border border-white/20">{jimmyCard.badge}</span></div><h3 className="text-lg font-bold text-white mb-2">{jimmyCard.title}</h3><p className="text-indigo-100 text-sm leading-relaxed">{jimmyCard.body}</p></div><div className="mt-auto relative z-10"><div className="rounded-xl bg-white shadow-lg shadow-purple-900/20 p-4 transform transition-transform duration-500 group-hover:scale-[1.02]"><div className="flex items-center justify-between mb-3"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 text-xs font-bold ring-2 ring-indigo-50">{jimmyCard.uiAvatarInitials}</div><div><div className="h-2 w-20 bg-gray-800 rounded-full mb-1"></div><div className="h-1.5 w-12 bg-gray-300 rounded-full"></div></div></div><div className="bg-green-100 px-2 py-0.5 rounded text-[10px] text-green-700 font-medium border border-green-200">{jimmyCard.uiStatusLabel}</div></div><div className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 border border-gray-100 hover:border-indigo-200 transition-colors cursor-pointer group/item"><div className="flex items-center gap-3"><div className="w-4 h-4 rounded border border-gray-300 flex items-center justify-center bg-white group-hover/item:bg-indigo-600 group-hover/item:border-indigo-600 transition-colors"><Check className="w-2.5 h-2.5 text-white opacity-0 group-hover/item:opacity-100" /></div><span className="text-sm font-medium text-gray-600 group-hover/item:text-gray-900">{jimmyCard.uiActionLabel}</span></div></div></div><div className="mt-6 flex items-center text-white font-semibold text-sm cursor-pointer hover:text-indigo-100 transition-colors group/link">{jimmyCard.ctaLabel}{' '}<ArrowRight size={16} className="ml-2 group-hover/link:translate-x-1 transition-transform" /></div></div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
