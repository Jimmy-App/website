import { defineField, defineType } from 'sanity'

/** Callout box inside a guide body — four tones (note/tip/warn/success). */
export const guideCallout = defineType({
  name: 'guideCallout',
  title: 'Callout',
  type: 'object',
  fields: [
    defineField({
      name: 'tone',
      type: 'string',
      options: {
        list: [
          { title: 'Note (info)', value: 'note' },
          { title: 'Tip (lightbulb)', value: 'tip' },
          { title: 'Warning', value: 'warn' },
          { title: 'Success', value: 'success' },
        ],
        layout: 'radio',
      },
      initialValue: 'tip',
    }),
    defineField({ name: 'label', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'text', type: 'text', rows: 3, validation: (R) => R.required() }),
  ],
  preview: { select: { title: 'label', subtitle: 'tone' } },
})
