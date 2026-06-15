import { defineField, defineType } from 'sanity'

export const footer = defineType({
  name: 'footer',
  type: 'document',
  fields: [
    // "Built for <em>freedom.</em>" → taglinePrefix + taglineEmphasis
    defineField({ name: 'taglinePrefix', type: 'string', description: 'e.g. "Built for "' }),
    defineField({ name: 'taglineEmphasis', type: 'string', description: 'e.g. "freedom."' }),

    // Product column
    defineField({
      name: 'productHeading',
      type: 'string',
    }),
    defineField({
      name: 'productLinks',
      type: 'array',
      of: [{ type: 'navItem' }],
    }),

    // Company column
    defineField({
      name: 'companyHeading',
      type: 'string',
    }),
    defineField({
      name: 'companyLinks',
      type: 'array',
      of: [{ type: 'navItem' }],
    }),

    // Legal column
    defineField({
      name: 'legalHeading',
      type: 'string',
    }),
    defineField({
      name: 'legalLinks',
      type: 'array',
      of: [{ type: 'navItem' }],
    }),

    defineField({ name: 'copy', type: 'string' }),
    defineField({ name: 'language', type: 'string', readOnly: true, hidden: true }),
  ],
  preview: {
    select: { subtitle: 'language' },
    prepare: ({ subtitle }) => ({ title: 'Footer', subtitle }),
  },
})
