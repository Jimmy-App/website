import { defineField, defineType } from 'sanity'

/**
 * SINGLE global source of truth for tariff plans + prices. Not localized —
 * numbers are the same in every language. Both the home Pricing section and
 * the /pricing page read from here, so changing a price updates the whole site.
 * Localized labels (plan names, feature lists, slider copy) stay per-locale in
 * homePage.pricing.
 */
export const pricingPlans = defineType({
  name: 'pricingPlans',
  type: 'document',
  fields: [
    defineField({
      name: 'tiers',
      type: 'array',
      of: [{ type: 'pricingTier' }],
      description:
        'Price tiers in order: index 0 = Free (clients only, no price), then the CLUB tiers.',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'betaDiscountPct',
      type: 'number',
      title: 'Beta discount (%)',
      description: 'e.g. 15 → CLUB shown at −15% (×0.85). Applies everywhere.',
      initialValue: 15,
      validation: (Rule) => Rule.required().min(0).max(100),
    }),
    defineField({
      name: 'feesFree',
      type: 'planFees',
      title: 'Transaction fees — Free plan',
      description:
        'Shown as "Transaction fees — Stripe X% + €Y · Jimmy Z%" on the Free card. Global for all languages.',
    }),
    defineField({
      name: 'feesClub',
      type: 'planFees',
      title: 'Transaction fees — Club plans',
      description:
        'Shown on the Club card. Global for all languages; the currency switcher picks € or $.',
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Pricing Plans (prices)' }),
  },
})
