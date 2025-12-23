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
  const [expandedMobileItems, setExpandedMobileItems] = useState<string[]>([]);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);

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

  // Закриття по кліку поза меню
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }

      // Close desktop menus when clicking outside
      if (!(event.target as Element).closest('.desktop-menu-trigger')) {
        setActiveDesktopMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
        @keyframes dropdownSlide {
          from { opacity: 0; transform: translateY(-8px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
      <header className="fixed top-0 left-0 w-full z-50 pt-4 px-4 flex justify-center pointer-events-none">
        <div className="w-full max-w-6xl relative pointer-events-auto">

          {/* Mobile Background: floating rounded bar */}
          <div className="absolute inset-0 rounded-2xl bg-white/90 backdrop-blur-xl border border-gray-200/50 shadow-lg shadow-gray-200/20 lg:hidden" />

          {/* Desktop Background: floating rounded bar with fade logic */}
          <div
            className={`
            hidden lg:block absolute inset-0 rounded-2xl transition-all duration-300 ease-out
            ${isScrolled
                ? 'bg-white/85 backdrop-blur-xl border border-gray-200/50 shadow-lg shadow-gray-200/20 opacity-100'
                : 'bg-transparent border border-transparent opacity-0'
              }
          `}
          />

          <nav className="relative z-10 flex items-center justify-between px-4 py-3">

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
            <div className="hidden lg:flex items-center gap-1.5 p-1.5 rounded-full bg-white/50 border border-gray-200/50 backdrop-blur-sm shadow-sm">
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

                  {/* Desktop Dropdowns (Center aligned relative to item) */}
                  {activeDesktopMenu === item.title && item.type !== 'link' && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-6 w-max z-50" onMouseEnter={() => handleDesktopEnter(item.title)}>
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
            </div>

            {/* Desktop Right Actions */}
            <div className="hidden lg:flex items-center gap-4">
              <LanguageSelector />
              <div className="h-6 w-px bg-gray-200/80" />
              <Link href="#waitlist" className="group">
                <button
                  type="button"
                  className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 transition-all shadow-md shadow-purple-500/20 active:scale-95"
                >
                  Join Waitlist
                </button>
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="lg:hidden flex items-center gap-2" ref={mobileMenuRef}>
              <LanguageSelector mobileView={false} />
              <button
                onClick={() => {
                  setIsMobileMenuOpen(!isMobileMenuOpen);
                  if ('vibrate' in navigator) navigator.vibrate(10);
                }}
                className={`p-2 rounded-lg transition-colors ${isMobileMenuOpen ? 'bg-purple-100 text-purple-600' : 'hover:bg-gray-100 text-gray-600'}`}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

              {/* Mobile Menu Dropdown (Restored Original Style) */}
              {isMobileMenuOpen && (
                <div className="absolute right-0 top-full mt-3 w-[90vw] max-w-sm bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-[dropdownSlide_0.2s_ease-out]">
                  <div className="max-h-[70vh] overflow-y-auto p-4 space-y-2">
                    {MENU_STRUCTURE.map((item) => (
                      <div key={item.title} className="border-b border-gray-100 last:border-0 pb-2 last:pb-0">
                        {item.type === 'link' ? (
                          <a href={item.href} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 py-3 px-2 text-gray-900 font-bold hover:bg-gray-50 rounded-lg">
                            {/* @ts-ignore */}
                            {item.icon && <item.icon size={18} className="text-purple-600" />}
                            {item.title}
                          </a>
                        ) : (
                          <div>
                            <button
                              onClick={() => toggleMobileItem(item.title)}
                              className="flex items-center justify-between w-full py-3 px-2 text-gray-900 font-bold hover:bg-gray-50 rounded-lg"
                            >
                              {item.title}
                              <ChevronDown size={16} className={`transition-transform ${expandedMobileItems.includes(item.title) ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Expanded Mobile Content */}
                            {expandedMobileItems.includes(item.title) && (
                              <div className="pl-2 pr-2 space-y-2 py-3 bg-gray-50/80 rounded-2xl mt-2 border border-black/5">
                                {item.type === 'mega' ? (
                                  /* @ts-ignore */
                                  item.columns!.map((col, idx) => (
                                    <div key={idx} className="mb-4 last:mb-0">
                                      <div className="text-[11px] font-bold text-gray-400 uppercase mb-2 ml-3 tracking-wider">{col.title}</div>
                                      <div className="space-y-1">
                                        {col.items.map((subItem) => (
                                          <a key={subItem.label} href="#" className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-white active:bg-white transition-all">
                                            <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-purple-600 shadow-sm ring-1 ring-black/5 shrink-0">
                                              <subItem.icon size={18} />
                                            </div>
                                            <div className="text-sm font-bold text-gray-800">{subItem.label}</div>
                                          </a>
                                        ))}
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  /* @ts-ignore */
                                  item.items!.map((subItem) => (
                                    <a key={subItem.label} href="#" className="flex items-start gap-3.5 p-3.5 rounded-xl hover:bg-white active:bg-white transition-all">
                                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-purple-600 shadow-sm ring-1 ring-black/5 shrink-0">
                                        <subItem.icon size={20} />
                                      </div>
                                      <div>
                                        <div className="text-sm font-bold text-gray-900">{subItem.label}</div>
                                        <div className="text-xs text-gray-500 leading-snug mt-0.5">{subItem.desc}</div>
                                      </div>
                                    </a>
                                  ))
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="p-4 bg-gray-50 border-t border-gray-100">
                    <button className="w-full py-3 rounded-xl text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-lg flex items-center justify-center gap-2">
                      Join Waitlist <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Navbar;