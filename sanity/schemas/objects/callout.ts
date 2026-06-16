import { defineField, defineType } from 'sanity'

/** Highlighted "key takeaway" box inside a post body. */
export const callout = defineType({
  name: 'callout',
  title: 'Callout',
  type: 'object',
  fields: [
    defineField({
      name: 'tone',
      type: 'string',
      options: {
        list: [
          { title: 'Spark (idea)', value: 'spark' },
          { title: 'Check (confirmation)', value: 'check' },
        ],
        layout: 'radio',
      },
      initialValue: 'spark',
    }),
    defineField({ name: 'label', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'text', type: 'text', rows: 3, validation: (R) => R.required() }),
  ],
  preview: { select: { title: 'label', subtitle: 'text' } },
})
