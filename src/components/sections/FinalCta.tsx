'use client'

import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { ArrowRight, CalendarDays, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { appRegisterUrl } from '@/lib/appUrl'
import type { FinalCtaData } from '@/lib/content'

// ─── Animation helpers ────────────────────────────────────────────────────────
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

// ─── Drawn underline (SVG path, animated stroke-dashoffset via framer-motion) ─
function DrawnUnderline({ visible }: { visible: boolean }) {
  const reduced = useReducedMotion()
  return (
    <svg
      viewBox="0 0 320 20"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={cn(
        'pointer-events-none',
        'absolute left-[-3%] bottom-[-0.16em]',
        'w-[106%] h-[0.4em]',
        'overflow-visible',
      )}
    >
      <motion.path
        d="M4 13 C 70 4, 150 4, 214 9 C 258 12, 290 11, 316 6"
        fill="none"
        stroke="var(--color-purple)"
        strokeWidth={6}
        strokeLinecap="round"
        style={{
          filter: 'drop-shadow(0 2px 7px rgba(138,50,224,0.4))',
        }}
        initial={{ pathLength: 0 }}
        animate={
          reduced
            ? { pathLength: 1 }
            : visible
              ? { pathLength: 1 }
              : { pathLength: 0 }
        }
        transition={
          reduced
            ? { duration: 0 }
            : { duration: 0.9, ease: EASE, delay: 0.56 }
        }
      />
    </svg>
  )
}

// ─── Avatar bubble ────────────────────────────────────────────────────────────
function Avatar({
  label,
  bgClass = '',
  src,
  isMore = false,
}: {
  label?: string
  bgClass?: string
  src?: string
  isMore?: boolean
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center overflow-hidden',
        'w-[54px] h-[54px] rounded-full',
        'font-display font-bold text-[16px] text-white',
        'border-[3px] border-[var(--color-bg)]',
        '-ml-[16px] first:ml-0',
        'shadow-[0_4px_14px_rgba(26,25,23,0.18)]',
        bgClass,
        isMore && 'bg-white text-text-muted text-[20px] shadow-[0_4px_14px_rgba(26,25,23,0.14),inset_0_0_0_1px_var(--color-border)]',
      )}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="h-full w-full object-cover" />
      ) : (
        label
      )}
    </span>
  )
}

// ─── Trust pill (checkmark + text) ───────────────────────────────────────────
function TrustPill({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={cn(
        // Hug content & center; on mobile cap width so the text wraps into a tidy
        // 2-line pill (like the hero badge) instead of stretching/breaking.
        'mx-auto flex w-fit max-w-full items-center justify-center gap-[11px]',
        'max-sm:max-w-[300px]',
        'px-5 py-[9px] max-sm:py-2.5 rounded-full',
        'bg-[rgba(138,50,224,0.05)] border border-[rgba(138,50,224,0.14)]',
        'text-sm font-medium text-text-muted text-center',
      )}
    >
      {/* Green checkmark circle */}
      <span
        aria-hidden="true"
        className={cn(
          'inline-flex items-center justify-center shrink-0',
          'w-[22px] h-[22px] rounded-full',
          'bg-purple shadow-[0_3px_10px_-2px_rgba(138,50,224,0.5)]',
        )}
      >
        <Check
          className="w-[12px] h-[12px] text-white"
          strokeWidth={2.5}
        />
      </span>
      <span className="text-balance">{children}</span>
    </div>
  )
}

// ─── FinalCta section ─────────────────────────────────────────────────────────
export function FinalCta({ data }: { data: FinalCtaData }) {
  const reduced = useReducedMotion()

  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-8% 0px' })

  // Shared fade+rise animation factory
  function reveal(delay: number) {
    return reduced
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 },
          transition: { duration: 0.72, ease: EASE, delay },
        }
  }

  return (
    <section
      ref={sectionRef}
      id="final-cta"
      aria-label={data.sectionLabel ?? ''}
      className={cn(
        'relative isolate overflow-hidden bg-bg',
        'py-[clamp(3rem,6vh,4.75rem)] px-[clamp(1.25rem,5vw,3rem)]',
      )}
    >
      {/* Atmospheric purple bloom — top-right + bottom-left */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20"
        style={{
          background:
            'radial-gradient(44% 52% at 88% 4%, rgba(138,50,224,0.16) 0%, transparent 62%), radial-gradient(40% 46% at 4% 98%, rgba(138,50,224,0.10) 0%, transparent 60%)',
        }}
      />

      {/* Faint grid texture, vignetted */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-50"
        style={{
          backgroundImage:
            'linear-gradient(rgba(26,25,23,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(26,25,23,0.025) 1px, transparent 1px)',
          backgroundSize: '58px 58px',
          WebkitMaskImage:
            'radial-gradient(82% 82% at 50% 50%, #000 0%, transparent 80%)',
          maskImage:
            'radial-gradient(82% 82% at 50% 50%, #000 0%, transparent 80%)',
        }}
      />

      {/* Inner constrained content */}
      <div className="relative mx-auto max-w-[1080px]">

        {/* ── Two-column grid ─────────────────────────────────────────────── */}
        <div
          className={cn(
            'grid items-center',
            'grid-cols-[1.08fr_0.92fr]',
            'gap-[clamp(2.5rem,5vw,4.75rem)]',
            'max-[780px]:grid-cols-1 max-[780px]:gap-[clamp(1.8rem,5vw,2.4rem)]',
          )}
        >
          {/* ── LEFT: pitch ─────────────────────────────────────────────── */}
          <motion.div {...reveal(0.12)} className="text-left">
            {/* Headline */}
            <h2
              className={cn(
                'font-display font-extrabold text-text text-balance',
                'text-[clamp(2rem,4.3vw,3.05rem)] leading-[1.05] tracking-[-0.04em]',
              )}
            >
              {/* Line 1 — "Start for free." */}
              <span className="block">
                {data.headlinePrefix}{' '}
                <span className="relative inline-block whitespace-nowrap text-purple">
                  {data.headlineAccent}
                  <DrawnUnderline visible={isInView} />
                </span>
                {data.headlineSuffix}
              </span>
              {/* Line 2 — muted coda */}
              <span className="block text-text-muted">
                {data.headlineLine2}
              </span>
            </h2>

            {/* Subtitle */}
            <p
              className={cn(
                'mt-[clamp(1rem,2vw,1.4rem)] max-w-[470px]',
                'text-[clamp(0.98rem,1.2vw,1.1rem)] leading-[1.6] text-text-muted',
                'text-pretty',
              )}
            >
              {data.subtitle}
            </p>

            {/* CTA row */}
            <div
              className={cn(
                'mt-[clamp(1.7rem,3vw,2.3rem)]',
                'flex flex-wrap items-center gap-[13px]',
                'max-[520px]:flex-col max-[520px]:w-full max-[520px]:max-w-[360px]',
              )}
            >
              {/* Primary — solid purple, shimmer-on-hover via Button variant */}
              <Button
                href={appRegisterUrl}
                variant="solid"
                size="lg"
                icon={
                  <ArrowRight
                    className="size-[18px] transition-transform duration-[220ms] group-hover:translate-x-[3px]"
                    strokeWidth={1.75}
                  />
                }
                className={cn(
                  'group relative overflow-hidden',
                  'font-display text-[16.5px] font-bold tracking-[-0.01em]',
                  'px-8 py-[16px]',
                  'shadow-[0_12px_30px_-8px_rgba(138,50,224,0.5),0_1px_0_rgba(0,0,0,0.05)]',
                  'hover:shadow-[0_18px_44px_-8px_rgba(138,50,224,0.6)] hover:-translate-y-[2px]',
                  'active:translate-y-0 active:shadow-[0_8px_22px_-8px_rgba(138,50,224,0.46)]',
                  // Shimmer layer via ::before isn't possible in Tailwind without CSS — skip; the Button glow is sufficient
                  'max-[520px]:w-full max-[520px]:justify-center',
                )}
              >
                {data.ctaPrimary}
              </Button>

              {/* Secondary — ghost with purple calendar icon before text */}
              <Button
                href="#"
                variant="ghost"
                size="lg"
                className={cn(
                  'group',
                  'bg-white/60 hover:bg-white hover:border-[rgba(138,50,224,0.32)]',
                  'max-[520px]:w-full max-[520px]:justify-center',
                )}
              >
                <CalendarDays
                  className="size-[17px] text-purple transition-transform duration-[220ms] group-hover:scale-110 group-hover:-rotate-3"
                  strokeWidth={1.75}
                />
                {data.ctaSecondary}
              </Button>
            </div>
          </motion.div>

          {/* ── RIGHT: community proof ──────────────────────────────────── */}
          <motion.div
            {...reveal(0.27)}
            className={cn(
              'flex flex-col items-start gap-[18px]',
              'border-l border-[rgba(26,25,23,0.10)] pl-[clamp(2.5rem,5vw,4.75rem)]',
              // Mobile: drop the left border, add top border instead
              'max-[780px]:border-l-0 max-[780px]:pl-0',
              'max-[780px]:border-t max-[780px]:border-[rgba(26,25,23,0.10)]',
              'max-[780px]:pt-[clamp(1.8rem,5vw,2.4rem)]',
            )}
          >
            {/* Overlapping avatar bubbles */}
            <div className="flex" aria-hidden="true">
              <Avatar src="/assets/people/coach-1.png" />
              <Avatar src="/assets/people/coach-2.png" />
              <Avatar src="/assets/people/coach-3.png" />
              <Avatar label="+" isMore />
            </div>

            {/* Social-proof line */}
            <p className="text-[15.5px] font-medium leading-[1.5] text-text max-w-[320px]">
              {data.socialProof}
            </p>

            {/* Discipline tags */}
            <div className="flex flex-wrap gap-2">
              {(data.tags ?? []).map((tag) => (
                <span
                  key={tag}
                  className={cn(
                    'text-[12.5px] font-semibold text-text',
                    'bg-[rgba(138,50,224,0.07)] border border-[rgba(138,50,224,0.18)]',
                    'px-[13px] py-[6px] rounded-full',
                  )}
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Trust strip — inline pill, centered below the grid ──────────── */}
        <motion.div
          {...reveal(0.4)}
          className={cn(
            'flex justify-center',
            'mt-[clamp(1.6rem,3vw,2.25rem)] pt-[clamp(1.5rem,2.8vw,2rem)]',
            'border-t border-[rgba(26,25,23,0.09)]',
          )}
        >
          <TrustPill>
            {data.trustPrefix}<b className="font-bold text-[#6D1FB8]">{data.trustBold}</b>{data.trustSuffix}
          </TrustPill>
        </motion.div>
      </div>
    </section>
  )
}
