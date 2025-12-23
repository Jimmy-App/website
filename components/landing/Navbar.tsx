'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Menu,
  X,
  ChevronDown,
  Zap,
  CreditCard,
  TrendingUp,
  Users,
  Smartphone,
  Timer,
  Activity,
  Trophy,
  LayoutDashboard,
  Download,
  FileText,
  HelpCircle,
  Gem,
  Heart
} from 'lucide-react';

import LanguageSelector from './LanguageSelector';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDesktopMenu, setActiveDesktopMenu] = useState<string | null>(null);
  const [expandedMobileItems, setExpandedMobileItems] = useState<string[]>(['Features']); // Default open for better discovery

  // Timeout ref for handling desktop menu delay
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Відслідковування скролу для desktop
  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Закриття на Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setActiveDesktopMenu(null);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  const handleDesktopEnter = (title: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    setActiveDesktopMenu(title);
  };

  const handleDesktopLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setActiveDesktopMenu(null);
    }, 150); // Small delay prevents flickering
  };

  const toggleMobileItem = (title: string) => {
    setExpandedMobileItems(prev =>
      prev.includes(title)
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  const MENU_STRUCTURE = [
    {
      title: 'Features',
      type: 'mega',
      columns: [
        {
          title: 'FOR COACHES',
          subtitle: 'Your Business',
          items: [
            { icon: Zap, label: 'Rapid Flow Builder', desc: 'Program workouts faster than pen & paper.' },
            { icon: CreditCard, label: 'Automated Payments', desc: 'Accept payments & manage subscriptions.' },
            { icon: TrendingUp, label: 'Retention Analytics', desc: 'Smart retention alerts & revenue analytics.' },
            { icon: Users, label: 'Bulk Management', desc: 'Manage 200+ clients with one click.', badge: 'Elite' },
          ]
        },
        {
          title: 'FOR MEMBERS',
          subtitle: 'The Client Experience',
          items: [
            { icon: Smartphone, label: 'Frictionless Tracking', desc: 'One-thumb logging for weight & reps.' },
            { icon: Timer, label: 'Live Timers', desc: 'Rest timers on Lock Screen & Dynamic Island.', badge: 'USP' },
            { icon: Activity, label: 'Health Sync', desc: 'Auto-sync steps & sleep via HealthKit.' },
            { icon: Trophy, label: 'Dopamine Tracking', desc: 'Gamified progress with PR confetti.' },
          ]
        }
      ]
    },
    {
      title: 'Experience',
      type: 'dropdown',
      items: [
        { icon: LayoutDashboard, label: 'Coach Dashboard', desc: 'View the business management dashboard.' },
        { icon: Smartphone, label: 'Member Mobile App', desc: 'Preview the client mobile experience.' },
      ]
    },
    {
      title: 'Resources',
      type: 'dropdown',
      items: [
        { icon: Download, label: 'Download for iOS', desc: 'App Store' },
        { icon: Download, label: 'Download for Android', desc: 'Google Play' },
        { icon: FileText, label: 'Documentation', desc: 'Knowledge base & setup guides.' },
        { icon: HelpCircle, label: 'Help Center', desc: 'Direct support from our team.' },
      ]
    },
    {
      title: 'Manifesto',
      type: 'link',
      href: '#manifesto',
      icon: Heart
    },
    {
      title: 'Pricing',
      type: 'link',
      href: '#pricing',
      icon: Gem
    }
  ];

  return (
    <>
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
         @keyframes slideInRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>

      {/* --- DESKTOP HEADER --- */}
      <header
        className={`fixed top-0 left-0 w-full z-50 px-4 transition-all duration-300 ease-out border-b ${isScrolled
            ? 'py-3 bg-white/80 backdrop-blur-xl border-gray-200/60 shadow-sm'
            : 'py-5 bg-transparent border-transparent'
          }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 cursor-pointer group select-none relative z-50">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-500 rounded-full blur opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
              <Image
                src="/assets/logo/logo.svg"
                alt="Jimmy Logo"
                width={36}
                height={36}
                className="w-9 h-9 object-contain relative transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3"
              />
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900 group-hover:text-purple-600 transition-colors">
              Jimmy
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1.5 p-1.5 rounded-full bg-white/50 border border-gray-200/50 backdrop-blur-sm shadow-sm">
            {MENU_STRUCTURE.map((item) => (
              <div key={item.title} className="relative" onMouseLeave={handleDesktopLeave}>
                {item.type === 'link' ? (
                  <Link
                    href={item.href}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-sm transition-all duration-200"
                  >
                    {/* @ts-ignore */}
                    {item.icon && <item.icon size={16} className="text-gray-400 group-hover:text-purple-500" />}
                    {item.title}
                  </Link>
                ) : (
                  <button
                    onMouseEnter={() => handleDesktopEnter(item.title)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 group ${activeDesktopMenu === item.title
                        ? 'bg-gray-900 text-white shadow-md'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-sm'
                      }`}
                  >
                    {item.title}
                    <ChevronDown size={14} className={`transition-transform duration-200 opacity-50 ${activeDesktopMenu === item.title ? 'rotate-180' : ''}`} />
                  </button>
                )}

                {/* Dropdown / Mega Menu */}
                {activeDesktopMenu === item.title && item.type !== 'link' && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-max z-50" onMouseEnter={() => handleDesktopEnter(item.title)}>
                    <div
                      className={`bg-white rounded-2xl shadow-xl ring-1 ring-gray-900/5 overflow-hidden animate-[slideUp_0.2s_ease-out] ${item.type === 'mega' ? 'w-[screen] max-w-4xl' : 'w-80'
                        }`}
                    >
                      {item.type === 'mega' ? (
                        <div className="flex bg-gray-50/50 divide-x divide-gray-100">
                          {/* @ts-ignore */}
                          {item.columns!.map((col, idx) => (
                            <div key={idx} className="flex-1 p-6 min-w-[320px]">
                              <div className="mb-5 flex items-center gap-2">
                                <span className={`h-6 w-1 rounded-full ${idx === 0 ? 'bg-purple-500' : 'bg-indigo-500'}`} />
                                <div>
                                  <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-0.5">{col.title}</div>
                                  <div className="text-sm font-semibold text-gray-900">{col.subtitle}</div>
                                </div>
                              </div>
                              <div className="space-y-1">
                                {col.items.map((subItem) => (
                                  <Link key={subItem.label} href="#" className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-white hover:shadow-md transition-all group/item duration-200">
                                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${idx === 0 ? 'bg-purple-50 text-purple-600 group-hover/item:bg-purple-600 group-hover/item:text-white' : 'bg-indigo-50 text-indigo-600 group-hover/item:bg-indigo-600 group-hover/item:text-white'}`}>
                                      <subItem.icon size={18} />
                                    </div>
                                    <div>
                                      <div className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-0.5">
                                        {subItem.label}
                                        {subItem.badge && (
                                          <span className="px-1.5 py-0.5 rounded-md bg-gray-900 text-white text-[10px] font-bold shadow-sm">
                                            {subItem.badge}
                                          </span>
                                        )}
                                      </div>
                                      <div className="text-xs text-gray-500 leading-relaxed font-medium">{subItem.desc}</div>
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-2">
                          {/* @ts-ignore */}
                          {item.items!.map((subItem) => (
                            <Link key={subItem.label} href="#" className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group/item">
                              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 group-hover/item:text-purple-600 group-hover/item:bg-purple-100 transition-colors">
                                <subItem.icon size={16} />
                              </div>
                              <div>
                                <div className="text-sm font-bold text-gray-900 mb-0.5">{subItem.label}</div>
                                {subItem.desc && <div className="text-xs text-gray-500 font-medium">{subItem.desc}</div>}
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <LanguageSelector />
            <div className="h-6 w-px bg-gray-200/80" />
            <Link href="#waitlist" className="group">
              <button
                type="button"
                className="px-6 py-2.5 rounded-full text-sm font-bold text-white bg-gray-900 hover:bg-purple-600 transition-all shadow-lg hover:shadow-purple-500/30 active:scale-95 flex items-center gap-2"
              >
                Join Waitlist
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex items-center gap-3">
            <LanguageSelector mobileView={false} />
            <button
              onClick={() => {
                setIsMobileMenuOpen(!isMobileMenuOpen);
                if ('vibrate' in navigator) navigator.vibrate(5);
              }}
              className="relative z-50 p-2.5 rounded-full bg-gray-100/80 backdrop-blur-sm self-center active:scale-90 transition-all"
            >
              {isMobileMenuOpen ? <X size={24} className="text-gray-900" /> : <Menu size={24} className="text-gray-900" />}
            </button>
          </div>
        </div>
      </header>


      {/* --- MOBILE FULLSCREEN MENU --- */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-white/60 backdrop-blur-xl animate-[fadeIn_0.3s_ease-out]"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Menu Content */}
          <div className="absolute inset-x-0 top-0 bottom-0 pt-24 pb-safe px-6 overflow-y-auto flex flex-col animate-[slideUp_0.4s_cubic-bezier(0.16,1,0.3,1)]">

            <div className="flex-1 space-y-6">
              {MENU_STRUCTURE.map((item, index) => (
                <div key={item.title} className="border-b border-gray-100/80 last:border-0 pb-4 last:pb-0" style={{ animationDelay: `${index * 50}ms` }}>
                  {item.type === 'link' ? (
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-2xl font-bold text-gray-900 flex items-center gap-3"
                    >
                      {/* @ts-ignore */}
                      {item.icon && <item.icon size={24} className="text-purple-600" />}
                      {item.title}
                    </Link>
                  ) : (
                    <div>
                      <button
                        onClick={() => toggleMobileItem(item.title)}
                        className="w-full flex items-center justify-between text-2xl font-bold text-gray-900 mb-2"
                      >
                        <span className="flex items-center gap-3">
                          {item.title}
                        </span>
                        <ChevronDown
                          size={24}
                          className={`text-gray-400 transition-transform duration-300 ${expandedMobileItems.includes(item.title) ? 'rotate-180' : ''}`}
                        />
                      </button>

                      {/* Expanded Logic */}
                      {expandedMobileItems.includes(item.title) && (
                        <div className="space-y-4 pt-2 pl-2 animate-[fadeIn_0.3s_ease-out]">
                          {/* Mega Menu Mobile Layout */}
                          {item.type === 'mega' ? (
                            /* @ts-ignore */
                            item.columns!.map((col, idx) => (
                              <div key={idx} className="space-y-3">
                                <div className="text-xs font-bold uppercase tracking-wider text-purple-600 mt-4 mb-2">{col.subtitle}</div>
                                {col.items.map((subItem) => (
                                  <Link key={subItem.label} href="#" onClick={() => setIsMobileMenuOpen(false)} className="flex items-start gap-3 py-1">
                                    <div className="mt-0.5 text-gray-400"><subItem.icon size={20} /></div>
                                    <div>
                                      <div className="text-base font-semibold text-gray-800">{subItem.label}</div>
                                      <div className="text-xs text-gray-500 font-medium leading-snug pr-4">{subItem.desc}</div>
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            ))
                          ) : (
                            /* Dropdown Mobile Layout */
                            /* @ts-ignore */
                            item.items!.map((subItem) => (
                              <Link key={subItem.label} href="#" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 py-2">
                                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500"><subItem.icon size={16} /></div>
                                <span className="text-base font-semibold text-gray-700">{subItem.label}</span>
                              </Link>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile Footer CTA */}
            <div className="mt-8 pt-6 pb-8 border-t border-gray-100">
              <div className="bg-gray-50 rounded-2xl p-4 flex flex-col items-center text-center gap-4">
                <p className="text-sm text-gray-500 font-medium">Ready to professionalize your coaching?</p>
                <button className="w-full py-3.5 rounded-xl text-base font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-md active:scale-[0.98] transition-all">
                  Join Waitlist for Access
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;