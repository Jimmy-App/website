import { defineField, defineType } from 'sanity'

export const navigation = defineType({
  name: 'navigation',
  type: 'document',
  fields: [
    // ── Features mega-menu ───────────────────────────────────────────────────
    defineField({
      name: 'featuresLabel',
      type: 'string',
      description: 'nav.features.label',
    }),
    defineField({ name: 'featuresForCoaches', type: 'string' }),
    defineField({ name: 'featuresForMembers', type: 'string' }),
    defineField({
      name: 'featuresItems',
      type: 'array',
      of: [{ type: 'navMegaItem' }],
      description: 'Coach + member feature items',
    }),
    defineField({
      name: 'featuresCta',
      type: 'object',
      fields: [
        defineField({ name: 'label', type: 'string' }),
        defineField({ name: 'title', type: 'string' }),
        defineField({ name: 'body', type: 'string' }),
        defineField({ name: 'btn', type: 'string' }),
      ],
    }),

    // ── Resources mega-menu ──────────────────────────────────────────────────
    defineField({ name: 'resourcesLabel', type: 'string' }),
    defineField({ name: 'resourcesContent', type: 'string' }),
    defineField({ name: 'resourcesCommunity', type: 'string' }),
    defineField({
      name: 'resourcesItems',
      type: 'array',
      of: [{ type: 'navMegaItem' }],
    }),

    // ── Top-level labels ─────────────────────────────────────────────────────
    defineField({ name: 'pricing', type: 'string' }),
    defineField({ name: 'affiliate', type: 'string' }),
    defineField({ name: 'newBadge', type: 'string' }),
    defineField({ name: 'login', type: 'string' }),
    defineField({ name: 'getStarted', type: 'string' }),
    defineField({ name: 'getStartedShort', type: 'string' }),
    defineField({ name: 'openMenu', type: 'string' }),
    defineField({ name: 'close', type: 'string' }),
    defineField({ name: 'menu', type: 'string' }),

    defineField({ name: 'language', type: 'string', readOnly: true, hidden: true }),
  ],
  preview: {
    select: { subtitle: 'language' },
    prepare: ({ subtitle }) => ({ title: 'Navigation', subtitle }),
  },
})
