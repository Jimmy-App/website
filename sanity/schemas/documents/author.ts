import { defineField, defineType } from 'sanity'

/** Blog author. Not localized — people are the same across languages. */
export const author = defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'role', type: 'string', description: 'e.g. "Head of Coach Success at Jimmy".' }),
    defineField({ name: 'bio', type: 'text', rows: 3 }),
    defineField({
      name: 'initials',
      type: 'string',
      description: 'Avatar initials (2 letters). Leave empty to derive from the name.',
      validation: (R) => R.max(3),
    }),
    defineField({ name: 'image', type: 'image', options: { hotspot: true } }),
  ],
  preview: { select: { title: 'name', subtitle: 'role', media: 'image' } },
})
