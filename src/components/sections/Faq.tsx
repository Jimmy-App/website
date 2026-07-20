'use client'

import { useState } from 'react'
import { useReducedMotion, m as motion, AnimatePresence } from 'framer-motion'
import type { FaqData } from '@/lib/content'
import {
  LayoutGrid,
  Users,
  Tag,
  Percent,
  Smartphone,
  Layers,
  Dumbbell,
  GraduationCap,
  FlaskConical,
  ShieldCheck,
  ArrowLeftRight,
  Gift,
  TrendingUp,
  CircleX,
  ChevronDown,
  ArrowRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Animation helpers ─────────────────────────────────────────────────────────
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

// ─── Icon maps (ordered to match the FAQ items in Sanity, per page) ───────────
type FaqIcon = React.FC<{ className?: string }>

const ICON_SETS: Record<'home' | 'pricing', FaqIcon[]> = {
  home: [
    ({ className }) => <LayoutGrid className={className} strokeWidth={1.75} />, // what is Jimmy
    ({ className }) => <Users className={className} strokeWidth={1.75} />, // who is it for
    ({ className }) => <Tag className={className} strokeWidth={1.75} />, // cost
    ({ className }) => <Layers className={className} strokeWidth={1.75} />, // vs Skool
    ({ className }) => <Dumbbell className={className} strokeWidth={1.75} />, // vs Trainerize
    ({ className }) => <FlaskConical className={className} strokeWidth={1.75} />, // beta
    ({ className }) => <ShieldCheck className={className} strokeWidth={1.75} />, // security
    ({ className }) => <ArrowLeftRight className={className} strokeWidth={1.75} />, // migration
  ],
  pricing: [
    ({ className }) => <FlaskConical className={className} strokeWidth={1.75} />, // beta −15%
    ({ className }) => <Gift className={className} strokeWidth={1.75} />, // free forever
    ({ className }) => <TrendingUp className={className} strokeWidth={1.75} />, // scaling tiers
    ({ className }) => <Percent className={className} strokeWidth={1.75} />, // transaction fees
    ({ className }) => <Smartphone className={className} strokeWidth={1.75} />, // clients pay?
    ({ className }) => <CircleX className={className} strokeWidth={1.75} />, // cancel anytime
    ({ className }) => <Users className={className} strokeWidth={1.75} />, // team / gym accounts
    ({ className }) => <GraduationCap className={className} strokeWidth={1.75} />, // courses
  ],
}

// ─── Single accordion item ─────────────────────────────────────────────────────
interface FaqItemProps {
  id: string
  question: string
  answer: string
  icon: React.FC<{ className?: string }>
  isOpen: boolean
  onToggle: () => void
  delayMs: number
}

function FaqItem({
  id,
  question,
  answer,
  icon: Icon,
  isOpen,
  onToggle,
  delayMs,
}: FaqItemProps) {
  const reduced = useReducedMotion()
  const answerId = `faq-a${id}`

  return (
    <motion.div
      initial={reduced ? {} : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={
        reduced ? {} : { duration: 0.56, ease: EASE, delay: delayMs / 1000 }
      }
      className={cn(
        'overflow-hidden rounded-2xl border bg-surface',
        'transition-[border-color,box-shadow] duration-[220ms] ease-out',
        'hover:border-purple-border',
        isOpen
          ? 'border-purple-border shadow-[0_12px_34px_-16px_rgba(138,50,224,0.28)]'
          : 'border-border',
      )}
    >
      {/* Question button */}
      <button
        type="button"
        id={`faq-q${id}`}
        aria-expanded={isOpen}
        aria-controls={answerId}
        onClick={onToggle}
        className={cn(
          'flex w-full cursor-pointer items-center gap-[14px]',
          'bg-transparent px-[1.35rem] py-[1.15rem] text-left',
          'max-[540px]:gap-[11px] max-[540px]:px-[1.1rem] max-[540px]:py-4',
        )}
      >
        {/* Icon box */}
        <span
          aria-hidden="true"
          className={cn(
            'flex size-[38px] shrink-0 items-center justify-center rounded-[10px] border',
            'transition-[background,color,border-color] duration-[220ms] ease-out',
            'max-[540px]:size-[34px]',
            isOpen
              ? 'border-transparent bg-purple text-white'
              : 'border-purple-border bg-purple-light text-purple',
          )}
        >
          <Icon className="size-[18px]" />
        </span>

        {/* Question text */}
        <span
          className={cn(
            'min-w-0 flex-1 font-body font-semibold text-text',
            'text-[clamp(0.98rem,1.4vw,1.12rem)] leading-[1.35] tracking-[-0.015em]',
          )}
        >
          {question}
        </span>

        {/* Chevron */}
        <span
          aria-hidden="true"
          className={cn(
            'flex size-[30px] shrink-0 items-center justify-center rounded-full',
            'transition-[transform,color,background] duration-[320ms]',
            '[transition-timing-function:var(--ease-out)]',
            isOpen
              ? 'bg-purple-light text-purple rotate-180'
              : 'bg-surface-2 text-text-muted rotate-0',
          )}
        >
          <ChevronDown className="size-4" strokeWidth={1.75} />
        </span>
      </button>

      {/* Answer region — animated with framer-motion */}
      <div
        id={answerId}
        role="region"
        aria-labelledby={`faq-q${id}`}
      >
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key="answer"
              initial={reduced ? {} : { height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={reduced ? {} : { height: 0, opacity: 0 }}
              transition={
                reduced
                  ? {}
                  : { duration: 0.36, ease: EASE }
              }
              style={{ overflow: 'hidden' }}
            >
              <p
                className={cn(
                  'text-text-muted text-[clamp(0.92rem,1.2vw,1.02rem)] leading-[1.65]',
                  'pb-[1.3rem] pr-[1.35rem] text-pretty',
                  // indent to align with question text (icon 38px + gap 14px + padding 1.35rem)
                  'pl-[calc(1.35rem+38px+14px)]',
                  'max-[540px]:px-[1.1rem]',
                )}
              >
                {answer}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

// ─── FAQ section ──────────────────────────────────────────────────────────────
export function Faq({
  data,
  variant = 'home',
}: {
  data: FaqData
  variant?: 'home' | 'pricing'
}) {
  const ICONS = ICON_SETS[variant]
  const reduced = useReducedMotion()

  // First item open by default
  const [openIndex, setOpenIndex] = useState<number>(0)

  const items = data.items ?? []

  function handleToggle(index: number) {
    // clicking an open item closes it; clicking another opens it
    setOpenIndex((prev) => (prev === index ? -1 : index))
  }

  return (
    <section
      id="faq"
      aria-label={data.sectionLabel ?? ''}
      className={cn(
        'relative overflow-hidden border-t border-border bg-bg',
        // Radial purple glow from top
        '[background-image:radial-gradient(110%_50%_at_50%_-10%,rgba(138,50,224,0.05)_0%,transparent_55%)]',
        'py-[var(--section-pad-y)]',
      )}
    >
      <div
        className={cn(
          'relative mx-auto',
          'max-w-[820px] px-[clamp(1rem,4vw,2.5rem)]',
        )}
      >
        {/* ── Header ── */}
        <motion.header
          initial={reduced ? {} : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduced ? {} : { duration: 0.64, ease: EASE }}
          className="mx-auto mb-[clamp(2.25rem,4vw,3rem)] max-w-[640px] text-center"
        >
          {/* Eyebrow */}
          <p
            className={cn(
              'mb-4 inline-flex items-center gap-[6px]',
              'text-eyebrow font-bold uppercase tracking-[0.1em] text-purple',
            )}
          >
            {/* Dot accent */}
            <span
              aria-hidden="true"
              className="size-[5px] rounded-full bg-purple"
            />
            {data.eyebrow}
          </p>

          {/* Title */}
          <h2
            className={cn(
              'font-display text-h2 font-extrabold text-text',
              'leading-[1.05] tracking-[-0.03em] text-balance',
            )}
          >
            {data.title}
          </h2>
        </motion.header>

        {/* ── Accordion list ── */}
        <div className="flex flex-col gap-3">
          {items.map((item, index) => {
            // Modulo guard: content editors can add more items in Sanity than
            // we have icons — cycling is better than crashing the render.
            const Icon = ICONS[index % ICONS.length]
            return (
              <FaqItem
                key={item._key}
                id={String(index + 1)}
                question={item.question ?? ''}
                answer={item.answer ?? ''}
                icon={Icon}
                isOpen={openIndex === index}
                onToggle={() => handleToggle(index)}
                delayMs={100 + index * 70}
              />
            )
          })}
        </div>

        {/* ── Footer note ── */}
        <motion.p
          initial={reduced ? {} : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            reduced
              ? {}
              : { duration: 0.56, ease: EASE, delay: (100 + items.length * 70) / 1000 }
          }
          className={cn(
            'mt-[clamp(1.75rem,3vw,2.5rem)]',
            'flex flex-wrap items-center justify-center gap-[10px]',
            'text-sm text-text-muted',
          )}
        >
          {data.footNote}{' '}
          <a
            href="https://discord.gg/Rsqh6yZmEM"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'inline-flex items-center gap-[6px] font-semibold text-purple',
              'no-underline transition-[gap] duration-[180ms] ease-out',
              'hover:gap-[9px]',
            )}
          >
            {data.footLink}
            <ArrowRight className="size-[15px]" strokeWidth={1.75} />
          </a>
        </motion.p>
      </div>
    </section>
  )
}
