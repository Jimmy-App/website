import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  type: 'document',
  fields: [
    defineField({ name: 'siteName', type: 'string' }),
    defineField({ name: 'siteDescription', type: 'text' }),
    defineField({ name: 'seo', type: 'seo' }),
    defineField({ name: 'language', type: 'string', readOnly: true, hidden: true }),
  ],
  preview: {
    select: { subtitle: 'language' },
    prepare: ({ subtitle }) => ({ title: 'Site Settings', subtitle }),
  },
})
