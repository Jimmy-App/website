/**
 * Fills the pricing copy added for JIM-120 on all three locale documents.
 *
 * scripts/seed.mjs cannot do this: it builds the whole homePage from
 * messages/{locale}.json, and the `pricing` namespace no longer exists there —
 * the copy moved into Sanity. Running it would overwrite live content with
 * undefined. This patches only the fields below and leaves everything else
 * untouched.
 *
 *   SANITY_WRITE_TOKEN=... node scripts/patch-pricing-copy.mjs [--dry]
 *
 * FR uses `tu`, ES uses `tú` (neutral LatAm) per the translation guide.
 * Placeholders {pct} {annual} {beta} {amount} are filled at render from
 * pricingPlans — never spell a rate out in the copy.
 */
import { createClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'rpeljbjz'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'
const token = process.env.SANITY_WRITE_TOKEN
const dry = process.argv.includes('--dry')

if (!token && !dry) {
  console.error('SANITY_WRITE_TOKEN is required (or pass --dry to preview).')
  process.exit(1)
}

const client = createClient({ projectId, dataset, apiVersion: '2024-01-01', token, useCdn: false })

// ── Copy ─────────────────────────────────────────────────────────────────────
const COPY = {
  en: {
    title: 'One plan. Price follows your roster.',
    sliderHelp: 'Same features for every coach — drag to see your price.',
    billingMonthly: 'Monthly',
    billingAnnual: 'Annual · save {annual}%',
    perMonth: '/month',
    perMonthAnnual: '/month, billed annually',
    annualSaveBadge: 'Save {amount}/year',
    forUpTo: 'for up to',
    forUnlimited: 'for unlimited clients',
    clients: 'clients',
    ctaFree: 'Start free',
    ctaClub: 'Continue',
    benefitsEyebrow: 'Everything included, on every plan',
    feeNoteFree:
      'Payments & billing, handled for you — Jimmy takes care of invoicing, reminders and client access automatically. Included with a {pct}% fee on payments, which drops as your business grows.',
    feeNoteClub:
      'Payments & billing, handled for you — Jimmy takes care of invoicing, reminders and client access automatically. Included with just a {pct}% fee on payments at this plan.',
    annualNote:
      "Annual billing (save {annual}%) and the beta discount don't combine — the best offer applies automatically.",
    betaMonthlyOnlyNote:
      'The beta rate applies to monthly billing only — switch back to Monthly to keep your −{beta}% for life.',
  },
  fr: {
    title: 'Un seul plan. Le prix suit ton roster.',
    sliderHelp: 'Les mêmes fonctionnalités pour chaque coach — fais glisser pour voir ton prix.',
    billingMonthly: 'Mensuel',
    billingAnnual: 'Annuel · −{annual}%',
    perMonth: '/mois',
    perMonthAnnual: '/mois, facturé à l’année',
    annualSaveBadge: '{amount} en moins par an',
    forUpTo: "jusqu'à",
    forUnlimited: 'clients en illimité',
    clients: 'clients',
    ctaFree: 'Commencer gratuitement',
    ctaClub: 'Continuer',
    benefitsEyebrow: 'Tout est inclus, quel que soit le plan',
    feeNoteFree:
      'Paiements et facturation, gérés pour toi — Jimmy s’occupe des factures, des relances et de l’accès de tes clients. Inclus avec {pct}% de frais sur les paiements, qui baissent quand ton activité grandit.',
    feeNoteClub:
      'Paiements et facturation, gérés pour toi — Jimmy s’occupe des factures, des relances et de l’accès de tes clients. Inclus avec seulement {pct}% de frais sur les paiements à ce plan.',
    annualNote:
      'La facturation annuelle ({annual}% en moins) et la remise bêta ne se cumulent pas — la meilleure offre s’applique automatiquement.',
    betaMonthlyOnlyNote:
      'Le tarif bêta ne vaut que pour la facturation mensuelle — reviens sur Mensuel pour garder tes −{beta}% à vie.',
  },
  es: {
    title: 'Un solo plan. El precio sigue a tu roster.',
    sliderHelp: 'Las mismas funciones para cada coach: desliza para ver tu precio.',
    billingMonthly: 'Mensual',
    billingAnnual: 'Anual · ahorra {annual}%',
    perMonth: '/mes',
    perMonthAnnual: '/mes, facturado al año',
    annualSaveBadge: 'Ahorra {amount}/año',
    forUpTo: 'hasta',
    forUnlimited: 'clientes ilimitados',
    clients: 'clientes',
    ctaFree: 'Empezar gratis',
    ctaClub: 'Continuar',
    benefitsEyebrow: 'Todo incluido, en cualquier plan',
    feeNoteFree:
      'Pagos y facturación, resueltos por ti — Jimmy se encarga de las facturas, los recordatorios y el acceso de tus clientes. Incluido con una comisión del {pct}% sobre los pagos, que baja a medida que creces.',
    feeNoteClub:
      'Pagos y facturación, resueltos por ti — Jimmy se encarga de las facturas, los recordatorios y el acceso de tus clientes. Incluido con solo un {pct}% de comisión sobre los pagos en este plan.',
    annualNote:
      'La facturación anual (ahorra {annual}%) y el descuento beta no se combinan: se aplica automáticamente la mejor oferta.',
    betaMonthlyOnlyNote:
      'La tarifa beta solo aplica a la facturación mensual: vuelve a Mensual para conservar tu −{beta}% de por vida.',
  },
}

// The top stop stops being a number. pricingPlans is a single global document
// (prices are the same in every language), so this is patched once, not per locale.
const TOP_TIER_LABEL = 'unlimited'

const patchTopTier = async () => {
  const doc = await client.fetch(`*[_type == "pricingPlans"][0]{ _id, tiers }`)
  if (!doc?._id || !Array.isArray(doc.tiers) || doc.tiers.length === 0) {
    console.error('  ✗ pricingPlans: not found or has no tiers')
    return
  }
  const last = doc.tiers.length - 1
  if (doc.tiers[last].clients === TOP_TIER_LABEL) {
    console.log(`  · top tier already "${TOP_TIER_LABEL}"`)
    return
  }
  console.log(`  · top tier "${doc.tiers[last].clients}" -> "${TOP_TIER_LABEL}"`)
  if (dry) return
  await client.patch(doc._id).set({ [`tiers[${last}].clients`]: TOP_TIER_LABEL }).commit()
  console.log('  ✓ pricingPlans top tier renamed')
}

const run = async () => {
  await patchTopTier()

  for (const [locale, fields] of Object.entries(COPY)) {
    const doc = await client.fetch(
      `*[_type == "homePage" && language == $locale][0]{ _id }`,
      { locale },
    )
    if (!doc?._id) {
      console.error(`  ✗ ${locale}: no homePage document`)
      continue
    }
    const patch = Object.fromEntries(
      Object.entries(fields).map(([k, v]) => [`pricing.${k}`, v]),
    )
    if (dry) {
      console.log(`  · ${locale} (${doc._id}) — ${Object.keys(patch).length} fields`)
      continue
    }
    await client.patch(doc._id).set(patch).commit()
    console.log(`  ✓ ${locale} (${doc._id}) — ${Object.keys(patch).length} fields`)
  }
  console.log(dry ? '\nDry run — nothing written.' : '\nDone. Revalidate the site to see it live.')
}

run().catch((e) => {
  console.error(e.message)
  process.exit(1)
})
