import { defineArrayMember, defineField, defineType } from 'sanity'

/** The nested block config reused for both the main body and each step's body. */
const stepBodyBlock = defineArrayMember({
  type: 'block',
  styles: [
    { title: 'Normal', value: 'normal' },
    { title: 'Heading 3', value: 'h3' },
  ],
  lists: [
    { title: 'Bullet', value: 'bullet' },
  ],
  marks: {
    decorators: [
      { title: 'Bold', value: 'strong' },
      { title: 'Italic', value: 'em' },
    ],
    annotations: [
      defineArrayMember({
        name: 'link',
        type: 'object',
        title: 'Link',
        fields: [defineField({ name: 'href', type: 'url', validation: (R) => R.required() })],
      }),
    ],
  },
})

/** Numbered step timeline — each step has a title + its own mini Portable Text body. */
export const guideSteps = defineType({
  name: 'guideSteps',
  title: 'Steps',
  type: 'object',
  fields: [
    defineField({
      name: 'items',
      title: 'Steps',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'stepItem',
          fields: [
            defineField({ name: 'title', type: 'string', validation: (R) => R.required() }),
            defineField({
              name: 'body',
              type: 'array',
              of: [
                stepBodyBlock,
                defineArrayMember({ type: 'guideCallout' }),
                defineArrayMember({
                  type: 'image',
                  options: { hotspot: true },
                  fields: [
                    defineField({ name: 'alt', type: 'string', title: 'Alt text' }),
                    defineField({ name: 'caption', type: 'string' }),
                  ],
                }),
              ],
            }),
          ],
          preview: { select: { title: 'title' } },
        }),
      ],
      validation: (R) => R.required().min(1),
    }),
  ],
  preview: {
    select: { title: 'items' },
    prepare: ({ title }: { title?: unknown[] }) => ({
      title: `Steps (${title?.length ?? 0})`,
    }),
  },
})
