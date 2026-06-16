import { defineField, defineType } from 'sanity'

/** Checklist block inside a guide body. */
export const checklist = defineType({
  name: 'checklist',
  title: 'Checklist',
  type: 'object',
  fields: [
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (R) => R.required().min(1),
    }),
  ],
  preview: {
    select: { title: 'items' },
    prepare: ({ title }: { title?: string[] }) => ({
      title: `Checklist (${title?.length ?? 0} items)`,
    }),
  },
})
