'use client'

import {
  useReducedMotion,
  motion,
  useAnimation,
  useInView,
} from 'framer-motion'
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useCallback,
  useState,
} from 'react'

// useLayoutEffect on the client, useEffect on the server (avoids SSR warning).
const useIsoLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect
import {
  Users,
  MessageCircle,
  CreditCard,
  GraduationCap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { WorkoutBuilderDemo } from '@/components/sections/WorkoutBuilderDemo'
import { CommunityFeedDemo } from '@/components/sections/CommunityFeedDemo'
import { MessagingDemo } from '@/components/sections/MessagingDemo'
import { PaymentsDemo } from '@/components/sections/PaymentsDemo'
import { CourseBuilderDemo } from '@/components/sections/CourseBuilderDemo'
import type { PlatformData } from '@/lib/content'

// ── Constants ──────────────────────────────────────────────────────────────────

const DURATION_MS = 7000
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]
const RISE = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0 },
}

// ── Types ─────────────────────────────────────────────────────────────────────

type StepId = 'workout' | 'community' | 'messaging' | 'payments' | 'courses'

// ── Static icon + label per step id ──────────────────────────────────────────

type StepStaticMeta = {
  label: string
  icon: React.ReactNode
  isNew?: true
}

const STEP_META: Record<StepId, StepStaticMeta> = {
  workout: {
    label: 'FEATURE 01',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4"
      >
        <path d="M6 4v16M18 4v16M6 9h12M6 15h12" />
        <rect x="2" y="7" width="4" height="10" rx="1" />
        <rect x="18" y="7" width="4" height="10" rx="1" />
      </svg>
    ),
  },
  community: {
    label: 'FEATURE 02',
    icon: <Users size={16} strokeWidth={2} />,
  },
  messaging: {
    label: 'FEATURE 03',
    icon: <MessageCircle size={16} strokeWidth={2} />,
  },
  payments: {
    label: 'FEATURE 04',
    icon: <CreditCard size={16} strokeWidth={2} />,
  },
  courses: {
    label: 'FEATURE 05',
    icon: <GraduationCap size={16} strokeWidth={2} />,
    isNew: true,
  },
}

// ── Step data type (from Sanity, single item in the array) ───────────────────

type StepData = NonNullable<PlatformData['steps']>[number]

// ── Progress bar (per-item, animates width 0→100%) ────────────────────────────

function ProgressBar({
  active,
  reducedMotion,
  inView,
}: {
  active: boolean
  reducedMotion: boolean
  inView: boolean
}) {
  const controls = useAnimation()

  useEffect(() => {
    if (!active || !inView) {
      controls.set({ width: '0%' })
      return
    }
    if (reducedMotion) {
      controls.set({ width: '100%' })
    } else {
      controls.set({ width: '0%' })
      controls.start({
        width: '100%',
        transition: { duration: DURATION_MS / 1000, ease: 'linear' },
      })
    }
    return () => {
      controls.stop()
    }
  }, [active, controls, reducedMotion, inView])

  return (
    <div
      aria-hidden
      className="h-[2px] bg-[rgba(138,50,224,0.15)] rounded-full mt-[9px] overflow-hidden"
      style={{ opacity: active ? 1 : 0, transition: 'opacity 200ms' }}
    >
      <motion.div
        animate={controls}
        className="h-full bg-purple rounded-full"
        style={{ width: '0%' }}
      />
    </div>
  )
}

// ── Preview panels ─────────────────────────────────────────────────────────────

function StateWorkout({ step, active }: { step: StepData; active: boolean }) {
  const tags = step.tags ?? []
  return (
    <div className="flex flex-col">
      {/* Bar */}
      <div className="flex items-center justify-between px-4 py-[13px] border-b border-border flex-shrink-0">
        <span className="text-[13.5px] font-bold text-text">{step.preview?.barTitle}</span>
        <span className="text-[10px] font-bold tracking-[0.04em] px-[9px] py-[3px] rounded-full bg-purple-light text-purple whitespace-nowrap">
          {step.preview?.barChip}
        </span>
      </div>
      {/* Body — animated drag-and-drop builder (same demo as the Features tab) */}
      <div className="p-[11px]">
        <WorkoutBuilderDemo embedded active={active} />
      </div>
      {/* Tags */}
      <div className="flex flex-wrap gap-[5px] px-3 py-[9px] border-t border-border flex-shrink-0">
        {tags.map((tag) => (
          <span key={tag} className="text-[11px] font-medium px-[10px] py-1 rounded-full bg-surface-2 border border-border text-text-muted">
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}

function StateCommunity({ step, active }: { step: StepData; active: boolean }) {
  const tags = step.tags ?? []
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-4 py-[13px] border-b border-border flex-shrink-0">
        <span className="text-[13.5px] font-bold text-text">{step.preview?.barTitle}</span>
        <span className="text-[10px] font-bold tracking-[0.04em] px-[9px] py-[3px] rounded-full bg-purple-light text-purple whitespace-nowrap">
          {step.preview?.barChip}
        </span>
      </div>
      {/* Body — animated live community feed */}
      <div className="p-[11px]">
        <CommunityFeedDemo embedded active={active} />
      </div>
      <div className="flex flex-wrap gap-[5px] px-3 py-[9px] border-t border-border flex-shrink-0">
        {tags.map((tag) => (
          <span key={tag} className="text-[11px] font-medium px-[10px] py-1 rounded-full bg-surface-2 border border-border text-text-muted">
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}

function StateMessaging({ step, active }: { step: StepData; active: boolean }) {
  const tags = step.tags ?? []
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-4 py-[13px] border-b border-border flex-shrink-0">
        <span className="text-[13.5px] font-bold text-text">{step.preview?.barTitle}</span>
        <span className="text-[10px] font-bold tracking-[0.04em] px-[9px] py-[3px] rounded-full bg-purple-light text-purple whitespace-nowrap">
          {step.preview?.barChip}
        </span>
      </div>
      {/* Body — animated live 1:1 chat */}
      <div className="p-[11px]">
        <MessagingDemo embedded active={active} />
      </div>
      <div className="flex flex-wrap gap-[5px] px-3 py-[9px] border-t border-border flex-shrink-0">
        {tags.map((tag) => (
          <span key={tag} className="text-[11px] font-medium px-[10px] py-1 rounded-full bg-surface-2 border border-border text-text-muted">
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}

function StatePayments({ step, active }: { step: StepData; active: boolean }) {
  const tags = step.tags ?? []
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-4 py-[13px] border-b border-border flex-shrink-0">
        <span className="text-[13.5px] font-bold text-text">{step.preview?.barTitle}</span>
        <span className="text-[10px] font-bold tracking-[0.04em] px-[9px] py-[3px] rounded-full bg-purple-light text-purple whitespace-nowrap">
          {step.preview?.barChip}
        </span>
      </div>
      {/* Body — payments fly in as notifications + revenue chart grows */}
      <div className="p-[11px] flex flex-col gap-[10px]">
        <PaymentsDemo embedded active={active} />
        {/* Stripe badge */}
        <div className="flex items-center justify-center gap-[5px] text-[10.5px] text-text-faint">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <rect width="12" height="12" rx="2.5" fill="#635BFF" />
            <path d="M6 2.5c-1.2 0-1.8.6-1.8 1.4 0 1.9 3 1.3 3 2.6 0 .6-.5 1-1.3 1-.7 0-1.4-.3-1.8-.8L3.4 8c.5.5 1.4.9 2.4.9 1.4 0 2.2-.7 2.2-1.7 0-1.8-3-1.3-3-2.5 0-.5.4-.9 1.1-.9.6 0 1.1.3 1.5.6l.6-.8C8.8 3.1 7.9 2.5 6 2.5z" fill="#fff" />
          </svg>
          Powered by Stripe
        </div>
      </div>
      <div className="flex flex-wrap gap-[5px] px-3 py-[9px] border-t border-border flex-shrink-0">
        {tags.map((tag) => (
          <span key={tag} className="text-[11px] font-medium px-[10px] py-1 rounded-full bg-surface-2 border border-border text-text-muted">
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}

function StateCourses({ step, active }: { step: StepData; active: boolean }) {
  const tags = step.tags ?? []
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-4 py-[13px] border-b border-border flex-shrink-0">
        <span className="text-[13.5px] font-bold text-text">{step.preview?.barTitle}</span>
        <span className="text-[10px] font-bold tracking-[0.04em] px-[9px] py-[3px] rounded-full bg-purple-light text-purple whitespace-nowrap">
          {step.preview?.barChip}
        </span>
      </div>
      {/* Body — Skool-style course builder assembling the curriculum */}
      <div className="p-[11px]">
        <CourseBuilderDemo embedded active={active} />
      </div>
      <div className="flex flex-wrap gap-[5px] px-3 py-[9px] border-t border-border flex-shrink-0">
        {tags.map((tag) => (
          <span key={tag} className="text-[11px] font-medium px-[10px] py-1 rounded-full bg-surface-2 border border-border text-text-muted">
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}

// ── Render the correct preview panel ──────────────────────────────────────────

function PreviewPanel({
  id,
  step,
  active,
}: {
  id: StepId
  step: StepData
  active: boolean
}) {
  switch (id) {
    case 'workout':    return <StateWorkout    step={step} active={active} />
    case 'community':  return <StateCommunity  step={step} active={active} />
    case 'messaging':  return <StateMessaging  step={step} active={active} />
    case 'payments':   return <StatePayments   step={step} active={active} />
    case 'courses':    return <StateCourses    step={step} active={active} />
  }
}

// ── Main component ─────────────────────────────────────────────────────────────

export function Platform({ data }: { data: PlatformData }) {
  const reducedMotion = useReducedMotion() ?? false

  const steps = data.steps ?? []
  const [active, setActive] = useState(0)

  // Auto-advance + progress only run while the section is on screen. The
  // section is tall, so use 'some' (any part visible) — a fractional `amount`
  // can be unreachable for elements taller than the viewport.
  const sectionRef = useRef<HTMLElement>(null)
  const inView = useInView(sectionRef, { amount: 'some' })

  // Click handler — jump to a step immediately
  const activate = useCallback((idx: number) => {
    setActive(idx)
  }, [])

  // ── Preview height morphing ───────────────────────────────────────────────
  // Each preview panel has a different natural height. We stack them, measure
  // the active one, and animate the container's height so it grows/shrinks
  // smoothly between cards instead of being a fixed box with dead space.
  const panelRefs = useRef<(HTMLDivElement | null)[]>([])
  const [panelHeight, setPanelHeight] = useState<number | undefined>(undefined)
  const mounted = useRef(false)
  useEffect(() => {
    mounted.current = true
  }, [])

  useIsoLayoutEffect(() => {
    const measure = () => {
      const el = panelRefs.current[active]
      if (el) setPanelHeight(el.offsetHeight)
    }
    measure()
    const ro = new ResizeObserver(measure)
    panelRefs.current.forEach((el) => el && ro.observe(el))
    return () => ro.disconnect()
  }, [active])

  const heightTransition = {
    duration: reducedMotion || !mounted.current ? 0 : 0.5,
    ease: [0.32, 0.72, 0, 1] as const,
  }

  // Auto-advance: re-arm on every `active` change; skip when reduced motion or
  // when the section is scrolled out of view.
  useEffect(() => {
    if (reducedMotion || !inView) return
    const id = setTimeout(() => {
      setActive((cur) => (cur + 1) % steps.length)
    }, DURATION_MS)
    return () => clearTimeout(id)
  }, [active, reducedMotion, steps.length, inView])

  return (
    <section
      ref={sectionRef}
      id="platform"
      aria-label={data.ariaLabel ?? ''}
      className="bg-surface-2 border-t border-border py-[var(--section-pad-y)]"
    >
      <div className="container-content">

        {/* ── Header ── */}
        <motion.header
          className="text-center mb-[clamp(3rem,5vw,4rem)]"
          variants={reducedMotion ? undefined : RISE}
          initial={reducedMotion ? undefined : 'hidden'}
          whileInView={reducedMotion ? undefined : 'show'}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.62, ease: EASE }}
        >
          <span className="eyebrow inline-flex items-center gap-[6px] text-purple mb-[0.9rem]">
            <span
              aria-hidden="true"
              className="inline-block h-[5px] w-[5px] rounded-full bg-purple"
            />
            {data.eyebrow}
          </span>
          <h2 className="font-display text-display font-extrabold text-text [letter-spacing:-0.04em] [line-height:1.05] mb-[0.8rem] [text-wrap:balance]">
            {data.title}
          </h2>
          <p className="text-[16px] text-text-muted leading-[1.6] max-w-[500px] mx-auto">
            {data.subtitle}
          </p>
        </motion.header>

        {/* ── Two-column layout ── */}
        <motion.div
          className={cn(
            'grid gap-[clamp(2rem,4vw,3.5rem)] items-start',
            'grid-cols-[42fr_58fr]',
            'max-[960px]:grid-cols-1',
          )}
          variants={reducedMotion ? undefined : RISE}
          initial={reducedMotion ? undefined : 'hidden'}
          whileInView={reducedMotion ? undefined : 'show'}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.64, ease: EASE, delay: 0.1 }}
        >

          {/* ── Left nav ── */}
          <nav aria-label={data.navLabel ?? ''} className="flex flex-col gap-[3px]">
            {steps.map((step, i) => {
              const isActive = i === active
              const stepId = (step.id ?? '') as StepId
              const meta = STEP_META[stepId]
              return (
                <button
                  key={step._key}
                  onClick={() => activate(i)}
                  aria-pressed={isActive}
                  className={cn(
                    'relative flex items-start gap-3 px-3 py-[14px] rounded-[14px] cursor-pointer text-left w-full',
                    'transition-colors duration-[180ms]',
                    !isActive && 'hover:bg-[rgba(138,50,224,0.04)] rounded-[14px]',
                    'active:scale-[0.99] [transition:background-color_180ms,transform_140ms_ease-out]',
                  )}
                >
                  {/* Sliding active highlight — morphs between cards */}
                  {isActive && (
                    <motion.span
                      layoutId="platform-active-card"
                      transition={
                        reducedMotion
                          ? { duration: 0 }
                          : { type: 'spring', duration: 0.5, bounce: 0.16 }
                      }
                      aria-hidden
                      className={cn(
                        'absolute inset-0 -z-0 rounded-[14px]',
                        'bg-surface border-[1.5px] border-[rgba(138,50,224,0.22)]',
                        'shadow-[0_2px_16px_rgba(138,50,224,0.08),0_1px_4px_rgba(0,0,0,0.04)]',
                      )}
                    />
                  )}

                  {/* Icon */}
                  <div
                    className={cn(
                      'relative z-[1] w-9 h-9 rounded-[10px] flex-shrink-0 flex items-center justify-center mt-[1px]',
                      'transition-[background,color] duration-200',
                      isActive
                        ? 'bg-purple-light text-purple'
                        : 'bg-surface-offset text-text-faint',
                    )}
                  >
                    {meta?.icon}
                  </div>

                  {/* Content */}
                  <div className="relative z-[1] flex-1 min-w-0">
                    <div
                      className={cn(
                        'text-[10px] font-bold tracking-[0.1em] uppercase mb-[2px] transition-colors duration-[180ms]',
                        isActive ? 'text-purple' : 'text-text-faint',
                      )}
                    >
                      {meta?.label}
                    </div>
                    <div
                      className={cn(
                        'font-display text-base font-bold [letter-spacing:-0.02em] [line-height:1.25] mb-[2px]',
                        'transition-colors duration-[180ms]',
                        isActive ? 'text-text' : 'text-text-muted',
                      )}
                    >
                      {step.name}
                    </div>
                    <div
                      className={cn(
                        'text-[12px] leading-[1.4] transition-colors duration-[180ms]',
                        isActive ? 'text-text-muted' : 'text-text-faint',
                      )}
                    >
                      {step.tagline}
                    </div>

                    {/* Badges (courses only) */}
                    {meta?.isNew && (
                      <div className="flex gap-1 mt-[5px]">
                        <span className="text-[9px] font-bold tracking-[0.06em] uppercase px-[6px] py-[1px] rounded-full bg-purple-light text-purple border border-[rgba(138,50,224,0.22)]">
                          NEW
                        </span>
                        <span className="text-[9px] font-bold tracking-[0.06em] uppercase px-[6px] py-[1px] rounded-full bg-surface-offset text-text-muted border border-border">
                          PHASE 2
                        </span>
                      </div>
                    )}

                    {/* Progress bar */}
                    <ProgressBar active={isActive} reducedMotion={reducedMotion} inView={inView} />
                  </div>
                </button>
              )
            })}
          </nav>

          {/* ── Right preview ── */}
          <div className="sticky top-[5.5rem] max-[960px]:static">
            <motion.div
              initial={false}
              animate={{ height: panelHeight ?? 'auto' }}
              transition={heightTransition}
              className={cn(
                'bg-surface border border-border rounded-[22px] overflow-hidden',
                'shadow-[0_4px_32px_rgba(0,0,0,0.07),0_1px_4px_rgba(0,0,0,0.04)]',
                'relative',
              )}
            >
              {steps.map((step, i) => {
                const isActive = i === active
                const stepId = (step.id ?? '') as StepId
                return (
                  <div
                    key={step._key}
                    ref={(el) => {
                      panelRefs.current[i] = el
                    }}
                    aria-hidden={!isActive}
                    className={cn(
                      'top-0 left-0 w-full',
                      isActive ? 'relative' : 'absolute pointer-events-none',
                      'transition-[opacity,transform,filter] duration-[440ms]',
                      '[transition-timing-function:cubic-bezier(0.16,1,0.3,1)]',
                      isActive
                        ? 'opacity-100 translate-y-0 scale-100 blur-0'
                        : 'opacity-0 translate-y-[10px] scale-[0.985] blur-[6px]',
                    )}
                  >
                    <PreviewPanel id={stepId} step={step} active={isActive} />
                  </div>
                )
              })}
            </motion.div>
          </div>

        </motion.div>
      </div>
    </section>
  )
}
