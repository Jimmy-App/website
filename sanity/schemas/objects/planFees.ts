import { defineField, defineType } from 'sanity'

/**
 * Transaction-fee numbers for one plan, rendered under the plan cards as
 * "Transaction fees — Stripe {stripePct}% + {€/$}{stripeFixed} · Jimmy {jimmyPct}%".
 * Lives on the global (non-localized) pricingPlans singleton: change once,
 * every language updates. The currency switcher picks the EUR or USD fixed part.
 */
export const planFees = defineType({
  name: 'planFees',
  type: 'object',
  fields: [
    defineField({
      name: 'stripePctEur',
      type: 'number',
      title: 'Stripe % (EUR)',
      description: 'e.g. 1.4 → "Stripe 1.4%" when the currency switcher is on €',
      validation: (Rule) => Rule.required().min(0).max(100),
    }),
    defineField({
      name: 'stripeFixedEur',
      type: 'number',
      title: 'Stripe fixed fee (EUR)',
      description: 'e.g. 0.3 → "€0.30"',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'stripePctUsd',
      type: 'number',
      title: 'Stripe % (USD)',
      description: 'e.g. 2.9 → "Stripe 2.9%" when the currency switcher is on $',
      validation: (Rule) => Rule.required().min(0).max(100),
    }),
    defineField({
      name: 'stripeFixedUsd',
      type: 'number',
      title: 'Stripe fixed fee (USD)',
      description: 'e.g. 0.3 → "$0.30"',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'jimmyPct',
      type: 'number',
      title: 'Jimmy %',
      description: 'e.g. 5 → "Jimmy 5%"',
      validation: (Rule) => Rule.required().min(0).max(100),
    }),
  ],
  preview: {
    select: { stripePctEur: 'stripePctEur', stripePctUsd: 'stripePctUsd', jimmyPct: 'jimmyPct' },
    prepare: ({ stripePctEur, stripePctUsd, jimmyPct }) => ({
      title: `Stripe €${stripePctEur}% / $${stripePctUsd}% · Jimmy ${jimmyPct}%`,
    }),
  },
})
