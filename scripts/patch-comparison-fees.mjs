/**
 * JIM-146 — competitor table: add FITR as a column, add the platform-fee row.
 *
 * The fee figures, all from the provider's own pages, read 2026-08-02:
 *   Jimmy      1%     — Club rate (Free is 5%; the footnote says so).
 *   Skool      2.9%   — skool.com/pricing, Pro plan. Hobby is 10%; the
 *                       footnote says that too rather than quietly quoting
 *                       whichever number flatters us.
 *   Trainerize —      — publishes no rate of its own; Stripe Integrated
 *                       Payments is a $10/mo add-on and they point at Stripe
 *                       for the rate. The "1.9%" and "up to 5%" figures on the
 *                       web are all from rivals selling against Trainerize and
 *                       they contradict each other, so they are not a source.
 *   TrueCoach  5%     — help.truecoach.co, "a flat 5% fee per transaction".
 *   FITR       5.99%  — coachwithfitr.com/pricing. The ticket said "+5%";
 *                       their own page says 5.99%, so the page wins.
 *   WhatsApp   —      — no payments feature at all (see the payments row).
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
    feeValues: ['1%', '2.9%', '—', '5%', '5.99%', '—'],
    feeUnknownAriaLabel: 'Not published',
    feeNote:
      "Each figure is the provider's own published rate, and they do not all break out Stripe " +
      "the same way: Jimmy's 1% (Club plans; 5% on Free) sits on top of Stripe's processing " +
      "fees, while Skool's and TrueCoach's published rates appear to be all-in. Skool's 2.9% is " +
      'the Pro plan — Hobby is 10%. Trainerize publishes no rate of its own and points to Stripe. ' +
      'A dash means the provider publishes no figure we could verify. Read from each provider’s ' +
      'public pricing page or help centre, August 2026.',
  },
  es: {
    feeRowLabel: 'Comisión de transacción de la plataforma',
    feeValues: [`1${NB}%`, `2,9${NB}%`, '—', `5${NB}%`, `5,99${NB}%`, '—'],
    feeUnknownAriaLabel: 'No publicado',
    feeNote:
      'Cada cifra es la tarifa publicada por el propio proveedor, y no todos separan Stripe de la ' +
      `misma forma: el 1${NB}% de Jimmy (planes Club; 5${NB}% en Free) se suma a las comisiones de ` +
      'procesamiento de Stripe, mientras que las tarifas publicadas por Skool y TrueCoach parecen ' +
      `incluirlo todo. El 2,9${NB}% de Skool corresponde al plan Pro: en Hobby es del 10${NB}%. ` +
      'Trainerize no publica ninguna tarifa propia y remite a Stripe. Un guion significa que el ' +
      'proveedor no publica una cifra que hayamos podido verificar. Consultado en las páginas ' +
      'públicas de precios o los centros de ayuda de cada proveedor, agosto de 2026.',
  },
  fr: {
    feeRowLabel: 'Commission de transaction de la plateforme',
    feeValues: [`1${NB}%`, `2,9${NB}%`, '—', `5${NB}%`, `5,99${NB}%`, '—'],
    feeUnknownAriaLabel: 'Non publié',
    feeNote:
      'Chaque chiffre est le tarif publié par le prestataire lui-même, et tous ne détaillent pas ' +
      `les frais Stripe de la même façon${NB}: le 1${NB}% de Jimmy (offres Club${NB}; 5${NB}% sur ` +
      "l'offre Free) s'ajoute aux frais de traitement de Stripe, tandis que les tarifs publiés par " +
      `Skool et TrueCoach semblent tout inclure. Les 2,9${NB}% de Skool correspondent à l'offre ` +
      `Pro${NB}: sur Hobby, c'est 10${NB}%. Trainerize ne publie aucun tarif propre et renvoie vers ` +
      'Stripe. Un tiret signifie que le prestataire ne publie aucun chiffre que nous ayons pu ' +
      'vérifier. Relevé sur les pages tarifaires publiques ou les centres d’aide de chaque ' +
      'prestataire, août 2026.',
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
