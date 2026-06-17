'use client'

/**
 * ChangelogList — the release timeline with a "Show more" (load-more) control.
 *
 * Renders the first `INITIAL` releases; older ones reveal in batches on click so
 * a long history never makes the page huge. Newly revealed entries animate in
 * with the same `cl-reveal` keyframe (reduced-motion safe via the shared style).
 */

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Change, ChangeType, Release } from '@/lib/changelog'

const INITIAL = 5
const BATCH = 5

type Labels = {
  latest: string
  showMore: string
  new: string
  improved: string
  fixed: string
}

const TAG_CLASS: Record<ChangeType, string> = {
  new: 'text-purple bg-purple-light border-purple-border',
  improved: 'text-[#15885A] bg-[#E6F4EC] border-[rgba(21,136,90,0.24)]',
  fixed: 'text-text-muted bg-surface-2 border-border',
}

function ChangeLine({ change, label }: { change: Change; label: string }) {
  return (
    <li className="grid grid-cols-[72px_minmax(0,1fr)] items-start gap-3 px-4 py-3">
      <span
        className={cn(
          'mt-px inline-flex w-fit items-center justify-self-start rounded-full border px-2 py-[3px] text-[10px] font-bold uppercase tracking-[0.04em]',
          TAG_CLASS[change.type],
        )}
      >
        {label}
      </span>
      <span className="text-[13.5px] leading-[1.55] text-text-muted">
        {change.text.map((seg, i) =>
          typeof seg === 'string' ? (
            seg
          ) : (
            <strong key={i} className="font-semibold text-text">
              {seg.b}
            </strong>
          ),
        )}
      </span>
    </li>
  )
}

function ReleaseEntry({
  r,
  index,
  labels,
}: {
  r: Release
  index: number
  labels: Labels
}) {
  const tagLabel: Record<ChangeType, string> = {
    new: labels.new,
    improved: labels.improved,
    fixed: labels.fixed,
  }

  return (
    <li
      className={cn(
        'cl-reveal grid gap-x-[clamp(1.25rem,4vw,3rem)] gap-y-3 max-md:gap-y-3.5 md:grid-cols-[140px_minmax(0,1fr)]',
        // mobile: hairline separator between releases (timeline rail is desktop-only)
        index > 0 && 'max-md:border-t max-md:border-divider max-md:pt-8',
      )}
      style={{ '--cl-d': `${Math.min(index, 5) * 55 + 40}ms` } as React.CSSProperties}
    >
      {/* Aside: date + version */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 md:sticky md:top-24 md:block md:self-start md:pt-[2px]">
        <time
          dateTime={r.date}
          className="font-display text-[15px] font-bold [letter-spacing:-0.01em] text-text"
        >
          {r.dateLabel}
        </time>
        <div className="flex flex-wrap items-center gap-2 md:mt-2.5">
          {index === 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-light px-2.5 py-1 text-[11px] font-bold text-purple">
              <span className="relative flex size-[5px]">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-purple opacity-70" />
                <span className="relative inline-flex size-[5px] rounded-full bg-purple" />
              </span>
              {labels.latest}
            </span>
          )}
          <span className="inline-flex items-center rounded-full border border-border bg-surface px-2.5 py-1 font-mono text-[11px] font-semibold text-text-muted">
            {r.version}
          </span>
        </div>
      </div>

      {/* Main: timeline rail (desktop) + content */}
      <div className="relative pb-[clamp(2.5rem,5vw,4rem)] last:pb-2 max-md:pb-0 md:border-l md:border-border md:pl-[clamp(1.5rem,3vw,2.25rem)]">
        <span
          aria-hidden="true"
          className="absolute -left-[6.5px] top-[5px] hidden size-3 rounded-full bg-purple ring-4 ring-[var(--color-bg)] md:block"
        />

        <div className="mb-3.5 flex flex-wrap gap-[6px]">
          {r.tags.map((type) => (
            <span
              key={type}
              className={cn(
                'inline-flex items-center rounded-full border px-2.5 py-[3px] text-[10.5px] font-bold uppercase tracking-[0.05em]',
                TAG_CLASS[type],
              )}
            >
              {tagLabel[type]}
            </span>
          ))}
        </div>

        <h2 className="font-display text-[clamp(1.35rem,2.6vw,1.85rem)] font-extrabold leading-[1.12] [letter-spacing:-0.03em] text-text [text-wrap:balance]">
          {r.title}
        </h2>
        <p className="mt-2.5 max-w-[56ch] text-[15.5px] leading-[1.6] text-text-muted [text-wrap:pretty]">
          {r.lead}
        </p>

        {r.image && (
          <div className="relative mt-5 aspect-[16/10] overflow-hidden rounded-2xl border border-border bg-surface-2 shadow-[var(--shadow-sm)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={r.image.src}
              alt={r.image.alt}
              loading="lazy"
              className="absolute inset-0 size-full object-cover object-top"
            />
          </div>
        )}

        <ul className="mt-5 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface">
          {r.changes.map((change, ci) => (
            <ChangeLine key={ci} change={change} label={tagLabel[change.type]} />
          ))}
        </ul>
      </div>
    </li>
  )
}

export function ChangelogList({
  releases,
  labels,
}: {
  releases: Release[]
  labels: Labels
}) {
  const [visible, setVisible] = useState(INITIAL)
  const shown = releases.slice(0, visible)
  const remaining = releases.length - visible

  return (
    <div className="container-content max-w-[860px] pb-[var(--section-pad-y)] pt-[clamp(1.5rem,3vw,2.5rem)]">
      <ol className="flex flex-col">
        {shown.map((r, i) => (
          <ReleaseEntry key={r.version} r={r} index={i} labels={labels} />
        ))}
      </ol>

      {remaining > 0 && (
        <div className="mt-2 flex justify-center max-md:mt-6">
          <button
            type="button"
            onClick={() => setVisible((v) => v + BATCH)}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-[11px] text-[13.5px] font-semibold text-text transition-[background,border-color,transform] duration-[var(--dur-fast)] hover:border-purple-border hover:bg-purple-light hover:text-purple active:translate-y-px"
          >
            {labels.showMore}
            <span className="text-text-faint">({remaining})</span>
            <ChevronDown size={15} strokeWidth={2.25} />
          </button>
        </div>
      )}
    </div>
  )
}
