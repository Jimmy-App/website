import { createClient } from "@sanity/client";

const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  process.env.SANITY_PROJECT_ID ||
  "";
const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  process.env.SANITY_DATASET ||
  "";
const token = process.env.SANITY_API_TOKEN || "";

if (!projectId || !dataset) {
  console.error("Missing SANITY project id or dataset.");
  process.exit(1);
}

if (!token) {
  console.error("Missing SANITY_API_TOKEN for write access.");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-02-01",
  useCdn: false,
  token,
});

const baseContent = {
  title: "Landing Page",
  cta: {
    waitlistLabel: "Join Waitlist",
  },
  hero: {
    badgeText: "Waitlist Open",
    title: "The operating system for",
    titleHighlight: "independent coaches",
    subtitle:
      "Stop hacking together Excel and WhatsApp. {brand} is the workspace built for solopreneurs to manage clients, programming, and progress.",
    inputPlaceholder: "Enter your email...",
    socialProofText: "Join 400+ other coaches waiting for access.",
    successMessage: "You're on the list! Keep an eye on your inbox.",
  },
  problem: {
    title: "Why is fitness software so...",
    titleHighlight: "painful?",
    subtitle:
      "Most tools force you to choose between chaos and complexity. We chose neither.",
    cards: [
      {
        key: "spreadsheet",
        title: 'The "Spreadsheet" Hell',
        body:
          "You spend Sunday nights copy-pasting cells instead of resting. Formulas break. Links expire. It's not scalable.",
      },
      {
        key: "enterprise",
        title: 'The "Enterprise" Overkill',
        body:
          "Built for big box gyms. You don't need turnstile integrations, payroll systems, or 15 clicks just to assign a squat.",
      },
      {
        key: "jimmy",
        title: "The Jimmy Way",
        body:
          "Just Coaching. Fast, intuitive, and built for the workflow of a solo business owner.",
        badge: "New",
        ctaLabel: "See how it works",
        uiActionLabel: "Update Program",
        uiStatusLabel: "Active",
      },
    ],
  },
  coachFeatures: {
    badgeText: "The Coach Experience",
    title: "Program at the",
    titleHighlight: "speed of thought.",
    subtitle:
      "We stripped away the clunky menus and slow loading times. Everything you need to run your business is one click away.",
    builder: {
      title: "Drag-and-drop with Video",
      body:
        "Create programs in seconds. Attach videos, save templates, and automate progressions faster than writing on paper.",
      weekLabel: "Week 1: Strength Block",
      exerciseItems: ["Back Squat", "Romanian Deadlift", "Walking Lunges"],
      exerciseDetail: "3 sets x 8 reps @ RPE 8",
    },
    payments: {
      title: "Get paid while you sleep",
      body:
        "Automate your income. Charge clients directly through the app and track revenue without chasing transfers.",
      revenueLabel: "Monthly Revenue",
      revenueDelta: "+12%",
      revenueAmount: "$4,250.00",
      notificationTitle: "New Subscription",
      notificationBody: "Anna K. just paid $150",
    },
    chat: {
      title: "1:1 & Group Chat",
      body:
        "Direct real-time chat included. Send voice notes, videos, and feedback instantly. Group chats for community.",
      messageText: "Form felt way better today! Should I increase weight?",
      avatarInitials: "JD",
    },
    health: {
      title: "The Full Picture",
      body:
        "We sync with Apple Health & Google Fit. See steps, sleep, and activity data automatically.",
      stats: [
        { label: "Steps", value: "12,403" },
        { label: "Sleep", value: "7h 42m" },
      ],
      syncedLabel: "Synced",
      appleHealthAlt: "Apple Health",
      googleFitAlt: "Google Fit",
    },
  },
  clientExperience: {
    badgeText: "The Client Experience",
    title: "Frictionless, fun workout tracking.",
    subtitle:
      "Your clients don't want a spreadsheet on their phone. They want an experience.",
    logging: {
      title: "One thumb is enough.",
      body: "Big buttons, intuitive RPE sliders, and auto-advancing sets.",
      tagLabel: "Client favorite",
      uiExerciseName: "Bench Press",
      uiSetLabel: "Set 2 of 4",
      uiWeightLabel: "185 lbs",
      uiIntensityLowLabel: "Easy",
      uiIntensityHighLabel: "Hard",
      uiRpeLabel: "RPE 8",
      uiButtonLabel: "Log Set",
    },
    timer: {
      title: "The timer that follows them.",
      body:
        "Timer stays visible on the Lock Screen and Dynamic Island while they switch apps or change music.",
      uiRestLabel: "Rest",
      uiTimerValue: "00:42",
      uiLockLabel: "Lock Screen",
      uiLockValue: "Resting: 00:42",
    },
    offline: {
      title: 'Works in the "Dungeon" Gyms.',
      body:
        "Zero loading spinners. Works fully offline in basement gyms and syncs when they surface.",
      uiStatusLabel: "Auto-sync active",
    },
    chat: {
      title: "Chat with your Coach.",
      body:
        "Need help with form? Send a video or voice note directly in the app. Clients can also join Community Groups to stay motivated with your team.",
      uiVoiceNoteLabel: "Voice Note • 0:24",
    },
    sync: {
      title: "Your watch talks to Jimmy.",
      body:
        "Seamless integration with Apple Health & Google Fit. Steps, sleep, and cardio data sync automatically, so they don't have to enter it manually.",
      stats: [
        { label: "Steps", value: "10k+" },
        { label: "Sleep", value: "Synced" },
      ],
      appleHealthAlt: "Apple Health",
      googleFitAlt: "Google Fit",
    },
    video: {
      title: 'No more "What is this exercise?".',
      body:
        "Every exercise comes with high-quality video demonstrations. Clients can watch, learn, and perform with confidence.",
    },
  },
  pricing: {
    badgeText: "Pricing Plans",
    title: "Grow first.",
    titleHighlight: "Pay later.",
    subtitle:
      "A pricing model that aligns with your success. Start for free and upgrade only when your business grows.",
    popularBadgeLabel: "Most Popular",
    secondaryHelperText: "Compare features and limits for 200+ clients",
    plans: [
      {
        name: "The Starter",
        price: "€0",
        period: "/mo",
        clients: "Up to 5 Clients",
        description: "Perfect for getting started.",
        isFeatured: false,
        features: [
          { label: "Core Workout Builder (Drag & Drop)", isAddon: false },
          { label: "1:1 Direct Client Chat", isAddon: false },
          { label: "Basic Exercise Library (Videos)", isAddon: false },
          { label: "Apple Health & Google Fit Sync", isAddon: false },
          { label: "Mobile App for Clients (Offline-first)", isAddon: false },
          { label: "Member Payments & Billing", isAddon: true },
        ],
      },
      {
        name: "The Growth",
        price: "€49",
        period: "/mo",
        clients: "Up to 30 Clients",
        description: "For growing coaching businesses.",
        isFeatured: true,
        features: [
          { label: "Everything in Starter", isAddon: false },
          { label: "Revenue Analytics & Projections", isAddon: false },
          { label: "Advanced Progression Tracking", isAddon: false },
          { label: "Custom Workout Templates", isAddon: false },
          { label: "Priority Email Support", isAddon: false },
          { label: "Member Payments & Billing", isAddon: true },
        ],
      },
      {
        name: "The Elite",
        price: "€99",
        period: "/mo",
        clients: "Up to 200 Clients",
        description: "Maximum scale and automation.",
        isFeatured: false,
        features: [
          { label: "Everything in Growth", isAddon: false },
          { label: "Group Chats & Community Groups", isAddon: false },
          { label: "Advanced Branding (Your colors/logo)", isAddon: false },
          { label: "Bulk Program Assignment", isAddon: false },
          { label: "Exportable Data & Reports", isAddon: false },
          { label: "Priority 1:1 Support", isAddon: false },
        ],
      },
    ],
  },
  manifesto: {
    badgeText: "Our Mission",
    title: "Built for the",
    titleHighlight: "Independent.",
    bodyPrefix:
      "We are building Jimmy because we believe the future of fitness is ",
    bodyEmphasis: "independent coaches",
    bodyMiddle:
      ", not faceless franchises. We are here to give you the same tools the big guys have, ",
    bodyStrong: "without the enterprise price tag.",
    inputPlaceholder: "Enter your email...",
    socialProofText: "Join 400+ other coaches waiting for access.",
    successMessage: "You're on the list! Keep an eye on your inbox.",
  },
};

const spanishContent = {
  title: "Página de aterrizaje",
  cta: {
    waitlistLabel: "Únete a la lista de espera",
  },
  hero: {
    badgeText: "Lista de espera abierta",
    title: "El sistema operativo para",
    titleHighlight: "entrenadores independientes",
    subtitle:
      "Deja de improvisar con Excel y WhatsApp. {brand} es el espacio de trabajo creado para emprendedores individuales para gestionar clientes, programación y progreso.",
    inputPlaceholder: "Introduce tu correo...",
    socialProofText: "Únete a más de 400 entrenadores esperando acceso.",
    successMessage: "Estás en la lista! Mantente atento a tu bandeja de entrada.",
  },
  problem: {
    title: "Por qué el software fitness es tan...",
    titleHighlight: "doloroso?",
    subtitle:
      "La mayoría de las herramientas te obligan a elegir entre caos y complejidad. Nosotros no elegimos ninguna.",
    cards: [
      {
        key: "spreadsheet",
        title: 'El infierno de las "hojas de cálculo"',
        body:
          "Pasas las noches del domingo copiando y pegando celdas en lugar de descansar. Las fórmulas se rompen. Los enlaces caducan. No escala.",
      },
      {
        key: "enterprise",
        title: 'La sobrecarga "Enterprise"',
        body:
          "Hecho para grandes gimnasios. No necesitas integraciones de torniquetes, sistemas de nómina ni 15 clics solo para asignar una sentadilla.",
      },
      {
        key: "jimmy",
        title: "La forma Jimmy",
        body:
          "Solo coaching. Rápido, intuitivo y creado para el flujo de trabajo de un negocio individual.",
        badge: "Nuevo",
        ctaLabel: "Ver cómo funciona",
        uiActionLabel: "Actualizar programa",
        uiStatusLabel: "Activo",
      },
    ],
  },
  coachFeatures: {
    badgeText: "La experiencia del entrenador",
    title: "Programa a la",
    titleHighlight: "velocidad del pensamiento.",
    subtitle:
      "Eliminamos los menús pesados y los tiempos de carga lentos. Todo lo que necesitas para llevar tu negocio está a un clic.",
    builder: {
      title: "Arrastrar y soltar con video",
      body:
        "Crea programas en segundos. Adjunta videos, guarda plantillas y automatiza progresiones más rápido que escribir en papel.",
      weekLabel: "Semana 1: Bloque de fuerza",
      exerciseItems: [
        "Sentadilla trasera",
        "Peso muerto rumano",
        "Zancadas caminando",
      ],
      exerciseDetail: "3 series x 8 repeticiones @ RPE 8",
    },
    payments: {
      title: "Cobra mientras duermes",
      body:
        "Automatiza tus ingresos. Cobra a tus clientes directamente en la app y rastrea ingresos sin perseguir transferencias.",
      revenueLabel: "Ingresos mensuales",
      revenueDelta: "+12%",
      revenueAmount: "$4,250.00",
      notificationTitle: "Nueva suscripción",
      notificationBody: "Anna K. acaba de pagar $150",
    },
    chat: {
      title: "Chat 1:1 y de grupo",
      body:
        "Chat directo en tiempo real incluido. Envía notas de voz, videos y comentarios al instante. Chats de grupo para la comunidad.",
      messageText: "La técnica se sintió mucho mejor hoy! Debería aumentar el peso?",
      avatarInitials: "JD",
    },
    health: {
      title: "La imagen completa",
      body:
        "Sincronizamos con Apple Health y Google Fit. Ve pasos, sueño y actividad automáticamente.",
      stats: [
        { label: "Pasos", value: "12,403" },
        { label: "Sueño", value: "7h 42m" },
      ],
      syncedLabel: "Sincronizado",
      appleHealthAlt: "Apple Health",
      googleFitAlt: "Google Fit",
    },
  },
  clientExperience: {
    badgeText: "La experiencia del cliente",
    title: "Seguimiento de entrenamientos sin fricción y divertido.",
    subtitle:
      "Tus clientes no quieren una hoja de cálculo en su teléfono. Quieren una experiencia.",
    logging: {
      title: "Un pulgar es suficiente.",
      body: "Botones grandes, controles RPE intuitivos y series que avanzan solas.",
      tagLabel: "Favorito de los clientes",
      uiExerciseName: "Press de banca",
      uiSetLabel: "Serie 2 de 4",
      uiWeightLabel: "185 lb",
      uiIntensityLowLabel: "Fácil",
      uiIntensityHighLabel: "Difícil",
      uiRpeLabel: "RPE 8",
      uiButtonLabel: "Registrar serie",
    },
    timer: {
      title: "El temporizador que los acompaña.",
      body:
        "El temporizador permanece visible en la pantalla de bloqueo y en Dynamic Island mientras cambian de app o música.",
      uiRestLabel: "Descanso",
      uiTimerValue: "00:42",
      uiLockLabel: "Pantalla de bloqueo",
      uiLockValue: "Descansando: 00:42",
    },
    offline: {
      title: 'Funciona en los gimnasios "Dungeon".',
      body:
        "Cero spinners de carga. Funciona totalmente offline en gimnasios de sótano y sincroniza cuando vuelven a tener señal.",
      uiStatusLabel: "Auto-sincronización activa",
    },
    chat: {
      title: "Chatea con tu coach.",
      body:
        "Necesitas ayuda con la técnica? Envía un video o nota de voz directamente en la app. Los clientes también pueden unirse a Grupos de Comunidad para mantenerse motivados con tu equipo.",
      uiVoiceNoteLabel: "Nota de voz • 0:24",
    },
    sync: {
      title: "Tu reloj habla con Jimmy.",
      body:
        "Integración perfecta con Apple Health y Google Fit. Los datos de pasos, sueño y cardio se sincronizan automáticamente, para que no tengan que introducirlos manualmente.",
      stats: [
        { label: "Pasos", value: "10k+" },
        { label: "Sueño", value: "Sincronizado" },
      ],
      appleHealthAlt: "Apple Health",
      googleFitAlt: "Google Fit",
    },
    video: {
      title: 'No más "Qué es este ejercicio?".',
      body:
        "Cada ejercicio incluye demostraciones en video de alta calidad. Los clientes pueden ver, aprender y ejecutar con confianza.",
    },
  },
  pricing: {
    badgeText: "Planes de precios",
    title: "Crece primero.",
    titleHighlight: "Paga después.",
    subtitle:
      "Un modelo de precios que se alinea con tu éxito. Empieza gratis y mejora solo cuando tu negocio crece.",
    popularBadgeLabel: "Más popular",
    secondaryHelperText: "Compara funciones y límites para más de 200 clientes",
    plans: [
      {
        name: "El Inicial",
        price: "€0",
        period: "/mes",
        clients: "Hasta 5 clientes",
        description: "Perfecto para empezar.",
        isFeatured: false,
        features: [
          {
            label: "Constructor básico de entrenamientos (Arrastrar y soltar)",
            isAddon: false,
          },
          { label: "Chat directo 1:1 con clientes", isAddon: false },
          { label: "Biblioteca básica de ejercicios (Videos)", isAddon: false },
          { label: "Sincronización con Apple Health y Google Fit", isAddon: false },
          { label: "App móvil para clientes (Offline primero)", isAddon: false },
          { label: "Pagos y facturación de miembros", isAddon: true },
        ],
      },
      {
        name: "El Crecimiento",
        price: "€49",
        period: "/mes",
        clients: "Hasta 30 clientes",
        description: "Para negocios de coaching en crecimiento.",
        isFeatured: true,
        features: [
          { label: "Todo lo del Inicial", isAddon: false },
          { label: "Analíticas y proyecciones de ingresos", isAddon: false },
          { label: "Seguimiento avanzado de progresión", isAddon: false },
          { label: "Plantillas de entrenamiento personalizadas", isAddon: false },
          { label: "Soporte por email prioritario", isAddon: false },
          { label: "Pagos y facturación de miembros", isAddon: true },
        ],
      },
      {
        name: "El Elite",
        price: "€99",
        period: "/mes",
        clients: "Hasta 200 clientes",
        description: "Máxima escala y automatización.",
        isFeatured: false,
        features: [
          { label: "Todo lo del Crecimiento", isAddon: false },
          { label: "Chats de grupo y comunidades", isAddon: false },
          { label: "Branding avanzado (Tus colores/logo)", isAddon: false },
          { label: "Asignación masiva de programas", isAddon: false },
          { label: "Datos y reportes exportables", isAddon: false },
          { label: "Soporte 1:1 prioritario", isAddon: false },
        ],
      },
    ],
  },
  manifesto: {
    badgeText: "Nuestra misión",
    title: "Hecho para los",
    titleHighlight: "Independientes.",
    bodyPrefix:
      "Estamos construyendo Jimmy porque creemos que el futuro del fitness es ",
    bodyEmphasis: "entrenadores independientes",
    bodyMiddle:
      ", no franquicias sin rostro. Estamos aquí para darte las mismas herramientas que tienen los grandes, ",
    bodyStrong: "sin el precio de empresa.",
    inputPlaceholder: "Introduce tu correo...",
    socialProofText: "Únete a más de 400 entrenadores esperando acceso.",
    successMessage: "Estás en la lista! Mantente atento a tu bandeja de entrada.",
  },
};

const frenchContent = {
  title: "Page d'atterrissage",
  cta: {
    waitlistLabel: "Rejoindre la liste d'attente",
  },
  hero: {
    badgeText: "Liste d'attente ouverte",
    title: "Le système d'exploitation pour",
    titleHighlight: "coachs indépendants",
    subtitle:
      "Arrête de bricoler avec Excel et WhatsApp. {brand} est l'espace de travail conçu pour les solopreneurs afin de gérer les clients, la programmation et la progression.",
    inputPlaceholder: "Entrez votre e-mail...",
    socialProofText: "Rejoignez plus de 400 coachs en attente d'accès.",
    successMessage:
      "Vous êtes sur la liste ! Gardez un oeil sur votre boîte de réception.",
  },
  problem: {
    title: "Pourquoi les logiciels de fitness sont-ils si...",
    titleHighlight: "douloureux?",
    subtitle:
      "La plupart des outils vous obligent à choisir entre chaos et complexité. Nous n'avons choisi ni l'un ni l'autre.",
    cards: [
      {
        key: "spreadsheet",
        title: "L'enfer des \"tableurs\"",
        body:
          "Vous passez les soirées du dimanche à copier-coller des cellules au lieu de vous reposer. Les formules cassent. Les liens expirent. Cela ne passe pas à l'échelle.",
      },
      {
        key: "enterprise",
        title: "La surcharge \"Enterprise\"",
        body:
          "Conçu pour les grandes salles. Vous n'avez pas besoin d'intégrations de tourniquets, de systèmes de paie ou de 15 clics juste pour assigner un squat.",
      },
      {
        key: "jimmy",
        title: "La méthode Jimmy",
        body:
          "Juste du coaching. Rapide, intuitif, et conçu pour le flux de travail d'un indépendant.",
        badge: "Nouveau",
        ctaLabel: "Voir comment ça marche",
        uiActionLabel: "Mettre à jour le programme",
        uiStatusLabel: "Actif",
      },
    ],
  },
  coachFeatures: {
    badgeText: "L'expérience coach",
    title: "Programmez à la",
    titleHighlight: "vitesse de la pensée.",
    subtitle:
      "Nous avons supprimé les menus lourds et les temps de chargement lents. Tout ce dont vous avez besoin pour gérer votre activité est à un clic.",
    builder: {
      title: "Glisser-déposer avec vidéo",
      body:
        "Créez des programmes en quelques secondes. Ajoutez des vidéos, enregistrez des modèles, et automatisez les progressions plus vite que sur papier.",
      weekLabel: "Semaine 1 : Bloc de force",
      exerciseItems: [
        "Squat arrière",
        "Soulevé de terre roumain",
        "Fentes marchées",
      ],
      exerciseDetail: "3 séries x 8 répétitions @ RPE 8",
    },
    payments: {
      title: "Encaissez pendant que vous dormez",
      body:
        "Automatisez vos revenus. Faites payer vos clients directement dans l'app et suivez les revenus sans courir après les virements.",
      revenueLabel: "Revenu mensuel",
      revenueDelta: "+12%",
      revenueAmount: "$4,250.00",
      notificationTitle: "Nouvel abonnement",
      notificationBody: "Anna K. vient de payer $150",
    },
    chat: {
      title: "Chat 1:1 et de groupe",
      body:
        "Chat direct en temps réel inclus. Envoyez des notes vocales, des vidéos et des retours instantanément. Chats de groupe pour la communauté.",
      messageText:
        "La technique était bien meilleure aujourd'hui ! Dois-je augmenter la charge?",
      avatarInitials: "JD",
    },
    health: {
      title: "La vue d'ensemble",
      body:
        "Nous synchronisons avec Apple Health et Google Fit. Voyez les pas, le sommeil et l'activité automatiquement.",
      stats: [
        { label: "Pas", value: "12,403" },
        { label: "Sommeil", value: "7h 42m" },
      ],
      syncedLabel: "Synchronisé",
      appleHealthAlt: "Apple Health",
      googleFitAlt: "Google Fit",
    },
  },
  clientExperience: {
    badgeText: "L'expérience client",
    title: "Suivi d'entraînement sans friction, fun.",
    subtitle:
      "Vos clients ne veulent pas un tableur sur leur téléphone. Ils veulent une expérience.",
    logging: {
      title: "Un pouce suffit.",
      body:
        "Grands boutons, curseurs RPE intuitifs, et séries qui avancent automatiquement.",
      tagLabel: "Préféré des clients",
      uiExerciseName: "Développé couché",
      uiSetLabel: "Série 2 sur 4",
      uiWeightLabel: "185 lb",
      uiIntensityLowLabel: "Facile",
      uiIntensityHighLabel: "Difficile",
      uiRpeLabel: "RPE 8",
      uiButtonLabel: "Enregistrer la série",
    },
    timer: {
      title: "Le minuteur qui les suit.",
      body:
        "Le minuteur reste visible sur l'écran verrouillé et Dynamic Island pendant qu'ils changent d'app ou de musique.",
      uiRestLabel: "Repos",
      uiTimerValue: "00:42",
      uiLockLabel: "Écran verrouillé",
      uiLockValue: "Repos : 00:42",
    },
    offline: {
      title: "Fonctionne dans les salles \"Dungeon\".",
      body:
        "Zéro spinner de chargement. Fonctionne entièrement hors ligne dans les salles en sous-sol et se synchronise quand ils remontent.",
      uiStatusLabel: "Synchronisation auto active",
    },
    chat: {
      title: "Discutez avec votre coach.",
      body:
        "Besoin d'aide sur la technique ? Envoyez une vidéo ou une note vocale directement dans l'app. Les clients peuvent aussi rejoindre des groupes communautaires pour rester motivés.",
      uiVoiceNoteLabel: "Note vocale • 0:24",
    },
    sync: {
      title: "Votre montre parle à Jimmy.",
      body:
        "Intégration fluide avec Apple Health et Google Fit. Les données de pas, sommeil et cardio se synchronisent automatiquement, sans saisie manuelle.",
      stats: [
        { label: "Pas", value: "10k+" },
        { label: "Sommeil", value: "Synchronisé" },
      ],
      appleHealthAlt: "Apple Health",
      googleFitAlt: "Google Fit",
    },
    video: {
      title: "Plus de \"C'est quoi cet exercice?\".",
      body:
        "Chaque exercice inclut des démonstrations vidéo de haute qualité. Les clients peuvent voir, apprendre et exécuter en confiance.",
    },
  },
  pricing: {
    badgeText: "Plans tarifaires",
    title: "Grandissez d'abord.",
    titleHighlight: "Payez ensuite.",
    subtitle:
      "Un modèle tarifaire aligné sur votre réussite. Commencez gratuitement et évoluez seulement quand votre activité grandit.",
    popularBadgeLabel: "Le plus populaire",
    secondaryHelperText:
      "Comparez les fonctionnalités et les limites pour plus de 200 clients",
    plans: [
      {
        name: "Le Starter",
        price: "€0",
        period: "/mois",
        clients: "Jusqu'à 5 clients",
        description: "Parfait pour commencer.",
        isFeatured: false,
        features: [
          {
            label: "Constructeur d'entraînement de base (Glisser-déposer)",
            isAddon: false,
          },
          { label: "Chat direct 1:1 avec les clients", isAddon: false },
          { label: "Bibliothèque d'exercices de base (Vidéos)", isAddon: false },
          { label: "Synchronisation Apple Health et Google Fit", isAddon: false },
          { label: "App mobile pour clients (Hors ligne d'abord)", isAddon: false },
          { label: "Paiements et facturation des membres", isAddon: true },
        ],
      },
      {
        name: "La Croissance",
        price: "€49",
        period: "/mois",
        clients: "Jusqu'à 30 clients",
        description: "Pour les activités de coaching en croissance.",
        isFeatured: true,
        features: [
          { label: "Tout ce qui est dans Starter", isAddon: false },
          { label: "Analyses et projections de revenus", isAddon: false },
          { label: "Suivi avancé de la progression", isAddon: false },
          { label: "Modèles d'entraînement personnalisés", isAddon: false },
          { label: "Support email prioritaire", isAddon: false },
          { label: "Paiements et facturation des membres", isAddon: true },
        ],
      },
      {
        name: "L'Élite",
        price: "€99",
        period: "/mois",
        clients: "Jusqu'à 200 clients",
        description: "Échelle maximale et automatisation.",
        isFeatured: false,
        features: [
          { label: "Tout ce qui est dans Croissance", isAddon: false },
          { label: "Chats de groupe et communautés", isAddon: false },
          { label: "Branding avancé (Vos couleurs/logo)", isAddon: false },
          { label: "Attribution de programmes en masse", isAddon: false },
          { label: "Données et rapports exportables", isAddon: false },
          { label: "Support 1:1 prioritaire", isAddon: false },
        ],
      },
    ],
  },
  manifesto: {
    badgeText: "Notre mission",
    title: "Conçu pour les",
    titleHighlight: "Indépendants.",
    bodyPrefix:
      "Nous construisons Jimmy parce que nous croyons que l'avenir du fitness est ",
    bodyEmphasis: "les coachs indépendants",
    bodyMiddle:
      ", pas des franchises sans visage. Nous sommes là pour vous donner les mêmes outils que les grands, ",
    bodyStrong: "sans le prix entreprise.",
    inputPlaceholder: "Entrez votre e-mail...",
    socialProofText: "Rejoignez plus de 400 coachs en attente d'accès.",
    successMessage:
      "Vous êtes sur la liste ! Gardez un oeil sur votre boîte de réception.",
  },
};

const ukrainianContent = {
  title: "Посадкова сторінка",
  cta: {
    waitlistLabel: "Приєднатися до списку очікування",
  },
  hero: {
    badgeText: "Список очікування відкрито",
    title: "Операційна система для",
    titleHighlight: "незалежних тренерів",
    subtitle:
      "Перестаньте склеювати все з Excel і WhatsApp. {brand} — робочий простір для солопренерів, щоб керувати клієнтами, програмами та прогресом.",
    inputPlaceholder: "Введіть свій email...",
    socialProofText: "Приєднуйтесь до понад 400 тренерів, які чекають доступу.",
    successMessage: "Ви у списку! Слідкуйте за своєю поштою.",
  },
  problem: {
    title: "Чому фітнес-софт такий...",
    titleHighlight: "болісний?",
    subtitle:
      "Більшість інструментів змушують обирати між хаосом і складністю. Ми не обрали жодного.",
    cards: [
      {
        key: "spreadsheet",
        title: 'Пекло "таблиць"',
        body:
          "Ви витрачаєте недільні вечори на копіювання клітинок замість відпочинку. Формули ламаються. Посилання зникають. Це не масштабується.",
      },
      {
        key: "enterprise",
        title: 'Перебір "Enterprise"',
        body:
          "Зроблено для великих фітнес-клубів. Вам не потрібні інтеграції турнікетів, системи зарплат або 15 кліків, щоб призначити присідання.",
      },
      {
        key: "jimmy",
        title: "Підхід Jimmy",
        body:
          "Лише коучинг. Швидко, інтуїтивно й створено для робочого процесу власника сольного бізнесу.",
        badge: "Нове",
        ctaLabel: "Подивитися, як це працює",
        uiActionLabel: "Оновити програму",
        uiStatusLabel: "Активний",
      },
    ],
  },
  coachFeatures: {
    badgeText: "Досвід тренера",
    title: "Програмуйте на",
    titleHighlight: "швидкості думки.",
    subtitle:
      "Ми прибрали незручні меню й повільні завантаження. Усе, що потрібно для бізнесу, — в один клік.",
    builder: {
      title: "Перетягування з відео",
      body:
        "Створюйте програми за секунди. Додавайте відео, зберігайте шаблони та автоматизуйте прогресії швидше, ніж писати на папері.",
      weekLabel: "Тиждень 1: Силовий блок",
      exerciseItems: [
        "Присідання зі штангою",
        "Румунська тяга",
        "Випади в ходьбі",
      ],
      exerciseDetail: "3 підходи x 8 повторів @ RPE 8",
    },
    payments: {
      title: "Отримуйте оплату, поки спите",
      body:
        "Автоматизуйте дохід. Списуйте оплату з клієнтів прямо в додатку та відстежуйте виручку без погоні за переказами.",
      revenueLabel: "Місячний дохід",
      revenueDelta: "+12%",
      revenueAmount: "$4,250.00",
      notificationTitle: "Нова підписка",
      notificationBody: "Анна К. щойно сплатила $150",
    },
    chat: {
      title: "Чат 1:1 і груповий",
      body:
        "Прямий чат у реальному часі включено. Надсилайте голосові, відео та фідбек миттєво. Групові чати для спільноти.",
      messageText:
        "Сьогодні техніка відчувалась набагато краще! Чи варто збільшити вагу?",
      avatarInitials: "JD",
    },
    health: {
      title: "Повна картина",
      body:
        "Синхронізуємося з Apple Health і Google Fit. Бачте кроки, сон та активність автоматично.",
      stats: [
        { label: "Кроки", value: "12,403" },
        { label: "Сон", value: "7h 42m" },
      ],
      syncedLabel: "Синхронізовано",
      appleHealthAlt: "Apple Health",
      googleFitAlt: "Google Fit",
    },
  },
  clientExperience: {
    badgeText: "Досвід клієнта",
    title: "Трекінг тренувань без тертя та з задоволенням.",
    subtitle:
      "Ваші клієнти не хочуть таблицю на телефоні. Вони хочуть досвід.",
    logging: {
      title: "Достатньо одного великого пальця.",
      body:
        "Великі кнопки, інтуїтивні слайдери RPE та авто-перехід між підходами.",
      tagLabel: "Улюблене клієнтів",
      uiExerciseName: "Жим лежачи",
      uiSetLabel: "Підхід 2 з 4",
      uiWeightLabel: "185 lb",
      uiIntensityLowLabel: "Легко",
      uiIntensityHighLabel: "Важко",
      uiRpeLabel: "RPE 8",
      uiButtonLabel: "Записати підхід",
    },
    timer: {
      title: "Таймер, що йде за ними.",
      body:
        "Таймер залишається видимим на екрані блокування та в Dynamic Island, поки вони перемикають додатки або музику.",
      uiRestLabel: "Відпочинок",
      uiTimerValue: "00:42",
      uiLockLabel: "Екран блокування",
      uiLockValue: "Відпочинок: 00:42",
    },
    offline: {
      title: 'Працює в "Dungeon" залах.',
      body:
        "Жодних спінерів завантаження. Працює повністю офлайн у підвальних залах і синхронізується, коли вони повертаються в мережу.",
      uiStatusLabel: "Автосинхронізація активна",
    },
    chat: {
      title: "Спілкуйтеся зі своїм тренером.",
      body:
        "Потрібна допомога з технікою? Надішліть відео або голосове повідомлення прямо в додатку. Клієнти також можуть приєднуватися до груп спільноти, щоб залишатися мотивованими.",
      uiVoiceNoteLabel: "Голосове повідомлення • 0:24",
    },
    sync: {
      title: "Ваш годинник говорить з Jimmy.",
      body:
        "Безшовна інтеграція з Apple Health і Google Fit. Дані про кроки, сон і кардіо синхронізуються автоматично, тож не потрібно вводити їх вручну.",
      stats: [
        { label: "Кроки", value: "10k+" },
        { label: "Сон", value: "Синхронізовано" },
      ],
      appleHealthAlt: "Apple Health",
      googleFitAlt: "Google Fit",
    },
    video: {
      title: "Більше ніяких \"Що це за вправа?\".",
      body:
        "Кожна вправа має якісні відеодемонстрації. Клієнти можуть дивитися, вчитися та виконувати з упевненістю.",
    },
  },
  pricing: {
    badgeText: "Тарифні плани",
    title: "Спочатку зростайте.",
    titleHighlight: "Платіть потім.",
    subtitle:
      "Модель цін, що узгоджується з вашим успіхом. Починайте безкоштовно та переходьте на платні плани лише коли бізнес зростає.",
    popularBadgeLabel: "Найпопулярніший",
    secondaryHelperText: "Порівняйте функції та ліміти для 200+ клієнтів",
    plans: [
      {
        name: "Старт",
        price: "€0",
        period: "/міс",
        clients: "До 5 клієнтів",
        description: "Ідеально для старту.",
        isFeatured: false,
        features: [
          { label: "Базовий конструктор тренувань (Drag & Drop)", isAddon: false },
          { label: "Прямий чат 1:1 з клієнтами", isAddon: false },
          { label: "Базова бібліотека вправ (Відео)", isAddon: false },
          { label: "Синхронізація Apple Health і Google Fit", isAddon: false },
          { label: "Мобільний додаток для клієнтів (Офлайн у пріоритеті)", isAddon: false },
          { label: "Платежі та білінг клієнтів", isAddon: true },
        ],
      },
      {
        name: "Зростання",
        price: "€49",
        period: "/міс",
        clients: "До 30 клієнтів",
        description: "Для бізнесів коучингу, що ростуть.",
        isFeatured: true,
        features: [
          { label: "Все зі Старту", isAddon: false },
          { label: "Аналітика та прогнозування доходу", isAddon: false },
          { label: "Розширене відстеження прогресії", isAddon: false },
          { label: "Індивідуальні шаблони тренувань", isAddon: false },
          { label: "Пріоритетна підтримка електронною поштою", isAddon: false },
          { label: "Платежі та білінг клієнтів", isAddon: true },
        ],
      },
      {
        name: "Еліт",
        price: "€99",
        period: "/міс",
        clients: "До 200 клієнтів",
        description: "Максимальна масштабованість і автоматизація.",
        isFeatured: false,
        features: [
          { label: "Все зі Зростання", isAddon: false },
          { label: "Групові чати та спільноти", isAddon: false },
          { label: "Розширений брендинг (ваші кольори/логотип)", isAddon: false },
          { label: "Масове призначення програм", isAddon: false },
          { label: "Експорт даних і звітів", isAddon: false },
          { label: "Пріоритетна підтримка 1:1", isAddon: false },
        ],
      },
    ],
  },
  manifesto: {
    badgeText: "Наша місія",
    title: "Створено для",
    titleHighlight: "Незалежних.",
    bodyPrefix:
      "Ми створюємо Jimmy, бо віримо, що майбутнє фітнесу — ",
    bodyEmphasis: "незалежні тренери",
    bodyMiddle:
      ", а не безликі франшизи. Ми тут, щоб дати вам ті самі інструменти, що й у великих, ",
    bodyStrong: "без корпоративної ціни.",
    inputPlaceholder: "Введіть свій email...",
    socialProofText: "Приєднуйтесь до понад 400 тренерів, які чекають доступу.",
    successMessage: "Ви у списку! Слідкуйте за своєю поштою.",
  },
};

const localizedContent = {
  es: spanishContent,
  fr: frenchContent,
  ua: ukrainianContent,
};

const languages = ["en", "fr", "es", "ua"];
const targetLanguage = process.env.SANITY_SEED_LANGUAGE || "";
const selectedLanguages = targetLanguage
  ? languages.filter((language) => language === targetLanguage)
  : languages;

const documents = selectedLanguages.map((language) => ({
  _type: "landingPage",
  language,
  ...(localizedContent[language] || baseContent),
}));

const run = async () => {
  for (const doc of documents) {
    const existing = await client.fetch(
      `*[_type == "landingPage" && language == $language][0]{_id}`,
      { language: doc.language }
    );

    if (existing?._id) {
      const payload = { ...doc };
      delete payload._type;
      await client.patch(existing._id).set(payload).commit();
      console.log(`updated landingPage for ${doc.language}`);
    } else {
      await client.create(doc);
      console.log(`created landingPage for ${doc.language}`);
    }
  }
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
