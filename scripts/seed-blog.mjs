// Seeds blog authors + posts into Sanity. Idempotent (createOrReplace by _id).
// Run:  set -a; . ./.env.local; set +a; node scripts/seed-blog.mjs
import { randomUUID } from 'node:crypto'

const PROJECT = 'rpeljbjz'
const DATASET = 'production'
const API = 'v2023-05-03'
const TOKEN = process.env.SANITY_API_TOKEN
if (!TOKEN) {
  console.error('Missing SANITY_API_TOKEN'); process.exit(1)
}

const key = () => randomUUID().replace(/-/g, '').slice(0, 12)

// ── inline **bold** / _italic_ → Portable Text spans ──
function spans(text) {
  const out = []
  const re = /\*\*(.+?)\*\*|_(.+?)_/g
  let last = 0
  let m
  const push = (t, marks) => { if (t) out.push({ _type: 'span', _key: key(), text: t, marks }) }
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) push(text.slice(last, m.index), [])
    if (m[1] != null) push(m[1], ['strong'])
    else push(m[2], ['em'])
    last = re.lastIndex
  }
  if (last < text.length) push(text.slice(last), [])
  return out.length ? out : [{ _type: 'span', _key: key(), text, marks: [] }]
}
const block = (style, text) => ({ _type: 'block', _key: key(), style, markDefs: [], children: spans(text) })
const li = (listItem, text) => ({ _type: 'block', _key: key(), style: 'normal', listItem, level: 1, markDefs: [], children: spans(text) })

// step-1 block model → Portable Text
function toPT(blocks) {
  const out = []
  for (const b of blocks) {
    if (b.type === 'p') out.push(block('normal', b.text))
    else if (b.type === 'h2') out.push(block('h2', b.text))
    else if (b.type === 'h3') out.push(block('h3', b.text))
    else if (b.type === 'ul') b.items.forEach((it) => out.push(li('bullet', it)))
    else if (b.type === 'ol') b.items.forEach((it) => out.push(li('number', it)))
    else if (b.type === 'callout') out.push({ _type: 'callout', _key: key(), tone: b.icon === 'check' ? 'check' : 'spark', label: b.label, text: b.text })
    else if (b.type === 'quote') out.push({ _type: 'pullquote', _key: key(), text: b.text, cite: b.cite })
    // figure blocks are skipped until real imagery exists
  }
  return out
}

const MARTA = [
  { type: 'p', text: 'Marta runs a 40-athlete Hyrox program out of a single-bay unit on the edge of town. Her sessions are full, her programming is sharp, and her athletes hit real numbers. On paper, she was doing everything right. So why was she signing two new athletes a month and quietly losing two old ones?' },
  { type: 'p', text: 'This is the story of the 90 days she spent treating retention like a training variable — something you program, measure and progress — instead of a thing that just happens to you. We’ll walk through what she changed, the tools she leaned on, and the results she can now point to.' },
  { type: 'h2', text: 'The problem nobody puts on the whiteboard' },
  { type: 'p', text: 'Churn is invisible until it isn’t. There’s no single moment an athlete "quits" — they just come less, reply slower, and one day their card declines and they don’t update it. **By the time you notice, the relationship has been cooling for weeks.**' },
  { type: 'p', text: 'When Marta actually pulled her numbers, the picture was stark: she was losing roughly one in three athletes within their first four months. Acquisition was masking it. She felt busy, but she was running up a down escalator.' },
  { type: 'callout', icon: 'spark', label: 'Key takeaway', text: 'You can’t out-recruit churn. A 33% four-month drop-off means a third of every marketing euro is spent replacing people you already had.' },
  { type: 'h2', text: 'Where athletes actually quit' },
  { type: 'p', text: 'Marta mapped every athlete who’d left over the previous year against their activity. The drop-off wasn’t random — it clustered hard in two windows.' },
  { type: 'ul', items: [
    '**Weeks 3–6.** The novelty has worn off, the first soreness has faded, and results haven’t compounded yet. This is the motivation trough.',
    '**The post-event lull.** After a race or a big PR, athletes who don’t have a clear next target simply drift. The goal that pulled them in has been spent.',
  ] },
  { type: 'p', text: 'Both windows share a root cause: **silence**. In the gaps between sessions, athletes heard nothing from Marta and saw no evidence they were progressing. Coaching that’s excellent for 60 minutes can still feel absent for the other 167 hours of the week.' },
  { type: 'h2', text: 'Building the 90-day retention system' },
  { type: 'p', text: 'Rather than a motivation pep-talk, Marta built a system with three moving parts — each one designed to break the silence at exactly the moment athletes tend to slip.' },
  { type: 'h3', text: '1. A visible progress loop' },
  { type: 'p', text: 'Every athlete now logs sessions in the Jimmy app, and every workout rolls up into a trend they can see. PRs surface automatically. The point isn’t the data — it’s that progress becomes _undeniable_ in precisely the weeks it normally feels invisible.' },
  { type: 'h3', text: '2. Scheduled check-ins, not random ones' },
  { type: 'p', text: 'Marta set a standing rhythm: a short message at the end of week two, a proper check-in at week five, and a "what’s next" conversation within three days of any race. Because these live in her workflow, they happen whether or not she’s thinking about retention that week.' },
  { type: 'h3', text: '3. A community that does the heavy lifting' },
  { type: 'p', text: 'The biggest unlock was the community feed. Athletes post their sessions, cheer each other on, and ask questions Marta answers once for everyone. The group, not the coach, becomes the reason to show up.' },
  { type: 'quote', text: 'The week I stopped trying to motivate people one by one and let the group do it was the week my retention changed.', cite: '— Marta, Hyrox coach' },
  { type: 'h2', text: 'The numbers, 90 days later' },
  { type: 'p', text: 'None of this required Marta to coach harder or work more hours. It required her to make the invisible visible and put her follow-ups on rails. The results over a single quarter:' },
  { type: 'ul', items: [
    '**Four-month churn fell from 33% to 16%** — just over half.',
    '**Average athlete lifespan grew by 4.5 months**, which quietly doubled the lifetime value of every new signup.',
    '**Referrals replaced ads** as her top source of new athletes, because a sticky community recruits for free.',
  ] },
  { type: 'callout', icon: 'check', label: 'The compounding part', text: 'Halving churn didn’t just retain more people — it made every future signup worth more. Retention is the only growth lever that pays you twice.' },
  { type: 'h2', text: 'What you can copy this week' },
  { type: 'p', text: 'You don’t need 90 days to start. Marta’s system comes down to three habits any coach can put in place immediately:' },
  { type: 'ol', items: [
    'Make progress **visible** — give athletes a trend they can watch, not just a session they attend.',
    'Put your check-ins **on a schedule** tied to the weeks people actually quit, not your free time.',
    'Build a **room**, not a roster — a place athletes belong to between sessions.',
  ] },
  { type: 'p', text: 'All three live inside Jimmy — progress tracking, structured client comms and a Skool-style community feed in one place. If you’re signing athletes faster than you keep them, that’s the gap to close first.' },
]

const GENERIC = [
  { type: 'p', text: 'This article is part of the Jimmy blog — practical playbooks for coaches who want to keep the athletes they earn. The full piece is coming straight from the gym floor.' },
  { type: 'h2', text: 'Why this matters for your roster' },
  { type: 'p', text: 'Retention, programming and the business of coaching all pull on the same thread: the experience your athletes get between sessions. Get that right and growth compounds; get it wrong and you spend every marketing euro replacing people you already had.' },
  { type: 'callout', icon: 'spark', label: 'The short version', text: 'Make progress visible, put your follow-ups on rails, and build a room your athletes belong to — not just a roster they appear on.' },
  { type: 'h2', text: 'How it works inside Jimmy' },
  { type: 'p', text: 'Progress tracking, structured client comms and a Skool-style community feed live in one place — so the system runs whether or not you’re thinking about it that week.' },
]

const authors = [
  { _id: 'author-jordan', name: 'Jordan Maris', role: 'Head of Coach Success at Jimmy', initials: 'JM', bio: 'Jordan spends his weeks deep in the workflows of coaches building real businesses — and writes up what’s actually working on the gym floor.' },
  { _id: 'author-sam', name: 'Sam Adeyemi', role: 'Coaching editor at Jimmy', initials: 'SA' },
  { _id: 'author-riley', name: 'Riley Khan', role: 'Business editor at Jimmy', initials: 'RK' },
  { _id: 'author-team', name: 'Team Jimmy', role: 'Product team', initials: 'TJ' },
].map((a) => ({ ...a, _type: 'author' }))

const ref = (id) => ({ _type: 'reference', _ref: id })

const posts = [
  { slug: 'marta-halved-churn-90-days', category: 'stories', author: 'author-jordan', date: '2026-06-11T09:00:00Z', readMin: 10, featured: true,
    title: 'How Hyrox coach Marta halved her churn in 90 days',
    excerpt: 'She wasn’t losing athletes because of her programming. She was losing them in the quiet weeks between PRs. Here’s the retention system she built on Jimmy — and the numbers behind it.',
    lead: 'She wasn’t losing athletes because of her programming. She was losing them in the quiet weeks between PRs — and once she saw that, the fix was a system, not a sales push.',
    body: MARTA },
  { slug: 'retention-playbook-month-two', category: 'retention', author: 'author-jordan', date: '2026-06-09T09:00:00Z', readMin: 8, pick: true,
    title: 'The retention playbook: turning month-two drop-offs into year-long members',
    excerpt: 'The data is brutal — most clients decide to stay or go in weeks 3 to 6. Here’s how to design that window on purpose.', body: GENERIC },
  { slug: 'programming-hyrox-blocks', category: 'training', author: 'author-sam', date: '2026-06-06T09:00:00Z', readMin: 7, pick: true,
    title: 'Programming Hyrox blocks that keep athletes coming back',
    excerpt: 'Variety isn’t the goal — progress they can feel is. A block structure that builds engagement week over week.', body: GENERIC },
  { slug: 'per-seat-pricing-for-coaches', category: 'business', author: 'author-riley', date: '2026-06-03T09:00:00Z', readMin: 6, pick: true,
    title: 'Per-seat pricing: why it beats one-size-fits-all for coaches',
    excerpt: 'Flat pricing leaves money on the table at both ends. How to price so your plan grows exactly as your roster does.', body: GENERIC },
  { slug: 'whats-new-community-course-builder', category: 'product', author: 'author-team', date: '2026-05-28T09:00:00Z', readMin: 4,
    title: 'What’s new: Community feed, Course Builder & group comms',
    excerpt: 'Your spring release notes — a Skool-style feed, a full Course Builder and group messaging, all inside Jimmy.', body: GENERIC },
  { slug: '12-to-80-athletes-community', category: 'stories', author: 'author-jordan', date: '2026-05-24T09:00:00Z', readMin: 9,
    title: 'From 12 to 80 athletes: a community that sells itself',
    excerpt: 'How one CrossFit coach turned a group chat into a waitlist — and stopped paying for ads entirely.', body: GENERIC },
  { slug: 'first-7-days-onboarding', category: 'retention', author: 'author-riley', date: '2026-05-20T09:00:00Z', readMin: 6,
    title: 'The first 7 days: an onboarding flow that stops ghosting',
    excerpt: 'New clients ghost when they feel lost, not busy. A day-by-day first week that builds the habit before motivation fades.', body: GENERIC },
  { slug: 'crossfit-class-design-scaling', category: 'training', author: 'author-sam', date: '2026-05-16T09:00:00Z', readMin: 7,
    title: 'CrossFit class design: scaling without losing intensity',
    excerpt: 'One whiteboard, fifteen abilities. How to scale a class so everyone leaves smoked — and nobody feels singled out.', body: GENERIC },
  { slug: 'stripe-fees-getting-paid', category: 'business', author: 'author-riley', date: '2026-05-12T09:00:00Z', readMin: 5,
    title: 'Stripe, fees & getting paid: the money mechanics of coaching',
    excerpt: 'What actually lands in your account after fees — and the small setup choices that quietly protect your margin.', body: GENERIC },
].map((p) => ({
  _id: `post-${p.slug}`,
  _type: 'post',
  title: p.title,
  slug: { _type: 'slug', current: p.slug },
  category: p.category,
  author: ref(p.author),
  excerpt: p.excerpt,
  ...(p.lead ? { lead: p.lead } : {}),
  publishedAt: p.date,
  readMin: p.readMin,
  featured: !!p.featured,
  pick: !!p.pick,
  body: toPT(p.body),
}))

async function mutate(docs) {
  const res = await fetch(`https://${PROJECT}.api.${'sanity.io'}/${API}/data/mutate/${DATASET}?returnIds=true`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ mutations: docs.map((d) => ({ createOrReplace: d })) }),
  })
  const json = await res.json()
  if (!res.ok) { console.error(JSON.stringify(json, null, 2)); throw new Error('mutate failed') }
  return json
}

const r1 = await mutate(authors)
console.log(`✓ authors: ${r1.results.length}`)
const r2 = await mutate(posts)
console.log(`✓ posts: ${r2.results.length}`)
console.log('done')
