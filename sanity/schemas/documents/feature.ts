import { defineArrayMember, defineField, defineType } from 'sanity'

const AUDIENCES = [
  { title: 'For Coaches', value: 'For Coaches' },
  { title: 'For Members', value: 'For Members' },
]

/**
 * Feature detail page (/features/[slug]).
 * Not localized — English content on all locales; the page chrome is localized
 * via next-intl. The animated demo (`demoKey`), icons (`iconKey`) and any hero
 * media are resolved code-side from these string keys.
 */
export const feature = defineType({
  name: 'feature',
  title: 'Feature',
  type: 'document',
  fields: [
    defineField({ name: 'language', type: 'string', readOnly: true, hidden: true }),
    defineField({ name: 'name', title: 'Name (breadcrumb label)', type: 'string', validation: (R) => R.required() }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'audience',
      type: 'string',
      options: { list: AUDIENCES, layout: 'radio' },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'order',
      type: 'number',
      description: 'Catalogue order (lower = first). Used for related lists & static params.',
      validation: (R) => R.required(),
    }),
    // ── Feature status (JIM-145) ─────────────────────────────────────────────
    // The single source of truth for whether a feature exists. The homepage
    // tabs and the nav mega-menu resolve their own status from here by slug,
    // so a feature cannot be "coming soon" in one place and live in another.
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Live — shipped, no badge', value: 'live' },
          { title: 'In beta — badge', value: 'beta' },
          { title: 'Coming soon — badge, no promise of a date', value: 'soon' },
        ],
        layout: 'radio',
      },
      initialValue: 'live',
      validation: (R) => R.required(),
      description:
        'Never mark something Live that a coach cannot use today. If it is partly built, that is In beta.',
    }),
    defineField({
      name: 'statusNote',
      title: 'Status note (optional)',
      type: 'string',
      description:
        'Only where we are certain, and never a specific date — a quarter at most, e.g. "Q4". Leave empty if unsure.',
      hidden: ({ parent }) => parent?.status === 'live',
    }),
    defineField({ name: 'sub', title: 'Subtitle (nav / related cards)', type: 'string', validation: (R) => R.required() }),
    defineField({
      name: 'iconKey',
      title: 'Icon key',
      type: 'string',
      description: 'lucide icon key (must exist in FEATURE_ICON_MAP).',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'waitlistSource',
      title: 'Waitlist source',
      type: 'string',
      description:
        'When set, the hero CTA becomes the waitlist form instead of Start free / Book a demo. Must match an allowed source in /api/waitlist (e.g. coach-brain-waitlist).',
    }),
    defineField({
      name: 'demoKey',
      title: 'Demo key',
      type: 'string',
      description:
        'Animated hero demo to render (workout, courses, community, messaging, payments, dailyWorkout, brandedApp, progressView). Leave empty for the placeholder.',
    }),
    // ── Hero copy ──────────────────────────────────────────────────────────────
    defineField({
      name: 'title',
      title: 'H1 title',
      type: 'object',
      options: { columns: 3 },
      fields: [
        defineField({ name: 'prefix', type: 'string', validation: (R) => R.required() }),
        defineField({ name: 'accent', title: 'Accent (purple)', type: 'string', validation: (R) => R.required() }),
        defineField({ name: 'suffix', type: 'string' }),
      ],
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'highlight',
      title: 'Highlight sub-line',
      type: 'object',
      options: { columns: 2 },
      fields: [
        defineField({ name: 'prefix', type: 'string', validation: (R) => R.required() }),
        defineField({ name: 'accent', title: 'Accent (purple)', type: 'string', validation: (R) => R.required() }),
      ],
      validation: (R) => R.required(),
    }),
    defineField({ name: 'highlightSub', title: 'Highlight sub-text', type: 'text', rows: 2, validation: (R) => R.required() }),
    defineField({ name: 'lead', type: 'text', rows: 3, validation: (R) => R.required() }),
    defineField({
      name: 'tags',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      options: { layout: 'tags' },
      validation: (R) => R.required().min(1),
    }),
    // ── What's inside ────────────────────────────────────────────────────────────
    defineField({ name: 'capsTitle', title: "What's inside — heading", type: 'string', validation: (R) => R.required() }),
    defineField({
      name: 'caps',
      title: 'Capabilities',
      type: 'array',
      of: [defineArrayMember({ type: 'featureCap' })],
      validation: (R) => R.required().min(1),
    }),
    defineField({ name: 'seo', type: 'seo' }),
  ],
  orderings: [
    {
      title: 'Audience, then order',
      name: 'audienceOrder',
      by: [
        { field: 'audience', direction: 'asc' },
        { field: 'order', direction: 'asc' },
      ],
    },
  ],
  preview: {
    select: { title: 'name', audience: 'audience', sub: 'sub' },
    prepare: ({ title, audience, sub }: { title?: string; audience?: string; sub?: string }) => ({
      title,
      subtitle: `${audience ?? '—'} · ${sub ?? ''}`,
    }),
  },
})
