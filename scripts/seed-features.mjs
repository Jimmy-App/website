// Seeds the 12 feature pages into Sanity. Idempotent (createOrReplace by _id).
// Run:  set -a; . ./.env.local; set +a; node scripts/seed-features.mjs
//
// Hero media (branded-mobile-app video) stays code-side in src/lib/features.ts
// (FEATURE_MEDIA) — it's a real asset in /public, not editable content.
import { randomUUID } from 'node:crypto'

const PROJECT = 'rpeljbjz'
const DATASET = 'production'
const API = 'v2023-05-03'
const TOKEN = process.env.SANITY_API_TOKEN
if (!TOKEN) {
  console.error('Missing SANITY_API_TOKEN'); process.exit(1)
}

const key = () => randomUUID().replace(/-/g, '').slice(0, 12)

// ── Feature catalogue (order = array index) ─────────────────────────────────────
const FEATURES = [
  {
    slug: 'workout-builder',
    audience: 'For Coaches',
    name: 'Workout Builder',
    sub: 'Program structured blocks fast.',
    iconKey: 'dumbbell',
    demoKey: 'workout',
    title: { prefix: 'Build training that ', accent: 'moves.', suffix: '' },
    highlight: { prefix: 'Program once. ', accent: 'Reuse forever.' },
    highlightSub: 'Stop rebuilding the same session every week. Save it, clone it, tweak it — and get your evenings back.',
    lead: 'EMOM, AMRAP, circuits, strength — program structured blocks in seconds, not spreadsheets. Built for coaches who actually train.',
    tags: ['Work Blocks', 'EMOM', 'AMRAP', 'Circuits', 'Video Library'],
    capsTitle: "Everything you need to program — nothing you don't.",
    caps: [
      { iconKey: 'blocks', title: 'Native block types', desc: 'EMOM, AMRAP, circuits and strength are built in — no workarounds.' },
      { iconKey: 'video', title: 'Video library', desc: 'Attach a demo to every movement so form is never in question.' },
      { iconKey: 'copy', title: 'Reusable templates', desc: 'Duplicate a full week or block and reprogram it in one tap.' },
    ],
  },
  {
    slug: 'programs-courses',
    audience: 'For Coaches',
    name: 'Programs & Courses',
    sub: 'Modules, lessons, full programs.',
    iconKey: 'graduation-cap',
    demoKey: 'courses',
    title: { prefix: 'Courses, like on ', accent: 'Skool.', suffix: '' },
    highlight: { prefix: 'Teach once. ', accent: 'Sell forever.' },
    highlightSub: 'Package what you know into a course that earns while you coach — no extra hours required.',
    lead: 'Structure modules and lessons in a few clicks. Videos, PDFs, quizzes and unlocked progression — all under your brand.',
    tags: ['Modules', 'Lessons', 'Quizzes', 'Certificates', 'Drip'],
    capsTitle: 'Turn your knowledge into a product.',
    caps: [
      { iconKey: 'layers', title: 'Modules & lessons', desc: 'Organize content into a path clients can actually follow.' },
      { iconKey: 'lock', title: 'Unlocked progression', desc: "Gate lessons until clients are ready for what's next." },
      { iconKey: 'award', title: 'Quizzes & certificates', desc: 'Reward completion and prove the work got done.' },
    ],
  },
  {
    slug: 'community-feed',
    audience: 'For Coaches',
    name: 'Community Feed',
    sub: 'Posts, reactions, challenges.',
    iconKey: 'users',
    demoKey: 'community',
    title: { prefix: 'Your clients never ', accent: 'train alone.', suffix: '' },
    highlight: { prefix: 'Belonging beats ', accent: 'willpower.' },
    highlightSub: "Clients quit programs. They don't quit communities. Give them a reason to keep showing up.",
    lead: 'A Skool-style community feed built right into your platform. Posts, reactions, announcements and group challenges keep momentum high.',
    tags: ['Posts', 'Reactions', 'Announcements', 'Group Challenges'],
    capsTitle: 'The retention engine, built in.',
    caps: [
      { iconKey: 'message-square', title: 'Posts & reactions', desc: 'A living feed where clients share wins and cheer each other on.' },
      { iconKey: 'megaphone', title: 'Announcements', desc: 'Pin updates so the whole community sees what matters.' },
      { iconKey: 'trophy', title: 'Group challenges', desc: 'Spin up challenges that turn solo effort into team effort.' },
    ],
  },
  {
    slug: 'messaging',
    audience: 'For Coaches',
    name: 'Messaging',
    sub: '1:1 and group chat with clients.',
    iconKey: 'message-circle',
    demoKey: 'messaging',
    title: { prefix: 'Stop coaching from ', accent: 'WhatsApp.', suffix: '' },
    highlight: { prefix: 'One inbox. ', accent: 'Zero chaos.' },
    highlightSub: 'No more lost messages across three apps. Everything a client sends stays exactly where it belongs.',
    lead: '1:1 and group chat built directly into Jimmy. Text, photos and voice messages — all in one place, all tied to the right client.',
    tags: ['1:1 Chat', 'Voice', 'Photo & Video', 'Group Chat'],
    capsTitle: 'One inbox for your whole roster.',
    caps: [
      { iconKey: 'message-circle', title: '1:1 client chat', desc: "Every conversation lives next to that client's training." },
      { iconKey: 'mic', title: 'Voice messages', desc: 'Send quick form cues without typing a paragraph.' },
      { iconKey: 'image', title: 'Photo & video', desc: 'Review technique with clips shared right in the thread.' },
    ],
  },
  {
    slug: 'payments',
    audience: 'For Coaches',
    name: 'Payments',
    sub: 'Subscriptions and one-off payments.',
    iconKey: 'credit-card',
    demoKey: 'payments',
    title: { prefix: 'Let the system run ', accent: 'billing.', suffix: '' },
    highlight: { prefix: 'Get paid on ', accent: 'autopilot.' },
    highlightSub: 'Forgotten invoices and awkward reminders end here. Billing runs itself so you can focus on athletes.',
    lead: 'Integrated Stripe payments, recurring subscriptions and automatic billing — money keeps moving while you coach.',
    tags: ['Stripe Connect', 'Recurring', 'Auto Billing', 'Analytics'],
    capsTitle: 'Get paid without chasing anyone.',
    caps: [
      { iconKey: 'credit-card', title: 'Stripe Connect', desc: "Payouts land straight in your account — Jimmy never holds your money." },
      { iconKey: 'repeat', title: 'Recurring plans', desc: 'Set a subscription once and let it renew on its own.' },
      { iconKey: 'bar-chart-3', title: 'Revenue analytics', desc: 'See MRR, churn and active clients at a glance.' },
    ],
  },
  {
    slug: 'progress-tracking',
    audience: 'For Coaches',
    name: 'Progress Tracking',
    sub: 'PRs, lifts, benchmarks.',
    iconKey: 'trending-up',
    demoKey: null,
    title: { prefix: 'See every PR, lift and ', accent: 'streak.', suffix: '' },
    highlight: { prefix: 'What gets measured, ', accent: 'gets repeated.' },
    highlightSub: 'Visible progress is the strongest motivator there is. Make every gain impossible to miss.',
    lead: "Track benchmarks across your whole roster. Spot who's thriving — and who needs a nudge — before they ever go quiet.",
    tags: ['PRs', 'Benchmarks', 'Lift History', 'Streaks'],
    capsTitle: 'Data that keeps clients on track.',
    caps: [
      { iconKey: 'trending-up', title: 'PRs & benchmarks', desc: 'Personal records logged automatically as clients train.' },
      { iconKey: 'activity', title: 'Lift history', desc: 'Every set, every session — searchable in seconds.' },
      { iconKey: 'flame', title: 'Streaks & adherence', desc: 'Spot drop-off early and step in before it becomes a churn.' },
    ],
  },
  // ── For Members ───────────────────────────────────────────────────────────────
  {
    slug: 'branded-mobile-app',
    audience: 'For Members',
    name: 'Branded Mobile App',
    sub: 'Your logo, your colors.',
    iconKey: 'smartphone',
    demoKey: 'brandedApp',
    title: { prefix: 'Your brand. ', accent: 'Their pocket.', suffix: '' },
    highlight: { prefix: 'Your logo. ', accent: 'Your colors.' },
    highlightSub: "Members open an app with your name on it every day. That's a brand you can't buy with ads.",
    lead: "A white-label iOS and Android app — your logo, your colors, your name on the home screen. Members train inside your world, not someone else's.",
    tags: ['iOS & Android', 'Your Logo', 'Your Colors', 'Push'],
    capsTitle: "An app that's unmistakably yours.",
    caps: [
      { iconKey: 'palette', title: 'Your logo & colors', desc: 'Every screen wears your brand, not a generic template.' },
      { iconKey: 'smartphone', title: 'iOS & Android', desc: 'Native apps your members download and keep on their phone.' },
      { iconKey: 'bell', title: 'Push notifications', desc: 'Reach members the moment a new session drops.' },
    ],
  },
  {
    slug: 'daily-workouts',
    audience: 'For Members',
    name: 'Daily Workouts',
    sub: 'Clear blocks, timers, videos.',
    iconKey: 'calendar-check',
    demoKey: 'dailyWorkout',
    title: { prefix: "Today's session, ", accent: 'ready.', suffix: '' },
    highlight: { prefix: 'Open. Train. ', accent: 'Done.' },
    highlightSub: 'No spreadsheets, no PDFs, no questions. The session is waiting the moment they open the app.',
    lead: 'Clear blocks, built-in timers and demo videos. Members open the app and just train — no guessing, no scrolling.',
    tags: ['Daily Blocks', 'Timers', 'Demo Videos', 'Logging'],
    capsTitle: 'Show up. Train. Done.',
    caps: [
      { iconKey: 'calendar-check', title: 'Daily blocks', desc: 'Each day lays out exactly what to do, in order.' },
      { iconKey: 'timer', title: 'Built-in timers', desc: 'EMOM and interval timers run inside the workout.' },
      { iconKey: 'play', title: 'Demo videos', desc: 'Every movement comes with a clip — form never in doubt.' },
    ],
  },
  {
    slug: 'community-member',
    audience: 'For Members',
    name: 'Community',
    sub: 'Train together, not alone.',
    iconKey: 'heart-handshake',
    demoKey: 'community',
    title: { prefix: 'Train together, ', accent: 'not alone.', suffix: '' },
    highlight: { prefix: "They don't just train — ", accent: 'they belong.' },
    highlightSub: 'Accountability is contagious. Surround members with people on the same path and they stay.',
    lead: 'A feed, challenges and reactions that keep members showing up — for themselves and for each other.',
    tags: ['Shared Feed', 'Challenges', 'Reactions', 'Leaderboards'],
    capsTitle: 'The part that keeps them coming back.',
    caps: [
      { iconKey: 'users', title: 'Shared feed', desc: 'Wins, check-ins and encouragement from the whole group.' },
      { iconKey: 'trophy', title: 'Challenges', desc: 'Friendly competition that makes the work feel like a game.' },
      { iconKey: 'heart', title: 'Reactions', desc: 'A single tap of support that turns effort into belonging.' },
    ],
  },
  {
    slug: 'direct-access',
    audience: 'For Members',
    name: 'Direct Access',
    sub: 'Chat and check-ins with coach.',
    iconKey: 'messages-square',
    demoKey: 'messaging',
    title: { prefix: 'Their coach, ', accent: 'one tap away.', suffix: '' },
    highlight: { prefix: 'Always within ', accent: 'reach.' },
    highlightSub: 'When help is one tap away, members trust the process — and stick with it far longer.',
    lead: 'Chat and check-ins with their coach, built right in — so questions get answered and nothing slips through the cracks.',
    tags: ['1:1 Chat', 'Check-ins', 'Voice', 'Reminders'],
    capsTitle: "Support that's always within reach.",
    caps: [
      { iconKey: 'message-circle', title: '1:1 chat', desc: 'A direct line to their coach, no other app required.' },
      { iconKey: 'clipboard-check', title: 'Check-ins', desc: 'Regular prompts keep members accountable and seen.' },
      { iconKey: 'bell', title: 'Reminders', desc: 'Gentle nudges so sessions and replies never get lost.' },
    ],
  },
  {
    slug: 'progress-view',
    audience: 'For Members',
    name: 'Progress View',
    sub: 'Graphs, streaks, PR history.',
    iconKey: 'line-chart',
    demoKey: 'progressView',
    title: { prefix: 'Watch the gains ', accent: 'stack up.', suffix: '' },
    highlight: { prefix: 'Motivation you can ', accent: 'see.' },
    highlightSub: 'Numbers going up are the best coach there is. Members watch their progress — and want more of it.',
    lead: 'Graphs, streaks and full PR history — visible proof that the work is working, right in their pocket.',
    tags: ['Progress Graphs', 'Streaks', 'PR History', 'Badges'],
    capsTitle: 'Motivation they can actually see.',
    caps: [
      { iconKey: 'line-chart', title: 'Progress graphs', desc: 'Every lift and benchmark plotted over time.' },
      { iconKey: 'flame', title: 'Streaks', desc: 'Daily streaks that make consistency feel rewarding.' },
      { iconKey: 'history', title: 'PR history', desc: 'A growing record of personal bests to look back on.' },
    ],
  },
  {
    slug: 'easy-payments',
    audience: 'For Members',
    name: 'Easy Payments',
    sub: 'Manage plans in one place.',
    iconKey: 'wallet',
    demoKey: 'payments',
    title: { prefix: 'Plans, paid in ', accent: 'seconds.', suffix: '' },
    highlight: { prefix: 'No reminders. ', accent: 'No friction.' },
    highlightSub: 'When paying is effortless, members stay subscribed — and coaches stop chasing invoices.',
    lead: 'Members manage their subscription and payments in one place — secure, simple, and no awkward reminders.',
    tags: ['Subscriptions', 'Secure Checkout', 'Receipts', 'Self-serve'],
    capsTitle: 'Paying is the easy part.',
    caps: [
      { iconKey: 'wallet', title: 'One place for plans', desc: 'Subscription, history and receipts all live in the app.' },
      { iconKey: 'shield-check', title: 'Secure checkout', desc: "Powered by Stripe — card details never touch the coach." },
      { iconKey: 'refresh-cw', title: 'Self-serve', desc: 'Upgrade, pause or update payment with no back-and-forth.' },
    ],
  },
]

// ── Convert to Sanity documents ────────────────────────────────────────────────
const docs = FEATURES.map((f, i) => {
  const doc = {
    _id: `feature-${f.slug}`,
    _type: 'feature',
    name: f.name,
    slug: { _type: 'slug', current: f.slug },
    audience: f.audience,
    order: i,
    sub: f.sub,
    iconKey: f.iconKey,
    title: f.title,
    highlight: f.highlight,
    highlightSub: f.highlightSub,
    lead: f.lead,
    tags: f.tags,
    capsTitle: f.capsTitle,
    caps: f.caps.map((c) => ({ _type: 'featureCap', _key: key(), ...c })),
  }
  if (f.demoKey) doc.demoKey = f.demoKey
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
  if (!res.ok) {
    console.error(JSON.stringify(json, null, 2))
    throw new Error('mutate failed')
  }
  return json
}

const result = await mutate(docs)
console.log(`✓ features: ${result.results.length}`)
console.log('done')
