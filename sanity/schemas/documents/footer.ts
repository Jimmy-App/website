import { defineField, defineType } from 'sanity'

export const footer = defineType({
  name: 'footer',
  type: 'document',
  fields: [
    defineField({
      name: 'columns',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'title', type: 'string' }),
            defineField({
              name: 'links',
              type: 'array',
              of: [{ type: 'navItem' }],
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'socialLinks',
      type: 'array',
      of: [{ type: 'socialLink' }],
    }),
    defineField({ name: 'legalText', type: 'text' }),
    defineField({ name: 'language', type: 'string', readOnly: true, hidden: true }),
  ],
  preview: {
    select: { subtitle: 'language' },
    prepare: ({ subtitle }) => ({ title: 'Footer', subtitle }),
  },
})
