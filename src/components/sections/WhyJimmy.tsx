'use client'

import Image from 'next/image'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import {
  MessageCircle,
  Dumbbell,
  CreditCard,
  CalendarCheck,
  Check,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { WhyData } from '@/lib/content'

// useLayoutEffect on the client, useEffect on the server (avoids SSR warning).
const useIsoLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

// ── Types ─────────────────────────────────────────────────────────────────────

type State = 'without' | 'with'

// ── Brand / tool logos (inline SVG — no external assets) ───────────────────────

function ExcelLogo() {
  return (
    <svg viewBox="0 0 32 32" className="w-full h-full" aria-hidden>
      <rect x="3" y="5" width="26" height="22" rx="3" fill="#1D6F42" />
      <rect x="3" y="5" width="13" height="22" rx="3" fill="#21A366" />
      <path
        d="M8.6 11.2l3 4.8-3 4.8h2.3l1.9-3.2 1.9 3.2h2.4l-3.1-4.8 3-4.8h-2.3l-1.8 3.1-1.8-3.1z"
        fill="#fff"
      />
      <rect x="18.5" y="9" width="8" height="3.4" rx="1" fill="#fff" opacity="0.92" />
      <rect x="18.5" y="14.3" width="8" height="3.4" rx="1" fill="#fff" opacity="0.92" />
      <rect x="18.5" y="19.6" width="8" height="3.4" rx="1" fill="#fff" opacity="0.92" />
    </svg>
  )
}

function WhatsAppLogo() {
  return (
    <svg viewBox="0 0 32 32" className="w-full h-full" aria-hidden>
      <circle cx="16" cy="16" r="13" fill="#25D366" />
      <path
        d="M16 8.4a7.5 7.5 0 0 0-6.4 11.4L8.4 23.6l3.9-1.2A7.5 7.5 0 1 0 16 8.4Zm4.4 10.6c-.18.5-1.06.96-1.47 1-.38.04-.86.06-1.39-.09a12.6 12.6 0 0 1-1.26-.47 9.8 9.8 0 0 1-3.76-3.32c-.28-.38-.74-1.13-.74-2.16 0-1.03.54-1.53.73-1.74a.77.77 0 0 1 .56-.26h.4c.13 0 .3-.05.47.36.18.42.6 1.46.65 1.56.05.1.08.23.02.36-.06.13-.1.21-.19.32l-.28.33c-.09.1-.18.2-.08.39.1.18.46.76 1 1.23.69.61 1.27.8 1.45.9.18.09.29.07.4-.04.1-.13.46-.54.58-.72.12-.18.24-.15.4-.09.17.06 1.06.5 1.24.59.18.09.3.13.35.21.04.08.04.45-.14.95Z"
        fill="#fff"
      />
    </svg>
  )
}

function PaymentLogo() {
  return (
    <svg viewBox="0 0 32 32" className="w-full h-full" aria-hidden>
      <rect x="3" y="7" width="26" height="18" rx="3.4" fill="#E2E5EA" />
      <rect x="3" y="11" width="26" height="3.6" fill="#9AA1AD" />
      <rect x="6.5" y="18.5" width="9" height="2.6" rx="1.3" fill="#B6BCC6" />
      <circle cx="24" cy="22" r="6" fill="#F59E0B" />
      <rect x="23" y="18.4" width="2" height="4.4" rx="1" fill="#fff" />
      <circle cx="24" cy="24.6" r="1.05" fill="#fff" />
    </svg>
  )
}

function CalendarLogo() {
  return (
    <svg viewBox="0 0 32 32" className="w-full h-full" aria-hidden>
      <rect x="4" y="6" width="24" height="22" rx="3.4" fill="#E2E5EA" />
      <rect x="4" y="6" width="24" height="6" rx="3.4" fill="#9AA1AD" />
      <rect x="9" y="3.5" width="2.6" height="5" rx="1.3" fill="#6B7280" />
      <rect x="20.4" y="3.5" width="2.6" height="5" rx="1.3" fill="#6B7280" />
      <path
        d="M12.5 16.5l7 7M19.5 16.5l-7 7"
        stroke="#EF4444"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  )
}

// External tool (logo) → its in-app Jimmy equivalent (icon). Presentational,
// mapped by index to the Sanity cards/modules. Labels/subs come from Sanity.
const TOOL_SLOTS = [
  { Logo: WhatsAppLogo, Icon: MessageCircle },
  { Logo: ExcelLogo, Icon: Dumbbell },
  { Logo: PaymentLogo, Icon: CreditCard },
  { Logo: CalendarLogo, Icon: CalendarCheck },
] as const

// Scattered transform per slot for the "without" (messy pile) state.
// z ascends top→bottom so each card's logo (at its top) stays above the
// dipping bottom corner of the card before it — logos never get covered.
const SCATTER = [
  { x: -12, y: 0, rotate: -4, z: 1 },
  { x: 14, y: 5, rotate: 3.5, z: 2 },
  { x: -7, y: 10, rotate: -3, z: 3 },
  { x: 15, y: 8, rotate: 4.5, z: 4 },
] as const

// ── Tools morph: chaotic pile (without) → organized Jimmy app (with) ───────────

type Slot = (typeof TOOL_SLOTS)[number] & {
  name: string
  desc: string
  jLabel: string
  jSub: string
}

function ToolsMorph({
  active,
  slots,
  withoutLabel,
  appName,
  appTagline,
  syncedLabel,
  reduced,
}: {
  active: State
  slots: Slot[]
  withoutLabel: string
  appName: string
  appTagline: string
  syncedLabel: string
  reduced: boolean
}) {
  const isWith = active === 'with'
  const ease = [0.16, 1, 0.3, 1] as const
  const t = (delay: number) =>
    reduced ? { duration: 0 } : { duration: 0.62, ease, delay }

  // On narrow screens the absolute card pile would overflow + clip, so dial the
  // scatter/sizing down. Detected client-side (illustration is below the fold).
  const [compact, setCompact] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 700px)')
    const update = () => setCompact(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  // Aligned (with) vertical rhythm + the messy (without) scatter, expressed as a
  // transform delta so only `transform`/`opacity` animate (cheap, 60fps).
  const TOP_WITH = compact ? 30 : 60
  const GAP_WITH = compact ? 98 : 86
  const CARD_H = compact ? 86 : 76
  const xScale = compact ? 0.28 : 1
  const rotScale = compact ? 0.5 : 1
  const stageH = TOP_WITH + (slots.length - 1) * GAP_WITH + CARD_H + 8

  return (
    <div className="absolute inset-0 p-6 max-lg:p-5">
      {/* Top bar — "Without Jimmy" pill ⇄ Jimmy app header (crossfade) */}
      <div className="relative h-[42px]">
        <motion.div
          animate={{ opacity: isWith ? 0 : 1 }}
          transition={t(0)}
          className={cn(
            'absolute left-0 top-0 inline-flex items-center gap-[7px]',
            'bg-surface border border-border rounded-full px-[13px] py-[7px]',
            'text-[13px] font-semibold text-text-muted shadow-[0_1px_4px_rgba(0,0,0,0.06)]',
          )}
        >
          <svg viewBox="0 0 16 16" fill="none" className="w-[12px] h-[12px]" aria-hidden>
            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          </svg>
          {withoutLabel}
        </motion.div>

        <motion.div
          animate={{ opacity: isWith ? 1 : 0, y: isWith ? 0 : -6 }}
          transition={t(isWith ? 0.05 : 0)}
          aria-hidden={!isWith}
          className="absolute inset-x-0 top-0 flex items-center gap-[10px]"
        >
          <Image
            src="/assets/logo/logo.svg"
            alt=""
            width={30}
            height={30}
            aria-hidden
            className="w-[30px] h-[30px] rounded-[8px] shadow-[0_3px_10px_rgba(138,50,224,0.3)]"
          />
          <div className="leading-tight">
            <div className="text-[13.5px] font-bold text-text">{appName}</div>
            <div className="text-[11px] text-text-muted">{appTagline}</div>
          </div>
          <span className="ml-auto inline-flex items-center gap-[6px] rounded-full bg-[#E7F7EE] px-[10px] py-[5px] text-[11px] font-bold text-[#15803D]">
            <span className="w-[6px] h-[6px] rounded-full bg-[#22C55E]" />
            {syncedLabel}
          </span>
        </motion.div>
      </div>

      {/* Cards stage */}
      <div className="relative mt-[6px]" style={{ height: stageH }}>
        {slots.map((s, i) => {
          const sc = SCATTER[i]
          const topWith = TOP_WITH + i * GAP_WITH
          // messy pile sits higher + tighter, so cards overlap into a heap
          const deltaY = 10 + sc.y - i * 15
          return (
            <motion.div
              key={i}
              initial={false}
              animate={{
                y: isWith ? 0 : deltaY,
                x: isWith ? 0 : sc.x * xScale,
                rotate: isWith ? 0 : sc.rotate * rotScale,
              }}
              transition={t(isWith ? i * 0.05 : (slots.length - 1 - i) * 0.04)}
              style={{ top: topWith, zIndex: isWith ? i + 1 : sc.z }}
              className="absolute left-0 right-0"
            >
              <div
                style={{ height: CARD_H }}
                className={cn(
                  'relative rounded-[14px] border bg-surface overflow-hidden',
                  'transition-[border-color,box-shadow] duration-500',
                  isWith
                    ? 'border-[rgba(138,50,224,0.28)] shadow-[0_6px_18px_-10px_rgba(138,50,224,0.45)]'
                    : 'border-border shadow-[0_2px_8px_rgba(0,0,0,0.06)]',
                )}
              >
                {/* External tool (without) */}
                <motion.div
                  animate={{ opacity: isWith ? 0 : 1 }}
                  transition={t(0)}
                  aria-hidden={isWith}
                  className="absolute inset-0 flex items-center gap-[12px] px-[14px]"
                >
                  <div className="w-[38px] h-[38px] shrink-0">
                    <s.Logo />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[13px] font-semibold text-text truncate">{s.name}</div>
                    <div className="text-[11.5px] text-text-muted leading-[1.38] line-clamp-2">
                      {s.desc}
                    </div>
                  </div>
                </motion.div>

                {/* Jimmy module (with) */}
                <motion.div
                  animate={{ opacity: isWith ? 1 : 0 }}
                  transition={t(isWith ? 0.08 : 0)}
                  aria-hidden={!isWith}
                  className="absolute inset-0 flex items-center gap-[12px] px-[14px]"
                >
                  <div className="w-[38px] h-[38px] shrink-0 rounded-[10px] bg-purple-light text-purple flex items-center justify-center">
                    <s.Icon size={19} strokeWidth={1.9} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[13.5px] font-semibold text-text">{s.jLabel}</div>
                    <div className="text-[11.5px] text-text-muted leading-[1.38]">{s.jSub}</div>
                  </div>
                  <div className="w-[22px] h-[22px] shrink-0 rounded-full bg-[#22C55E] text-white flex items-center justify-center">
                    <Check size={13} strokeWidth={2.6} />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

// ── Bullet item ───────────────────────────────────────────────────────────────

function BulletItem({ text, muted }: { text: string; muted: boolean }) {
  return (
    <div className="flex items-start gap-2">
      <svg
        viewBox="0 0 16 16"
        fill="none"
        className={cn(
          'w-[15px] h-[15px] shrink-0 mt-[2px]',
          muted ? 'text-text-faint' : 'text-purple',
        )}
        aria-hidden
      >
        <path
          d="M3 8.5l3.5 3.5 6.5-7"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span
        className={cn(
          'text-[14px] leading-[1.5] font-medium text-text',
          muted && 'text-text-muted font-normal',
        )}
      >
        {text}
      </span>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function WhyJimmy({ data }: { data: WhyData }) {
  const prefersReducedMotion = useReducedMotion()
  const [active, setActive] = useState<State>('without')

  // ── Height morphing ──────────────────────────────────────────────────────
  // The two states (description + bullets) have different heights. We stack
  // them, measure the active one, and animate the wrapper's height so the
  // section grows/shrinks smoothly instead of snapping.
  const withoutRef = useRef<HTMLDivElement>(null)
  const withRef = useRef<HTMLDivElement>(null)
  const [contentHeight, setContentHeight] = useState<number | undefined>(undefined)
  // Skip the very first height transition (mount should just settle silently).
  const mounted = useRef(false)
  useEffect(() => {
    mounted.current = true
  }, [])

  useIsoLayoutEffect(() => {
    const measure = () => {
      const el = active === 'without' ? withoutRef.current : withRef.current
      if (el) setContentHeight(el.offsetHeight)
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (withoutRef.current) ro.observe(withoutRef.current)
    if (withRef.current) ro.observe(withRef.current)
    return () => ro.disconnect()
  }, [active])

  // Curves: iOS-like drawer easing for the height morph; spring for the pill.
  const EASE_DRAWER = [0.32, 0.72, 0, 1] as const
  const heightTransition = {
    duration: prefersReducedMotion || !mounted.current ? 0 : 0.52,
    ease: EASE_DRAWER,
  }
  const indicatorTransition = prefersReducedMotion
    ? { duration: 0 }
    : { type: 'spring' as const, duration: 0.5, bounce: 0.18 }

  // External tools (without) merged with their Jimmy module (with).
  // Names/descriptions come from Sanity (preview.without.card1..4).
  const cardData = [
    data.preview?.without?.card1,
    data.preview?.without?.card2,
    data.preview?.without?.card3,
    data.preview?.without?.card4,
  ]
  const withModules = data.preview?.with?.modules ?? []
  const slots: Slot[] = TOOL_SLOTS.map((s, i) => ({
    ...s,
    name: cardData[i]?.name ?? '',
    desc: cardData[i]?.desc ?? '',
    jLabel: withModules[i]?.label ?? '',
    jSub: withModules[i]?.sub ?? '',
  }))

  const withoutBullets = data.bullets?.without ?? []
  const withBullets = data.bullets?.with ?? []

  // Framer-motion variants
  const riseVariants = {
    hidden: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.68, ease: [0.16, 1, 0.3, 1] as const },
    },
  }

  return (
    <section
      id="why-jimmy"
      aria-label={data.ariaLabel ?? ''}
      className="bg-bg border-t border-border py-[var(--section-pad-y)]"
    >
      <div className="max-w-[1200px] mx-auto px-[clamp(1rem,4vw,2.5rem)]">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-[clamp(2rem,5vw,5rem)] items-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.08 }}
          variants={riseVariants}
        >

          {/* ── LEFT: Preview card (chaos → organized Jimmy app) ── */}
          <div
            className={cn(
              'relative rounded-[24px] overflow-hidden border',
              'min-h-[520px]',
              'transition-colors duration-500',
              active === 'with'
                ? 'bg-purple-light/40 border-[rgba(138,50,224,0.18)]'
                : 'bg-surface-2 border-border',
              'shadow-[0_4px_32px_rgba(0,0,0,0.06),0_1px_4px_rgba(0,0,0,0.03)]',
            )}
          >
            <ToolsMorph
              active={active}
              slots={slots}
              withoutLabel={data.toggle?.without ?? ''}
              appName={data.preview?.with?.appName ?? ''}
              appTagline={data.preview?.with?.appTagline ?? ''}
              syncedLabel={data.preview?.with?.syncedLabel ?? ''}
              reduced={!!prefersReducedMotion}
            />
          </div>

          {/* ── RIGHT: Content ──────────────────────────────────── */}
          {/* @container: size the heading to the COLUMN width (cqi), not the
              viewport — so each line of the headline always fits on one line and
              the copy lands on the intended 2 lines regardless of breakpoint. */}
          <div className="@container flex flex-col">

            {/* Heading with inline logo mark */}
            <h2
              className={cn(
                'font-display font-extrabold text-text',
                'text-[clamp(1.8rem,7cqi,3.4rem)] leading-[1.06] tracking-[-0.035em]',
                'mb-7',
              )}
            >
              {data.heading?.line1}{' '}
              <Image
                src="/assets/logo/logo.svg"
                alt=""
                width={52}
                height={54}
                aria-hidden
                className={cn(
                  'inline-block align-[-0.22em] rounded-[0.24em]',
                  'w-[1.05em] h-[1.05em]',
                  'shadow-[0_4px_16px_rgba(138,50,224,0.34)]',
                  'mx-[0.08em]',
                )}
              />{' '}
              {data.heading?.line2}{' '}
              <br />
              <span className="whitespace-nowrap">
                {data.heading?.line3}{' '}
                <span className="text-purple">{data.heading?.accent}</span>
              </span>
            </h2>

            {/* Toggle pill — sliding indicator slides between the two options */}
            <div
              className={cn(
                'inline-flex items-center self-start',
                'bg-surface-2 border border-border rounded-full p-1 gap-0.5 mb-6',
              )}
              role="group"
              aria-label={data.toggle?.ariaLabel ?? ''}
            >
              {(['without', 'with'] as const).map((state) => {
                const isActive = active === state
                return (
                  <button
                    key={state}
                    onClick={() => setActive(state)}
                    aria-pressed={isActive}
                    className={cn(
                      'relative inline-flex items-center gap-1.5 rounded-full px-[18px] py-[9px]',
                      'max-sm:px-[14px] max-sm:py-2 max-sm:text-[13px]',
                      'font-body text-[14px] font-semibold whitespace-nowrap cursor-pointer',
                      'transition-colors duration-200',
                      isActive ? 'text-text' : 'text-text-muted hover:text-text',
                      'active:scale-[0.97] [transition:color_200ms,transform_140ms_ease-out]',
                    )}
                  >
                    {/* Sliding background — shared layoutId animates position */}
                    {isActive && (
                      <motion.span
                        layoutId="why-toggle-indicator"
                        transition={indicatorTransition}
                        aria-hidden
                        className={cn(
                          'absolute inset-0 -z-0 rounded-full bg-surface',
                          'shadow-[0_1px_6px_rgba(0,0,0,0.10),0_1px_2px_rgba(0,0,0,0.06)]',
                        )}
                      />
                    )}
                    <span className="relative z-10 inline-flex items-center gap-1.5">
                      {state === 'without' ? (
                        <svg
                          viewBox="0 0 16 16"
                          fill="none"
                          className="w-[13px] h-[13px] shrink-0"
                          aria-hidden
                        >
                          <path
                            d="M4 4l8 8M12 4l-8 8"
                            stroke="currentColor"
                            strokeWidth="1.75"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      ) : (
                        <svg
                          viewBox="0 0 16 16"
                          fill="none"
                          className="w-[13px] h-[13px] shrink-0"
                          aria-hidden
                        >
                          <path
                            d="M3 8.5l3.5 3.5 6.5-7"
                            stroke="currentColor"
                            strokeWidth="1.75"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                      {state === 'without' ? (data.toggle?.without ?? '') : (data.toggle?.with ?? '')}
                    </span>
                  </button>
                )
              })}
            </div>

            {/*
              Height-morphing content. Both states are stacked; the active one
              is in flow (relative), the other is taken out (absolute). The
              wrapper's height animates to the measured active height so the
              section grows/shrinks smoothly. overflow-hidden clips the taller
              state mid-morph. Each state crossfades with a slight rise + blur.
            */}
            <motion.div
              initial={false}
              animate={{ height: contentHeight ?? 'auto' }}
              transition={heightTransition}
              className="relative overflow-hidden"
            >
              {(['without', 'with'] as const).map((state) => {
                const isActive = active === state
                const bullets = state === 'without' ? withoutBullets : withBullets
                return (
                  <div
                    key={state}
                    ref={state === 'without' ? withoutRef : withRef}
                    aria-hidden={!isActive}
                    className={cn(
                      'top-0 left-0 w-full',
                      isActive ? 'relative' : 'absolute pointer-events-none',
                      'transition-[opacity,transform,filter] duration-[460ms]',
                      '[transition-timing-function:cubic-bezier(0.16,1,0.3,1)]',
                      isActive
                        ? 'opacity-100 translate-y-0 blur-0'
                        : 'opacity-0 translate-y-[10px] blur-[5px]',
                    )}
                  >
                    {/* Description */}
                    <p className="text-[15px] text-text-muted leading-[1.65] mb-7 max-w-[460px]">
                      {state === 'without' ? data.desc?.without : data.desc?.with}
                    </p>

                    {/* Dashed divider */}
                    <hr
                      className="border-none h-px mb-7"
                      style={{
                        background:
                          'repeating-linear-gradient(90deg, var(--color-border) 0, var(--color-border) 6px, transparent 6px, transparent 14px)',
                      }}
                    />

                    {/* Bullets grid */}
                    <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-x-8 gap-y-[1.1rem]">
                      {bullets.map((text, i) => (
                        <BulletItem
                          key={i}
                          text={text}
                          muted={state === 'without'}
                        />
                      ))}
                    </div>
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
