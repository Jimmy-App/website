"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Cookie } from "lucide-react";

import {
  COOKIE_CONSENT_STORAGE_KEY,
  OPEN_COOKIE_SETTINGS_EVENT,
  getStoredCookieConsent,
  saveCookieConsent,
} from "@/lib/cookie-consent";
import { localeBasePath, type SupportedLocale } from "@/lib/i18n";

export type CookieBannerContent = {
  title?: string;
  description?: string;
  policyLinkHref?: string;
  policyLinkLabel?: string;
  rejectButtonLabel?: string;
  acceptButtonLabel?: string;
};

type CookieBannerProps = {
  content?: CookieBannerContent | null;
  currentLocale?: SupportedLocale;
};

const DEFAULT_CONTENT: Required<CookieBannerContent> = {
  title: "Cookie Preferences",
  description: "We use cookies for analytics and marketing.",
  policyLinkHref: "/cookie-policy",
  policyLinkLabel: "Read Cookie Policy",
  rejectButtonLabel: "Reject All",
  acceptButtonLabel: "Accept All",
};

export default function CookieBanner({
  content,
  currentLocale = "en",
}: CookieBannerProps) {
  const resolvedContent = {
    ...DEFAULT_CONTENT,
    ...content,
  };
  const cookiePolicyHref = resolvePolicyLinkHref(
    resolvedContent.policyLinkHref,
    currentLocale,
  );
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let initialOpenTimer: number | undefined;
    const storedConsent = localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    if (!storedConsent || !getStoredCookieConsent()) {
      initialOpenTimer = window.setTimeout(() => {
        setIsOpen(true);
      }, 0);
    }

    const handleOpenSettings = () => {
      setIsVisible(false);
      setIsOpen(true);
    };
    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, handleOpenSettings);

    return () => {
      if (initialOpenTimer) {
        window.clearTimeout(initialOpenTimer);
      }
      window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, handleOpenSettings);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const timer = window.setTimeout(() => {
      setIsVisible(true);
    }, 750);

    return () => window.clearTimeout(timer);
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleAcceptAll = () => {
    saveCookieConsent({ analytics: true, marketing: true });
    setIsVisible(false);
    setIsOpen(false);
  };

  const handleRejectAll = () => {
    saveCookieConsent({ analytics: false, marketing: false });
    setIsVisible(false);
    setIsOpen(false);
  };

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 p-4 shadow-2xl backdrop-blur transition-all duration-500 ease-out will-change-transform md:p-6 ${
        isVisible
          ? "translate-y-0 opacity-100"
          : "translate-y-10 opacity-0 pointer-events-none"
      }`}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-6">
        <div>
          <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900 md:text-lg">
            <Cookie size={18} className="text-purple-600" aria-hidden="true" />
            {resolvedContent.title}
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">
            {resolvedContent.description}{" "}
            <Link
              href={cookiePolicyHref}
              className="font-medium text-purple-700 underline decoration-purple-300 underline-offset-4 transition-colors hover:text-purple-800"
            >
              {resolvedContent.policyLinkLabel}
            </Link>
            .
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          <button
            type="button"
            onClick={handleRejectAll}
            className="inline-flex h-11 items-center justify-center rounded-full border border-slate-300 px-5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
          >
            {resolvedContent.rejectButtonLabel}
          </button>
          <button
            type="button"
            onClick={handleAcceptAll}
            className="inline-flex h-11 items-center justify-center rounded-full bg-purple-600 px-5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-500/20 active:scale-95"
          >
            {resolvedContent.acceptButtonLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function resolvePolicyLinkHref(
  linkHref: string | undefined,
  locale: SupportedLocale,
) {
  const defaultHref = `${localeBasePath(locale)}/cookie-policy`;
  if (!linkHref) {
    return defaultHref;
  }

  const normalizedHref = linkHref.trim();
  if (!normalizedHref) {
    return defaultHref;
  }

  if (
    normalizedHref.startsWith("http://") ||
    normalizedHref.startsWith("https://") ||
    normalizedHref.startsWith("mailto:") ||
    normalizedHref.startsWith("tel:")
  ) {
    return normalizedHref;
  }

  if (!normalizedHref.startsWith("/")) {
    return defaultHref;
  }

  return normalizedHref;
}
