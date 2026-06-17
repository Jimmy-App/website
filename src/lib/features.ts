/**
 * Features — static data layer (Sanity-portable).
 *
 * Content matches the window.FEATURES catalogue from feature-data.js.
 * Types are designed so a future Sanity fetch can drop in and the
 * consumers don't need to change.
 *
 * Icons are NOT imported here — they live in featureMeta.tsx so this
 * file stays plain TS (no JSX, no React imports).
 */

// ── Audience ──────────────────────────────────────────────────────────────────
export type FeatureAudience = 'For Coaches' | 'For Members'

// ── Demo key ─────────────────────────────────────────────────────────────────
export type FeatureDemoKey =
  | 'workout'
  | 'community'
  | 'messaging'
  | 'payments'
  | 'courses'
  | null

// ── Capability (what's inside grid item) ──────────────────────────────────────
export type FeatureCap = {
  /** lucide icon name (key into CAPS_ICON_MAP in featureMeta.tsx) */
  iconKey: string
  title: string
  desc: string
}

// ── Title parts (parsed from HTML `<span class="accent">…</span>`) ────────────
export type TitleParts = {
  prefix: string
  accent: string
  suffix: string
}

// ── Highlight (bold sub-line with a purple accent) ────────────────────────────
export type HighlightParts = {
  prefix: string
  accent: string
}

// ── Feature ───────────────────────────────────────────────────────────────────
export type Feature = {
  slug: string
  audience: FeatureAudience
  /** Short display name (breadcrumb label) */
  name: string
  /** One-line subtitle shown in Related / nav mega */
  sub: string
  /** lucide icon key into FEATURE_ICON_MAP in featureMeta.tsx */
  iconKey: string
  demoKey: FeatureDemoKey
  title: TitleParts
  highlight: HighlightParts
  highlightSub: string
  lead: string
  tags: string[]
  capsTitle: string
  caps: FeatureCap[]
}

// ── Data ──────────────────────────────────────────────────────────────────────

const FEATURES: Feature[] = [
  {
    slug: 'workout-builder',
    audience: 'For Coaches',
    name: 'Workout Builder',
    sub: 'Program structured blocks fast.',
    iconKey: 'dumbbell',
    demoKey: 'workout',
    title: {
      prefix: 'Build training that ',
      accent: 'moves.',
      suffix: '',
    },
    highlight: {
      prefix: 'Program once. ',
      accent: 'Reuse forever.',
    },
    highlightSub:
      'Stop rebuilding the same session every week. Save it, clone it, tweak it — and get your evenings back.',
    lead: 'EMOM, AMRAP, circuits, strength — program structured blocks in seconds, not spreadsheets. Built for coaches who actually train.',
    tags: ['Work Blocks', 'EMOM', 'AMRAP', 'Circuits', 'Video Library'],
    capsTitle: "Everything you need to program — nothing you don't.",
    caps: [
      {
        iconKey: 'blocks',
        title: 'Native block types',
        desc: 'EMOM, AMRAP, circuits and strength are built in — no workarounds.',
      },
      {
        iconKey: 'video',
        title: 'Video library',
        desc: 'Attach a demo to every movement so form is never in question.',
      },
      {
        iconKey: 'copy',
        title: 'Reusable templates',
        desc: 'Duplicate a full week or block and reprogram it in one tap.',
      },
    ],
  },

  {
    slug: 'programs-courses',
    audience: 'For Coaches',
    name: 'Programs & Courses',
    sub: 'Modules, lessons, full programs.',
    iconKey: 'graduation-cap',
    demoKey: 'courses',
    title: {
      prefix: 'Courses, like on ',
      accent: 'Skool.',
      suffix: '',
    },
    highlight: {
      prefix: 'Teach once. ',
      accent: 'Sell forever.',
    },
    highlightSub:
      'Package what you know into a course that earns while you coach — no extra hours required.',
    lead: 'Structure modules and lessons in a few clicks. Videos, PDFs, quizzes and unlocked progression — all under your brand.',
    tags: ['Modules', 'Lessons', 'Quizzes', 'Certificates', 'Drip'],
    capsTitle: 'Turn your knowledge into a product.',
    caps: [
      {
        iconKey: 'layers',
        title: 'Modules & lessons',
        desc: 'Organize content into a path clients can actually follow.',
      },
      {
        iconKey: 'lock',
        title: 'Unlocked progression',
        desc: "Gate lessons until clients are ready for what's next.",
      },
      {
        iconKey: 'award',
        title: 'Quizzes & certificates',
        desc: 'Reward completion and prove the work got done.',
      },
    ],
  },

  {
    slug: 'community-feed',
    audience: 'For Coaches',
    name: 'Community Feed',
    sub: 'Posts, reactions, challenges.',
    iconKey: 'users',
    demoKey: 'community',
    title: {
      prefix: 'Your clients never ',
      accent: 'train alone.',
      suffix: '',
    },
    highlight: {
      prefix: 'Belonging beats ',
      accent: 'willpower.',
    },
    highlightSub:
      "Clients quit programs. They don't quit communities. Give them a reason to keep showing up.",
    lead: 'A Skool-style community feed built right into your platform. Posts, reactions, announcements and group challenges keep momentum high.',
    tags: ['Posts', 'Reactions', 'Announcements', 'Group Challenges'],
    capsTitle: 'The retention engine, built in.',
    caps: [
      {
        iconKey: 'message-square',
        title: 'Posts & reactions',
        desc: 'A living feed where clients share wins and cheer each other on.',
      },
      {
        iconKey: 'megaphone',
        title: 'Announcements',
        desc: 'Pin updates so the whole community sees what matters.',
      },
      {
        iconKey: 'trophy',
        title: 'Group challenges',
        desc: 'Spin up challenges that turn solo effort into team effort.',
      },
    ],
  },

  {
    slug: 'messaging',
    audience: 'For Coaches',
    name: 'Messaging',
    sub: '1:1 and group chat with clients.',
    iconKey: 'message-circle',
    demoKey: 'messaging',
    title: {
      prefix: 'Stop coaching from ',
      accent: 'WhatsApp.',
      suffix: '',
    },
    highlight: {
      prefix: 'One inbox. ',
      accent: 'Zero chaos.',
    },
    highlightSub:
      'No more lost messages across three apps. Everything a client sends stays exactly where it belongs.',
    lead: '1:1 and group chat built directly into Jimmy. Text, photos and voice messages — all in one place, all tied to the right client.',
    tags: ['1:1 Chat', 'Voice', 'Photo & Video', 'Group Chat'],
    capsTitle: 'One inbox for your whole roster.',
    caps: [
      {
        iconKey: 'message-circle',
        title: '1:1 client chat',
        desc: "Every conversation lives next to that client's training.",
      },
      {
        iconKey: 'mic',
        title: 'Voice messages',
        desc: 'Send quick form cues without typing a paragraph.',
      },
      {
        iconKey: 'image',
        title: 'Photo & video',
        desc: 'Review technique with clips shared right in the thread.',
      },
    ],
  },

  {
    slug: 'payments',
    audience: 'For Coaches',
    name: 'Payments',
    sub: 'Subscriptions and one-off payments.',
    iconKey: 'credit-card',
    demoKey: 'payments',
    title: {
      prefix: 'Let the system run ',
      accent: 'billing.',
      suffix: '',
    },
    highlight: {
      prefix: 'Get paid on ',
      accent: 'autopilot.',
    },
    highlightSub:
      'Forgotten invoices and awkward reminders end here. Billing runs itself so you can focus on athletes.',
    lead: 'Integrated Stripe payments, recurring subscriptions and automatic billing — money keeps moving while you coach.',
    tags: ['Stripe Connect', 'Recurring', 'Auto Billing', 'Analytics'],
    capsTitle: 'Get paid without chasing anyone.',
    caps: [
      {
        iconKey: 'credit-card',
        title: 'Stripe Connect',
        desc: "Payouts land straight in your account — Jimmy never holds your money.",
      },
      {
        iconKey: 'repeat',
        title: 'Recurring plans',
        desc: 'Set a subscription once and let it renew on its own.',
      },
      {
        iconKey: 'bar-chart-3',
        title: 'Revenue analytics',
        desc: 'See MRR, churn and active clients at a glance.',
      },
    ],
  },

  {
    slug: 'progress-tracking',
    audience: 'For Coaches',
    name: 'Progress Tracking',
    sub: 'PRs, lifts, benchmarks.',
    iconKey: 'trending-up',
    demoKey: null,
    title: {
      prefix: 'See every PR, lift and ',
      accent: 'streak.',
      suffix: '',
    },
    highlight: {
      prefix: 'What gets measured, ',
      accent: 'gets repeated.',
    },
    highlightSub:
      'Visible progress is the strongest motivator there is. Make every gain impossible to miss.',
    lead: 'Track benchmarks across your whole roster. Spot who\'s thriving — and who needs a nudge — before they ever go quiet.',
    tags: ['PRs', 'Benchmarks', 'Lift History', 'Streaks'],
    capsTitle: 'Data that keeps clients on track.',
    caps: [
      {
        iconKey: 'trending-up',
        title: 'PRs & benchmarks',
        desc: 'Personal records logged automatically as clients train.',
      },
      {
        iconKey: 'activity',
        title: 'Lift history',
        desc: 'Every set, every session — searchable in seconds.',
      },
      {
        iconKey: 'flame',
        title: 'Streaks & adherence',
        desc: 'Spot drop-off early and step in before it becomes a churn.',
      },
    ],
  },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

export function getFeature(slug: string): Feature | undefined {
  return FEATURES.find((f) => f.slug === slug)
}

export function coachFeatures(): Feature[] {
  return FEATURES.filter((f) => f.audience === 'For Coaches')
}

export function relatedFeatures(slug: string): Feature[] {
  const feature = getFeature(slug)
  if (!feature) return []
  return FEATURES.filter(
    (f) => f.audience === feature.audience && f.slug !== slug,
  )
}

export function allCoachSlugs(): string[] {
  return coachFeatures().map((f) => f.slug)
}
