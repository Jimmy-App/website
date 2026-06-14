import { defineField, defineType } from 'sanity'

export const pricing = defineType({
  name: 'pricing',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'description', type: 'text' }),
    defineField({ name: 'priceMonthly', type: 'number' }),
    defineField({ name: 'priceYearly', type: 'number' }),
    defineField({
      name: 'features',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'pricingFeatures' }] }],
    }),
    defineField({ name: 'highlighted', type: 'boolean', initialValue: false }),
    defineField({ name: 'language', type: 'string', readOnly: true, hidden: true }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'language' },
  },
})
