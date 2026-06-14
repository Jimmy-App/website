'use client'

import { useTranslations } from 'next-intl'
import {
  useReducedMotion,
  motion,
  useAnimation,
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
  Clock,
  CheckCircle2,
  Lock,
  TrendingUp,
  PlayCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ── Constants ──────────────────────────────────────────────────────────────────

const DURATION_MS = 7000
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]
const RISE = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0 },
}

// ── Types ─────────────────────────────────────────────────────────────────────

type StepId = 'workout' | 'community' | 'messaging' | 'payments' | 'courses'

type StepMeta = {
  id: StepId
  label: string
  icon: React.ReactNode
  isNew?: true
}

// ── Step list ─────────────────────────────────────────────────────────────────

const STEPS: StepMeta[] = [
  {
    id: 'workout',
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
  {
    id: 'community',
    label: 'FEATURE 02',
    icon: <Users size={16} strokeWidth={2} />,
  },
  {
    id: 'messaging',
    label: 'FEATURE 03',
    icon: <MessageCircle size={16} strokeWidth={2} />,
  },
  {
    id: 'payments',
    label: 'FEATURE 04',
    icon: <CreditCard size={16} strokeWidth={2} />,
  },
  {
    id: 'courses',
    label: 'FEATURE 05',
    icon: <GraduationCap size={16} strokeWidth={2} />,
    isNew: true,
  },
]

// ── Progress bar (per-item, animates width 0→100%) ────────────────────────────

function ProgressBar({ active, reducedMotion }: { active: boolean; reducedMotion: boolean }) {
  const controls = useAnimation()

  useEffect(() => {
    if (!active) {
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
  }, [active, controls, reducedMotion])

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

function StateWorkout({ t }: { t: ReturnType<typeof useTranslations<'platform'>> }) {
  const tags = t.raw('steps.workout.tags') as string[]
  return (
    <div className="flex flex-col">
      {/* Bar */}
      <div className="flex items-center justify-between px-4 py-[13px] border-b border-border flex-shrink-0">
        <span className="text-[13.5px] font-bold text-text">{t('steps.workout.preview.barTitle')}</span>
        <span className="text-[10px] font-bold tracking-[0.04em] px-[9px] py-[3px] rounded-full bg-purple-light text-purple whitespace-nowrap">
          {t('steps.workout.preview.barChip')}
        </span>
      </div>
      {/* Body */}
      <div className="p-[11px] flex flex-col gap-[6px]">
        {/* Exercise row */}
        <div className="flex items-center gap-2 px-[10px] py-2 rounded-[10px] bg-surface-2 border border-border">
          <div className="w-[30px] h-[30px] rounded-lg flex-shrink-0 flex items-center justify-center text-sm bg-purple-light">🏋</div>
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-semibold text-text">Bench Press</div>
            <div className="text-[10.5px] text-text-faint">4 sets × 8 reps</div>
          </div>
          <span className="text-[10px] font-bold px-[7px] py-[2px] rounded-full bg-purple-light text-purple whitespace-nowrap flex-shrink-0">85% 1RM</span>
        </div>
        <div className="flex items-center gap-2 px-[10px] py-2 rounded-[10px] bg-surface-2 border border-border">
          <div className="w-[30px] h-[30px] rounded-lg flex-shrink-0 flex items-center justify-center text-sm bg-purple-light">💪</div>
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-semibold text-text">Pull-up</div>
            <div className="text-[10.5px] text-text-faint">3 sets × AMRAP</div>
          </div>
          <span className="text-[10px] font-bold px-[7px] py-[2px] rounded-full bg-purple-light text-purple whitespace-nowrap flex-shrink-0">BW</span>
        </div>
        {/* Block row */}
        <div className="flex items-center gap-[7px] px-[10px] py-[7px] rounded-[10px] text-[11.5px] font-bold bg-purple-light text-purple">
          <Clock size={13} strokeWidth={1.5} />
          EMOM × 12 min
        </div>
        {/* Block exercises */}
        <div className="flex items-center gap-2 px-[10px] py-2 rounded-[10px] bg-surface-2 border border-border border-l-2 border-l-purple">
          <div className="w-[30px] h-[30px] rounded-lg flex-shrink-0 flex items-center justify-center text-sm bg-purple-light">🔥</div>
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-semibold text-text">Burpees</div>
            <div className="text-[10.5px] text-text-faint">× 10 reps</div>
          </div>
        </div>
        <div className="flex items-center gap-2 px-[10px] py-2 rounded-[10px] bg-surface-2 border border-border border-l-2 border-l-purple">
          <div className="w-[30px] h-[30px] rounded-lg flex-shrink-0 flex items-center justify-center text-sm bg-purple-light">⬆</div>
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-semibold text-text">Box Jump</div>
            <div className="text-[10.5px] text-text-faint">× 15 reps</div>
          </div>
        </div>
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

function StateCommunity({ t }: { t: ReturnType<typeof useTranslations<'platform'>> }) {
  const tags = t.raw('steps.community.tags') as string[]
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-4 py-[13px] border-b border-border flex-shrink-0">
        <span className="text-[13.5px] font-bold text-text">{t('steps.community.preview.barTitle')}</span>
        <span className="text-[10px] font-bold tracking-[0.04em] px-[9px] py-[3px] rounded-full bg-purple-light text-purple whitespace-nowrap">
          {t('steps.community.preview.barChip')}
        </span>
      </div>
      <div className="p-[11px] flex flex-col gap-[6px]">
        {/* Challenge */}
        <div className="flex items-center gap-[9px] px-[11px] py-[9px] rounded-[10px] bg-purple-light border border-[rgba(138,50,224,0.22)]">
          <span className="text-xl flex-shrink-0">🏃</span>
          <div className="flex-1">
            <div className="text-[12px] font-bold text-text">Week Challenge: 5K Run</div>
            <div className="text-[10.5px] text-text-muted">Ends Friday • 18 joined</div>
          </div>
          <span className="text-[10.5px] font-bold bg-purple text-white rounded-full px-[9px] py-[3px] flex-shrink-0 whitespace-nowrap">Join</span>
        </div>
        {/* Post 1 */}
        <div className="px-[11px] py-[9px] rounded-[10px] bg-surface-2 border border-border">
          <div className="flex items-center gap-[6px] mb-1">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0 bg-[#2563EB]">M</div>
            <span className="text-[11px] font-semibold text-text">Marco D.</span>
            <span className="text-[10px] text-text-faint ml-auto">2h ago</span>
          </div>
          <p className="text-[11.5px] text-text-muted leading-[1.5] mb-[6px]">PR on squats today! 185kg 💪 New personal best!</p>
          <div className="flex gap-[5px]">
            <span className="inline-flex items-center gap-[2px] bg-surface border border-border rounded-full px-[6px] py-[2px] text-[10.5px] text-text-muted">❤️ 12</span>
            <span className="inline-flex items-center gap-[2px] bg-surface border border-border rounded-full px-[6px] py-[2px] text-[10.5px] text-text-muted">💪 8</span>
            <span className="inline-flex items-center gap-[2px] bg-surface border border-border rounded-full px-[6px] py-[2px] text-[10.5px] text-text-muted">💬 3</span>
          </div>
        </div>
        {/* Post 2 */}
        <div className="px-[11px] py-[9px] rounded-[10px] bg-surface-2 border border-border">
          <div className="flex items-center gap-[6px] mb-1">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0 bg-[#16A34A]">S</div>
            <span className="text-[11px] font-semibold text-text">Sara M.</span>
            <span className="text-[10px] text-text-faint ml-auto">5h ago</span>
          </div>
          <p className="text-[11.5px] text-text-muted leading-[1.5] mb-[6px]">Week 2 complete. Let's go! 🔥</p>
          <div className="flex gap-[5px]">
            <span className="inline-flex items-center gap-[2px] bg-surface border border-border rounded-full px-[6px] py-[2px] text-[10.5px] text-text-muted">❤️ 9</span>
            <span className="inline-flex items-center gap-[2px] bg-surface border border-border rounded-full px-[6px] py-[2px] text-[10.5px] text-text-muted">💪 14</span>
          </div>
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

function StateMessaging({ t }: { t: ReturnType<typeof useTranslations<'platform'>> }) {
  const tags = t.raw('steps.messaging.tags') as string[]
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-4 py-[13px] border-b border-border flex-shrink-0">
        <span className="text-[13.5px] font-bold text-text">{t('steps.messaging.preview.barTitle')}</span>
        <span className="text-[10px] font-bold tracking-[0.04em] px-[9px] py-[3px] rounded-full bg-purple-light text-purple whitespace-nowrap">
          {t('steps.messaging.preview.barChip')}
        </span>
      </div>
      <div className="p-[11px] flex flex-col gap-[5px]">
        {/* out bubble */}
        <div className="self-end max-w-[76%] px-[10px] py-2 rounded-xl rounded-br-[3px] bg-purple text-white text-[11.5px] leading-[1.45]">
          Hey Marco, your new program is ready 💪
        </div>
        <div className="text-[10px] text-text-faint self-end">09:41 ✓✓</div>
        {/* in bubble */}
        <div className="self-start max-w-[76%] px-[10px] py-2 rounded-xl rounded-bl-[3px] bg-surface-2 border border-border text-text text-[11.5px] leading-[1.45]">
          Amazing! One question about the EMOM block—
        </div>
        {/* voice */}
        <div className="self-start max-w-[72%] flex items-center gap-[7px] px-[10px] py-[7px] rounded-xl rounded-bl-[3px] bg-surface-2 border border-border">
          <div className="w-5 h-5 rounded-full flex items-center justify-center bg-purple text-white flex-shrink-0">
            <PlayCircle size={10} strokeWidth={2} />
          </div>
          <div className="flex-1 flex items-center gap-[1.5px] h-4">
            {[60, 100, 40, 80, 55, 90, 35, 70].map((h, i) => (
              <div key={i} className="flex-1 rounded-[2px] bg-border" style={{ height: `${h}%` }} />
            ))}
          </div>
          <span className="text-[10px] text-text-faint whitespace-nowrap">0:24</span>
        </div>
        {/* out bubble */}
        <div className="self-end max-w-[76%] px-[10px] py-2 rounded-xl rounded-br-[3px] bg-purple text-white text-[11.5px] leading-[1.45]">
          Sure! Check this modification 🎯
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

function StatePayments({ t }: { t: ReturnType<typeof useTranslations<'platform'>> }) {
  const tags = t.raw('steps.payments.tags') as string[]
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-4 py-[13px] border-b border-border flex-shrink-0">
        <span className="text-[13.5px] font-bold text-text">{t('steps.payments.preview.barTitle')}</span>
        <span className="text-[10px] font-bold tracking-[0.04em] px-[9px] py-[3px] rounded-full bg-purple-light text-purple whitespace-nowrap">
          {t('steps.payments.preview.barChip')}
        </span>
      </div>
      <div className="p-[11px] flex flex-col gap-[6px]">
        {/* Revenue card */}
        <div className="px-[11px] py-[10px] rounded-[10px] bg-surface-2 border border-border">
          <div className="text-[9.5px] uppercase tracking-[0.07em] text-text-faint">Monthly revenue</div>
          <div className="font-display text-[1.7rem] font-extrabold [letter-spacing:-0.04em] text-text leading-[1.1]">€3,840</div>
          <div className="inline-flex items-center gap-[3px] bg-[#DCFCE7] text-[#166534] rounded-full px-[7px] py-[2px] mt-1 text-[10px] font-semibold">
            <TrendingUp size={9} strokeWidth={1.4} />
            +28% vs last month
          </div>
        </div>
        {/* Subscribers */}
        {[
          { initials: 'M', name: 'Marco D.', plan: 'Monthly', amount: '€89', bg: '#2563EB' },
          { initials: 'S', name: 'Sara M.', plan: 'Monthly', amount: '€89', bg: '#16A34A' },
          { initials: 'J', name: 'John B.', plan: 'Annual', amount: '€59', bg: '#8a32e0' },
        ].map(({ initials, name, plan, amount, bg }) => (
          <div key={name} className="flex items-center gap-[7px] px-[9px] py-[7px] rounded-[9px] bg-surface border border-border">
            <div
              className="w-[22px] h-[22px] rounded-full flex items-center justify-center text-[8.5px] font-bold text-white flex-shrink-0"
              style={{ background: bg }}
            >
              {initials}
            </div>
            <span className="text-[11.5px] font-semibold text-text flex-1">{name}</span>
            <span className="text-[10px] text-text-faint">{plan}</span>
            <span className="text-[12px] font-bold text-text">{amount}</span>
            <div className="w-[14px] h-[14px] rounded-full bg-[#22C55E] flex items-center justify-center flex-shrink-0">
              <CheckCircle2 size={8} strokeWidth={2} className="text-white" />
            </div>
          </div>
        ))}
        {/* Stripe badge */}
        <div className="flex items-center justify-center gap-[5px] text-[10.5px] text-text-faint pt-[3px]">
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

function StateCourses({ t }: { t: ReturnType<typeof useTranslations<'platform'>> }) {
  const tags = t.raw('steps.courses.tags') as string[]
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-4 py-[13px] border-b border-border flex-shrink-0">
        <span className="text-[13.5px] font-bold text-text">{t('steps.courses.preview.barTitle')}</span>
        <span className="text-[10px] font-bold tracking-[0.04em] px-[9px] py-[3px] rounded-full bg-purple-light text-purple whitespace-nowrap">
          {t('steps.courses.preview.barChip')}
        </span>
      </div>
      <div className="p-[11px] flex flex-col gap-[6px]">
        {/* Module 1 label */}
        <div className="text-[10px] font-bold tracking-[0.05em] uppercase text-text-faint px-[2px] pt-[3px] pb-[1px]">
          MODULE 1 — Foundations
        </div>
        {/* Done lessons */}
        <div className="flex items-center gap-[7px] px-2 py-[6px] rounded-lg text-[11.5px] text-text-muted">
          <CheckCircle2 size={12} strokeWidth={1.75} className="text-text-faint flex-shrink-0" />
          <span>Lesson 1: Macros explained</span>
        </div>
        <div className="flex items-center gap-[7px] px-2 py-[6px] rounded-lg text-[11.5px] text-text-muted">
          <CheckCircle2 size={12} strokeWidth={1.75} className="text-text-faint flex-shrink-0" />
          <span>Lesson 2: Calorie tracking</span>
        </div>
        {/* Active lesson */}
        <div className="flex items-center gap-[7px] px-2 py-[6px] rounded-lg text-[11.5px] font-semibold text-text bg-purple-light border border-[rgba(138,50,224,0.22)]">
          <span className="text-[12px] text-purple flex-shrink-0">▶</span>
          <span>Lesson 3: Meal timing</span>
        </div>
        {/* Module 2 label */}
        <div className="text-[10px] font-bold tracking-[0.05em] uppercase text-text-faint px-[2px] pt-[3px] pb-[1px]">
          MODULE 2 — Advanced
        </div>
        {/* Locked lessons */}
        <div className="flex items-center gap-[7px] px-2 py-[6px] rounded-lg text-[11.5px] text-text-faint">
          <Lock size={11} strokeWidth={1.75} className="flex-shrink-0" />
          <span>Lesson 4: Supplements</span>
        </div>
        <div className="flex items-center gap-[7px] px-2 py-[6px] rounded-lg text-[11.5px] text-text-faint">
          <Lock size={11} strokeWidth={1.75} className="flex-shrink-0" />
          <span>Lesson 5: Periodization</span>
        </div>
        {/* Content type buttons */}
        <div className="flex gap-[5px] pt-[3px]">
          {['▶ Video', '📄 PDF', '❓ Quiz'].map((btn) => (
            <div
              key={btn}
              className="flex-1 px-1 py-[6px] rounded-lg text-center text-[11px] font-semibold bg-surface border border-border text-text-muted"
            >
              {btn}
            </div>
          ))}
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

// ── Render the correct preview panel ──────────────────────────────────────────

function PreviewPanel({
  id,
  t,
}: {
  id: StepId
  t: ReturnType<typeof useTranslations<'platform'>>
}) {
  switch (id) {
    case 'workout':    return <StateWorkout    t={t} />
    case 'community':  return <StateCommunity  t={t} />
    case 'messaging':  return <StateMessaging  t={t} />
    case 'payments':   return <StatePayments   t={t} />
    case 'courses':    return <StateCourses    t={t} />
  }
}

// ── Main component ─────────────────────────────────────────────────────────────

export function Platform() {
  const t = useTranslations('platform')
  const reducedMotion = useReducedMotion() ?? false

  const [active, setActive] = useState(0)

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

  // Auto-advance: re-arm on every `active` change; skip entirely when reduced motion
  useEffect(() => {
    if (reducedMotion) return
    const id = setTimeout(() => {
      setActive((cur) => (cur + 1) % STEPS.length)
    }, DURATION_MS)
    return () => clearTimeout(id)
  }, [active, reducedMotion])

  return (
    <section
      id="platform"
      aria-label={t('ariaLabel')}
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
            {t('eyebrow')}
          </span>
          <h2 className="font-display text-display font-extrabold text-text [letter-spacing:-0.04em] [line-height:1.05] mb-[0.8rem] [text-wrap:balance]">
            {t('title')}
          </h2>
          <p className="text-[16px] text-text-muted leading-[1.6] max-w-[500px] mx-auto">
            {t('subtitle')}
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
          <nav aria-label={t('navLabel')} className="flex flex-col gap-[3px]">
            {STEPS.map((step, i) => {
              const isActive = i === active
              return (
                <button
                  key={step.id}
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
                    {step.icon}
                  </div>

                  {/* Content */}
                  <div className="relative z-[1] flex-1 min-w-0">
                    <div
                      className={cn(
                        'text-[10px] font-bold tracking-[0.1em] uppercase mb-[2px] transition-colors duration-[180ms]',
                        isActive ? 'text-purple' : 'text-text-faint',
                      )}
                    >
                      {step.label}
                    </div>
                    <div
                      className={cn(
                        'font-display text-base font-bold [letter-spacing:-0.02em] [line-height:1.25] mb-[2px]',
                        'transition-colors duration-[180ms]',
                        isActive ? 'text-text' : 'text-text-muted',
                      )}
                    >
                      {t(`steps.${step.id}.name`)}
                    </div>
                    <div
                      className={cn(
                        'text-[12px] leading-[1.4] transition-colors duration-[180ms]',
                        isActive ? 'text-text-muted' : 'text-text-faint',
                      )}
                    >
                      {t(`steps.${step.id}.tagline`)}
                    </div>

                    {/* Badges (courses only) */}
                    {step.isNew && (
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
                    <ProgressBar active={isActive} reducedMotion={reducedMotion} />
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
              {STEPS.map((step, i) => {
                const isActive = i === active
                return (
                  <div
                    key={step.id}
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
                    <PreviewPanel id={step.id} t={t} />
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
