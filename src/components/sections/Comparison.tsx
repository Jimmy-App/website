import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import { Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'

// ── Data: competitors + feature matrix ───────────────────────────────────────

/**
 * Columns: [Jimmy, Skool, Trainerize, TrueCoach, WhatsApp]
 * true  = has the feature (Check)
 * false = missing (X)
 */
const FEATURE_MATRIX: boolean[][] = [
  // Structured workout builder
  [true, false, true, true, false],
  // Community feed
  [true, true, false, false, false],
  // Course Builder (modules/lessons)
  [true, true, false, false, false],
  // Native iOS/Android app
  [true, false, true, true, true],
  // Integrated 1:1 messaging
  [true, false, true, true, true],
  // Payments & subscriptions
  [true, true, true, false, false],
  // Progress tracking
  [true, false, true, true, false],
  // Workout templates
  [true, false, true, true, false],
]

const SCORES = ['8/8', '3/8', '6/8', '5/8', '2/8'] as const

// ── Sub-components ─────────────────────────────────────────────────────────────

function MarkYes({ isJimmy }: { isJimmy: boolean }) {
  return (
    <span
      className={cn(
        'flex items-center justify-center rounded-full flex-shrink-0 transition-transform duration-200 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]',
        'group-hover/row:scale-[1.08]',
        isJimmy
          ? 'w-8 h-8 shadow-[0_6px_16px_-3px_rgba(138,50,224,0.5)] [background:linear-gradient(140deg,#9D4BEA_0%,#7A24CC_100%)] text-white'
          : 'w-[27px] h-[27px] bg-[#E7F7EE] text-[#16A368] shadow-[inset_0_0_0_1px_rgba(22,163,104,0.14)]',
      )}
      aria-label="supported"
    >
      <Check
        strokeWidth={isJimmy ? 2.5 : 3}
        size={isJimmy ? 15 : 13}
      />
    </span>
  )
}

function MarkNo() {
  return (
    <span
      className="w-[27px] h-[27px] flex items-center justify-center rounded-full flex-shrink-0 bg-surface-offset text-text-faint transition-transform duration-200 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover/row:scale-[1.08]"
      aria-label="not supported"
    >
      <X strokeWidth={3} size={13} />
    </span>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

export async function Comparison() {
  const t = await getTranslations('comparison')

  const competitors = t.raw('competitors') as string[]
  const features = t.raw('features') as string[]
  const scores = SCORES

  return (
    <section
      id="comparison"
      aria-label={t('ariaLabel')}
      className="relative bg-surface-2 border-t border-border overflow-hidden py-[var(--section-pad-y)]"
    >
      {/* Ambient radial glow */}
      <div
        aria-hidden="true"
        className="absolute -top-[10%] left-1/2 -translate-x-1/2 w-[60%] h-[50%] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 60% at 50% 0%, rgba(138,50,224,0.08) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-[1120px] mx-auto px-[clamp(1rem,4vw,2.5rem)]">

        {/* ── Header ── */}
        <header className="text-center max-w-[680px] mx-auto mb-[clamp(2.5rem,5vw,3.75rem)]">
          {/* Eyebrow */}
          <p className="inline-flex items-center gap-[6px] text-[11px] font-bold uppercase tracking-[0.1em] text-purple mb-4">
            <span
              aria-hidden="true"
              className="w-[5px] h-[5px] rounded-full bg-purple inline-block"
            />
            {t('eyebrow')}
          </p>

          <h2 className="font-display text-[clamp(2rem,4vw,3.25rem)] font-extrabold text-text tracking-[-0.035em] leading-[1.05] mb-4 text-balance">
            {t('title')}
          </h2>
          <p className="text-[clamp(1rem,1.5vw,1.125rem)] text-text-muted leading-[1.6] text-balance">
            {t('subtitle')}
          </p>
        </header>

        {/*
          Scroll + visual container. The rounded corners, border and shadow live
          HERE (not on the grid) so the table can stay rounded AND the frozen
          FEATURE column can be `position: sticky` relative to this scroll box.
          (Putting overflow on the grid would either break the rounding or break
          sticky.) On desktop the grid fits so nothing scrolls.
        */}
        <div
          className={cn(
            'relative bg-surface border border-border rounded-[24px]',
            'shadow-[0_28px_70px_-28px_rgba(138,50,224,0.22),0_6px_28px_rgba(26,25,23,0.06)]',
            'overflow-hidden',
            'max-[860px]:overflow-x-auto max-[860px]:[-webkit-overflow-scrolling:touch]',
          )}
        >

          {/*
            Grid: 6 columns — feature-name col (1.6fr) + 5 competitor cols (1fr each)
            All cells are flat grid items (no nested rows).
            Row hover is driven by CSS group — each logical row is wrapped in a
            <div role="row"> group so hover propagates to all 6 sibling cells.
            We render header / body rows / footer as separate groups of 6 cells.
          */}
          <div
            role="table"
            aria-label={t('tableAriaLabel')}
            className={cn(
              'grid min-w-[760px] max-[860px]:min-w-[680px] relative',
              '[grid-template-columns:minmax(200px,1.6fr)_repeat(5,minmax(102px,1fr))]',
            )}
          >

            {/* ── Header row ── */}
            {/* Feature label */}
            <div
              role="columnheader"
              className={cn(
                'flex items-center justify-start z-[1]',
                'px-[clamp(20px,2.4vw,32px)] py-[22px]',
                'border-b-[1.5px] border-border',
                'text-text-faint font-semibold text-[12px] uppercase tracking-[0.08em]',
                // Frozen first column on mobile
                'max-[860px]:sticky max-[860px]:left-0 max-[860px]:z-[3] max-[860px]:bg-surface',
              )}
            >
              {t('featureColumnLabel')}
            </div>

            {/* Jimmy header cell */}
            <div
              role="columnheader"
              className={cn(
                'flex items-center justify-center z-[1]',
                'py-[22px] px-3',
                'border-b-[1.5px] border-purple-border',
                'shadow-[inset_1.5px_0_0_var(--color-purple-border),inset_-1.5px_0_0_var(--color-purple-border),inset_0_1.5px_0_var(--color-purple-border)]',
                '[background:linear-gradient(180deg,rgba(138,50,224,0.16)_0%,rgba(138,50,224,0.07)_100%)]',
                'rounded-tl-[16px] rounded-tr-[16px]',
              )}
            >
              <div className="flex flex-col items-center justify-center">
                {/* Logo + name */}
                <div className="flex flex-row items-center justify-center gap-[9px]">
                  <Image
                    src="/assets/logo/logo.svg"
                    alt="Jimmy logo"
                    width={30}
                    height={30}
                    className="rounded-[8px] shadow-[0_3px_10px_rgba(138,50,224,0.3)]"
                  />
                  <span className="font-display text-[18px] font-extrabold text-purple tracking-[-0.02em]">
                    Jimmy
                  </span>
                </div>
              </div>
            </div>

            {/* Competitor header cells */}
            {competitors.map((name) => (
              <div
                key={name}
                role="columnheader"
                className={cn(
                  'flex items-center justify-center z-[1]',
                  'py-[22px] px-3',
                  'border-b-[1.5px] border-border',
                )}
              >
                <span className="font-display text-[17px] font-extrabold text-text tracking-[-0.02em] whitespace-nowrap">
                  {name}
                </span>
              </div>
            ))}

            {/* ── Feature rows ── */}
            {features.map((feature, rowIdx) => {
              const row = FEATURE_MATRIX[rowIdx]
              if (!row) return null

              return (
                // group/row — when hovered, all cells in this logical row react
                <div key={feature} role="row" className="group/row contents">
                  {/* Feature name cell */}
                  <div
                    role="rowheader"
                    className={cn(
                      'relative flex items-center z-[1]',
                      'justify-start text-left',
                      'text-[15.5px] font-semibold text-text tracking-[-0.01em]',
                      'px-[clamp(20px,2.4vw,32px)] py-[19px] gap-[10px]',
                      'border-b border-[var(--color-divider)]',
                      'transition-colors duration-[160ms] ease-out',
                      'group-hover/row:text-text',
                      // Frozen first column on mobile (opaque so competitor cells scroll under)
                      'max-[860px]:sticky max-[860px]:left-0 max-[860px]:z-[2] max-[860px]:bg-surface',
                    )}
                  >
                    {feature}
                  </div>

                  {/* Jimmy cell */}
                  <div
                    role="cell"
                    className={cn(
                      'relative flex items-center justify-center z-[1]',
                      'py-[19px] px-3',
                      'border-b border-[var(--color-divider)]',
                      'shadow-[inset_1.5px_0_0_var(--color-purple-border),inset_-1.5px_0_0_var(--color-purple-border)]',
                      '[background:linear-gradient(180deg,rgba(138,50,224,0.085)_0%,rgba(138,50,224,0.035)_100%)]',
                      'transition-[background] duration-[160ms] ease-out',
                      'group-hover/row:[background:linear-gradient(180deg,rgba(138,50,224,0.13)_0%,rgba(138,50,224,0.06)_100%)]',
                    )}
                  >
                    {/* Jimmy always has every feature */}
                    <MarkYes isJimmy />
                  </div>

                  {/* Competitor cells */}
                  {row.slice(1).map((hasFeature, colIdx) => (
                    <div
                      key={colIdx}
                      role="cell"
                      className={cn(
                        'relative flex items-center justify-center z-[1]',
                        'py-[19px] px-3',
                        'border-b border-[var(--color-divider)]',
                        'transition-colors duration-[160ms] ease-out',
                        'group-hover/row:bg-[rgba(26,25,23,0.022)]',
                      )}
                    >
                      {hasFeature ? <MarkYes isJimmy={false} /> : <MarkNo />}
                    </div>
                  ))}
                </div>
              )
            })}

            {/* ── Coverage-score footer row ── */}
            <div role="row" className="contents">
              {/* Label */}
              <div
                role="rowheader"
                className={cn(
                  'flex items-center z-[1]',
                  'justify-start text-left',
                  'text-[11px] font-bold uppercase tracking-[0.09em] text-text-faint',
                  'px-[clamp(20px,2.4vw,32px)] py-[22px]',
                  'border-t-[1.5px] border-border bg-surface-2',
                  // Frozen first column on mobile
                  'max-[860px]:sticky max-[860px]:left-0 max-[860px]:z-[3]',
                )}
              >
                {t('footerLabel')}
              </div>

              {/* Jimmy score */}
              <div
                role="cell"
                className={cn(
                  'flex items-center justify-center z-[1]',
                  'py-[22px] px-3',
                  'border-t-[1.5px] border-purple-border bg-surface-2',
                  'shadow-[inset_1.5px_0_0_var(--color-purple-border),inset_-1.5px_0_0_var(--color-purple-border)]',
                  '[background:linear-gradient(180deg,rgba(138,50,224,0.085)_0%,rgba(138,50,224,0.035)_100%)]',
                )}
              >
                <span className="font-display text-[23px] font-extrabold text-purple tracking-[-0.01em]">
                  {scores[0]}
                </span>
              </div>

              {/* Competitor scores */}
              {scores.slice(1).map((score, i) => (
                <div
                  key={i}
                  role="cell"
                  className={cn(
                    'flex items-center justify-center z-[1]',
                    'py-[22px] px-3',
                    'border-t-[1.5px] border-border bg-surface-2',
                  )}
                >
                  <span className="font-display text-[19px] font-extrabold text-text-muted tracking-[-0.01em]">
                    {score}
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </section>
  )
}
