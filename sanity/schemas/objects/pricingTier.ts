import { defineField, defineType } from 'sanity'

/**
 * One roster size and what it costs.
 *
 * Monthly and annual are stored separately rather than deriving one from the
 * other with a percentage. A derived price cannot be adjusted per tier, and it
 * quietly produces figures like €39.17 that nobody chose to charge — annual
 * pricing is a commercial decision, so it is entered, not computed.
 *
 * Annual prices are the MONTHLY-EQUIVALENT when billing yearly (what the page
 * shows as "€23.20 /month, billed annually"), not the yearly total.
 */
export const pricingTier = defineType({
  name: 'pricingTier',
  type: 'object',
  fields: [
    defineField({ name: 'clients', type: 'string', description: 'e.g. "3", "10", "25"' }),
    defineField({ name: 'priceEur', type: 'number', description: 'EUR price per month (null for free tier)' }),
    defineField({ name: 'priceUsd', type: 'number', description: 'USD price per month (null for free tier)' }),
    defineField({
      name: 'priceEurAnnual',
      type: 'number',
      title: 'EUR — monthly equivalent, billed annually',
      description:
        'Leave empty to fall back to the monthly price minus the annual discount %.',
    }),
    defineField({
      name: 'priceUsdAnnual',
      type: 'number',
      title: 'USD — monthly equivalent, billed annually',
      description:
        'Leave empty to fall back to the monthly price minus the annual discount %.',
    }),
  ],
  preview: {
    select: { title: 'clients', subtitle: 'priceEur', annual: 'priceEurAnnual' },
    prepare: ({ title, subtitle, annual }) => ({
      title: `${title} clients`,
      subtitle:
        subtitle != null
          ? `€${subtitle}/mo${annual != null ? ` · €${annual}/mo annual` : ''}`
          : 'Free',
    }),
  },
})
