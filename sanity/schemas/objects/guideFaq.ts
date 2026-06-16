import { defineArrayMember, defineField, defineType } from 'sanity'

/** FAQ accordion block inside a guide body. Uses inline q/a rather than faqItem to keep field names (q/a) matching the static data. */
export const guideFaq = defineType({
  name: 'guideFaq',
  title: 'FAQ',
  type: 'object',
  fields: [
    defineField({
      name: 'items',
      title: 'Questions',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'guideFaqItem',
          fields: [
            defineField({ name: 'q', title: 'Question', type: 'string', validation: (R) => R.required() }),
            defineField({ name: 'a', title: 'Answer', type: 'text', rows: 3, validation: (R) => R.required() }),
          ],
          preview: { select: { title: 'q' } },
        }),
      ],
      validation: (R) => R.required().min(1),
    }),
  ],
  preview: {
    select: { title: 'items' },
    prepare: ({ title }: { title?: unknown[] }) => ({
      title: `FAQ (${title?.length ?? 0} questions)`,
    }),
  },
})
