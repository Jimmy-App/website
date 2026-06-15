import { defineField, defineType } from 'sanity'

export const navMegaItem = defineType({
  name: 'navMegaItem',
  type: 'object',
  fields: [
    defineField({ name: 'key', type: 'string', description: 'e.g. workoutBuilder, programs, communityFeed' }),
    defineField({ name: 'title', type: 'string' }),
    defineField({ name: 'subtitle', type: 'string' }),
    defineField({ name: 'href', type: 'string' }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'key' },
  },
})
