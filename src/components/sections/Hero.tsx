'use client'

import { useRef } from 'react'
import {
  useReducedMotion,
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
} from 'framer-motion'
import Image from 'next/image'
import {
  Zap,
  ArrowRight,
  CalendarDays,
  CreditCard,
  Users,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Chip } from '@/components/ui/Chip'
import { cn } from '@/lib/utils'
import { appRegisterUrl } from '@/lib/appUrl'
import { smoothScrollToId } from '@/lib/smoothScroll'
import type { HeroData } from '@/lib/content'

// ─── Animation helpers ────────────────────────────────────────────────────────
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

interface RevealMotionProps {
  initial: { opacity?: number; y?: number }
  animate: { opacity?: number; y?: number }
  transition: {
    duration?: number
    ease?: [number, number, number, number]
    delay?: number
  }
}

function useReveal(delayMs: number): RevealMotionProps {
  const reduced = useReducedMotion()
  if (reduced) {
    return { initial: {}, animate: {}, transition: {} }
  }
  return {
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.64, ease: EASE, delay: delayMs / 1000 },
  }
}

// ─── Comparison callout pill ──────────────────────────────────────────────────
function Callout({
  brand,
  miss,
  delayMs,
}: {
  brand: string
  miss: string
  delayMs: number
}) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      initial={reduced ? {} : { opacity: 0, y: 10 }}
      animate={reduced ? {} : { opacity: 1, y: 0 }}
      transition={
        reduced ? {} : { duration: 0.64, ease: EASE, delay: delayMs / 1000 }
      }
      className={cn(
        'flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-[10px]',
        'shadow-[var(--shadow-xs)]',
        'transition-[border-color,box-shadow,background] duration-200',
        'hover:border-purple-border hover:bg-purple-light',
        'hover:shadow-[0_2px_8px_rgba(138,50,224,0.08)]',
      )}
    >
      <span className="text-xs font-medium text-text-muted">{brand}</span>
      <span className="text-xs font-bold text-primary">×</span>
      <span className="text-xs font-normal text-text-faint">{miss}</span>
    </motion.div>
  )
}

// ─── Trust chip ───────────────────────────────────────────────────────────────
function TrustChip({
  icon,
  label,
}: {
  icon: React.ReactNode
  label: string
}) {
  return (
    <Chip
      variant="outline"
      icon={<span className="text-purple [&>svg]:size-[13px]">{icon}</span>}
    >
      {label}
    </Chip>
  )
}

// ─── Scroll-painted illustration backdrop ─────────────────────────────────────
// Two stacked copies of the same illustration: a faint grayscale "pencil
// underpainting" below, and the full-color layer above, revealed top-to-bottom
// by a scroll-linked soft gradient mask — the scene paints itself in as the
// visitor swipes down. Honors prefers-reduced-motion (static full color).
// Bump the version suffix whenever the artwork is swapped — the URL change
// busts browser + next/image caches (mobile has no hard-refresh).
const HERO_BG = '/assets/hero/hero-bg.v4.jpg'

// ─── Hero section ─────────────────────────────────────────────────────────────
export function Hero({ data }: { data: HeroData }) {
  const reduced = useReducedMotion()
  const revealBadge = useReveal(100)
  const revealTitle = useReveal(200)
  const revealSubtitle = useReveal(300)
  const revealDesc = useReveal(400)
  const revealCtas = useReveal(500)
  const revealTrust = useReveal(560)
  const revealProduct = useReveal(960)

  // Paint-in progress: 0 at page top → fully painted after ~55% of the hero
  // has been scrolled past. Starts at 26% so the sky is already "painted".
  const sectionRef = useRef<HTMLElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const painted = useTransform(scrollYProgress, [0, 0.55], [26, 112])
  const paintMask = useMotionTemplate`linear-gradient(to bottom, #000 ${painted}%, transparent calc(${painted}% + 16%))`

  return (
    <section
      id="hero"
      ref={sectionRef}
      aria-label={data.sectionLabel ?? ''}
      className={cn(
        'relative flex min-h-svh flex-col items-center',
        // Navbar offset + section top padding
        'pt-[calc(var(--navbar-height)+var(--space-16))] pb-[var(--space-20)]',
        'px-[clamp(1rem,4vw,2.5rem)]',
        'bg-bg',
      )}
    >
      {/* ── Scroll-painted illustration backdrop ────────────────────── */}
      <div aria-hidden className="absolute inset-0 overflow-hidden">
        {/* Pencil underpainting (always visible, faint) */}
        <Image
          src={HERO_BG}
          alt=""
          fill
          sizes="100vw"
          priority
          className="object-cover object-[center_bottom] opacity-70 grayscale"
        />
        {/* Color layer, painted in on scroll */}
        <motion.div
          className="absolute inset-0"
          style={
            reduced
              ? undefined
              : { WebkitMaskImage: paintMask, maskImage: paintMask }
          }
        >
          <Image
            src={HERO_BG}
            alt=""
            fill
            sizes="100vw"
            priority
            className="object-cover object-[center_bottom]"
          />
        </motion.div>
        {/* Readability veil behind the copy block */}
        <div className="absolute inset-0 [background:radial-gradient(ellipse_62%_44%_at_50%_16%,rgba(255,255,255,0.78)_0%,transparent_70%)]" />
        {/* Fade into the next (white) section */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-bg" />
      </div>

      {/* ── Copy block ────────────────────────────────────────────────── */}
      <div className="relative z-10 flex w-full max-w-[720px] flex-col items-center text-center">

        {/* Eyebrow badge */}
        <motion.div {...revealBadge} className="mb-[var(--space-5)] max-w-full">
          <Chip
            variant="accent"
            className="max-w-full items-center max-sm:whitespace-normal max-sm:text-center max-sm:max-w-[290px] max-sm:px-[16px] max-sm:py-2"
            icon={
              <Zap
                className="size-[13px] shrink-0 text-purple"
                strokeWidth={1.75}
              />
            }
          >
            <span className="eyebrow text-balance max-sm:whitespace-normal max-sm:text-[10px] max-sm:leading-[1.45] max-sm:tracking-[0.05em]">
              {data.badge}
            </span>
          </Chip>
        </motion.div>

        {/* Display headline — accent word in purple */}
        <motion.h1
          {...revealTitle}
          className={cn(
            'font-display text-hero font-extrabold text-text',
            'leading-[1.02] tracking-[var(--tracking-display)]',
            'mb-[var(--space-5)] text-balance',
          )}
        >
          {data.headlinePrefix}
          <span className="text-purple">{data.headlineAccent}</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          {...revealSubtitle}
          className={cn(
            'font-display text-[clamp(1.2rem,2.4vw,1.875rem)] font-medium text-text-muted',
            'tracking-[var(--tracking-tight)] leading-[var(--leading-snug)]',
            'mb-[var(--space-6)] text-balance',
          )}
        >
          {data.subtitle}
        </motion.p>

        {/* Description paragraph */}
        <motion.p
          {...revealDesc}
          className={cn(
            'mx-auto mb-[var(--space-8)] max-w-[520px]',
            'text-lead font-normal leading-[var(--leading-relaxed)] text-text-muted',
          )}
        >
          {data.description}
        </motion.p>

        {/* CTA row */}
        <motion.div
          {...revealCtas}
          className="flex flex-wrap items-center justify-center gap-[var(--space-3)] max-sm:w-full max-sm:flex-col"
        >
          <Button
            href={appRegisterUrl}
            variant="solid"
            size="lg"
            icon={
              <ArrowRight className="size-[15px]" strokeWidth={1.75} />
            }
            className="max-sm:w-full max-sm:justify-center"
          >
            {data.ctaPrimary}
          </Button>
          <Button
            href="#features"
            variant="ghost"
            size="lg"
            className="max-sm:w-full max-sm:justify-center"
            onClick={(e) => {
              e.preventDefault()
              smoothScrollToId('features')
            }}
          >
            {data.ctaSecondary}
          </Button>
        </motion.div>

        {/* Trust chips */}
        <motion.div
          {...revealTrust}
          className="mt-[var(--space-5)] flex flex-wrap items-center justify-center gap-[var(--space-3)]"
        >
          <TrustChip
            icon={<CalendarDays strokeWidth={1.75} />}
            label={data.trustTrial ?? ''}
          />
          <TrustChip
            icon={<CreditCard strokeWidth={1.75} />}
            label={data.trustNoCard ?? ''}
          />
          <TrustChip
            icon={<Users strokeWidth={1.75} />}
            label={data.trustFreeClients ?? ''}
          />
        </motion.div>
      </div>

      {/* ── Comparison callouts ────────────────────────────────────────── */}
      <div
        className={cn(
          'relative z-10 mt-[var(--space-10)] flex w-full max-w-[860px]',
          'flex-wrap items-center justify-center gap-[var(--space-3)]',
          // On mobile stack but hug content (centered) — full-width pills with short
          // text look empty/stretched; content-width chips read cleaner.
          'max-sm:flex-col max-sm:items-center',
        )}
      >
        <Callout brand="Skool" miss={data.calloutSkool ?? ''} delayMs={620} />
        <Callout brand="WhatsApp" miss={data.calloutWhatsapp ?? ''} delayMs={720} />
        <Callout brand="TrainHeroic" miss={data.calloutTrainheroic ?? ''} delayMs={820} />
      </div>

      {/* ── Product showcase ───────────────────────────────────────────── */}
      <motion.div
        {...revealProduct}
        className="relative z-10 mt-[var(--space-10)] w-full max-w-[960px]"
      >
        {/* Meta label */}
        <div className="mb-[var(--space-5)] text-center">
          <span className="eyebrow mb-[var(--space-2)] block text-purple">
            {data.productLabel}
          </span>
          <span className="block text-xs text-text-muted">
            {data.productSubtext}
          </span>
        </div>

        {/* White rounded product frame */}
        <div
          className={cn(
            'flex min-h-[320px] items-center justify-center overflow-hidden',
            'rounded-2xl border border-border bg-surface p-[var(--space-2)]',
            'shadow-[var(--shadow-xl)]',
            'max-sm:min-h-[200px]',
          )}
        >
          {/* Coach Dashboard product frame — full-bleed screenshot */}
          <Image
            src="/assets/screens/dashboard-new.png"
            alt={data.productImageAlt ?? ''}
            width={3024}
            height={1796}
            priority
            className="block h-auto w-full rounded-xl"
          />
        </div>

        {/* Italic brand note — sits on the illustration's meadow, needs a
            white glow + stronger ink to stay readable */}
        <p
          className={cn(
            'mt-[var(--space-4)] text-center font-display text-xs italic text-text-muted',
            '[text-shadow:0_0_6px_rgba(255,255,255,0.95),0_0_14px_rgba(255,255,255,0.8)]',
          )}
        >
          {data.brandNote}
        </p>
      </motion.div>
    </section>
  )
}
