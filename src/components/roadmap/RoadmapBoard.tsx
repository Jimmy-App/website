/**
 * RoadmapBoard — hero + Now / Next / Later board.
 *
 * Server component; only the per-card vote is a client leaf (VoteButton).
 * Reveal is CSS-only (scoped <style>, stagger via --rm-d) — SSR-safe, no
 * hydration gating, reduced-motion respected.
 */

import { ArrowUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CATEGORY_COLOR, type RoadmapColumn, type RoadmapColumnKey } from '@/lib/roadmap'
import { VoteButton } from './VoteButton'

type Props = {
  columns: RoadmapColumn[]
  t: {
    eyebrow: string
    titlePrefix: string
    titleAccent: string
    subtitle: string
    note: string
    votes: string
    upvote: string
    columns: Record<RoadmapColumnKey, { title: string; sub: string }>
  }
}

// Column dot treatment (Now = live accent, Next = muted, Later = outline)
const DOT_CLASS: Record<RoadmapColumnKey, string> = {
  now: 'bg-purple shadow-[0_0_0_4px_var(--color-purple-light)]',
  next: 'bg-text-muted',
  later: 'bg-transparent shadow-[inset_0_0_0_1.5px_var(--color-text-faint)]',
}
const COL_DELAY: Record<RoadmapColumnKey, number> = { now: 80, next: 140, later: 200 }

export function RoadmapBoard({ columns, t }: Props) {
  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section
        aria-label="Roadmap"
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
            className="rm-reveal eyebrow mb-4 inline-flex items-center gap-[6px] text-purple"
            style={{ '--rm-d': '40ms' } as React.CSSProperties}
          >
            <span aria-hidden="true" className="inline-block size-[5px] rounded-full bg-purple" />
            {t.eyebrow}
          </span>
          <h1
            className="rm-reveal font-display text-[clamp(2.4rem,5.5vw,3.75rem)] font-extrabold leading-[1.04] [letter-spacing:-0.04em] text-text [text-wrap:balance]"
            style={{ '--rm-d': '120ms' } as React.CSSProperties}
          >
            {t.titlePrefix}
            <span className="text-purple">{t.titleAccent}</span>
          </h1>
          <p
            className="rm-reveal mt-5 max-w-[60ch] text-[clamp(1rem,1.5vw,1.125rem)] leading-[1.65] text-text-muted"
            style={{ '--rm-d': '200ms' } as React.CSSProperties}
          >
            {t.subtitle}
          </p>
          <div
            className="rm-reveal mt-6 inline-flex items-center gap-2 rounded-full border border-purple-border bg-purple-light px-3.5 py-2 text-[12.5px] font-medium text-purple"
            style={{ '--rm-d': '280ms' } as React.CSSProperties}
          >
            <ArrowUp size={14} strokeWidth={2.4} className="flex-none" />
            {t.note}
          </div>
        </div>
      </section>

      {/* ── Board ──────────────────────────────────────────────────────────── */}
      <div className="container-content pb-[clamp(2.5rem,5vw,4rem)] pt-[clamp(1rem,2vw,2rem)]">
        <div className="grid items-start gap-[clamp(1rem,2vw,1.5rem)] md:grid-cols-3">
          {columns.map((col) => {
            const meta = t.columns[col.key]
            return (
              <section
                key={col.key}
                className="rm-reveal"
                style={{ '--rm-d': `${COL_DELAY[col.key]}ms` } as React.CSSProperties}
              >
                {/* Column header */}
                <div className="mb-3.5 flex items-center gap-2.5 px-1">
                  <span aria-hidden="true" className={cn('size-[9px] flex-none rounded-full', DOT_CLASS[col.key])} />
                  <h2 className="font-display text-[15px] font-extrabold [letter-spacing:-0.02em] text-text">
                    {meta.title}
                  </h2>
                  <span className="text-[12px] font-medium text-text-faint">{meta.sub}</span>
                  <span className="ml-auto inline-flex min-w-[22px] items-center justify-center rounded-full bg-surface-2 px-1.5 py-0.5 text-[11px] font-bold text-text-muted">
                    {col.cards.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="flex flex-col gap-2.5">
                  {col.cards.map((card) => {
                    const cat = CATEGORY_COLOR[card.category]
                    return (
                      <article
                        key={card.id}
                        className="flex gap-3 rounded-2xl border border-border bg-surface p-3 transition-[box-shadow,transform,border-color] duration-[var(--dur-fast)] hover:-translate-y-0.5 hover:border-purple-border hover:shadow-[var(--shadow-md)]"
                      >
                        <VoteButton
                          id={card.id}
                          base={card.votes}
                          label={t.votes}
                          ariaLabel={`${t.upvote} ${card.title}`}
                        />
                        <div className="min-w-0 flex-1 py-0.5">
                          <span
                            className="inline-flex items-center gap-1.5 rounded-full px-2 py-[3px] text-[10.5px] font-bold"
                            style={{ color: cat.fg, backgroundColor: cat.bg }}
                          >
                            <span className="size-[5px] rounded-full" style={{ backgroundColor: cat.fg }} />
                            {card.categoryLabel}
                          </span>
                          <h3 className="mt-2 font-display text-[16px] font-extrabold leading-[1.2] [letter-spacing:-0.02em] text-text">
                            {card.title}
                          </h3>
                          <p className="mt-1.5 text-[13.5px] leading-[1.5] text-text-muted">{card.desc}</p>
                          <div className="mt-2.5 text-[11.5px] font-semibold text-text-faint">{card.eta}</div>
                        </div>
                      </article>
                    )
                  })}
                </div>
              </section>
            )
          })}
        </div>
      </div>

      {/* Scoped, SSR-safe reveal */}
      <style>{`
        @keyframes rm-rise {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .rm-reveal {
          animation: rm-rise 0.6s cubic-bezier(0.23, 1, 0.32, 1) both;
          animation-delay: var(--rm-d, 0ms);
        }
        @media (prefers-reduced-motion: reduce) {
          .rm-reveal { animation: none; }
        }
      `}</style>
    </>
  )
}
