'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Menu,
  X
} from 'lucide-react';

import LanguageSelector from './LanguageSelector';
import type { SupportedLocale } from '@/lib/i18n';

type NavbarMenuItem = {
  label?: string;
  href?: string;
};

type NavigationContent = {
  brandLabel?: string;
  mobileHelperText?: string;
  items?: NavbarMenuItem[];
};

type NavbarProps = {
  waitlistLabel?: string;
  navigation?: NavigationContent | null;
  brandHref?: string;
  currentLocale?: SupportedLocale;
};

const Navbar = ({ waitlistLabel, navigation, brandHref, currentLocale }: NavbarProps) => {
  const resolvedWaitlistLabel = waitlistLabel || 'Join Waitlist';
  const resolvedLoginLabel = 'Login';
  const loginHref = 'https://app.jimmycoach.com';
  const resolvedBrandLabel = navigation?.brandLabel || 'Jimmy';
  const resolvedBrandHref = brandHref || '/';
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDesktopMenu, setActiveDesktopMenu] = useState<string | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const pendingScrollTargetRef = useRef<string | null>(null);

  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const scrollRetryRef = useRef<number | null>(null);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }

      if (!(event.target as Element).closest('.desktop-menu-trigger')) {
        setActiveDesktopMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  // Simple body scroll lock
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      const pendingTarget = pendingScrollTargetRef.current;
      if (pendingTarget) {
        pendingScrollTargetRef.current = null;
        const targetId = pendingTarget.replace('#', '');
        let attempts = 0;

        const tryScroll = () => {
          const targetElement = document.getElementById(targetId);
          if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            window.history.pushState(null, '', pendingTarget);
            return;
          }

          attempts += 1;
          if (attempts < 10) {
            scrollRetryRef.current = window.setTimeout(tryScroll, 80);
          } else {
            window.location.hash = pendingTarget;
          }
        };

        scrollRetryRef.current = window.setTimeout(tryScroll, 50);
      }
    }
    return () => {
      document.body.style.overflow = '';
      if (scrollRetryRef.current) {
        window.clearTimeout(scrollRetryRef.current);
        scrollRetryRef.current = null;
      }
    };
  }, [isMobileMenuOpen]);

  const handleDesktopEnter = (title: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    setActiveDesktopMenu(title);
  };

  const handleDesktopLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setActiveDesktopMenu(null);
    }, 150);
  };
  const handleMobileNavClick = (targetHash?: string) => {
    pendingScrollTargetRef.current = targetHash && targetHash.startsWith('#') ? targetHash : null;
    setIsMobileMenuOpen(false);
  };

  const defaultMenuItems = [
    { label: 'Features', href: '#features' },
    { label: 'Experience', href: '#experience' },
    { label: 'Manifesto', href: '#manifesto' },
    { label: 'Pricing', href: '#pricing' }
  ];
  const resolvedMenuItems = navigation?.items?.length
    ? navigation.items
    : defaultMenuItems;

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
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInFromTop {
          from { transform: translateY(-100%); }
          to { transform: translateY(0); }
        }
        @keyframes desktopNavbarEnter {
          from {
            opacity: 0;
            transform: translateY(-18px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @media (min-width: 1024px) {
          .desktop-navbar-enter {
            animation: desktopNavbarEnter 560ms cubic-bezier(0.22, 1, 0.36, 1) both;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .desktop-navbar-enter {
            animation: none !important;
          }
        }

        .navbar-glass {
          backdrop-filter: saturate(180%) blur(20px);
          -webkit-backdrop-filter: saturate(180%) blur(20px);
        }
      `}</style>

      {/* ============= DESKTOP HEADER ============= */}
      <header className="desktop-navbar-enter hidden lg:block fixed top-0 left-0 w-full z-50 pt-4 px-4 pointer-events-none">
        <div className="w-full max-w-6xl mx-auto pointer-events-auto">
          <nav
            className={`
              relative flex items-center justify-between gap-4 border border-transparent transition-all duration-300 ease-out
              ${isScrolled
                ? 'rounded-[28px] border-[#e7edf5] bg-white/95 px-4 py-2.5 shadow-[0_16px_36px_-26px_rgba(124,58,237,0.30)]'
                : 'px-1 py-2'
              }
            `}
          >
            <Link
              href={resolvedBrandHref}
              onClick={(e) => {
                setActiveDesktopMenu(null);
                if (window.location.pathname === resolvedBrandHref) {
                  e.preventDefault();
                  if (window.location.hash || window.location.search) {
                    window.history.replaceState(null, '', resolvedBrandHref);
                  }
                  window.scrollTo(0, 0);
                }
              }}
              className="group flex items-center"
            >
              <Image
                src="/assets/logo/logo-full.svg"
                alt={`${resolvedBrandLabel} Logo`}
                width={180}
                height={72}
                className={`
                  w-auto object-contain transition-all duration-200
                  ${isScrolled ? 'h-10' : 'h-11'}
                `}
              />
            </Link>

            <div className="flex flex-1 items-center justify-center px-2">
              <div
                className="flex items-center gap-1 rounded-[22px] border border-[#e7edf5] bg-white px-2 py-1"
                onMouseLeave={handleDesktopLeave}
              >
                {resolvedMenuItems.map((item, index) => {
                  const label = item.label || defaultMenuItems[index]?.label || '';
                  const href = item.href || defaultMenuItems[index]?.href || '#';
                  const isActive = activeDesktopMenu === label;

                  return (
                    <Link
                      key={`${label}-${index}`}
                      href={href}
                      className={`
                        desktop-menu-trigger relative px-5 py-2 text-[15px] font-semibold transition-colors duration-200
                        ${isActive
                          ? 'text-slate-800'
                          : 'text-slate-600 hover:text-slate-800'
                        }
                      `}
                      onMouseEnter={() => handleDesktopEnter(label)}
                      onFocus={() => handleDesktopEnter(label)}
                      onBlur={handleDesktopLeave}
                      onClick={() => setActiveDesktopMenu(label)}
                    >
                      {label}
                      <span
                        className={`
                          pointer-events-none absolute left-5 right-5 -bottom-0 h-0.5 rounded-full bg-purple-600 transition-opacity duration-200
                          ${isActive ? 'opacity-100' : 'opacity-0'}
                        `}
                      />
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <LanguageSelector currentLocale={currentLocale} />
              <a
                href={loginHref}
                className="inline-flex items-center px-1 py-2 text-[15px] font-semibold text-slate-600 transition-colors duration-200 hover:text-slate-900"
              >
                {resolvedLoginLabel}
              </a>
              <Link href="#waitlist" className="group">
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-full bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-purple-700 active:scale-95"
                >
                  {resolvedWaitlistLabel}
                  <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                </button>
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* ============= MOBILE HEADER ============= */}
      <div 
        className="lg:hidden sticky top-0 left-0 w-full z-50 bg-white"
        ref={mobileMenuRef}
      >
        <nav className="flex items-center justify-between px-4 py-3">
          <Link
            href={resolvedBrandHref}
            onClick={(e) => {
              setIsMobileMenuOpen(false);
              if (window.location.pathname === resolvedBrandHref) {
                e.preventDefault();
                if (window.location.hash || window.location.search) {
                  window.history.replaceState(null, '', resolvedBrandHref);
                }
                window.scrollTo(0, 0);
              }
            }}
            className="flex items-center cursor-pointer group select-none"
          >
            <Image
              src="/assets/logo/logo-full.svg"
              alt={`${resolvedBrandLabel} Logo`}
              width={180}
              height={72}
              className="h-10 w-auto object-contain"
            />
          </Link>

          <div className="flex items-center gap-2">
            <LanguageSelector mobileView={false} currentLocale={currentLocale} />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`inline-flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-95 ${
                isMobileMenuOpen 
                  ? 'border-slate-200 bg-slate-50 text-slate-800'
                  : 'border-[#e7edf5] bg-white text-slate-700 active:bg-slate-50'
              }`}
              aria-label="Toggle menu"
            >
              <span className="relative h-5 w-5">
                <Menu
                  className={`absolute inset-0 h-5 w-5 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isMobileMenuOpen
                      ? 'rotate-45 scale-75 opacity-0'
                      : 'rotate-0 scale-100 opacity-100'
                  }`}
                />
                <X
                  className={`absolute inset-0 h-5 w-5 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isMobileMenuOpen
                      ? 'rotate-0 scale-100 opacity-100'
                      : '-rotate-45 scale-75 opacity-0'
                  }`}
                />
              </span>
            </button>
          </div>
        </nav>

        {/* DROPDOWN MENU */}
        <div 
          className={`absolute left-3 right-3 top-full z-40 mt-2 origin-top rounded-2xl border border-[#d9e2ef] bg-white px-4 pb-4 pt-3 shadow-[0_14px_30px_-22px_rgba(15,23,42,0.45)] transition-[opacity,transform,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform ${
            isMobileMenuOpen
              ? 'translate-y-0 scale-100 opacity-100 pointer-events-auto'
              : '-translate-y-3 scale-[0.985] opacity-0 pointer-events-none'
          }`}
          style={{
            maxHeight: 'calc(100vh - 60px)',
            overflowY: 'auto'
          }}
          aria-hidden={!isMobileMenuOpen}
        >
          {/* Navigation Items */}
          <div className="space-y-1">
            {resolvedMenuItems.map((item, index) => {
              const label = item.label || defaultMenuItems[index]?.label || '';
              const href = item.href || defaultMenuItems[index]?.href || '#';
              return (
                <a
                  key={`${label}-${index}`}
                  href={href}
                  onClick={(event) => {
                    event.preventDefault();
                    handleMobileNavClick(href);
                  }}
                  className="flex items-center gap-3 rounded-full px-4 py-3 text-base font-semibold text-slate-700 transition-colors active:bg-slate-50"
                >
                  <span className="flex-1">{label}</span>
                  <ArrowRight size={18} className="text-slate-400" />
                </a>
              );
            })}
          </div>

          {/* Divider */}
          <div className="py-2.5">
            <div className="h-px bg-[#e7edf5]" />
          </div>

          {/* Bottom CTA */}
          <div className="space-y-2 pb-1">
            <a
              href={loginHref}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#d9e2ef] bg-white px-5 py-3 text-base font-semibold text-slate-700 transition-colors active:bg-slate-50"
            >
              {resolvedLoginLabel}
            </a>
            <a
              href="#waitlist"
              onClick={(event) => {
                event.preventDefault();
                handleMobileNavClick('#waitlist');
              }}
            >
              <button 
                className="flex w-full items-center justify-center gap-2 rounded-full bg-purple-600 px-5 py-3.5 text-base font-semibold text-white transition-colors hover:bg-purple-700 active:bg-purple-700"
                type="button"
              >
                {resolvedWaitlistLabel}
                <ArrowRight size={18} />
              </button>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
