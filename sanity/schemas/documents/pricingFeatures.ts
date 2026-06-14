import { defineField, defineType } from 'sanity'

export const pricingFeatures = defineType({
  name: 'pricingFeatures',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'included', type: 'boolean', initialValue: true }),
    defineField({ name: 'language', type: 'string', readOnly: true, hidden: true }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'language' },
  },
})
