import { defineField, defineType } from 'sanity'

export const platformStep = defineType({
  name: 'platformStep',
  type: 'object',
  fields: [
    defineField({ name: 'id', type: 'string', description: 'Slug key: workout | community | messaging | payments | courses' }),
    defineField({ name: 'name', type: 'string' }),
    defineField({ name: 'tagline', type: 'string' }),
    defineField({ name: 'tags', type: 'array', of: [{ type: 'string' }] }),
    defineField({
      name: 'preview',
      type: 'object',
      fields: [
        defineField({ name: 'barTitle', type: 'string' }),
        defineField({ name: 'barChip', type: 'string' }),
      ],
    }),
  ],
  preview: {
    select: { title: 'name' },
  },
})
