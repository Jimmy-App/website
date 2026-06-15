import { defineField, defineType } from 'sanity'

export const teamStat = defineType({
  name: 'teamStat',
  type: 'object',
  fields: [
    defineField({ name: 'num', type: 'string' }),
    defineField({ name: 'heading', type: 'string' }),
    defineField({ name: 'body', type: 'string' }),
  ],
  preview: {
    select: { title: 'heading', subtitle: 'num' },
  },
})
