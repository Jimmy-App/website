'use client'

import { useRef } from 'react'
import { m as motion, useInView, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { PortableInline } from '@/lib/PortableInline'
import type { ManifestoData } from '@/lib/content'

// ─── Animation helpers ────────────────────────────────────────────────────────
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

// ─── Drawn underline SVG under "experience" ──────────────────────────────────
function DrawnUnderline({ visible }: { visible: boolean }) {
  const reduced = useReducedMotion()
  return (
    <svg
      viewBox="0 0 320 20"
      preserveAspectRatio="none"
      aria-hidden="true"
      className="pointer-events-none absolute bottom-[-0.18em] left-[-2%] right-[-2%] h-[0.4em] w-[104%] overflow-visible"
    >
      <motion.path
        d="M4 13 C 70 4, 150 4, 214 9 C 258 12, 290 11, 316 6"
        fill="none"
        stroke="#B078FF"
        strokeWidth={6}
        strokeLinecap="round"
        style={{ filter: 'drop-shadow(0 2px 8px rgba(176,120,255,0.5))' }}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={
          reduced
            ? { pathLength: 1, opacity: 1 }
            : visible
              ? { pathLength: 1, opacity: 1 }
              : { pathLength: 0, opacity: 0 }
        }
        transition={
          reduced
            ? { duration: 0 }
            : { duration: 0.9, ease: EASE, delay: 0.72 }
        }
      />
    </svg>
  )
}

// ─── Single headline line with staggered reveal ───────────────────────────────
function HeadlineLine({
  children,
  delay,
  visible,
  dim,
}: {
  children: React.ReactNode
  delay: number
  visible: boolean
  dim?: boolean
}) {
  const reduced = useReducedMotion()
  return (
    <span className="block">
      <motion.span
        className={cn('inline-block', dim && 'text-[rgba(246,243,238,0.52)]')}
        initial={reduced ? {} : { opacity: 0, y: 26 }}
        animate={
          reduced ? {} : visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 }
        }
        transition={reduced ? {} : { duration: 0.76, ease: EASE, delay }}
      >
        {children}
      </motion.span>
    </span>
  )
}

// ─── Manifesto section ────────────────────────────────────────────────────────
export function Manifesto({ data }: { data: ManifestoData }) {
  const reduced = useReducedMotion()

  // Use a single sentinel ref at the top of the section
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-10% 0px' })

  const reveal = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          animate: isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 },
          transition: { duration: 0.76, ease: EASE, delay },
        }

  return (
    <section
      ref={sectionRef}
      id="manifesto"
      aria-label={data.sectionLabel ?? ''}
      className={cn(
        'relative isolate flex min-h-svh items-center overflow-hidden',
        // Mobile: don't force full-viewport height (avoids the large empty gap below)
        'max-[720px]:min-h-0',
        // Dark purple → warm dark radial background
        '[background:radial-gradient(135%_115%_at_50%_-12%,#251B33_0%,#18120F_44%,#100B09_100%)]',
        'text-[#F6F3EE]',
      )}
    >
      {/* Glowing hairline separator at top */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-[3] h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent 8%, rgba(196,155,242,0.55) 38%, rgba(232,99,10,0.40) 62%, transparent 92%)',
        }}
      />

      {/* Fine grid + grain overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-60"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E"), linear-gradient(rgba(255,255,255,0.024) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.024) 1px, transparent 1px)`,
          backgroundSize: '160px 160px, 72px 72px, 72px 72px',
          WebkitMaskImage:
            'radial-gradient(105% 75% at 50% 0%, #000 0%, transparent 74%)',
          maskImage:
            'radial-gradient(105% 75% at 50% 0%, #000 0%, transparent 74%)',
        }}
      />

      {/* Drifting aurora blooms */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-[12%] -z-20"
        style={{
          background:
            'radial-gradient(52% 46% at 50% 2%, rgba(138,50,224,0.40) 0%, transparent 62%), radial-gradient(40% 50% at 86% 104%, rgba(176,120,255,0.22) 0%, transparent 60%), radial-gradient(38% 44% at 8% 100%, rgba(232,99,10,0.13) 0%, transparent 60%)',
        }}
        animate={
          reduced
            ? {}
            : {
                y: [0, '-2.4%', 0],
                scale: [1, 1.06, 1],
              }
        }
        transition={
          reduced
            ? {}
            : {
                duration: 20,
                ease: 'easeInOut',
                repeat: Infinity,
                repeatType: 'mirror',
              }
        }
      />

      {/* Inner content */}
      <div
        className={cn(
          'relative z-10 w-full',
          'max-w-[1180px] mx-auto',
          'px-[clamp(1.25rem,5vw,3.5rem)]',
          'py-[clamp(3rem,7vh,5rem)]',
          // Mobile: center the whole composition
          'max-[720px]:text-center',
        )}
      >
        {/* Label: "Our Manifesto" + rule */}
        <motion.span
          {...reveal(0)}
          className={cn(
            'mb-[clamp(1.5rem,3vw,2.1rem)] inline-flex items-center gap-[13px]',
            'text-[12px] font-extrabold uppercase tracking-[0.22em] text-[#C49BF2]',
            'whitespace-nowrap max-[720px]:justify-center',
            // Dot before
            'before:block before:h-[7px] before:w-[7px] before:shrink-0 before:rounded-full',
            'before:bg-[#C49BF2] before:[box-shadow:0_0_10px_rgba(196,155,242,0.9)]',
          )}
        >
          {data.label}
          {/* Rule after label — hidden on mobile (looks off when centered) */}
          <span
            aria-hidden="true"
            className="h-px w-[clamp(72px,16vw,210px)] shrink-0 max-[720px]:hidden"
            style={{
              background:
                'linear-gradient(90deg, rgba(196,155,242,0.55), transparent)',
            }}
          />
        </motion.span>

        {/* Display headline — 3 staggered lines */}
        <h2
          className={cn(
            'font-display font-extrabold text-[#F6F3EE]',
            'text-[clamp(1.95rem,4.4vw,3.7rem)]',
            'leading-[1.04] tracking-[-0.045em]',
            'text-balance',
          )}
        >
          {/* Line 1 */}
          <HeadlineLine delay={0.06} visible={isInView}>
            {data.headlineLine1}
          </HeadlineLine>

          {/* Line 2 — with italic "experience" + drawn underline */}
          <HeadlineLine delay={0.18} visible={isInView}>
            {data.headlineLine2Prefix}
            <span
              className="relative italic text-[#DABDFF]"
              style={{ textShadow: '0 0 32px rgba(176,120,255,0.5)' }}
            >
              {data.headlineLine2Accent}
              <DrawnUnderline visible={isInView} />
            </span>
          </HeadlineLine>

          {/* Line 3 — dimmed coda */}
          <HeadlineLine delay={0.32} visible={isInView} dim>
            {data.headlineLine3}
          </HeadlineLine>
        </h2>

        {/* Footer rule: quote body + mantra */}
        <div
          className={cn(
            'mt-[clamp(2rem,5vh,3.25rem)] pt-[clamp(1.4rem,3vh,2rem)]',
            'grid gap-[clamp(1.5rem,4vw,4rem)]',
            'grid-cols-[minmax(0,1fr)_auto] items-end',
            'border-t border-white/10',
            // Mobile: single column
            'max-[720px]:grid-cols-1',
          )}
        >
          {/* Pull-quote body */}
          <motion.p
            {...reveal(0.52)}
            className={cn(
              'font-display m-0 max-w-[52ch] font-medium italic',
              'text-[clamp(1.05rem,1.5vw,1.32rem)] leading-[1.5]',
              'text-[rgba(246,243,238,0.9)] text-pretty',
              'max-[720px]:mx-auto',
            )}
          >
            {/* Opening quotation mark */}
            <span
              aria-hidden="true"
              className={cn(
                'font-display font-extrabold not-italic text-[#C49BF2]',
                'text-[2.4em] leading-[0] align-[-0.52em]',
                'mr-[0.12em] ml-[-0.04em]',
              )}
              style={{ textShadow: '0 0 22px rgba(176,120,255,0.42)' }}
            >
              &ldquo;
            </span>
            <PortableInline
              value={data.body}
              marks={{
                strong: (chunk) => (
                  <b className="font-semibold text-[#F6F3EE] not-italic">
                    {chunk}
                  </b>
                ),
              }}
            />
            {/* Closing quotation mark */}
            <span
              aria-hidden="true"
              className={cn(
                'font-display font-extrabold not-italic text-[#C49BF2]',
                'text-[2.4em] leading-[0] align-[-0.52em]',
                'ml-[0.08em]',
              )}
              style={{ textShadow: '0 0 22px rgba(176,120,255,0.42)' }}
            >
              &rdquo;
            </span>
          </motion.p>

          {/* Mantra: "Less is more. Built to belong." */}
          <motion.div
            {...reveal(0.7)}
            className={cn(
              'justify-self-end self-end max-[720px]:justify-self-center',
              'inline-flex items-center gap-[12px] whitespace-nowrap',
              'font-display font-bold text-[#F6F3EE]',
              'text-[clamp(0.95rem,1.2vw,1.1rem)] tracking-[0.01em]',
            )}
          >
            {/* Leading rule */}
            <span
              aria-hidden="true"
              className="h-px w-[clamp(20px,3vw,40px)] shrink-0"
              style={{
                background:
                  'linear-gradient(90deg, transparent, rgba(196,155,242,0.7))',
              }}
            />
            <em
              className="not-italic text-[#D2B3F7]"
              style={{ textShadow: '0 0 22px rgba(176,120,255,0.45)' }}
            >
              {data.mantraEmphasis}
            </em>
            {data.mantraRest}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
