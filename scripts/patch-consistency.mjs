/**
 * JIM-147 consistency cleanups, plus one thing we broke ourselves.
 *
 *  1. "Bootstrapped / No VC" -> "Founder-led / Built with coaches."
 *     We are raising, so the old line becomes false the moment a term sheet
 *     exists, and investors doing diligence read the site.
 *  2. Referral Program add-on -> `soon`. The nav says "Affiliate — Soon" and
 *     that is the true one, so pricing must stop listing it as on sale.
 *  3. Hero em-dash -> full stop, in the hero and in the SEO title that repeats
 *     the same sentence.
 *  4. Branded-app feature lead: drops the "white-label" claim (Phase 5) and
 *     says plainly that the branding is coming.
 *  5. Not in the ticket: the FAQ still said "up to 200 clients", which JIM-154
 *     made untrue when the top tier became unlimited.
 *
 *   node scripts/patch-consistency.mjs [--dry]
 */
import { createClient } from '@sanity/client'

const token = process.env.SANITY_WRITE_TOKEN ?? process.env.SANITY_API_TOKEN
const dry = process.argv.includes('--dry')
if (!token && !dry) {
  console.error('SANITY_WRITE_TOKEN required (or --dry).')
  process.exit(1)
}
const client = createClient({
  projectId: 'rpeljbjz', dataset: 'production', apiVersion: '2024-01-01', token, useCdn: false,
})

const HOME = {
  en: {
    'team.stats[0].heading': 'Founder-led',
    'team.stats[0].body': 'Built with coaches.',
    'hero.subtitle': 'Your clients don’t just train. They belong.',
    'faq.items[0].answer':
      'Jimmy is the retention platform for modern fitness coaches. It centralizes structured workouts, a Skool-style community, 1:1 messaging, payments and courses into a single native iOS/Android app — so your clients don’t just train, they belong. Coaches start free with up to 3 clients; paid plans scale from €29/mo to unlimited clients.',
    'pricing.addons[2].status': 'soon',
  },
  fr: {
    'team.stats[0].heading': 'Dirigé par ses fondateurs',
    'team.stats[0].body': 'Construit avec des coachs.',
    'hero.subtitle': "Tes clients ne font pas que s'entraîner. Ils appartiennent à une communauté.",
    'faq.items[0].answer':
      "Jimmy est la plateforme de rétention pour les coachs fitness modernes. Elle centralise des séances structurées, une communauté façon Skool, la messagerie 1:1, les paiements et les formations dans une seule app native iOS/Android — pour que tes clients ne fassent pas que s'entraîner, ils appartiennent à une communauté. Les coachs commencent gratuitement avec jusqu'à 3 clients ; les plans payants évoluent de 29 €/mois jusqu'à un nombre illimité de clients.",
    'pricing.addons[2].status': 'soon',
  },
  es: {
    'team.stats[0].heading': 'Dirigido por sus fundadores',
    'team.stats[0].body': 'Construido con coaches.',
    'hero.subtitle': 'Tus clientes no solo entrenan. Pertenecen.',
    'faq.items[0].answer':
      'Jimmy es la plataforma de retención para coaches de fitness modernos. Centraliza entrenamientos estructurados, una comunidad estilo Skool, mensajería 1:1, pagos y cursos en una sola app nativa iOS/Android — para que tus clientes no solo entrenen, sino que pertenezcan. Los coaches empiezan gratis con hasta 3 clientes; los planes de pago escalan desde 29 €/mes hasta clientes ilimitados.',
    'pricing.addons[2].status': 'soon',
  },
}

const SEO_TITLE = {
  en: 'Jimmy — Your clients don’t just train. They belong.',
  fr: "Jimmy — Tes clients ne font pas que s'entraîner. Ils appartiennent.",
  es: 'Jimmy — Tus clientes no solo entrenan. Pertenecen.',
}

/** Branded app: the white-label claim is Phase 5 and the branding is not live. */
const FEATURE_LEAD = {
  en: 'An iOS and Android app your members open every day. Your logo, your colors, your name on the home screen — coming soon.',
  fr: "Une appli iOS et Android que tes membres ouvrent chaque jour. Ton logo, tes couleurs, ton nom sur l'écran d'accueil — bientôt.",
  es: 'Una app iOS y Android que tus miembros abren cada día. Tu logo, tus colores, tu nombre en la pantalla de inicio — muy pronto.',
}

const run = async () => {
  for (const [loc, fields] of Object.entries(HOME)) {
    const doc = await client.fetch(`*[_type=="homePage" && language==$loc][0]{_id}`, { loc })
    if (!doc?._id) { console.error(`  ✗ ${loc}: no homePage`); continue }
    const patch = Object.fromEntries(Object.entries(fields).map(([k, v]) => [`pricing.${k}`.startsWith('pricing.pricing') ? k : k, v]))
    console.log(`  ${dry ? '·' : '✓'} homePage ${loc} — ${Object.keys(patch).length} fields`)
    if (!dry) await client.patch(doc._id).set(patch).commit()

    const site = await client.fetch(`*[_type=="siteSettings" && language==$loc][0]{_id}`, { loc })
    if (site?._id) {
      console.log(`  ${dry ? '·' : '✓'} siteSettings ${loc} — seo.title`)
      if (!dry) await client.patch(site._id).set({ 'seo.title': SEO_TITLE[loc] }).commit()
    }

    const feat = await client.fetch(
      `*[_type=="feature" && language==$loc && slug.current=="branded-mobile-app"][0]{_id}`, { loc },
    )
    if (feat?._id) {
      console.log(`  ${dry ? '·' : '✓'} feature branded-mobile-app ${loc} — lead`)
      if (!dry) await client.patch(feat._id).set({ lead: FEATURE_LEAD[loc] }).commit()
    }
  }
  console.log(dry ? '\nDry run — nothing written.' : '\nDone.')
}

run().catch((e) => { console.error(e.message); process.exit(1) })
