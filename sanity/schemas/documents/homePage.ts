import { defineField, defineType } from 'sanity'

export const homePage = defineType({
  name: 'homePage',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'hero',
      type: 'object',
      fields: [
        defineField({ name: 'heading', type: 'string' }),
        defineField({ name: 'subheading', type: 'text', rows: 2 }),
        defineField({ name: 'ctaText', type: 'string' }),
        defineField({ name: 'ctaUrl', type: 'string' }),
      ],
    }),
    defineField({ name: 'seo', type: 'seo' }),
    defineField({ name: 'language', type: 'string', readOnly: true, hidden: true }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'language' },
  },
})
