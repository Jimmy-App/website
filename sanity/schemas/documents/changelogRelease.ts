import { defineArrayMember, defineField, defineType } from 'sanity'

/**
 * Changelog release entry. Not localized — English content on all locales (like
 * blog/guides); the page chrome is localized via next-intl. The "Latest" badge
 * and the New/Improved/Fixed tag set are derived at render (newest release /
 * the change types present), so editors only manage the content here.
 */
export const changelogRelease = defineType({
  name: 'changelogRelease',
  title: 'Changelog Release',
  type: 'document',
  fields: [
    defineField({ name: 'version', type: 'string', description: 'e.g. v3.4', validation: (R) => R.required() }),
    defineField({
      name: 'date',
      title: 'Release date',
      type: 'datetime',
      options: { dateFormat: 'MMM D, YYYY' },
      validation: (R) => R.required(),
    }),
    defineField({ name: 'title', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'lead', title: 'Lead / summary', type: 'text', rows: 2, validation: (R) => R.required() }),
    defineField({
      name: 'image',
      title: 'Screenshot (optional)',
      type: 'image',
      options: { hotspot: true },
      description: 'Shown as a 16:10 banner. Upload a real product screenshot.',
      fields: [
        defineField({ name: 'alt', title: 'Alt text', type: 'string', validation: (R) => R.required() }),
      ],
    }),
    defineField({
      name: 'changes',
      type: 'array',
      of: [defineArrayMember({ type: 'changelogChange' })],
      validation: (R) => R.required().min(1),
    }),
  ],
  orderings: [
    {
      title: 'Newest first',
      name: 'dateDesc',
      by: [{ field: 'date', direction: 'desc' }],
    },
  ],
  preview: {
    select: { title: 'title', version: 'version', date: 'date', media: 'image' },
    prepare: ({ title, version, date, media }: { title?: string; version?: string; date?: string; media?: unknown }) => ({
      title: `${version ?? ''} — ${title ?? ''}`,
      subtitle: date ? new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
      media: media as never,
    }),
  },
})
