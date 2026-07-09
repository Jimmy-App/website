'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SoonButton } from '@/components/ui/SoonButton'
import type { AffiliateCalcData, AffiliateSettingsData } from '@/lib/content'

const SYM = { eur: '€', usd: '$' } as const
type Currency = keyof typeof SYM

function fmt(sym: string, n: number) {
  const r = Math.round(n * 100) / 100
  return sym + (r % 1 === 0 ? r.toLocaleString('en-US') : r.toFixed(2))
}
function fmtInt(sym: string, n: number) {
  return sym + Math.round(n).toLocaleString('en-US')
}
// Fill {placeholders} in a localized template string.
function fill(t: string, vars: Record<string, string>) {
  return t.replace(/\{(\w+)\}/g, (_, k: string) => vars[k] ?? '')
}

// Hover/focus tooltip explaining how a per-referral figure is derived.
function InfoTip({ text }: { text: string }) {
  return (
    <span className="group/tip relative inline-flex">
      <button
        type="button"
        aria-label="How this is calculated"
        className="grid size-[15px] flex-none cursor-help place-items-center rounded-full bg-surface-offset text-text-faint transition-colors hover:bg-purple-light hover:text-purple"
      >
        <Info className="size-[9px]" strokeWidth={2.4} />
      </button>
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 w-[230px] -translate-x-1/2 rounded-xl bg-text px-3 py-2 text-[11.5px] font-medium leading-[1.45] text-white opacity-0 shadow-[0_12px_30px_-8px_rgba(0,0,0,0.45)] transition-opacity duration-150 group-hover/tip:opacity-100 group-focus-within/tip:opacity-100"
      >
        {text}
        <span className="absolute -bottom-1 left-1/2 size-2 -translate-x-1/2 rotate-45 bg-text" />
      </span>
    </span>
  )
}

export function EarningsCalculator({
  settings,
  t,
}: {
  settings: AffiliateSettingsData
  t: AffiliateCalcData
}) {
  // Numbers come from the global settings singleton.
  const rate = (settings.rate ?? 30) / 100
  const MIN = settings.sliderMin ?? 5
  const MAX = settings.sliderMax ?? 100
  const ticks = settings.ticks ?? [5, 25, 50, 75, 100]
  const CUR = {
    eur: { sym: '€', avg: settings.eur?.avg ?? 69, lo: settings.eur?.lo ?? 29, hi: settings.eur?.hi ?? 149 },
    usd: { sym: '$', avg: settings.usd?.avg ?? 75, lo: settings.usd?.lo ?? 32, hi: settings.usd?.hi ?? 162 },
  } as const

  const [currency, setCurrency] = useState<Currency>('eur')
  const [refs, setRefs] = useState(settings.sliderDefault ?? 25)

  const c = CUR[currency]
  const perRef = c.avg * rate
  const monthly = refs * perRef
  const annual = monthly * 12
  const perMo = t.perMo ?? '/mo'

  // template vars for the tooltips
  const tipVars = {
    avg: `${c.sym}${c.avg}`,
    perRef: fmt(c.sym, perRef),
    rate: String(Math.round(rate * 100)),
  }

  const posOf = (v: number) =>
    `calc(14px + ${(v - MIN) / (MAX - MIN)} * (100% - 28px))`

  return (
    <div
      id="calc"
      className="mt-[clamp(34px,4vw,52px)] grid grid-cols-[1.08fr_0.92fr] overflow-hidden rounded-[24px] border border-border bg-surface text-left shadow-[var(--shadow-lg)] max-[860px]:grid-cols-1"
    >
      {/* ── Control ── */}
      <div className="flex flex-col gap-7 p-[clamp(28px,3.2vw,42px)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-[20px] font-bold leading-[1.2] tracking-[-0.015em]">{t.title}</h3>
            <p className="mt-2 text-[13.5px] leading-[1.5] text-text-muted">{t.helper}</p>
          </div>
          <div className="flex flex-none rounded-full bg-surface-2 p-[3px]" role="group" aria-label="Currency">
            {(Object.keys(CUR) as Currency[]).map((cur) => (
              <button
                key={cur}
                type="button"
                onClick={() => setCurrency(cur)}
                className={cn(
                  'cursor-pointer whitespace-nowrap rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold transition-colors',
                  currency === cur ? 'bg-purple text-white shadow-[0_2px_8px_rgba(138,50,224,0.3)]' : 'text-text-muted hover:text-text',
                )}
              >
                {SYM[cur]} {cur.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Slider with floating value bubble + aligned ticks */}
        <div className="pt-9">
          <div className="relative">
            <div className="pointer-events-none absolute -top-9 z-10 -translate-x-1/2 transition-[left] duration-75" style={{ left: posOf(refs) }}>
              <div className="relative rounded-lg bg-purple px-2.5 py-1 text-[12.5px] font-bold tabular-nums text-white shadow-[0_4px_12px_rgba(138,50,224,0.35)]">
                {refs}
                <span className="ml-1 font-medium text-white/70">{t.coachesSuffix}</span>
                <span className="absolute -bottom-1 left-1/2 size-2 -translate-x-1/2 rotate-45 bg-purple" />
              </div>
            </div>

            <input
              type="range"
              min={MIN}
              max={MAX}
              step={1}
              value={refs}
              onChange={(e) => setRefs(parseInt(e.target.value, 10))}
              aria-label={t.helper ?? 'Number of coaches you refer'}
              className="aff-slider"
              style={{ ['--p' as string]: String((refs - MIN) / (MAX - MIN)) }}
            />

            <div className="relative mt-3.5 h-[18px]">
              {ticks.map((tk) => (
                <button
                  key={tk}
                  type="button"
                  onClick={() => setRefs(tk)}
                  style={{ left: posOf(tk) }}
                  className={cn(
                    'absolute top-0 -translate-x-1/2 cursor-pointer px-1 text-[12px] font-semibold tabular-nums transition-colors',
                    refs === tk ? 'text-purple' : 'text-text-faint hover:text-text-muted',
                  )}
                >
                  {tk}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Average-plan basis */}
        <div className="mt-auto flex items-center gap-3.5 rounded-[14px] border border-purple-border bg-purple-light px-4 py-3.5">
          <div className="grid size-10 flex-none place-items-center rounded-[11px] bg-surface text-purple shadow-[0_2px_8px_rgba(138,50,224,0.12)]">
            <TrendingUp className="size-[19px]" strokeWidth={1.8} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span className="text-[11px] font-bold uppercase tracking-[0.07em] text-text-muted">{t.basisLabel}</span>
              <span className="font-display text-[17px] font-extrabold tracking-[-0.02em] text-purple tabular-nums">
                {c.sym}{c.avg}
                <span className="text-[12px] font-semibold text-text-muted">{perMo}</span>
              </span>
            </div>
            <div className="mt-1 text-[11.5px] leading-[1.5] text-text-muted">
              {t.basisRangePrefix}{' '}
              <span className="font-[650] text-text">{c.sym}{c.lo}–{c.sym}{c.hi}</span>{' '}
              {t.basisRangeSuffix}
            </div>
          </div>
        </div>

        <p className="text-[11.5px] leading-[1.55] text-text-faint">{t.footnote}</p>
      </div>

      {/* ── Result ── */}
      <div className="flex flex-col gap-5 border-l border-border bg-surface-2 p-[clamp(28px,3.2vw,42px)] [container-type:inline-size] max-[860px]:border-l-0 max-[860px]:border-t">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-text-faint">{t.estimateLabel}</span>
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-purple px-[10px] py-1 text-[10px] font-extrabold uppercase tracking-[0.05em] text-white">
            <span className="size-[5px] rounded-full bg-white/80" />
            {t.recurringBadge}
          </span>
        </div>

        {/* Hero — monthly commission */}
        <div>
          <motion.div
            key={`${currency}-${refs}`}
            initial={{ opacity: 0.6, y: 2 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-[clamp(2.6rem,6cqw,3.4rem)] font-extrabold leading-[0.95] tracking-[-0.045em] tabular-nums text-text"
          >
            {fmt(c.sym, monthly)}
            <span className="ml-1.5 align-baseline text-[1.1rem] font-bold tracking-[-0.02em] text-text-muted">{perMo}</span>
          </motion.div>
          <div className="mt-2.5 flex items-center gap-2 text-[13px] text-text-muted">
            <span className="font-semibold text-text">{t.monthlyLabel}</span>
            <span className="text-text-faint">·</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-purple-light px-2 py-0.5 text-[12px] font-bold text-purple tabular-nums">
              {fill(t.perYearTemplate ?? '≈ {v} / yr', { v: fmtInt(c.sym, annual) })}
            </span>
          </div>
        </div>

        {/* Breakdown */}
        <div className="rounded-[14px] border border-border bg-surface px-4 py-1">
          {[
            { l: t.referralsLabel, v: String(refs), tip: undefined as string | undefined },
            { l: t.perMonthLabel, v: fmt(c.sym, perRef), tip: t.perMonthTip ? fill(t.perMonthTip, tipVars) : undefined },
            { l: t.perYearLabel, v: fmt(c.sym, perRef * 12), tip: t.perYearTip ? fill(t.perYearTip, tipVars) : undefined },
          ].map((row, i, arr) => (
            <div
              key={i}
              className={cn('flex items-center justify-between gap-3 py-[11px]', i < arr.length - 1 && 'border-b border-divider')}
            >
              <span className="inline-flex items-center gap-1.5 text-[13.5px] text-text-muted">
                {row.l}
                {row.tip && <InfoTip text={row.tip} />}
              </span>
              <motion.span
                key={currency}
                initial={{ opacity: 0.4, y: 1 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="text-[15px] font-bold tabular-nums tracking-[-0.01em] text-text"
              >
                {row.v}
              </motion.span>
            </div>
          ))}
        </div>

        <div className="mt-auto flex flex-col gap-3">
          {/* Affiliate program not live yet — link generation shown as "Soon". */}
          <SoonButton size="lg" full />
          <p className="flex items-start gap-2 text-[11.5px] leading-[1.5] text-text-faint">
            <Info className="mt-px size-[13px] flex-none" strokeWidth={2} />
            <span>{t.note}</span>
          </p>
        </div>
      </div>

      <style>{`
        .aff-slider {
          -webkit-appearance: none; appearance: none; width: 100%; height: 10px; border-radius: 9999px; margin: 0;
          outline: none; cursor: pointer;
          background: linear-gradient(90deg,
            var(--color-purple) calc(14px + var(--p) * (100% - 28px)),
            var(--color-surface-offset) calc(14px + var(--p) * (100% - 28px)));
        }
        .aff-slider::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none; width: 28px; height: 28px; border-radius: 50%;
          background: #fff; border: 3px solid var(--color-purple);
          box-shadow: 0 4px 14px rgba(138,50,224,0.42), 0 0 0 6px rgba(138,50,224,0.12);
          cursor: grab; transition: transform 120ms, box-shadow 160ms;
        }
        .aff-slider::-webkit-slider-thumb:hover { box-shadow: 0 4px 16px rgba(138,50,224,0.5), 0 0 0 9px rgba(138,50,224,0.14); }
        .aff-slider::-webkit-slider-thumb:active { cursor: grabbing; transform: scale(1.08); }
        .aff-slider::-moz-range-thumb {
          width: 28px; height: 28px; border-radius: 50%; background: #fff; border: 3px solid var(--color-purple);
          box-shadow: 0 4px 14px rgba(138,50,224,0.42), 0 0 0 6px rgba(138,50,224,0.12); cursor: grab;
        }
      `}</style>
    </div>
  )
}
