'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Menu, X } from 'lucide-react';

import LanguageSelector from './LanguageSelector';
import { MENU_ITEMS } from './constants';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuButtonRef = useRef<HTMLButtonElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const mobileMenuId = 'mobile-menu';

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setIsMobileMenuOpen(false);
      mobileMenuButtonRef.current?.focus();
    };
    const closeOnResize = () => {
      if (window.matchMedia('(min-width: 768px)').matches) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', closeOnEscape);
    window.addEventListener('resize', closeOnResize);
    mobileMenuRef.current?.focus();
    return () => {
      window.removeEventListener('keydown', closeOnEscape);
      window.removeEventListener('resize', closeOnResize);
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 pt-4 px-4 pointer-events-none flex justify-center">
        <div className="w-full max-w-5xl relative pointer-events-auto">
          <div
            className={`
              absolute inset-0 rounded-2xl transition-all duration-300 ease-out
              ${
                isScrolled
                  ? 'bg-white/85 backdrop-blur-xl border border-gray-200/50 shadow-lg shadow-gray-200/20 opacity-100'
                  : 'bg-transparent border border-transparent opacity-0'
              }
            `}
          />

          <nav className="relative z-10 flex items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center gap-2 cursor-pointer group select-none">
              <Image
                src="/assets/logo/logo.svg"
                alt="Jimmy Logo"
                width={36}
                height={36}
                className="w-8 h-8 md:w-9 md:h-9 object-contain transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3"
              />
              <span className="font-bold text-xl tracking-tight text-gray-900 group-hover:text-purple-600 transition-colors">
                Jimmy
              </span>
            </Link>

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

            <div className="hidden md:flex items-center gap-3">
              <LanguageSelector />
              <div className="h-5 w-px bg-gray-200"></div>
              <button
                type="button"
                className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 transition-all shadow-md shadow-purple-500/20 hover:shadow-lg hover:shadow-purple-500/30 active:scale-95"
              >
                Join Waitlist
              </button>
            </div>

            <div className="md:hidden flex items-center gap-2">
              <div className="relative z-50">
                <LanguageSelector mobileView={false} />
              </div>
              <button
                ref={mobileMenuButtonRef}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                type="button"
                aria-expanded={isMobileMenuOpen}
                aria-controls={mobileMenuId}
                aria-label="Toggle menu"
                className={`p-2 rounded-lg transition-colors relative z-50 ${
                  isMobileMenuOpen ? 'bg-gray-100' : 'hover:bg-gray-100'
                }`}
              >
                {isMobileMenuOpen ? (
                  <X size={24} className="text-gray-900" />
                ) : (
                  <Menu size={24} className="text-gray-600" />
                )}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div
          id={mobileMenuId}
          ref={mobileMenuRef}
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
          className="fixed inset-0 z-40 bg-white md:hidden animate-in slide-in-from-bottom-5 fade-in duration-200"
        >
          <div className="flex flex-col h-full pt-28 pb-8 px-6">
            <div className="flex-1 space-y-2">
              {MENU_ITEMS.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="group flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 active:bg-gray-100 transition-all border border-transparent hover:border-gray-100"
                >
                  <span className="text-3xl font-bold text-gray-900">{item}</span>
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-purple-100 group-hover:text-purple-600 transition-colors">
                    <ArrowRight size={20} className="-rotate-45 group-hover:rotate-0 transition-transform" />
                  </div>
                </a>
              ))}
            </div>
            <div className="mt-auto pt-6 border-t border-gray-100">
              <button
                type="button"
                className="w-full py-4 rounded-xl text-lg font-bold text-white bg-purple-600 shadow-xl shadow-purple-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                Join Waitlist <ArrowRight size={20} />
              </button>
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

export default Navbar;
