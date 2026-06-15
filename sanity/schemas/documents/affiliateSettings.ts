import { defineField, defineType } from 'sanity'

/**
 * Global, non-localized settings for the Affiliate earnings calculator — the
 * numbers are the same in every language (€69 is €69 everywhere). The localized
 * /affiliate page holds only the labels. Mirrors the pricingPlans pattern.
 */
const currency = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: 'object',
    options: { columns: 3 },
    fields: [
      defineField({ name: 'avg', title: 'Average plan / mo', type: 'number', validation: (R) => R.required().min(0) }),
      defineField({ name: 'lo', title: 'Lowest plan', type: 'number', validation: (R) => R.required().min(0) }),
      defineField({ name: 'hi', title: 'Highest plan', type: 'number', validation: (R) => R.required().min(0) }),
    ],
  })

export const affiliateSettings = defineType({
  name: 'affiliateSettings',
  title: 'Affiliate Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'rate',
      title: 'Commission rate (%)',
      description: 'e.g. 30 → affiliates earn 30% of every referral payment.',
      type: 'number',
      initialValue: 30,
      validation: (R) => R.required().min(0).max(100),
    }),
    defineField({ name: 'sliderMin', title: 'Slider min (referrals)', type: 'number', initialValue: 5, validation: (R) => R.required().min(1) }),
    defineField({ name: 'sliderMax', title: 'Slider max (referrals)', type: 'number', initialValue: 100, validation: (R) => R.required().min(1) }),
    defineField({ name: 'sliderDefault', title: 'Slider default', type: 'number', initialValue: 25, validation: (R) => R.required().min(1) }),
    defineField({
      name: 'ticks',
      title: 'Tick marks',
      description: 'Numbers shown under the slider, e.g. 5, 25, 50, 75, 100.',
      type: 'array',
      of: [{ type: 'number' }],
      initialValue: [5, 25, 50, 75, 100],
    }),
    currency('eur', 'EUR (€)'),
    currency('usd', 'USD ($)'),
  ],
  preview: { prepare: () => ({ title: 'Affiliate Settings (calculator)' }) },
})
