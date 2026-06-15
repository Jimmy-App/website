'use client'

import { useReducedMotion, motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import type { StepsData } from '@/lib/content'

// ─── Animation helpers ────────────────────────────────────────────────────────
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

function useScrollReveal(delayMs = 0) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const reduced = useReducedMotion()

  const motionProps = reduced
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        animate: inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
        transition: { duration: 0.64, ease: EASE, delay: delayMs / 1000 },
      }

  return { ref, motionProps }
}

// ─── Step 1 mock — profile setup ─────────────────────────────────────────────
function Step1Mock() {
  return (
    <div
      className={cn(
        'flex flex-1 flex-col gap-1.5 rounded-[14px] border border-border',
        'bg-surface-2 p-[13px]',
      )}
    >
      {/* Row: Coach profile */}
      <div className="flex items-center gap-2 rounded-[9px] border border-border bg-surface px-[10px] py-2">
        {/* Avatar */}
        <div
          className={cn(
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
            'bg-[linear-gradient(135deg,var(--color-purple),#A855F7)]',
            'text-[13px] font-bold text-white',
          )}
        >
          A
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[12px] font-semibold text-text leading-none">Alex Johnson</div>
          <div className="mt-[1px] text-[10.5px] text-text-faint">jimmy.app/alexj</div>
        </div>
        {/* Checkmark */}
        <div className="flex h-[17px] w-[17px] shrink-0 items-center justify-center rounded-full bg-[#16A34A]">
          <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
            <path d="M1.5 4.5l2 2 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Row: Logo + brand */}
      <div className="flex items-center gap-2 rounded-[9px] border border-border bg-surface px-[10px] py-2">
        <div
          className={cn(
            'flex h-[30px] w-[30px] shrink-0 items-center justify-center',
            'rounded-lg border-[1.5px] border-dashed border-border',
          )}
        >
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <path d="M8 3v10M3 8h10" stroke="var(--color-text-faint)" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[12px] font-semibold text-text leading-none">Logo</div>
          <div className="mt-[1px] text-[10.5px] text-text-faint">Upload brand logo</div>
        </div>
        {/* Color swatches */}
        <div className="flex gap-1">
          <div className="h-3.5 w-3.5 rounded-full bg-purple" />
          <div className="h-3.5 w-3.5 rounded-full bg-[#2563EB] outline outline-2 outline-offset-[2px] outline-text" />
          <div className="h-3.5 w-3.5 rounded-full bg-[#16A34A]" />
          <div className="h-3.5 w-3.5 rounded-full bg-[#DC2626]" />
        </div>
      </div>

      {/* Row: Bio */}
      <div className="flex items-center gap-2 rounded-[9px] border border-border bg-surface px-[10px] py-2">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0">
          <rect x="2" y="3" width="12" height="10" rx="2" stroke="var(--color-text-faint)" strokeWidth="1.4" />
          <path d="M5 7h6M5 10h4" stroke="var(--color-text-faint)" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
        <div className="text-[12px] font-semibold text-text">Coach bio</div>
        <div className="ml-auto text-[10px] font-semibold text-purple">+30 XP</div>
      </div>
    </div>
  )
}

// ─── Step 2 mock — invite clients ─────────────────────────────────────────────
function Step2Mock() {
  return (
    <div
      className={cn(
        'flex flex-1 flex-col gap-1.5 rounded-[14px] border border-border',
        'bg-surface-2 p-[13px]',
      )}
    >
      {/* Copy link row */}
      <div className="mb-[2px] flex items-center gap-1.5 rounded-[9px] border border-border bg-surface px-[10px] py-2">
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" className="shrink-0">
          <path d="M8 2a6 6 0 100 12A6 6 0 008 2z" stroke="var(--color-purple)" strokeWidth="1.4" />
          <path d="M8 5v3l2 2" stroke="var(--color-purple)" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        <span className="flex-1 text-[11px] text-text">jimmy.app/alexj/join</span>
        <div className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-[6px] bg-purple">
          <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
            <rect x="4" y="4" width="8" height="8" rx="1.5" stroke="#fff" strokeWidth="1.4" />
            <path d="M2 10V3a1 1 0 011-1h7" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* Share buttons */}
      <div className="flex gap-1.5">
        <button className="flex flex-1 items-center justify-center gap-1 rounded-[8px] bg-[#E8F5E9] py-[7px] text-[11px] font-semibold text-[#16A34A]">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="#16A34A">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          </svg>
          WhatsApp
        </button>
        <button className="flex flex-1 items-center justify-center gap-1 rounded-[8px] border border-border bg-surface-2 py-[7px] text-[11px] font-semibold text-text-muted">
          <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
            <rect x="2" y="4" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
            <path d="M2 5l6 5 6-5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          Email
        </button>
      </div>

      {/* Sent row */}
      <div className="flex items-center gap-1.5 pt-1">
        <div className="flex">
          {(['#2563EB', '#16A34A', '#DC2626'] as const).map((bg, i) => (
            <div
              key={i}
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-[1.5px] border-surface text-[9px] font-bold text-white"
              style={{ background: bg, marginLeft: i === 0 ? 0 : '-6px' }}
            >
              {['M', 'S', 'J'][i]}
            </div>
          ))}
        </div>
        <span className="text-[10.5px] text-text-faint">3 clients invited • awaiting</span>
      </div>
    </div>
  )
}

// ─── Step 3 mock — revenue dashboard ─────────────────────────────────────────
const BAR_HEIGHTS = [40, 55, 45, 70, 60, 80, 65, 100] as const

function Step3Mock() {
  return (
    <div
      className={cn(
        'flex flex-1 flex-col rounded-[14px] border p-[13px]',
        'bg-white/5 border-white/[0.07]',
      )}
    >
      {/* Revenue block */}
      <div className="mb-[10px]">
        <div className="mb-[2px] text-[9.5px] uppercase tracking-[0.08em] text-white/35">
          Revenue this month
        </div>
        <div className="font-display text-[2rem] font-extrabold leading-none tracking-[-0.04em] text-white">
          €3,840
        </div>
        <div className="mt-1.5 inline-flex items-center gap-[3px] rounded-full bg-[#16A34A]/[0.18] px-2 py-[3px] text-[10.5px] font-semibold text-[#4ADE80]">
          <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
            <path d="M2 7l3-4 3 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          +28% vs last month
        </div>
      </div>

      {/* Bar chart */}
      <div className="mb-[10px] flex h-[34px] items-end gap-1" aria-hidden="true">
        {BAR_HEIGHTS.map((h, i) => (
          <div
            key={i}
            className={cn(
              'flex-1 rounded-t-[3px]',
              i === BAR_HEIGHTS.length - 1 ? 'bg-purple' : 'bg-white/10',
            )}
            style={{ height: `${h}%` }}
          />
        ))}
      </div>

      {/* Active clients */}
      <div
        className={cn(
          'flex items-center justify-between rounded-[9px] border px-[10px] py-[7px]',
          'bg-white/5 border-white/[0.07]',
        )}
      >
        <span className="text-[11px] text-white/35">Active clients</span>
        <span className="text-[13px] font-bold text-white/85">16 coaches</span>
      </div>
    </div>
  )
}

// ─── Step card ────────────────────────────────────────────────────────────────
type StepTone = 'light' | 'dark'

function StepCard({
  tone,
  stepNum,
  title,
  desc,
  children,
  delayMs,
}: {
  tone: StepTone
  stepNum: string
  title: string
  desc: string
  children: React.ReactNode
  delayMs: number
}) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  const motionProps = reduced
    ? {}
    : {
        initial: { opacity: 0, y: 32 },
        animate: inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 },
        transition: { duration: 0.58, ease: EASE, delay: delayMs / 1000 },
      }

  const isDark = tone === 'dark'

  return (
    <motion.div
      ref={ref}
      {...motionProps}
      className={cn(
        'relative flex flex-col gap-[1.1rem] overflow-hidden rounded-[22px] p-6',
        isDark
          ? 'bg-[#1C1A17] border border-white/[0.06] shadow-[0_12px_48px_rgba(0,0,0,0.22),0_2px_8px_rgba(0,0,0,0.1)]'
          : 'bg-surface border border-border shadow-[0_1px_8px_rgba(0,0,0,0.04)]',
      )}
    >
      {/* Watermark number */}
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute right-[0.9rem] top-[0.1rem] z-0',
          'font-display text-[7rem] font-extrabold leading-none tracking-[-0.05em]',
          'select-none',
          isDark ? 'text-white/[0.04]' : 'text-border',
        )}
      >
        {stepNum}
      </span>

      {/* Step tag */}
      <span
        className={cn(
          'relative z-10 text-[10.5px] font-bold uppercase tracking-[0.1em]',
          isDark ? 'text-white/30' : 'text-text-faint',
        )}
      >
        STEP {stepNum}
      </span>

      {/* Mockup area */}
      <div className="relative z-10">{children}</div>

      {/* Body */}
      <div className="relative z-10">
        <p
          className={cn(
            'font-display text-[1.15rem] font-bold leading-[1.22] tracking-[-0.025em]',
            'mb-[0.35rem]',
            isDark ? 'text-white' : 'text-text',
          )}
        >
          {title}
        </p>
        <p
          className={cn(
            'text-[13px] leading-[1.65]',
            isDark ? 'text-white/50' : 'text-text-muted',
          )}
        >
          {desc}
        </p>
      </div>
    </motion.div>
  )
}

// ─── Steps section ────────────────────────────────────────────────────────────
export function Steps({ data }: { data: StepsData }) {
  const { ref: hdRef, motionProps: hdMotion } = useScrollReveal(0)

  const ctaRef = useRef<HTMLDivElement>(null)
  const ctaInView = useInView(ctaRef, { once: true, margin: '-60px' })
  const reduced = useReducedMotion()
  const ctaMotion = reduced
    ? {}
    : {
        initial: { opacity: 0, y: 16 },
        animate: ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 },
        transition: { duration: 0.5, ease: EASE, delay: 0.3 },
      }

  return (
    <section
      id="steps-section"
      aria-label={data.sectionLabel ?? ''}
      className="border-t border-border bg-bg py-[var(--section-pad-y)]"
    >
      <div className="container-content">

        {/* Header */}
        <motion.header
          ref={hdRef}
          {...hdMotion}
          className="mb-[clamp(2.5rem,5vw,3.5rem)] text-center"
        >
          <span className="eyebrow mb-[0.9rem] block text-purple">
            · {data.eyebrow}
          </span>
          <h2
            className={cn(
              'font-display text-display font-extrabold text-text',
              'mb-[0.8rem] leading-[1.07] tracking-[var(--tracking-display)] text-balance',
            )}
          >
            {data.titlePrefix}<em className="italic text-purple whitespace-nowrap">{data.titleAccent}</em>
          </h2>
          <p className="text-[16px] leading-[1.6] text-text-muted">{data.subtitle}</p>
        </motion.header>

        {/* Cards grid */}
        <div className="mb-9 grid grid-cols-1 gap-4 md:grid-cols-3">

          {/* Step 1 */}
          <StepCard
            tone="light"
            stepNum="01"
            title={data.step1?.title ?? ''}
            desc={data.step1?.desc ?? ''}
            delayMs={0}
          >
            <Step1Mock />
          </StepCard>

          {/* Step 2 */}
          <StepCard
            tone="light"
            stepNum="02"
            title={data.step2?.title ?? ''}
            desc={data.step2?.desc ?? ''}
            delayMs={90}
          >
            <Step2Mock />
          </StepCard>

          {/* Step 3 — dark */}
          <StepCard
            tone="dark"
            stepNum="03"
            title={data.step3?.title ?? ''}
            desc={data.step3?.desc ?? ''}
            delayMs={180}
          >
            <Step3Mock />
          </StepCard>
        </div>

        {/* CTA row */}
        <motion.div
          ref={ctaRef}
          {...ctaMotion}
          className="flex justify-center"
        >
          <Button
            href="#"
            variant="solid"
            size="lg"
            icon={<ArrowRight className="size-[15px]" strokeWidth={1.75} />}
          >
            {data.cta}
          </Button>
        </motion.div>

      </div>
    </section>
  )
}
