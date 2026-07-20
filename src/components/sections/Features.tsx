'use client'

import Image from 'next/image'
import { useReducedMotion, m as motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect, useCallback, type KeyboardEvent } from 'react'
import {
  Dumbbell,
  Users,
  MessageCircle,
  CreditCard,
  GraduationCap,
  ArrowRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { appRegisterUrl } from '@/lib/appUrl'
import { Button } from '@/components/ui/Button'
import dynamic from 'next/dynamic'
import type { FeaturesData } from '@/lib/content'

// Heavy, framer-motion-driven product demos — below the fold and shown one tab
// at a time. Load them client-side on demand (ssr:false) so they stay out of
// the initial JS bundle; the tab panels already reserve height (no CLS).
const WorkoutBuilderDemo = dynamic(
  () => import('@/components/sections/WorkoutBuilderDemo').then((mod) => mod.WorkoutBuilderDemo),
  { ssr: false },
)
const CommunityFeedDemo = dynamic(
  () => import('@/components/sections/CommunityFeedDemo').then((mod) => mod.CommunityFeedDemo),
  { ssr: false },
)
const MessagingDemo = dynamic(
  () => import('@/components/sections/MessagingDemo').then((mod) => mod.MessagingDemo),
  { ssr: false },
)
const PaymentsDemo = dynamic(
  () => import('@/components/sections/PaymentsDemo').then((mod) => mod.PaymentsDemo),
  { ssr: false },
)
const CourseBuilderDemo = dynamic(
  () => import('@/components/sections/CourseBuilderDemo').then((mod) => mod.CourseBuilderDemo),
  { ssr: false },
)

// ── Tab metadata (icon, id, screenshot asset) ────────────────────────────────

type TabId = 'workout' | 'community' | 'messaging' | 'payments' | 'courses'

type TabAsset = {
  icon: React.ReactNode
  src: string
  alt: string
  imgWidth: number
  imgHeight: number
}

const TAB_ASSETS: Record<TabId, TabAsset> = {
  workout: {
    icon: <Dumbbell size={14} strokeWidth={1.75} />,
    src: '/assets/screens/workout.png',
    alt: 'Workout Builder interface',
    imgWidth: 390,
    imgHeight: 844,
  },
  community: {
    icon: <Users size={14} strokeWidth={1.75} />,
    src: '/assets/screens/home.png',
    alt: 'Community Feed interface',
    imgWidth: 390,
    imgHeight: 844,
  },
  messaging: {
    icon: <MessageCircle size={14} strokeWidth={1.75} />,
    src: '/assets/screens/chats.png',
    alt: '1:1 Messaging interface',
    imgWidth: 390,
    imgHeight: 844,
  },
  payments: {
    icon: <CreditCard size={14} strokeWidth={1.75} />,
    src: '/assets/screens/dashboard.png',
    alt: 'Payments dashboard',
    imgWidth: 1456,
    imgHeight: 816,
  },
  courses: {
    icon: <GraduationCap size={14} strokeWidth={1.75} />,
    src: '/assets/screens/progress.png',
    alt: 'Course Builder interface',
    imgWidth: 390,
    imgHeight: 844,
  },
}

// ── Panel icon lookup (larger, in the card) ───────────────────────────────────

const PANEL_ICONS: Record<TabId, React.ReactNode> = {
  workout: <Dumbbell size={22} strokeWidth={1.75} />,
  community: <Users size={22} strokeWidth={1.75} />,
  messaging: <MessageCircle size={22} strokeWidth={1.75} />,
  payments: <CreditCard size={22} strokeWidth={1.75} />,
  courses: <GraduationCap size={22} strokeWidth={1.75} />,
}

// ── Framer-motion variants ────────────────────────────────────────────────────

const RISE = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

// ── Component ─────────────────────────────────────────────────────────────────

export function Features({ data }: { data: FeaturesData }) {
  const shouldReduceMotion = useReducedMotion()

  const tabs = data.tabs ?? []
  const [activeIdx, setActiveIdx] = useState(0)

  // Slider pill geometry
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [sliderStyle, setSliderStyle] = useState<{ left: number; width: number }>({
    left: 5,
    width: 0,
  })

  const updateSlider = useCallback((idx: number) => {
    const el = tabRefs.current[idx]
    if (!el) return
    setSliderStyle({ left: el.offsetLeft, width: el.offsetWidth })
  }, [])

  useEffect(() => {
    updateSlider(activeIdx)
  }, [activeIdx, updateSlider])

  // Re-measure on resize
  useEffect(() => {
    const onResize = () => updateSlider(activeIdx)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [activeIdx, updateSlider])

  const activateTab = (idx: number) => {
    setActiveIdx(idx)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, idx: number) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      activateTab((idx + 1) % tabs.length)
      tabRefs.current[(idx + 1) % tabs.length]?.focus()
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      activateTab((idx - 1 + tabs.length) % tabs.length)
      tabRefs.current[(idx - 1 + tabs.length) % tabs.length]?.focus()
    }
  }

  const activeTab = tabs[activeIdx]
  const activeTabId = (activeTab?.id ?? '') as TabId
  const activeTabAsset = TAB_ASSETS[activeTabId]

  // Tags for the active tab
  const tags = activeTab?.tags ?? []

  return (
    <section
      id="features"
      aria-label={data.ariaLabel ?? ''}
      className="relative bg-bg overflow-hidden py-[var(--section-pad-y)]"
    >
      {/* Top border rule */}
      <div className="absolute top-0 inset-x-0 h-px bg-border" aria-hidden />

      <div className="container-content">

        {/* ── Header ── */}
        <header className="text-center mb-12">
          <motion.p
            className="eyebrow text-purple mb-4"
            variants={shouldReduceMotion ? undefined : RISE}
            initial={shouldReduceMotion ? undefined : 'hidden'}
            whileInView={shouldReduceMotion ? undefined : 'show'}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.64, ease: EASE }}
          >
            {data.eyebrow}
          </motion.p>

          <motion.h2
            className="font-display text-h2 font-extrabold text-text [letter-spacing:var(--tracking-display)] [line-height:var(--leading-tight)] max-w-[660px] mx-auto"
            variants={shouldReduceMotion ? undefined : RISE}
            initial={shouldReduceMotion ? undefined : 'hidden'}
            whileInView={shouldReduceMotion ? undefined : 'show'}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.64, ease: EASE, delay: 0.08 }}
          >
            {data.titlePrefix}<span className="text-purple">{data.titleAccent}</span>{data.titleSuffix}
          </motion.h2>
        </header>

        {/* ── Tab bar ── */}
        <motion.div
          role="tablist"
          aria-label={data.tablistLabel ?? ''}
          className={cn(
            'relative flex items-stretch',
            'bg-surface-2 border border-border rounded-full',
            'p-[5px] gap-0 mb-10 overflow-hidden',
            // Mobile: horizontal scroll
            'max-sm:rounded-2xl max-sm:overflow-x-auto max-sm:scrollbar-hide max-sm:justify-start max-sm:pb-[6px]',
          )}
          variants={shouldReduceMotion ? undefined : RISE}
          initial={shouldReduceMotion ? undefined : 'hidden'}
          whileInView={shouldReduceMotion ? undefined : 'show'}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.64, ease: EASE, delay: 0.18 }}
        >
          {/* Sliding pill indicator */}
          <motion.div
            aria-hidden="true"
            className="absolute top-[5px] h-[calc(100%-10px)] bg-purple rounded-full shadow-[0_2px_12px_rgba(138,50,224,0.32)] pointer-events-none z-0"
            animate={{ left: sliderStyle.left, width: sliderStyle.width }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { type: 'spring', stiffness: 340, damping: 30, mass: 1 }
            }
            style={{ left: sliderStyle.left, width: sliderStyle.width }}
          />

          {tabs.map((tab, i) => {
            const isActive = i === activeIdx
            const tabId = (tab.id ?? '') as TabId
            const tabAsset = TAB_ASSETS[tabId]
            return (
              <button
                key={tab._key}
                ref={(el) => { tabRefs.current[i] = el }}
                role="tab"
                id={`tab-${tab.id ?? i}`}
                aria-selected={isActive}
                aria-controls={`panel-${tab.id ?? i}`}
                tabIndex={isActive ? 0 : -1}
                className={cn(
                  'relative z-10 flex-1 inline-flex items-center justify-center gap-[6px]',
                  'bg-transparent border-none rounded-full',
                  'px-[14px] py-[11px]',
                  'font-body text-[13px] font-medium whitespace-nowrap',
                  'cursor-pointer transition-colors duration-[220ms] ease-out',
                  'focus-visible:outline-2 focus-visible:outline-purple focus-visible:outline-offset-2',
                  // Mobile shrink
                  'max-sm:flex-shrink-0 max-sm:flex-none max-sm:px-[14px] max-sm:py-[9px] max-sm:text-[12.5px] max-sm:min-h-[44px]',
                  isActive
                    ? 'text-white'
                    : 'text-text-muted hover:text-text',
                )}
                onClick={() => activateTab(i)}
                onKeyDown={(e) => onKeyDown(e, i)}
              >
                <span
                  className={cn(
                    'flex-shrink-0 transition-colors duration-[220ms]',
                    isActive ? 'text-white/85' : 'text-text-faint group-hover:text-text-muted',
                  )}
                >
                  {tabAsset?.icon}
                </span>
                {tab.label}
              </button>
            )
          })}
        </motion.div>

        {/* ── Tab panels ── */}
        <div aria-live="polite" className="relative">
          <AnimatePresence mode="wait">
            {activeTab && (
              <motion.div
                key={activeTab._key}
                id={`panel-${activeTab.id ?? activeIdx}`}
                role="tabpanel"
                aria-labelledby={`tab-${activeTab.id ?? activeIdx}`}
                className={cn(
                  'grid grid-cols-2 gap-10 items-center',
                  'bg-surface border border-border rounded-2xl p-10',
                  'min-h-[400px] relative overflow-hidden',
                  'shadow-[var(--shadow-md)]',
                  // Mobile
                  'max-md:grid-cols-1 max-sm:p-6 max-sm:gap-6 max-sm:rounded-2xl',
                )}
                initial={shouldReduceMotion ? {} : { opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={shouldReduceMotion ? {} : { opacity: 0, x: -6 }}
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { duration: 0.23, ease: [0.16, 1, 0.3, 1] }
                }
              >
                {/* Ambient glow accent */}
                <div
                  aria-hidden="true"
                  className="absolute -top-20 -right-20 w-[280px] h-[280px] rounded-full pointer-events-none"
                  style={{
                    background:
                      'radial-gradient(circle, rgba(138,50,224,0.06) 0%, transparent 70%)',
                  }}
                />

                {/* ── Text column ── */}
                <div className="flex flex-col gap-5 relative z-10">
                  {/* Icon wrap */}
                  <div className="w-12 h-12 flex items-center justify-center bg-purple-light rounded-xl flex-shrink-0 text-purple">
                    {PANEL_ICONS[activeTabId]}
                  </div>

                  {/* Title */}
                  <h3 className="font-display text-h3 font-bold text-text [letter-spacing:var(--tracking-tight)] [line-height:var(--leading-snug)] max-w-[360px]">
                    {activeTab.title}
                  </h3>

                  {/* Subtitle / desc */}
                  <p className="text-body text-text-muted [line-height:1.6] max-w-[400px]">
                    {activeTab.subtitle}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-[7px]">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[12px] font-medium text-text-muted bg-surface-2 border border-border rounded-full px-3 py-1"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <Button
                    variant="solid"
                    size="sm"
                    icon={<ArrowRight size={14} strokeWidth={1.75} />}
                    className="self-start"
                    href={appRegisterUrl}
                  >
                    {data.cta}
                  </Button>
                </div>

                {/* ── Preview column ── */}
                {/* Workout + Community tabs get animated demos; the other tabs
                    keep their static screenshot. */}
                {activeTabId === 'workout' ? (
                  <div className="rounded-xl border border-border bg-surface-2 min-h-[360px] max-md:min-h-[320px] overflow-hidden">
                    <WorkoutBuilderDemo />
                  </div>
                ) : activeTabId === 'community' ? (
                  <div className="flex items-center rounded-xl border border-border bg-surface-2 min-h-[360px] max-md:min-h-[320px] overflow-hidden p-4">
                    <CommunityFeedDemo embedded />
                  </div>
                ) : activeTabId === 'messaging' ? (
                  <div className="flex items-center rounded-xl border border-border bg-surface-2 min-h-[360px] max-md:min-h-[320px] overflow-hidden p-4">
                    <MessagingDemo embedded />
                  </div>
                ) : activeTabId === 'payments' ? (
                  <div className="flex items-center rounded-xl border border-border bg-surface-2 min-h-[360px] max-md:min-h-[320px] overflow-hidden p-4">
                    <PaymentsDemo embedded />
                  </div>
                ) : activeTabId === 'courses' ? (
                  <div className="flex items-center rounded-xl border border-border bg-surface-2 min-h-[360px] max-md:min-h-[320px] overflow-hidden p-4">
                    <CourseBuilderDemo embedded />
                  </div>
                ) : (
                  activeTabAsset && (
                    <div
                      className={cn(
                        'rounded-xl overflow-hidden bg-surface-2 border border-border',
                        'flex items-center justify-center',
                        'min-h-[300px] max-md:min-h-[220px]',
                      )}
                    >
                      <Image
                        src={activeTabAsset.src}
                        alt={activeTabAsset.alt}
                        width={activeTabAsset.imgWidth}
                        height={activeTabAsset.imgHeight}
                        className="w-full h-full object-contain object-center max-h-[360px] block"
                        loading="lazy"
                      />
                    </div>
                  )
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  )
}
