'use client'

import { useReducedMotion, m as motion, AnimatePresence } from 'framer-motion'
import { useState, useCallback, useRef, useEffect } from 'react'
import { Zap, ArrowRight, Users, Sparkles, Repeat } from 'lucide-react'
import { cn } from '@/lib/utils'
import { appRegisterUrl } from '@/lib/appUrl'
import { Button } from '@/components/ui/Button'
import type { PricingData, PricingPlansData } from '@/lib/content'

// ── Pricing data ──────────────────────────────────────────────────────────────

type Currency = 'eur' | 'usd'
type Billing = 'monthly' | 'annual'

// Currency symbols (locale-independent). Client counts + prices come from
// Sanity (homePage.pricing.tiers), keyed by slider step.
const SYMBOLS: Record<Currency, string> = { eur: '€', usd: '$' }

// Fallbacks when the Sanity fields are empty (match the values seeded there).
const DEFAULT_FEES = {
  free: { stripePctEur: 2.9, stripePctUsd: 2.9, stripeFixedEur: 0.3, stripeFixedUsd: 0.3, jimmyPct: 5 },
  club: { stripePctEur: 1.4, stripePctUsd: 1.4, stripeFixedEur: 0.25, stripeFixedUsd: 0.25, jimmyPct: 1 },
}

function getFees(
  isFree: boolean,
  currency: Currency,
  plans: PricingPlansData,
): { stripe: string; jimmy: string } {
  const fromSanity = isFree ? plans.feesFree : plans.feesClub
  const defaults = isFree ? DEFAULT_FEES.free : DEFAULT_FEES.club
  const jimmyPct = fromSanity?.jimmyPct ?? defaults.jimmyPct
  const pct =
    currency === 'eur'
      ? fromSanity?.stripePctEur ?? defaults.stripePctEur
      : fromSanity?.stripePctUsd ?? defaults.stripePctUsd
  const fixed =
    currency === 'eur'
      ? fromSanity?.stripeFixedEur ?? defaults.stripeFixedEur
      : fromSanity?.stripeFixedUsd ?? defaults.stripeFixedUsd
  return {
    stripe: `Stripe ${pct}% + ${SYMBOLS[currency]}${fixed.toFixed(2)}`,
    jimmy: `Jimmy ${jimmyPct}%`,
  }
}

/**
 * Fill {pct} / {annual} / {beta} in CMS copy from the pricing data.
 *
 * The rates live in the pricingPlans singleton, so a sentence must never spell
 * one out — otherwise changing the fee in Sanity silently leaves the prose
 * quoting the old number, in three locales.
 */
function interp(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (whole, key: string) =>
    key in values ? String(values[key]) : whole,
  )
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

export function Pricing({
  data,
  plans,
  page = false,
}: {
  data: PricingData
  plans: PricingPlansData
  /** When true, render as a standalone page hero: clear the fixed navbar and drop the top border. */
  page?: boolean
}) {
  const shouldReduceMotion = useReducedMotion()

  const [step, setStep] = useState(0) // default: 0 (Free)
  const [currency, setCurrency] = useState<Currency>('eur')
  const [billing, setBilling] = useState<Billing>('monthly')
  const [bumpKey, setBumpKey] = useState(0)
  const prevStateRef = useRef({ step, currency })
  const sliderRef = useRef<HTMLInputElement>(null)
  const trackWrapRef = useRef<HTMLDivElement>(null)

  // The card used to measure and animate its own height, because crossing the
  // FREE↔CLUB boundary added rows and resized it. The rows that appear only on
  // paid tiers now reserve their space instead, so the height is constant and
  // there is nothing to measure.

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

  const handleBilling = useCallback(
    (next: Billing) => {
      setBilling((prev) => {
        if (prev !== next && !shouldReduceMotion) setBumpKey((k) => k + 1)
        return next
      })
    },
    [shouldReduceMotion],
  )

  // Derived state — tiers + discounts come from the global pricingPlans singleton.
  const tiers = plans.tiers ?? []
  const betaPct = plans.betaDiscountPct ?? 15
  const annualPct = plans.annualDiscountPct ?? 20

  // The two offers do not stack — whichever saves more is the one shown, which
  // is what the small print promises ("best offer applies automatically").
  // Paying yearly currently wins, so the beta badge steps aside in that view.
  const isAnnual = billing === 'annual'
  const appliedPct = isAnnual ? Math.max(annualPct, betaPct) : betaPct
  const betaWins = appliedPct === betaPct && (!isAnnual || betaPct >= annualPct)
  const discount = 1 - appliedPct / 100
  const sym = SYMBOLS[currency]
  /** List price per month, before any discount. */
  const priceOf = (i: number) =>
    currency === 'eur' ? tiers[i]?.priceEur ?? null : tiers[i]?.priceUsd ?? null

  /**
   * Monthly-equivalent when billing yearly. Entered per tier in Sanity, because
   * annual pricing is a commercial call — deriving it from a percentage cannot
   * be tuned per tier and lands on figures like €39.17. Falls back to the
   * percentage only while the fields are still empty.
   */
  const annualPriceOf = (i: number) => {
    const explicit =
      currency === 'eur' ? tiers[i]?.priceEurAnnual : tiers[i]?.priceUsdAnnual
    if (explicit != null) return explicit
    const list = priceOf(i)
    return list == null ? null : Math.round(list * (1 - annualPct / 100) * 100) / 100
  }

  const tier = tiers[step]
  const clientsCount = tier?.clients ?? ''
  /**
   * The top stop is a word ("unlimited"), not a number, so "for up to unlimited
   * clients" would read wrong — it gets its own line of copy.
   */
  const isCountTier = /^\d+$/.test(clientsCount.trim())
  const reg = priceOf(step)
  const isFree = reg === null
  const annualPrice = isAnnual && !isFree ? annualPriceOf(step) : null
  const effective = annualPrice ?? (isFree ? 0 : reg * discount)
  const nowText = isFree ? `${sym}0` : `${sym}${effective.toFixed(2)}`
  const wasText = isFree ? null : `${sym}${reg}`

  /**
   * Yearly saving against the list price — the coach's answer to "why commit
   * for a year". Measured against the list rather than the beta rate because
   * the list is what the annual price is set against.
   */
  const annualSaving =
    annualPrice != null && reg != null ? Math.round((reg - annualPrice) * 12) : null
  // Tick axis: first marker is "0", remaining markers are the paid-tier client counts
  const tickLabels = ['0', ...tiers.slice(1).map((tr) => tr.clients ?? '')]
  const planLabel = isFree ? (data.planFree ?? '') : (data.planClub ?? '')
  const fees = getFees(isFree, currency, plans)

  // Jimmy fee % for BOTH plans (not just the active one) so the incentive strip
  // can always show the Free→Club delta. Numbers come from the pricingPlans data
  // (fallback to defaults) — the copy stays number-free, so they never drift.
  const freeJimmyPct = plans.feesFree?.jimmyPct ?? DEFAULT_FEES.free.jimmyPct
  const clubJimmyPct = plans.feesClub?.jimmyPct ?? DEFAULT_FEES.club.jimmyPct
  // data.feeSaveFree / feeSaveClub are no longer rendered: the Free→Club fee
  // nudge pill gave way to the payments sentence. The fields stay in Sanity so
  // the copy is not lost if the nudge comes back.

  // Entrance animation config
  const fadeRise = {
    initial: shouldReduceMotion ? {} : { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
  }
  const easeOut = [0.16, 1, 0.3, 1] as const

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
      className={cn(
        'relative overflow-hidden scroll-mt-20 pb-[var(--section-pad-y)]',
        page
          ? 'pt-[calc(var(--navbar-height)+clamp(1.5rem,5vw,3rem))]'
          : 'border-t border-border pt-[var(--section-pad-y)]',
      )}
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

        {/* ── One plan, priced by roster ─────────────────────────────────────
            Everything lives in a single card now: the size you pick, what it
            costs, and the fact that the feature set never changes. The old
            layout split that across a two-column card, a benefits band and a
            Free-vs-Club comparison, which implied the plans differ. They do
            not — only the client limit does. */}
        <motion.div
          {...fadeRise}
          transition={{ duration: 0.72, ease: easeOut, delay: 0.04 }}
          className="mx-auto max-w-[1000px] overflow-hidden rounded-[clamp(20px,2.4vw,28px)] border border-border bg-surface shadow-[0_18px_50px_-30px_rgba(26,25,23,0.28)]"
        >
          <div className="p-[clamp(1.35rem,3.6vw,2.6rem)]">
            {/* Head: the promise, and the currency it is priced in */}
            {/* No wrapping: the currency switch belongs in the top-right
                corner at every width. Given a flex-basis it dropped below the
                heading on phones — flex-1 with min-w-0 lets the title wrap
                instead, which is what should give. */}
            {/* Only the heading shares a row with the switch. The subtitle sits
                below on the full width — keeping it in the heading's column
                squeezed it into 207px on a phone and wrapped it needlessly.
                No text-wrap:balance either: it evens out line lengths, which
                left ragged lines with empty space beside them. */}
            <div className="flex items-start justify-between gap-[14px]">
              <h2 className="min-w-0 flex-1 font-display text-[clamp(1.6rem,3.4vw,2.5rem)] font-extrabold leading-[1.06] tracking-[-0.035em] text-text">
                {(data.title ?? '')}
              </h2>

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
                    <span className="max-[420px]:hidden">{cur === 'eur' ? '€ EUR' : '$ USD'}</span>
                    <span className="min-[421px]:hidden">{cur === 'eur' ? '€' : '$'}</span>
                  </button>
                ))}
              </div>
            </div>

            <p className="mt-[0.6rem] text-[clamp(0.9rem,1.35vw,1.0625rem)] leading-[1.55] text-text-muted">
              {(data.sliderHelp ?? data.subtitle ?? '')}
            </p>

            {/* Billing period. Full-width segmented control, so the cheaper
                option is not hidden behind a small toggle. */}
            <div
              role="radiogroup"
              aria-label={(data.billingMonthly ?? 'Monthly') + ' / ' + (data.billingAnnual ?? 'Annual')}
              className="mt-[clamp(1.5rem,2.8vw,2rem)] grid grid-cols-2 gap-[3px] rounded-full bg-surface-2 p-[3px]"
            >
              {(['monthly', 'annual'] as Billing[]).map((b) => {
                const active = billing === b
                return (
                  <button
                    key={b}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => handleBilling(b)}
                    className={cn(
                      // min-h keeps the tap target at 44px on phones.
                      'inline-flex min-h-[44px] cursor-pointer items-center justify-center rounded-full border-0 px-3 font-body text-[13px] font-bold transition-[background,color] duration-[180ms] [transition-timing-function:var(--ease-out)]',
                      active
                        ? 'bg-purple text-white shadow-[0_6px_18px_-8px_rgba(138,50,224,0.6)]'
                        : 'bg-transparent text-text-muted hover:text-text',
                    )}
                  >
                    {b === 'monthly'
                      ? (data.billingMonthly ?? 'Monthly')
                      : (data.billingAnnual ?? `Annual · save ${annualPct}%`)}
                  </button>
                )
              })}
            </div>

            {/* Roster size */}
            <div className="mt-[clamp(1.5rem,2.8vw,2rem)]">
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
                      {/^\d+$/.test(label.trim()) ? (
                        label
                      ) : (
                        <>
                          {/* "unlimited" does not fit under the last tick on a
                              phone — the symbol carries the same meaning. */}
                          <span className="max-[520px]:hidden">{label}</span>
                          <span className="min-[521px]:hidden" aria-hidden>∞</span>
                        </>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* What that size costs. Heights are fixed on the rows that only
                exist for paid tiers, so dragging the slider never resizes the
                card or shifts the CTA out from under the cursor. */}
            <div className="mt-[clamp(1.5rem,2.8vw,2.1rem)] rounded-[clamp(15px,1.8vw,20px)] bg-surface-2 p-[clamp(1.05rem,2.4vw,1.6rem)]">
              {/* Explicit column → row rather than flex-wrap: wrapping left a
                  dead gap between the price and the button on phones. */}
              <div className="flex flex-col gap-[clamp(0.9rem,2vw,1.25rem)] min-[561px]:flex-row min-[561px]:items-center min-[561px]:justify-between">
                <div className="min-w-0">
                  {/* min-h holds the badge's height whether or not it is there,
                      so switching to annual does not push the price down. */}
                  <div className="flex min-h-[24px] flex-wrap items-center gap-x-[10px] gap-y-[6px]">
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-purple">
                      {isCountTier
                        ? `${data.forUpTo ?? ''} ${clientsCount} ${data.clients ?? ''}`
                        : (data.forUnlimited ?? 'for unlimited clients')}
                    </p>
                    {/* What committing for a year is worth, in money rather
                        than a percentage — "save 20%" is on the switch already. */}
                    {annualSaving != null && annualSaving > 0 && (
                      <span className="inline-flex items-center rounded-full bg-purple px-[10px] py-[4px] text-[11px] font-bold text-white">
                        {interp(data.annualSaveBadge ?? 'Save {amount}/year', {
                          amount: `${sym}${annualSaving}`,
                        })}
                      </span>
                    )}
                  </div>

                  {/* One line, always. The annual suffix is long enough that a
                      wrap here changed the panel's height between billing
                      periods — the type is sized so the widest case (longest
                      price + annual suffix + old price) still fits. */}
                  <div className="mt-[7px] flex min-h-[46px] items-baseline gap-x-[9px]">
                    <span
                      key={bumpKey}
                      className={cn(
                        'font-display text-[clamp(2rem,4.4vw,2.9rem)] font-extrabold leading-none tracking-[-0.04em] text-text tabular-nums',
                        !shouldReduceMotion && 'motion-safe:animate-[pr-bump_0.34s_cubic-bezier(0.32,0.72,0,1)]',
                      )}
                    >
                      {nowText}
                    </span>
                    <span className="text-[clamp(0.8rem,1.05vw,0.95rem)] font-medium leading-[1.3] text-text-muted">
                      {isAnnual && !isFree
                        ? (data.perMonthAnnual ?? '/month, billed annually')
                        : (data.perMonth ?? '')}
                    </span>
                    {/* The price being replaced sits after the suffix, so the
                        line reads "€23.20 per month, billed annually — was €49"
                        rather than opening on a number that is not the offer. */}
                    {!isFree && (
                      <span className="whitespace-nowrap text-[clamp(0.9rem,1.15vw,1.05rem)] font-semibold text-[var(--color-price-was)] line-through tabular-nums">
                        {wasText}
                      </span>
                    )}
                  </div>

                  {/* Beta badge: paid, monthly-winning tiers only. The row keeps
                      its height otherwise so nothing below it moves. */}
                  <div className="mt-[7px] flex min-h-[22px] items-center gap-[9px]">
                    <AnimatePresence initial={false}>
                      {!isFree && betaWins && (
                        <motion.span
                          key="beta"
                          {...appear}
                          transition={{ duration: 0.22, ease: easeOut }}
                          className="inline-flex items-center gap-[5px] rounded-full bg-purple-light px-[9px] py-[3px] text-[10.5px] font-extrabold uppercase tracking-[0.06em] text-purple"
                        >
                          <Sparkles size={10} strokeWidth={2.4} />
                          {(data.betaBadge ?? '')}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Carries the chosen period across to signup. Nothing consumes
                    it yet — annual prices do not exist in Stripe — but it means
                    the intent is not silently dropped, and how many coaches
                    pick annual becomes measurable before we build it. */}
                <Button
                  href={isAnnual ? `${appRegisterUrl}?billing=annual` : appRegisterUrl}
                  variant="solid"
                  size="lg"
                  className="max-[560px]:w-full"
                >
                  {isFree ? (data.ctaFree ?? 'Start free') : (data.ctaClub ?? 'Continue')}
                  <ArrowRight size={16} strokeWidth={2.2} />
                </Button>
              </div>
            </div>

            {/* Payments & billing — benefit first, fee second. The old line led
                with "Transaction fees" and a Free→Club nudge pill, which sold
                the cost before the service. */}
            <p className="mt-[clamp(0.9rem,1.8vw,1.25rem)] text-[13.5px] leading-[1.6] text-text-muted">
              {interp(
                (isFree ? data.feeNoteFree : data.feeNoteClub) ??
                  (isFree
                    ? 'Payments & billing, handled for you — Jimmy takes care of invoicing, reminders and client access automatically. Included with a {pct}% fee on payments, which drops as your business grows.'
                    : 'Payments & billing, handled for you — Jimmy takes care of invoicing, reminders and client access automatically. Included with just a {pct}% fee on payments at this plan.'),
                { pct: isFree ? freeJimmyPct : clubJimmyPct },
              )}{' '}
              {/* Stripe's own cut is a real cost the coach pays on top of ours.
                  The sentence above says "just 1%", so leaving this out would
                  understate what actually leaves their account. */}
              <span className="whitespace-nowrap text-text-faint">({fees.stripe})</span>
            </p>

            {/* Fixed height: these lines only apply to paid tiers, and letting
                them come and go would resize the card mid-drag. */}
            {/* Two lines' worth: monthly shows the beta lock plus the
                doesn't-combine note, annual only replaces them with one. */}
            <div className="mt-[7px] min-h-[42px]">
              {betaWins && (data.lockNote ?? '') && (
                <p className="text-[12.5px] leading-[1.55] text-text-faint">
                  {(data.lockNote ?? '')}
                </p>
              )}
              {!isFree && (
                <p className="text-[12.5px] leading-[1.55] text-text-faint">
                  {betaWins
                    ? interp(
                        data.annualNote ??
                          "Annual billing (save {annual}%) and the Beta Lover discount don't combine — best offer applies automatically.",
                        { annual: annualPct, beta: betaPct },
                      )
                    : interp(
                        data.betaMonthlyOnlyNote ??
                          'Beta Lover pricing applies to monthly billing only — switch back to Monthly to keep your −{beta}% for life.',
                        { annual: annualPct, beta: betaPct },
                      )}
                </p>
              )}
            </div>
          </div>

          {/* Said once, because it is true for every tier */}
          {(data.benefits ?? []).length > 0 && (
            <div className="border-t border-divider bg-surface px-[clamp(1.35rem,3.6vw,2.6rem)] py-[clamp(1.2rem,2.6vw,1.8rem)]">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-text-faint">
                {data.benefitsEyebrow ?? ''}
              </p>
              <ul className="mt-[clamp(0.85rem,1.6vw,1.15rem)] grid grid-cols-4 gap-x-[clamp(0.9rem,2vw,1.6rem)] gap-y-[11px] max-[900px]:grid-cols-2 max-[560px]:grid-cols-1">
                {(data.benefits ?? []).map((b, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-[9px] text-[14px] leading-[1.45] text-text"
                  >
                    <span className="mt-[2px] shrink-0 text-purple">
                      <CheckMark />
                    </span>
                    {b.text ?? ''}
                  </li>
                ))}
              </ul>
            </div>
          )}
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
