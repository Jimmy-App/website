/**
 * Sets the feature status field (JIM-145) on every language version.
 *
 * The values are an audit of the product, not a guess:
 *
 *   community-feed / community-member — the web route renders an empty div, no
 *     API routes exist, Prisma has no Post/Comment/Reaction/Challenge models,
 *     and the mobile screen renders t("community.comingSoon"). Nothing shipped.
 *   programs-courses — no Course/Module/Lesson/Quiz models or screens exist.
 *     Program exists, but not the courses the page describes.
 *
 * Everything marked live was checked against the schema or a shipped screen.
 *
 *   node --env-file=.env.local scripts/patch-feature-status.mjs [--dry]
 */
import { createClient } from '@sanity/client'

const token = process.env.SANITY_WRITE_TOKEN ?? process.env.SANITY_API_TOKEN
const dry = process.argv.includes('--dry')
if (!token && !dry) {
  console.error('SANITY_WRITE_TOKEN is required (or pass --dry).')
  process.exit(1)
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'rpeljbjz',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
})

const STATUS = {
  // Not built — see the header note.
  'community-feed': 'soon',
  'community-member': 'soon',
  'programs-courses': 'soon',
  // In-app branding (coach logo / colours) does not work yet either, so the
  // page describing it is a promise rather than a description.
  'branded-mobile-app': 'soon',
  // Verified against the data model or a shipped screen.
  'workout-builder': 'live',
  'daily-workouts': 'live',
  messaging: 'live',
  'direct-access': 'live',
  payments: 'live',
  'easy-payments': 'live',
  'progress-tracking': 'live',
  'progress-view': 'live',
}

const run = async () => {
  const docs = await client.fetch(
    `*[_type == "feature" && defined(slug.current)]{ _id, language, "slug": slug.current, status }`,
  )
  let changed = 0
  for (const doc of docs) {
    const want = STATUS[doc.slug]
    if (!want) {
      console.log(`  ? ${doc.slug} (${doc.language}) — no decision, leaving as ${doc.status ?? '(empty)'}`)
      continue
    }
    if (doc.status === want) continue
    console.log(`  ${dry ? '·' : '✓'} ${doc.slug} (${doc.language}): ${doc.status ?? '(empty)'} -> ${want}`)
    if (!dry) await client.patch(doc._id).set({ status: want }).commit()
    changed++
  }
  console.log(dry ? `\nDry run — ${changed} would change.` : `\nDone — ${changed} updated.`)
}

run().catch((e) => {
  console.error(e.message)
  process.exit(1)
})
