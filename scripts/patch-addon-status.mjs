/**
 * Marks the AI Coaching Assistant add-on as coming soon (JIM-145).
 *
 * It is Coach Brain, which JIM-143 is about announcing — nothing to buy yet,
 * so listing it beside two purchasable add-ons with no distinction is the
 * exact thing JIM-142's rule forbids.
 *
 * Matched by position, not by name: the names are translated per locale, so
 * matching on text would silently skip fr and es.
 *
 *   node scripts/patch-addon-status.mjs [--dry]
 */
import { createClient } from '@sanity/client'

const token = process.env.SANITY_WRITE_TOKEN ?? process.env.SANITY_API_TOKEN
const dry = process.argv.includes('--dry')
if (!token && !dry) {
  console.error('SANITY_WRITE_TOKEN required (or --dry).')
  process.exit(1)
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'rpeljbjz',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
})

/** index -> status. 0 Team/Gym seats (on sale), 1 AI assistant, 2 Referral. */
const BY_INDEX = { 0: 'live', 1: 'soon', 2: 'live' }

const run = async () => {
  const docs = await client.fetch(
    `*[_type == "homePage" && defined(pricing.addons)]{ _id, language, "addons": pricing.addons[]{ name, status } }`,
  )
  let changed = 0
  for (const doc of docs) {
    for (const [i, want] of Object.entries(BY_INDEX)) {
      const addon = doc.addons?.[Number(i)]
      if (!addon) continue
      if (addon.status === want) continue
      console.log(`  ${dry ? '·' : '✓'} ${doc.language} [${i}] ${addon.name}: ${addon.status ?? '(empty)'} -> ${want}`)
      if (!dry) {
        await client.patch(doc._id).set({ [`pricing.addons[${i}].status`]: want }).commit()
      }
      changed++
    }
  }
  console.log(dry ? `\nDry run — ${changed} would change.` : `\nDone — ${changed} updated.`)
}

run().catch((e) => {
  console.error(e.message)
  process.exit(1)
})
