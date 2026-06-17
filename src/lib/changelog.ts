/**
 * Changelog — render types + Sanity → render mapper.
 *
 * Release content lives in Sanity (`changelogRelease` documents, seeded from
 * scripts/seed-changelog.mjs). This file keeps the render shape, the
 * `**bold**` parser for change lines, and the mapper. "Latest" and the tag set
 * are derived (newest release / change types present).
 */

import { urlFor } from '../../sanity/image'
import type { CHANGELOG_QUERY_RESULT } from '../../sanity.types'

export type ChangeType = 'new' | 'improved' | 'fixed'

/** A change line — string segments with optional bold spans (`{ b }`). */
export type ChangeText = Array<string | { b: string }>

export type Change = {
  type: ChangeType
  text: ChangeText
}

export type ReleaseImage = {
  src: string
  alt: string
}

export type Release = {
  version: string
  /** ISO date — for <time dateTime> */
  date: string
  /** Display date, e.g. "Jun 12, 2026" */
  dateLabel: string
  /** Derived from the change types present, in new → improved → fixed order */
  tags: ChangeType[]
  title: string
  lead: string
  image?: ReleaseImage
  changes: Change[]
}

const TAG_ORDER: ChangeType[] = ['new', 'improved', 'fixed']

/** Splits a string on `**bold**` markers into render segments. */
export function parseBold(text: string): ChangeText {
  const out: ChangeText = []
  const re = /\*\*(.+?)\*\*/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index))
    out.push({ b: m[1] })
    last = re.lastIndex
  }
  if (last < text.length) out.push(text.slice(last))
  return out.length ? out : [text]
}

/** Maps a CHANGELOG_QUERY release doc into the render `Release` shape. */
export function toRelease(doc: CHANGELOG_QUERY_RESULT[number]): Release {
  const changes: Change[] = (doc.changes ?? [])
    .filter((c): c is { type: ChangeType; text: string } => Boolean(c.type) && Boolean(c.text))
    .map((c) => ({ type: c.type, text: parseBold(c.text) }))

  const present = new Set(changes.map((c) => c.type))
  const tags = TAG_ORDER.filter((t) => present.has(t))

  const image: ReleaseImage | undefined = doc.image?.asset
    ? {
        src: urlFor(doc.image).width(1360).height(850).fit('crop').auto('format').url(),
        alt: doc.image.alt ?? '',
      }
    : undefined

  return {
    version: doc.version ?? '',
    date: doc.date,
    dateLabel: new Date(doc.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    tags,
    title: doc.title ?? '',
    lead: doc.lead ?? '',
    image,
    changes,
  }
}
