import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  type: 'document',
  fields: [
    defineField({ name: 'siteName', type: 'string' }),
    defineField({ name: 'siteDescription', type: 'text' }),
    defineField({ name: 'seo', type: 'seo' }),
    // 404 / not-found page copy
    defineField({
      name: 'notFound',
      type: 'object',
      fields: [
        defineField({ name: 'eyebrow', type: 'string', description: 'e.g. "Error 404"' }),
        defineField({ name: 'title', type: 'string' }),
        defineField({ name: 'lead', type: 'text', rows: 2 }),
        defineField({ name: 'ctaPrimary', type: 'string' }),
        defineField({ name: 'ctaSecondary', type: 'string' }),
      ],
    }),
    defineField({ name: 'language', type: 'string', readOnly: true, hidden: true }),
  ],
  preview: {
    select: { subtitle: 'language' },
    prepare: ({ subtitle }) => ({ title: 'Site Settings', subtitle }),
  },
})
