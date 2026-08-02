/**
 * JIM-146 — competitor table: add FITR as a column, add the platform-fee row.
 *
 * The fee figures:
 *   Jimmy  1%     — Club rate (Free is 5%; the footnote says so).
 *   FITR   5.99%  — coachwithfitr.com/pricing, read 2026-08-02. The ticket said
 *                   "+5%"; their own page says 5.99%, so the page wins.
 *   others —      — none of them publishes a platform fee we could verify, and
 *                   an invented percentage is the one number on this table a
 *                   competitor could fairly call a lie.
 *
 * FITR's checkmarks live in Comparison.tsx and came from coachwithfitr.com
 * /features the same day.
 *
 *   node scripts/patch-comparison-fees.mjs [--dry]
 */
import { createClient } from '@sanity/client'

const token = process.env.SANITY_WRITE_TOKEN ?? process.env.SANITY_API_TOKEN
const dry = process.argv.includes('--dry')
if (!token && !dry) {
  console.error('SANITY_WRITE_TOKEN required (or --dry).')
  process.exit(1)
}
const client = createClient({
  projectId: 'rpeljbjz',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
})

const NB = ' ' // no-break space — FR/ES put one before %

// Column order, Jimmy first. Must match Comparison.tsx's FEATURE_MATRIX.
const COMPETITORS = ['Skool', 'Trainerize', 'TrueCoach', 'FITR', 'WhatsApp']

const COPY = {
  en: {
    feeRowLabel: 'Platform transaction fee',
    feeValues: ['1%', '—', '—', '—', '5.99%', '—'],
    feeUnknownAriaLabel: 'Not published',
    feeNote:
      "Jimmy takes 1% on Club plans and 5% on Free, on top of Stripe's own processing fees. " +
      'A dash means the provider publishes no platform fee we could verify — we would rather ' +
      "leave it blank than estimate it. FITR's 5.99% is from their public pricing page, August 2026.",
  },
  es: {
    feeRowLabel: 'Comisión de transacción de la plataforma',
    feeValues: [`1${NB}%`, '—', '—', '—', `5,99${NB}%`, '—'],
    feeUnknownAriaLabel: 'No publicado',
    feeNote:
      `Jimmy cobra un 1${NB}% en los planes Club y un 5${NB}% en el plan Free, además de las ` +
      'comisiones de procesamiento de Stripe. Un guion significa que el proveedor no publica una ' +
      'comisión de plataforma que hayamos podido verificar: preferimos dejarlo vacío antes que ' +
      `estimarlo. El 5,99${NB}% de FITR proviene de su página pública de precios, agosto de 2026.`,
  },
  fr: {
    feeRowLabel: 'Commission de transaction de la plateforme',
    feeValues: [`1${NB}%`, '—', '—', '—', `5,99${NB}%`, '—'],
    feeUnknownAriaLabel: 'Non publié',
    feeNote:
      `Jimmy prélève 1${NB}% sur les offres Club et 5${NB}% sur l'offre Free, en plus des frais ` +
      'de traitement de Stripe. Un tiret signifie que le prestataire ne publie aucune commission ' +
      `de plateforme que nous ayons pu vérifier${NB}: nous préférons laisser la case vide plutôt ` +
      `que de l'estimer. Les 5,99${NB}% de FITR proviennent de leur page tarifaire publique, août 2026.`,
  },
}

const docs = await client.fetch(
  '*[_type == "homePage"]{_id, language, "competitors": comparison.competitors}',
)

for (const doc of docs) {
  const copy = COPY[doc.language]
  if (!copy) {
    console.warn(`  ! ${doc.language}: no copy defined, skipped`)
    continue
  }

  const set = {
    'comparison.competitors': COMPETITORS,
    'comparison.feeRowLabel': copy.feeRowLabel,
    'comparison.feeValues': copy.feeValues,
    'comparison.feeUnknownAriaLabel': copy.feeUnknownAriaLabel,
    'comparison.feeNote': copy.feeNote,
  }

  console.log(`\n[${doc.language}] ${doc._id}`)
  console.log(`  competitors: ${(doc.competitors ?? []).join(', ')}`)
  console.log(`            -> ${COMPETITORS.join(', ')}`)
  console.log(`  fee row:      ${copy.feeRowLabel} = ${copy.feeValues.join(' | ')}`)

  if (dry) continue
  await client.patch(doc._id).set(set).commit()
  console.log('  ✓ patched')
}

console.log(dry ? '\nDry run — nothing written.' : '\nDone.')
