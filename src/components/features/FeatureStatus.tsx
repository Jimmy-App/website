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
  brandedApp: 'branded-app',
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

export function FeatureStatusBadge({
  status,
  note,
  label,
  className,
}: {
  status: FeatureStatusValue | null | undefined
  /** Optional qualifier, e.g. "Q4". Never a specific date. */
  note?: string | null
  /** Localised wording, from the `featureStatus` message namespace. */
  label: string
  className?: string
}) {
  // Shipped features get no badge — that is what "live" means.
  if (!status || status === 'live') return null

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
