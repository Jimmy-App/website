/**
 * FeatureRelated — "More for coaches" section
 *
 * Grid of the other coach features (excluding current).
 * Each card: icon chip + name + sub + hover arrow → /features/[slug]
 */

import { ArrowRight } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { FEATURE_ICON_MAP } from './featureMeta'
import type { FeatureCard } from '@/lib/features'

type Props = {
  features: FeatureCard[]
  platform: string
  moreForCoaches: string
}

export function FeatureRelated({ features, platform, moreForCoaches }: Props) {
  if (features.length === 0) return null

  return (
    <section
      aria-labelledby="related-heading"
      className="border-t border-border py-[var(--section-pad-y)]"
    >
      <div className="container-content">
        {/* Header */}
        <header className="mb-[clamp(2rem,3.5vw,3rem)] text-center">
          <span className="eyebrow mb-4 inline-flex items-center gap-[6px] text-purple">
            <span
              aria-hidden="true"
              className="inline-block size-[5px] rounded-full bg-purple"
            />
            {platform}
          </span>
          <h2
            id="related-heading"
            className="font-display text-[clamp(1.6rem,3.5vw,2.5rem)] font-extrabold leading-[1.1] [letter-spacing:-0.035em] text-text"
          >
            {moreForCoaches}
          </h2>
        </header>

        {/* Grid */}
        <div
          className={cn(
            'grid gap-3',
            'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
            // If only 4 or 5, cap at 3 cols still — looks fine
          )}
        >
          {features.map((f) => {
            const Icon = FEATURE_ICON_MAP[f.iconKey]
            return (
              <Link
                key={f.slug}
                href={`/features/${f.slug}`}
                className={cn(
                  'group flex items-center gap-4 rounded-2xl border border-border bg-surface p-5',
                  'shadow-[var(--shadow-xs)]',
                  'transition-[border-color,box-shadow,transform] duration-200',
                  'hover:border-purple-border hover:shadow-[var(--shadow-md)] hover:-translate-y-[2px]',
                )}
              >
                {/* Icon chip */}
                <span
                  className={cn(
                    'flex size-10 shrink-0 items-center justify-center rounded-xl',
                    'border border-border bg-surface-2',
                    'transition-colors duration-200',
                    'group-hover:border-purple-border group-hover:bg-purple-light',
                  )}
                >
                  {Icon && (
                    <Icon
                      size={18}
                      strokeWidth={1.75}
                      className="text-text-muted transition-colors duration-200 group-hover:text-purple"
                    />
                  )}
                </span>

                {/* Text */}
                <div className="min-w-0 flex-1">
                  <div className="text-[14px] font-bold text-text">{f.name}</div>
                  <div className="mt-0.5 truncate text-[12.5px] text-text-faint">{f.sub}</div>
                </div>

                {/* Hover arrow */}
                <ArrowRight
                  size={16}
                  strokeWidth={1.75}
                  className="shrink-0 text-text-faint opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-x-0.5 group-hover:opacity-100 group-hover:text-purple"
                />
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
