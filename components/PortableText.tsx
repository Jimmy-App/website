"use client";

import React, { useState, useEffect } from 'react';
import { Menu, X, Check, ArrowRight, Zap, Smartphone, BarChart3, ChevronDown, Lock } from 'lucide-react';

// --- КОНСТАНТИ КОЛЬОРІВ ---
const COLORS = {
  primary: '#7C3AED',         // Electric Purple
  primaryDark: '#6D28D9',     // Hover Purple
  bgSurface: '#FFFFFF',
  textMain: '#111827',
  textSecondary: '#6B7280',
};

// --- КОМПОНЕНТ ПЕРЕМИКАЧА МОВ ---
const LanguageSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState({ code: 'EN', flag: '🇺🇸', label: 'English' });

  const languages = [
    { code: 'EN', flag: '🇺🇸', label: 'English' },
    { code: 'ES', flag: '🇪🇸', label: 'Español' },
    { code: 'FR', flag: '🇫🇷', label: 'Français' },
    { code: 'UA', flag: '🇺🇦', label: 'Українська' },
  ];

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700"
      >
        <span className="text-lg">{currentLang.flag}</span>
        <span className="hidden sm:inline">{currentLang.code}</span>
        <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full right-0 mt-2 w-40 bg-white/90 backdrop-blur-xl border border-white/20 shadow-xl rounded-xl overflow-hidden z-20 animate-in fade-in zoom-in-95 duration-200">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setCurrentLang(lang);
                  setIsOpen(false);
                }}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-left hover:bg-purple-50 transition-colors text-gray-700"
              >
                <span className="text-lg">{lang.flag}</span>
                <span>{lang.label}</span>
                {currentLang.code === lang.code && <Check size={14} className="ml-auto text-purple-600" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// --- NAVBAR (Restored Floating Glass Style) ---
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 w-full z-50 flex justify-center pt-4 px-4 pointer-events-none">
      <nav 
        className={`
          pointer-events-auto w-full max-w-5xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${scrolled 
            ? 'bg-white/80 backdrop-blur-xl shadow-lg py-2.5 rounded-2xl' // Removed border here
            : 'bg-transparent py-4 rounded-none' 
          }
        `}
      >
        <div className="px-4 md:px-6 flex justify-between items-center">
          
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer group">
            <div 
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3"
              style={{ background: COLORS.primary }}
            >
              J
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900">Jimmy</span>
          </div>

          {/* Desktop Links (Pill Style) */}
          <div className="hidden md:flex items-center gap-1 bg-white/50 backdrop-blur-md p-1 rounded-full border border-white/40 shadow-sm">
            {['Features', 'Manifesto', 'Pricing'].map((item) => (
              <a 
                key={item}
                href={`#${item.toLowerCase()}`}
                className="px-5 py-2 rounded-full text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-white transition-all duration-200"
              >
                {item}
              </a>
            ))}
          </div>

          {/* Right Side: Language + CTA */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSelector />
            <div className="h-6 w-px bg-gray-200/50 mx-1"></div>
            <button 
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
              style={{ background: COLORS.primary }}
            >
              Join Waitlist
            </button>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <LanguageSelector />
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="p-2 text-gray-600 bg-white/50 rounded-lg hover:bg-white transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isOpen && (
          <div className="absolute top-full left-0 w-full mt-2 px-2 md:hidden">
            <div className="bg-white/90 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-4 space-y-2 overflow-hidden animate-in slide-in-from-top-4">
              {['Features', 'Manifesto', 'Pricing'].map((item) => (
                <a key={item} href="#" className="block px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors">
                  {item}
                </a>
              ))}
              <div className="h-px bg-gray-100 my-2"></div>
              <button className="w-full py-3 rounded-xl text-center font-bold text-white shadow-md" style={{ background: COLORS.primary }}>
                Join Waitlist
              </button>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

// --- HERO SECTION (Clean Version) ---
const Hero = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Фото тренерів (реальні люди)
  const coachesAvatars = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64&q=80", // Жінка
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=64&h=64&q=80", // Чоловік
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=64&h=64&q=80"  // Чоловік посміхається
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <section className="relative pt-36 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white">
      
      {/* 1. BACKGROUND STRUCTURE (Clean Grid + Subtle Gradient) */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        {/* Top Glow (Center) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-purple-50/80 rounded-[100%] blur-[100px] -z-10"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        {/* 2. BADGE (Clean & Sharp) */}
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full bg-white border border-gray-200 shadow-sm transition-transform hover:scale-105 cursor-default">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-600"></span>
          </span>
          <span className="text-[11px] font-bold text-gray-600 tracking-wider uppercase">Waitlist Open • Q2 2025</span>
        </div>

        {/* 3. HEADLINE (Balanced Typography) */}
        <h1 
          className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-6 leading-[1.15] max-w-4xl mx-auto"
          style={{ textWrap: 'balance' }}
        >
          The operating system for <span className="relative inline-block text-purple-600">
            independent coaches
             {/* Simple Underline */}
             <svg className="absolute -bottom-2 left-0 w-full h-2 text-purple-200" viewBox="0 0 100 10" preserveAspectRatio="none">
              <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="none" />
            </svg>
          </span>
        </h1>

        <p className="mt-6 max-w-xl mx-auto text-lg text-gray-500 mb-10 leading-relaxed font-normal">
          Stop hacking together Excel and WhatsApp. Jimmy is the workspace built for solopreneurs to manage clients, programming, and progress.
        </p>

        {/* 4. FORM (Capsule Style) */}
        <div className="max-w-md mx-auto">
          {!submitted ? (
            <div className="relative group">
              {/* Glow Effect behind form */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-200 to-purple-400 rounded-full opacity-30 blur group-hover:opacity-50 transition duration-200"></div>
              
              <form 
                onSubmit={handleSubmit} 
                className="relative flex items-center bg-white rounded-full p-1.5 shadow-xl shadow-purple-900/5 ring-1 ring-gray-100"
              >
                <div className="flex-1 min-w-0">
                  <input
                    type="email"
                    placeholder="Enter your email..."
                    className="block w-full border-0 bg-transparent py-3 pl-5 pr-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 focus:outline-none outline-none sm:text-base sm:leading-6"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="flex-shrink-0 inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-purple-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 transition-all gap-2"
                  style={{ background: COLORS.primary }}
                >
                  Join Waitlist <ArrowRight size={16} />
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-full inline-flex items-center gap-2 font-medium animate-in fade-in slide-in-from-bottom-2">
               <Check size={18} /> You're on the list! We'll be in touch.
            </div>
          )}

          <div className="mt-6 flex items-center justify-center gap-x-6 text-sm">
             <div className="flex -space-x-2">
                {coachesAvatars.map((url, i) => (
                  <div key={i} className="w-6 h-6 rounded-full border-2 border-white overflow-hidden bg-gray-200 ring-2 ring-white z-10 hover:z-20 transition-all hover:scale-110">
                    <img src={url} alt="Coach" className="w-full h-full object-cover" />
                  </div>
                ))}
             </div>
             <div className="text-gray-500">Join <span className="font-semibold text-gray-900">400+ coaches</span></div>
          </div>
        </div>

        {/* 5. MOCKUP (Clean, Grounded) */}
        <div className="mt-20 flow-root sm:mt-24">
          <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
            <div className="relative rounded-lg bg-white shadow-2xl overflow-hidden border border-gray-200">
               
               {/* Window Controls */}
               <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                  </div>
                  <div className="ml-4 text-[10px] text-gray-400 font-mono bg-white border border-gray-200 px-2 py-0.5 rounded-md">
                    jimmy.app/dashboard
                  </div>
               </div>

               {/* Mockup Content (Placeholder for real UI) */}
               <div className="aspect-[16/9] bg-white relative flex flex-col items-center justify-center p-8">
                  <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-50"></div>
                  
                  <div className="z-10 text-center space-y-4">
                    <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-purple-50 ring-1 ring-purple-100 shadow-sm">
                      <Zap className="h-10 w-10 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Your Workspace</h3>
                    <p className="text-gray-500 max-w-sm mx-auto text-sm">
                      This is where the magic happens. A clean canvas for your programming logic.
                    </p>
                  </div>
                  
                  {/* Floating Element 1 */}
                  <div className="absolute left-10 bottom-10 bg-white p-3 rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 flex items-center gap-3 animate-float-slow hidden sm:flex">
                     <div className="bg-green-100 p-1.5 rounded-md text-green-600"><Check size={14}/></div>
                     <div>
                        <div className="text-xs font-bold text-gray-900">Program Assigned</div>
                        <div className="text-[10px] text-gray-400">Just now</div>
                     </div>
                  </div>
                  
                  {/* Floating Element 2 */}
                  <div className="absolute right-10 top-20 bg-white p-3 rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 flex items-center gap-3 animate-float-delayed hidden sm:flex">
                     <div className="bg-blue-100 p-1.5 rounded-md text-blue-600"><Smartphone size={14}/></div>
                     <div>
                        <div className="text-xs font-bold text-gray-900">Live Activity</div>
                        <div className="text-[10px] text-gray-400">Active on iOS</div>
                     </div>
                  </div>

               </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

// --- APP COMPONENT ---
const App = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Navbar />
      <Hero />
      <footer className="py-8 border-t border-gray-100 mt-auto bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm">
          © 2025 Jimmy Coach App.
        </div>
      </footer>
    </div>
  );
};

export default App;
