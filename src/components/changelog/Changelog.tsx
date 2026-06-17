/**
 * Changelog — hero + release timeline.
 *
 * Server component for the hero; the timeline (with its "Show more" load-more)
 * lives in the client `ChangelogList`. Reveal animation is CSS-only (scoped
 * <style> + stagger via --cl-d) so content is never gated behind hydration
 * (lesson from the blog) and respects prefers-reduced-motion.
 */

import { ChangelogList } from './ChangelogList'
import type { Release } from '@/lib/changelog'

type Props = {
  releases: Release[]
  t: {
    eyebrow: string
    titlePrefix: string
    titleAccent: string
    subtitle: string
    latest: string
    showMore: string
    new: string
    improved: string
    fixed: string
  }
}

export function Changelog({ releases, t }: Props) {
  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section
        aria-label="Changelog"
        className="relative overflow-hidden"
        style={{
          paddingTop: 'calc(var(--navbar-height) + clamp(2.5rem,5vw,4rem))',
          paddingBottom: 'clamp(1.5rem,3vw,2.5rem)',
        }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              'radial-gradient(70% 50% at 50% -10%, rgba(138,50,224,0.1) 0%, transparent 65%)',
          }}
        />
        <div className="container-content max-w-[760px]">
          <span
            className="cl-reveal eyebrow mb-4 inline-flex items-center gap-[6px] text-purple"
            style={{ '--cl-d': '40ms' } as React.CSSProperties}
          >
            <span aria-hidden="true" className="inline-block size-[5px] rounded-full bg-purple" />
            {t.eyebrow}
          </span>
          <h1
            className="cl-reveal font-display text-[clamp(2.4rem,5.5vw,3.75rem)] font-extrabold leading-[1.04] [letter-spacing:-0.04em] text-text [text-wrap:balance]"
            style={{ '--cl-d': '120ms' } as React.CSSProperties}
          >
            {t.titlePrefix}
            <span className="text-purple">{t.titleAccent}</span>
          </h1>
          <p
            className="cl-reveal mt-5 max-w-[60ch] text-[clamp(1rem,1.5vw,1.125rem)] leading-[1.65] text-text-muted"
            style={{ '--cl-d': '200ms' } as React.CSSProperties}
          >
            {t.subtitle}
          </p>
        </div>
      </section>

      {/* ── Timeline (client: load-more) ───────────────────────────────────── */}
      <ChangelogList
        releases={releases}
        labels={{
          latest: t.latest,
          showMore: t.showMore,
          new: t.new,
          improved: t.improved,
          fixed: t.fixed,
        }}
      />

      {/* Scoped, SSR-safe reveal animation (used by hero + list entries) */}
      <style>{`
        @keyframes cl-rise {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .cl-reveal {
          animation: cl-rise 0.6s cubic-bezier(0.23, 1, 0.32, 1) both;
          animation-delay: var(--cl-d, 0ms);
        }
        @media (prefers-reduced-motion: reduce) {
          .cl-reveal { animation: none; }
        }
      `}</style>
    </>
  )
}
