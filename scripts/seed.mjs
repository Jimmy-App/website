/**
 * Seed Sanity (rpeljbjz) with homePage / navigation / footer / siteSettings
 * documents for each locale, derived from messages/{en,fr,es}.json.
 *
 * Run: set -a; . ./.env.local; set +a; node scripts/seed.mjs
 *
 * Transformation rules (messages → schema) are documented inline. The script is
 * idempotent: it uses deterministic _ids (`<type>-<locale>`) + createOrReplace.
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { createClient } from '@sanity/client'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

const LOCALES = ['en', 'fr', 'es']

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN
if (!projectId || !token) {
  console.error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_TOKEN env')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: process.env.SANITY_API_VERSION || '2024-02-01',
  token,
  useCdn: false,
})

// ── helpers ──────────────────────────────────────────────────────────────────
let keySeq = 0
const k = () => `k${(keySeq++).toString(36)}`

/** Split "lead <accent>X</accent> tail" → { prefix, accent, suffix }. Accepts <accent> or <em>. */
function splitAccent(str, tag = 'accent') {
  const re = new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`)
  const m = str.match(re)
  if (!m) return { prefix: str, accent: '', suffix: '' }
  return {
    prefix: str.slice(0, m.index),
    accent: m[1],
    suffix: str.slice(m.index + m[0].length),
  }
}

/** Convert a string with <em>/<b> inline tags into a single Portable Text block. */
function toPortableText(html) {
  const children = []
  const re = /<(em|b)>([\s\S]*?)<\/\1>/g
  let last = 0
  let m
  while ((m = re.exec(html)) !== null) {
    if (m.index > last) {
      children.push({ _type: 'span', _key: k(), text: html.slice(last, m.index), marks: [] })
    }
    const mark = m[1] === 'b' ? 'strong' : 'em'
    children.push({ _type: 'span', _key: k(), text: m[2], marks: [mark] })
    last = m.index + m[0].length
  }
  if (last < html.length) {
    children.push({ _type: 'span', _key: k(), text: html.slice(last), marks: [] })
  }
  return [{ _type: 'block', _key: k(), style: 'normal', markDefs: [], children }]
}

const withKeys = (arr) => arr.map((o) => ({ _key: k(), ...o }))

// Price tiers are locale-independent (from Pricing.tsx).
const TIERS = [
  { clients: '3' },
  { clients: '10', priceEur: 29, priceUsd: 32 },
  { clients: '25', priceEur: 49, priceUsd: 54 },
  { clients: '50', priceEur: 79, priceUsd: 86 },
  { clients: '100', priceEur: 99, priceUsd: 108 },
  { clients: '200', priceEur: 149, priceUsd: 162 },
]

const COACH_KEYS = ['workoutBuilder', 'programs', 'communityFeed', 'messaging', 'payments', 'progressTracking']
const MEMBER_KEYS = ['brandedApp', 'dailyWorkouts', 'community', 'directAccess', 'progressView', 'easyPayments']
const RESOURCE_KEYS = ['blog', 'guides', 'changelog', 'productUpdates', 'roadmap', 'discord']

// ── builders ─────────────────────────────────────────────────────────────────
function buildHomePage(m, locale) {
  const heroHl = splitAccent(m.hero.headline)
  const featTitle = splitAccent(m.features.title)
  const stepsTitle = splitAccent(m.steps.title)
  const techHl = splitAccent(m.tech.headline, 'em')
  const betaTitleParts = m.beta.title.split('<br></br>')
  const betaLine2 = splitAccent(betaTitleParts[1] ?? '')
  const manLine2 = splitAccent(m.manifesto.headlineLine2, 'em')
  const manMantra = splitAccent(m.manifesto.mantra, 'em')
  const finalTrust = splitAccent(m.finalCta.trustText, 'b')

  const tabKeys = Object.keys(m.features.tabs)
  const platformKeys = Object.keys(m.platform.steps)

  return {
    _id: `homePage-${locale}`,
    _type: 'homePage',
    language: locale,
    title: `Home (${locale})`,

    hero: {
      sectionLabel: m.hero.sectionLabel,
      badge: m.hero.badge,
      headlinePrefix: heroHl.prefix,
      headlineAccent: heroHl.accent,
      subtitle: m.hero.subtitle,
      description: m.hero.description,
      ctaPrimary: m.hero.ctaPrimary,
      ctaSecondary: m.hero.ctaSecondary,
      trustTrial: m.hero.trustTrial,
      trustNoCard: m.hero.trustNoCard,
      trustFreeClients: m.hero.trustFreeClients,
      calloutSkool: m.hero.calloutSkool,
      calloutWhatsapp: m.hero.calloutWhatsapp,
      calloutTrainheroic: m.hero.calloutTrainheroic,
      productLabel: m.hero.productLabel,
      productSubtext: m.hero.productSubtext,
      productImageAlt: m.hero.productImageAlt,
      brandNote: m.hero.brandNote,
    },

    features: {
      ariaLabel: m.features.ariaLabel,
      eyebrow: m.features.eyebrow,
      titlePrefix: featTitle.prefix,
      titleAccent: featTitle.accent,
      titleSuffix: featTitle.suffix,
      tablistLabel: m.features.tablistLabel,
      cta: m.features.cta,
      tabs: tabKeys.map((id) => ({
        _key: k(),
        _type: 'featureTab',
        id,
        label: m.features.tabs[id].label,
        title: m.features.tabs[id].title,
        subtitle: m.features.tabs[id].subtitle,
        tags: m.features.tabs[id].tags,
      })),
    },

    why: {
      ariaLabel: m.why.ariaLabel,
      heading: { ...m.why.heading },
      toggle: { ...m.why.toggle },
      desc: { ...m.why.desc },
      bullets: { without: m.why.bullets.without, with: m.why.bullets.with },
      preview: {
        without: {
          card1: { ...m.why.preview.without.card1 },
          card2: { ...m.why.preview.without.card2 },
          card3: { ...m.why.preview.without.card3 },
          card4: { ...m.why.preview.without.card4 },
        },
        with: { imgAlt: m.why.preview.with.imgAlt },
      },
    },

    steps: {
      sectionLabel: m.steps.sectionLabel,
      eyebrow: m.steps.eyebrow,
      titlePrefix: stepsTitle.prefix,
      titleAccent: stepsTitle.accent,
      subtitle: m.steps.subtitle,
      step1: { ...m.steps.step1 },
      step2: { ...m.steps.step2 },
      step3: { ...m.steps.step3 },
      cta: m.steps.cta,
    },

    platform: {
      ariaLabel: m.platform.ariaLabel,
      eyebrow: m.platform.eyebrow,
      title: m.platform.title,
      subtitle: m.platform.subtitle,
      navLabel: m.platform.navLabel,
      steps: platformKeys.map((id) => ({
        _key: k(),
        _type: 'platformStep',
        id,
        name: m.platform.steps[id].name,
        tagline: m.platform.steps[id].tagline,
        tags: m.platform.steps[id].tags,
        preview: { ...m.platform.steps[id].preview },
      })),
    },

    tech: {
      sectionLabel: m.tech.sectionLabel,
      eyebrow: m.tech.eyebrow,
      headlineLead: techHl.prefix,
      headlineAccent: techHl.accent,
      body: m.tech.body,
      tile1Title: m.tech.tile1Title,
      tile1Desc: m.tech.tile1Desc,
      tile2Title: m.tech.tile2Title,
      tile2Desc: m.tech.tile2Desc,
      tile3Title: m.tech.tile3Title,
      tile3Desc: m.tech.tile3Desc,
      appStoreLabel: m.tech.appStoreLabel,
      appStoreSub: m.tech.appStoreSub,
      appStoreMain: m.tech.appStoreMain,
      playStoreLabel: m.tech.playStoreLabel,
      playStoreSub: m.tech.playStoreSub,
      playStoreMain: m.tech.playStoreMain,
      visualAlt: m.tech.visualAlt,
    },

    comparison: {
      ariaLabel: m.comparison.ariaLabel,
      eyebrow: m.comparison.eyebrow,
      title: m.comparison.title,
      subtitle: m.comparison.subtitle,
      tableAriaLabel: m.comparison.tableAriaLabel,
      featureColumnLabel: m.comparison.featureColumnLabel,
      jimmyBadge: m.comparison.jimmyBadge,
      competitors: m.comparison.competitors,
      features: m.comparison.features,
      footerLabel: m.comparison.footerLabel,
    },

    pricing: {
      sectionLabel: m.pricing.sectionLabel,
      promoBadge: m.pricing.promoBadge,
      promoTextBold: m.pricing.promoTextBold,
      promoTextRest: m.pricing.promoTextRest,
      eyebrow: m.pricing.eyebrow,
      title: m.pricing.title,
      subtitle: m.pricing.subtitle,
      sliderQuestion: m.pricing.sliderQuestion,
      sliderHelp: m.pricing.sliderHelp,
      currencyLabel: m.pricing.currencyLabel,
      sliderAriaLabel: m.pricing.sliderAriaLabel,
      clients: m.pricing.clients,
      planFree: m.pricing.planFree,
      planClub: m.pricing.planClub,
      betaBadge: m.pricing.betaBadge,
      perMonth: m.pricing.perMonth,
      forUpTo: m.pricing.forUpTo,
      feesLabel: m.pricing.feesLabel,
      ctaFree: m.pricing.ctaFree,
      ctaClub: m.pricing.ctaClub,
      lockNote: m.pricing.lockNote,
      whatsIncluded: m.pricing.whatsIncluded,
      freeTag: m.pricing.freeTag,
      clubTag: m.pricing.clubTag,
      freeFeatures: [1, 2, 3, 4, 5, 6].map((i) => m.pricing[`freeFeature${i}`]),
      clubFeatures: [1, 2, 3, 4, 5, 6, 7, 8].map((i) => m.pricing[`clubFeature${i}`]),
      addonsLabel: m.pricing.addons,
      addons: [1, 2, 3].map((i) => ({
        _key: k(),
        _type: 'pricingAddon',
        name: m.pricing[`addon${i}Name`],
        price: m.pricing[`addon${i}Price`],
      })),
      tiers: TIERS.map((t) => ({ _key: k(), _type: 'pricingTier', ...t })),
    },

    beta: {
      ariaLabel: m.beta.ariaLabel,
      badge: m.beta.badge,
      titleLine1: betaTitleParts[0],
      titleLine2Prefix: betaLine2.prefix,
      titleLine2Accent: betaLine2.accent,
      titleLine2Suffix: betaLine2.suffix,
      body: toPortableText(m.beta.body),
      card1: { ...m.beta.card1 },
      card2: { ...m.beta.card2 },
      card3: { ...m.beta.card3 },
    },

    team: {
      sectionLabel: m.team.sectionLabel,
      eyebrow: m.team.eyebrow,
      title: m.team.title,
      subtitle: m.team.subtitle,
      members: m.team.members.map((mem) => ({ _key: k(), _type: 'teamMember', ...mem })),
      stats: m.team.stats.map((s) => ({ _key: k(), _type: 'teamStat', ...s })),
    },

    faq: {
      sectionLabel: m.faq.sectionLabel,
      eyebrow: m.faq.eyebrow,
      title: m.faq.title,
      items: m.faq.items.map((it) => ({ _key: k(), _type: 'faqItem', ...it })),
      footNote: m.faq.footNote,
      footLink: m.faq.footLink,
    },

    manifesto: {
      sectionLabel: m.manifesto.sectionLabel,
      label: m.manifesto.label,
      headlineLine1: m.manifesto.headlineLine1,
      headlineLine2Prefix: manLine2.prefix,
      headlineLine2Accent: manLine2.accent,
      headlineLine3: m.manifesto.headlineLine3,
      body: toPortableText(m.manifesto.body),
      mantraEmphasis: manMantra.accent,
      mantraRest: manMantra.suffix,
    },

    finalCta: {
      sectionLabel: m.finalCta.sectionLabel,
      headlinePrefix: m.finalCta.headlinePrefix,
      headlineAccent: m.finalCta.headlineAccent,
      headlineSuffix: m.finalCta.headlineSuffix,
      headlineLine2: m.finalCta.headlineLine2,
      subtitle: m.finalCta.subtitle,
      ctaPrimary: m.finalCta.ctaPrimary,
      ctaSecondary: m.finalCta.ctaSecondary,
      socialProof: m.finalCta.socialProof,
      tags: m.finalCta.tags,
      trustPrefix: finalTrust.prefix,
      trustBold: finalTrust.accent,
      trustSuffix: finalTrust.suffix,
    },
  }
}

function buildNavigation(m, locale) {
  const megaItem = (key) => ({
    _key: k(),
    _type: 'navMegaItem',
    key,
    title: m.nav.features.items[key]?.title ?? m.nav.resources.items[key]?.title,
    subtitle: m.nav.features.items[key]?.subtitle ?? m.nav.resources.items[key]?.subtitle,
    href: '#',
  })
  return {
    _id: `navigation-${locale}`,
    _type: 'navigation',
    language: locale,
    featuresLabel: m.nav.features.label,
    featuresForCoaches: m.nav.features.forCoaches,
    featuresForMembers: m.nav.features.forMembers,
    featuresItems: [...COACH_KEYS, ...MEMBER_KEYS].map(megaItem),
    featuresCta: { ...m.nav.features.cta },
    resourcesLabel: m.nav.resources.label,
    resourcesContent: m.nav.resources.content,
    resourcesCommunity: m.nav.resources.community,
    resourcesItems: RESOURCE_KEYS.map(megaItem),
    pricing: m.nav.pricing,
    affiliate: m.nav.affiliate,
    newBadge: m.nav.newBadge,
    login: m.nav.login,
    getStarted: m.nav.getStarted,
    getStartedShort: m.nav.getStartedShort,
    openMenu: m.nav.openMenu,
    close: m.nav.close,
    menu: m.nav.menu,
  }
}

function buildFooter(m, locale) {
  const tagline = splitAccent(m.footer.tagline, 'em')
  const links = (obj) => withKeys(Object.values(obj).map((label) => ({ _type: 'navItem', label, href: '#', external: false })))
  return {
    _id: `footer-${locale}`,
    _type: 'footer',
    language: locale,
    taglinePrefix: tagline.prefix,
    taglineEmphasis: tagline.accent,
    productHeading: m.footer.product.heading,
    productLinks: links(m.footer.product.links),
    companyHeading: m.footer.company.heading,
    companyLinks: links(m.footer.company.links),
    legalHeading: m.footer.legal.heading,
    legalLinks: links(m.footer.legal.links),
    copy: m.footer.copy,
  }
}

function buildSiteSettings(m, locale) {
  return {
    _id: `siteSettings-${locale}`,
    _type: 'siteSettings',
    language: locale,
    siteName: 'Jimmy',
    siteDescription: m.hero.description,
    seo: {
      _type: 'seo',
      title: `Jimmy — ${m.hero.subtitle}`,
      description: m.hero.description,
    },
  }
}

// ── run ──────────────────────────────────────────────────────────────────────
async function run() {
  const docs = []
  for (const locale of LOCALES) {
    const m = JSON.parse(readFileSync(join(root, 'messages', `${locale}.json`), 'utf8'))
    docs.push(buildHomePage(m, locale))
    docs.push(buildNavigation(m, locale))
    docs.push(buildFooter(m, locale))
    docs.push(buildSiteSettings(m, locale))
  }

  let tx = client.transaction()
  for (const doc of docs) tx = tx.createOrReplace(doc)
  const res = await tx.commit()
  console.log(`✔ Seeded ${docs.length} documents:`)
  for (const d of docs) console.log(`  - ${d._id}`)
  console.log(`transactionId: ${res.transactionId}`)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
