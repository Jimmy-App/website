import { defineField, defineType } from 'sanity'

export const faqItem = defineType({
  name: 'faqItem',
  type: 'object',
  fields: [
    defineField({ name: 'question', type: 'string' }),
    defineField({ name: 'answer', type: 'text', rows: 4 }),
  ],
  preview: {
    select: { title: 'question' },
  },
})
