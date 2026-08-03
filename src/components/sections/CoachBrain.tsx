import { Brain, Sparkles, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CoachBrainDemo } from './CoachBrainDemo'
import { WaitlistForm } from '@/components/waitlist/WaitlistForm'
import type { CoachBrainData } from '@/lib/content'

// Icons stay code-side and are picked by key, the same contract the feature
// pages use — Sanity holds copy, not component references.
const ICONS: Record<string, typeof Brain> = {
  brain: Brain,
  sparkles: Sparkles,
  refresh: RefreshCw,
}

export const COACH_BRAIN_SOURCE = 'coach-brain-waitlist'

export function CoachBrain({ data }: { data: CoachBrainData | null }) {
  const blocks = data?.blocks ?? []
  if (!data || blocks.length === 0) return null

  return (
    <section
      id="coach-brain"
      aria-label={data.eyebrow ?? 'Coach Brain'}
      className="relative overflow-hidden border-t border-border bg-surface py-[var(--section-pad-y)]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-[15%] left-1/2 h-[60%] w-[70%] -translate-x-1/2"
        style={{
          background:
            'radial-gradient(ellipse 55% 60% at 50% 0%, rgba(138,50,224,0.10) 0%, transparent 70%)',
        }}
      />

      <div className="relative mx-auto max-w-[1120px] px-[clamp(1rem,4vw,2.5rem)]">
        <header className="mx-auto mb-[clamp(2.5rem,5vw,3.75rem)] max-w-[720px] text-center">
          <p className="mb-4 inline-flex items-center gap-[7px] text-[11px] font-bold uppercase tracking-[0.1em] text-purple">
            <span
              aria-hidden="true"
              className="inline-block h-[5px] w-[5px] rounded-full bg-purple"
            />
            {data.eyebrow}
            {data.badge && (
              <span className="rounded-full bg-surface-offset px-[8px] py-[3px] text-[10px] tracking-[0.06em] text-text-muted">
                {data.badge}
              </span>
            )}
          </p>

          <h2 className="mb-4 text-balance font-display text-[clamp(2rem,4vw,3.25rem)] font-extrabold leading-[1.05] tracking-[-0.035em] text-text">
            {data.title?.prefix}
            <span className="text-purple">{data.title?.accent}</span>
            {data.title?.suffix}
          </h2>
          <p className="text-balance text-[clamp(1rem,1.5vw,1.125rem)] leading-[1.6] text-text-muted">
            {data.subtitle}
          </p>
        </header>

        <CoachBrainDemo caption={data.demoCaption ?? ''} />

        <div className="grid gap-[18px] md:grid-cols-3">
          {blocks.map((b, i) => {
            const Icon = ICONS[b?.iconKey ?? ''] ?? Brain
            return (
              <article
                key={b?._key ?? i}
                className={cn(
                  'group/card relative flex flex-col rounded-[24px] border border-border bg-surface-2 p-[clamp(22px,2.2vw,30px)]',
                  'transition-[transform,box-shadow,border-color] duration-200 [transition-timing-function:var(--ease-out)]',
                  'hover:-translate-y-[3px] hover:border-purple-border hover:shadow-[0_18px_44px_-22px_rgba(138,50,224,0.32)]',
                )}
              >
                <span
                  className={cn(
                    'mb-[18px] flex h-[38px] w-[38px] items-center justify-center rounded-[11px]',
                    'bg-purple-light text-purple transition-transform duration-200 [transition-timing-function:var(--ease-out)]',
                    'group-hover/card:scale-[1.06]',
                  )}
                >
                  <Icon size={18} strokeWidth={2.2} aria-hidden="true" />
                </span>

                <p className="mb-[10px] text-[10.5px] font-bold uppercase tracking-[0.1em] text-text-faint">
                  {b?.label}
                </p>
                <p className="mb-[10px] font-display text-[19px] font-extrabold leading-[1.25] tracking-[-0.02em] text-text">
                  {b?.lead}
                </p>
                {/* flex-1, not mt-auto: with mt-auto the dividers landed at three
                    different heights because the bodies differ in length. */}
                <p className="mb-[18px] flex-1 text-[14.5px] leading-[1.6] text-text-muted">
                  {b?.body}
                </p>

                {/* Reserved for two lines so the dividers sit on one line across
                    the row — one pull quote wraps, the others don't. */}
                <p className="min-h-[57px] border-t border-[var(--color-divider)] pt-[16px] text-[14px] font-semibold leading-[1.45] text-purple">
                  {b?.pull}
                </p>
              </article>
            )
          })}
        </div>

        {/* The form was floating in whitespace after three strong cards and
            read as an afterthought. A quiet panel anchors it as the section's
            conclusion without competing with the cards above. */}
        <div
          className={cn(
            'mx-auto mt-[clamp(2.25rem,4vw,3rem)] flex max-w-[560px] flex-col items-center',
            'rounded-[24px] border border-purple-border bg-purple-light/40',
            'px-[clamp(20px,3vw,32px)] py-[clamp(24px,3vw,32px)]',
          )}
        >
          <p className="mb-[14px] text-center font-display text-[19px] font-extrabold tracking-[-0.02em] text-text">
            {data.waitlistTitle}
          </p>
          <WaitlistForm
            source={COACH_BRAIN_SOURCE}
            labels={{
              placeholder: data.formPlaceholder ?? '',
              cta: data.formCta ?? '',
              ctaLoading: data.formCtaLoading ?? '',
              ctaDone: data.formCtaDone ?? '',
              hintIdle: data.formHintIdle ?? '',
              hintDone: data.formHintDone ?? '',
              hintError: data.formHintError ?? '',
            }}
          />
        </div>
      </div>
    </section>
  )
}
