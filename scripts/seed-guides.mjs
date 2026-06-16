// Seeds 18 guides into Sanity. Idempotent (createOrReplace by _id).
// Run:  set -a; . ./.env.local; set +a; node scripts/seed-guides.mjs
import { randomUUID } from 'node:crypto'

const PROJECT = 'rpeljbjz'
const DATASET = 'production'
const API = 'v2023-05-03'
const TOKEN = process.env.SANITY_API_TOKEN
if (!TOKEN) {
  console.error('Missing SANITY_API_TOKEN'); process.exit(1)
}

const key = () => randomUUID().replace(/-/g, '').slice(0, 12)

// ── Inline **bold** / _italic_ → Portable Text spans ──────────────────
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

const ptBlock = (style, text) => ({
  _type: 'block', _key: key(), style, markDefs: [], children: spans(text),
})
const ptLi = (listItem, text) => ({
  _type: 'block', _key: key(), style: 'normal', listItem, level: 1, markDefs: [], children: spans(text),
})

// ── Convert a static Block[] → Portable Text items ────────────────────
// Handles blocks within a step the same way (recursive call with same toPT)
function toPT(blocks) {
  const out = []
  for (const b of blocks) {
    switch (b.type) {
      case 'p':
        out.push(ptBlock('normal', b.text))
        break
      case 'h2':
        out.push(ptBlock('h2', b.text))
        break
      case 'h3':
        out.push(ptBlock('h3', b.text))
        break
      case 'check':
        out.push({
          _type: 'checklist',
          _key: key(),
          items: b.items,
        })
        break
      case 'callout':
        out.push({
          _type: 'guideCallout',
          _key: key(),
          tone: b.tone,
          label: b.label,
          text: b.text,
        })
        break
      case 'video':
        out.push({
          _type: 'guideVideo',
          _key: key(),
          label: b.label,
          duration: b.duration,
        })
        break
      case 'steps':
        out.push({
          _type: 'guideSteps',
          _key: key(),
          items: b.items.map((step) => ({
            _type: 'stepItem',
            _key: key(),
            title: step.title,
            body: toPT(step.blocks),
          })),
        })
        break
      case 'faq':
        out.push({
          _type: 'guideFaq',
          _key: key(),
          items: b.items.map((item) => ({
            _type: 'guideFaqItem',
            _key: key(),
            q: item.q,
            a: item.a,
          })),
        })
        break
      case 'figure':
        // Skip — no image assets; render as skeleton in the UI
        break
      default:
        break
    }
  }
  return out
}

// ── Popular guide slugs ────────────────────────────────────────────────
const POPULAR_GUIDE_SLUGS = new Set([
  'set-up-your-branded-app',
  'build-a-training-block',
  'connect-stripe',
  '7-day-onboarding-flow',
  'spotting-churn-early',
])

// ── Static guide data (ported from src/lib/guides.ts before slimming) ──
const GUIDES_RAW = [
  /* ── Getting started ──────────────────────────────────── */
  {
    slug: 'welcome-to-jimmy',
    category: 'getting-started',
    title: 'Welcome to Jimmy',
    lead: 'A quick orientation: what Jimmy does, what you can expect, and how to get the most out of the platform in your first week.',
    level: 'Beginner',
    readMin: 2,
    updatedAt: '2026-06-01T00:00:00Z',
    order: 1,
    body: [
      { type: 'p', text: 'Jimmy is your coaching platform — workout programming, client communication, payments and a branded mobile app, all in one place. This guide gives you the lay of the land before you dive in.' },
      { type: 'h2', id: 'what-is-jimmy', text: 'What is Jimmy?' },
      { type: 'p', text: 'At its core, Jimmy lets you build training programmes and sell them to clients who use your own branded app — with your name, your colors, and your logo on their home screen.' },
      { type: 'p', text: 'Everything else — payments, push notifications, a community feed — layers on top of that core.' },
      { type: 'callout', tone: 'tip', label: 'Start small', text: 'Most coaches get the most value by inviting 2–3 existing clients first, getting feedback, then expanding. You can invite unlimited clients on any paid plan.' },
      { type: 'h2', id: 'your-first-week', text: 'Your first week' },
      { type: 'check', items: [
        'Create your account and set a profile photo.',
        'Set up branding (logo + colors) so the app feels like yours.',
        'Invite one or two clients to pilot the experience.',
        'Build your first training block and assign it.',
      ]},
      { type: 'faq', items: [
        { q: 'Is Jimmy only for personal trainers?', a: 'No — Jimmy works for any fitness coach: personal trainers, online coaches, CrossFit coaches, running coaches, yoga instructors and more.' },
        { q: 'What does the free plan include?', a: 'The free plan lets you work with up to 5 clients, build unlimited programmes, and access all core features. Publishing your branded app to the App Store and Google Play requires a paid plan.' },
      ]},
    ],
  },
  {
    slug: 'create-your-account',
    category: 'getting-started',
    title: 'Create your account',
    lead: 'Set up your Jimmy coach account in under five minutes: email, profile and your first branding pass.',
    level: 'Beginner',
    readMin: 3,
    updatedAt: '2026-06-01T00:00:00Z',
    order: 2,
    body: [
      { type: 'p', text: "Getting started takes less than five minutes. You'll sign up, verify your email, fill in a short profile and land in your dashboard ready to go." },
      { type: 'h2', id: 'sign-up', text: 'Sign up' },
      { type: 'p', text: 'Go to app.jimmycoach.com and click **Get started free**. Enter your email and choose a password — or continue with Google if you prefer.' },
      { type: 'callout', tone: 'note', label: 'Email verification', text: 'You\'ll receive a verification email within a minute. Check your spam folder if it doesn\'t arrive — add "no-reply@jimmycoach.com" to your contacts to keep future emails safe.' },
      { type: 'h2', id: 'complete-your-profile', text: 'Complete your profile' },
      { type: 'p', text: 'Your profile is what clients see when they accept an invitation. Add a clear headshot, a short bio (2–3 sentences is plenty) and the type of coaching you offer.' },
      { type: 'check', items: [
        'Profile photo — a clear headshot on a plain background.',
        'Display name — the name clients will see.',
        'Coaching type — choose from the list or type a custom value.',
        'Time zone — critical for scheduling reminders correctly.',
      ]},
      { type: 'faq', items: [
        { q: 'Can I change my email later?', a: 'Yes — go to Settings → Account → Email. You\'ll need to verify the new address before the change takes effect.' },
        { q: 'Is there a mobile app for coaches?', a: 'The coach dashboard is a web app optimised for desktop. Your clients use your branded mobile app. A native coach companion app is on the roadmap.' },
      ]},
    ],
  },
  {
    slug: 'invite-your-first-clients',
    category: 'getting-started',
    title: 'Invite your first clients',
    lead: 'Send invitations, track acceptance, and get clients onboarded to your branded app before their first session.',
    level: 'Beginner',
    readMin: 4,
    updatedAt: '2026-06-01T00:00:00Z',
    order: 3,
    body: [
      { type: 'p', text: 'Inviting a client takes about 30 seconds. They get an email with a magic link that opens your branded app and walks them through account setup automatically.' },
      { type: 'h2', id: 'send-an-invitation', text: 'Send an invitation' },
      { type: 'p', text: 'From your dashboard, go to **Clients → Invite client**. Enter the client\'s name and email address. Add an optional personal message — clients are more likely to accept invitations that feel personal.' },
      { type: 'callout', tone: 'tip', label: 'Personalise the message', text: 'A one-line custom message — "Looking forward to training with you, Jamie!" — roughly doubles the acceptance rate compared to a blank invite.' },
      { type: 'h2', id: 'track-acceptance', text: 'Track acceptance' },
      { type: 'p', text: 'The **Clients** page shows each invitation\'s status: Pending, Accepted, or Inactive. If an invite hasn\'t been accepted after 48 hours, you can resend it with one click.' },
      { type: 'check', items: [
        'Client accepts → they appear in your active client list.',
        'Client sets up their profile in the app.',
        'Assign a training block to kick things off.',
      ]},
      { type: 'faq', items: [
        { q: 'What does the client see after accepting?', a: "They're taken through a short onboarding flow: name, fitness goal, and a short profile. Then they land in your branded app where they can see any programmes you've assigned." },
        { q: 'Can I bulk-invite clients?', a: 'Yes — use the CSV import option on the Invite page. Upload a file with name and email columns and Jimmy sends them all at once.' },
      ]},
    ],
  },
  {
    slug: 'set-up-your-branded-app',
    category: 'getting-started',
    title: 'Set up your branded app',
    lead: "Your members should open your app — not \"Jimmy\". In about ten minutes you'll add your logo, colors, name and icon, preview it on a real phone, and send it off for the stores.",
    level: 'Beginner',
    readMin: 6,
    updatedAt: '2026-06-01T00:00:00Z',
    order: 4,
    body: [
      { type: 'video', label: 'Watch the 2-minute walkthrough', duration: '2:08' },
      { type: 'h2', id: 'before', text: 'Before you start' },
      { type: 'p', text: 'Branding lives in your coach dashboard, so you only need a few things ready. Gather these and the whole flow takes one sitting:' },
      { type: 'check', items: [
        'A **square logo** (PNG or SVG, at least 512×512, transparent background works best).',
        'Your **brand colors** — a primary and, optionally, an accent (hex codes if you have them).',
        'The **app name** members will see on their home screen (keep it under 20 characters).',
      ]},
      { type: 'callout', tone: 'note', label: 'On a Free plan?', text: 'You can preview your branding right away. Publishing to the App Store and Google Play unlocks on the Pro plan — everything else here works on every plan.' },
      { type: 'h2', id: 'steps', text: 'Brand your app in 6 steps' },
      { type: 'steps', items: [
        {
          title: 'Open Branding settings',
          blocks: [
            { type: 'p', text: 'From your dashboard, go to **Settings → Branding**. This is mission control for everything members see — the splash screen, app icon, colors and name all live here.' },
            { type: 'figure', caption: 'The Branding tab in your coach dashboard.' },
          ],
        },
        {
          title: 'Upload your logo',
          blocks: [
            { type: 'p', text: "Drag your square logo into the **App icon** slot. Jimmy generates every size the stores require automatically — you don't need to export 12 variants. A version on a solid background is used for the home-screen icon; the transparent one for in-app headers." },
            { type: 'callout', tone: 'tip', label: 'Keep it simple', text: 'Icons are tiny on a phone. A single mark or monogram reads far better than your full horizontal logo with text.' },
            { type: 'figure', caption: 'Drop your logo and see the icon update live.' },
          ],
        },
        {
          title: 'Pick your brand colors',
          blocks: [
            { type: 'p', text: 'Set your **primary color** — it drives buttons, links and active states across the app. Paste a hex code or use the picker. The live preview on the right updates instantly so you can see how it feels on real screens before committing.' },
            { type: 'figure', caption: 'Primary color applied across the member app in real time.' },
          ],
        },
        {
          title: 'Name your app & set the splash',
          blocks: [
            { type: 'p', text: 'Type the **app name** members see under the icon, and add a short tagline for the splash screen. Keep the name short — long names get truncated with an ellipsis on the home screen.' },
            { type: 'callout', tone: 'warn', label: 'Names are checked at review', text: 'Avoid trademarked words you don\'t own (e.g. "CrossFit", "Hyrox") in the app name — Apple and Google will reject the listing. Use them in descriptions instead.' },
          ],
        },
        {
          title: 'Preview on a real device',
          blocks: [
            { type: 'p', text: 'Tap **Send preview to my phone**. You\'ll get a link that opens your branded app instantly — no install — so you can check the icon, colors and splash on a real screen. Share it with a teammate to get a second pair of eyes.' },
            { type: 'figure', caption: 'The live preview running on a real device.' },
          ],
        },
        {
          title: 'Submit for the stores',
          blocks: [
            { type: 'p', text: "Happy with it? Hit **Submit for review**. Jimmy handles the App Store and Google Play submissions for you and emails you at each stage. Approval usually takes **2–5 business days**; we'll let you know the moment your app is live." },
            { type: 'callout', tone: 'success', label: "That's it", text: 'Once approved, your members download your app by name from the stores. You can update branding any time — changes ship in the next release without a re-review.' },
          ],
        },
      ]},
      { type: 'h2', id: 'faq', text: 'Frequently asked questions' },
      { type: 'faq', items: [
        { q: 'Do I need an Apple Developer account?', a: "No. Jimmy publishes your branded app under our developer accounts, so there's nothing to register or renew. You keep full control of the branding from your dashboard." },
        { q: 'Can I change my logo or colors after launch?', a: 'Yes, any time. Update them in **Settings → Branding** and the changes roll out with the next app release — usually within a day, with no new review needed for minor visual tweaks.' },
        { q: 'How long does store approval take?', a: "Typically 2–5 business days for the first submission. Apple is usually slower than Google. You'll get an email at every stage, and your dashboard shows live status." },
        { q: 'What happens to members already using the app?', a: 'Existing members get the new branding as an automatic update — no action needed on their end. Their data, history and logins all carry over untouched.' },
      ]},
    ],
  },
  {
    slug: 'a-tour-of-your-dashboard',
    category: 'getting-started',
    title: 'A tour of your dashboard',
    lead: "A quick walkthrough of every section in your coach dashboard — so you always know where things live.",
    level: 'Beginner',
    readMin: 5,
    updatedAt: '2026-06-01T00:00:00Z',
    order: 5,
    body: [
      { type: 'p', text: "Your dashboard is the command centre for your coaching business. Here's a quick tour of the main sections so you feel at home from day one." },
      { type: 'h2', id: 'overview', text: 'The overview page' },
      { type: 'p', text: "The **Overview** page shows your active client count, any upcoming sessions flagged by clients, and a quick summary of revenue for the current month. It's designed to give you the pulse of your business in one glance." },
      { type: 'h2', id: 'key-sections', text: 'Key sections' },
      { type: 'check', items: [
        '**Clients** — invite, view and manage every client relationship.',
        '**Programming** — build, edit and assign training blocks and programmes.',
        '**Community** — manage your feed, groups and direct messages.',
        '**Payments** — subscriptions, plan pricing and payout history.',
        '**Settings** — account, branding, notifications and integrations.',
      ]},
      { type: 'callout', tone: 'tip', label: 'Keyboard shortcut', text: 'Press G then C to jump to Clients, G then P for Programming, G then S for Settings — from anywhere in the dashboard.' },
      { type: 'faq', items: [
        { q: 'Can I customise what appears on the overview?', a: 'Not yet — the overview layout is fixed for now. Custom widgets and pinned metrics are on the roadmap.' },
        { q: 'Is there a dark mode?', a: 'Dark mode follows your system setting automatically. You can override it in Settings → Appearance.' },
      ]},
    ],
  },
  /* ── Branded app ──────────────────────────────────────── */
  {
    slug: 'logo-and-colors',
    category: 'branded-app',
    title: 'Logo & colors',
    lead: 'Detailed guide to logo formats, color pickers and accessibility tips for your branded app.',
    level: 'Beginner',
    readMin: 5,
    updatedAt: '2026-06-01T00:00:00Z',
    order: 1,
    body: [
      { type: 'p', text: 'Your logo and colors are the most visible parts of your brand. This guide covers the technical requirements and design tips for getting them right.' },
      { type: 'h2', id: 'logo-requirements', text: 'Logo requirements' },
      { type: 'p', text: 'Jimmy accepts PNG and SVG files for your logo. The file must be square — the same width and height — and at least 512×512 pixels. A transparent background gives the best results across light and dark system themes.' },
      { type: 'check', items: [
        'Format: PNG or SVG',
        'Dimensions: square, minimum 512×512 px',
        'Transparent background recommended',
        'File size under 5 MB',
      ]},
      { type: 'h2', id: 'color-system', text: 'Your color system' },
      { type: 'p', text: 'You set one **primary color** — this drives buttons, links and active states. You can optionally set a **secondary color** for accents. Jimmy generates a full accessible palette from these two values automatically.' },
      { type: 'callout', tone: 'note', label: 'Accessibility', text: "Jimmy checks your primary color against WCAG AA contrast requirements. If the text on your primary-colored buttons would be hard to read, you'll see a warning and a suggested alternative." },
      { type: 'faq', items: [
        { q: 'Can I use a gradient as my primary color?', a: "Not directly — the color picker accepts a single hex value. However, the member app uses that color as a gradient stop in several UI elements, so you'll naturally get a gradient feel." },
        { q: 'My logo looks blurry — what should I do?', a: "Make sure you're uploading an SVG or a PNG at least 512×512 pixels. The app scales your logo up for some display sizes, so low-resolution files will look blurry." },
      ]},
    ],
  },
  {
    slug: 'publish-to-the-stores',
    category: 'branded-app',
    title: 'Publish to the stores',
    lead: 'Submit your branded app to the App Store and Google Play — what Jimmy handles vs. what you provide.',
    level: 'Intermediate',
    readMin: 7,
    updatedAt: '2026-06-01T00:00:00Z',
    order: 2,
    body: [
      { type: 'p', text: "Publishing a mobile app to the App Store and Google Play is normally a complex, developer-heavy process. Jimmy handles the technical parts — you just provide the branding and a few text fields." },
      { type: 'h2', id: 'what-jimmy-handles', text: 'What Jimmy handles' },
      { type: 'p', text: 'Jimmy takes care of the entire submission pipeline: building the app binaries, signing them, uploading to both stores and managing the review correspondence. You never need to touch Xcode or Android Studio.' },
      { type: 'check', items: [
        'App build + code signing (both platforms)',
        'Automated screenshot generation for all required device sizes',
        'App Store Connect and Google Play Console management',
        'Review correspondence if Apple or Google request changes',
      ]},
      { type: 'h2', id: 'what-you-provide', text: 'What you provide' },
      { type: 'p', text: "You fill in a short form in Settings → Branding → Publish. It asks for your app name, a short description (up to 80 characters), a full description (up to 4,000 characters for the App Store) and at least one support email address." },
      { type: 'callout', tone: 'warn', label: 'Plan requirement', text: 'Store publishing is available on Pro and above. On the Free plan, you can still preview the app on your own devices via the preview link.' },
      { type: 'faq', items: [
        { q: 'How long does the first review take?', a: 'The App Store typically takes 2–5 business days; Google Play is usually 1–3 days. Subsequent updates are usually faster.' },
        { q: "What if the review is rejected?", a: "Jimmy monitors the review status and will email you if action is needed. Most rejections are metadata issues we can fix without involving you." },
      ]},
    ],
  },
  {
    slug: 'push-notifications',
    category: 'branded-app',
    title: 'Push notifications',
    lead: 'Set up and customise push notifications to keep your clients engaged and on track.',
    level: 'Beginner',
    readMin: 4,
    updatedAt: '2026-06-01T00:00:00Z',
    order: 3,
    body: [
      { type: 'p', text: 'Push notifications are a direct line to your clients on their phones. Jimmy sends automated notifications for workouts and lets you send manual broadcasts whenever you want.' },
      { type: 'h2', id: 'automated-notifications', text: 'Automated notifications' },
      { type: 'p', text: "By default, Jimmy sends three types of automated notifications to clients: a workout reminder on days with a scheduled session, a progress prompt after a session is completed, and a \"you haven't trained in a while\" nudge after 7 days of inactivity." },
      { type: 'check', items: [
        "Workout reminder — sent at 7 AM in the client's local timezone.",
        'Post-session prompt — sent 1 hour after a session is marked complete.',
        'Re-engagement nudge — sent after 7 days of inactivity.',
      ]},
      { type: 'h2', id: 'manual-broadcasts', text: 'Manual broadcasts' },
      { type: 'p', text: 'From **Community → Notifications**, you can send a message to all clients, a specific group, or individual clients. Broadcasts support text and an optional link.' },
      { type: 'callout', tone: 'tip', label: 'Best time to send', text: "Research shows fitness notifications get the highest open rates between 7–9 AM and 5–7 PM local time. Jimmy's broadcast tool lets you schedule sends — use it." },
      { type: 'faq', items: [
        { q: 'Can clients turn off notifications?', a: 'Yes — clients can manage notification preferences in the app under Settings → Notifications. They can turn off specific types without opting out entirely.' },
        { q: 'Are notifications sent from my app name?', a: "Yes — once your branded app is published, all notifications appear to come from your app name, not from \"Jimmy\"." },
      ]},
    ],
  },
  /* ── Programming ──────────────────────────────────────── */
  {
    slug: 'build-a-training-block',
    category: 'programming',
    title: 'Build a training block',
    lead: 'Create a structured training block — weeks, sessions and exercises — and assign it to one or more clients.',
    level: 'Beginner',
    readMin: 6,
    updatedAt: '2026-06-01T00:00:00Z',
    order: 1,
    body: [
      { type: 'p', text: "A training block is a multi-week plan with daily sessions. Build it once and assign it to as many clients as you like — each client gets their own copy that you can then personalise." },
      { type: 'h2', id: 'create-a-block', text: 'Create a block' },
      { type: 'p', text: 'Go to **Programming → New block**. Give it a name (e.g. "12-Week Strength Base"), set the duration in weeks, and choose a start day. Jimmy scaffolds the empty week/day grid for you.' },
      { type: 'h2', id: 'add-sessions', text: 'Add sessions' },
      { type: 'p', text: 'Click any day cell to open the session editor. Add exercises using the search bar — the exercise library includes hundreds of movements, or you can add your own custom exercises.' },
      { type: 'check', items: [
        'Search for exercises or create custom ones.',
        'Set sets, reps, weight and notes per exercise.',
        'Add a session note visible to the client.',
        'Duplicate sessions across days to save time.',
      ]},
      { type: 'callout', tone: 'tip', label: 'Copy weeks', text: 'The "Copy week" button duplicates an entire week of sessions — great for progressive overload blocks where only the load changes week to week.' },
      { type: 'faq', items: [
        { q: 'Can I reuse a block for multiple clients?', a: "Yes — assign the same block to multiple clients. Each client gets an independent copy, so changes you make for one client don't affect others." },
        { q: 'Can clients see their upcoming sessions?', a: 'Clients see their full programme calendar in the app. They can scroll forward to preview upcoming sessions.' },
      ]},
    ],
  },
  {
    slug: 'track-prs-and-benchmarks',
    category: 'programming',
    title: 'Track PRs & benchmarks',
    lead: 'Log personal records and benchmark workouts so you and your clients can see progress over time.',
    level: 'Intermediate',
    readMin: 5,
    updatedAt: '2026-06-01T00:00:00Z',
    order: 2,
    body: [
      { type: 'p', text: 'Personal records (PRs) and benchmark workouts give clients a concrete measure of progress. Jimmy tracks them automatically when exercises are marked complete in the app.' },
      { type: 'h2', id: 'automatic-pr-detection', text: 'Automatic PR detection' },
      { type: 'p', text: 'When a client logs a completed set heavier or faster than any previous log for that exercise, Jimmy automatically flags it as a PR in the session history. The client sees a small trophy icon in the app.' },
      { type: 'h2', id: 'benchmark-workouts', text: 'Benchmark workouts' },
      { type: 'p', text: 'Mark any session as a **benchmark** to create a recurring test. Every time the client completes that session, Jimmy plots the result on a progress chart — ideal for Fran times, max deadlifts or 5K paces.' },
      { type: 'callout', tone: 'tip', label: 'Use benchmarks quarterly', text: 'Schedule benchmark tests every 4–6 weeks. Showing clients a visual progress chart is one of the most powerful retention tools available.' },
      { type: 'faq', items: [
        { q: "Can I manually enter a PR from before Jimmy?", a: "Yes — go to a client's profile, select an exercise, and tap \"Add historical entry\". You can back-date entries to build a complete history." },
        { q: 'Are PRs visible to the client?', a: "Yes — clients see a dedicated \"Records\" tab in the app with all their PRs and benchmark history." },
      ]},
    ],
  },
  {
    slug: 'hyrox-and-crossfit-templates',
    category: 'programming',
    title: 'Hyrox & CrossFit templates',
    lead: 'Ready-made templates for Hyrox and CrossFit-style programming — import and customise in seconds.',
    level: 'Intermediate',
    readMin: 5,
    updatedAt: '2026-06-01T00:00:00Z',
    order: 3,
    body: [
      { type: 'p', text: "Jimmy's template library includes ready-made training blocks for Hyrox and CrossFit-style fitness. Import any template and customise it for your clients in minutes." },
      { type: 'h2', id: 'hyrox-templates', text: 'Hyrox templates' },
      { type: 'p', text: 'The Hyrox preparation library includes an 8-week base block, a 12-week competition prep block and a race-week taper. Each is periodised with specific station work (SkiErg, sled push, burpee broad jumps) built in.' },
      { type: 'h2', id: 'crossfit-templates', text: 'CrossFit templates' },
      { type: 'p', text: "CrossFit templates follow the classic strength + conditioning split. You'll find a 4-week foundations block (ideal for newer athletes) and a 12-week competition prep block with gymnastics and Olympic lifting phases." },
      { type: 'callout', tone: 'note', label: 'Keep brand names out of the app listing', text: 'CrossFit and Hyrox are registered trademarks. You can use them in session descriptions and coach notes, but avoid them in your app name or store listing — the stores may reject it.' },
      { type: 'faq', items: [
        { q: 'Can I share templates with other coaches?', a: "Not yet — template sharing between coach accounts is on the roadmap. For now, templates are private to your account." },
        { q: 'Are the templates updated?', a: "The library is reviewed periodically. When a template is updated you'll see a notification on the template card and can choose to apply the update or keep your current version." },
      ]},
    ],
  },
  /* ── Community ────────────────────────────────────────── */
  {
    slug: 'launch-your-feed',
    category: 'community',
    title: 'Launch your feed',
    lead: 'Turn on your community feed, write your first post and set the tone for client engagement.',
    level: 'Beginner',
    readMin: 4,
    updatedAt: '2026-06-01T00:00:00Z',
    order: 1,
    body: [
      { type: 'p', text: "Your community feed is the social heart of your branded app — a place where you can share workouts, motivation and updates, and where clients can celebrate wins together." },
      { type: 'h2', id: 'enable-the-feed', text: 'Enable the feed' },
      { type: 'p', text: "Go to **Settings → Community** and toggle the feed on. Once enabled, a Feed tab appears in your clients' apps. You can turn it off at any time — posts are preserved." },
      { type: 'h2', id: 'write-your-first-post', text: 'Write your first post' },
      { type: 'p', text: 'From the **Community** dashboard, click **New post**. Add text, an image or a workout clip. Posts support @mentions so you can tag clients directly.' },
      { type: 'callout', tone: 'tip', label: 'Celebrate PRs', text: "The highest-engagement post type is a client shout-out after a PR. Jimmy can auto-generate these posts when a client hits a new record — enable it in Community settings." },
      { type: 'faq', items: [
        { q: 'Can clients post to the feed?', a: 'By default only coaches can post. You can open posting to clients — or allow it with approval — in Community settings.' },
        { q: 'Are comments moderated?', a: 'Comments are visible immediately but you can delete any comment from your dashboard. Comment notifications are sent to the post author.' },
      ]},
    ],
  },
  {
    slug: 'groups-and-messaging',
    category: 'community',
    title: 'Groups & messaging',
    lead: 'Create client groups for targeted communication and use direct messaging to keep conversations personal.',
    level: 'Beginner',
    readMin: 5,
    updatedAt: '2026-06-01T00:00:00Z',
    order: 2,
    body: [
      { type: 'p', text: "Groups let you segment your client list — by programme, goal or cohort — and send targeted messages. Direct messaging keeps one-on-one conversations in the app rather than scattered across email and WhatsApp." },
      { type: 'h2', id: 'create-a-group', text: 'Create a group' },
      { type: 'p', text: "Go to **Community → Groups → New group**. Give it a name, add members from your client list, and choose whether the group is visible to its members (so they can see each other) or private (coach-only)." },
      { type: 'h2', id: 'direct-messages', text: 'Direct messages' },
      { type: 'p', text: "Open any client's profile and tap **Message** to start a direct conversation. Messages are delivered as push notifications and appear in the app's Messages tab on the client side." },
      { type: 'callout', tone: 'note', label: 'Response time expectation', text: 'Set an expected response window with your clients upfront — for example "I reply to messages within 24 hours on weekdays". This prevents frustration and protects your time.' },
      { type: 'faq', items: [
        { q: 'Can clients message each other?', a: 'Clients can only message coaches directly. Client-to-client messaging is not supported to keep your community space moderated.' },
        { q: 'Is there a message history limit?', a: "No — message history is stored indefinitely. You can search messages from a client's profile page." },
      ]},
    ],
  },
  /* ── Payments ─────────────────────────────────────────── */
  {
    slug: 'connect-stripe',
    category: 'payments',
    title: 'Connect Stripe',
    lead: 'Link your Stripe account to Jimmy to start accepting subscription and one-time payments from clients.',
    level: 'Beginner',
    readMin: 4,
    updatedAt: '2026-06-01T00:00:00Z',
    order: 1,
    body: [
      { type: 'p', text: "Jimmy uses Stripe to process payments. Connecting your account takes about 2 minutes and is required before you can charge clients for any plan." },
      { type: 'h2', id: 'connect-your-account', text: 'Connect your account' },
      { type: 'p', text: "Go to **Settings → Payments** and click **Connect with Stripe**. If you already have a Stripe account, log in and authorise Jimmy. If not, Stripe will walk you through creating one — you'll need a bank account and some identity verification." },
      { type: 'callout', tone: 'note', label: 'Identity verification', text: 'Stripe requires identity verification for payouts. Have your government ID and bank details ready. Verification typically completes within a few hours.' },
      { type: 'h2', id: 'test-mode', text: 'Test mode' },
      { type: 'p', text: "Before going live, you can test your payment flow in Stripe's test mode. Create a plan in Jimmy, invite a test client, and use Stripe's test card numbers to simulate a purchase — no real money moves." },
      { type: 'faq', items: [
        { q: 'What are the payment processing fees?', a: "Jimmy adds a small platform fee on top of Stripe's processing fee (1.4% + 20p for European cards, 2.9% + 30¢ for US cards). See the Pricing page for current Jimmy fees by plan." },
        { q: 'Can I use a different payment processor?', a: 'Not currently — Jimmy is built on Stripe. Support for other processors is on the long-term roadmap.' },
      ]},
    ],
  },
  {
    slug: 'plans-and-subscriptions',
    category: 'payments',
    title: 'Plans & subscriptions',
    lead: 'Create membership plans, set pricing and manage client subscriptions directly from your dashboard.',
    level: 'Beginner',
    readMin: 5,
    updatedAt: '2026-06-01T00:00:00Z',
    order: 2,
    body: [
      { type: 'p', text: "Plans are the products you sell — monthly or yearly memberships that give clients access to your coaching. You can have as many plans as you like." },
      { type: 'h2', id: 'create-a-plan', text: 'Create a plan' },
      { type: 'p', text: 'Go to **Payments → Plans → New plan**. Set the name (e.g. "Online 1-to-1 Coaching"), billing interval (monthly or annual), and price. You can add a short description that clients see at checkout.' },
      { type: 'check', items: [
        'Name your plan clearly — clients see this at checkout.',
        'Set a billing interval: monthly or annual.',
        'Optionally add a free trial period (7, 14 or 30 days).',
        'Publish the plan when ready — draft plans are invisible to clients.',
      ]},
      { type: 'h2', id: 'manage-subscriptions', text: 'Manage subscriptions' },
      { type: 'p', text: "Each client's subscription status shows on their profile page: Active, Trialing, Past Due or Cancelled. You can cancel, pause or upgrade a subscription manually from the same page." },
      { type: 'callout', tone: 'tip', label: 'Annual plans save clients money', text: 'Offering annual plans at a 10–15% discount improves cashflow and dramatically reduces churn. Clients who pay annually almost never cancel.' },
      { type: 'faq', items: [
        { q: 'Can I offer a one-time payment?', a: 'Yes — create a plan with a "one-time" billing interval for programmes or challenges you sell as a single purchase.' },
        { q: 'What happens when a payment fails?', a: "Stripe retries the payment automatically over 7 days. If it still fails, the client is emailed and their account moves to \"Past due\". You're notified in your dashboard." },
      ]},
    ],
  },
  {
    slug: 'payouts-and-fees',
    category: 'payments',
    title: 'Payouts & fees',
    lead: 'Understand how payouts work, when money lands in your account, and what fees apply.',
    level: 'Beginner',
    readMin: 4,
    updatedAt: '2026-06-01T00:00:00Z',
    order: 3,
    body: [
      { type: 'p', text: "Understanding when and how you get paid helps you plan your cash flow. Here's exactly how it works." },
      { type: 'h2', id: 'payout-schedule', text: 'Payout schedule' },
      { type: 'p', text: 'Stripe pays out to your bank account on a rolling basis — typically every 2 business days for established accounts (7 days for new accounts during a short verification period). You can see the next payout date and amount in **Payments → Payouts**.' },
      { type: 'h2', id: 'fee-breakdown', text: 'Fee breakdown' },
      { type: 'p', text: "Every transaction has two layers of fees: Stripe's processing fee (varies by card type and country) and Jimmy's platform fee (2.5% on paid plans, 5% on the Free plan). Both are deducted before the payout." },
      { type: 'callout', tone: 'tip', label: 'Reduce fees on annual plans', text: 'Because Stripe charges a flat fee per transaction plus a percentage, annual plans have a lower effective fee rate than 12 monthly payments — another reason to offer them.' },
      { type: 'faq', items: [
        { q: 'Can I see a breakdown of fees per transaction?', a: 'Yes — every transaction in **Payments → Transactions** shows the gross amount, Stripe fee, Jimmy fee and net payout.' },
        { q: 'Are refunds possible?', a: "Yes — you can issue a full or partial refund from any transaction. Stripe's processing fee is not returned, but Jimmy's platform fee is." },
      ]},
    ],
  },
  /* ── Retention ────────────────────────────────────────── */
  {
    slug: '7-day-onboarding-flow',
    category: 'retention',
    title: '7-day onboarding flow',
    lead: 'A proven 7-day email and notification sequence to convert new clients into long-term members.',
    level: 'Intermediate',
    readMin: 7,
    updatedAt: '2026-06-01T00:00:00Z',
    order: 1,
    body: [
      { type: 'p', text: "The first 7 days after a client joins are the highest-risk period for drop-off. A structured onboarding sequence dramatically increases the chance they complete their first training block and stick around." },
      { type: 'h2', id: 'the-sequence', text: 'The 7-day sequence' },
      { type: 'p', text: "Jimmy's onboarding automations let you define a sequence of messages triggered by the client's join date. Here's the sequence that converts best based on data across thousands of coaches:" },
      { type: 'check', items: [
        'Day 0 (join) — Welcome message + link to their first session.',
        'Day 1 — "How was session one?" push notification.',
        'Day 3 — Tip on using the app (logging sets, checking feedback).',
        'Day 5 — Progress check-in from you (manual or automated).',
        "Day 7 — \"You've completed your first week!\" celebration post.",
      ]},
      { type: 'h2', id: 'set-it-up', text: 'Set it up in Jimmy' },
      { type: 'p', text: "Go to **Settings → Automations → Onboarding**. You'll find the default 7-day sequence pre-loaded. Edit the message copy to match your voice, toggle each step on or off, and save. It fires automatically for every new client from that point." },
      { type: 'callout', tone: 'success', label: 'Coaches who run this sequence', text: 'See a 34% higher 30-day retention rate compared to those who rely on manual check-ins. Set it up once and it runs forever.' },
      { type: 'faq', items: [
        { q: 'Can I customise the sequence per plan?', a: "Yes — go to a specific plan in Payments → Plans and attach a custom onboarding sequence. Clients who join on that plan get the custom sequence instead of the default." },
        { q: "What if a client doesn't open the app at all in the first week?", a: 'Jimmy detects 72-hour inactivity and can trigger an escalation notification — a push notification with a different angle. Enable it in the sequence settings.' },
      ]},
    ],
  },
  {
    slug: 'spotting-churn-early',
    category: 'retention',
    title: 'Spotting churn early',
    lead: "Use Jimmy's engagement signals to identify at-risk clients before they cancel and re-engage them.",
    level: 'Advanced',
    readMin: 6,
    updatedAt: '2026-06-01T00:00:00Z',
    order: 2,
    body: [
      { type: 'p', text: "Most client churn is predictable. Jimmy tracks a set of engagement signals and flags clients who show early signs of disengagement — giving you a window to intervene before they cancel." },
      { type: 'h2', id: 'churn-signals', text: 'The key churn signals' },
      { type: 'p', text: 'Jimmy monitors three primary signals for each client: app session frequency (opens per week), workout completion rate (sessions logged vs. scheduled), and message response rate (replies to your messages). A drop across two or more signals is a strong early warning.' },
      { type: 'h2', id: 'the-at-risk-list', text: 'The at-risk list' },
      { type: 'p', text: 'Go to **Clients → At risk**. Jimmy ranks clients by a composite engagement score — the lowest scores are at the top. Each card shows what triggered the flag and suggests a next action.' },
      { type: 'callout', tone: 'warn', label: 'Act within 48 hours', text: 'The window to re-engage a churning client is short. Data shows that personalised outreach within 48 hours of a flag has a 3× higher success rate than waiting a week.' },
      { type: 'check', items: [
        'Send a personalised direct message — not an automated broadcast.',
        "Offer a call to understand what's going on.",
        'Adjust the programme or goals if the client feels overwhelmed.',
        'Consider a short pause option rather than a full cancel.',
      ]},
      { type: 'faq', items: [
        { q: 'Can I set up automatic alerts for at-risk clients?', a: "Yes — in Settings → Notifications, enable \"At-risk client alerts\". You'll get a daily digest of newly flagged clients straight to your email." },
        { q: 'How is the engagement score calculated?', a: 'The score weights recency more heavily than frequency — a client who was very active last month but silent this week scores lower than a consistently moderate-activity client.' },
      ]},
    ],
  },
]

// ── Convert to Sanity documents ────────────────────────────────────────
const docs = GUIDES_RAW.map((g) => ({
  _id: `guide-${g.slug}`,
  _type: 'guide',
  title: g.title,
  slug: { _type: 'slug', current: g.slug },
  category: g.category,
  level: g.level,
  readMin: g.readMin,
  updatedAt: g.updatedAt,
  lead: g.lead,
  popular: POPULAR_GUIDE_SLUGS.has(g.slug),
  order: g.order,
  body: toPT(g.body),
}))

// ── Mutate ─────────────────────────────────────────────────────────────
async function mutate(documents) {
  const res = await fetch(
    `https://${PROJECT}.api.${'sanity.io'}/${API}/data/mutate/${DATASET}?returnIds=true`,
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
console.log(`✓ guides: ${result.results.length}`)
console.log('done')
