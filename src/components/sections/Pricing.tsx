'use client'

import { useReducedMotion, motion, AnimatePresence } from 'framer-motion'
import {
  useState,
  useCallback,
  useRef,
  useEffect,
  useLayoutEffect,
} from 'react'
import { Zap, ArrowRight, Lock, Users, Sparkles, Repeat } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PricingData, PricingPlansData } from '@/lib/content'

// useLayoutEffect on the client, useEffect on the server (avoids SSR warning).
const useIsoLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

// ── Pricing data ──────────────────────────────────────────────────────────────

type Currency = 'eur' | 'usd'

// Currency symbols (locale-independent). Client counts + prices come from
// Sanity (homePage.pricing.tiers), keyed by slider step.
const SYMBOLS: Record<Currency, string> = { eur: '€', usd: '$' }

function getFees(
  isFree: boolean,
  currency: Currency,
): { stripe: string; jimmy: string } {
  if (isFree) {
    return {
      stripe: currency === 'eur' ? 'Stripe 2.9% + €0.30' : 'Stripe 2.9% + $0.30',
      jimmy: 'Jimmy 5%',
    }
  }
  return {
    stripe: currency === 'eur' ? 'Stripe 1.4% + €0.25' : 'Stripe 1.4% + $0.25',
    jimmy: 'Jimmy 2.5%',
  }
}

// ── Slider thumb + track styles (injected once, idiomatic Tailwind can't do pseudo) ──

const SLIDER_STYLE = `
/* Registered so the fill + thumb position can be transitioned, not snapped. */
@property --pr-p {
  syntax: '<number>';
  inherits: true;
  initial-value: 0;
}
/* The transition lives on the wrapper; both the track fill and the custom
   thumb read the (animating) --pr-p, so they glide between steps together. */
.pr-track-wrap {
  position: relative;
  transition: --pr-p 0.34s cubic-bezier(0.32, 0.72, 0, 1);
}
.pr-slider {
  -webkit-appearance: none;
  appearance: none;
  display: block;
  position: relative;
  z-index: 1;
  width: 100%;
  height: 10px;
  border-radius: 9999px;
  background: linear-gradient(
    90deg,
    var(--color-purple) calc(14px + var(--pr-p) * (100% - 28px)),
    var(--color-surface-offset) calc(14px + var(--pr-p) * (100% - 28px))
  );
  outline: none;
  cursor: pointer;
}
/* Native thumb is kept (it drives drag/keyboard) but made invisible. */
.pr-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: transparent;
  border: none;
  box-shadow: none;
  cursor: grab;
}
.pr-slider::-webkit-slider-thumb:active { cursor: grabbing; }
.pr-slider::-moz-range-thumb {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: transparent;
  border: none;
  box-shadow: none;
  cursor: grab;
}
.pr-slider::-moz-range-track {
  height: 10px;
  border-radius: 9999px;
  background: transparent;
}
/* Custom visible thumb — its left is derived from the animating --pr-p. */
.pr-thumb {
  position: absolute;
  top: 50%;
  left: calc(14px + var(--pr-p) * (100% - 28px));
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #fff;
  border: 3px solid var(--color-purple);
  box-shadow: 0 4px 14px rgba(138,50,224,0.42), 0 0 0 6px rgba(138,50,224,0.12);
  transform: translate(-50%, -50%);
  transition: box-shadow 160ms, transform 120ms;
  pointer-events: none;
  z-index: 2;
}
@media (hover: hover) and (pointer: fine) {
  .pr-slider:hover ~ .pr-thumb {
    box-shadow: 0 4px 16px rgba(138,50,224,0.5), 0 0 0 9px rgba(138,50,224,0.14);
  }
}
.pr-slider:active ~ .pr-thumb {
  transform: translate(-50%, -50%) scale(1.08);
}
.pr-slider:focus-visible ~ .pr-thumb {
  box-shadow: 0 0 0 4px var(--color-bg), 0 0 0 7px var(--color-purple);
}
@keyframes prBump {
  0%   { transform: scale(1); }
  32%  { transform: scale(1.06); }
  100% { transform: scale(1); }
}
.pr-bump {
  animation: prBump 300ms cubic-bezier(0.16,1,0.3,1);
  transform-origin: left center;
}
`

// ── CheckIcon SVG (matches prototype's inline svg) ────────────────────────────

function CheckMark() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="w-[11px] h-[11px] stroke-[3]">
      <path d="M3 8.5l3.5 3.5 6.5-7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────

export function Pricing({ data, plans }: { data: PricingData; plans: PricingPlansData }) {
  const shouldReduceMotion = useReducedMotion()

  const [step, setStep] = useState(0) // default: 0 (Free)
  const [currency, setCurrency] = useState<Currency>('eur')
  const [bumpKey, setBumpKey] = useState(0)
  const prevStateRef = useRef({ step, currency })
  const sliderRef = useRef<HTMLInputElement>(null)
  const trackWrapRef = useRef<HTMLDivElement>(null)

  // ── Card height morphing ──────────────────────────────────────────────────
  // Crossing the FREE↔CLUB boundary adds/removes the beta badge, the struck-out
  // price and the lock note, which changes the card's height. We measure the
  // grid and animate a wrapper's height so the whole card resizes smoothly.
  const cardRef = useRef<HTMLDivElement>(null)
  const [cardHeight, setCardHeight] = useState<number | undefined>(undefined)
  const mounted = useRef(false)
  useEffect(() => {
    mounted.current = true
  }, [])

  useIsoLayoutEffect(() => {
    const measure = () => {
      if (cardRef.current) setCardHeight(cardRef.current.offsetHeight)
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (cardRef.current) ro.observe(cardRef.current)
    return () => ro.disconnect()
  }, [])

  // Inject slider pseudo-element styles once
  useEffect(() => {
    if (document.getElementById('pr-slider-style')) return
    const el = document.createElement('style')
    el.id = 'pr-slider-style'
    el.textContent = SLIDER_STYLE
    document.head.appendChild(el)
    return () => {
      // don't remove — harmless and avoids flicker on HMR
    }
  }, [])

  // Sync CSS custom property for track fill + thumb position. Set on the
  // wrapper (which carries the --pr-p transition) so the fill and the custom
  // thumb glide between steps instead of snapping.
  useEffect(() => {
    if (trackWrapRef.current) {
      trackWrapRef.current.style.setProperty('--pr-p', String(step / 5))
    }
  }, [step])

  const handleChange = useCallback(
    (nextStep: number, nextCurrency?: Currency) => {
      const nc = nextCurrency ?? currency
      const prev = prevStateRef.current
      const changed = nextStep !== prev.step || nc !== prev.currency
      if (changed && !shouldReduceMotion) {
        setBumpKey((k) => k + 1)
      }
      prevStateRef.current = { step: nextStep, currency: nc }
      setStep(nextStep)
      if (nextCurrency !== undefined) setCurrency(nextCurrency)
    },
    [currency, shouldReduceMotion],
  )

  // Derived state — tiers + discount come from the global pricingPlans singleton.
  const tiers = plans.tiers ?? []
  const discount = 1 - (plans.betaDiscountPct ?? 15) / 100
  const sym = SYMBOLS[currency]
  const priceOf = (i: number) =>
    currency === 'eur' ? tiers[i]?.priceEur ?? null : tiers[i]?.priceUsd ?? null
  const tier = tiers[step]
  const clientsCount = tier?.clients ?? ''
  const reg = priceOf(step)
  const isFree = reg === null
  const nowText = isFree ? `${sym}0` : `${sym}${(reg * discount).toFixed(2)}`
  const wasText = isFree ? null : `${sym}${reg}`
  // Tick axis: first marker is "0", remaining markers are the paid-tier client counts
  const tickLabels = ['0', ...tiers.slice(1).map((tr) => tr.clients ?? '')]
  const planLabel = isFree ? (data.planFree ?? '') : (data.planClub ?? '')
  const activeCard: 'free' | 'club' = isFree ? 'free' : 'club'
  const fees = getFees(isFree, currency)

  // Plan-card prices (synced to the slider). When the slider is on Free, the
  // CLUB card previews the entry CLUB tier (index 1).
  const clubIdx = isFree ? 1 : step
  const clubReg = priceOf(clubIdx)
  const freeCardAmt = `${sym}0`
  const clubCardAmt = clubReg != null ? `${sym}${(clubReg * discount).toFixed(2)}` : `${sym}0`
  const clubCardClients = tiers[clubIdx]?.clients ?? ''

  // Entrance animation config
  const fadeRise = {
    initial: shouldReduceMotion ? {} : { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
  }
  const easeOut = [0.16, 1, 0.3, 1] as const

  // Card height morph: skip the first run (mount should settle silently).
  const heightTransition = {
    duration: shouldReduceMotion || !mounted.current ? 0 : 0.5,
    ease: [0.32, 0.72, 0, 1] as const,
  }
  // Appear/disappear of the conditional (CLUB-only) bits.
  const appear = shouldReduceMotion
    ? { initial: false, animate: {}, exit: {} }
    : {
        initial: { opacity: 0, y: -4 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -4 },
      }

  return (
    <section
      id="pricing"
      aria-label={(data.sectionLabel ?? '')}
      className="relative overflow-hidden border-t border-border py-[var(--section-pad-y)] scroll-mt-20"
      style={{ background: 'var(--color-bg)' }}
    >
      {/* Radial glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 52% 44% at 50% -6%, rgba(138,50,224,0.11) 0%, transparent 70%)',
        }}
      />

      <div className="relative mx-auto max-w-[1080px] px-[clamp(1rem,4vw,2.5rem)]">

        {/* ── Promo pill ── */}
        <motion.div
          {...fadeRise}
          transition={{ duration: 0.64, ease: easeOut }}
          className="mx-auto mb-[clamp(1.5rem,3vw,2.1rem)] flex w-max max-w-full items-center gap-[11px] rounded-full border border-[var(--color-purple-border)] bg-surface px-[18px] py-[7px] pl-[8px] shadow-[0_4px_18px_rgba(138,50,224,0.08)] max-[540px]:flex-col max-[540px]:rounded-[18px] max-[540px]:px-[18px] max-[540px]:py-3 max-[540px]:gap-[7px] max-[540px]:text-center"
        >
          <span className="inline-flex items-center gap-[5px] rounded-full bg-purple px-[11px] py-[5px] text-[10.5px] font-extrabold uppercase tracking-[0.06em] text-white whitespace-nowrap">
            <Zap size={12} strokeWidth={1.75} />
            {(data.promoBadge ?? '')}
          </span>
          <span className="text-[13.5px] font-medium text-text">
            <strong className="font-bold">{(data.promoTextBold ?? '')}</strong>
            {' '}{(data.promoTextRest ?? '')}
          </span>
        </motion.div>

        {/* ── Header ── */}
        <motion.header
          {...fadeRise}
          transition={{ duration: 0.64, ease: easeOut, delay: 0.04 }}
          className="mx-auto mb-[clamp(2.2rem,4vw,3rem)] max-w-[660px] text-center"
        >
          <span className="mb-4 inline-flex items-center gap-[6px] text-[11px] font-bold uppercase tracking-[0.1em] text-purple before:h-[5px] before:w-[5px] before:rounded-full before:bg-purple before:content-['']">
            {(data.eyebrow ?? '')}
          </span>
          <h2 className="mb-[0.9rem] font-display text-[clamp(2rem,4vw,3.25rem)] font-extrabold leading-[1.05] tracking-[-0.035em] text-text [text-wrap:balance]">
            {(data.title ?? '')}
          </h2>
          <p className="text-[clamp(1rem,1.5vw,1.125rem)] leading-[1.6] text-text-muted [text-wrap:balance]">
            {(data.subtitle ?? '')}
          </p>
        </motion.header>

        {/* ── Interactive scaler ── */}
        <motion.div
          {...fadeRise}
          transition={{ duration: 0.72, ease: easeOut, delay: 0.08 }}
          className="relative"
        >
        <motion.div
          initial={false}
          animate={{ height: cardHeight ?? 'auto' }}
          transition={heightTransition}
          className="relative overflow-hidden rounded-[28px] border border-border bg-surface shadow-[0_34px_90px_-44px_rgba(26,25,23,0.3),0_2px_10px_rgba(26,25,23,0.04)]"
        >
        <div
          ref={cardRef}
          className="grid grid-cols-[1.12fr_0.88fr] max-[820px]:grid-cols-1"
        >
          {/* Left: control */}
          <div className="flex flex-col p-[clamp(1.9rem,3vw,2.9rem)]">
            {/* Head row */}
            <div className="mb-[clamp(2.2rem,4vw,3rem)] flex flex-wrap items-start justify-between gap-[16px_18px]">
              <div className="min-w-0 flex-[1_1_220px]">
                <div className="mb-[0.4rem] font-display text-[clamp(1.2rem,1.9vw,1.5rem)] font-bold leading-[1.2] tracking-[-0.02em] text-text">
                  {(data.sliderQuestion ?? '')}
                </div>
                <p className="text-[13.5px] text-text-muted">{(data.sliderHelp ?? '')}</p>
              </div>

              {/* Currency switcher */}
              <div
                role="group"
                aria-label={(data.currencyLabel ?? '')}
                className="inline-flex shrink-0 rounded-full border border-border bg-surface-2 p-[3px]"
              >
                {(['eur', 'usd'] as Currency[]).map((cur) => (
                  <button
                    key={cur}
                    type="button"
                    onClick={() => handleChange(step, cur)}
                    className={cn(
                      'whitespace-nowrap rounded-full px-[13px] py-[6px] font-body text-[12.5px] font-bold transition-[background,color] duration-[160ms] cursor-pointer border-0',
                      currency === cur
                        ? 'bg-purple text-white'
                        : 'bg-transparent text-text-muted hover:text-text',
                    )}
                    aria-pressed={currency === cur}
                  >
                    {cur === 'eur' ? '€ EUR' : '$ USD'}
                  </button>
                ))}
              </div>
            </div>

            {/* Slider */}
            <div className="mt-auto">
              <div ref={trackWrapRef} className="pr-track-wrap">
                <input
                  ref={sliderRef}
                  type="range"
                  className="pr-slider"
                  id="pr-slider"
                  min={0}
                  max={5}
                  step={1}
                  value={step}
                  aria-label={(data.sliderAriaLabel ?? '')}
                  aria-valuetext={`${clientsCount} ${(data.clients ?? '')} — ${planLabel}`}
                  onChange={(e) => handleChange(parseInt(e.target.value, 10))}
                />
                {/* Custom thumb (glides via the animated --pr-p variable) */}
                <span aria-hidden="true" className="pr-thumb" />
              </div>

              {/* Tick marks */}
              <div className="relative mt-[14px] h-[30px]">
                {tickLabels.map((label, i) => {
                  const isActive = i === step
                  const leftStyle: Record<number, string> = {
                    0: '14px',
                    1: 'calc(14px + 0.2 * (100% - 28px))',
                    2: 'calc(14px + 0.4 * (100% - 28px))',
                    3: 'calc(14px + 0.6 * (100% - 28px))',
                    4: 'calc(14px + 0.8 * (100% - 28px))',
                    5: 'calc(100% - 14px)',
                  }
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => handleChange(i)}
                      style={{ left: leftStyle[i] }}
                      className={cn(
                        'absolute top-0 -translate-x-1/2 cursor-pointer whitespace-nowrap border-0 bg-transparent pt-[12px] text-[12px] font-semibold transition-colors duration-[160ms]',
                        'before:absolute before:left-1/2 before:top-0 before:h-[6px] before:w-[2px] before:-translate-x-1/2 before:rounded-[2px] before:transition-[background] before:duration-[160ms] before:content-[""]',
                        isActive
                          ? 'text-purple before:bg-purple'
                          : 'text-text-faint before:bg-border',
                      )}
                      aria-label={`${label} ${(data.clients ?? '')}`}
                    >
                      {label}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Right: result panel */}
          <div
            className="relative flex flex-col border-l border-border p-[clamp(1.9rem,3vw,2.7rem)] max-[820px]:border-l-0 max-[820px]:border-t"
            style={{
              background: 'linear-gradient(165deg, #F4ECFF 0%, #FBF8FF 58%, var(--color-surface) 100%)',
            }}
          >
            {/* Plan name + beta badge */}
            <div className="mb-4 flex min-h-[22px] items-center gap-[9px]">
              <span className="font-display text-[13px] font-extrabold uppercase tracking-[0.12em] text-purple">
                {planLabel}
              </span>
              <AnimatePresence initial={false}>
                {!isFree && (
                  <motion.span
                    key="beta-badge"
                    initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.7 }}
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : { type: 'spring', duration: 0.4, bounce: 0.34 }
                    }
                    className="origin-left rounded-full bg-purple px-[9px] py-[4px] text-[10px] font-extrabold uppercase tracking-[0.05em] text-white"
                  >
                    {(data.betaBadge ?? '')}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            {/* Price */}
            <div className="mb-[0.35rem] flex flex-nowrap items-center gap-3">
              <span
                key={bumpKey}
                className={cn(
                  'font-display text-[clamp(2.6rem,5vw,3.7rem)] font-extrabold leading-[0.95] tracking-[-0.04em] text-text tabular-nums whitespace-nowrap',
                  !shouldReduceMotion && bumpKey > 0 && 'pr-bump',
                )}
              >
                {nowText}
              </span>
              <div className="flex min-w-0 flex-col items-start justify-center gap-[2px]">
                <AnimatePresence initial={false}>
                  {wasText && (
                    <motion.span
                      key="was-price"
                      initial={shouldReduceMotion ? false : { opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={shouldReduceMotion ? undefined : { opacity: 0, x: -6 }}
                      transition={
                        shouldReduceMotion
                          ? { duration: 0 }
                          : { duration: 0.26, ease: easeOut }
                      }
                      className="text-[17px] font-semibold leading-[1.1] text-text-faint line-through tabular-nums"
                    >
                      {wasText}
                    </motion.span>
                  )}
                </AnimatePresence>
                <span className="text-[15px] font-semibold leading-[1.1] text-text-muted">
                  {(data.perMonth ?? '')}
                </span>
              </div>
            </div>

            {/* Sub line */}
            <div className="mb-[1.3rem] text-[14px] text-text-muted">
              {(data.forUpTo ?? '')}{' '}
              <span className="relative inline-flex overflow-hidden align-bottom tabular-nums">
                {shouldReduceMotion ? (
                  clientsCount
                ) : (
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={clientsCount}
                      initial={{ opacity: 0, y: '0.7em' }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: '-0.7em' }}
                      transition={{ duration: 0.24, ease: easeOut }}
                      className="inline-block font-semibold text-text"
                    >
                      {clientsCount}
                    </motion.span>
                  </AnimatePresence>
                )}
              </span>{' '}
              {(data.clients ?? '')}
            </div>

            {/* Fees */}
            <div className="mb-[1.4rem] border-b border-[var(--color-divider)] border-t py-3 text-[12.5px] leading-[1.5] text-text-muted">
              {(data.feesLabel ?? '')}{' '}
              <strong className="font-bold text-text">{fees.stripe}</strong>
              {' · '}
              <strong className="font-bold text-text">{fees.jimmy}</strong>
            </div>

            {/* CTA */}
            <button
              type="button"
              className="mt-auto inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border-0 bg-purple px-[22px] py-[15px] font-body text-[15px] font-bold text-white shadow-[0_12px_28px_-8px_rgba(138,50,224,0.6)] transition-[background,box-shadow,transform] duration-[180ms] hover:bg-purple-hover hover:shadow-[0_14px_34px_-8px_rgba(138,50,224,0.72)] active:translate-y-px"
            >
              <span>{isFree ? (data.ctaFree ?? '') : (data.ctaClub ?? '')}</span>
              <ArrowRight size={17} strokeWidth={1.75} />
            </button>

            {/* Lock note */}
            <AnimatePresence initial={false}>
              {!isFree && (
                <motion.p
                  key="lock-note"
                  {...appear}
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : { duration: 0.28, ease: easeOut }
                  }
                  className="mt-3 flex items-start gap-[7px] text-[11.5px] leading-[1.5] text-text-muted"
                >
                  <Lock size={13} strokeWidth={1.75} className="mt-[2px] shrink-0 text-purple" />
                  <span>{(data.lockNote ?? '')}</span>
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
        </motion.div>
        </motion.div>

        {/* ── What's included ── */}
        <div className="mt-[clamp(2.4rem,5vw,3.4rem)] mb-[1.4rem] text-center">
          <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-text-faint">
            {(data.whatsIncluded ?? '')}
          </span>
        </div>

        <motion.div
          {...fadeRise}
          transition={{ duration: 0.64, ease: easeOut, delay: 0.12 }}
          className="grid grid-cols-2 gap-[clamp(1rem,2vw,1.5rem)] max-[680px]:mx-auto max-[680px]:max-w-[440px] max-[680px]:grid-cols-1"
        >
          {/* Free card */}
          <PlanCard
            name={data.planFree ?? ''}
            tag={data.freeTag ?? ''}
            amt={freeCardAmt}
            per={data.freePerLabel ?? ''}
            ctaLabel={data.ctaFree ?? ''}
            isClub={false}
            isActive={activeCard === 'free'}
          >
            {(data.freeFeatures ?? []).map((text, i) => (
              <FeatureRow key={i} text={text} isClub={false} />
            ))}
          </PlanCard>

          {/* Club card */}
          <PlanCard
            name={data.planClub ?? ''}
            tag={data.clubTag ?? ''}
            amt={clubCardAmt}
            per={`${data.clubPerPrefix ?? ''} ${clubCardClients}`.trim()}
            popular={data.popularLabel ?? undefined}
            ctaLabel={data.ctaClub ?? ''}
            isClub
            isActive={activeCard === 'club'}
          >
            {(data.clubFeatures ?? []).map((text, i) => (
              <FeatureRow key={i} text={text} isClub lead={i === 0} />
            ))}
          </PlanCard>
        </motion.div>

        {/* ── Add-ons ── */}
        <motion.div
          {...fadeRise}
          transition={{ duration: 0.64, ease: easeOut, delay: 0.16 }}
          className="mt-[clamp(2.2rem,4vw,3.2rem)]"
        >
          <div className="mb-[1.3rem] text-center">
            <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-text-faint">
              {data.addonsLabel}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-[14px] max-[680px]:mx-auto max-[680px]:max-w-[440px] max-[680px]:grid-cols-1">
            <AddonCard
              icon={<Users size={20} strokeWidth={1.75} />}
              name={data.addons?.[0]?.name ?? ''}
              price={data.addons?.[0]?.price ?? ''}
            />
            <AddonCard
              icon={<Sparkles size={20} strokeWidth={1.75} />}
              name={data.addons?.[1]?.name ?? ''}
              price={data.addons?.[1]?.price ?? ''}
            />
            <AddonCard
              icon={<Repeat size={20} strokeWidth={1.75} />}
              name={data.addons?.[2]?.name ?? ''}
              price={data.addons?.[2]?.price ?? ''}
            />
          </div>
        </motion.div>

      </div>
    </section>
  )
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function PlanCard({
  name,
  tag,
  amt,
  per,
  popular,
  ctaLabel,
  isClub,
  isActive,
  children,
}: {
  name: string
  tag: string
  amt: string
  per: string
  popular?: string
  ctaLabel: string
  isClub: boolean
  isActive: boolean
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        'relative flex flex-col rounded-[22px] border bg-surface p-[clamp(1.5rem,2.4vw,2rem)] transition-[border-color,box-shadow,transform] duration-[220ms]',
        isClub
          ? 'border-[rgba(138,50,224,0.4)] shadow-[0_18px_50px_-30px_rgba(138,50,224,0.4)]'
          : 'border-border',
        isActive && isClub && '-translate-y-[2px] shadow-[0_22px_56px_-28px_rgba(138,50,224,0.5)]',
        isActive && !isClub && '-translate-y-[2px] border-[rgba(138,50,224,0.4)] shadow-[0_18px_50px_-30px_rgba(138,50,224,0.4)]',
      )}
    >
      {/* Name + (optional) "Most popular" badge */}
      <div className="mb-[0.6rem] flex items-center justify-between gap-2">
        <div
          className={cn(
            'font-display text-[14px] font-extrabold uppercase tracking-[0.1em]',
            isClub ? 'text-purple' : 'text-text-muted',
          )}
        >
          {name}
        </div>
        {popular && (
          <span className="rounded-full border border-purple-border bg-purple-light px-[10px] py-[4px] text-[10px] font-extrabold uppercase tracking-[0.06em] text-purple">
            {popular}
          </span>
        )}
      </div>

      {/* Price (synced to the slider) */}
      <div className="mb-[0.45rem] flex items-baseline gap-[6px]">
        <span className="font-display text-[2.4rem] font-extrabold leading-none tracking-[-0.04em] text-text tabular-nums">
          {amt}
        </span>
        <span className="text-[14px] font-semibold text-text-muted">{per}</span>
      </div>

      <p className="mb-[1.2rem] border-b border-[var(--color-divider)] pb-[1.2rem] text-[14px] leading-[1.5] text-text-muted">
        {tag}
      </p>
      <ul className="flex list-none flex-col gap-[11px]">{children}</ul>

      {/* Per-card CTA — wrapper pushes it to the bottom so both align */}
      <div className="mt-auto pt-[26px]">
        <a
          href="#"
          className={cn(
            'inline-flex w-full items-center justify-center gap-[7px] rounded-full px-[22px] py-[13px] text-[14.5px] font-semibold',
            'transition-[background,border-color,box-shadow] duration-200',
            isClub
              ? 'border border-purple bg-purple text-white hover:bg-purple-hover hover:shadow-[0_0_24px_rgba(138,50,224,0.4)]'
              : 'border border-ghost-border bg-surface text-text hover:bg-ghost-hover hover:border-ghost-border-h',
          )}
        >
          {ctaLabel}
        </a>
      </div>
    </div>
  )
}

function FeatureRow({
  text,
  isClub,
  lead = false,
}: {
  text: string
  isClub: boolean
  lead?: boolean
}) {
  return (
    <li
      className={cn(
        'flex items-center gap-[11px] text-[14px]',
        lead ? 'font-semibold text-text-muted' : 'text-text',
      )}
    >
      <span
        className={cn(
          'flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-full',
          isClub
            ? 'bg-purple text-white'
            : 'bg-[rgba(138,50,224,0.12)] text-purple',
        )}
      >
        <CheckMark />
      </span>
      {text}
    </li>
  )
}

function AddonCard({
  icon,
  name,
  price,
}: {
  icon: React.ReactNode
  name: string
  price: string
}) {
  return (
    <div className="flex items-center gap-[14px] rounded-[16px] border border-border bg-surface px-[18px] py-[16px] transition-[border-color,box-shadow,transform] duration-[180ms] hover:-translate-y-[2px] hover:border-[rgba(138,50,224,0.35)] hover:shadow-[0_8px_24px_rgba(138,50,224,0.09)]">
      <div className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-[12px] bg-[rgba(138,50,224,0.1)] text-purple">
        {icon}
      </div>
      <div>
        <div className="mb-[2px] text-[14px] font-bold text-text">{name}</div>
        <div className="text-[12.5px] font-medium text-text-muted">{price}</div>
      </div>
    </div>
  )
}
