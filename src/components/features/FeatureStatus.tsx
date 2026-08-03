import { Clock3, FlaskConical } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * The three visible feature states (JIM-142 / JIM-145).
 *
 * The rule the whole site is held to: we never present an unbuilt feature as
 * existing, and we never hide a differentiator either. `live` is the only state
 * that renders nothing — shipped features simply work, so a badge would be
 * noise. Anything not shipped must carry one.
 */
export type FeatureStatusValue = 'live' | 'beta' | 'soon'

/**
 * Maps the keys the homepage tabs and the nav mega-menu use onto feature
 * slugs, so all three surfaces read the status from the one `feature`
 * document rather than each carrying its own copy to fall out of sync.
 */
const SLUG_BY_KEY: Record<string, string> = {
  // homePage.features.tabs[].id
  workout: 'workout-builder',
  community: 'community-feed',
  messaging: 'messaging',
  payments: 'payments',
  courses: 'programs-courses',
  // navigation.featuresItems[].key
  workoutBuilder: 'workout-builder',
  communityFeed: 'community-feed',
  programs: 'programs-courses',
  nativeApp: 'native-mobile-app',
  coachBrain: 'coach-brain',
}

export function featureSlugForKey(key: string | null | undefined): string | null {
  if (!key) return null
  return SLUG_BY_KEY[key] ?? key
}

/** Look a status up by whichever key the surface happens to use. */
export function statusForKey(
  key: string | null | undefined,
  statuses: Record<string, FeatureStatusValue>,
): FeatureStatusValue {
  const slug = featureSlugForKey(key)
  return (slug && statuses[slug]) || 'live'
}

const STYLES: Record<Exclude<FeatureStatusValue, 'live'>, string> = {
  beta: 'bg-purple-light text-purple',
  soon: 'bg-surface-offset text-text-muted',
}

const ICONS: Record<Exclude<FeatureStatusValue, 'live'>, typeof Clock3> = {
  beta: FlaskConical,
  soon: Clock3,
}

/**
 * `label` — a pill carrying the word, for surfaces with room for it.
 * `icon`  — an 18px marker that reveals the same word on hover/focus, for
 *           dense surfaces (the comparison table) where the pill wrapped the
 *           row label onto a second line.
 */
export type FeatureStatusVariant = 'label' | 'icon'

export function FeatureStatusBadge({
  status,
  note,
  label,
  variant = 'label',
  interactive = true,
  className,
}: {
  status: FeatureStatusValue | null | undefined
  /** Optional qualifier, e.g. "Q4". Never a specific date. */
  note?: string | null
  /** Localised wording, from the `featureStatus` message namespace. */
  label: string
  variant?: FeatureStatusVariant
  /**
   * `icon` only. Focusable by default so touch and keyboard can reach the
   * wording. Set false when the badge sits inside a link that already carries
   * its own tab stop — a second stop that does nothing on Enter is noise.
   */
  interactive?: boolean
  className?: string
}) {
  // Shipped features get no badge — that is what "live" means.
  if (!status || status === 'live') return null

  const full = note ? `${label} ${note}` : label

  if (variant === 'icon') {
    const Icon = ICONS[status]
    return (
      <span
        // Focusable so the wording is reachable by keyboard and by tap — a
        // hover-only tooltip would be unreadable on the phone.
        tabIndex={interactive ? 0 : undefined}
        role="note"
        aria-label={full}
        className={cn(
          'group/status relative inline-flex flex-shrink-0 items-center justify-center',
          'h-[18px] w-[18px] rounded-full outline-none',
          'focus-visible:ring-2 focus-visible:ring-purple/45',
          STYLES[status],
          className,
        )}
      >
        <Icon size={11} strokeWidth={2.75} aria-hidden="true" />

        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute bottom-full left-1/2 z-20 mb-[7px] -translate-x-1/2',
            'whitespace-nowrap rounded-[7px] bg-text px-[8px] py-[4px]',
            'text-[10.5px] font-bold uppercase tracking-[0.06em] text-surface',
            'shadow-[0_6px_18px_-6px_rgba(26,25,23,0.45)]',
            'origin-bottom scale-[0.96] opacity-0',
            // Tailwind v4 emits `scale-*` as the standalone `scale` property,
            // not inside `transform` — transitioning `transform` here would
            // fade the tooltip in while the scale snapped.
            'transition-[opacity,scale] duration-[125ms] [transition-timing-function:cubic-bezier(0.23,1,0.32,1)]',
            'group-hover/status:scale-100 group-hover/status:opacity-100',
            // Plain `focus`, not `focus-visible`: a tap focuses but does not
            // match focus-visible, and touch is where this table is tightest.
            'group-focus/status:scale-100 group-focus/status:opacity-100',
            'motion-reduce:transition-none',
          )}
        >
          {full}
        </span>
      </span>
    )
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-[5px] whitespace-nowrap rounded-full px-[8px] py-[3px] text-[10px] font-bold uppercase tracking-[0.06em]',
        STYLES[status],
        className,
      )}
    >
      {label}
      {note ? <span className="font-semibold opacity-70">{note}</span> : null}
    </span>
  )
}
