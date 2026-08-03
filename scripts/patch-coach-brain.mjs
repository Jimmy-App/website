/**
 * JIM-143 — Coach Brain: the /features/coach-brain page + the pricing add-on.
 *
 * Copy is Quentin's from the ticket, trimmed to the shapes the feature page
 * actually renders. Like every other feature doc, the three language copies
 * carry English content — FR/ES land with JIM-148.
 *
 * The add-on line "AI Coaching Assistant +€19/mo" is replaced by the pair the
 * ticket specifies: Coach Brain (included in Club at launch) and AI Pro for
 * power coaches. Both `soon` — neither exists yet, and JIM-145 made status a
 * thing the site is held to.
 *
 *   node scripts/patch-coach-brain.mjs [--dry]
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

const LOCALES = ['en', 'es', 'fr']

const feature = {
  _type: 'feature',
  slug: { _type: 'slug', current: 'coach-brain' },
  audience: 'For Coaches',
  name: 'Coach Brain',
  sub: 'An AI trained on you.',
  iconKey: 'brain',
  order: 6,
  status: 'soon',
  demoKey: 'coachBrain',
  title: { prefix: 'AI that works ', accent: 'for the coach.', suffix: '' },
  highlight: { prefix: 'Generic AI writes generic programs. ', accent: 'Coach Brain writes yours.' },
  highlightSub:
    'Every edit you make trains your Brain. It compounds with usage — the longer you coach with it, the closer it gets to how you actually think.',
  lead: 'Every coach gets an AI trained on one thing: them. It learns your philosophy, your formats, your progressions, your cues, your red lines — then writes in your style, inside the builder you already use.',
  tags: ['Your style', 'In-builder', 'Reviewable diffs', 'Fully editable', 'Coming soon'],
  capsTitle: 'Your AI, transparent.',
  caps: [
    {
      _type: 'featureCap',
      _key: 'cb-brief',
      iconKey: 'blocks',
      title: 'The brief',
      desc: 'A 10-minute conversation teaches it your philosophy, formats, progressions, cues and red lines. Fully visible, fully editable.',
    },
    {
      _type: 'featureCap',
      _key: 'cb-copilot',
      iconKey: 'video',
      title: 'The copilot',
      desc: 'One bar, everywhere you work. Ask in plain words — it writes into the builder, not into a chat window.',
    },
    {
      _type: 'featureCap',
      _key: 'cb-diff',
      iconKey: 'blocks',
      title: 'Review the diff',
      desc: 'It does not suggest, it does — and shows you exactly what changed. Undo in one tap.',
    },
    {
      _type: 'featureCap',
      _key: 'cb-loop',
      iconKey: 'video',
      title: 'The loop',
      desc: 'Every edit trains your Brain. It never stops learning from the programs you write.',
    },
  ],
}

// Add-on replacement, per locale (only `name`/`price` are language-facing).
const ADDONS = {
  en: [
    { name: 'Coach Brain', price: 'Included in Club at launch', status: 'soon' },
    { name: 'AI Pro', price: '+€19/mo', status: 'soon' },
  ],
  es: [
    { name: 'Coach Brain', price: 'Incluido en Club al lanzamiento', status: 'soon' },
    { name: 'AI Pro', price: '+19 €/mes', status: 'soon' },
  ],
  fr: [
    { name: 'Coach Brain', price: 'Inclus dans Club au lancement', status: 'soon' },
    { name: 'AI Pro', price: '+19 €/mois', status: 'soon' },
  ],
}

for (const locale of LOCALES) {
  const _id = `feature-coach-brain-${locale}`
  console.log(`\n[${locale}] feature ${_id}`)
  if (!dry) {
    await client.createOrReplace({ ...feature, _id, language: locale })
    console.log('  ✓ feature page')
  }

  const home = await client.fetch(
    '*[_type == "homePage" && language == $locale][0]{_id, "addons": pricing.addons}',
    { locale },
  )
  if (!home?.addons) {
    console.warn('  ! no pricing.addons, skipped')
    continue
  }

  // The add-on name is translated per locale ("Asistente de coaching con IA",
  // "Assistant de coaching IA"), so match on position-independent keywords
  // rather than the English string — matching English alone silently skipped
  // es and fr and reported "already replaced".
  const isAiAssistant = (n = '') =>
    /(ai|ia)/i.test(n) && /(coaching|assistant|asistente)/i.test(n)
  const idx = home.addons.findIndex((a) => isAiAssistant(a?.name ?? ''))
  if (idx === -1) {
    console.log('  · add-on already replaced')
    continue
  }

  const next = [...home.addons]
  next.splice(idx, 1, ...ADDONS[locale].map((a, i) => ({
    ...a,
    _type: home.addons[idx]._type ?? 'pricingAddon',
    _key: `coach-brain-${i}`,
  })))

  console.log(`  add-ons: ${home.addons.map((a) => a.name).join(' · ')}`)
  console.log(`        -> ${next.map((a) => a.name).join(' · ')}`)
  if (!dry) {
    await client.patch(home._id).set({ 'pricing.addons': next }).commit()
    console.log('  ✓ pricing')
  }
}

console.log(dry ? '\nDry run — nothing written.' : '\nDone.')
