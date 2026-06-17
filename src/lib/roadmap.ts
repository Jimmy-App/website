/**
 * Roadmap — render types + Sanity → render mapper.
 *
 * Card content lives in Sanity (`roadmapItem` documents, seeded from
 * scripts/seed-roadmap.mjs). This file keeps the render shape, the category
 * color/label maps (derived from the `category` key), and the grouper that
 * builds the Now/Next/Later columns. The upvote key is the document _id.
 */

import type { ROADMAP_QUERY_RESULT } from '../../sanity.types'

export type RoadmapCategory = 'community' | 'training' | 'app' | 'payments' | 'coach'

export type RoadmapColumnKey = 'now' | 'next' | 'later'

export type RoadmapCard = {
  /** stable id (Sanity _id) — used as the localStorage vote key */
  id: string
  category: RoadmapCategory
  /** display label derived from the category key */
  categoryLabel: string
  title: string
  desc: string
  eta: string
  votes: number
}

export type RoadmapColumn = {
  key: RoadmapColumnKey
  cards: RoadmapCard[]
}

/** Category chip colors — { fg, bg } keyed by category. */
export const CATEGORY_COLOR: Record<RoadmapCategory, { fg: string; bg: string }> = {
  community: { fg: '#8A32E0', bg: '#F3EBFF' },
  training: { fg: '#15885A', bg: '#E6F4EC' },
  app: { fg: '#1C1A17', bg: '#EDE9E3' },
  payments: { fg: '#C94F00', bg: '#FFF0E6' },
  coach: { fg: '#5B2E91', bg: '#F0EAF9' },
}

/** English display label per category key. */
export const CATEGORY_LABEL: Record<RoadmapCategory, string> = {
  community: 'Community',
  training: 'Training',
  app: 'App',
  payments: 'Payments',
  coach: 'Coach tools',
}

const COLUMN_ORDER: RoadmapColumnKey[] = ['now', 'next', 'later']

/** Groups roadmap docs into the Now → Next → Later columns (preserving query order). */
export function groupRoadmap(docs: ROADMAP_QUERY_RESULT): RoadmapColumn[] {
  const cards: (RoadmapCard & { column: RoadmapColumnKey })[] = docs
    .filter((d) => Boolean(d.column) && Boolean(d.category))
    .map((d) => ({
      id: d.id,
      column: d.column as RoadmapColumnKey,
      category: d.category as RoadmapCategory,
      categoryLabel: CATEGORY_LABEL[d.category as RoadmapCategory],
      title: d.title ?? '',
      desc: d.desc ?? '',
      eta: d.eta ?? '',
      votes: d.votes ?? 0,
    }))

  return COLUMN_ORDER.map((key) => ({
    key,
    cards: cards.filter((c) => c.column === key),
  }))
}
