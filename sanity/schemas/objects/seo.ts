import { defineField, defineType } from 'sanity'

export const seo = defineType({
  name: 'seo',
  type: 'object',
  fields: [
    defineField({ name: 'title', type: 'string' }),
    defineField({ name: 'description', type: 'text', rows: 3 }),
    defineField({ name: 'ogImage', type: 'image', options: { hotspot: true } }),
  ],
})
