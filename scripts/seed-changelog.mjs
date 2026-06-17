// Seeds changelog releases into Sanity. Idempotent (createOrReplace by _id).
// Uploads the two reference screenshots as image assets so the CMS isn't empty.
// Run:  set -a; . ./.env.local; set +a; node scripts/seed-changelog.mjs
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { randomUUID } from 'node:crypto'

const PROJECT = 'rpeljbjz'
const DATASET = 'production'
const API = 'v2023-05-03'
const TOKEN = process.env.SANITY_API_TOKEN
if (!TOKEN) {
  console.error('Missing SANITY_API_TOKEN'); process.exit(1)
}
const __dir = dirname(fileURLToPath(import.meta.url))
const PUBLIC = join(__dir, '..', 'public')
const key = () => randomUUID().replace(/-/g, '').slice(0, 12)
const idFor = (v) => `changelogRelease-${v.replace(/\./g, '-')}` // v3.4 → changelogRelease-v3-4

// ── Upload a /public image as a Sanity asset, return its _id ────────────────────
async function uploadImage(relPath, filename) {
  const bytes = readFileSync(join(PUBLIC, relPath))
  const res = await fetch(
    `https://${PROJECT}.api.sanity.io/${API}/assets/images/${DATASET}?filename=${encodeURIComponent(filename)}`,
    { method: 'POST', headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'image/png' }, body: bytes },
  )
  const json = await res.json()
  if (!res.ok) { console.error(JSON.stringify(json, null, 2)); throw new Error('asset upload failed') }
  console.log(`  ↑ uploaded ${filename} → ${json.document._id}`)
  return json.document._id
}

const imageField = (assetId, alt) => ({
  _type: 'image',
  asset: { _type: 'reference', _ref: assetId },
  alt,
})

// ── Release content (English; **bold** for key phrases) ─────────────────────────
const RELEASES = [
  {
    version: 'v3.4', date: '2026-06-12T00:00:00Z',
    title: 'Reactions, polls and a faster feed',
    lead: 'Your community feed got louder — and a lot quicker on older phones.',
    image: { src: 'assets/screens/home.png', file: 'changelog-community-feed.png', alt: 'Community feed with reactions and polls' },
    changes: [
      ['new', '**Reactions and polls** on any feed post — keep the conversation going between sessions.'],
      ['new', '**Pinned announcements** hold the top of the feed so nobody misses the important stuff.'],
      ['improved', 'The feed now loads about **2× faster** on older devices.'],
      ['fixed', 'Mentions no longer dismiss the keyboard mid-message.'],
    ],
  },
  {
    version: 'v3.3', date: '2026-05-28T00:00:00Z',
    title: 'Course Builder, fully launched',
    lead: 'Drip your programming like a pro — lesson by lesson, on your schedule.',
    changes: [
      ['new', '**Drip scheduling** unlocks lessons day-by-day so athletes move at the right pace.'],
      ['new', '**Plan gating** — lock any course behind the membership tier you choose.'],
      ['improved', 'Bulk-upload a whole block of videos in a single drag.'],
    ],
  },
  {
    version: 'v3.2', date: '2026-05-09T00:00:00Z',
    title: 'Your branded app, refreshed',
    lead: 'A sharper member app on every screen — and dark mode at last.',
    changes: [
      ['improved', 'Rebuilt **splash screen and icon pipeline** — crisper on the latest devices.'],
      ['improved', '**Dark mode** across the entire member app, matched to your brand color.'],
      ['fixed', "Push notifications now respect each member's quiet hours."],
    ],
  },
  {
    version: 'v3.1', date: '2026-04-22T00:00:00Z',
    title: 'Group messaging',
    lead: 'Talk to your athletes together — by program, gym or cohort.',
    changes: [
      ['new', '**Groups** for any slice of your roster, with their own thread and roster view.'],
      ['new', 'Share a workout **straight into a thread** — no copy-paste.'],
      ['fixed', 'Stripe payout dates now display in your local timezone.'],
    ],
  },
  {
    version: 'v3.0', date: '2026-04-01T00:00:00Z',
    title: 'Jimmy 3.0 — the biggest release yet',
    lead: 'A redesigned dashboard, real progress tracking, and pricing that scales with you.',
    image: { src: 'assets/screens/dashboard.png', file: 'changelog-dashboard.png', alt: 'Redesigned coach dashboard' },
    changes: [
      ['new', '**Redesigned coach dashboard** — everything that matters, one screen.'],
      ['new', '**PR & benchmark tracking** for every athlete, charted over time.'],
      ['improved', '**Per-seat pricing controls** so your plan grows exactly with your roster.'],
    ],
  },
  {
    version: 'v2.9', date: '2026-03-06T00:00:00Z',
    title: 'Speed & polish',
    lead: 'Quieter under the hood — the workout log now survives a dead signal.',
    changes: [
      ['improved', 'Workouts **sync offline**, then catch up the moment you reconnect.'],
      ['fixed', 'Calendar timezone drift on invites sent across regions.'],
      ['fixed', 'Avatar uploads larger than 5 MB no longer fail silently.'],
    ],
  },
  {
    version: 'v2.8', date: '2026-02-11T00:00:00Z',
    title: 'Hyrox & CrossFit templates',
    lead: 'Twelve ready-made training blocks — clone one and make it yours.',
    changes: [
      ['new', '**12 ready-made blocks** built for Hyrox and CrossFit coaching.'],
      ['new', '**Clone any template** straight into your library and edit freely.'],
    ],
  },
]

// ── Upload images (unique by file) then build docs ──────────────────────────────
const assetCache = new Map()
for (const r of RELEASES) {
  if (r.image && !assetCache.has(r.image.file)) {
    assetCache.set(r.image.file, await uploadImage(r.image.src, r.image.file))
  }
}

const docs = RELEASES.map((r) => {
  const doc = {
    _id: idFor(r.version),
    _type: 'changelogRelease',
    version: r.version,
    date: r.date,
    title: r.title,
    lead: r.lead,
    changes: r.changes.map(([type, text]) => ({ _type: 'changelogChange', _key: key(), type, text })),
  }
  if (r.image) doc.image = imageField(assetCache.get(r.image.file), r.image.alt)
  return doc
})

// ── Mutate ─────────────────────────────────────────────────────────────────────
async function mutate(documents) {
  const res = await fetch(
    `https://${PROJECT}.api.sanity.io/${API}/data/mutate/${DATASET}?returnIds=true`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ mutations: documents.map((d) => ({ createOrReplace: d })) }),
    },
  )
  const json = await res.json()
  if (!res.ok) { console.error(JSON.stringify(json, null, 2)); throw new Error('mutate failed') }
  return json
}

const result = await mutate(docs)
console.log(`✓ changelog releases: ${result.results.length}`)
console.log('done')
