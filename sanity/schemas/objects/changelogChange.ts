import { defineField, defineType } from 'sanity'

const TYPES = [
  { title: 'New', value: 'new' },
  { title: 'Improved', value: 'improved' },
  { title: 'Fixed', value: 'fixed' },
]

/**
 * A single change line within a release.
 * `text` supports **double-asterisk** bold for key phrases (rendered as <strong>).
 */
export const changelogChange = defineType({
  name: 'changelogChange',
  title: 'Change',
  type: 'object',
  fields: [
    defineField({
      name: 'type',
      type: 'string',
      options: { list: TYPES, layout: 'radio', direction: 'horizontal' },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'text',
      type: 'text',
      rows: 2,
      description: 'Wrap key phrases in **double asterisks** to bold them.',
      validation: (R) => R.required(),
    }),
  ],
  preview: {
    select: { type: 'type', text: 'text' },
    prepare: ({ type, text }: { type?: string; text?: string }) => ({
      title: text?.replace(/\*\*/g, ''),
      subtitle: type ? type[0].toUpperCase() + type.slice(1) : '',
    }),
  },
})
