import { defineField, defineType } from 'sanity'

export const navItem = defineType({
  name: 'navItem',
  type: 'object',
  fields: [
    defineField({ name: 'label', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'href', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'external', type: 'boolean', initialValue: false }),
  ],
  preview: {
    select: { title: 'label', subtitle: 'href' },
  },
})
