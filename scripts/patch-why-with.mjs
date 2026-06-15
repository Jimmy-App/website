/**
 * Surgical patch: add the "With Jimmy" in-app illustration content to
 * homePage.why.preview.with for each locale. Does NOT touch any other field.
 *
 * Run: set -a; . ./.env.local; set +a; node scripts/patch-why-with.mjs
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
const key = () => `wm${(n++).toString(36)}`

// Module order matches the "without" cards (Messaging, Workout, Payments, Schedule).
const DATA = {
  en: {
    appName: 'Jimmy',
    appTagline: 'Everything in one place',
    syncedLabel: 'Synced',
    modules: [
      { label: 'Messaging', sub: '1:1 chat, built in' },
      { label: 'Workout Builder', sub: 'Structured programs' },
      { label: 'Payments', sub: 'Automatic Stripe billing' },
      { label: 'Schedule', sub: 'Synced sessions' },
    ],
  },
  fr: {
    appName: 'Jimmy',
    appTagline: 'Tout au même endroit',
    syncedLabel: 'Synchronisé',
    modules: [
      { label: 'Messagerie', sub: 'Chat 1:1 intégré' },
      { label: 'Créateur d’entraînements', sub: 'Programmes structurés' },
      { label: 'Paiements', sub: 'Facturation Stripe automatique' },
      { label: 'Planning', sub: 'Séances synchronisées' },
    ],
  },
  es: {
    appName: 'Jimmy',
    appTagline: 'Todo en un solo lugar',
    syncedLabel: 'Sincronizado',
    modules: [
      { label: 'Mensajería', sub: 'Chat 1:1 integrado' },
      { label: 'Creador de Entrenos', sub: 'Programas estructurados' },
      { label: 'Pagos', sub: 'Facturación Stripe automática' },
      { label: 'Agenda', sub: 'Sesiones sincronizadas' },
    ],
  },
}

async function run() {
  for (const [locale, d] of Object.entries(DATA)) {
    await client
      .patch(`homePage-${locale}`)
      .set({
        'why.preview.with.appName': d.appName,
        'why.preview.with.appTagline': d.appTagline,
        'why.preview.with.syncedLabel': d.syncedLabel,
        'why.preview.with.modules': d.modules.map((m) => ({ _key: key(), _type: 'object', ...m })),
      })
      .commit()
    console.log(`✔ patched homePage-${locale} (why.preview.with)`)
  }
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
