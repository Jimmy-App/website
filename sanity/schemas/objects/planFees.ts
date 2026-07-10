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
      name: 'stripePct',
      type: 'number',
      title: 'Stripe %',
      description: 'e.g. 2.9 → "Stripe 2.9%"',
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
    select: { stripePct: 'stripePct', jimmyPct: 'jimmyPct' },
    prepare: ({ stripePct, jimmyPct }) => ({
      title: `Stripe ${stripePct}% · Jimmy ${jimmyPct}%`,
    }),
  },
})
