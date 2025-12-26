'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Menu,
  X,
  Zap,
  Smartphone,
  Gem,
  Heart
} from 'lucide-react';

import LanguageSelector from './LanguageSelector';

const Navbar = () => {
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

  const MENU_STRUCTURE = [
    {
      title: 'Features',
      type: 'link',
      href: '#features',
      icon: Zap
    },
    {
      title: 'Experience',
      type: 'link',
      href: '#experience',
      icon: Smartphone
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
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInFromTop {
          from { transform: translateY(-100%); }
          to { transform: translateY(0); }
        }

        .navbar-glass {
          backdrop-filter: saturate(180%) blur(20px);
          -webkit-backdrop-filter: saturate(180%) blur(20px);
        }
      `}</style>

      {/* ============= DESKTOP HEADER ============= */}
      <header className="hidden lg:block fixed top-0 left-0 w-full z-50 pt-4 px-4 pointer-events-none">
        <div className="w-full max-w-6xl mx-auto relative pointer-events-auto">
          <div
            className={`
              absolute inset-0 rounded-2xl transition-all duration-300 ease-out
              ${isScrolled
                ? 'bg-white/85 backdrop-blur-xl border border-gray-200/50 shadow-lg shadow-gray-200/20 opacity-100'
                : 'bg-transparent border border-transparent opacity-0'
              }
            `}
          />

          <nav className="relative z-10 flex items-center justify-between px-4 py-3">
            <Link
              href="/"
              onClick={(e) => {
                setActiveDesktopMenu(null);
                if (window.location.pathname === '/') {
                  e.preventDefault();
                  if ('scrollRestoration' in history) {
                    history.scrollRestoration = 'manual';
                  }
                  window.scrollTo(0, 0);
                  window.location.reload();
                }
              }}
              className="flex items-center gap-2.5 cursor-pointer group select-none"
            >
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

            <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-white/50 border border-gray-200/50 backdrop-blur-sm shadow-sm">
              {MENU_STRUCTURE.map((item) => (
                <div key={item.title} className="relative">
                  <Link
                    href={item.href || '#'}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-sm transition-all duration-200"
                  >
                    {item.icon && <item.icon size={16} className="text-gray-400 group-hover:text-purple-500" />}
                    {item.title}
                  </Link>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4">
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
          </nav>
        </div>
      </header>

      {/* ============= MOBILE HEADER ============= */}
      <div 
        className={`lg:hidden sticky top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/80 backdrop-blur-xl shadow-sm' 
            : 'bg-white'
        }`}
        ref={mobileMenuRef}
      >
        <nav className="flex items-center justify-between px-4 py-3">
          <Link
            href="/"
            onClick={(e) => {
              setIsMobileMenuOpen(false);
              if (window.location.pathname === '/') {
                e.preventDefault();
                if ('scrollRestoration' in history) {
                  history.scrollRestoration = 'manual';
                }
                window.scrollTo(0, 0);
                window.location.reload();
              }
            }}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-purple-500 rounded-full blur opacity-0 group-active:opacity-20 transition-opacity duration-300" />
              <Image
                src="/assets/logo/logo.svg"
                alt="Jimmy Logo"
                width={36}
                height={36}
                className="w-9 h-9 object-contain relative transition-transform duration-300 group-active:scale-95"
              />
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900">
              Jimmy
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <LanguageSelector mobileView={false} />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-lg transition-colors ${
                isMobileMenuOpen 
                  ? 'bg-purple-100 text-purple-600' 
                  : 'text-gray-600 active:bg-gray-100'
              }`}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>

        {/* DROPDOWN MENU - не fixed, просто розгортається вниз */}
        {isMobileMenuOpen && (
          <div 
            className="absolute left-0 right-0 top-full bg-white border-t border-gray-100 shadow-xl animate-[slideInFromTop_0.3s_ease-out] z-40"
            style={{
              maxHeight: 'calc(100vh - 60px)',
              overflowY: 'auto'
            }}
          >
            {/* Navigation Items */}
            <div className="px-4 py-6 space-y-1">
              {MENU_STRUCTURE.map((item, index) => (
                <a
                  key={item.title}
                  href={item.href || '#'}
                  onClick={(event) => {
                    event.preventDefault();
                    handleMobileNavClick(item.href);
                  }}
                  className="flex items-center gap-3 py-3.5 px-4 text-gray-900 font-semibold text-base hover:bg-gray-50 rounded-xl transition-all active:scale-[0.98] animate-[slideDown_0.3s_ease-out]"
                  style={{
                    animationDelay: `${index * 0.05}s`,
                    animationFillMode: 'both'
                  }}
                >
                  {item.icon && (
                    <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-purple-50 rounded-lg">
                      <item.icon size={20} className="text-purple-600" />
                    </div>
                  )}
                  <span className="flex-1">{item.title}</span>
                  <ArrowRight size={18} className="text-gray-400" />
                </a>
              ))}
            </div>

            {/* Divider */}
            <div className="px-4 py-2">
              <div className="h-px bg-gray-200" />
            </div>

            {/* Bottom CTA */}
            <div className="px-4 pb-6 pt-2">
              <a
                href="#waitlist"
                onClick={(event) => {
                  event.preventDefault();
                  handleMobileNavClick('#waitlist');
                }}
              >
                <button 
                  className="w-full py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                  type="button"
                >
                  Join Waitlist 
                  <ArrowRight size={20} />
                </button>
              </a>
              <p className="text-center text-sm text-gray-500 mt-3">
                Start your fitness journey today
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
