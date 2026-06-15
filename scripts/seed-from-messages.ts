/**
 * Seed Sanity CMS from messages/{en,fr,es}.json
 *
 * Usage: npx tsx scripts/seed-from-messages.ts
 *
 * Requirements:
 *   - NEXT_PUBLIC_SANITY_PROJECT_ID
 *   - NEXT_PUBLIC_SANITY_DATASET (default: production)
 *   - SANITY_API_TOKEN   (write token)
 *   - SANITY_API_VERSION (default: 2024-02-01)
 *   loaded from .env.local
 */

import { readFileSync } from 'fs'
import { resolve, join } from 'path'
import { createClient } from '@sanity/client'

// ── Load .env.local ───────────────────────────────────────────────────────────

function loadEnv() {
  const envPath = resolve(process.cwd(), '.env.local')
  try {
    const content = readFileSync(envPath, 'utf-8')
    for (const line of content.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const idx = trimmed.indexOf('=')
      if (idx === -1) continue
      const key = trimmed.slice(0, idx).trim()
      const val = trimmed.slice(idx + 1).trim()
      if (key && !(key in process.env)) {
        process.env[key] = val
      }
    }
  } catch {
    console.warn('Warning: could not read .env.local')
  }
}

loadEnv()

// ── Env validation ────────────────────────────────────────────────────────────

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = process.env.SANITY_API_VERSION || '2024-02-01'
const token = process.env.SANITY_API_TOKEN

if (!projectId || projectId === 'REPLACE_ME' || projectId === 'placeholder') {
  console.error('ERROR: NEXT_PUBLIC_SANITY_PROJECT_ID is not set or is a placeholder.')
  console.error('Please set the real Sanity project ID in .env.local before seeding.')
  process.exit(1)
}

if (!token) {
  console.error('ERROR: SANITY_API_TOKEN is not set.')
  console.error('Please add a write-capable API token to .env.local:')
  console.error('  SANITY_API_TOKEN=your_write_token_here')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
})

// ── Types ─────────────────────────────────────────────────────────────────────

type Lang = 'en' | 'fr' | 'es'
type Messages = Record<string, unknown>

// ── Helpers ───────────────────────────────────────────────────────────────────

function loadMessages(lang: Lang): Messages {
  const path = join(process.cwd(), 'messages', `${lang}.json`)
  return JSON.parse(readFileSync(path, 'utf-8'))
}

function get<T>(obj: Messages, ...keys: string[]): T {
  let current: unknown = obj
  for (const key of keys) {
    if (typeof current !== 'object' || current === null) return undefined as T
    current = (current as Record<string, unknown>)[key]
  }
  return current as T
}

/**
 * Convert an HTML-tagged string like "foo <b>bar</b> baz" or
 * "foo <em>bar</em> baz" into a valid Sanity Portable Text block array.
 * Only supports a single paragraph with inline bold/em marks.
 */
function toPortableText(raw: string, decorator: 'strong' | 'em'): object[] {
  // Strip the surrounding whitespace
  const text = raw.trim()

  // The marker strings used in messages
  const openTag = decorator === 'strong' ? '<b>' : '<em>'
  const closeTag = decorator === 'strong' ? '</b>' : '</em>'

  const children: object[] = []
  let remaining = text

  while (remaining.length > 0) {
    const start = remaining.indexOf(openTag)
    if (start === -1) {
      // No more markup — rest is plain text
      if (remaining.length > 0) {
        children.push({ _type: 'span', _key: `s${children.length}`, text: remaining, marks: [] })
      }
      break
    }
    // Plain text before the tag
    if (start > 0) {
      children.push({ _type: 'span', _key: `s${children.length}`, text: remaining.slice(0, start), marks: [] })
    }
    const end = remaining.indexOf(closeTag, start + openTag.length)
    if (end === -1) {
      // Unclosed tag — treat rest as plain
      children.push({ _type: 'span', _key: `s${children.length}`, text: remaining.slice(start), marks: [] })
      break
    }
    const marked = remaining.slice(start + openTag.length, end)
    children.push({ _type: 'span', _key: `s${children.length}`, text: marked, marks: [decorator] })
    remaining = remaining.slice(end + closeTag.length)
  }

  return [
    {
      _type: 'block',
      _key: 'block0',
      style: 'normal',
      markDefs: [],
      children,
    },
  ]
}

/**
 * Split "headline" string at <accent> or <em> markup boundary into prefix + accent.
 * e.g. "The Skool of <accent>Fitness.</accent>" → {prefix: "The Skool of ", accent: "Fitness."}
 */
function splitAccent(raw: string): { prefix: string; accent: string; suffix: string } {
  const match = raw.match(/^([\s\S]*?)<accent>([\s\S]*?)<\/accent>([\s\S]*)$/)
  if (match) {
    return { prefix: match[1], accent: match[2], suffix: match[3] }
  }
  return { prefix: raw, accent: '', suffix: '' }
}

/**
 * Split "<em>text</em> rest" → {emphasis: "text", rest: " rest"}
 */
function splitEm(raw: string): { emphasis: string; rest: string } {
  const match = raw.match(/^<em>([\s\S]*?)<\/em>([\s\S]*)$/)
  if (match) {
    return { emphasis: match[1], rest: match[2] }
  }
  return { emphasis: '', rest: raw }
}

/**
 * Split "prefix <em>accent</em> suffix" → {prefix, accent, suffix}
 */
function splitEmFull(raw: string): { prefix: string; accent: string; suffix: string } {
  const match = raw.match(/^([\s\S]*?)<em>([\s\S]*?)<\/em>([\s\S]*)$/)
  if (match) {
    return { prefix: match[1], accent: match[2], suffix: match[3] }
  }
  return { prefix: raw, accent: '', suffix: '' }
}

// ── Document builders ─────────────────────────────────────────────────────────

function buildHomePage(lang: Lang, m: Messages): object {
  const nav = get<Messages>(m, 'nav') ?? {}
  const hero = get<Messages>(m, 'hero') ?? {}
  const features = get<Messages>(m, 'features') ?? {}
  const featTabs = get<Messages>(m, 'features', 'tabs') ?? {}
  const why = get<Messages>(m, 'why') ?? {}
  const steps = get<Messages>(m, 'steps') ?? {}
  const platform = get<Messages>(m, 'platform') ?? {}
  const platSteps = get<Messages>(m, 'platform', 'steps') ?? {}
  const tech = get<Messages>(m, 'tech') ?? {}
  const comparison = get<Messages>(m, 'comparison') ?? {}
  const pricing = get<Messages>(m, 'pricing') ?? {}
  const beta = get<Messages>(m, 'beta') ?? {}
  const team = get<Messages>(m, 'team') ?? {}
  const faq = get<Messages>(m, 'faq') ?? {}
  const manifesto = get<Messages>(m, 'manifesto') ?? {}
  const finalCta = get<Messages>(m, 'finalCta') ?? {}

  // Hero headline split: "The Skool of <accent>Fitness.</accent>"
  const heroHeadlineRaw = get<string>(hero, 'headline') ?? ''
  const heroHeadlineSplit = splitAccent(heroHeadlineRaw)

  // Features title split: "One platform. <accent>Everything</accent> your coaching needs."
  const featuresTitleRaw = get<string>(features, 'title') ?? ''
  const featuresTitleSplit = splitAccent(featuresTitleRaw)

  // Steps title split: "Launch your premium coaching <accent>in 3 steps.</accent>"
  const stepsTitleRaw = get<string>(steps, 'title') ?? ''
  const stepsTitleSplit = splitAccent(stepsTitleRaw)

  // Tech headline split: "Not a hacked-together app. <em>A truly native one.</em>"
  const techHeadlineRaw = get<string>(tech, 'headline') ?? ''
  const techHeadlineSplit = splitEmFull(techHeadlineRaw)

  // Beta title split:
  // "You're not buying a product.<br></br>You're <accent>co-building</accent> a platform."
  // Note: <br></br> is the line break separator
  const betaTitleRaw = get<string>(beta, 'title') ?? ''
  const betaTitleLines = betaTitleRaw.split('<br></br>')
  const betaLine1 = (betaTitleLines[0] ?? '').trim()
  const betaLine2Raw = (betaTitleLines[1] ?? '').trim()
  // betaLine2Raw: "You're <accent>co-building</accent> a platform."
  const betaLine2Split = splitAccent(betaLine2Raw)

  // Beta body: Portable Text with <em> marks
  const betaBodyRaw = get<string>(beta, 'body') ?? ''
  const betaBody = toPortableText(betaBodyRaw, 'em')

  // Manifesto headline line2 split: "Jimmy creates an <em>experience.</em>"
  const manifestoLine2Raw = get<string>(manifesto, 'headlineLine2') ?? ''
  const manifestoLine2Split = splitEmFull(manifestoLine2Raw)

  // Manifesto body: Portable Text with <b> marks
  const manifestoBodyRaw = get<string>(manifesto, 'body') ?? ''
  const manifestoBody = toPortableText(manifestoBodyRaw, 'strong')

  // Manifesto mantra: "<em>Less is more.</em> Built to belong."
  const mantraRaw = get<string>(manifesto, 'mantra') ?? ''
  const mantraSplit = splitEm(mantraRaw)

  // FinalCta trustText: "No commitment · No credit card · <b>-15% for life</b> for beta coaches"
  const trustRaw = get<string>(finalCta, 'trustText') ?? ''
  // Split at <b>
  const trustBMatch = trustRaw.match(/^([\s\S]*?)<b>([\s\S]*?)<\/b>([\s\S]*)$/)
  const trustPrefix = trustBMatch ? trustBMatch[1] : trustRaw
  const trustBold = trustBMatch ? trustBMatch[2] : ''
  const trustSuffix = trustBMatch ? trustBMatch[3] : ''

  // Feature tabs array
  const TAB_IDS = ['workout', 'community', 'messaging', 'payments', 'courses'] as const
  const featureTabsArr = TAB_IDS.map((id, idx) => {
    const tab = get<Messages>(featTabs, id) ?? {}
    return {
      _type: 'featureTab',
      _key: `tab_${id}`,
      id,
      label: get<string>(tab, 'label') ?? '',
      title: get<string>(tab, 'title') ?? '',
      subtitle: get<string>(tab, 'subtitle') ?? '',
      tags: (get<string[]>(tab, 'tags') ?? []).map((t, i) => ({ _type: 'string', _key: `t${i}`, _value: t })),
    }
  })

  // Platform steps array
  const PLAT_IDS = ['workout', 'community', 'messaging', 'payments', 'courses'] as const
  const platformStepsArr = PLAT_IDS.map((id) => {
    const step = get<Messages>(platSteps, id) ?? {}
    const preview = get<Messages>(step, 'preview') ?? {}
    return {
      _type: 'platformStep',
      _key: `ps_${id}`,
      id,
      name: get<string>(step, 'name') ?? '',
      tagline: get<string>(step, 'tagline') ?? '',
      tags: (get<string[]>(step, 'tags') ?? []).map((t, i) => ({ _type: 'string', _key: `t${i}`, _value: t })),
      preview: {
        barTitle: get<string>(preview, 'barTitle') ?? '',
        barChip: get<string>(preview, 'barChip') ?? '',
      },
    }
  })

  // Pricing tiers (clients, priceEur, priceUsd)
  const CLIENTS = ['3', '10', '25', '50', '100', '200']
  const PRICES_EUR = [null, 29, 49, 79, 99, 149]
  const PRICES_USD = [null, 32, 54, 86, 108, 162]
  const pricingTiersArr = CLIENTS.map((clients, i) => ({
    _type: 'pricingTier',
    _key: `tier_${clients}`,
    clients,
    priceEur: PRICES_EUR[i] ?? undefined,
    priceUsd: PRICES_USD[i] ?? undefined,
  }))

  // Pricing addons
  const pricingAddons = [
    {
      _type: 'pricingAddon',
      _key: 'addon1',
      name: get<string>(pricing, 'addon1Name') ?? '',
      price: get<string>(pricing, 'addon1Price') ?? '',
    },
    {
      _type: 'pricingAddon',
      _key: 'addon2',
      name: get<string>(pricing, 'addon2Name') ?? '',
      price: get<string>(pricing, 'addon2Price') ?? '',
    },
    {
      _type: 'pricingAddon',
      _key: 'addon3',
      name: get<string>(pricing, 'addon3Name') ?? '',
      price: get<string>(pricing, 'addon3Price') ?? '',
    },
  ]

  // Pricing free features
  const pricingFreeFeatures = ['freeFeature1','freeFeature2','freeFeature3','freeFeature4','freeFeature5','freeFeature6'].map(
    (k) => get<string>(pricing, k) ?? ''
  )

  // Pricing club features
  const pricingClubFeatures = ['clubFeature1','clubFeature2','clubFeature3','clubFeature4','clubFeature5','clubFeature6','clubFeature7','clubFeature8'].map(
    (k) => get<string>(pricing, k) ?? ''
  )

  // Team members
  const teamMembers = (get<object[]>(team, 'members') ?? []).map((member, i) => {
    const m2 = member as Messages
    return {
      _type: 'teamMember',
      _key: `tm_${i}`,
      name: get<string>(m2, 'name') ?? '',
      role: get<string>(m2, 'role') ?? '',
      bio: get<string>(m2, 'bio') ?? '',
      location: get<string>(m2, 'location') ?? '',
    }
  })

  // Team stats
  const teamStats = (get<object[]>(team, 'stats') ?? []).map((stat, i) => {
    const s = stat as Messages
    return {
      _type: 'teamStat',
      _key: `ts_${i}`,
      num: get<string>(s, 'num') ?? '',
      heading: get<string>(s, 'heading') ?? '',
      body: get<string>(s, 'body') ?? '',
    }
  })

  // FAQ items
  const faqItems = (get<object[]>(faq, 'items') ?? []).map((item, i) => {
    const fi = item as Messages
    return {
      _type: 'faqItem',
      _key: `faq_${i}`,
      question: get<string>(fi, 'question') ?? '',
      answer: get<string>(fi, 'answer') ?? '',
    }
  })

  // Why bullets
  const whyBulletsWithout = (get<string[]>(why, 'bullets', 'without') ?? [])
  const whyBulletsWith = (get<string[]>(why, 'bullets', 'with') ?? [])

  // FinalCta tags
  const finalCtaTags = (get<string[]>(finalCta, 'tags') ?? [])

  return {
    _id: `homePage-${lang}`,
    _type: 'homePage',
    language: lang,
    title: `Home Page (${lang.toUpperCase()})`,

    hero: {
      sectionLabel: get<string>(hero, 'sectionLabel') ?? '',
      badge: get<string>(hero, 'badge') ?? '',
      headlinePrefix: heroHeadlineSplit.prefix,
      headlineAccent: heroHeadlineSplit.accent,
      subtitle: get<string>(hero, 'subtitle') ?? '',
      description: get<string>(hero, 'description') ?? '',
      ctaPrimary: get<string>(hero, 'ctaPrimary') ?? '',
      ctaSecondary: get<string>(hero, 'ctaSecondary') ?? '',
      trustTrial: get<string>(hero, 'trustTrial') ?? '',
      trustNoCard: get<string>(hero, 'trustNoCard') ?? '',
      trustFreeClients: get<string>(hero, 'trustFreeClients') ?? '',
      calloutSkool: get<string>(hero, 'calloutSkool') ?? '',
      calloutWhatsapp: get<string>(hero, 'calloutWhatsapp') ?? '',
      calloutTrainheroic: get<string>(hero, 'calloutTrainheroic') ?? '',
      productLabel: get<string>(hero, 'productLabel') ?? '',
      productSubtext: get<string>(hero, 'productSubtext') ?? '',
      productImageAlt: get<string>(hero, 'productImageAlt') ?? '',
      brandNote: get<string>(hero, 'brandNote') ?? '',
    },

    features: {
      ariaLabel: get<string>(features, 'ariaLabel') ?? '',
      eyebrow: get<string>(features, 'eyebrow') ?? '',
      titlePrefix: featuresTitleSplit.prefix,
      titleAccent: featuresTitleSplit.accent,
      titleSuffix: featuresTitleSplit.suffix,
      tablistLabel: get<string>(features, 'tablistLabel') ?? '',
      cta: get<string>(features, 'cta') ?? '',
      tabs: featureTabsArr,
    },

    why: {
      ariaLabel: get<string>(why, 'ariaLabel') ?? '',
      heading: {
        line1: get<string>(why, 'heading', 'line1') ?? '',
        line2: get<string>(why, 'heading', 'line2') ?? '',
        line3: get<string>(why, 'heading', 'line3') ?? '',
        accent: get<string>(why, 'heading', 'accent') ?? '',
      },
      toggle: {
        ariaLabel: get<string>(why, 'toggle', 'ariaLabel') ?? '',
        without: get<string>(why, 'toggle', 'without') ?? '',
        with: get<string>(why, 'toggle', 'with') ?? '',
      },
      desc: {
        without: get<string>(why, 'desc', 'without') ?? '',
        with: get<string>(why, 'desc', 'with') ?? '',
      },
      bullets: {
        without: whyBulletsWithout,
        with: whyBulletsWith,
      },
      preview: {
        without: {
          card1: {
            name: get<string>(why, 'preview', 'without', 'card1', 'name') ?? '',
            desc: get<string>(why, 'preview', 'without', 'card1', 'desc') ?? '',
          },
          card2: {
            name: get<string>(why, 'preview', 'without', 'card2', 'name') ?? '',
            desc: get<string>(why, 'preview', 'without', 'card2', 'desc') ?? '',
          },
          card3: {
            name: get<string>(why, 'preview', 'without', 'card3', 'name') ?? '',
            desc: get<string>(why, 'preview', 'without', 'card3', 'desc') ?? '',
          },
          card4: {
            name: get<string>(why, 'preview', 'without', 'card4', 'name') ?? '',
            desc: get<string>(why, 'preview', 'without', 'card4', 'desc') ?? '',
          },
        },
        with: {
          imgAlt: get<string>(why, 'preview', 'with', 'imgAlt') ?? '',
        },
      },
    },

    steps: {
      sectionLabel: get<string>(steps, 'sectionLabel') ?? '',
      eyebrow: get<string>(steps, 'eyebrow') ?? '',
      titlePrefix: stepsTitleSplit.prefix,
      titleAccent: stepsTitleSplit.accent,
      subtitle: get<string>(steps, 'subtitle') ?? '',
      step1: {
        title: get<string>(steps, 'step1', 'title') ?? '',
        desc: get<string>(steps, 'step1', 'desc') ?? '',
      },
      step2: {
        title: get<string>(steps, 'step2', 'title') ?? '',
        desc: get<string>(steps, 'step2', 'desc') ?? '',
      },
      step3: {
        title: get<string>(steps, 'step3', 'title') ?? '',
        desc: get<string>(steps, 'step3', 'desc') ?? '',
      },
      cta: get<string>(steps, 'cta') ?? '',
    },

    platform: {
      ariaLabel: get<string>(platform, 'ariaLabel') ?? '',
      eyebrow: get<string>(platform, 'eyebrow') ?? '',
      title: get<string>(platform, 'title') ?? '',
      subtitle: get<string>(platform, 'subtitle') ?? '',
      navLabel: get<string>(platform, 'navLabel') ?? '',
      steps: platformStepsArr,
    },

    tech: {
      sectionLabel: get<string>(tech, 'sectionLabel') ?? '',
      eyebrow: get<string>(tech, 'eyebrow') ?? '',
      headlineLead: techHeadlineSplit.prefix,
      headlineAccent: techHeadlineSplit.accent,
      body: get<string>(tech, 'body') ?? '',
      tile1Title: get<string>(tech, 'tile1Title') ?? '',
      tile1Desc: get<string>(tech, 'tile1Desc') ?? '',
      tile2Title: get<string>(tech, 'tile2Title') ?? '',
      tile2Desc: get<string>(tech, 'tile2Desc') ?? '',
      tile3Title: get<string>(tech, 'tile3Title') ?? '',
      tile3Desc: get<string>(tech, 'tile3Desc') ?? '',
      appStoreLabel: get<string>(tech, 'appStoreLabel') ?? '',
      appStoreSub: get<string>(tech, 'appStoreSub') ?? '',
      appStoreMain: get<string>(tech, 'appStoreMain') ?? '',
      playStoreLabel: get<string>(tech, 'playStoreLabel') ?? '',
      playStoreSub: get<string>(tech, 'playStoreSub') ?? '',
      playStoreMain: get<string>(tech, 'playStoreMain') ?? '',
      visualAlt: get<string>(tech, 'visualAlt') ?? '',
    },

    comparison: {
      ariaLabel: get<string>(comparison, 'ariaLabel') ?? '',
      eyebrow: get<string>(comparison, 'eyebrow') ?? '',
      title: get<string>(comparison, 'title') ?? '',
      subtitle: get<string>(comparison, 'subtitle') ?? '',
      tableAriaLabel: get<string>(comparison, 'tableAriaLabel') ?? '',
      featureColumnLabel: get<string>(comparison, 'featureColumnLabel') ?? '',
      jimmyBadge: get<string>(comparison, 'jimmyBadge') ?? '',
      competitors: get<string[]>(comparison, 'competitors') ?? [],
      features: get<string[]>(comparison, 'features') ?? [],
      footerLabel: get<string>(comparison, 'footerLabel') ?? '',
    },

    pricing: {
      sectionLabel: get<string>(pricing, 'sectionLabel') ?? '',
      promoBadge: get<string>(pricing, 'promoBadge') ?? '',
      promoTextBold: get<string>(pricing, 'promoTextBold') ?? '',
      promoTextRest: get<string>(pricing, 'promoTextRest') ?? '',
      eyebrow: get<string>(pricing, 'eyebrow') ?? '',
      title: get<string>(pricing, 'title') ?? '',
      subtitle: get<string>(pricing, 'subtitle') ?? '',
      sliderQuestion: get<string>(pricing, 'sliderQuestion') ?? '',
      sliderHelp: get<string>(pricing, 'sliderHelp') ?? '',
      currencyLabel: get<string>(pricing, 'currencyLabel') ?? '',
      sliderAriaLabel: get<string>(pricing, 'sliderAriaLabel') ?? '',
      clients: get<string>(pricing, 'clients') ?? '',
      planFree: get<string>(pricing, 'planFree') ?? '',
      planClub: get<string>(pricing, 'planClub') ?? '',
      betaBadge: get<string>(pricing, 'betaBadge') ?? '',
      perMonth: get<string>(pricing, 'perMonth') ?? '',
      forUpTo: get<string>(pricing, 'forUpTo') ?? '',
      feesLabel: get<string>(pricing, 'feesLabel') ?? '',
      ctaFree: get<string>(pricing, 'ctaFree') ?? '',
      ctaClub: get<string>(pricing, 'ctaClub') ?? '',
      lockNote: get<string>(pricing, 'lockNote') ?? '',
      whatsIncluded: get<string>(pricing, 'whatsIncluded') ?? '',
      freeTag: get<string>(pricing, 'freeTag') ?? '',
      clubTag: get<string>(pricing, 'clubTag') ?? '',
      freeFeatures: pricingFreeFeatures,
      clubFeatures: pricingClubFeatures,
      addonsLabel: get<string>(pricing, 'addons') ?? '',
      addons: pricingAddons,
      tiers: pricingTiersArr,
    },

    beta: {
      ariaLabel: get<string>(beta, 'ariaLabel') ?? '',
      badge: get<string>(beta, 'badge') ?? '',
      titleLine1: betaLine1,
      titleLine2Prefix: betaLine2Split.prefix,
      titleLine2Accent: betaLine2Split.accent,
      titleLine2Suffix: betaLine2Split.suffix,
      body: betaBody,
      card1: {
        title: get<string>(beta, 'card1', 'title') ?? '',
        desc: get<string>(beta, 'card1', 'desc') ?? '',
      },
      card2: {
        title: get<string>(beta, 'card2', 'title') ?? '',
        desc: get<string>(beta, 'card2', 'desc') ?? '',
      },
      card3: {
        title: get<string>(beta, 'card3', 'title') ?? '',
        desc: get<string>(beta, 'card3', 'desc') ?? '',
      },
    },

    team: {
      sectionLabel: get<string>(team, 'sectionLabel') ?? '',
      eyebrow: get<string>(team, 'eyebrow') ?? '',
      title: get<string>(team, 'title') ?? '',
      subtitle: get<string>(team, 'subtitle') ?? '',
      members: teamMembers,
      stats: teamStats,
    },

    faq: {
      sectionLabel: get<string>(faq, 'sectionLabel') ?? '',
      eyebrow: get<string>(faq, 'eyebrow') ?? '',
      title: get<string>(faq, 'title') ?? '',
      items: faqItems,
      footNote: get<string>(faq, 'footNote') ?? '',
      footLink: get<string>(faq, 'footLink') ?? '',
    },

    manifesto: {
      sectionLabel: get<string>(manifesto, 'sectionLabel') ?? '',
      label: get<string>(manifesto, 'label') ?? '',
      headlineLine1: get<string>(manifesto, 'headlineLine1') ?? '',
      headlineLine2Prefix: manifestoLine2Split.prefix,
      headlineLine2Accent: manifestoLine2Split.accent,
      headlineLine3: get<string>(manifesto, 'headlineLine3') ?? '',
      body: manifestoBody,
      mantraEmphasis: mantraSplit.emphasis,
      mantraRest: mantraSplit.rest,
    },

    finalCta: {
      sectionLabel: get<string>(finalCta, 'sectionLabel') ?? '',
      headlinePrefix: get<string>(finalCta, 'headlinePrefix') ?? '',
      headlineAccent: get<string>(finalCta, 'headlineAccent') ?? '',
      headlineSuffix: get<string>(finalCta, 'headlineSuffix') ?? '',
      headlineLine2: get<string>(finalCta, 'headlineLine2') ?? '',
      subtitle: get<string>(finalCta, 'subtitle') ?? '',
      ctaPrimary: get<string>(finalCta, 'ctaPrimary') ?? '',
      ctaSecondary: get<string>(finalCta, 'ctaSecondary') ?? '',
      socialProof: get<string>(finalCta, 'socialProof') ?? '',
      tags: finalCtaTags,
      trustPrefix,
      trustBold,
      trustSuffix,
    },
  }
}

function buildNavigation(lang: Lang, m: Messages): object {
  const nav = get<Messages>(m, 'nav') ?? {}
  const features = get<Messages>(nav, 'features') ?? {}
  const featItems = get<Messages>(features, 'items') ?? {}
  const featuresCta = get<Messages>(features, 'cta') ?? {}
  const resources = get<Messages>(nav, 'resources') ?? {}
  const resItems = get<Messages>(resources, 'items') ?? {}

  const coachItems = ['workoutBuilder','programs','communityFeed','messaging','payments','progressTracking']
  const memberItems = ['brandedApp','dailyWorkouts','community','directAccess','progressView','easyPayments']
  const allFeatItems = [...coachItems, ...memberItems]

  const featuresItemsArr = allFeatItems.map((key) => {
    const item = get<Messages>(featItems, key) ?? {}
    return {
      _type: 'navMegaItem',
      _key: key,
      key,
      title: get<string>(item, 'title') ?? '',
      subtitle: get<string>(item, 'subtitle') ?? '',
      href: `#${key}`,
    }
  })

  const resItemKeys = ['blog','guides','changelog','productUpdates','roadmap','discord']
  const resourcesItemsArr = resItemKeys.map((key) => {
    const item = get<Messages>(resItems, key) ?? {}
    return {
      _type: 'navMegaItem',
      _key: key,
      key,
      title: get<string>(item, 'title') ?? '',
      subtitle: get<string>(item, 'subtitle') ?? '',
      href: `#${key}`,
    }
  })

  return {
    _id: `navigation-${lang}`,
    _type: 'navigation',
    language: lang,
    featuresLabel: get<string>(features, 'label') ?? '',
    featuresForCoaches: get<string>(features, 'forCoaches') ?? '',
    featuresForMembers: get<string>(features, 'forMembers') ?? '',
    featuresItems: featuresItemsArr,
    featuresCta: {
      label: get<string>(featuresCta, 'label') ?? '',
      title: get<string>(featuresCta, 'title') ?? '',
      body: get<string>(featuresCta, 'body') ?? '',
      btn: get<string>(featuresCta, 'btn') ?? '',
    },
    resourcesLabel: get<string>(resources, 'label') ?? '',
    resourcesContent: get<string>(resources, 'content') ?? '',
    resourcesCommunity: get<string>(resources, 'community') ?? '',
    resourcesItems: resourcesItemsArr,
    pricing: get<string>(nav, 'pricing') ?? '',
    affiliate: get<string>(nav, 'affiliate') ?? '',
    newBadge: get<string>(nav, 'newBadge') ?? '',
    login: get<string>(nav, 'login') ?? '',
    getStarted: get<string>(nav, 'getStarted') ?? '',
    getStartedShort: get<string>(nav, 'getStartedShort') ?? '',
    openMenu: get<string>(nav, 'openMenu') ?? '',
    close: get<string>(nav, 'close') ?? '',
    menu: get<string>(nav, 'menu') ?? '',
  }
}

function buildFooter(lang: Lang, m: Messages): object {
  const footer = get<Messages>(m, 'footer') ?? {}

  // tagline: "Built for <em>freedom.</em>" → prefix + emphasis
  const taglineRaw = get<string>(footer, 'tagline') ?? ''
  const taglineSplit = splitEmFull(taglineRaw)

  const product = get<Messages>(footer, 'product') ?? {}
  const productLinks = get<Messages>(product, 'links') ?? {}
  const company = get<Messages>(footer, 'company') ?? {}
  const companyLinks = get<Messages>(company, 'links') ?? {}
  const legal = get<Messages>(footer, 'legal') ?? {}
  const legalLinks = get<Messages>(legal, 'links') ?? {}

  const makeLinks = (links: Messages, keys: string[], hrefs: Record<string,string>) =>
    keys.map((key) => ({
      _type: 'navItem',
      _key: key,
      label: get<string>(links, key) ?? '',
      href: hrefs[key] ?? '#',
      external: false,
    }))

  return {
    _id: `footer-${lang}`,
    _type: 'footer',
    language: lang,
    taglinePrefix: taglineSplit.prefix,
    taglineEmphasis: taglineSplit.accent,
    productHeading: get<string>(product, 'heading') ?? '',
    productLinks: makeLinks(productLinks, ['features','technology','pricing','courseBuilder'], {
      features: '#features',
      technology: '#tech-section',
      pricing: '#pricing',
      courseBuilder: '#features',
    }),
    companyHeading: get<string>(company, 'heading') ?? '',
    companyLinks: makeLinks(companyLinks, ['team','manifesto','faq','contact'], {
      team: '#team',
      manifesto: '#manifesto',
      faq: '#faq',
      contact: '#contact',
    }),
    legalHeading: get<string>(legal, 'heading') ?? '',
    legalLinks: makeLinks(legalLinks, ['privacy','terms','cookies'], {
      privacy: '/privacy',
      terms: '/terms',
      cookies: '/cookies',
    }),
    copy: get<string>(footer, 'copy') ?? '',
  }
}

function buildSiteSettings(lang: Lang, m: Messages): object {
  return {
    _id: `siteSettings-${lang}`,
    _type: 'siteSettings',
    language: lang,
    siteName: 'Jimmy',
    siteDescription: get<string>(m, 'hero', 'description') ?? '',
  }
}

// ── Translation metadata document ────────────────────────────────────────────
function buildTranslationMetadata(baseType: string, langs: Lang[]): object {
  return {
    _id: `drafts.${baseType}-i18n-metadata`,
    _type: 'translation.metadata',
    schemaTypes: [baseType],
    translations: langs.map((lang) => ({
      _key: lang,
      value: {
        _type: 'reference',
        _ref: `${baseType}-${lang}`,
        _weak: true,
      },
    })),
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const langs: Lang[] = ['en', 'fr', 'es']

  console.log(`\nSeeding Sanity dataset: ${dataset} (project: ${projectId})\n`)

  const createdIds: string[] = []

  for (const lang of langs) {
    const m = loadMessages(lang)

    const homePage = buildHomePage(lang, m)
    const navigation = buildNavigation(lang, m)
    const footer = buildFooter(lang, m)
    const siteSettings = buildSiteSettings(lang, m)

    for (const doc of [homePage, navigation, footer, siteSettings]) {
      const d = doc as { _id: string; _type: string }
      process.stdout.write(`  Creating ${d._id} ... `)
      try {
        await client.createOrReplace(d as Parameters<typeof client.createOrReplace>[0])
        createdIds.push(d._id)
        console.log('✓')
      } catch (err) {
        const e = err as Error
        if (e.message?.includes('write') || e.message?.includes('token') || e.message?.includes('permission') || e.message?.includes('unauthorized')) {
          console.error('\n\nERROR: Token does not have write permissions.')
          console.error('Please use a token with "Editor" or "Deploy Studio" role.')
          console.error(`Details: ${e.message}`)
          process.exit(1)
        }
        console.error(`FAILED: ${e.message}`)
      }
    }
  }

  // Create translation.metadata documents
  for (const baseType of ['homePage', 'navigation', 'footer', 'siteSettings']) {
    const metaDoc = buildTranslationMetadata(baseType, langs)
    const d = metaDoc as { _id: string }
    process.stdout.write(`  Creating translation.metadata for ${baseType} ... `)
    try {
      await client.createOrReplace(metaDoc as Parameters<typeof client.createOrReplace>[0])
      createdIds.push(d._id)
      console.log('✓')
    } catch (err) {
      const e = err as Error
      console.error(`FAILED: ${e.message}`)
    }
  }

  console.log(`\n✓ Seeded ${createdIds.length} documents:\n`)
  for (const id of createdIds) {
    console.log(`  - ${id}`)
  }

  // ── Verification read ───────────────────────────────────────────────────────
  console.log('\n── Fidelity spot-check ──────────────────────────────────────────')

  const enMessages = loadMessages('en')
  const enHero = await client.fetch<{ hero?: { badge?: string; headlinePrefix?: string; headlineAccent?: string; description?: string } }>(
    `*[_id == "homePage-en"][0]{ hero }`,
  )

  const checks: Array<{ field: string; expected: string; got: string }> = [
    {
      field: 'hero.badge',
      expected: get<string>(enMessages, 'hero', 'badge') ?? '',
      got: enHero?.hero?.badge ?? '',
    },
    {
      field: 'hero.headlinePrefix',
      expected: 'The Skool of ',
      got: enHero?.hero?.headlinePrefix ?? '',
    },
    {
      field: 'hero.headlineAccent',
      expected: 'Fitness.',
      got: enHero?.hero?.headlineAccent ?? '',
    },
    {
      field: 'hero.description',
      expected: get<string>(enMessages, 'hero', 'description') ?? '',
      got: enHero?.hero?.description ?? '',
    },
  ]

  let allMatch = true
  for (const check of checks) {
    const match = check.expected === check.got
    if (!match) allMatch = false
    console.log(`  [${match ? '✓' : '✗'}] ${check.field}`)
    if (!match) {
      console.log(`       expected: ${JSON.stringify(check.expected)}`)
      console.log(`       got:      ${JSON.stringify(check.got)}`)
    }
  }

  console.log(`\n${allMatch ? '✓ All spot-checks PASSED' : '✗ Some checks FAILED — see above'}\n`)
}

main().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
