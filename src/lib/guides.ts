/**
 * Guides helpers — pure display utils + shared types.
 *
 * Content now comes from Sanity (see sanity/queries GUIDES_QUERY / GUIDE_QUERY).
 * This module only holds:
 *   - The GuideCategoryKey union
 *   - The Guide type (aliased from the Sanity query result item)
 *   - TocItem / tocFromBody  (reads Portable Text body shape)
 *   - slugifyHeading
 *   - prevNext / groupByCategory helpers that operate on a fetched list
 */

import type { GUIDES_QUERY_RESULT, GUIDE_QUERY_RESULT } from '../../sanity.types'

/* ── Legacy Block types — kept so GuideBody.tsx keeps compiling ─────── */
export type CalloutTone = 'note' | 'tip' | 'warn' | 'success'

export type StepItem = {
  title: string
  blocks: Block[]
}

export type Block =
  | { type: 'h2'; id: string; text: string }
  | { type: 'h3'; text: string }
  | { type: 'p'; text: string }
  | { type: 'check'; items: string[] }
  | { type: 'callout'; tone: CalloutTone; label: string; text: string }
  | { type: 'figure'; caption: string }
  | { type: 'video'; label: string; duration: string }
  | { type: 'steps'; items: StepItem[] }
  | { type: 'faq'; items: FaqItem[] }

/* ── Category keys ─────────────────────────────────────────────────── */
export type GuideCategoryKey =
  | 'getting-started'
  | 'branded-app'
  | 'programming'
  | 'community'
  | 'payments'
  | 'retention'

export function isGuideCategoryKey(v: string | null | undefined): v is GuideCategoryKey {
  return (
    v === 'getting-started' ||
    v === 'branded-app' ||
    v === 'programming' ||
    v === 'community' ||
    v === 'payments' ||
    v === 'retention'
  )
}

/* ── Guide type — one item from GUIDES_QUERY_RESULT ─────────────────── */
export type Guide = GUIDES_QUERY_RESULT[number]

/* ── Full guide (single article) ─────────────────────────────────────── */
export type FullGuide = NonNullable<GUIDE_QUERY_RESULT>

/* ── FaqItem — shape used by GuideFaq (re-exported for legacy imports) ─ */
export type FaqItem = { q: string; a: string }

/* ── Slug helper ─────────────────────────────────────────────────────── */
export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 64)
}

/* ── TOC ─────────────────────────────────────────────────────────────── */
export type TocItem = {
  id: string
  text: string
  sub?: boolean
  stepIndex?: number
}

/**
 * Build the TOC from a guide's Portable Text body.
 * Extracts H2 block headings and, if a guideSteps block is found,
 * adds each step as a sub-item (matching the static `tocFromBody` behaviour).
 */
export function tocFromBody(
  body: FullGuide['body'] | null | undefined,
): TocItem[] {
  if (!body) return []
  const items: TocItem[] = []

  for (const block of body) {
    if (block._type === 'block' && block.style === 'h2') {
      // Extract plain text from PT block children
      const text = ((block.children ?? []) as Array<{ text?: string }>)
        .map((c) => c.text ?? '')
        .join('')
      if (text) items.push({ id: slugifyHeading(text), text })
    } else if (block._type === 'guideSteps') {
      const stepItems = block.items ?? []
      stepItems.forEach((step, i) => {
        items.push({
          id: `step-${i + 1}`,
          text: `${i + 1} · ${step.title ?? ''}`,
          sub: true,
          stepIndex: i,
        })
      })
    }
  }

  return items
}

/* ── prevNext ────────────────────────────────────────────────────────── */
/**
 * Find the previous and next guides in the ordered flat list.
 * `guides` should already be sorted (GUIDES_QUERY returns them ordered
 * by category asc, order asc).
 */
export function prevNext(
  guides: Guide[],
  slug: string,
): { prev: Guide | null; next: Guide | null } {
  const idx = guides.findIndex((g) => g.slug === slug)
  if (idx === -1) return { prev: null, next: null }
  return {
    prev: idx > 0 ? (guides[idx - 1] ?? null) : null,
    next: idx < guides.length - 1 ? (guides[idx + 1] ?? null) : null,
  }
}

/* ── groupByCategory ─────────────────────────────────────────────────── */
export function groupByCategory(
  guides: Guide[],
): Record<GuideCategoryKey, Guide[]> {
  const map: Record<GuideCategoryKey, Guide[]> = {
    'getting-started': [],
    'branded-app': [],
    programming: [],
    community: [],
    payments: [],
    retention: [],
  }
  for (const g of guides) {
    if (g.category && isGuideCategoryKey(g.category)) {
      map[g.category].push(g)
    }
  }
  return map
}

/* ── Level helpers ───────────────────────────────────────────────────── */
export type GuideLevel = 'Beginner' | 'Intermediate' | 'Advanced'

export function isGuideLevel(v: string | null | undefined): v is GuideLevel {
  return v === 'Beginner' || v === 'Intermediate' || v === 'Advanced'
}

/* ── Date helper ─────────────────────────────────────────────────────── */
/** Format an ISO datetime into "Jun 2026" (month + year). */
export function formatGuideDate(iso: string | null | undefined): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' }).format(d)
}
