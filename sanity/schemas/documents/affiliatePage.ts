import { defineField, defineType } from 'sanity'

const str = (name: string, opts: Record<string, unknown> = {}) =>
  defineField({ name, type: 'string', ...opts })
const txt = (name: string, rows = 2) => defineField({ name, type: 'text', rows })

/**
 * Localized /affiliate page. All copy (incl. the "How it works" illustration
 * micro-labels) lives here per language; the calculator NUMBERS come from the
 * non-localized `affiliateSettings` singleton. Tooltip fields support the
 * placeholders {avg} {perRef} {rate} which are filled at render time.
 */
export const affiliatePage = defineType({
  name: 'affiliatePage',
  title: 'Affiliate Page',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'language', type: 'string', readOnly: true, hidden: true }),

    // ── Hero ──────────────────────────────────────────────────────────────────
    defineField({
      name: 'hero',
      type: 'object',
      fields: [
        str('socialProof'),
        str('eyebrow'),
        str('headlinePrefix'),
        str('headlineAccent', { description: 'Highlighted (purple) part of the headline.' }),
        str('headlineSuffix'),
        txt('subtitle'),
        str('ctaPrimary'),
        str('ctaSecondary'),
      ],
    }),

    // ── Calculator labels (numbers come from Affiliate Settings) ──────────────
    defineField({
      name: 'calc',
      title: 'Calculator',
      type: 'object',
      fields: [
        str('title'),
        str('helper'),
        str('coachesSuffix', { description: 'Slider bubble suffix, e.g. "coaches".' }),
        str('perMo', { description: 'Short "per month" unit, e.g. "/mo".' }),
        str('estimateLabel'),
        str('recurringBadge', { description: 'e.g. "30% recurring".' }),
        str('monthlyLabel'),
        str('perYearTemplate', { description: 'Use {v} for the amount, e.g. "≈ {v} / yr".' }),
        str('basisLabel', { description: 'e.g. "Avg. Club plan".' }),
        str('basisRangePrefix', { description: 'e.g. "Real Club plans run".' }),
        str('basisRangeSuffix', { description: 'e.g. "— yours may earn more.".' }),
        txt('footnote'),
        str('referralsLabel'),
        str('perMonthLabel'),
        txt('perMonthTip', 3),
        str('perYearLabel'),
        txt('perYearTip', 3),
        str('cta'),
        txt('note'),
      ],
    }),

    // ── How it works ──────────────────────────────────────────────────────────
    defineField({
      name: 'how',
      title: 'How it works',
      type: 'object',
      fields: [
        str('eyebrow'),
        str('title'),
        txt('subtitle'),
        defineField({
          name: 'steps',
          type: 'array',
          validation: (R) => R.length(3),
          of: [
            defineField({
              name: 'step',
              type: 'object',
              fields: [str('label'), str('name'), str('tagline')],
              preview: { select: { title: 'name', subtitle: 'label' } },
            }),
          ],
        }),
        defineField({
          name: 'labels',
          title: 'Illustration labels',
          type: 'object',
          options: { collapsible: true, collapsed: true },
          fields: [
            // Step 1
            str('partnerBarTitle'), str('freeBadge'), str('accountName'), str('accountRole'),
            str('approved'), str('referralLinkLabel'), str('copy'), str('copied'), str('copiedToast'),
            defineField({ name: 'tagsStep1', type: 'array', of: [{ type: 'string' }] }),
            // Step 2
            str('shareBarTitle'), str('liveBadge'), str('linkClicksLabel'), str('clicksBadge'),
            defineField({
              name: 'channels',
              type: 'array',
              validation: (R) => R.length(3),
              of: [
                defineField({
                  name: 'channel',
                  type: 'object',
                  fields: [str('name'), str('source')],
                  preview: { select: { title: 'name', subtitle: 'source' } },
                }),
              ],
            }),
            defineField({ name: 'tagsStep2', type: 'array', of: [{ type: 'string' }] }),
            // Step 3
            str('commissionsBarTitle'), str('monthBadge'), str('availableLabel'), str('withdraw'),
            str('newPaymentTemplate', { description: 'Use {amt}, e.g. "New payment of {amt} received".' }),
            str('completed'), str('commissionTag'),
            defineField({ name: 'tagsStep3', type: 'array', of: [{ type: 'string' }] }),
          ],
        }),
      ],
    }),

    // ── Why partner ───────────────────────────────────────────────────────────
    defineField({
      name: 'why',
      title: 'Why partner',
      type: 'object',
      fields: [
        str('eyebrow'),
        str('title'),
        defineField({
          name: 'cards',
          type: 'array',
          validation: (R) => R.length(4),
          of: [
            defineField({
              name: 'card',
              type: 'object',
              fields: [str('title'), txt('body')],
              preview: { select: { title: 'title' } },
            }),
          ],
        }),
      ],
    }),

    // ── Who it's for ──────────────────────────────────────────────────────────
    defineField({
      name: 'who',
      title: "Who it's for",
      type: 'object',
      fields: [
        str('title'),
        txt('subtitle'),
        defineField({
          name: 'items',
          type: 'array',
          validation: (R) => R.length(4),
          of: [
            defineField({
              name: 'item',
              type: 'object',
              fields: [str('title'), str('sub')],
              preview: { select: { title: 'title', subtitle: 'sub' } },
            }),
          ],
        }),
      ],
    }),

    // ── FAQ (same shape as homePage.faq) ──────────────────────────────────────
    defineField({
      name: 'faq',
      type: 'object',
      fields: [
        str('eyebrow'),
        str('title'),
        defineField({ name: 'items', type: 'array', of: [{ type: 'faqItem' }] }),
        str('footNote'),
        str('footLink'),
      ],
    }),

    // ── Final CTA (same shape as PricingCta) ──────────────────────────────────
    defineField({
      name: 'finalCta',
      type: 'object',
      fields: [
        str('headlinePrefix'),
        str('headlineAccent'),
        str('headlineSuffix'),
        str('headlineLine2'),
        txt('subtitle'),
        str('ctaPrimary'),
        str('ctaSecondary'),
        defineField({ name: 'tags', type: 'array', of: [{ type: 'string' }] }),
      ],
    }),

    defineField({ name: 'seo', type: 'seo' }),
  ],
  preview: { select: { title: 'title', subtitle: 'language' } },
})
