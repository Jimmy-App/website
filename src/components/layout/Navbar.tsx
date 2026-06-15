'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useLocale } from 'next-intl'
import { Link, usePathname, useRouter } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { FeatureItem } from '@/components/ui/FeatureItem'
import { Button } from '@/components/ui/Button'
import type { NavigationData } from '@/lib/content'
import {
  ChevronDown,
  Dumbbell,
  GraduationCap,
  Users,
  MessageCircle,
  CreditCard,
  TrendingUp,
  Smartphone,
  CalendarCheck,
  HeartHandshake,
  MessagesSquare,
  LineChart,
  Wallet,
  Newspaper,
  BookOpen,
  GitCommitHorizontal,
  Sparkles,
  Map,
  MessageSquare,
  ArrowRight,
} from 'lucide-react'

/* ── Locale config ─────────────────────────────────────────────── */
const LOCALES = [
  { code: 'en' as const, flag: '/assets/flags/gb.svg', label: 'EN', full: 'English' },
  { code: 'fr' as const, flag: '/assets/flags/fr.svg', label: 'FR', full: 'Français' },
  { code: 'es' as const, flag: '/assets/flags/es.svg', label: 'ES', full: 'Español' },
]

/* ── Feature & Resource icon maps ───────────────────────────────── */
const FEATURE_ICONS: Record<string, React.ReactNode> = {
  workoutBuilder:   <Dumbbell size={16} strokeWidth={1.75} />,
  programs:         <GraduationCap size={16} strokeWidth={1.75} />,
  communityFeed:    <Users size={16} strokeWidth={1.75} />,
  messaging:        <MessageCircle size={16} strokeWidth={1.75} />,
  payments:         <CreditCard size={16} strokeWidth={1.75} />,
  progressTracking: <TrendingUp size={16} strokeWidth={1.75} />,
  brandedApp:       <Smartphone size={16} strokeWidth={1.75} />,
  dailyWorkouts:    <CalendarCheck size={16} strokeWidth={1.75} />,
  community:        <HeartHandshake size={16} strokeWidth={1.75} />,
  directAccess:     <MessagesSquare size={16} strokeWidth={1.75} />,
  progressView:     <LineChart size={16} strokeWidth={1.75} />,
  easyPayments:     <Wallet size={16} strokeWidth={1.75} />,
}

const FEATURE_ICONS_SM: Record<string, React.ReactNode> = {
  workoutBuilder:   <Dumbbell size={15} strokeWidth={1.75} />,
  programs:         <GraduationCap size={15} strokeWidth={1.75} />,
  communityFeed:    <Users size={15} strokeWidth={1.75} />,
  messaging:        <MessageCircle size={15} strokeWidth={1.75} />,
  payments:         <CreditCard size={15} strokeWidth={1.75} />,
  progressTracking: <TrendingUp size={15} strokeWidth={1.75} />,
  brandedApp:       <Smartphone size={15} strokeWidth={1.75} />,
  dailyWorkouts:    <CalendarCheck size={15} strokeWidth={1.75} />,
  community:        <HeartHandshake size={15} strokeWidth={1.75} />,
  directAccess:     <MessagesSquare size={15} strokeWidth={1.75} />,
  progressView:     <LineChart size={15} strokeWidth={1.75} />,
  easyPayments:     <Wallet size={15} strokeWidth={1.75} />,
}

const RESOURCE_ICONS: Record<string, React.ReactNode> = {
  blog:           <Newspaper size={16} strokeWidth={1.75} />,
  guides:         <BookOpen size={16} strokeWidth={1.75} />,
  changelog:      <GitCommitHorizontal size={16} strokeWidth={1.75} />,
  productUpdates: <Sparkles size={16} strokeWidth={1.75} />,
  roadmap:        <Map size={16} strokeWidth={1.75} />,
  discord:        <MessageSquare size={16} strokeWidth={1.75} />,
}

const RESOURCE_ICONS_SM: Record<string, React.ReactNode> = {
  blog:           <Newspaper size={15} strokeWidth={1.75} />,
  guides:         <BookOpen size={15} strokeWidth={1.75} />,
  changelog:      <GitCommitHorizontal size={15} strokeWidth={1.75} />,
  productUpdates: <Sparkles size={15} strokeWidth={1.75} />,
  roadmap:        <Map size={15} strokeWidth={1.75} />,
  discord:        <MessageSquare size={15} strokeWidth={1.75} />,
}

const COACH_KEYS = ['workoutBuilder', 'programs', 'communityFeed', 'messaging', 'payments', 'progressTracking']
const MEMBER_KEYS = ['brandedApp', 'dailyWorkouts', 'community', 'directAccess', 'progressView', 'easyPayments']
const RESOURCE_CONTENT_KEYS = ['blog', 'guides', 'changelog']
const RESOURCE_COMMUNITY_KEYS = ['productUpdates', 'roadmap', 'discord']

/* Rounded flag icon — real SVG flags (emoji flags don't render on Windows/some Android) */
function Flag({ src }: { src: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      width={21}
      height={15}
      className="h-[15px] w-[21px] shrink-0 rounded-[3px] object-cover ring-1 ring-black/[0.07]"
    />
  )
}

/* ── MegaMenu: Features ─────────────────────────────────────────── */
function FeaturesMega({ data }: { data: NavigationData }) {
  const featuresItems = data.featuresItems ?? []
  const coachItems = featuresItems.filter((it) => COACH_KEYS.includes(it.key ?? ''))
  const memberItems = featuresItems.filter((it) => MEMBER_KEYS.includes(it.key ?? ''))

  return (
    <div
      className="mega-card rounded-2xl border border-border bg-surface shadow-[var(--shadow-lg)]"
      style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 248px', width: '904px', maxWidth: 'calc(100vw - 32px)', padding: '14px', gap: '6px' }}
    >
      {/* Col 1: For Coaches */}
      <div style={{ padding: '8px 6px 6px' }}>
        <div className="px-[10px] mb-2 text-[10.5px] font-bold uppercase tracking-[0.11em] text-text-faint">
          {data.featuresForCoaches}
        </div>
        <div className="flex flex-col gap-px">
          {coachItems.map((it) => (
            <FeatureItem
              key={it.key}
              icon={FEATURE_ICONS[it.key ?? ''] ?? null}
              title={it.title ?? ''}
              subtitle={it.subtitle ?? ''}
            />
          ))}
        </div>
      </div>

      {/* Col 2: For Members */}
      <div style={{ padding: '8px 6px 6px', borderLeft: '1px solid var(--color-divider)', paddingLeft: '14px' }}>
        <div className="px-[10px] mb-2 text-[10.5px] font-bold uppercase tracking-[0.11em] text-text-faint">
          {data.featuresForMembers}
        </div>
        <div className="flex flex-col gap-px">
          {memberItems.map((it) => (
            <FeatureItem
              key={it.key}
              icon={FEATURE_ICONS[it.key ?? ''] ?? null}
              title={it.title ?? ''}
              subtitle={it.subtitle ?? ''}
            />
          ))}
        </div>
      </div>

      {/* CTA card */}
      <aside
        className="rounded-xl p-5 flex flex-col relative overflow-hidden"
        style={{ background: 'linear-gradient(165deg, #221C2E 0%, #1A1620 100%)' }}
      >
        {/* purple glow orb */}
        <div
          className="pointer-events-none absolute"
          style={{ top: '-50px', right: '-40px', width: '160px', height: '160px', background: 'radial-gradient(circle, rgba(138,50,224,0.45) 0%, transparent 70%)' }}
          aria-hidden="true"
        />
        <div className="relative text-[10px] font-bold uppercase tracking-[0.13em] text-purple-on-dark mb-[10px]">
          {data.featuresCta?.label}
        </div>
        <div className="relative font-display text-[1.18rem] font-bold leading-[1.18] tracking-[-0.02em] text-white mb-[9px]">
          {data.featuresCta?.title}
        </div>
        <p className="relative text-[12.5px] leading-[1.5] mb-auto" style={{ color: 'rgba(255,255,255,0.62)' }}>
          {data.featuresCta?.body}
        </p>
        <a
          href="#"
          className="relative mt-4 inline-flex items-center gap-[7px] self-start whitespace-nowrap rounded-full bg-purple px-[18px] py-[10px] text-[13px] font-semibold text-white transition-[background,box-shadow,transform] duration-[var(--dur-fast)] hover:bg-purple-hover hover:shadow-[0_4px_18px_rgba(138,50,224,0.4)] hover:-translate-y-px"
        >
          {data.featuresCta?.btn}
          <ArrowRight size={14} strokeWidth={1.75} />
        </a>
      </aside>
    </div>
  )
}

/* ── MegaMenu: Resources ────────────────────────────────────────── */
function ResourcesMega({ data }: { data: NavigationData }) {
  const resourcesItems = data.resourcesItems ?? []
  const contentItems = resourcesItems.filter((it) => RESOURCE_CONTENT_KEYS.includes(it.key ?? ''))
  const communityItems = resourcesItems.filter((it) => RESOURCE_COMMUNITY_KEYS.includes(it.key ?? ''))

  return (
    <div
      className="rounded-2xl border border-border bg-surface shadow-[var(--shadow-lg)]"
      style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', width: '624px', maxWidth: 'calc(100vw - 32px)', padding: '14px', gap: '6px' }}
    >
      {/* Col 1: Content */}
      <div style={{ padding: '8px 6px 6px' }}>
        <div className="px-[10px] mb-2 text-[10.5px] font-bold uppercase tracking-[0.11em] text-text-faint">
          {data.resourcesContent}
        </div>
        <div className="flex flex-col gap-px">
          {contentItems.map((it) => (
            <FeatureItem
              key={it.key}
              icon={RESOURCE_ICONS[it.key ?? ''] ?? null}
              title={it.title ?? ''}
              subtitle={it.subtitle ?? ''}
            />
          ))}
        </div>
      </div>

      {/* Col 2: Community */}
      <div style={{ padding: '8px 6px 6px', borderLeft: '1px solid var(--color-divider)', paddingLeft: '14px' }}>
        <div className="px-[10px] mb-2 text-[10.5px] font-bold uppercase tracking-[0.11em] text-text-faint">
          {data.resourcesCommunity}
        </div>
        <div className="flex flex-col gap-px">
          {communityItems.map((it) => (
            <FeatureItem
              key={it.key}
              icon={RESOURCE_ICONS[it.key ?? ''] ?? null}
              title={it.title ?? ''}
              subtitle={it.subtitle ?? ''}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── DesktopMegaItem ─────────────────────────────────────────────── */
function NavMegaItem({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  // Detect hover capability after mount to avoid SSR mismatch
  const [hoverCapable, setHoverCapable] = useState(true)
  useEffect(() => {
    setHoverCapable(window.matchMedia('(hover: hover)').matches)
  }, [])

  function openMenu() {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setOpen(true)
  }
  function scheduleClose() {
    closeTimer.current = setTimeout(() => setOpen(false), 120)
  }

  // Close on outside click / Escape
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('click', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('click', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [])

  return (
    <div
      ref={ref}
      className="relative flex items-center"
      style={{ height: 'var(--navbar-height)' }}
      onMouseEnter={hoverCapable ? openMenu : undefined}
      onMouseLeave={hoverCapable ? scheduleClose : undefined}
    >
      <button
        aria-haspopup="true"
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation()
          setOpen((v) => !v)
        }}
        className="inline-flex items-center gap-[5px] bg-transparent border-0 p-0 font-body text-sm font-[450] tracking-[-0.01em] text-text-muted whitespace-nowrap transition-colors duration-[180ms] hover:text-text cursor-pointer"
        style={{ color: open ? 'var(--color-text)' : undefined }}
      >
        {label}
        <ChevronDown
          size={14}
          strokeWidth={1.75}
          className={cn(
            'text-text-faint transition-transform duration-[260ms] [transition-timing-function:var(--ease-out)]',
            open && 'rotate-180 text-purple',
          )}
        />
      </button>

      {/* Floating panel */}
      <div
        className={cn(
          'absolute left-0 pt-[14px] z-[90] origin-top transition-[opacity,transform] [transition-timing-function:var(--ease-out)]',
          // Asymmetric: open at 240ms, close snappier at 150ms (~62%). Subtle scale from the top = grows from its trigger.
          open
            ? 'opacity-100 translate-y-0 scale-100 duration-[240ms] pointer-events-auto'
            : 'opacity-0 translate-y-2 scale-[0.98] duration-[150ms] pointer-events-none',
        )}
        style={{ top: 'calc(100% - 8px)' }}
        role="menu"
      >
        {children}
      </div>
    </div>
  )
}

/* ── Language dropdown ──────────────────────────────────────────── */
function LangDropdown() {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0]

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [])

  function select(code: (typeof LOCALES)[number]['code']) {
    router.replace(pathname, { locale: code })
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative">
      <button
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation()
          setOpen((v) => !v)
        }}
        className="flex max-lg:min-h-[44px] items-center justify-center gap-[5px] rounded-full border border-[var(--color-ghost-border)] bg-transparent px-[11px] py-[9px] pr-[12px] font-body text-sm font-medium text-text transition-[background,border-color] duration-[var(--dur-fast)] hover:bg-[var(--color-ghost-hover)] hover:border-[rgba(26,25,23,0.24)] cursor-pointer max-lg:gap-0 max-lg:px-[12px] max-lg:pr-[12px]"
      >
        <Flag src={current.flag} />
        {/* Mobile: flag only — hide the code label + chevron */}
        <span className="text-[13px] font-medium max-lg:hidden">{current.label}</span>
        <ChevronDown
          size={13}
          strokeWidth={1.75}
          className={cn(
            'text-text-muted transition-transform duration-[200ms] [transition-timing-function:var(--ease-out)] max-lg:hidden',
            open && 'rotate-180',
          )}
        />
      </button>

      <div
        role="listbox"
        className={cn(
          'absolute top-[calc(100%+6px)] z-50 w-max max-w-[calc(100vw-1.5rem)] rounded-lg border border-border bg-surface p-1 shadow-[0_8px_24px_rgba(0,0,0,0.1),0_2px_6px_rgba(0,0,0,0.06)] transition-[opacity,transform] [transition-timing-function:var(--ease-out)]',
          // Desktop: anchored to the right edge of the (wider) trigger. Mobile: the
          // flag sits mid-navbar, so anchor on the LEFT and open rightward (fits on screen).
          'right-0 origin-top-right max-lg:right-auto max-lg:left-0 max-lg:origin-top-left',
          // Asymmetric: open 160ms, close snappier at 110ms
          open
            ? 'opacity-100 translate-y-0 scale-100 duration-[160ms] pointer-events-auto'
            : 'opacity-0 -translate-y-[6px] scale-[0.98] duration-[110ms] pointer-events-none',
        )}
      >
        {LOCALES.map((l) => (
          <button
            key={l.code}
            role="option"
            aria-selected={l.code === locale}
            onClick={() => select(l.code)}
            className={cn(
              'flex w-full items-center gap-2 rounded-md px-[10px] py-2 text-left font-body text-[13px] font-medium transition-[background,color] duration-[140ms] cursor-pointer',
              l.code === locale
                ? 'bg-purple-light text-purple'
                : 'bg-transparent text-text-muted hover:bg-surface-2 hover:text-text',
            )}
          >
            <Flag src={l.flag} />
            <span>{l.full}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

/* ── Mobile menu — the header "unfolds" into a full-screen menu ──── */
function MobileMenu({
  open,
  onClose,
  data,
}: {
  open: boolean
  onClose: () => void
  data: NavigationData
}) {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const [featOpen, setFeatOpen] = useState(false)
  const [resOpen, setResOpen] = useState(false)

  const featuresItems = data.featuresItems ?? []
  const coachItems = featuresItems.filter((it) => COACH_KEYS.includes(it.key ?? ''))
  const memberItems = featuresItems.filter((it) => MEMBER_KEYS.includes(it.key ?? ''))

  const resourcesItems = data.resourcesItems ?? []
  const contentItems = resourcesItems.filter((it) => RESOURCE_CONTENT_KEYS.includes(it.key ?? ''))
  const communityItems = resourcesItems.filter((it) => RESOURCE_COMMUNITY_KEYS.includes(it.key ?? ''))

  // Lock body scroll while the menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // Escape closes the menu
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  // Collapse accordions whenever the menu closes
  useEffect(() => {
    if (!open) {
      setFeatOpen(false)
      setResOpen(false)
    }
  }, [open])

  function selectLocale(code: (typeof LOCALES)[number]['code']) {
    router.replace(pathname, { locale: code })
    onClose()
  }

  // Staggered reveal — CSS only (interruptible, off main thread)
  const rowCls =
    'transition-[opacity,transform] duration-[var(--dur-base)] [transition-timing-function:var(--ease-out)]'
  const rowState = open
    ? 'opacity-100 translate-y-0'
    : 'opacity-0 translate-y-[18px]'
  const delay = (i: number): React.CSSProperties => ({
    transitionDelay: open ? `${110 + i * 52}ms` : '0ms',
  })

  const linkCls =
    'group flex w-full items-center justify-between py-[15px] text-left font-display text-[1.55rem] font-bold leading-none tracking-[-0.03em] text-text border-b border-border/70 transition-colors duration-150 active:text-purple'
  const subLinkCls =
    'flex items-center gap-[11px] py-[8px] text-[14px] font-medium text-text-muted transition-colors duration-150 active:text-purple'
  const groupLabelCls =
    'mb-1.5 text-[10px] font-bold uppercase tracking-[0.13em] text-text-faint'

  return (
    <div
      role="dialog"
      aria-modal={open}
      aria-label={data.menu ?? ''}
      aria-hidden={!open}
      className={cn(
        'fixed inset-0 z-[80] flex flex-col bg-bg lg:hidden',
        'transition-[clip-path] duration-[460ms] [transition-timing-function:cubic-bezier(0.32,0.72,0,1)]',
        open
          ? 'pointer-events-auto [clip-path:inset(0_0_0_0)]'
          : 'pointer-events-none [clip-path:inset(0_0_100%_0)]',
      )}
    >
      {/* Premium top glow (cohesive with hero / manifesto) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 [background:radial-gradient(120%_56%_at_50%_-6%,rgba(138,50,224,0.12)_0%,transparent_58%)]"
      />

      {/* Spacer matching the fixed header so content starts beneath it */}
      <div className="h-[var(--navbar-height)] shrink-0" />

      {/* Scrollable body */}
      <div className="flex flex-1 flex-col overflow-y-auto px-[clamp(1.25rem,5vw,2rem)] pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[clamp(0.5rem,2vh,1.25rem)]">
        <nav className="flex flex-col">
          {/* Features — large link + accordion */}
          <div className={cn(rowCls, rowState)} style={delay(0)}>
            <button
              aria-expanded={featOpen}
              onClick={() => { setFeatOpen((v) => !v); if (!featOpen) setResOpen(false) }}
              className={cn(linkCls, 'cursor-pointer', featOpen && 'text-purple')}
            >
              {data.featuresLabel}
              <ChevronDown
                size={22}
                strokeWidth={2}
                className={cn(
                  'text-text-faint transition-transform duration-[280ms] [transition-timing-function:var(--ease-out)]',
                  featOpen && 'rotate-180 text-purple',
                )}
              />
            </button>
            <div
              className="grid transition-[grid-template-rows] duration-[320ms] [transition-timing-function:var(--ease-out)]"
              style={{ gridTemplateRows: featOpen ? '1fr' : '0fr' }}
            >
              <div className="overflow-hidden">
                <div className="grid grid-cols-2 gap-x-5 gap-y-4 pt-4 pb-1">
                  <div>
                    <div className={groupLabelCls}>{data.featuresForCoaches}</div>
                    {coachItems.map((it) => (
                      <a key={it.key} href={it.href ?? '#'} onClick={onClose} className={subLinkCls}>
                        <span className="text-text-faint">{FEATURE_ICONS_SM[it.key ?? ''] ?? null}</span>
                        {it.title}
                      </a>
                    ))}
                  </div>
                  <div>
                    <div className={groupLabelCls}>{data.featuresForMembers}</div>
                    {memberItems.map((it) => (
                      <a key={it.key} href={it.href ?? '#'} onClick={onClose} className={subLinkCls}>
                        <span className="text-text-faint">{FEATURE_ICONS_SM[it.key ?? ''] ?? null}</span>
                        {it.title}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <Link
            href="/pricing"
            onClick={onClose}
            className={cn(linkCls, rowCls, rowState)}
            style={delay(1)}
          >
            {data.pricing}
          </Link>

          {/* Affiliate + NEW */}
          <Link
            href="/affiliate"
            onClick={onClose}
            className={cn(linkCls, rowCls, rowState)}
            style={delay(2)}
          >
            <span className="inline-flex items-center gap-[10px]">
              {data.affiliate}
              <span className="rounded-full border border-purple-border bg-purple-light px-[7px] py-[3px] text-[9px] font-bold uppercase leading-none tracking-[0.07em] text-purple">
                {data.newBadge}
              </span>
            </span>
          </Link>

          {/* Resources — large link + accordion */}
          <div className={cn(rowCls, rowState)} style={delay(3)}>
            <button
              aria-expanded={resOpen}
              onClick={() => { setResOpen((v) => !v); if (!resOpen) setFeatOpen(false) }}
              className={cn(linkCls, 'cursor-pointer', resOpen && 'text-purple')}
            >
              {data.resourcesLabel}
              <ChevronDown
                size={22}
                strokeWidth={2}
                className={cn(
                  'text-text-faint transition-transform duration-[280ms] [transition-timing-function:var(--ease-out)]',
                  resOpen && 'rotate-180 text-purple',
                )}
              />
            </button>
            <div
              className="grid transition-[grid-template-rows] duration-[320ms] [transition-timing-function:var(--ease-out)]"
              style={{ gridTemplateRows: resOpen ? '1fr' : '0fr' }}
            >
              <div className="overflow-hidden">
                <div className="grid grid-cols-2 gap-x-5 gap-y-4 pt-4 pb-1">
                  <div>
                    <div className={groupLabelCls}>{data.resourcesContent}</div>
                    {contentItems.map((it) => (
                      <a key={it.key} href={it.href ?? '#'} onClick={onClose} className={subLinkCls}>
                        <span className="text-text-faint">{RESOURCE_ICONS_SM[it.key ?? ''] ?? null}</span>
                        {it.title}
                      </a>
                    ))}
                  </div>
                  <div>
                    <div className={groupLabelCls}>{data.resourcesCommunity}</div>
                    {communityItems.map((it) => (
                      <a key={it.key} href={it.href ?? '#'} onClick={onClose} className={subLinkCls}>
                        <span className="text-text-faint">{RESOURCE_ICONS_SM[it.key ?? ''] ?? null}</span>
                        {it.title}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Footer: language pills + CTAs (pinned to bottom) */}
        <div className="mt-auto pt-7">
          <div className={cn('flex gap-2', rowCls, rowState)} style={delay(4)}>
            {LOCALES.map((l) => (
              <button
                key={l.code}
                onClick={() => selectLocale(l.code)}
                aria-pressed={l.code === locale}
                className={cn(
                  'flex flex-1 items-center justify-center gap-2 rounded-full border px-[12px] py-[11px] font-body text-sm font-semibold transition-colors duration-150 cursor-pointer active:scale-[0.97] [transition-timing-function:var(--ease-out)]',
                  l.code === locale
                    ? 'border-purple-border bg-purple-light text-purple'
                    : 'border-border bg-surface text-text-muted',
                )}
              >
                <Flag src={l.flag} />
                {l.label}
              </button>
            ))}
          </div>

          <div className={cn('mt-4 flex flex-col gap-3', rowCls, rowState)} style={delay(5)}>
            <Button variant="ghost" size="md" className="w-full justify-center py-[14px]">
              {data.login}
            </Button>
            <Button variant="solid" size="md" className="w-full justify-center py-[14px]">
              {data.getStarted}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Navbar ─────────────────────────────────────────────────────── */
export function Navbar({ data }: { data: NavigationData }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 40)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    // Check initial scroll
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-[100] h-[var(--navbar-height)] transition-[background,border-color,box-shadow] duration-300',
          // When the mobile menu is open the header background stays transparent so it
          // blends seamlessly into the full-screen menu (the header "becomes" the menu).
          scrolled && !menuOpen
            ? 'bg-[rgba(250,250,248,0.95)] backdrop-blur-[20px] [backdrop-filter:blur(20px)_saturate(160%)] [-webkit-backdrop-filter:blur(20px)_saturate(160%)] border-b border-border shadow-[0_1px_0_rgba(0,0,0,0.04)]'
            : 'bg-transparent border-b border-transparent',
        )}
      >
        <div className="container-wide flex h-full items-center gap-8">

          {/* Logo */}
          <Link href="/" aria-label="Jimmy Coach" className="flex items-center gap-2 flex-shrink-0">
            <Image
              src="/assets/logo/logo.svg"
              alt=""
              width={30}
              height={30}
              className="rounded-[8px]"
            />
            <span className="font-display text-[20px] font-extrabold tracking-[-0.04em] leading-none text-text">
              Jimmy
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8 flex-1" aria-label="Primary">
            <NavMegaItem label={data.featuresLabel ?? ''}>
              <FeaturesMega data={data} />
            </NavMegaItem>

            <Link href="/pricing" className="text-sm font-[450] tracking-[-0.01em] text-text-muted whitespace-nowrap transition-colors duration-[180ms] hover:text-text">
              {data.pricing}
            </Link>

            <Link href="/affiliate" className="inline-flex items-center text-sm font-[450] tracking-[-0.01em] text-text-muted whitespace-nowrap transition-colors duration-[180ms] hover:text-text">
              {data.affiliate}
              <span className="ml-[5px] text-[9px] font-bold uppercase tracking-[0.07em] text-purple bg-purple-light border border-purple-border rounded-full px-[6px] py-[2px] leading-none">
                {data.newBadge}
              </span>
            </Link>

            <NavMegaItem label={data.resourcesLabel ?? ''}>
              <ResourcesMega data={data} />
            </NavMegaItem>
          </nav>

          {/* Right cluster */}
          <div className="flex items-center gap-3 flex-shrink-0 ml-auto max-lg:gap-1.5">
            {/* Language switcher — fades out on mobile while the menu is open
                (the menu has its own language pills), leaving just logo + close. */}
            <div
              className={cn(
                'transition-opacity duration-200',
                menuOpen && 'max-lg:pointer-events-none max-lg:opacity-0',
              )}
            >
              <LangDropdown />
            </div>

            {/* CTA buttons — hidden on mobile (<= lg) */}
            <div className="hidden lg:flex items-center gap-2">
              <Button variant="ghost" size="sm">
                {data.login}
              </Button>
              <Button variant="solid" size="sm">
                {data.getStarted}
              </Button>
            </div>

            {/* Get Started — compact, mobile only; hidden while the menu is open */}
            <Button
              variant="solid"
              size="sm"
              className={cn(
                'lg:hidden max-[360px]:px-[14px] transition-opacity duration-200',
                menuOpen && 'pointer-events-none opacity-0',
              )}
            >
              {data.getStartedShort}
            </Button>

            {/* Hamburger / close — toggles the full-screen menu */}
            <button
              aria-label={menuOpen ? (data.close ?? '') : (data.openMenu ?? '')}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              className={cn(
                'relative z-[110] flex lg:hidden flex-col justify-center items-center gap-[4.5px] w-11 h-11 p-[10px] bg-transparent border-0 cursor-pointer',
              )}
            >
              <span
                className={cn(
                  'block w-5 h-[1.5px] bg-text rounded-[2px] origin-center transition-transform duration-300 [transition-timing-function:var(--ease-out)]',
                  menuOpen && 'translate-y-[6px] rotate-45',
                )}
              />
              <span
                className={cn(
                  'block w-5 h-[1.5px] bg-text rounded-[2px] transition-[opacity,transform] duration-300',
                  menuOpen && 'opacity-0 scale-x-0',
                )}
              />
              <span
                className={cn(
                  'block w-5 h-[1.5px] bg-text rounded-[2px] origin-center transition-transform duration-300 [transition-timing-function:var(--ease-out)]',
                  menuOpen && '-translate-y-[6px] -rotate-45',
                )}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen mobile menu (unfolds from under the header) */}
      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        data={data}
      />
    </>
  )
}
