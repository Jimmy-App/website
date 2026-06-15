/**
 * Create the global `pricingPlans` singleton (tiers + beta discount) and add the
 * plan-card price labels to homePage.pricing for each locale. Surgical.
 * Run: set -a; . ./.env.local; set +a; node scripts/seed-pricing-plans.mjs
 */
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.SANITY_API_VERSION || '2024-02-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

let n = 0
const k = () => `t${(n++).toString(36)}`

const TIERS = [
  { clients: '3' },
  { clients: '10', priceEur: 29, priceUsd: 32 },
  { clients: '25', priceEur: 49, priceUsd: 54 },
  { clients: '50', priceEur: 79, priceUsd: 86 },
  { clients: '100', priceEur: 99, priceUsd: 108 },
  { clients: '200', priceEur: 149, priceUsd: 162 },
].map((t) => ({ _key: k(), _type: 'pricingTier', ...t }))

const PLAN_LABELS = {
  en: { freePerLabel: '/month forever', clubPerPrefix: '/mo · up to', popularLabel: 'Most popular' },
  fr: { freePerLabel: '/mois pour toujours', clubPerPrefix: '/mois · jusqu’à', popularLabel: 'Le plus populaire' },
  es: { freePerLabel: '/mes para siempre', clubPerPrefix: '/mes · hasta', popularLabel: 'Más popular' },
}

async function run() {
  await client.createOrReplace({
    _id: 'pricingPlans',
    _type: 'pricingPlans',
    tiers: TIERS,
    betaDiscountPct: 15,
  })
  console.log('✔ pricingPlans singleton created (6 tiers, −15%)')

  for (const [locale, labels] of Object.entries(PLAN_LABELS)) {
    await client
      .patch(`homePage-${locale}`)
      .set({
        'pricing.freePerLabel': labels.freePerLabel,
        'pricing.clubPerPrefix': labels.clubPerPrefix,
        'pricing.popularLabel': labels.popularLabel,
      })
      .unset(['pricing.tiers'])
      .commit()
    console.log(`✔ homePage-${locale}: plan labels set, pricing.tiers removed`)
  }
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
