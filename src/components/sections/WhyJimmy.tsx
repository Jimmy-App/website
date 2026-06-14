'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'

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

export default function WhyJimmy() {
  const t = useTranslations('why')
  const prefersReducedMotion = useReducedMotion()
  const [active, setActive] = useState<State>('without')

  // Tool cards for the "without" preview
  const toolCards: ToolCardData[] = [
    {
      emoji: '💬',
      bg: '#E8F5E9',
      name: t('preview.without.card1.name'),
      desc: t('preview.without.card1.desc'),
    },
    {
      emoji: '📊',
      bg: '#E3F2FD',
      name: t('preview.without.card2.name'),
      desc: t('preview.without.card2.desc'),
    },
    {
      emoji: '💳',
      bg: '#FFF8E1',
      name: t('preview.without.card3.name'),
      desc: t('preview.without.card3.desc'),
    },
    {
      emoji: '📅',
      bg: '#FCE4EC',
      name: t('preview.without.card4.name'),
      desc: t('preview.without.card4.desc'),
    },
  ]

  const withoutBullets = t.raw('bullets.without') as string[]
  const withBullets = t.raw('bullets.with') as string[]
  const currentBullets = active === 'without' ? withoutBullets : withBullets

  // Framer-motion variants
  const fadeVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  }

  const riseVariants = {
    hidden: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.68, ease: [0.16, 1, 0.3, 1] as const },
    },
  }

  const textTransition = { duration: 0.19, ease: 'easeInOut' as const }

  return (
    <section
      id="why-jimmy"
      aria-label={t('ariaLabel')}
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
                'absolute inset-0 p-7 flex flex-col transition-opacity duration-[380ms] ease-[ease]',
                active === 'without'
                  ? 'opacity-100 pointer-events-auto'
                  : 'opacity-0 pointer-events-none',
              )}
              aria-hidden={active !== 'without'}
            >
              <PreviewTab
                variant="without"
                label={t('toggle.without')}
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
                'absolute inset-0 p-7 flex flex-col transition-opacity duration-[380ms] ease-[ease]',
                active === 'with'
                  ? 'opacity-100 pointer-events-auto'
                  : 'opacity-0 pointer-events-none',
              )}
              aria-hidden={active !== 'with'}
            >
              <PreviewTab variant="with" label={t('toggle.with')} />
              <div className="flex-1 rounded-[12px] overflow-hidden border border-border bg-surface min-h-0">
                <Image
                  src="/assets/screens/dashboard.png"
                  alt={t('preview.with.imgAlt')}
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
              {t('heading.line1')}{' '}
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
              {t('heading.line2')}{' '}
              <br />
              <span className="whitespace-nowrap">
                {t('heading.line3')}{' '}
                <span className="text-purple">{t('heading.accent')}</span>
              </span>
            </h2>

            {/* Toggle pill */}
            <div
              className={cn(
                'inline-flex items-center self-start',
                'bg-surface-2 border border-border rounded-full p-1 gap-0.5 mb-6',
              )}
              role="group"
              aria-label={t('toggle.ariaLabel')}
            >
              {(['without', 'with'] as const).map((state) => (
                <button
                  key={state}
                  onClick={() => setActive(state)}
                  aria-pressed={active === state}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full px-[18px] py-[9px]',
                    'max-sm:px-[14px] max-sm:py-2 max-sm:text-[13px]',
                    'font-body text-[14px] font-medium text-text-muted whitespace-nowrap',
                    'transition-[background,color,box-shadow] duration-[220ms]',
                    'cursor-pointer',
                    active === state && [
                      'bg-surface text-text font-semibold',
                      'shadow-[0_1px_6px_rgba(0,0,0,0.10),0_1px_2px_rgba(0,0,0,0.06)]',
                    ],
                  )}
                >
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
                  {t(`toggle.${state}`)}
                </button>
              ))}
            </div>

            {/* Description — fades on switch */}
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={`desc-${active}`}
                variants={fadeVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={textTransition}
                className="text-[15px] text-text-muted leading-[1.65] mb-7 max-w-[460px]"
              >
                {t(`desc.${active}`)}
              </motion.p>
            </AnimatePresence>

            {/* Dashed divider */}
            <hr
              className="border-none h-px mb-7"
              style={{
                background:
                  'repeating-linear-gradient(90deg, var(--color-border) 0, var(--color-border) 6px, transparent 6px, transparent 14px)',
              }}
            />

            {/* Bullets grid — fades on switch */}
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`bullets-${active}`}
                variants={fadeVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={textTransition}
                className="grid grid-cols-2 max-sm:grid-cols-1 gap-x-8 gap-y-[1.1rem]"
              >
                {currentBullets.map((text, i) => (
                  <BulletItem key={i} text={text} muted={active === 'without'} />
                ))}
              </motion.div>
            </AnimatePresence>

          </div>
        </motion.div>
      </div>
    </section>
  )
}
