"use client";

import React, { useState, useEffect } from 'react';
import { Menu, X, Check, ArrowRight, ChevronDown } from 'lucide-react';

// --- КОНСТАНТИ ---

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

// --- КОМПОНЕНТИ МЕНЮ ---

const LanguageSelector = ({ mobileView = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(LANGUAGES[0]);

  useEffect(() => {
    if (!isOpen) return;
    const close = () => setIsOpen(false);
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, [isOpen]);

  return (
    <div className={`relative ${mobileView ? 'w-full' : ''}`} onClick={(e) => e.stopPropagation()}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 rounded-lg font-medium transition-all duration-200 focus:outline-none
          ${mobileView 
            ? 'w-full justify-between bg-gray-50 border border-gray-100 p-4 text-base text-gray-900 active:bg-gray-100' 
            : 'px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 bg-transparent' 
          }
        `}
      >
        <div className="flex items-center gap-2">
          <span className="text-xl leading-none">{currentLang.flag}</span>
          <span className={`${!mobileView ? 'hidden sm:inline' : 'font-semibold'}`}>
            {mobileView ? currentLang.label : currentLang.code}
          </span>
        </div>
        <ChevronDown size={mobileView ? 20 : 14} className={`transition-transform duration-200 text-gray-400 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className={`overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right ${mobileView ? 'relative w-full mt-2 bg-white border border-gray-100 rounded-xl' : 'absolute top-full right-0 mt-2 w-40 bg-white/95 backdrop-blur-xl border border-gray-100 shadow-xl rounded-xl z-50'}`}>
          <div className="p-1">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => { setCurrentLang(lang); setIsOpen(false); }}
                className={`flex items-center gap-3 w-full px-3 text-left rounded-lg transition-colors ${mobileView ? 'py-3 text-base text-gray-900 hover:bg-gray-50' : 'py-2 text-sm text-gray-700 hover:bg-purple-50'}`}
              >
                <span className="text-lg">{lang.flag}</span>
                <span className="font-medium flex-1">{lang.label}</span>
                {currentLang.code === lang.code && <Check size={16} className="text-purple-600" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      // Проста логіка: скрол більше 10px -> включаємо фон
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    // Викликаємо одразу, щоб перевірити стан при перезавантаженні
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* HEADER WRAPPER 
        pt-3 px-3 (або більше на десктопі) створюють відступи для "острівця"
      */}
      <header className="fixed top-0 left-0 w-full z-50 pt-3 px-3 md:pt-4 md:px-4 pointer-events-none flex justify-center">
        <div className="w-full max-w-5xl relative pointer-events-auto">
          
          {/* BACKGROUND LAYER (Окремий шар для стабільності на iOS)
             Ми не змінюємо його розмір (width/height/padding), тільки opacity.
          */}
          <div 
            className={`
              absolute inset-0 rounded-2xl border transition-all duration-300 ease-out
              ${isScrolled 
                ? 'bg-white/90 backdrop-blur-xl border-gray-200/50 shadow-lg shadow-gray-200/20 opacity-100' 
                : 'bg-transparent border-transparent opacity-0'
              }
            `}
          />

          {/* CONTENT LAYER */}
          <nav className="relative z-10 flex items-center justify-between px-4 py-3">
            
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer group select-none">
              <img 
                src="/assets/logo/logo.svg" 
                alt="Jimmy Logo" 
                className="w-8 h-8 md:w-9 md:h-9 object-contain transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3" 
              />
              <span className="font-bold text-xl tracking-tight text-gray-900 group-hover:text-purple-600 transition-colors">
                Jimmy
              </span>
            </div>

            {/* Desktop Links */}
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
              <button className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 transition-all shadow-md shadow-purple-500/20 hover:shadow-lg hover:shadow-purple-500/30 active:scale-95">
                Join Waitlist
              </button>
            </div>

            {/* Mobile Actions */}
            <div className="md:hidden flex items-center gap-2">
              <div className="relative z-50">
                <LanguageSelector mobileView={false} />
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2 rounded-lg transition-colors relative z-50 ${isMobileMenuOpen ? 'bg-gray-100' : 'hover:bg-gray-100'}`}
              >
                {isMobileMenuOpen ? <X size={24} className="text-gray-900" /> : <Menu size={24} className="text-gray-600" />}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* MOBILE FULLSCREEN MENU */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white md:hidden animate-in slide-in-from-bottom-5 fade-in duration-200">
           <div className="flex flex-col h-full pt-28 pb-8 px-6">
            <div className="flex-1 space-y-2 overflow-y-auto">
              {MENU_ITEMS.map((item) => (
                <a 
                  key={item} 
                  href="#" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="group flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 active:bg-gray-100 transition-all border border-transparent hover:border-gray-100"
                >
                  <span className="text-3xl font-bold text-gray-900 tracking-tight group-hover:text-purple-600">{item}</span>
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-purple-100 group-hover:text-purple-600 transition-colors">
                    <ArrowRight size={20} className="-rotate-45 group-hover:rotate-0 transition-transform" />
                  </div>
                </a>
              ))}
            </div>
            <div className="mt-auto pt-6 border-t border-gray-100">
               <button className="w-full py-4 rounded-xl text-lg font-bold text-white bg-purple-600 shadow-xl shadow-purple-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                  Join Waitlist <ArrowRight size={20} />
               </button>
               <div className="text-center mt-6 text-xs text-gray-400 font-medium">© 2025 Jimmy App Inc.</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// --- ОРИГІНАЛЬНИЙ HERO ТА ІНШІ КОМПОНЕНТИ (ПОВЕРНУВ ЯК БУЛО) ---

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
              <span>You&apos;re on the list! Keep an eye on your inbox.</span>
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
              width={64}
              height={64}
              className="w-8 h-8 object-contain"
              style={{ imageRendering: 'auto' }}
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