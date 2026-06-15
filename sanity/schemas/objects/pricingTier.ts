import { defineField, defineType } from 'sanity'

export const pricingTier = defineType({
  name: 'pricingTier',
  type: 'object',
  fields: [
    defineField({ name: 'clients', type: 'string', description: 'e.g. "3", "10", "25"' }),
    defineField({ name: 'priceEur', type: 'number', description: 'EUR price (null for free tier)' }),
    defineField({ name: 'priceUsd', type: 'number', description: 'USD price (null for free tier)' }),
  ],
  preview: {
    select: { title: 'clients', subtitle: 'priceEur' },
    prepare: ({ title, subtitle }) => ({
      title: `${title} clients`,
      subtitle: subtitle != null ? `€${subtitle}/mo` : 'Free',
    }),
  },
})
