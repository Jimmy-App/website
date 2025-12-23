'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Menu, X } from 'lucide-react';

import LanguageSelector from './LanguageSelector';
import { MENU_ITEMS } from './constants';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);

  // Закриття по кліку поза меню
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  // Закриття на Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full z-50 pt-4 px-4 flex justify-center">
      <div className="w-full max-w-5xl relative">
        {/* Glass background */}
        <div className="absolute inset-0 rounded-2xl bg-white/85 backdrop-blur-xl border border-gray-200/50 shadow-lg shadow-gray-200/20" />

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

          {/* Desktop menu */}
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

          {/* Desktop CTA */}
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

          {/* Mobile menu */}
          <div className="md:hidden flex items-center gap-2" ref={mobileMenuRef}>
            <LanguageSelector mobileView={false} />
            
            <div className="relative">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                type="button"
                aria-label="Toggle menu"
                className={`p-2 rounded-lg transition-colors ${
                  isMobileMenuOpen ? 'bg-gray-100' : 'hover:bg-gray-100'
                }`}
              >
                {isMobileMenuOpen ? (
                  <X size={24} className="text-gray-900" />
                ) : (
                  <Menu size={24} className="text-gray-600" />
                )}
              </button>

              {/* ПРОСТИЙ DROPDOWN - БЕЗ FULLSCREEN! */}
              {isMobileMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                  {/* Menu items */}
                  <div className="p-2">
                    {MENU_ITEMS.map((item) => (
                      <a
                        key={item}
                        href={`#${item.toLowerCase()}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors"
                      >
                        <span className="text-base font-semibold text-gray-900">{item}</span>
                        <ArrowRight size={16} className="text-gray-400" />
                      </a>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="p-2 pt-0 border-t border-gray-100">
                    <button
                      type="button"
                      className="w-full py-3 rounded-xl text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                      Join Waitlist <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;