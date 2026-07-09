/**
 * Legal document model. Content lives in `src/content/legal/*.ts` as plain data
 * so the pages stay static and fast; the <LegalPage> component renders it.
 */

export type LegalBlock =
  | { type: 'p'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'table'; head: string[]; rows: string[][] }

export interface LegalSection {
  /** Stable anchor id, e.g. "information-we-collect". */
  id: string
  /** Display number shown in the eyebrow, e.g. 2. */
  n: number
  heading: string
  blocks: LegalBlock[]
}

export type LegalSlug = 'privacy' | 'terms' | 'cookie-policy'

export interface LegalDoc {
  slug: LegalSlug
  title: string
  /** ISO date string, formatted at render time. */
  lastUpdated: string
  /** Optional lead paragraph shown under the title. */
  intro?: string
  sections: LegalSection[]
}

export const LEGAL_SLUGS: readonly LegalSlug[] = [
  'privacy',
  'terms',
  'cookie-policy',
] as const

export interface TocEntry {
  id: string
  n: number
  text: string
}

export function tocFromDoc(doc: LegalDoc): TocEntry[] {
  return doc.sections.map((s) => ({ id: s.id, n: s.n, text: s.heading }))
}

/** e.g. "February 9, 2026" — locale-aware, date-only (no TZ surprises). */
export function formatLegalDate(iso: string, locale: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  if (!y || !m || !d) return iso
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}
