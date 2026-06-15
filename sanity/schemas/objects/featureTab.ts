import { defineField, defineType } from 'sanity'

export const featureTab = defineType({
  name: 'featureTab',
  type: 'object',
  fields: [
    defineField({ name: 'id', type: 'string', description: 'Slug key: workout | community | messaging | payments | courses' }),
    defineField({ name: 'label', type: 'string' }),
    defineField({ name: 'title', type: 'string' }),
    defineField({ name: 'subtitle', type: 'text', rows: 2 }),
    defineField({ name: 'tags', type: 'array', of: [{ type: 'string' }] }),
  ],
  preview: {
    select: { title: 'label' },
  },
})
