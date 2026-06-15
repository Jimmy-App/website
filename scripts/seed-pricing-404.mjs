/**
 * Seed the standalone Pricing page (pricingPage.faq + finalCta) and patch the
 * 404 copy (siteSettings.notFound) for every locale. Surgical — does not touch
 * other content. Run: set -a; . ./.env.local; set +a; node scripts/seed-pricing-404.mjs
 */
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.SANITY_API_VERSION || '2024-02-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

let n = 0
const k = () => `f${(n++).toString(36)}`
const items = (arr) => arr.map(([question, answer]) => ({ _key: k(), _type: 'faqItem', question, answer }))

const PRICING = {
  en: {
    title: 'Pricing (en)',
    faq: {
      sectionLabel: 'Frequently Asked Questions',
      eyebrow: 'Frequently Asked Questions',
      title: 'Questions, answered.',
      items: items([
        ['What does the beta −15% rate mean?', 'While Jimmy is in beta, every CLUB subscription is 15% off the regular price — for life. Lock it in now and you keep that rate even after we launch publicly, as long as your subscription stays active.'],
        ['Is the Free plan really free forever?', 'Yes. Coach up to 3 clients on the Free plan with no time limit and no card required — full Workout Builder, the client mobile app, 1:1 messaging and Stripe payments included. Upgrade to CLUB only when you outgrow it.'],
        ['How does pricing scale as I add clients?', 'CLUB is tiered by roster size — 10, 25, 50, 100 or 200 athletes. Use the slider above to see your exact monthly price. You only move up a tier when you actually grow, and your locked beta discount applies to every tier.'],
        ['What are the transaction fees?', "On CLUB, payments run at Stripe 1.4% + €0.25 plus a Jimmy 2.5% platform fee. On Free, it's Stripe 2.9% + €0.30 plus Jimmy 5%. There are no setup or hidden fees — you keep the rest of what you earn."],
        ['Can I cancel anytime?', "Always. CLUB is month-to-month with no contract — cancel in a couple of clicks and you won't be billed again. Your CLUB trial runs 30 days free before any charge."],
        ['Do you offer team or gym accounts?', 'Yes — add coaches to a shared workspace for +€19/mo per coach. Pair it with the AI Coaching Assistant add-on (+€19/mo) and the referral program (30% recurring lifetime commission) to build out a full studio.'],
      ]),
      footNote: 'Still have questions?',
      footLink: 'Talk to the founders on Discord',
    },
    finalCta: {
      headlinePrefix: 'Start free ',
      headlineAccent: 'today.',
      headlineSuffix: '',
      headlineLine2: "Scale when you're ready.",
      subtitle: 'Join the coaches building their business on Jimmy — and lock in your −15% beta rate for life.',
      ctaPrimary: 'Start for free',
      ctaSecondary: 'Book a demo',
      socialProof: '',
      tags: ['No card required', '30 days free on Club', '3 free clients for life'],
      trustPrefix: '',
      trustBold: '',
      trustSuffix: '',
    },
  },
  fr: {
    title: 'Pricing (fr)',
    faq: {
      sectionLabel: 'Questions fréquentes',
      eyebrow: 'Questions fréquentes',
      title: 'Vos questions, nos réponses.',
      items: items([
        ['Que signifie le tarif beta −15 % ?', "Pendant la beta de Jimmy, chaque abonnement CLUB bénéficie de 15 % de réduction sur le prix normal — à vie. Verrouillez-le maintenant et conservez ce tarif même après le lancement public, tant que votre abonnement reste actif."],
        ['Le plan Gratuit est-il vraiment gratuit pour toujours ?', "Oui. Coachez jusqu'à 3 clients sur le plan Gratuit, sans limite de temps ni carte bancaire — Créateur d'entraînements complet, app mobile client, messagerie 1:1 et paiements Stripe inclus. Passez à CLUB seulement quand vous le dépassez."],
        ['Comment le tarif évolue-t-il quand j’ajoute des clients ?', "CLUB est segmenté par taille de roster — 10, 25, 50, 100 ou 200 athlètes. Utilisez le curseur ci-dessus pour voir votre prix mensuel exact. Vous ne montez de palier que lorsque vous grandissez réellement, et votre remise beta verrouillée s’applique à chaque palier."],
        ['Quels sont les frais de transaction ?', "Sur CLUB, les paiements sont à Stripe 1,4 % + 0,25 € plus 2,5 % de frais de plateforme Jimmy. Sur Gratuit, c’est Stripe 2,9 % + 0,30 € plus Jimmy 5 %. Aucun frais d’installation ni frais caché — vous gardez le reste de ce que vous gagnez."],
        ['Puis-je annuler à tout moment ?', "Toujours. CLUB est sans engagement, de mois en mois — annulez en deux clics et vous ne serez plus facturé. Votre essai CLUB dure 30 jours gratuits avant tout prélèvement."],
        ['Proposez-vous des comptes équipe ou salle ?', "Oui — ajoutez des coachs à un espace partagé pour +19 €/mois par coach. Associez-le à l’add-on Assistant IA (+19 €/mois) et au programme de parrainage (30 % de commission récurrente à vie) pour bâtir un vrai studio."],
      ]),
      footNote: 'Encore des questions ?',
      footLink: 'Parlez aux fondateurs sur Discord',
    },
    finalCta: {
      headlinePrefix: 'Commencez gratuitement ',
      headlineAccent: "aujourd'hui.",
      headlineSuffix: '',
      headlineLine2: 'Évoluez quand vous êtes prêt.',
      subtitle: 'Rejoignez les coachs qui bâtissent leur activité sur Jimmy — et verrouillez votre tarif beta −15 % à vie.',
      ctaPrimary: 'Commencer gratuitement',
      ctaSecondary: 'Réserver une démo',
      socialProof: '',
      tags: ['Sans carte bancaire', '30 jours gratuits sur Club', '3 clients gratuits à vie'],
      trustPrefix: '',
      trustBold: '',
      trustSuffix: '',
    },
  },
  es: {
    title: 'Pricing (es)',
    faq: {
      sectionLabel: 'Preguntas frecuentes',
      eyebrow: 'Preguntas frecuentes',
      title: 'Tus preguntas, respondidas.',
      items: items([
        ['¿Qué significa la tarifa beta −15 %?', 'Mientras Jimmy está en beta, cada suscripción CLUB tiene un 15 % de descuento sobre el precio normal — de por vida. Asegúrala ahora y conservas esa tarifa incluso tras el lanzamiento público, mientras tu suscripción siga activa.'],
        ['¿El plan Gratis es realmente gratis para siempre?', 'Sí. Entrena hasta 3 clientes en el plan Gratis, sin límite de tiempo ni tarjeta — Creador de Entrenos completo, app móvil para clientes, mensajería 1:1 y pagos con Stripe incluidos. Pasa a CLUB solo cuando lo superes.'],
        ['¿Cómo escala el precio al añadir clientes?', 'CLUB se organiza por tamaño de cartera — 10, 25, 50, 100 o 200 atletas. Usa el control de arriba para ver tu precio mensual exacto. Solo subes de nivel cuando creces de verdad, y tu descuento beta bloqueado se aplica a cada nivel.'],
        ['¿Cuáles son las comisiones por transacción?', 'En CLUB, los pagos son Stripe 1,4 % + 0,25 € más una comisión de plataforma Jimmy del 2,5 %. En Gratis, es Stripe 2,9 % + 0,30 € más Jimmy 5 %. No hay costes de alta ni comisiones ocultas — te quedas con el resto de lo que ganas.'],
        ['¿Puedo cancelar cuando quiera?', 'Siempre. CLUB es mes a mes, sin contrato — cancela en un par de clics y no se te volverá a cobrar. Tu prueba de CLUB dura 30 días gratis antes de cualquier cargo.'],
        ['¿Ofrecéis cuentas de equipo o gimnasio?', 'Sí — añade entrenadores a un espacio compartido por +19 €/mes por entrenador. Combínalo con el add-on de Asistente IA (+19 €/mes) y el programa de referidos (30 % de comisión recurrente de por vida) para montar un estudio completo.'],
      ]),
      footNote: '¿Aún tienes preguntas?',
      footLink: 'Habla con los fundadores en Discord',
    },
    finalCta: {
      headlinePrefix: 'Empieza gratis ',
      headlineAccent: 'hoy.',
      headlineSuffix: '',
      headlineLine2: 'Escala cuando estés listo.',
      subtitle: 'Únete a los coaches que construyen su negocio en Jimmy — y bloquea tu tarifa beta −15 % de por vida.',
      ctaPrimary: 'Empieza gratis',
      ctaSecondary: 'Reservar una demo',
      socialProof: '',
      tags: ['Sin tarjeta', '30 días gratis en Club', '3 clientes gratis de por vida'],
      trustPrefix: '',
      trustBold: '',
      trustSuffix: '',
    },
  },
}

const NOT_FOUND = {
  en: {
    eyebrow: 'Error 404',
    title: 'This page took a rest day.',
    lead: "The link you followed doesn't exist — or it's still warming up. Either way, let's get you back on the program.",
    ctaPrimary: 'Back to home',
    ctaSecondary: 'Explore features',
  },
  fr: {
    eyebrow: 'Erreur 404',
    title: 'Cette page prend un jour de repos.',
    lead: "Le lien que vous avez suivi n'existe pas — ou il est encore en échauffement. Dans tous les cas, retournons à l'entraînement.",
    ctaPrimary: "Retour à l'accueil",
    ctaSecondary: 'Découvrir les fonctionnalités',
  },
  es: {
    eyebrow: 'Error 404',
    title: 'Esta página se tomó un día de descanso.',
    lead: 'El enlace que seguiste no existe — o todavía está calentando. En cualquier caso, volvamos al plan.',
    ctaPrimary: 'Volver al inicio',
    ctaSecondary: 'Explorar funciones',
  },
}

async function run() {
  let tx = client.transaction()
  for (const [locale, d] of Object.entries(PRICING)) {
    tx = tx.createOrReplace({
      _id: `pricingPage-${locale}`,
      _type: 'pricingPage',
      language: locale,
      title: d.title,
      faq: d.faq,
      finalCta: d.finalCta,
    })
  }
  await tx.commit()
  console.log('✔ seeded pricingPage en/fr/es')

  for (const [locale, nf] of Object.entries(NOT_FOUND)) {
    await client.patch(`siteSettings-${locale}`).set({ notFound: nf }).commit()
    console.log(`✔ patched siteSettings-${locale}.notFound`)
  }
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
