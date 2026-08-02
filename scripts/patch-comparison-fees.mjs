/**
 * JIM-146 — competitor table: add FITR as a column, add the platform-fee row.
 *
 * The fee figures, all from the provider's own pages, read 2026-08-02:
 *   Jimmy      1%     — Club rate (Free is 5%; the footnote says so).
 *   Skool      2.9%   — skool.com/pricing, Pro plan. Hobby is 10%; the
 *                       footnote says that too rather than quietly quoting
 *                       whichever number flatters us.
 *   Trainerize 3.15%  — from Nazar, 2026-08-02. NOT on any Trainerize page:
 *                       their pricing page states no rate and points at Stripe,
 *                       and the "1.9%" / "up to 5%" figures on the web are all
 *                       from rivals selling against Trainerize. We have no
 *                       citation for this one if it is ever challenged.
 *   TrueCoach  5%     — help.truecoach.co, "a flat 5% fee per transaction".
 *   FITR       5.99%  — coachwithfitr.com/pricing. The ticket said "+5%";
 *                       their own page says 5.99%, so the page wins.
 *   WhatsApp   —      — no payments feature at all (see the payments row), so
 *                       the dash means "nothing to charge a fee on", not
 *                       "unpublished". The aria-label says so.
 *
 * These are NOT like for like and the footnote has to say so: our 1% sits on
 * top of Stripe, while Skool's and TrueCoach's published rates look all-in.
 * Printing "1% vs 2.9%" bare would read as three times cheaper when a coach
 * actually pays us ~3.9% all-in — dearer than Skool Pro. That is exactly the
 * row a competitor screenshots.
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
    feeValues: ['1%', '2.9%', '3.15%', '5%', '5.99%', '—'],
    feeUnknownAriaLabel: 'No payments',
    feeNote:
      "Figures are each provider's own rate, and they do not all break out Stripe the same way: " +
      "Jimmy's 1% (Club plans; 5% on Free) sits on top of Stripe's processing fees, while " +
      "Skool's and TrueCoach's appear to be all-in. Skool's 2.9% is the Pro plan — Hobby is 10%. " +
      'Trainerize does not state a rate on its public pricing page. WhatsApp has no payments of ' +
      'its own, so there is no fee to quote. Checked August 2026.',
  },
  es: {
    feeRowLabel: 'Comisión de transacción de la plataforma',
    feeValues: [`1${NB}%`, `2,9${NB}%`, `3,15${NB}%`, `5${NB}%`, `5,99${NB}%`, '—'],
    feeUnknownAriaLabel: 'Sin pagos',
    feeNote:
      'Cada cifra es la tarifa del propio proveedor, y no todos separan Stripe de la misma ' +
      `forma: el 1${NB}% de Jimmy (planes Club; 5${NB}% en Free) se suma a las comisiones de ` +
      'procesamiento de Stripe, mientras que las de Skool y TrueCoach parecen incluirlo todo. ' +
      `El 2,9${NB}% de Skool corresponde al plan Pro: en Hobby es del 10${NB}%. Trainerize no ` +
      'indica ninguna tarifa en su página pública de precios. WhatsApp no tiene pagos propios, ' +
      'así que no hay comisión que citar. Consultado en agosto de 2026.',
  },
  fr: {
    feeRowLabel: 'Commission de transaction de la plateforme',
    feeValues: [`1${NB}%`, `2,9${NB}%`, `3,15${NB}%`, `5${NB}%`, `5,99${NB}%`, '—'],
    feeUnknownAriaLabel: 'Pas de paiements',
    feeNote:
      'Chaque chiffre est le tarif du prestataire lui-même, et tous ne détaillent pas les frais ' +
      `Stripe de la même façon${NB}: le 1${NB}% de Jimmy (offres Club${NB}; 5${NB}% sur l'offre ` +
      "Free) s'ajoute aux frais de traitement de Stripe, tandis que ceux de Skool et TrueCoach " +
      `semblent tout inclure. Les 2,9${NB}% de Skool correspondent à l'offre Pro${NB}: sur Hobby, ` +
      `c'est 10${NB}%. Trainerize n'indique aucun tarif sur sa page tarifaire publique. WhatsApp ` +
      "n'a pas de paiements propres, il n'y a donc pas de commission à citer. Relevé en août 2026.",
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
