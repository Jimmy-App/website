/**
 * Seed the /affiliate page (affiliatePage en/fr/es) + the global calculator
 * numbers (affiliateSettings singleton). Surgical — touches nothing else.
 * Run: set -a; . ./.env.local; set +a; node scripts/seed-affiliate.mjs
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
const key = () => `a${(n++).toString(36)}`
const arr = (type, list) => list.map((o) => ({ _key: key(), _type: type, ...o }))
const faq = (pairs) => arr('faqItem', pairs.map(([question, answer]) => ({ question, answer })))
const steps = (list) => arr('step', list.map(([label, name, tagline]) => ({ label, name, tagline })))
const channels = (list) => arr('channel', list.map(([name, source]) => ({ name, source })))
const cards = (list) => arr('card', list.map(([title, body]) => ({ title, body })))
const whoItems = (list) => arr('item', list.map(([title, sub]) => ({ title, sub })))

const SETTINGS = {
  _id: 'affiliateSettings',
  _type: 'affiliateSettings',
  rate: 30,
  sliderMin: 5,
  sliderMax: 100,
  sliderDefault: 25,
  ticks: [5, 25, 50, 75, 100],
  eur: { avg: 69, lo: 29, hi: 149 },
  usd: { avg: 75, lo: 32, hi: 162 },
}

const PAGE = {
  en: {
    title: 'Affiliate (en)',
    hero: {
      socialProof: '700+ coaches & creators already earning with Jimmy',
      eyebrow: 'Affiliate Program',
      headlinePrefix: 'Earn ',
      headlineAccent: '30% recurring',
      headlineSuffix: ' for every coach you refer.',
      subtitle:
        'Share the platform you already love. Get 30% of every payment your referrals make to Jimmy — every month, for as long as they stay subscribed.',
      ctaPrimary: 'Start earning',
      ctaSecondary: 'See how it works',
    },
    calc: {
      title: 'How much could you earn?',
      helper: "Drag to set how many coaches you'll refer.",
      coachesSuffix: 'coaches',
      perMo: '/mo',
      estimateLabel: 'Your estimate',
      recurringBadge: '30% recurring',
      monthlyLabel: 'Monthly commission',
      perYearTemplate: '≈ {v} / yr',
      basisLabel: 'Avg. Club plan',
      basisRangePrefix: 'Real Club plans run',
      basisRangeSuffix: '— yours may earn more.',
      footnote:
        "Estimated from the average Club subscription, not the cheapest tier. Free members don't pay commission — your real numbers can run higher.",
      referralsLabel: 'Active referrals',
      perMonthLabel: 'Per referral / month',
      perMonthTip:
        'Each referral pays the average {avg}/mo Club plan — you keep {rate}% ({perRef}), every month they stay subscribed.',
      perYearLabel: 'Per referral / year',
      perYearTip:
        "That's the {perRef}/mo commission over 12 months — {rate}% of the {avg} average Club plan, paid for as long as they subscribe.",
      cta: 'Get my affiliate link',
      note: 'An illustration based on active, paying referrals. Actual earnings depend on the plans your referrals choose and how long they stay.',
    },
    how: {
      eyebrow: '• HOW IT WORKS',
      title: 'Three steps to recurring income.',
      subtitle: 'Sign up, share your link, and earn every time a coach you referred sticks with Jimmy.',
      steps: steps([
        ['Step 01', 'Grab your link', 'Join free and copy your unique referral link.'],
        ['Step 02', 'Share & track', 'Drop it anywhere — every click is tracked live.'],
        ['Step 03', 'Get paid & withdraw', 'Referrals pay you 30% monthly — cash out anytime.'],
      ]),
      labels: {
        partnerBarTitle: 'Become a partner',
        freeBadge: 'Free',
        accountName: 'Alex Coach',
        accountRole: 'Partner account',
        approved: 'Approved',
        referralLinkLabel: 'Your referral link',
        copy: 'Copy',
        copied: 'Copied',
        copiedToast: 'Link copied to clipboard',
        tagsStep1: ['Instant approval', 'Custom link', '90-day cookie'],
        shareBarTitle: 'Share & track',
        liveBadge: 'Live',
        linkClicksLabel: 'Link clicks',
        clicksBadge: '+18% this week',
        channels: channels([
          ['Instagram', 'Link in bio'],
          ['WhatsApp', 'Direct share'],
          ['Newsletter', 'Email blast'],
        ]),
        tagsStep2: ['Real-time', 'Per channel', 'UTM tracking'],
        commissionsBarTitle: 'Commissions',
        monthBadge: 'This month',
        availableLabel: 'Available to withdraw',
        withdraw: 'Withdraw',
        newPaymentTemplate: 'New payment of {amt} received',
        completed: 'Completed',
        commissionTag: 'Jimmy Commission',
        tagsStep3: ['Monthly payouts', 'Stripe & PayPal', 'Lifetime'],
      },
    },
    why: {
      eyebrow: 'Why partner with Jimmy',
      title: 'Built to pay you, fairly.',
      cards: cards([
        ['Recurring, not one-off', 'You earn 30% every single month a referral stays subscribed — not a single first-payment bounty. Your income compounds.'],
        ['90-day cookie window', 'If someone signs up within 90 days of clicking your link, the referral is yours — even if they take time to decide.'],
        ['Real-time dashboard', 'Track clicks, sign-ups, active referrals and pending payouts live. No guessing, no waiting for a monthly report.'],
        ['Reliable monthly payouts', 'Paid out every month via Stripe or PayPal once you clear a €50 minimum. Clean statements, no surprises.'],
      ]),
    },
    who: {
      title: 'Made for people coaches already trust.',
      subtitle: 'If your audience trains, coaches, or runs a fitness business — Jimmy is an easy recommendation.',
      items: whoItems([
        ['Fitness content creators', 'Turn your audience into recurring income.'],
        ['Coaches & current members', 'Recommend the tool you already run on.'],
        ['Gym & box owners', 'Refer the coaches in your network.'],
        ['Communities & newsletters', "Share with an audience that's ready to train."],
      ]),
    },
    faq: {
      eyebrow: 'Frequently Asked Questions',
      title: 'Questions, answered.',
      items: faq([
        ['How much do I earn, exactly?', "You earn 30% of every payment your referrals make to Jimmy — recurring, every month they stay subscribed. Refer ten coaches on the €79 Club plan and that's around €237 a month, paid for as long as they keep their subscription."],
        ['Is the commission really recurring?', "Yes. This isn't a one-time bounty — it's a lifetime recurring commission. As long as a coach you referred keeps paying for Jimmy, you keep earning your 30% every month."],
        ['When and how do I get paid?', 'Payouts run monthly via Stripe or PayPal once your balance clears a €50 minimum. Everything — clicks, sign-ups and pending commission — is visible live in your partner dashboard.'],
        ['How long is the referral tracked?', 'We use a 90-day cookie window. If someone clicks your link and signs up any time within 90 days, the referral — and its recurring commission — is credited to you.'],
        ['Do I need to be a Jimmy customer?', "No. Anyone can join the affiliate program for free — creators, communities and gym owners included. It helps if you know coaches, but you don't need a paid Jimmy account to start earning."],
        ['Are there any rules I should know?', "Keep it honest — no paid brand-bidding, spam, or self-referrals. Promote Jimmy the way you'd recommend it to a friend. The full terms are in your partner dashboard when you join."],
      ]),
      footNote: 'Still have questions about the program?',
      footLink: 'Talk to the team',
    },
    finalCta: {
      headlinePrefix: 'Recommend Jimmy. ',
      headlineAccent: 'Get paid every month.',
      headlineSuffix: '',
      headlineLine2: '',
      subtitle: 'Join 700+ partners turning their network into recurring income — 30% of every payment, for life.',
      ctaPrimary: 'Become a partner',
      ctaSecondary: 'Estimate my earnings',
      tags: ['Free to join', '30% recurring for life', 'Monthly payouts'],
    },
  },

  fr: {
    title: 'Affiliate (fr)',
    hero: {
      socialProof: '700+ coachs et créateurs gagnent déjà avec Jimmy',
      eyebrow: 'Programme d’affiliation',
      headlinePrefix: 'Gagnez ',
      headlineAccent: '30% récurrents',
      headlineSuffix: ' pour chaque coach que vous parrainez.',
      subtitle:
        'Partagez la plateforme que vous aimez déjà. Touchez 30% de chaque paiement que vos filleuls font à Jimmy — chaque mois, tant qu’ils restent abonnés.',
      ctaPrimary: 'Commencer à gagner',
      ctaSecondary: 'Voir comment ça marche',
    },
    calc: {
      title: 'Combien pourriez-vous gagner ?',
      helper: 'Glissez pour définir combien de coachs vous parrainerez.',
      coachesSuffix: 'coachs',
      perMo: '/mois',
      estimateLabel: 'Votre estimation',
      recurringBadge: '30% récurrents',
      monthlyLabel: 'Commission mensuelle',
      perYearTemplate: '≈ {v} / an',
      basisLabel: 'Plan Club moyen',
      basisRangePrefix: 'Les plans Club réels vont de',
      basisRangeSuffix: '— le vôtre peut rapporter plus.',
      footnote:
        'Estimé à partir de l’abonnement Club moyen, pas du palier le moins cher. Les membres Gratuits ne génèrent pas de commission — vos chiffres réels peuvent être plus élevés.',
      referralsLabel: 'Filleuls actifs',
      perMonthLabel: 'Par filleul / mois',
      perMonthTip:
        'Chaque filleul paie le plan Club moyen de {avg}/mois — vous gardez {rate}% ({perRef}), chaque mois où il reste abonné.',
      perYearLabel: 'Par filleul / an',
      perYearTip:
        'C’est la commission de {perRef}/mois sur 12 mois — {rate}% du plan Club moyen de {avg}, versée tant qu’il reste abonné.',
      cta: 'Obtenir mon lien d’affiliation',
      note: 'Une illustration basée sur des filleuls actifs et payants. Vos gains réels dépendent des plans choisis par vos filleuls et de leur durée d’abonnement.',
    },
    how: {
      eyebrow: '• COMMENT ÇA MARCHE',
      title: 'Trois étapes vers un revenu récurrent.',
      subtitle: 'Inscrivez-vous, partagez votre lien, et gagnez chaque fois qu’un coach parrainé reste sur Jimmy.',
      steps: steps([
        ['Étape 01', 'Récupérez votre lien', 'Inscrivez-vous gratuitement et copiez votre lien de parrainage.'],
        ['Étape 02', 'Partagez & suivez', 'Diffusez-le partout — chaque clic est suivi en direct.'],
        ['Étape 03', 'Soyez payé & retirez', 'Vos filleuls vous versent 30% par mois — retirez quand vous voulez.'],
      ]),
      labels: {
        partnerBarTitle: 'Devenir partenaire',
        freeBadge: 'Gratuit',
        accountName: 'Alex Coach',
        accountRole: 'Compte partenaire',
        approved: 'Approuvé',
        referralLinkLabel: 'Votre lien de parrainage',
        copy: 'Copier',
        copied: 'Copié',
        copiedToast: 'Lien copié dans le presse-papiers',
        tagsStep1: ['Validation immédiate', 'Lien personnalisé', 'Cookie 90 jours'],
        shareBarTitle: 'Partager & suivre',
        liveBadge: 'En direct',
        linkClicksLabel: 'Clics sur le lien',
        clicksBadge: '+18% cette semaine',
        channels: channels([
          ['Instagram', 'Lien en bio'],
          ['WhatsApp', 'Partage direct'],
          ['Newsletter', 'Campagne e-mail'],
        ]),
        tagsStep2: ['Temps réel', 'Par canal', 'Suivi UTM'],
        commissionsBarTitle: 'Commissions',
        monthBadge: 'Ce mois-ci',
        availableLabel: 'Disponible au retrait',
        withdraw: 'Retirer',
        newPaymentTemplate: 'Nouveau paiement de {amt} reçu',
        completed: 'Terminé',
        commissionTag: 'Commission Jimmy',
        tagsStep3: ['Paiements mensuels', 'Stripe & PayPal', 'À vie'],
      },
    },
    why: {
      eyebrow: 'Pourquoi devenir partenaire de Jimmy',
      title: 'Conçu pour vous rémunérer, équitablement.',
      cards: cards([
        ['Récurrent, pas ponctuel', 'Vous gagnez 30% chaque mois où un filleul reste abonné — pas une simple prime au premier paiement. Vos revenus se cumulent.'],
        ['Cookie de 90 jours', 'Si quelqu’un s’inscrit dans les 90 jours après avoir cliqué sur votre lien, le filleul est à vous — même s’il prend son temps.'],
        ['Tableau de bord en temps réel', 'Suivez clics, inscriptions, filleuls actifs et paiements en attente en direct. Aucune approximation, aucun rapport mensuel à attendre.'],
        ['Paiements mensuels fiables', 'Versés chaque mois via Stripe ou PayPal dès 50 € atteints. Relevés clairs, sans surprise.'],
      ]),
    },
    who: {
      title: 'Fait pour ceux à qui les coachs font déjà confiance.',
      subtitle: 'Si votre audience s’entraîne, coache ou gère une activité fitness — Jimmy se recommande tout seul.',
      items: whoItems([
        ['Créateurs de contenu fitness', 'Transformez votre audience en revenu récurrent.'],
        ['Coachs & membres actuels', 'Recommandez l’outil sur lequel vous travaillez déjà.'],
        ['Propriétaires de salles & box', 'Parrainez les coachs de votre réseau.'],
        ['Communautés & newsletters', 'Partagez avec une audience prête à s’entraîner.'],
      ]),
    },
    faq: {
      eyebrow: 'Questions fréquentes',
      title: 'Vos questions, nos réponses.',
      items: faq([
        ['Combien je gagne, exactement ?', 'Vous touchez 30% de chaque paiement que vos filleuls font à Jimmy — de façon récurrente, chaque mois où ils restent abonnés. Parrainez dix coachs sur le plan Club à 79 € et c’est environ 237 € par mois, tant qu’ils conservent leur abonnement.'],
        ['La commission est-elle vraiment récurrente ?', 'Oui. Ce n’est pas une prime unique — c’est une commission récurrente à vie. Tant qu’un coach que vous avez parrainé paie Jimmy, vous gagnez vos 30% chaque mois.'],
        ['Quand et comment suis-je payé ?', 'Les paiements partent chaque mois via Stripe ou PayPal dès que votre solde atteint 50 €. Tout — clics, inscriptions et commissions en attente — est visible en direct dans votre tableau de bord partenaire.'],
        ['Pendant combien de temps le filleul est-il suivi ?', 'Nous utilisons un cookie de 90 jours. Si quelqu’un clique sur votre lien et s’inscrit dans les 90 jours, le filleul — et sa commission récurrente — vous est attribué.'],
        ['Dois-je être client de Jimmy ?', 'Non. Tout le monde peut rejoindre le programme d’affiliation gratuitement — créateurs, communautés et propriétaires de salles inclus. Connaître des coachs aide, mais un compte payant n’est pas requis pour commencer à gagner.'],
        ['Y a-t-il des règles à connaître ?', 'Restez honnête — pas d’enchères sur la marque, de spam ni d’auto-parrainage. Faites la promotion de Jimmy comme vous le recommanderiez à un ami. Les conditions complètes sont dans votre tableau de bord partenaire à l’inscription.'],
      ]),
      footNote: 'Encore des questions sur le programme ?',
      footLink: 'Parlez à l’équipe',
    },
    finalCta: {
      headlinePrefix: 'Recommandez Jimmy. ',
      headlineAccent: 'Soyez payé chaque mois.',
      headlineSuffix: '',
      headlineLine2: '',
      subtitle: 'Rejoignez 700+ partenaires qui transforment leur réseau en revenu récurrent — 30% de chaque paiement, à vie.',
      ctaPrimary: 'Devenir partenaire',
      ctaSecondary: 'Estimer mes gains',
      tags: ['Inscription gratuite', '30% récurrents à vie', 'Paiements mensuels'],
    },
  },

  es: {
    title: 'Affiliate (es)',
    hero: {
      socialProof: '700+ coaches y creadores ya ganan con Jimmy',
      eyebrow: 'Programa de afiliados',
      headlinePrefix: 'Gana ',
      headlineAccent: '30% recurrente',
      headlineSuffix: ' por cada coach que recomiendes.',
      subtitle:
        'Comparte la plataforma que ya te encanta. Recibe el 30% de cada pago que tus referidos hagan a Jimmy — cada mes, mientras sigan suscritos.',
      ctaPrimary: 'Empezar a ganar',
      ctaSecondary: 'Ver cómo funciona',
    },
    calc: {
      title: '¿Cuánto podrías ganar?',
      helper: 'Arrastra para definir cuántos coaches vas a recomendar.',
      coachesSuffix: 'coaches',
      perMo: '/mes',
      estimateLabel: 'Tu estimación',
      recurringBadge: '30% recurrente',
      monthlyLabel: 'Comisión mensual',
      perYearTemplate: '≈ {v} / año',
      basisLabel: 'Plan Club medio',
      basisRangePrefix: 'Los planes Club reales van de',
      basisRangeSuffix: '— el tuyo puede rendir más.',
      footnote:
        'Estimado a partir de la suscripción Club media, no del nivel más barato. Los miembros Gratuitos no generan comisión — tus cifras reales pueden ser más altas.',
      referralsLabel: 'Referidos activos',
      perMonthLabel: 'Por referido / mes',
      perMonthTip:
        'Cada referido paga el plan Club medio de {avg}/mes — tú te quedas el {rate}% ({perRef}), cada mes que siga suscrito.',
      perYearLabel: 'Por referido / año',
      perYearTip:
        'Es la comisión de {perRef}/mes durante 12 meses — el {rate}% del plan Club medio de {avg}, pagada mientras siga suscrito.',
      cta: 'Obtener mi enlace de afiliado',
      note: 'Una ilustración basada en referidos activos que pagan. Tus ganancias reales dependen de los planes que elijan tus referidos y de cuánto tiempo sigan.',
    },
    how: {
      eyebrow: '• CÓMO FUNCIONA',
      title: 'Tres pasos hacia ingresos recurrentes.',
      subtitle: 'Regístrate, comparte tu enlace y gana cada vez que un coach que recomendaste sigue en Jimmy.',
      steps: steps([
        ['Paso 01', 'Consigue tu enlace', 'Únete gratis y copia tu enlace de referido único.'],
        ['Paso 02', 'Comparte y mide', 'Publícalo donde quieras — cada clic se mide en directo.'],
        ['Paso 03', 'Cobra y retira', 'Tus referidos te pagan el 30% al mes — retira cuando quieras.'],
      ]),
      labels: {
        partnerBarTitle: 'Hazte partner',
        freeBadge: 'Gratis',
        accountName: 'Alex Coach',
        accountRole: 'Cuenta de partner',
        approved: 'Aprobado',
        referralLinkLabel: 'Tu enlace de referido',
        copy: 'Copiar',
        copied: 'Copiado',
        copiedToast: 'Enlace copiado al portapapeles',
        tagsStep1: ['Aprobación instantánea', 'Enlace personalizado', 'Cookie de 90 días'],
        shareBarTitle: 'Comparte y mide',
        liveBadge: 'En directo',
        linkClicksLabel: 'Clics en el enlace',
        clicksBadge: '+18% esta semana',
        channels: channels([
          ['Instagram', 'Enlace en bio'],
          ['WhatsApp', 'Envío directo'],
          ['Newsletter', 'Campaña de email'],
        ]),
        tagsStep2: ['Tiempo real', 'Por canal', 'Seguimiento UTM'],
        commissionsBarTitle: 'Comisiones',
        monthBadge: 'Este mes',
        availableLabel: 'Disponible para retirar',
        withdraw: 'Retirar',
        newPaymentTemplate: 'Nuevo pago de {amt} recibido',
        completed: 'Completado',
        commissionTag: 'Comisión Jimmy',
        tagsStep3: ['Pagos mensuales', 'Stripe y PayPal', 'De por vida'],
      },
    },
    why: {
      eyebrow: 'Por qué asociarte con Jimmy',
      title: 'Hecho para pagarte, con justicia.',
      cards: cards([
        ['Recurrente, no puntual', 'Ganas el 30% cada mes que un referido siga suscrito — no una simple prima del primer pago. Tus ingresos se acumulan.'],
        ['Cookie de 90 días', 'Si alguien se registra dentro de los 90 días tras hacer clic en tu enlace, el referido es tuyo — aunque tarde en decidirse.'],
        ['Panel en tiempo real', 'Mide clics, registros, referidos activos y pagos pendientes en directo. Sin suposiciones, sin esperar un informe mensual.'],
        ['Pagos mensuales fiables', 'Se pagan cada mes vía Stripe o PayPal al alcanzar un mínimo de 50 €. Extractos claros, sin sorpresas.'],
      ]),
    },
    who: {
      title: 'Hecho para personas en quienes los coaches ya confían.',
      subtitle: 'Si tu audiencia entrena, entrena a otros o tiene un negocio fitness — Jimmy se recomienda solo.',
      items: whoItems([
        ['Creadores de contenido fitness', 'Convierte tu audiencia en ingresos recurrentes.'],
        ['Coaches y miembros actuales', 'Recomienda la herramienta que ya usas a diario.'],
        ['Dueños de gimnasios y boxes', 'Recomienda a los coaches de tu red.'],
        ['Comunidades y newsletters', 'Comparte con una audiencia lista para entrenar.'],
      ]),
    },
    faq: {
      eyebrow: 'Preguntas frecuentes',
      title: 'Tus preguntas, respondidas.',
      items: faq([
        ['¿Cuánto gano, exactamente?', 'Ganas el 30% de cada pago que tus referidos hacen a Jimmy — de forma recurrente, cada mes que sigan suscritos. Recomienda diez coaches en el plan Club de 79 € y son unos 237 € al mes, mientras mantengan su suscripción.'],
        ['¿La comisión es realmente recurrente?', 'Sí. No es una prima única — es una comisión recurrente de por vida. Mientras un coach que recomendaste siga pagando Jimmy, tú ganas tu 30% cada mes.'],
        ['¿Cuándo y cómo cobro?', 'Los pagos salen cada mes vía Stripe o PayPal cuando tu saldo supera los 50 €. Todo — clics, registros y comisiones pendientes — se ve en directo en tu panel de partner.'],
        ['¿Cuánto tiempo se rastrea el referido?', 'Usamos una cookie de 90 días. Si alguien hace clic en tu enlace y se registra en cualquier momento dentro de los 90 días, el referido — y su comisión recurrente — se te atribuye.'],
        ['¿Necesito ser cliente de Jimmy?', 'No. Cualquiera puede unirse al programa de afiliados gratis — creadores, comunidades y dueños de gimnasios incluidos. Ayuda conocer coaches, pero no necesitas una cuenta de pago para empezar a ganar.'],
        ['¿Hay reglas que deba conocer?', 'Sé honesto — nada de pujar por la marca, spam ni autorreferidos. Promociona Jimmy como se lo recomendarías a un amigo. Los términos completos están en tu panel de partner al unirte.'],
      ]),
      footNote: '¿Aún tienes preguntas sobre el programa?',
      footLink: 'Habla con el equipo',
    },
    finalCta: {
      headlinePrefix: 'Recomienda Jimmy. ',
      headlineAccent: 'Cobra cada mes.',
      headlineSuffix: '',
      headlineLine2: '',
      subtitle: 'Únete a 700+ partners que convierten su red en ingresos recurrentes — 30% de cada pago, de por vida.',
      ctaPrimary: 'Hazte partner',
      ctaSecondary: 'Estimar mis ganancias',
      tags: ['Unirse es gratis', '30% recurrente de por vida', 'Pagos mensuales'],
    },
  },
}

async function run() {
  await client.createOrReplace(SETTINGS)
  console.log('✔ seeded affiliateSettings (calculator numbers)')

  let tx = client.transaction()
  for (const [locale, d] of Object.entries(PAGE)) {
    tx = tx.createOrReplace({
      _id: `affiliatePage-${locale}`,
      _type: 'affiliatePage',
      language: locale,
      ...d,
    })
  }
  await tx.commit()
  console.log('✔ seeded affiliatePage en/fr/es')
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
