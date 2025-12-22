"use client";

import React, { useState, useEffect } from 'react';
import { Menu, X, Check, ArrowRight, ChevronDown } from 'lucide-react';

// --- КОНСТАНТИ ТА ДАНІ ---

const LANGUAGES = [
  { code: 'EN', flag: '🇺🇸', label: 'English' },
  { code: 'ES', flag: '🇪🇸', label: 'Español' },
  { code: 'FR', flag: '🇫🇷', label: 'Français' },
  { code: 'UA', flag: '🇺🇦', label: 'Українська' },
];

const MENU_ITEMS = ['Features', 'Manifesto', 'Pricing'];

const COACH_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64&q=80",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=64&h=64&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=64&h=64&q=80"
];

// --- КОМПОНЕНТИ ---

const LanguageSelector = ({ mobileView = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(LANGUAGES[0]);

  return (
    <div className={`relative ${mobileView ? 'w-full' : ''}`}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 
          hover:bg-gray-100 hover:text-gray-900 transition-all duration-200
          focus:outline-none 
          ${mobileView 
            ? 'w-full justify-between bg-gray-50 border border-gray-100 p-4 text-base rounded-xl active:bg-gray-100' 
            : 'bg-white/50 backdrop-blur-md border border-gray-200/50 md:bg-transparent md:border-transparent' // Стиль для хедера на мобільному
          }
        `}
      >
        <div className="flex items-center gap-2">
          <span className={`${mobileView ? 'text-xl' : 'text-lg'} leading-none`}>{currentLang.flag}</span>
          
          {/* Показуємо код мови (EN) на десктопі або якщо це не мобільний full-screen режим */}
          <span className={`${!mobileView ? 'hidden sm:inline' : 'font-semibold text-gray-900'}`}>
            {mobileView ? currentLang.label : currentLang.code}
          </span>
        </div>
        <ChevronDown 
          size={mobileView ? 20 : 14} 
          className={`transition-transform duration-300 text-gray-500 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop для закриття кліком зовні */}
          <div className="fixed inset-0 z-10 cursor-default" onClick={() => setIsOpen(false)} />
          
          <div 
            className={`
              overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right
              ${mobileView 
                ? 'relative w-full mt-2 bg-gray-50 rounded-xl border border-gray-100' 
                : 'absolute top-full right-0 mt-2 w-40 bg-white/95 backdrop-blur-xl border border-gray-100 shadow-xl shadow-purple-900/5 rounded-xl z-20'
              }
            `}
          >
            <div className={`${mobileView ? 'p-2 space-y-1' : 'py-1'}`}>
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setCurrentLang(lang);
                    setIsOpen(false);
                  }}
                  className={`
                    flex items-center gap-3 w-full px-4 text-sm text-left transition-colors text-gray-700
                    ${mobileView 
                      ? 'py-3 rounded-lg text-base hover:bg-white active:bg-white' 
                      : 'py-2.5 hover:bg-purple-50'
                    }
                  `}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span className="font-medium">{lang.label}</span>
                  {currentLang.code === lang.code && (
                    <Check size={mobileView ? 18 : 14} className="ml-auto text-purple-600" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Блокування скролу при відкритому меню (простіший метод без fixed)
  useEffect(() => {
    if (isOpen) {
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    // Перевіряємо початкову позицію
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className="fixed top-0 w-full z-50 flex justify-center pt-4 px-4 pointer-events-none">
        <nav 
          className={`
            pointer-events-auto w-full max-w-5xl transition-all duration-300 ease-out transform-gpu will-change-transform
            ${scrolled 
              ? 'bg-white/90 backdrop-blur-xl shadow-lg shadow-gray-200/50 border border-gray-200/50 py-3 px-4 rounded-2xl' 
              : 'bg-transparent py-4 px-4 rounded-none border-transparent' 
            }
          `}
        >
          <div className="flex justify-between items-center relative z-50">
            {/* Logo */}
            <div className="flex items-center gap-2.5 cursor-pointer group select-none">
              <img 
                src="/assets/logo/logo.svg" 
                alt="Jimmy Logo" 
                className="w-9 h-9 object-contain transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3"
              />
              <span className="font-bold text-xl tracking-tight text-gray-900 group-hover:text-purple-600 transition-colors">
                Jimmy
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-1 bg-gray-100/50 p-1.5 rounded-full border border-gray-200/50">
              {MENU_ITEMS.map((item) => (
                <a 
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="px-5 py-1.5 rounded-full text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-sm transition-all duration-200"
                >
                  {item}
                </a>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              <LanguageSelector />
              <div className="h-5 w-px bg-gray-200"></div>
              <button className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 transition-all shadow-md shadow-purple-500/20 hover:shadow-lg hover:shadow-purple-500/30 hover:-translate-y-0.5 active:translate-y-0">
                Join Waitlist
              </button>
            </div>

            {/* Mobile Controls (Language + Toggle) */}
            <div className="md:hidden flex items-center gap-3 pointer-events-auto">
              
              {/* 1. Language Selector in Header (Mobile) */}
              <div className="relative z-50">
                <LanguageSelector mobileView={false} /> 
              </div>

              {/* 2. Menu Button */}
              <button 
                onClick={() => setIsOpen(!isOpen)} 
                className={`p-2 rounded-lg transition-colors focus:outline-none relative z-50 ${isOpen ? 'bg-gray-100 text-gray-900' : 'bg-gray-100/80 text-gray-600 hover:bg-gray-200'}`}
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* --- MOBILE FULLSCREEN MENU --- */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-white md:hidden animate-in slide-in-from-bottom-5 fade-in duration-200 transform-gpu">
           <div className="flex flex-col h-[100dvh] pt-28 pb-8 px-6">
            
            {/* NAV LINKS SECTION */}
            <div className="flex-1 flex flex-col justify-start space-y-2 overflow-y-auto">
              {MENU_ITEMS.map((item) => (
                <a 
                  key={item} 
                  href="#" 
                  onClick={() => setIsOpen(false)}
                  className="group flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 active:bg-gray-100 transition-all border border-transparent hover:border-gray-100"
                >
                  <span className="text-3xl font-bold text-gray-900 tracking-tight group-hover:text-purple-600 transition-colors">
                    {item}
                  </span>
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-purple-100 group-hover:text-purple-600 transition-all">
                    <ArrowRight size={20} className="-rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                  </div>
                </a>
              ))}
            </div>

            {/* BOTTOM ACTIONS SECTION (Language Removed from here) */}
            <div className="mt-auto pt-6 border-t border-gray-100 bg-white">
               <div className="flex flex-col gap-4">
                  {/* Language Selector removed from here as requested */}
                  
                  <button className="w-full py-4 rounded-xl text-lg font-bold text-white bg-purple-600 shadow-xl shadow-purple-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                     Join Waitlist
                     <ArrowRight size={20} />
                  </button>
               </div>
               
               <div className="text-center mt-6 text-xs text-gray-400 font-medium">
                  © 2025 Jimmy App Inc.
               </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

// --- ІНШІ КОМПОНЕНТИ БЕЗ ЗМІН ---
const DashboardMockup = () => {
  return (
    <div className="relative w-full max-w-5xl mx-auto -mb-16 md:-mb-24 perspective-1000 z-20">
      <div className="relative rounded-t-2xl bg-white border border-b-0 border-gray-200 shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden">
        <div className="h-10 bg-gray-50 border-b border-gray-100 flex items-center px-4 justify-between">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400/80"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-green-400/80"></div>
          </div>
          <div className="bg-white px-3 py-0.5 rounded text-[10px] font-mono text-gray-400 border border-gray-200 shadow-sm flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            jimmy.app/dashboard
          </div>
          <div className="w-10"></div>
        </div>
        <div className="bg-gray-100 relative group min-h-[300px] md:min-h-[500px]">
          <img 
            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop" 
            alt="Jimmy Platform Dashboard" 
            className="w-full h-auto object-cover block"
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
};

const Hero = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <section className="relative pt-32 pb-0 overflow-hidden bg-white">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-purple-400 opacity-20 blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full bg-white border border-purple-100 shadow-[0_2px_10px_-3px_rgba(124,58,237,0.1)] hover:border-purple-200 transition-colors">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-600"></span>
          </span>
          <span className="text-[11px] font-bold text-purple-900 tracking-wider uppercase">Waitlist Open • Q2 2025</span>
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-gray-900 mb-6 leading-[1.1] max-w-4xl">
          The operating system for<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600">
            independent coaches
          </span>
        </h1>

        <p className="mt-4 max-w-2xl text-lg sm:text-xl text-gray-500 mb-10 leading-relaxed">
          Stop hacking together Excel and WhatsApp. <span className="text-gray-900 font-medium">Jimmy</span> is the workspace built for solopreneurs to manage clients, programming, and progress.
        </p>

        <div className="w-full max-w-md relative group mb-24 z-20">
          {!submitted ? (
            <div className="flex flex-col items-center">
              <div className="relative transform transition-all hover:scale-[1.01] w-full z-20">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-200 to-indigo-200 rounded-full blur opacity-20 group-hover:opacity-50 transition duration-500"></div>
                <form 
                  onSubmit={handleSubmit} 
                  className="relative flex items-center bg-white p-1.5 rounded-full border border-gray-200 shadow-xl shadow-purple-900/5 focus-within:ring-2 focus-within:ring-purple-100 focus-within:border-purple-300 transition-all duration-300"
                >
                  <div className="flex-1 pl-5">
                    <input
                      type="email"
                      placeholder="Enter your email..."
                      className="w-full bg-transparent border-none p-2 text-gray-900 placeholder-gray-400 focus:ring-0 focus:outline-none text-base outline-none"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="flex-shrink-0 px-6 py-3.5 rounded-full font-bold text-white bg-purple-600 shadow-md flex items-center gap-2 hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-500/25 active:scale-95 transition-all duration-200"
                  >
                    Join Waitlist <ArrowRight size={16} />
                  </button>
                </form>
              </div>
              <div className="mt-8 relative z-30 text-xs text-gray-500 font-medium flex items-center justify-center gap-2">
                <div className="flex -space-x-2">
                  {COACH_AVATARS.map((url, i) => (
                    <img key={i} src={url} className="w-6 h-6 rounded-full border-2 border-white ring-1 ring-gray-100" alt="Coach" loading="lazy" decoding="async"/>
                  ))}
                </div>
                <span>Join 400+ other coaches waiting for access.</span>
              </div>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-2xl flex items-center justify-center gap-3 font-medium shadow-sm animate-in fade-in zoom-in slide-in-from-bottom-2">
              <div className="bg-green-100 p-1.5 rounded-full text-green-600"><Check size={18} /></div>
              <span>You're on the list! Keep an eye on your inbox.</span>
            </div>
          )}
        </div>
        <DashboardMockup />
      </div>
    </section>
  );
};

const App = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-purple-100 selection:text-purple-900">
      <Navbar />
      <Hero />
      <footer className="py-12 border-t border-gray-100 mt-auto bg-white relative z-20">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
          <div className="text-2xl font-bold text-gray-900 mb-4 tracking-tight flex items-center gap-2 select-none">
            <img 
              src="/assets/logo/logo.svg" 
              alt="Jimmy Logo" 
              className="w-8 h-8 object-contain"
            />
            Jimmy
          </div>
          <div className="text-gray-400 text-sm">© 2025 Jimmy Coach App. Built for independence.</div>
        </div>
      </footer>
    </div>
  );
};

export default App;
