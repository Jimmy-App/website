import { NotFoundContent } from '@/components/layout/NotFoundContent'

// Fallback for notFound() raised inside a locale route (e.g. a misconfigured
// page). Unmatched URLs are handled by [...rest] with full localization; this
// stays static (no dynamic getLocale) so it can't break the prerender.
export default function NotFound() {
  return <NotFoundContent data={null} locale="en" />
}
