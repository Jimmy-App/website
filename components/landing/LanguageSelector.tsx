'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';

import { LANGUAGES } from './constants';

type LanguageSelectorProps = {
  mobileView?: boolean;
};

const LanguageSelector = ({ mobileView = false }: LanguageSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(LANGUAGES[0]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const listboxId = mobileView ? 'lang-listbox-mobile' : 'lang-listbox-desktop';

  useEffect(() => {
    if (!isOpen) return;
    const closeOnOutside = (event: PointerEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setIsOpen(false);
      buttonRef.current?.focus();
    };
    window.addEventListener('pointerdown', closeOnOutside);
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      window.removeEventListener('pointerdown', closeOnOutside);
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className={`relative ${mobileView ? 'w-full' : ''}`}>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
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
        <ChevronDown
          size={mobileView ? 20 : 14}
          className={`transition-transform duration-200 text-gray-400 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div
          id={listboxId}
          role="listbox"
          className={`overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right ${
            mobileView
              ? 'relative w-full mt-2 bg-white border border-gray-100 rounded-xl'
              : 'absolute top-full right-0 mt-2 w-40 bg-white/95 backdrop-blur-xl border border-gray-100 shadow-xl rounded-xl z-50'
          }`}
        >
          <div className="p-1">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setCurrentLang(lang);
                  setIsOpen(false);
                }}
                type="button"
                role="option"
                aria-selected={currentLang.code === lang.code}
                className={`flex items-center gap-3 w-full px-3 text-left rounded-lg transition-colors ${
                  mobileView
                    ? 'py-3 text-base text-gray-900 hover:bg-gray-50'
                    : 'py-2 text-sm text-gray-700 hover:bg-purple-50'
                }`}
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

export default LanguageSelector;
