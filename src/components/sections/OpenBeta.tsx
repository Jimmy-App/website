'use client'

import { useReducedMotion, m as motion } from 'framer-motion'
import { MessagesSquare, Vote, Rocket, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/Card'
import { PortableInline } from '@/lib/PortableInline'
import type { BetaData } from '@/lib/content'

// ── Motion config ─────────────────────────────────────────────────────────────

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

const RISE = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0 },
}

// ── Mock UIs ──────────────────────────────────────────────────────────────────

function DiscordMock() {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'relative z-10 rounded-2xl p-3 mb-[1.15rem]',
        'bg-surface-2 border border-border',
        'flex flex-col gap-2 min-h-[150px]',
      )}
    >
      {/* Channel header */}
      <div className="flex items-center gap-[7px] pb-2 border-b border-border">
        <span className="text-[12px] font-extrabold text-text-faint">#</span>
        <span className="text-[12px] font-bold text-text">founders</span>
        <span className="ml-auto inline-flex items-center gap-[5px] text-[10px] font-extrabold tracking-[0.02em] text-purple">
          <span className="w-[6px] h-[6px] rounded-full bg-purple shadow-[0_0_0_3px_rgba(138,50,224,0.16)]" />
          3 online
        </span>
      </div>

      {/* Message 1 */}
      <div className="flex items-start gap-2">
        <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center bg-purple text-white text-[11px] font-bold">
          J
        </div>
        <div>
          <div className="flex items-center gap-[6px] mb-[2px]">
            <span className="text-[11px] font-bold text-text">Jimmy</span>
            <span className="text-[8px] font-extrabold tracking-[0.06em] text-purple bg-purple-light rounded px-[5px] py-[1px]">
              Team
            </span>
          </div>
          <div className="text-[11px] leading-[1.42] text-text-muted">
            Pushing the voice-notes fix tonight — thanks for the report!
          </div>
        </div>
      </div>

      {/* Message 2 */}
      <div className="flex items-start gap-2">
        <div
          className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-white text-[11px] font-bold"
          style={{ background: '#3B5BDB' }}
        >
          M
        </div>
        <div>
          <div className="mb-[2px] text-[11px] font-bold text-text">
            Marco · Coach
          </div>
          <div className="text-[11px] leading-[1.42] text-text-muted">
            Any chance we get bulk client import?
          </div>
        </div>
      </div>
    </div>
  )
}

function RoadmapMock() {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'relative z-10 rounded-2xl p-3 mb-[1.15rem]',
        'bg-surface-2 border border-border',
        'flex flex-col gap-2 min-h-[150px]',
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-[7px] pb-2 border-b border-border">
        <span className="text-[11px] font-bold tracking-[0.03em] text-text-faint">
          Roadmap — up next
        </span>
        <span className="ml-auto text-[9px] font-extrabold tracking-[0.05em] uppercase text-purple bg-purple-light rounded-[5px] px-[7px] py-[2px]">
          You vote
        </span>
      </div>

      {/* Vote row 1 — active */}
      <div className="flex items-center gap-[9px]">
        <div className="inline-flex flex-col items-center justify-center gap-[1px] w-[34px] py-[5px] rounded-lg border border-purple-border bg-purple-light text-purple text-[11px] font-extrabold flex-shrink-0 tabular-nums">
          <ChevronUp size={12} strokeWidth={2} />
          128
        </div>
        <span className="text-[11.5px] font-semibold text-text">
          Bulk client import
        </span>
      </div>

      {/* Vote row 2 */}
      <div className="flex items-center gap-[9px]">
        <div className="inline-flex flex-col items-center justify-center gap-[1px] w-[34px] py-[5px] rounded-lg border border-border bg-surface text-text-faint text-[11px] font-extrabold flex-shrink-0 tabular-nums">
          <ChevronUp size={12} strokeWidth={2} />
          94
        </div>
        <span className="text-[11.5px] font-semibold text-text">
          Custom workout tags
        </span>
      </div>

      {/* Vote row 3 — shipped */}
      <div className="flex items-center gap-[9px]">
        <div className="w-[34px] flex-shrink-0 flex items-center justify-center">
          <span className="w-[22px] h-[22px] rounded-full bg-purple-light text-purple flex items-center justify-center">
            <svg
              width="11"
              height="11"
              viewBox="0 0 12 12"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M2 6.2l2.4 2.4L10 3"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
        <span className="text-[11.5px] font-semibold text-text flex items-center gap-[7px]">
          Voice notes
          <span className="text-[8.5px] font-extrabold tracking-[0.05em] uppercase text-purple bg-purple-light rounded-[5px] px-[6px] py-[1px]">
            Shipped
          </span>
        </span>
      </div>
    </div>
  )
}

function ChangelogMock() {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'relative z-10 rounded-2xl p-3 mb-[1.15rem]',
        'bg-surface-2 border border-border',
        'flex flex-col gap-2 min-h-[150px]',
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-[7px] pb-2 border-b border-border">
        <span className="text-[11px] font-bold tracking-[0.03em] text-text-faint">
          Changelog
        </span>
        <span className="ml-auto text-[9px] font-extrabold tracking-[0.05em] uppercase text-purple bg-purple-light rounded-[5px] px-[7px] py-[2px]">
          This week
        </span>
      </div>

      {/* Log rows */}
      {[
        { ver: 'v1.9', text: 'Group challenges in Community' },
        { ver: 'v1.8', text: 'Stripe annual billing' },
        { ver: 'v1.7', text: 'Voice notes in 1:1 chat' },
      ].map(({ ver, text }) => (
        <div key={ver} className="flex items-center gap-[9px]">
          <span className="text-[9.5px] font-extrabold text-purple bg-purple-light border border-purple-border rounded-[6px] px-[7px] py-[2px] flex-shrink-0 tabular-nums">
            {ver}
          </span>
          <span className="text-[11.5px] text-text-muted leading-[1.35]">
            {text}
          </span>
        </div>
      ))}
    </div>
  )
}

// ── Card icon wrapper ─────────────────────────────────────────────────────────

function BetaIcon({
  children,
  featured = false,
}: {
  children: React.ReactNode
  featured?: boolean
}) {
  return (
    <div
      className={cn(
        'w-[42px] h-[42px] rounded-xl flex items-center justify-center mb-[0.9rem]',
        featured
          ? 'bg-purple border border-transparent text-white shadow-[0_8px_20px_-6px_rgba(138,50,224,0.5)]'
          : 'bg-purple-light border border-purple-border text-purple',
      )}
    >
      {children}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function OpenBeta({ data }: { data: BetaData }) {
  const shouldReduceMotion = useReducedMotion()

  const animate = !shouldReduceMotion

  return (
    <section
      id="open-beta"
      aria-label={data.ariaLabel ?? ''}
      className="relative bg-bg overflow-hidden border-t border-border"
    >
      {/* Radial gradient haze */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(130% 60% at 50% -20%, rgba(138,50,224,0.05) 0%, transparent 55%)',
        }}
      />

      {/* Grid pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            'linear-gradient(rgba(138,50,224,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(138,50,224,0.035) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          WebkitMaskImage:
            'radial-gradient(95% 70% at 50% 0%, #000 0%, transparent 68%)',
          maskImage:
            'radial-gradient(95% 70% at 50% 0%, #000 0%, transparent 68%)',
        }}
      />

      <div className="container-content py-[var(--section-pad-y)] relative">

        {/* ── Header ── */}
        <motion.header
          className="max-w-[1100px] mb-[clamp(2.5rem,5vw,3.75rem)]"
          variants={animate ? RISE : undefined}
          initial={animate ? 'hidden' : undefined}
          whileInView={animate ? 'show' : undefined}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.68, ease: EASE }}
        >
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-[9px] px-[15px] py-[7px] rounded-full bg-purple-light border border-purple-border mb-6">
            {/* Pulsing dot */}
            <span
              aria-hidden="true"
              className="w-2 h-2 rounded-full bg-purple animate-[betaPulse_2s_ease-out_infinite]"
              style={{
                animationName: 'betaPulse',
              }}
            />
            <style>{`
              @keyframes betaPulse {
                0%   { box-shadow: 0 0 0 0 rgba(138,50,224,0.5); }
                70%  { box-shadow: 0 0 0 8px rgba(138,50,224,0); }
                100% { box-shadow: 0 0 0 0 rgba(138,50,224,0); }
              }
            `}</style>
            <span className="text-[11.5px] font-extrabold tracking-[0.16em] uppercase text-purple">
              {data.badge}
            </span>
          </div>

          <h2 className="font-display text-[clamp(2.1rem,4.6vw,3.6rem)] font-extrabold leading-[1.04] tracking-[-0.035em] text-text mb-[1.4rem] text-balance">
            {data.titleLine1}
            <br />
            {data.titleLine2Prefix}
            <span className="text-purple">{data.titleLine2Accent}</span>
            {data.titleLine2Suffix}
          </h2>

          <p className="text-[clamp(1rem,1.5vw,1.18rem)] leading-[1.65] text-text-muted max-w-[640px] text-pretty">
            <PortableInline
              value={data.body}
              marks={{
                em: (chunk) => (
                  <span className="text-text font-semibold">{chunk}</span>
                ),
              }}
            />
          </p>
        </motion.header>

        {/* ── Cards grid ── */}
        <div className="grid grid-cols-3 max-md:grid-cols-1 max-md:max-w-[460px] max-md:mx-auto gap-[clamp(1rem,2vw,1.4rem)] items-stretch">

          {/* Card 1 — Direct access */}
          <motion.div
            variants={animate ? RISE : undefined}
            initial={animate ? 'hidden' : undefined}
            whileInView={animate ? 'show' : undefined}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0 }}
            className="group"
          >
            <Card
              elevation="sm"
              tone="light"
              className={cn(
                'flex flex-col h-full rounded-[22px] p-[1.4rem]',
                'transition-[border-color,box-shadow,transform] duration-[240ms] ease-out',
                'hover:border-[rgba(138,50,224,0.30)] hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(138,50,224,0.10)]',
              )}
            >
              <DiscordMock />
              <div className="mt-auto">
                <BetaIcon>
                  <MessagesSquare size={19} strokeWidth={1.75} />
                </BetaIcon>
                <h3 className="font-display text-[1.2rem] font-bold tracking-[-0.02em] leading-[1.2] text-text mb-[0.4rem]">
                  {data.card1?.title}
                </h3>
                <p className="text-[13.5px] leading-[1.55] text-text-muted">
                  {data.card1?.desc}
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Card 2 — Featured / emphasized */}
          <motion.div
            variants={animate ? { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } } : undefined}
            initial={animate ? 'hidden' : undefined}
            whileInView={animate ? 'show' : undefined}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
            className="group max-md:order-first md:-translate-y-3"
          >
            <Card
              elevation="sm"
              tone="light"
              className={cn(
                'flex flex-col h-full rounded-[22px] p-[1.4rem]',
                'border-[rgba(138,50,224,0.45)]',
                'shadow-[0_0_0_1px_rgba(138,50,224,0.12),0_26px_56px_-30px_rgba(138,50,224,0.45)]',
                'transition-[border-color,box-shadow,transform] duration-[240ms] ease-out',
                'hover:border-[rgba(138,50,224,0.55)] hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(138,50,224,0.15)]',
              )}
            >
              <RoadmapMock />
              <div className="mt-auto">
                <BetaIcon featured>
                  <Vote size={19} strokeWidth={1.75} />
                </BetaIcon>
                <h3 className="font-display text-[1.2rem] font-bold tracking-[-0.02em] leading-[1.2] text-text mb-[0.4rem]">
                  {data.card2?.title}
                </h3>
                <p className="text-[13.5px] leading-[1.55] text-text-muted">
                  {data.card2?.desc}
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Card 3 — New features */}
          <motion.div
            variants={animate ? RISE : undefined}
            initial={animate ? 'hidden' : undefined}
            whileInView={animate ? 'show' : undefined}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
            className="group"
          >
            <Card
              elevation="sm"
              tone="light"
              className={cn(
                'flex flex-col h-full rounded-[22px] p-[1.4rem]',
                'transition-[border-color,box-shadow,transform] duration-[240ms] ease-out',
                'hover:border-[rgba(138,50,224,0.30)] hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(138,50,224,0.10)]',
              )}
            >
              <ChangelogMock />
              <div className="mt-auto">
                <BetaIcon>
                  <Rocket size={19} strokeWidth={1.75} />
                </BetaIcon>
                <h3 className="font-display text-[1.2rem] font-bold tracking-[-0.02em] leading-[1.2] text-text mb-[0.4rem]">
                  {data.card3?.title}
                </h3>
                <p className="text-[13.5px] leading-[1.55] text-text-muted">
                  {data.card3?.desc}
                </p>
              </div>
            </Card>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
