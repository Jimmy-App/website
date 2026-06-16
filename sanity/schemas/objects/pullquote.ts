import { defineField, defineType } from 'sanity'

/** Large pull-quote with an optional attribution. */
export const pullquote = defineType({
  name: 'pullquote',
  title: 'Pull quote',
  type: 'object',
  fields: [
    defineField({ name: 'text', type: 'text', rows: 3, validation: (R) => R.required() }),
    defineField({ name: 'cite', type: 'string', description: 'Attribution, e.g. "— Marta, Hyrox coach".' }),
  ],
  preview: { select: { title: 'text', subtitle: 'cite' } },
})
