/**
 * FeatureCapabilities — "What's inside" section
 *
 * Centered eyebrow + capsTitle + 3-column tile grid.
 * bg-surface-2 band.
 */

import { cn } from '@/lib/utils'
import { CAPS_ICON_MAP } from './featureMeta'
import type { Feature } from '@/lib/features'

type Props = {
  feature: Feature
  whatsInside: string
}

export function FeatureCapabilities({ feature, whatsInside }: Props) {
  return (
    <section
      aria-labelledby="caps-heading"
      className="border-t border-border bg-surface-2 py-[var(--section-pad-y)]"
    >
      <div className="container-content">
        {/* Header */}
        <header className="mb-[clamp(2.5rem,4vw,3.5rem)] text-center">
          <span className="eyebrow mb-4 inline-flex items-center gap-[6px] text-purple">
            <span
              aria-hidden="true"
              className="inline-block size-[5px] rounded-full bg-purple"
            />
            {whatsInside}
          </span>
          <h2
            id="caps-heading"
            className="font-display text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold leading-[1.1] [letter-spacing:-0.035em] text-text [text-wrap:balance]"
          >
            {feature.capsTitle}
          </h2>
        </header>

        {/* 3-col grid */}
        <div
          className={cn(
            'grid gap-4',
            'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
          )}
        >
          {feature.caps.map((cap) => {
            const Icon = CAPS_ICON_MAP[cap.iconKey]
            return (
              <div
                key={cap.title}
                className={cn(
                  'group flex flex-col gap-4 rounded-2xl border border-border bg-surface p-6',
                  'shadow-[var(--shadow-xs)]',
                  'transition-[border-color,box-shadow,transform] duration-200',
                  'hover:border-purple-border hover:shadow-[var(--shadow-md)] hover:-translate-y-[2px]',
                )}
              >
                {/* Icon chip */}
                <span
                  className={cn(
                    'flex size-10 items-center justify-center rounded-xl',
                    'border border-border bg-purple-light',
                    'transition-colors duration-200',
                    'group-hover:border-purple-border',
                  )}
                >
                  {Icon && (
                    <Icon
                      size={18}
                      strokeWidth={1.75}
                      className="text-purple"
                    />
                  )}
                </span>

                <div>
                  <h3 className="mb-1.5 text-[15px] font-bold text-text">
                    {cap.title}
                  </h3>
                  <p className="text-[14px] leading-[1.6] text-text-muted">
                    {cap.desc}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
