/**
 * Blog helpers. Content now comes from Sanity (see sanity/queries POSTS/POST).
 * This module only holds shared types + pure display helpers used by the pages
 * and components.
 */
import type { POST_QUERY_RESULT } from '../../sanity.types'

export type CategoryKey = 'stories' | 'retention' | 'training' | 'business' | 'product'

export const CATEGORY_ORDER: CategoryKey[] = [
  'stories',
  'retention',
  'training',
  'business',
  'product',
]

export type PostBody = NonNullable<NonNullable<POST_QUERY_RESULT>['body']>

/** Stable, URL-safe id for a heading (used for in-page anchors + TOC). */
export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 64)
}

/** Plain text of a Portable Text block's children. */
function blockText(block: Extract<PostBody[number], { _type: 'block' }>): string {
  return (block.children ?? []).map((c) => c.text ?? '').join('')
}

/** Build the "On this page" list from H2 headings in the body. */
export function tocFromBody(body: PostBody | null | undefined): { id: string; text: string }[] {
  if (!body) return []
  return body
    .filter((b): b is Extract<PostBody[number], { _type: 'block' }> => b._type === 'block' && b.style === 'h2')
    .map((b) => {
      const text = blockText(b)
      return { id: slugifyHeading(text), text }
    })
    .filter((t) => t.text)
}

/** Locale-aware article dates: { full: "Jun 11, 2026", short: "Jun 11" }. */
export function formatPostDate(iso: string | null | undefined, locale: string) {
  if (!iso) return { full: '', short: '' }
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return { full: '', short: '' }
  const full = new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric', year: 'numeric' }).format(d)
  const short = new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric' }).format(d)
  return { full, short }
}

export function isCategoryKey(v: string | null | undefined): v is CategoryKey {
  return v === 'stories' || v === 'retention' || v === 'training' || v === 'business' || v === 'product'
}
