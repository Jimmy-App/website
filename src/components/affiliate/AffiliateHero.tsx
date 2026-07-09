'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { SoonButton } from '@/components/ui/SoonButton'
import { EarningsCalculator } from './EarningsCalculator'
import type { AffiliateCalcData, AffiliateHeroData, AffiliateSettingsData } from '@/lib/content'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]
const RISE = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }

const AVATARS = [
  { t: 'JM', bg: 'linear-gradient(135deg,#B966FE,#9537E4)' },
  { t: 'AK', bg: 'linear-gradient(135deg,#E8630A,#C94F00)' },
  { t: 'RS', bg: 'linear-gradient(135deg,#7929C9,#6822AD)' },
  { t: 'LB', bg: 'linear-gradient(135deg,#16A34A,#0E7A36)' },
]

export function AffiliateHero({
  data,
  settings,
  calc,
}: {
  data: AffiliateHeroData
  settings: AffiliateSettingsData
  calc: AffiliateCalcData
}) {
  const reduce = useReducedMotion()
  const rise = (d: number) => ({
    variants: reduce ? undefined : RISE,
    initial: reduce ? undefined : ('hidden' as const),
    animate: reduce ? undefined : ('show' as const),
    transition: { duration: 0.6, ease: EASE, delay: d },
  })

  return (
    <section className="relative isolate overflow-hidden px-[clamp(20px,5vw,40px)] pb-[clamp(20px,3vw,30px)] pt-[calc(var(--navbar-height)+clamp(40px,6vw,72px))] text-center">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-120px] -z-10 h-[min(900px,90vw)] w-[min(1100px,130vw)] -translate-x-1/2"
        style={{
          background:
            'radial-gradient(closest-side, rgba(138,50,224,0.14) 0%, rgba(138,50,224,0.06) 40%, rgba(138,50,224,0) 72%)',
        }}
      />

      <div className="mx-auto max-w-[1120px]">
        {/* Social proof */}
        <motion.div
          {...rise(0.04)}
          className="mb-[clamp(22px,3vw,30px)] inline-flex max-w-full items-center gap-3 rounded-full border border-purple-border bg-surface py-1.5 pl-2 pr-[18px] shadow-[0_4px_18px_rgba(138,50,224,0.08)]"
        >
          <span className="inline-flex" aria-hidden>
            {AVATARS.map((a, i) => (
              <span
                key={a.t}
                className="grid size-[26px] place-items-center rounded-full border-2 border-surface font-display text-[10px] font-bold text-white"
                style={{ background: a.bg, marginLeft: i === 0 ? 0 : -9 }}
              >
                {a.t}
              </span>
            ))}
            <span className="grid size-[26px] place-items-center rounded-full border-2 border-surface bg-surface-offset font-display text-[10px] font-bold text-text-muted" style={{ marginLeft: -9 }}>
              +
            </span>
          </span>
          <span className="text-[13.5px] font-medium text-text">{data.socialProof}</span>
        </motion.div>

        <motion.span {...rise(0.1)} className="mb-[18px] block text-eyebrow font-bold uppercase tracking-[0.18em] text-purple">
          {data.eyebrow}
        </motion.span>
        <motion.h1
          {...rise(0.16)}
          className="mx-auto max-w-[15ch] font-display text-display font-extrabold leading-[1.04] tracking-[var(--tracking-display)] text-balance"
        >
          {data.headlinePrefix}
          <span className="text-purple">{data.headlineAccent}</span>
          {data.headlineSuffix}
        </motion.h1>
        <motion.p
          {...rise(0.24)}
          className="mx-auto mt-5 max-w-[50ch] text-lead leading-[var(--leading-relaxed)] text-text-muted text-pretty"
        >
          {data.subtitle}
        </motion.p>
        <motion.div {...rise(0.32)} className="mt-[clamp(26px,3vw,34px)] flex flex-wrap justify-center gap-3">
          {/* Affiliate program not live yet — primary CTA shown as "Soon". */}
          <SoonButton size="lg" />
          <Button href="#how" variant="secondary" size="lg">
            {data.ctaSecondary}
          </Button>
        </motion.div>

        {/* Calculator */}
        <motion.div {...rise(0.42)}>
          <EarningsCalculator settings={settings} t={calc} />
        </motion.div>
      </div>
    </section>
  )
}
