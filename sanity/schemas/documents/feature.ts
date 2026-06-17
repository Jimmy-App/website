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
    defineField({ name: 'sub', title: 'Subtitle (nav / related cards)', type: 'string', validation: (R) => R.required() }),
    defineField({
      name: 'iconKey',
      title: 'Icon key',
      type: 'string',
      description: 'lucide icon key (must exist in FEATURE_ICON_MAP).',
      validation: (R) => R.required(),
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
