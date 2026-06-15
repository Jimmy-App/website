import { defineField, defineType } from 'sanity'

export const teamMember = defineType({
  name: 'teamMember',
  type: 'object',
  fields: [
    defineField({ name: 'name', type: 'string' }),
    defineField({ name: 'role', type: 'string' }),
    defineField({ name: 'bio', type: 'text', rows: 3 }),
    defineField({ name: 'location', type: 'string' }),
    defineField({ name: 'photo', type: 'image', options: { hotspot: true } }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'role' },
  },
})
