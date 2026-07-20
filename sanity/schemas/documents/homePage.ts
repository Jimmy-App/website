import { defineField, defineType } from 'sanity'

export const homePage = defineType({
  name: 'homePage',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'language', type: 'string', readOnly: true, hidden: true }),

    // ── Hero ─────────────────────────────────────────────────────────────────
    defineField({
      name: 'hero',
      type: 'object',
      fields: [
        defineField({ name: 'sectionLabel', type: 'string' }),
        defineField({ name: 'badge', type: 'string' }),
        // "The Skool of <accent>Fitness.</accent>" → headlinePrefix + headlineAccent
        defineField({ name: 'headlinePrefix', type: 'string' }),
        defineField({ name: 'headlineAccent', type: 'string' }),
        defineField({ name: 'subtitle', type: 'string' }),
        defineField({ name: 'description', type: 'text', rows: 3 }),
        defineField({ name: 'ctaPrimary', type: 'string' }),
        defineField({ name: 'ctaSecondary', type: 'string' }),
        defineField({ name: 'trustTrial', type: 'string' }),
        defineField({ name: 'trustNoCard', type: 'string' }),
        defineField({ name: 'trustFreeClients', type: 'string' }),
        defineField({ name: 'calloutSkool', type: 'string' }),
        defineField({ name: 'calloutWhatsapp', type: 'string' }),
        defineField({ name: 'calloutTrainheroic', type: 'string' }),
        defineField({ name: 'productLabel', type: 'string' }),
        defineField({ name: 'productSubtext', type: 'string' }),
        defineField({ name: 'productImageAlt', type: 'string' }),
        defineField({ name: 'brandNote', type: 'string' }),
      ],
    }),

    // ── Features ─────────────────────────────────────────────────────────────
    defineField({
      name: 'features',
      type: 'object',
      fields: [
        defineField({ name: 'ariaLabel', type: 'string' }),
        defineField({ name: 'eyebrow', type: 'string' }),
        // "One platform. <accent>Everything</accent> your coaching needs."
        // → titlePrefix + titleAccent + titleSuffix
        defineField({ name: 'titlePrefix', type: 'string' }),
        defineField({ name: 'titleAccent', type: 'string' }),
        defineField({ name: 'titleSuffix', type: 'string' }),
        defineField({ name: 'tablistLabel', type: 'string' }),
        defineField({ name: 'cta', type: 'string' }),
        defineField({
          name: 'tabs',
          type: 'array',
          of: [{ type: 'featureTab' }],
        }),
      ],
    }),

    // ── Why Jimmy ─────────────────────────────────────────────────────────────
    defineField({
      name: 'why',
      type: 'object',
      fields: [
        defineField({ name: 'ariaLabel', type: 'string' }),
        defineField({
          name: 'heading',
          type: 'object',
          fields: [
            defineField({ name: 'line1', type: 'string' }),
            defineField({ name: 'line2', type: 'string' }),
            defineField({ name: 'line3', type: 'string' }),
            defineField({ name: 'accent', type: 'string' }),
          ],
        }),
        defineField({
          name: 'toggle',
          type: 'object',
          fields: [
            defineField({ name: 'ariaLabel', type: 'string' }),
            defineField({ name: 'without', type: 'string' }),
            defineField({ name: 'with', type: 'string' }),
          ],
        }),
        defineField({
          name: 'desc',
          type: 'object',
          fields: [
            defineField({ name: 'without', type: 'text', rows: 2 }),
            defineField({ name: 'with', type: 'text', rows: 2 }),
          ],
        }),
        defineField({
          name: 'bullets',
          type: 'object',
          fields: [
            defineField({ name: 'without', type: 'array', of: [{ type: 'string' }] }),
            defineField({ name: 'with', type: 'array', of: [{ type: 'string' }] }),
          ],
        }),
        defineField({
          name: 'preview',
          type: 'object',
          fields: [
            defineField({
              name: 'without',
              type: 'object',
              fields: [
                defineField({
                  name: 'card1',
                  type: 'object',
                  fields: [
                    defineField({ name: 'name', type: 'string' }),
                    defineField({ name: 'desc', type: 'text', rows: 2 }),
                  ],
                }),
                defineField({
                  name: 'card2',
                  type: 'object',
                  fields: [
                    defineField({ name: 'name', type: 'string' }),
                    defineField({ name: 'desc', type: 'text', rows: 2 }),
                  ],
                }),
                defineField({
                  name: 'card3',
                  type: 'object',
                  fields: [
                    defineField({ name: 'name', type: 'string' }),
                    defineField({ name: 'desc', type: 'text', rows: 2 }),
                  ],
                }),
                defineField({
                  name: 'card4',
                  type: 'object',
                  fields: [
                    defineField({ name: 'name', type: 'string' }),
                    defineField({ name: 'desc', type: 'text', rows: 2 }),
                  ],
                }),
              ],
            }),
            defineField({
              name: 'with',
              type: 'object',
              fields: [
                defineField({ name: 'imgAlt', type: 'string' }),
                // In-app illustration ("With Jimmy" state)
                defineField({ name: 'appName', type: 'string', description: 'App header name, e.g. "Jimmy"' }),
                defineField({ name: 'appTagline', type: 'string', description: 'e.g. "Everything in one place"' }),
                defineField({ name: 'syncedLabel', type: 'string', description: 'e.g. "Synced"' }),
                defineField({
                  name: 'modules',
                  type: 'array',
                  description: 'In-app modules, in the same order as the "without" cards (4 items).',
                  of: [
                    {
                      type: 'object',
                      fields: [
                        defineField({ name: 'label', type: 'string' }),
                        defineField({ name: 'sub', type: 'string' }),
                      ],
                      preview: { select: { title: 'label', subtitle: 'sub' } },
                    },
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),

    // ── Steps ─────────────────────────────────────────────────────────────────
    defineField({
      name: 'steps',
      type: 'object',
      fields: [
        defineField({ name: 'sectionLabel', type: 'string' }),
        defineField({ name: 'eyebrow', type: 'string' }),
        // "Launch your premium coaching <accent>in 3 steps.</accent>"
        // → titlePrefix + titleAccent
        defineField({ name: 'titlePrefix', type: 'string' }),
        defineField({ name: 'titleAccent', type: 'string' }),
        defineField({ name: 'subtitle', type: 'string' }),
        defineField({
          name: 'step1',
          type: 'object',
          fields: [
            defineField({ name: 'title', type: 'string' }),
            defineField({ name: 'desc', type: 'text', rows: 2 }),
          ],
        }),
        defineField({
          name: 'step2',
          type: 'object',
          fields: [
            defineField({ name: 'title', type: 'string' }),
            defineField({ name: 'desc', type: 'text', rows: 2 }),
          ],
        }),
        defineField({
          name: 'step3',
          type: 'object',
          fields: [
            defineField({ name: 'title', type: 'string' }),
            defineField({ name: 'desc', type: 'text', rows: 2 }),
          ],
        }),
        defineField({ name: 'cta', type: 'string' }),
      ],
    }),

    // ── Platform ──────────────────────────────────────────────────────────────
    defineField({
      name: 'platform',
      type: 'object',
      fields: [
        defineField({ name: 'ariaLabel', type: 'string' }),
        defineField({ name: 'eyebrow', type: 'string' }),
        defineField({ name: 'title', type: 'string' }),
        defineField({ name: 'subtitle', type: 'text', rows: 2 }),
        defineField({ name: 'navLabel', type: 'string' }),
        defineField({
          name: 'steps',
          type: 'array',
          of: [{ type: 'platformStep' }],
        }),
      ],
    }),

    // ── Tech ──────────────────────────────────────────────────────────────────
    defineField({
      name: 'tech',
      type: 'object',
      fields: [
        defineField({ name: 'sectionLabel', type: 'string' }),
        defineField({ name: 'eyebrow', type: 'string' }),
        // "Not a hacked-together app. <em>A truly native one.</em>"
        // → headlineLead + headlineAccent
        defineField({ name: 'headlineLead', type: 'string' }),
        defineField({ name: 'headlineAccent', type: 'string' }),
        defineField({ name: 'body', type: 'text', rows: 3 }),
        defineField({ name: 'tile1Title', type: 'string' }),
        defineField({ name: 'tile1Desc', type: 'text', rows: 2 }),
        defineField({ name: 'tile2Title', type: 'string' }),
        defineField({ name: 'tile2Desc', type: 'text', rows: 2 }),
        defineField({ name: 'tile3Title', type: 'string' }),
        defineField({ name: 'tile3Desc', type: 'text', rows: 2 }),
        defineField({ name: 'appStoreLabel', type: 'string' }),
        defineField({ name: 'appStoreSub', type: 'string' }),
        defineField({ name: 'appStoreMain', type: 'string' }),
        defineField({ name: 'playStoreLabel', type: 'string' }),
        defineField({ name: 'playStoreSub', type: 'string' }),
        defineField({ name: 'playStoreMain', type: 'string' }),
        defineField({ name: 'visualAlt', type: 'string' }),
      ],
    }),

    // ── Comparison ────────────────────────────────────────────────────────────
    defineField({
      name: 'comparison',
      type: 'object',
      fields: [
        defineField({ name: 'ariaLabel', type: 'string' }),
        defineField({ name: 'eyebrow', type: 'string' }),
        defineField({ name: 'title', type: 'string' }),
        defineField({ name: 'subtitle', type: 'text', rows: 2 }),
        defineField({ name: 'tableAriaLabel', type: 'string' }),
        defineField({ name: 'featureColumnLabel', type: 'string' }),
        defineField({ name: 'jimmyBadge', type: 'string' }),
        defineField({ name: 'competitors', type: 'array', of: [{ type: 'string' }] }),
        defineField({ name: 'features', type: 'array', of: [{ type: 'string' }] }),
        defineField({ name: 'footerLabel', type: 'string' }),
      ],
    }),

    // ── Pricing ───────────────────────────────────────────────────────────────
    defineField({
      name: 'pricing',
      type: 'object',
      fields: [
        defineField({ name: 'sectionLabel', type: 'string' }),
        defineField({ name: 'promoBadge', type: 'string' }),
        defineField({ name: 'promoTextBold', type: 'string' }),
        defineField({ name: 'promoTextRest', type: 'string' }),
        defineField({ name: 'eyebrow', type: 'string' }),
        defineField({ name: 'title', type: 'string' }),
        defineField({ name: 'subtitle', type: 'text', rows: 2 }),
        defineField({ name: 'sliderQuestion', type: 'string' }),
        defineField({ name: 'sliderHelp', type: 'string' }),
        defineField({ name: 'currencyLabel', type: 'string' }),
        defineField({ name: 'sliderAriaLabel', type: 'string' }),
        defineField({ name: 'clients', type: 'string' }),
        defineField({ name: 'planFree', type: 'string' }),
        defineField({ name: 'planClub', type: 'string' }),
        defineField({ name: 'betaBadge', type: 'string' }),
        defineField({ name: 'perMonth', type: 'string' }),
        defineField({ name: 'forUpTo', type: 'string' }),
        defineField({ name: 'feesLabel', type: 'string' }),
        // Incentive strip framing (no numbers — the fee % delta is injected from
        // the pricingPlans data so copy and rates never drift apart).
        defineField({
          name: 'feeSaveFree',
          title: 'Fee incentive — Free view',
          type: 'string',
          description:
            'Strip shown on the Free plan (nudge to Club). Currently "Halve your fee on Club". The 5%→2.5% numbers are added automatically.',
        }),
        defineField({
          name: 'feeSaveClub',
          title: 'Fee incentive — Club view',
          type: 'string',
          description:
            'Strip shown on Club plans (confirms the saving). Currently "Half the fee vs Free". The 5%→2.5% numbers are added automatically.',
        }),
        defineField({ name: 'ctaFree', type: 'string' }),
        defineField({ name: 'ctaClub', type: 'string' }),
        defineField({ name: 'lockNote', type: 'text', rows: 2 }),
        defineField({ name: 'whatsIncluded', type: 'string' }),
        // "The same platform, whichever plan you choose" band under the slider.
        defineField({
          name: 'benefitsEyebrow',
          title: 'Benefits band — eyebrow',
          type: 'string',
          description: 'Small caps heading above the 4 benefit cards, e.g. "The same platform, whichever plan you choose".',
        }),
        defineField({
          name: 'benefits',
          title: 'Benefits band — cards',
          type: 'array',
          description: 'The 4 benefit cards shown below the pricing slider (same for Free & Club).',
          of: [
            {
              type: 'object',
              name: 'pricingBenefit',
              fields: [
                defineField({
                  name: 'iconKey',
                  title: 'Icon',
                  type: 'string',
                  options: {
                    list: [
                      { title: 'Workout builder', value: 'workout' },
                      { title: 'Messaging', value: 'messaging' },
                      { title: 'Client app', value: 'app' },
                      { title: 'Payments', value: 'payments' },
                      { title: 'Community', value: 'community' },
                      { title: 'Courses', value: 'courses' },
                    ],
                  },
                }),
                defineField({ name: 'text', title: 'Text', type: 'string' }),
              ],
              preview: { select: { title: 'text', subtitle: 'iconKey' } },
            },
          ],
        }),
        defineField({ name: 'freeTag', type: 'string' }),
        defineField({ name: 'clubTag', type: 'string' }),
        // Plan-card price labels
        defineField({ name: 'freePerLabel', type: 'string', description: 'e.g. "/month forever"' }),
        defineField({ name: 'clubPerPrefix', type: 'string', description: 'e.g. "/mo · up to" (client count appended)' }),
        defineField({ name: 'popularLabel', type: 'string', description: 'e.g. "Most popular" (badge on the Club card)' }),
        defineField({ name: 'freeFeatures', type: 'array', of: [{ type: 'string' }] }),
        defineField({ name: 'clubFeatures', type: 'array', of: [{ type: 'string' }] }),
        defineField({ name: 'addonsLabel', type: 'string' }),
        defineField({
          name: 'addons',
          type: 'array',
          of: [{ type: 'pricingAddon' }],
        }),
        // NOTE: price tiers now live in the global `pricingPlans` singleton.
      ],
    }),

    // ── Beta ──────────────────────────────────────────────────────────────────
    defineField({
      name: 'beta',
      type: 'object',
      fields: [
        defineField({ name: 'ariaLabel', type: 'string' }),
        defineField({ name: 'badge', type: 'string' }),
        // "You're not buying a product.<br></br>You're <accent>co-building</accent> a platform."
        // → titleLine1 + titleLine2Prefix + titleLine2Accent + titleLine2Suffix
        defineField({ name: 'titleLine1', type: 'string' }),
        defineField({ name: 'titleLine2Prefix', type: 'string' }),
        defineField({ name: 'titleLine2Accent', type: 'string' }),
        defineField({ name: 'titleLine2Suffix', type: 'string' }),
        // body has <em> markup → Portable Text
        defineField({ name: 'body', type: 'portableTextBlock' }),
        defineField({
          name: 'card1',
          type: 'object',
          fields: [
            defineField({ name: 'title', type: 'string' }),
            defineField({ name: 'desc', type: 'text', rows: 2 }),
          ],
        }),
        defineField({
          name: 'card2',
          type: 'object',
          fields: [
            defineField({ name: 'title', type: 'string' }),
            defineField({ name: 'desc', type: 'text', rows: 2 }),
          ],
        }),
        defineField({
          name: 'card3',
          type: 'object',
          fields: [
            defineField({ name: 'title', type: 'string' }),
            defineField({ name: 'desc', type: 'text', rows: 2 }),
          ],
        }),
      ],
    }),

    // ── Team ──────────────────────────────────────────────────────────────────
    defineField({
      name: 'team',
      type: 'object',
      fields: [
        defineField({ name: 'sectionLabel', type: 'string' }),
        defineField({ name: 'eyebrow', type: 'string' }),
        defineField({ name: 'title', type: 'string' }),
        defineField({ name: 'subtitle', type: 'string' }),
        defineField({
          name: 'members',
          type: 'array',
          of: [{ type: 'teamMember' }],
        }),
        defineField({
          name: 'stats',
          type: 'array',
          of: [{ type: 'teamStat' }],
        }),
      ],
    }),

    // ── FAQ ───────────────────────────────────────────────────────────────────
    defineField({
      name: 'faq',
      type: 'object',
      fields: [
        defineField({ name: 'sectionLabel', type: 'string' }),
        defineField({ name: 'eyebrow', type: 'string' }),
        defineField({ name: 'title', type: 'string' }),
        defineField({
          name: 'items',
          type: 'array',
          of: [{ type: 'faqItem' }],
        }),
        defineField({ name: 'footNote', type: 'string' }),
        defineField({ name: 'footLink', type: 'string' }),
      ],
    }),

    // ── Manifesto ─────────────────────────────────────────────────────────────
    defineField({
      name: 'manifesto',
      type: 'object',
      fields: [
        defineField({ name: 'sectionLabel', type: 'string' }),
        defineField({ name: 'label', type: 'string' }),
        defineField({ name: 'headlineLine1', type: 'string' }),
        // "Jimmy creates an <em>experience.</em>" → line2Prefix + line2Accent
        defineField({ name: 'headlineLine2Prefix', type: 'string' }),
        defineField({ name: 'headlineLine2Accent', type: 'string' }),
        defineField({ name: 'headlineLine3', type: 'string' }),
        // body has <b> markup → Portable Text
        defineField({ name: 'body', type: 'portableTextBlock' }),
        // mantra: "<em>Less is more.</em> Built to belong."
        // → mantraEmphasis + mantraRest
        defineField({ name: 'mantraEmphasis', type: 'string' }),
        defineField({ name: 'mantraRest', type: 'string' }),
      ],
    }),

    // ── Final CTA ─────────────────────────────────────────────────────────────
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
        // trustText: "No commitment · No credit card · <b>-15% for life</b> for beta coaches"
        // → trustPrefix + trustBold + trustSuffix
        defineField({ name: 'trustPrefix', type: 'string' }),
        defineField({ name: 'trustBold', type: 'string' }),
        defineField({ name: 'trustSuffix', type: 'string' }),
      ],
    }),

    // ── SEO ───────────────────────────────────────────────────────────────────
    defineField({ name: 'seo', type: 'seo' }),
  ],

  preview: {
    select: { title: 'title', subtitle: 'language' },
  },
})
