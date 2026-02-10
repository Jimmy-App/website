"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BarChart3,
  ClipboardList,
  Database,
  Dumbbell,
  ChevronDown,
  MessageCircle,
  MessagesSquare,
  Menu,
  Smartphone,
  Users,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import LanguageSelector from "./LanguageSelector";
import { localeBasePath, type SupportedLocale } from "@/lib/i18n";

type NavbarMenuItem = {
  label?: string;
  href?: string;
};

type FeatureDropdownColumn = {
  badgeLabel?: string;
  items?: NavbarMenuItem[];
  viewAllLabel?: string;
  viewAllHref?: string;
};

type FeatureDropdownPlatform = {
  badgeText?: string;
  headline?: string;
  subheadline?: string;
  buttonLabel?: string;
  buttonHref?: string;
};

type NavigationContent = {
  brandLabel?: string;
  mobileHelperText?: string;
  items?: NavbarMenuItem[];
  featuresDropdown?: {
    coaches?: FeatureDropdownColumn;
    clients?: FeatureDropdownColumn;
    platform?: FeatureDropdownPlatform;
  };
};

type NavbarProps = {
  waitlistLabel?: string;
  navigation?: NavigationContent | null;
  brandHref?: string;
  currentLocale?: SupportedLocale;
};

type FeatureDropdownItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

const Navbar = ({
  waitlistLabel,
  navigation,
  brandHref,
  currentLocale,
}: NavbarProps) => {
  const resolvedWaitlistLabel = waitlistLabel || "Join Waitlist";
  const resolvedLoginLabel = "Login";
  const loginHref = "https://app.jimmycoach.com";
  const resolvedBrandLabel = navigation?.brandLabel || "Jimmy";
  const resolvedBrandHref = brandHref || "/";
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileFeaturesOpen, setIsMobileFeaturesOpen] = useState(false);
  const [activeDesktopMenu, setActiveDesktopMenu] = useState<string | null>(
    null,
  );
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const pendingScrollTargetRef = useRef<string | null>(null);

  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const scrollRetryRef = useRef<number | null>(null);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen && !activeDesktopMenu) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
        setIsMobileFeaturesOpen(false);
      }

      const isInsideDesktopMenu =
        (event.target as Element).closest(".desktop-menu-trigger") ||
        (event.target as Element).closest(".desktop-menu-dropdown");

      if (!isInsideDesktopMenu) {
        setActiveDesktopMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeDesktopMenu, isMobileMenuOpen]);

  useEffect(() => {
    if (!isMobileMenuOpen && !activeDesktopMenu) {
      return;
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
        setIsMobileFeaturesOpen(false);
        setActiveDesktopMenu(null);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [activeDesktopMenu, isMobileMenuOpen]);

  // Simple body scroll lock
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      const pendingTarget = pendingScrollTargetRef.current;
      if (pendingTarget) {
        pendingScrollTargetRef.current = null;
        const targetId = pendingTarget.replace("#", "");
        let attempts = 0;

        const tryScroll = () => {
          const targetElement = document.getElementById(targetId);
          if (targetElement) {
            targetElement.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
            window.history.pushState(null, "", pendingTarget);
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
      document.body.style.overflow = "";
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
  const handleMobileNavClick = (targetHref?: string) => {
    if (!targetHref) {
      pendingScrollTargetRef.current = null;
      setIsMobileFeaturesOpen(false);
      setIsMobileMenuOpen(false);
      return;
    }

    if (!targetHref.startsWith("#")) {
      try {
        const resolvedUrl = new URL(targetHref, window.location.origin);
        const isSamePage = resolvedUrl.pathname === window.location.pathname;

        if (isSamePage && resolvedUrl.hash) {
          pendingScrollTargetRef.current = resolvedUrl.hash;
          setIsMobileFeaturesOpen(false);
          setIsMobileMenuOpen(false);
          return;
        }
      } catch {
        // Ignore parse errors and fallback to navigation.
      }

      setIsMobileMenuOpen(false);
      setIsMobileFeaturesOpen(false);
      window.location.assign(targetHref);
      return;
    }

    pendingScrollTargetRef.current = targetHref;
    setIsMobileFeaturesOpen(false);
    setIsMobileMenuOpen(false);
  };

  const defaultMenuItems = [
    { label: "Features", href: "#features" },
    { label: "Experience", href: "#experience" },
    { label: "Manifesto", href: "#manifesto" },
    { label: "Pricing", href: "#pricing" },
  ];
  const resolvedMenuItems = navigation?.items?.length
    ? navigation.items
    : defaultMenuItems;
  const homeHref = currentLocale ? localeBasePath(currentLocale) : "/";
  const pricingPageHref = currentLocale
    ? `${localeBasePath(currentLocale)}/pricing`
    : "/pricing";
  const homeWaitlistHref = `${homeHref}#waitlist`;
  const resolveSectionHref = (href?: string) => {
    if (!href) {
      return "#";
    }
    if (href === "#pricing") {
      return pricingPageHref;
    }
    if (href.startsWith("#")) {
      return `${homeHref}${href}`;
    }
    return href;
  };
  const resolvedFeaturesMenuLabel =
    resolvedMenuItems.find(
      (item, index) =>
        (item.href || defaultMenuItems[index]?.href || "") === "#features",
    )?.label || "Features";
  const isFeaturesMenuOpen = activeDesktopMenu === resolvedFeaturesMenuLabel;
  const forCoachesHref = currentLocale
    ? `${localeBasePath(currentLocale)}/for-coaches`
    : "/for-coaches";
  const forCoachesFeaturesHref = `${forCoachesHref}#for-coaches-features`;
  const forClientsHref = currentLocale
    ? `${localeBasePath(currentLocale)}/for-clients`
    : "/for-clients";
  const defaultCoachFeatureItems: NavbarMenuItem[] = [
    {
      label: "Create Programs",
      href: `${forCoachesHref}#for-coaches-create-programs`,
    },
    {
      label: "Exercise Database",
      href: `${forCoachesHref}#for-coaches-exercise-database`,
    },
    {
      label: "Manage Clients",
      href: `${forCoachesHref}#for-coaches-manage-clients`,
    },
    {
      label: "Team Chat",
      href: `${forCoachesHref}#for-coaches-team-chat`,
    },
  ];
  const defaultClientFeatureItems: NavbarMenuItem[] = [
    {
      label: "The App",
      href: `${forClientsHref}#for-clients-the-app`,
    },
    {
      label: "Track Results",
      href: `${forClientsHref}#for-clients-track-results`,
    },
    {
      label: "Training Log",
      href: `${forClientsHref}#for-clients-training-log`,
    },
    {
      label: "Stay Connected",
      href: `${forClientsHref}#for-clients-stay-connected`,
    },
  ];
  const coachFeatureIcons: LucideIcon[] = [
    ClipboardList,
    Database,
    Users,
    MessagesSquare,
  ];
  const clientFeatureIcons: LucideIcon[] = [
    Smartphone,
    BarChart3,
    Dumbbell,
    MessageCircle,
  ];
  const mapDropdownItems = (
    items: NavbarMenuItem[] | undefined,
    defaultItems: NavbarMenuItem[],
    icons: LucideIcon[],
  ): FeatureDropdownItem[] => {
    const sourceItems = items?.length ? items : defaultItems;
    return sourceItems.map((item, index) => ({
      label: item.label || defaultItems[index]?.label || "",
      href: item.href || defaultItems[index]?.href || "#",
      icon: icons[Math.min(index, icons.length - 1)],
    }));
  };
  const coachesDropdown = navigation?.featuresDropdown?.coaches;
  const clientsDropdown = navigation?.featuresDropdown?.clients;
  const platformDropdown = navigation?.featuresDropdown?.platform;
  const resolvedCoachesBadgeLabel = coachesDropdown?.badgeLabel || "FOR COACHES:";
  const resolvedCoachesViewAllLabel = coachesDropdown?.viewAllLabel || "View All";
  const resolvedCoachesViewAllHref =
    coachesDropdown?.viewAllHref || forCoachesFeaturesHref;
  const resolvedClientsBadgeLabel = clientsDropdown?.badgeLabel || "FOR CLIENTS:";
  const resolvedClientsViewAllLabel = clientsDropdown?.viewAllLabel || "View All";
  const resolvedClientsViewAllHref = clientsDropdown?.viewAllHref || forClientsHref;
  const resolvedPlatformBadgeText = platformDropdown?.badgeText || "PLATFORM";
  const resolvedPlatformHeadline =
    platformDropdown?.headline || "See how Jimmy simplifies your life.";
  const resolvedPlatformSubheadline =
    platformDropdown?.subheadline ||
    "Take a 15-minute tour with our team. We'll show you exactly how to save 10 hours a week. No sales pressure.";
  const resolvedPlatformButtonLabel =
    platformDropdown?.buttonLabel || "Book a Demo";
  const resolvedPlatformButtonHref = platformDropdown?.buttonHref || forCoachesHref;

  const coachFeatureItems = mapDropdownItems(
    coachesDropdown?.items,
    defaultCoachFeatureItems,
    coachFeatureIcons,
  );
  const clientFeatureItems = mapDropdownItems(
    clientsDropdown?.items,
    defaultClientFeatureItems,
    clientFeatureIcons,
  );

  return (
    <>
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideInFromTop {
          from {
            transform: translateY(-100%);
          }
          to {
            transform: translateY(0);
          }
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
            animation: desktopNavbarEnter 560ms cubic-bezier(0.22, 1, 0.36, 1)
              both;
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
              ${
                isScrolled
                  ? "rounded-[28px] border-[#e7edf5] bg-white/95 px-4 py-2.5 shadow-[0_16px_36px_-26px_rgba(124,58,237,0.30)]"
                  : "px-1 py-2"
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
                    window.history.replaceState(null, "", resolvedBrandHref);
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
                  ${isScrolled ? "h-10" : "h-11"}
                `}
              />
            </Link>

            <div className="flex flex-1 items-center justify-center px-2">
              <div
                className="flex items-center gap-1 rounded-[22px] border border-[#e7edf5] bg-white px-2 py-1"
                onMouseLeave={handleDesktopLeave}
              >
                {resolvedMenuItems.map((item, index) => {
                  const label =
                    item.label || defaultMenuItems[index]?.label || "";
                  const href =
                    item.href || defaultMenuItems[index]?.href || "#";
                  const sectionHref = resolveSectionHref(href);
                  const isActive = activeDesktopMenu === label;
                  const isFeaturesItem = label === resolvedFeaturesMenuLabel;
                  const targetHref = isFeaturesItem
                    ? forCoachesFeaturesHref
                    : sectionHref;

                  return (
                    <Link
                      key={`${label}-${index}`}
                      href={targetHref}
                      className={`
                        desktop-menu-trigger relative px-5 py-2 text-[15px] font-semibold transition-colors duration-200
                        ${
                          isActive
                            ? "text-slate-800"
                            : "text-slate-600 hover:text-slate-800"
                        }
                      `}
                      onMouseEnter={() => handleDesktopEnter(label)}
                      onFocus={() => handleDesktopEnter(label)}
                      onBlur={handleDesktopLeave}
                      onClick={() => setActiveDesktopMenu(null)}
                    >
                      <span className="inline-flex items-center gap-1.5">
                        {label}
                        {isFeaturesItem ? (
                          <ChevronDown
                            size={14}
                            className={`transition-transform duration-200 ${
                              isActive ? "rotate-180" : "rotate-0"
                            }`}
                          />
                        ) : null}
                      </span>
                      <span
                        className={`
                          pointer-events-none absolute left-5 right-5 -bottom-0 h-0.5 rounded-full bg-purple-600 transition-opacity duration-200
                          ${isActive ? "opacity-100" : "opacity-0"}
                        `}
                      />
                    </Link>
                  );
                })}
              </div>
              <div
                className={`desktop-menu-dropdown absolute left-1/2 top-full z-40 mt-3 w-[760px] -translate-x-1/2 rounded-2xl border border-[#d9e2ef] bg-white p-5 shadow-[0_24px_46px_-30px_rgba(15,23,42,0.45)] transition-[opacity,transform] duration-200 ${
                  isFeaturesMenuOpen
                    ? "translate-y-0 opacity-100 pointer-events-auto"
                    : "translate-y-2 opacity-0 pointer-events-none"
                }`}
                onMouseEnter={() =>
                  handleDesktopEnter(resolvedFeaturesMenuLabel)
                }
                onMouseLeave={handleDesktopLeave}
              >
                <div className="grid grid-cols-3 gap-4">
                  <div className="rounded-xl border border-[#e7edf5] bg-[#f8fbff] p-4">
                    <Link
                      href={forCoachesHref}
                      className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-400 transition-colors hover:text-purple-600"
                      onClick={() => setActiveDesktopMenu(null)}
                    >
                      {resolvedCoachesBadgeLabel}
                    </Link>
                    <div className="mt-3 space-y-1">
                      {coachFeatureItems.map((feature) => (
                        <Link
                          key={feature.label}
                          href={feature.href}
                          className="group flex items-center gap-2 rounded-lg border border-transparent px-2.5 py-2 text-sm font-semibold text-slate-900 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#d8e2f0] hover:bg-white hover:text-purple-700 hover:shadow-[0_10px_20px_-18px_rgba(15,23,42,0.55)]"
                          onClick={() => setActiveDesktopMenu(null)}
                        >
                          <feature.icon
                            size={14}
                            className="text-slate-600 transition-colors duration-200 group-hover:text-purple-600"
                          />
                          <span>{feature.label}</span>
                          <ArrowRight
                            size={13}
                            className="ml-auto text-slate-300 opacity-70 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-purple-500 group-hover:opacity-100"
                          />
                        </Link>
                      ))}
                    </div>
                    <Link
                      href={resolvedCoachesViewAllHref}
                      className="group mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-purple-600 transition-colors hover:text-purple-700"
                      onClick={() => setActiveDesktopMenu(null)}
                    >
                      <span>{resolvedCoachesViewAllLabel}</span>
                      <ArrowRight
                        size={14}
                        className="transition-transform duration-200 group-hover:translate-x-0.5"
                      />
                    </Link>
                  </div>

                  <div className="rounded-xl border border-[#e7edf5] bg-[#f8fbff] p-4">
                    <Link
                      href={forClientsHref}
                      className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-400 transition-colors hover:text-purple-600"
                      onClick={() => setActiveDesktopMenu(null)}
                    >
                      {resolvedClientsBadgeLabel}
                    </Link>
                    <div className="mt-3 space-y-1">
                      {clientFeatureItems.map((feature) => (
                        <Link
                          key={feature.label}
                          href={feature.href}
                          className="group flex items-center gap-2 rounded-lg border border-transparent px-2.5 py-2 text-sm font-semibold text-slate-900 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#d8e2f0] hover:bg-white hover:text-purple-700 hover:shadow-[0_10px_20px_-18px_rgba(15,23,42,0.55)]"
                          onClick={() => setActiveDesktopMenu(null)}
                        >
                          <feature.icon
                            size={14}
                            className="text-slate-600 transition-colors duration-200 group-hover:text-purple-600"
                          />
                          <span>{feature.label}</span>
                          <ArrowRight
                            size={13}
                            className="ml-auto text-slate-300 opacity-70 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-purple-500 group-hover:opacity-100"
                          />
                        </Link>
                      ))}
                    </div>
                    <Link
                      href={resolvedClientsViewAllHref}
                      className="group mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-purple-600 transition-colors hover:text-purple-700"
                      onClick={() => setActiveDesktopMenu(null)}
                    >
                      <span>{resolvedClientsViewAllLabel}</span>
                      <ArrowRight
                        size={14}
                        className="transition-transform duration-200 group-hover:translate-x-0.5"
                      />
                    </Link>
                  </div>

                  <div className="flex h-full flex-col justify-between rounded-xl border border-[#ddd6fe] bg-gradient-to-b from-[#faf5ff] to-white p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-purple-500">
                      {resolvedPlatformBadgeText}
                    </p>
                    <h4 className="text-base font-bold text-slate-900">
                      {resolvedPlatformHeadline}
                    </h4>
                    <p className="text-sm leading-relaxed text-slate-600">
                      {resolvedPlatformSubheadline}
                    </p>
                    <Link
                      href={resolvedPlatformButtonHref}
                      className="inline-flex w-fit self-start items-center gap-2 rounded-full bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-purple-700"
                      onClick={() => setActiveDesktopMenu(null)}
                    >
                      {resolvedPlatformButtonLabel}
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
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
              <Link href={homeWaitlistHref} className="group">
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-full bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-purple-700 active:scale-95"
                >
                  {resolvedWaitlistLabel}
                  <ArrowRight
                    size={15}
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  />
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
              setIsMobileFeaturesOpen(false);
              if (window.location.pathname === resolvedBrandHref) {
                e.preventDefault();
                if (window.location.hash || window.location.search) {
                  window.history.replaceState(null, "", resolvedBrandHref);
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
            <LanguageSelector
              mobileView={false}
              currentLocale={currentLocale}
            />
            <button
              onClick={() => {
                setIsMobileFeaturesOpen(false);
                setIsMobileMenuOpen((isOpen) => !isOpen);
              }}
              className={`inline-flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-95 ${
                isMobileMenuOpen
                  ? "border-slate-200 bg-slate-50 text-slate-800"
                  : "border-[#e7edf5] bg-white text-slate-700 active:bg-slate-50"
              }`}
              aria-label="Toggle menu"
            >
              <span className="relative h-5 w-5">
                <Menu
                  className={`absolute inset-0 h-5 w-5 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isMobileMenuOpen
                      ? "rotate-45 scale-75 opacity-0"
                      : "rotate-0 scale-100 opacity-100"
                  }`}
                />
                <X
                  className={`absolute inset-0 h-5 w-5 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isMobileMenuOpen
                      ? "rotate-0 scale-100 opacity-100"
                      : "-rotate-45 scale-75 opacity-0"
                  }`}
                />
              </span>
            </button>
          </div>
        </nav>

        {/* DROPDOWN MENU */}
        {isMobileMenuOpen ? (
          <div
            className="absolute left-3 right-3 top-full z-40 mt-2 flex origin-top flex-col rounded-2xl border border-[#d9e2ef] bg-white px-4 pb-4 pt-3 shadow-[0_14px_30px_-22px_rgba(15,23,42,0.45)]"
            style={{
              maxHeight: "calc(100svh - 72px)",
              overflow: "hidden",
            }}
          >
            <div className="min-h-0 flex-1 overflow-y-auto pr-1">
            {/* Navigation Items */}
            <div className="space-y-1">
              {resolvedMenuItems.map((item, index) => {
                const label =
                  item.label || defaultMenuItems[index]?.label || "";
                const href = item.href || defaultMenuItems[index]?.href || "#";
                const sectionHref = resolveSectionHref(href);
                const isFeaturesItem = label === resolvedFeaturesMenuLabel;
                const targetHref = isFeaturesItem
                  ? forCoachesFeaturesHref
                  : sectionHref;

                if (isFeaturesItem) {
                  return (
                    <div key={`${label}-${index}`} className="rounded-2xl">
                      <button
                        type="button"
                        onClick={() =>
                          setIsMobileFeaturesOpen((isOpen) => !isOpen)
                        }
                        className={`flex w-full items-center gap-3 rounded-full border px-4 py-3 text-base font-semibold transition-colors ${
                          isMobileFeaturesOpen
                            ? "border-[#dfe7f2] bg-[#f8fbff] text-slate-900"
                            : "border-transparent text-slate-700 active:bg-slate-50"
                        }`}
                        aria-expanded={isMobileFeaturesOpen}
                        aria-controls="mobile-features-submenu"
                      >
                        <span className="flex-1 text-left">{label}</span>
                        <ChevronDown
                          size={18}
                          className={`text-slate-400 transition-transform duration-200 ${
                            isMobileFeaturesOpen ? "rotate-180" : "rotate-0"
                          }`}
                        />
                      </button>

                      {isMobileFeaturesOpen ? (
                        <div id="mobile-features-submenu" className="mt-2">
                          <div className="space-y-4 rounded-2xl border border-[#e7edf5] bg-[#f8fbff] p-3">
                            <div>
                              <p className="px-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-400">
                                {resolvedCoachesBadgeLabel}
                              </p>
                              <div className="mt-1 space-y-1">
                                {coachFeatureItems.map((feature) => (
                                  <a
                                    key={feature.label}
                                    href={feature.href}
                                    onClick={(event) => {
                                      event.preventDefault();
                                      handleMobileNavClick(feature.href);
                                    }}
                                    className="flex items-center gap-3 rounded-lg px-2 py-2.5 text-sm font-semibold text-slate-600 transition-[transform,background-color] duration-150 active:scale-[0.98] active:bg-slate-50"
                                  >
                                    <feature.icon
                                      size={16}
                                      className="text-slate-400"
                                    />
                                    <span className="flex-1 text-left">
                                      {feature.label}
                                    </span>
                                    <ArrowRight
                                      size={15}
                                      className="text-slate-300"
                                    />
                                  </a>
                                ))}
                              </div>
                              <a
                                href={resolvedCoachesViewAllHref}
                                onClick={(event) => {
                                  event.preventDefault();
                                  handleMobileNavClick(resolvedCoachesViewAllHref);
                                }}
                                className="mt-1 flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-semibold text-purple-600 transition-[transform,background-color] duration-150 active:scale-[0.98] active:bg-slate-50"
                              >
                                <span>{resolvedCoachesViewAllLabel}</span>
                                <ArrowRight size={15} />
                              </a>
                            </div>

                            <div className="h-px bg-[#e7edf5]" />

                            <div>
                              <p className="px-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-400">
                                {resolvedClientsBadgeLabel}
                              </p>
                              <div className="mt-1 space-y-1">
                                {clientFeatureItems.map((feature) => (
                                  <a
                                    key={feature.label}
                                    href={feature.href}
                                    onClick={(event) => {
                                      event.preventDefault();
                                      handleMobileNavClick(feature.href);
                                    }}
                                    className="flex items-center gap-3 rounded-lg px-2 py-2.5 text-sm font-semibold text-slate-600 transition-[transform,background-color] duration-150 active:scale-[0.98] active:bg-slate-50"
                                  >
                                    <feature.icon
                                      size={16}
                                      className="text-slate-400"
                                    />
                                    <span className="flex-1 text-left">
                                      {feature.label}
                                    </span>
                                    <ArrowRight
                                      size={15}
                                      className="text-slate-300"
                                    />
                                  </a>
                                ))}
                              </div>
                              <a
                                href={resolvedClientsViewAllHref}
                                onClick={(event) => {
                                  event.preventDefault();
                                  handleMobileNavClick(resolvedClientsViewAllHref);
                                }}
                                className="mt-1 flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-semibold text-purple-600 transition-[transform,background-color] duration-150 active:scale-[0.98] active:bg-slate-50"
                              >
                                <span>{resolvedClientsViewAllLabel}</span>
                                <ArrowRight size={15} />
                              </a>
                            </div>

                            <div className="h-px bg-[#e7edf5]" />

                            <div className="space-y-2 rounded-xl border border-[#ddd6fe] bg-gradient-to-b from-[#faf5ff] to-white p-3">
                              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-purple-500">
                                {resolvedPlatformBadgeText}
                              </p>
                              <h4 className="text-sm font-bold text-slate-900">
                                {resolvedPlatformHeadline}
                              </h4>
                              <p className="text-xs leading-relaxed text-slate-600">
                                {resolvedPlatformSubheadline}
                              </p>
                              <a
                                href={resolvedPlatformButtonHref}
                                onClick={(event) => {
                                  event.preventDefault();
                                  handleMobileNavClick(resolvedPlatformButtonHref);
                                }}
                                className="inline-flex items-center gap-2 rounded-full bg-purple-600 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-purple-700 active:bg-purple-700"
                              >
                                {resolvedPlatformButtonLabel}
                                <ArrowRight size={14} />
                              </a>
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  );
                }

                return (
                  <a
                    key={`${label}-${index}`}
                    href={targetHref}
                    onClick={(event) => {
                      event.preventDefault();
                      handleMobileNavClick(targetHref);
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
            </div>

            {/* Bottom CTA */}
            <div className="space-y-2 border-t border-[#e7edf5] bg-white pb-1 pt-3">
              <a
                href={loginHref}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#d9e2ef] bg-white px-5 py-3 text-base font-semibold text-slate-700 transition-colors active:bg-slate-50"
              >
                {resolvedLoginLabel}
              </a>
              <a
                href={homeWaitlistHref}
                onClick={(event) => {
                  event.preventDefault();
                  handleMobileNavClick(homeWaitlistHref);
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
        ) : null}
      </div>
    </>
  );
};

export default Navbar;
