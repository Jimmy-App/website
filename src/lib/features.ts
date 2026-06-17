/**
 * Features — types + code-side mapping layer.
 *
 * Editable content (copy, tags, caps, icon/demo keys) lives in Sanity
 * (`feature` documents, seeded from scripts/seed-features.ts). This file keeps
 * the render types, the Sanity → render mapper, and the bits that stay coupled
 * to code: hero media assets (FEATURE_MEDIA) — the demo and icon keys resolve in
 * FeatureDemo.tsx / featureMeta.tsx.
 *
 * Icons are NOT imported here — they live in featureMeta.tsx so this
 * file stays plain TS (no JSX, no React imports).
 */

import type { FEATURE_QUERY_RESULT, FEATURES_QUERY_RESULT } from '../../sanity.types'

// ── Audience ──────────────────────────────────────────────────────────────────
export type FeatureAudience = 'For Coaches' | 'For Members'

// ── Demo key ─────────────────────────────────────────────────────────────────
export type FeatureDemoKey =
  | 'workout'
  | 'community'
  | 'messaging'
  | 'payments'
  | 'courses'
  | 'dailyWorkout'
  | 'brandedApp'
  | 'progressView'
  | 'easyPayment'
  | null

// ── Capability (what's inside grid item) ──────────────────────────────────────
export type FeatureCap = {
  /** lucide icon name (key into CAPS_ICON_MAP in featureMeta.tsx) */
  iconKey: string
  title: string
  desc: string
}

// ── Title parts (parsed from HTML `<span class="accent">…</span>`) ────────────
export type TitleParts = {
  prefix: string
  accent: string
  suffix: string
}

// ── Highlight (bold sub-line with a purple accent) ────────────────────────────
export type HighlightParts = {
  prefix: string
  accent: string
}

// ── Hero media ────────────────────────────────────────────────────────────────
// When present, this real screen-recording replaces the animated `demoKey` demo
// in the hero panel (e.g. branded-mobile-app uses an actual app capture).
export type FeatureMedia = {
  kind: 'video'
  /** H.264 mp4 source under /public (universally supported) */
  mp4: string
  /** still frame shown before playback / under reduced-motion */
  poster: string
  /** intrinsic dimensions, for aspect-ratio + no layout shift */
  width: number
  height: number
}

// ── Feature (full render shape) ────────────────────────────────────────────────
export type Feature = {
  slug: string
  audience: FeatureAudience
  /** Short display name (breadcrumb label) */
  name: string
  /** One-line subtitle shown in Related / nav mega */
  sub: string
  /** lucide icon key into FEATURE_ICON_MAP in featureMeta.tsx */
  iconKey: string
  demoKey: FeatureDemoKey
  /** Optional real media that replaces the animated demo in the hero panel */
  media?: FeatureMedia
  title: TitleParts
  highlight: HighlightParts
  highlightSub: string
  lead: string
  tags: string[]
  capsTitle: string
  caps: FeatureCap[]
}

// ── Feature card (related lists / nav) ─────────────────────────────────────────
export type FeatureCard = Pick<
  Feature,
  'slug' | 'audience' | 'name' | 'sub' | 'iconKey'
>

// ── Code-side hero media, keyed by slug ────────────────────────────────────────
// Media is a real asset in /public, so it stays in code rather than Sanity.
export const FEATURE_MEDIA: Record<string, FeatureMedia> = {
  'branded-mobile-app': {
    kind: 'video',
    mp4: '/assets/screens/mobileapp-screen.mp4',
    poster: '/assets/screens/mobileapp-screen.jpg',
    width: 960,
    height: 720,
  },
}

// ── Sanity → render mappers ─────────────────────────────────────────────────────

/** Maps a full FEATURE_QUERY document into the render `Feature` shape. */
export function toFeature(doc: NonNullable<FEATURE_QUERY_RESULT>): Feature {
  const slug = doc.slug ?? ''
  return {
    slug,
    audience: (doc.audience ?? 'For Coaches') as FeatureAudience,
    name: doc.name ?? '',
    sub: doc.sub ?? '',
    iconKey: doc.iconKey ?? '',
    demoKey: (doc.demoKey ?? null) as FeatureDemoKey,
    media: FEATURE_MEDIA[slug],
    title: {
      prefix: doc.title?.prefix ?? '',
      accent: doc.title?.accent ?? '',
      suffix: doc.title?.suffix ?? '',
    },
    highlight: {
      prefix: doc.highlight?.prefix ?? '',
      accent: doc.highlight?.accent ?? '',
    },
    highlightSub: doc.highlightSub ?? '',
    lead: doc.lead ?? '',
    tags: doc.tags ?? [],
    capsTitle: doc.capsTitle ?? '',
    caps: (doc.caps ?? []).map((c) => ({
      iconKey: c.iconKey ?? '',
      title: c.title ?? '',
      desc: c.desc ?? '',
    })),
  }
}

/** Maps a FEATURES_QUERY card into the lighter `FeatureCard` shape. */
export function toFeatureCard(
  doc: FEATURES_QUERY_RESULT[number],
): FeatureCard {
  return {
    slug: doc.slug ?? '',
    audience: (doc.audience ?? 'For Coaches') as FeatureAudience,
    name: doc.name ?? '',
    sub: doc.sub ?? '',
    iconKey: doc.iconKey ?? '',
  }
}
