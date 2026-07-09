'use client'

/**
 * FeatureHero — Split layout hero with live animated demo.
 *
 * LEFT  — breadcrumb, audience badge, H1, highlight sub-line, lead, CTAs, tags
 * RIGHT — framed live demo panel (useInView triggers playback)
 *
 * Mobile: stacks vertically (text first, demo below).
 * Demo activates when the panel scrolls into view, respecting prefers-reduced-motion.
 */

import { useRef } from 'react'
import { useInView } from 'framer-motion'
import { ChevronRight, ArrowRight } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { appRegisterUrl } from '@/lib/appUrl'
import { calTriggerProps } from '@/lib/cal'
import { FeatureDemo } from './FeatureDemo'
import { FeatureVideo } from './FeatureVideo'
import { FEATURE_ICON_MAP } from './featureMeta'
import type { Feature } from '@/lib/features'

// ── Entrance animation: CSS-only stagger (no JS-gate, no hydration wait) ───────
// Each child gets an animation-delay so they rise in sequence the moment the
// CSS is parsed. We don't use opacity:0 + JS to reveal — that gates content
// behind hydration (lesson from the blog).
const STAGGER_STYLE = (i: number): React.CSSProperties => ({
  animationDelay: `${i * 70}ms`,
})

// ── Props ──────────────────────────────────────────────────────────────────────
type Props = {
  feature: Feature
  /** Localised UI chrome */
  t: {
    breadcrumbHome: string
    breadcrumbFeatures: string
    forCoaches: string
    startFree: string
    bookDemo: string
  }
}

export function FeatureHero({ feature, t }: Props) {
  const panelRef = useRef<HTMLDivElement>(null)
  // Demo activates when any part of the panel scrolls into view
  const inView = useInView(panelRef, { amount: 'some', once: false })

  const FeatureIcon = FEATURE_ICON_MAP[feature.iconKey]

  return (
    <section
      aria-label={`${feature.name} hero`}
      className="relative overflow-hidden"
      style={{
        paddingTop: 'calc(var(--navbar-height) + clamp(2rem,4vw,3.5rem))',
        paddingBottom: 'clamp(3rem, 5vw, 5rem)',
      }}
    >
      {/* Purple hero glow — matches homepage */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(80% 50% at 50% -10%, rgba(138,50,224,0.11) 0%, transparent 65%)',
        }}
      />

      <div className="container-content">
        <div
          className={cn(
            'grid gap-[clamp(2.5rem,5vw,5rem)] items-center',
            'lg:grid-cols-[1fr_1fr]',
          )}
        >
          {/* ── LEFT: text content ──────────────────────────────────── */}
          <div>
            {/* Breadcrumb */}
            <nav
              aria-label="Breadcrumb"
              className="feature-hero-reveal mb-[clamp(1.25rem,2.5vw,1.75rem)] flex flex-wrap items-center gap-1 text-[12.5px] text-text-muted"
              style={STAGGER_STYLE(0)}
            >
              <Link href="/" className="transition-colors hover:text-purple">
                {t.breadcrumbHome}
              </Link>
              <ChevronRight className="size-3 text-text-faint" aria-hidden="true" />
              <span className="text-text-faint">{t.breadcrumbFeatures}</span>
              <ChevronRight className="size-3 text-text-faint" aria-hidden="true" />
              <span className="text-text">{feature.name}</span>
            </nav>

            {/* Audience badge */}
            <div
              className="feature-hero-reveal mb-[clamp(1rem,2vw,1.5rem)]"
              style={STAGGER_STYLE(1)}
            >
              <span className="inline-flex items-center gap-[7px] rounded-full border border-purple-border bg-purple-light px-3 py-[6px] text-[11.5px] font-bold text-purple">
                {FeatureIcon && (
                  <FeatureIcon size={13} strokeWidth={2} className="text-purple" />
                )}
                {t.forCoaches}
              </span>
            </div>

            {/* H1 */}
            <h1
              className="feature-hero-reveal mb-[clamp(1rem,2vw,1.25rem)] font-display text-[clamp(2.4rem,5vw,3.75rem)] font-extrabold leading-[1.05] [letter-spacing:-0.04em] text-text [text-wrap:balance]"
              style={STAGGER_STYLE(2)}
            >
              {feature.title.prefix}
              <span className="text-purple">{feature.title.accent}</span>
              {feature.title.suffix && feature.title.suffix}
            </h1>

            {/* Highlight sub-line */}
            <p
              className="feature-hero-reveal mb-[clamp(0.75rem,1.5vw,1rem)] font-display text-[clamp(1.1rem,2vw,1.375rem)] font-bold leading-[1.25] [letter-spacing:-0.025em] text-text"
              style={STAGGER_STYLE(3)}
            >
              {feature.highlight.prefix}
              <span className="text-purple">{feature.highlight.accent}</span>
            </p>

            {/* Lead */}
            <p
              className="feature-hero-reveal mb-[clamp(1.5rem,3vw,2rem)] max-w-[50ch] text-[clamp(0.9375rem,1.4vw,1.0625rem)] leading-[1.7] text-text-muted"
              style={STAGGER_STYLE(4)}
            >
              {feature.lead}
            </p>

            {/* CTAs */}
            <div
              className="feature-hero-reveal mb-[clamp(1.25rem,2.5vw,1.75rem)] flex flex-wrap gap-3"
              style={STAGGER_STYLE(5)}
            >
              <a
                href={appRegisterUrl}
                className="inline-flex items-center gap-2 rounded-full bg-purple px-5 py-[11px] text-[14px] font-semibold text-white shadow-[0_2px_12px_rgba(138,50,224,0.28)] transition-[background,box-shadow,transform] duration-[var(--dur-fast)] hover:bg-purple-hover hover:shadow-[0_4px_20px_rgba(138,50,224,0.4)] hover:-translate-y-px active:translate-y-0 active:bg-purple-active"
              >
                {t.startFree}
                <ArrowRight size={15} strokeWidth={2} />
              </a>
              <button
                type="button"
                {...calTriggerProps}
                className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[var(--color-ghost-border)] bg-transparent px-5 py-[11px] text-[14px] font-semibold text-text transition-[background,border-color] duration-[var(--dur-fast)] hover:border-[var(--color-ghost-border-h)] hover:bg-[var(--color-ghost-hover)]"
              >
                {t.bookDemo}
              </button>
            </div>

            {/* Tag chips */}
            <div
              className="feature-hero-reveal flex flex-wrap gap-[6px]"
              style={STAGGER_STYLE(6)}
            >
              {feature.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border bg-surface px-3 py-[5px] text-[12px] font-medium text-text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* ── RIGHT: live demo panel ──────────────────────────────── */}
          <div
            ref={panelRef}
            className="feature-hero-reveal relative"
            style={STAGGER_STYLE(2)}
          >
            {/* Soft purple radial glow behind the panel */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-8 -z-10 opacity-60"
              style={{
                background:
                  'radial-gradient(60% 55% at 50% 50%, rgba(138,50,224,0.14) 0%, transparent 70%)',
              }}
            />

            {/* Demo / media frame.
                Real video media fills the frame edge-to-edge (it carries its own
                scene); animated demos keep inner padding on the white surface. */}
            <div
              className={cn(
                'rounded-[24px] border border-border bg-surface shadow-[var(--shadow-md)]',
                'overflow-hidden',
                feature.media ? 'p-0' : 'p-3 sm:p-4',
              )}
              aria-hidden="true"
            >
              {feature.media ? (
                <FeatureVideo media={feature.media} active={inView} />
              ) : (
                <FeatureDemo demoKey={feature.demoKey} active={inView} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CSS entrance animation — defined here so it's scoped and SSR-safe */}
      <style>{`
        @keyframes feature-hero-rise {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .feature-hero-reveal {
          animation: feature-hero-rise 0.55s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @media (prefers-reduced-motion: reduce) {
          .feature-hero-reveal {
            animation: none;
          }
        }
      `}</style>
    </section>
  )
}
