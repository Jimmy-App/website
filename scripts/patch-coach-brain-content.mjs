/**
 * JIM-143 (part 2) — Coach Brain content into Sanity.
 *
 *  1. homePage.coachBrain — the whole section, so it is editable without a deploy.
 *  2. navigation.featuresItems — adds the Coach Brain entry to the features
 *     mega-menu (coach column). The key must match FEATURE_ROUTES/COACH_KEYS in
 *     Navbar.tsx: those are hardcoded, and a key that exists only in Sanity is
 *     silently dropped from the menu — exactly how Native Mobile App vanished.
 *  3. feature.waitlistSource — makes the /features/coach-brain hero show the
 *     waitlist form instead of Start free / Book a demo.
 *
 * FR/ES follow the house rules: tu / tú, neutral LatAm, no vous, no usted.
 *
 *   node scripts/patch-coach-brain-content.mjs [--dry]
 */
import { createClient } from '@sanity/client'

const token = process.env.SANITY_WRITE_TOKEN ?? process.env.SANITY_API_TOKEN
const dry = process.argv.includes('--dry')
if (!token && !dry) {
  console.error('SANITY_WRITE_TOKEN required (or --dry).')
  process.exit(1)
}
const client = createClient({
  projectId: 'rpeljbjz',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
})

const block = (key, iconKey, label, lead, body, pull) => ({
  _type: 'coachBrainBlock',
  _key: key,
  iconKey,
  label,
  lead,
  body,
  pull,
})

const SECTION = {
  en: {
    eyebrow: 'Coach Brain',
    badge: 'Coming soon',
    title: { prefix: 'Every coach gets an AI trained on one thing: ', accent: 'them', suffix: '.' },
    subtitle: 'AI that works for the coach. Never instead of the coach.',
    demoCaption: 'A preview of Coach Brain. Not available yet.',
    blocks: [
      block('brief', 'brain', 'The brief', 'A 10-minute conversation.',
        'Coach Brain learns your philosophy, your formats, your progressions, your cues, your red lines. Then it keeps learning from every program you write. Fully visible, fully editable.',
        'Your AI, transparent.'),
      block('copilot', 'sparkles', 'The copilot', 'One bar, everywhere you work.',
        'Ask in plain words. It writes into the builder, not into a chat window. You review the diff, undo in one tap.',
        'It doesn’t suggest. It does.'),
      block('loop', 'refresh', 'The loop', 'Every edit trains your Brain.',
        'It compounds with usage. The longer you coach with it, the closer it gets to how you actually think.',
        'Generic AI writes generic programs. Coach Brain writes yours.'),
    ],
    waitlistTitle: 'Join the Coach Brain waitlist',
    formPlaceholder: 'you@yourgym.com',
    formCta: 'Join the waitlist',
    formCtaLoading: 'Joining…',
    formCtaDone: 'You’re on the list',
    formHintIdle: 'One email when it launches. Unsubscribe any time.',
    formHintDone: 'We’ll email you when Coach Brain opens. No other mail.',
    formHintError: 'That didn’t go through. Try again in a moment.',
  },
  fr: {
    eyebrow: 'Coach Brain',
    badge: 'Bientôt disponible',
    title: { prefix: 'Chaque coach a une IA entraînée sur une seule chose : ', accent: 'lui', suffix: '.' },
    subtitle: 'Une IA qui travaille pour le coach. Jamais à sa place.',
    demoCaption: 'Un aperçu de Coach Brain. Pas encore disponible.',
    blocks: [
      block('brief', 'brain', 'Le brief', 'Une conversation de 10 minutes.',
        'Coach Brain apprend ta philosophie, tes formats, tes progressions, tes consignes, tes lignes rouges. Puis il continue d’apprendre de chaque programme que tu écris. Tout est visible, tout est modifiable.',
        'Ton IA, transparente.'),
      block('copilot', 'sparkles', 'Le copilote', 'Une seule barre, partout où tu travailles.',
        'Demande en langage courant. Il écrit dans le builder, pas dans une fenêtre de chat. Tu relis les modifications, tu annules en un geste.',
        'Il ne suggère pas. Il fait.'),
      block('loop', 'refresh', 'La boucle', 'Chaque modification entraîne ton Brain.',
        'L’effet se cumule à l’usage. Plus tu coaches avec, plus il se rapproche de ta façon de penser.',
        'Une IA générique écrit des programmes génériques. Coach Brain écrit les tiens.'),
    ],
    waitlistTitle: 'Rejoins la liste d’attente Coach Brain',
    formPlaceholder: 'toi@tasalle.com',
    formCta: 'Rejoindre la liste',
    formCtaLoading: 'Inscription…',
    formCtaDone: 'Tu es sur la liste',
    formHintIdle: 'Un seul e-mail au lancement. Désabonne-toi quand tu veux.',
    formHintDone: 'On t’écrit dès l’ouverture de Coach Brain. Rien d’autre.',
    formHintError: 'Ça n’est pas passé. Réessaie dans un instant.',
  },
  es: {
    eyebrow: 'Coach Brain',
    badge: 'Próximamente',
    title: { prefix: 'Cada coach tiene una IA entrenada en una sola cosa: ', accent: 'él', suffix: '.' },
    subtitle: 'Una IA que trabaja para el coach. Nunca en su lugar.',
    demoCaption: 'Una vista previa de Coach Brain. Aún no está disponible.',
    blocks: [
      block('brief', 'brain', 'El brief', 'Una conversación de 10 minutos.',
        'Coach Brain aprende tu filosofía, tus formatos, tus progresiones, tus indicaciones y tus líneas rojas. Después sigue aprendiendo de cada programa que escribes. Todo visible, todo editable.',
        'Tu IA, transparente.'),
      block('copilot', 'sparkles', 'El copiloto', 'Una sola barra, en todo tu flujo de trabajo.',
        'Pídelo en lenguaje natural. Escribe dentro del creador, no en una ventana de chat. Revisas los cambios y deshaces con un toque.',
        'No sugiere. Lo hace.'),
      block('loop', 'refresh', 'El ciclo', 'Cada edición entrena tu Brain.',
        'El efecto se acumula con el uso. Cuanto más entrenas con él, más se acerca a tu forma de pensar.',
        'Una IA genérica escribe programas genéricos. Coach Brain escribe los tuyos.'),
    ],
    waitlistTitle: 'Únete a la lista de espera de Coach Brain',
    formPlaceholder: 'tu@tugimnasio.com',
    formCta: 'Unirme a la lista',
    formCtaLoading: 'Enviando…',
    formCtaDone: 'Ya estás en la lista',
    formHintIdle: 'Un solo correo cuando se lance. Puedes darte de baja cuando quieras.',
    formHintDone: 'Te escribimos en cuanto se abra Coach Brain. Nada más.',
    formHintError: 'No se pudo enviar. Inténtalo de nuevo en un momento.',
  },
}

const NAV_ITEM = {
  en: { title: 'Coach Brain', subtitle: 'An AI trained on you.' },
  fr: { title: 'Coach Brain', subtitle: 'Une IA entraînée sur toi.' },
  es: { title: 'Coach Brain', subtitle: 'Una IA entrenada en ti.' },
}

for (const locale of ['en', 'fr', 'es']) {
  console.log(`\n[${locale}]`)

  const home = await client.fetch('*[_type == "homePage" && language == $locale][0]{_id}', { locale })
  if (home?._id) {
    console.log(`  section: ${SECTION[locale].blocks.length} blocks, waitlist copy`)
    if (!dry) {
      await client.patch(home._id).set({ coachBrain: SECTION[locale] }).commit()
      console.log('  ✓ homePage.coachBrain')
    }
  }

  const nav = await client.fetch(
    '*[_type == "navigation" && language == $locale][0]{_id, featuresItems}',
    { locale },
  )
  if (nav?._id) {
    const items = nav.featuresItems ?? []
    if (items.some((i) => i?.key === 'coachBrain')) {
      console.log('  · nav item already present')
    } else {
      // Right after Progress Tracking — the end of the coach column.
      const at = items.findIndex((i) => i?.key === 'progressTracking')
      const next = [...items]
      next.splice(at === -1 ? items.length : at + 1, 0, {
        _type: items[0]?._type ?? 'navItem',
        _key: 'coach-brain',
        key: 'coachBrain',
        href: '#',
        ...NAV_ITEM[locale],
      })
      console.log(`  nav: ${items.length} -> ${next.length} items`)
      if (!dry) {
        await client.patch(nav._id).set({ featuresItems: next }).commit()
        console.log('  ✓ navigation')
      }
    }
  }

  const feat = await client.fetch(
    '*[_type == "feature" && slug.current == "coach-brain" && language == $locale][0]{_id}',
    { locale },
  )
  if (feat?._id && !dry) {
    await client.patch(feat._id).set({ waitlistSource: 'coach-brain-waitlist' }).commit()
    console.log('  ✓ feature.waitlistSource')
  }
}

console.log(dry ? '\nDry run — nothing written.' : '\nDone.')
