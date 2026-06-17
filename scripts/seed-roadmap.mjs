// Seeds roadmap items into Sanity. Idempotent (createOrReplace by _id).
// The _id doubles as the per-card upvote key (localStorage).
// Run:  set -a; . ./.env.local; set +a; node scripts/seed-roadmap.mjs

const PROJECT = 'rpeljbjz'
const DATASET = 'production'
const API = 'v2023-05-03'
const TOKEN = process.env.SANITY_API_TOKEN
if (!TOKEN) {
  console.error('Missing SANITY_API_TOKEN'); process.exit(1)
}

// [key, category, title, desc, eta, votes]
const ITEMS = {
  now: [
    ['rm-events', 'community', 'Live events & RSVP', 'Schedule classes and events; members RSVP and get reminders right in the app.', 'Shipping this quarter', 312],
    ['rm-watch', 'app', 'Apple Watch sync', 'Log sets and check the next move from the wrist, mid-session.', 'Shipping this quarter', 287],
    ['rm-progression', 'training', 'Auto-progression', 'Weights that climb on their own as athletes hit their target numbers.', 'In beta', 248],
  ],
  next: [
    ['rm-leaderboards', 'community', 'Leaderboards', 'Benchmark boards by gym, program or cohort — friendly competition, built in.', 'Next quarter', 209],
    ['rm-annual', 'payments', 'Annual plans & discounts', 'Offer yearly memberships with a built-in discount and one clean invoice.', 'Next quarter', 176],
    ['rm-benchmarks', 'training', 'Custom benchmark builder', 'Define your own tests and track them over time, right alongside the classics.', 'Next quarter', 143],
    ['rm-import', 'coach', 'Bulk athlete import', 'Move your whole roster over in one CSV — no manual re-entry.', 'Next quarter', 134],
  ],
  later: [
    ['rm-ai', 'coach', 'AI program assistant', 'Draft a full training block from a prompt, then edit every set by hand.', 'Researching', 198],
    ['rm-offline', 'app', 'Offline-first redesign', 'The whole member app, fast and reliable even with no signal in the gym.', 'Researching', 121],
    ['rm-upsells', 'payments', 'In-app coaching upsells', 'Sell 1:1 add-ons and specialty blocks right inside the member app.', 'Researching', 87],
  ],
}

const docs = Object.entries(ITEMS).flatMap(([column, cards]) =>
  cards.map(([key, category, title, desc, eta, votes], order) => ({
    _id: `roadmapItem-${key}`,
    _type: 'roadmapItem',
    column,
    category,
    title,
    desc,
    eta,
    votes,
    order,
  })),
)

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
console.log(`✓ roadmap items: ${result.results.length}`)
console.log('done')
