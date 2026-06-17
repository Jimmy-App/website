import { defineField, defineType } from 'sanity'

/**
 * A single "What's inside" capability tile on a feature page.
 * `iconKey` maps to CAPS_ICON_MAP in features/featureMeta.tsx (code-side).
 */
export const featureCap = defineType({
  name: 'featureCap',
  title: 'Capability',
  type: 'object',
  fields: [
    defineField({
      name: 'iconKey',
      title: 'Icon key',
      type: 'string',
      description: 'lucide icon key (must exist in CAPS_ICON_MAP).',
      validation: (R) => R.required(),
    }),
    defineField({ name: 'title', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'desc', title: 'Description', type: 'text', rows: 2, validation: (R) => R.required() }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'desc' },
  },
})
