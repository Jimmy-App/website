import { defineField, defineType } from 'sanity'

export const navigation = defineType({
  name: 'navigation',
  type: 'document',
  fields: [
    defineField({
      name: 'items',
      type: 'array',
      of: [{ type: 'navItem' }],
    }),
    defineField({ name: 'language', type: 'string', readOnly: true, hidden: true }),
  ],
  preview: {
    select: { subtitle: 'language' },
    prepare: ({ subtitle }) => ({ title: 'Navigation', subtitle }),
  },
})
