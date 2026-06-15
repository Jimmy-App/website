'use client'

import Image from 'next/image'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { WhyData } from '@/lib/content'

// useLayoutEffect on the client, useEffect on the server (avoids SSR warning).
const useIsoLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

// ── Types ─────────────────────────────────────────────────────────────────────

type State = 'without' | 'with'

// ── Sub-components ────────────────────────────────────────────────────────────

/** Small pill badge displayed inside the preview card */
function PreviewTab({
  variant,
  label,
}: {
  variant: 'without' | 'with'
  label: string
}) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-[7px] self-start shrink-0',
        'bg-surface border border-border rounded-full px-[14px] py-[7px]',
        'font-body text-[13px] font-semibold mb-5',
        'shadow-[0_1px_4px_rgba(0,0,0,0.06)]',
        variant === 'without' ? 'text-text-muted' : 'text-purple',
      )}
    >
      {variant === 'without' ? (
        // X icon
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
        // Check icon
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
      {label}
    </div>
  )
}

// ── Tool card data type ───────────────────────────────────────────────────────

type ToolCardData = {
  emoji: string
  bg: string
  name: string
  desc: string
}

function ToolCard({ emoji, bg, name, desc }: ToolCardData) {
  return (
    <div
      className={cn(
        'bg-surface border border-border rounded-[14px] p-[0.8rem_0.9rem]',
        'flex items-start gap-[11px]',
        'shadow-[0_1px_3px_rgba(0,0,0,0.04)]',
      )}
    >
      <div
        className="w-[38px] h-[38px] rounded-[9px] shrink-0 flex items-center justify-center text-[19px]"
        style={{ background: bg }}
        aria-hidden
      >
        {emoji}
      </div>
      <div>
        <div className="text-[13px] font-semibold text-text mb-[2px]">{name}</div>
        <div className="text-[11.5px] text-text-muted leading-[1.4]">{desc}</div>
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

  // Tool cards for the "without" preview
  const toolCards: ToolCardData[] = [
    {
      emoji: '💬',
      bg: '#E8F5E9',
      name: data.preview?.without?.card1?.name ?? '',
      desc: data.preview?.without?.card1?.desc ?? '',
    },
    {
      emoji: '📊',
      bg: '#E3F2FD',
      name: data.preview?.without?.card2?.name ?? '',
      desc: data.preview?.without?.card2?.desc ?? '',
    },
    {
      emoji: '💳',
      bg: '#FFF8E1',
      name: data.preview?.without?.card3?.name ?? '',
      desc: data.preview?.without?.card3?.desc ?? '',
    },
    {
      emoji: '📅',
      bg: '#FCE4EC',
      name: data.preview?.without?.card4?.name ?? '',
      desc: data.preview?.without?.card4?.desc ?? '',
    },
  ]

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

          {/* ── LEFT: Preview card ──────────────────────────────── */}
          <div
            className={cn(
              'relative bg-surface-2 border border-border rounded-[24px] overflow-hidden',
              'min-h-[560px] max-lg:min-h-[420px]',
              'shadow-[0_4px_32px_rgba(0,0,0,0.06),0_1px_4px_rgba(0,0,0,0.03)]',
            )}
          >
            {/* Without state */}
            <div
              className={cn(
                'absolute inset-0 p-7 flex flex-col',
                'transition-[opacity,transform,filter] duration-[460ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]',
                active === 'without'
                  ? 'opacity-100 scale-100 blur-0 pointer-events-auto'
                  : 'opacity-0 scale-[0.98] blur-[6px] pointer-events-none',
              )}
              aria-hidden={active !== 'without'}
            >
              <PreviewTab
                variant="without"
                label={data.toggle?.without ?? ''}
              />
              <div className="flex flex-col gap-[0.55rem]">
                {toolCards.map((card, i) => (
                  <ToolCard key={i} {...card} />
                ))}
              </div>
            </div>

            {/* With state */}
            <div
              className={cn(
                'absolute inset-0 p-7 flex flex-col',
                'transition-[opacity,transform,filter] duration-[460ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]',
                active === 'with'
                  ? 'opacity-100 scale-100 blur-0 pointer-events-auto'
                  : 'opacity-0 scale-[0.98] blur-[6px] pointer-events-none',
              )}
              aria-hidden={active !== 'with'}
            >
              <PreviewTab variant="with" label={data.toggle?.with ?? ''} />
              <div className="flex-1 rounded-[12px] overflow-hidden border border-border bg-surface min-h-0">
                <Image
                  src="/assets/screens/dashboard.png"
                  alt={data.preview?.with?.imgAlt ?? ''}
                  width={780}
                  height={520}
                  className="w-full h-full object-cover object-top-left block"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* ── RIGHT: Content ──────────────────────────────────── */}
          <div className="flex flex-col">

            {/* Heading with inline logo mark */}
            <h2
              className={cn(
                'font-display font-extrabold text-text',
                'text-[clamp(2.25rem,4vw,3.5rem)] leading-[1.06] tracking-[-0.035em]',
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
