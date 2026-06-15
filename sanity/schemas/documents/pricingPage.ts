import { defineField, defineType } from 'sanity'

/**
 * Standalone /pricing page. The scaler + plan cards + add-ons are reused from
 * homePage.pricing; this document holds the page-specific FAQ + final CTA.
 * faq / finalCta mirror the homePage shapes so the same <Faq> / <FinalCta>
 * components can render them.
 */
export const pricingPage = defineType({
  name: 'pricingPage',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'language', type: 'string', readOnly: true, hidden: true }),

    // ── FAQ (same shape as homePage.faq) ──────────────────────────────────────
    defineField({
      name: 'faq',
      type: 'object',
      fields: [
        defineField({ name: 'sectionLabel', type: 'string' }),
        defineField({ name: 'eyebrow', type: 'string' }),
        defineField({ name: 'title', type: 'string' }),
        defineField({ name: 'items', type: 'array', of: [{ type: 'faqItem' }] }),
        defineField({ name: 'footNote', type: 'string' }),
        defineField({ name: 'footLink', type: 'string' }),
      ],
    }),

    // ── Final CTA (same shape as homePage.finalCta) ───────────────────────────
    defineField({
      name: 'finalCta',
      type: 'object',
      fields: [
        defineField({ name: 'sectionLabel', type: 'string' }),
        defineField({ name: 'headlinePrefix', type: 'string' }),
        defineField({ name: 'headlineAccent', type: 'string' }),
        defineField({ name: 'headlineSuffix', type: 'string' }),
        defineField({ name: 'headlineLine2', type: 'string' }),
        defineField({ name: 'subtitle', type: 'text', rows: 2 }),
        defineField({ name: 'ctaPrimary', type: 'string' }),
        defineField({ name: 'ctaSecondary', type: 'string' }),
        defineField({ name: 'socialProof', type: 'string' }),
        defineField({ name: 'tags', type: 'array', of: [{ type: 'string' }] }),
        defineField({ name: 'trustPrefix', type: 'string' }),
        defineField({ name: 'trustBold', type: 'string' }),
        defineField({ name: 'trustSuffix', type: 'string' }),
      ],
    }),

    defineField({ name: 'seo', type: 'seo' }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'language' },
  },
})
