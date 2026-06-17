import { defineField, defineType } from 'sanity'

const COLUMNS = [
  { title: 'Now (in build)', value: 'now' },
  { title: 'Next (up soon)', value: 'next' },
  { title: 'Later (exploring)', value: 'later' },
]

const CATEGORIES = [
  { title: 'Community', value: 'community' },
  { title: 'Training', value: 'training' },
  { title: 'App', value: 'app' },
  { title: 'Payments', value: 'payments' },
  { title: 'Coach tools', value: 'coach' },
]

/**
 * Roadmap board card. Not localized — English content on all locales (like
 * changelog); the column labels / chrome are localized via next-intl. The
 * category color + display label and the upvote key are derived at render
 * (color from `category`, vote key from the document _id).
 */
export const roadmapItem = defineType({
  name: 'roadmapItem',
  title: 'Roadmap Item',
  type: 'document',
  fields: [
    defineField({
      name: 'column',
      type: 'string',
      options: { list: COLUMNS, layout: 'radio' },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'category',
      type: 'string',
      options: { list: CATEGORIES, layout: 'dropdown' },
      validation: (R) => R.required(),
    }),
    defineField({ name: 'title', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'desc', title: 'Description', type: 'text', rows: 2, validation: (R) => R.required() }),
    defineField({ name: 'eta', title: 'Status / ETA', type: 'string', description: 'e.g. "Shipping this quarter", "In beta", "Researching".', validation: (R) => R.required() }),
    defineField({ name: 'votes', title: 'Base votes', type: 'number', initialValue: 0, validation: (R) => R.required().min(0) }),
    defineField({ name: 'order', type: 'number', description: 'Sort order within the column (lower = first).', validation: (R) => R.required() }),
  ],
  orderings: [
    {
      title: 'Column, then order',
      name: 'columnOrder',
      by: [
        { field: 'column', direction: 'asc' },
        { field: 'order', direction: 'asc' },
      ],
    },
  ],
  preview: {
    select: { title: 'title', column: 'column', category: 'category', votes: 'votes' },
    prepare: ({ title, column, category, votes }: { title?: string; column?: string; category?: string; votes?: number }) => ({
      title,
      subtitle: `${column ?? '—'} · ${category ?? '—'} · ${votes ?? 0} votes`,
    }),
  },
})
