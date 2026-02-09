export type ForCoachesWhyIconKey = "layers" | "wifiOff" | "piggyBank";

export type ForCoachesHeroContent = {
  badgeText?: string | null;
  title?: string | null;
  titleHighlight?: string | null;
  subtitle?: string | null;
  primaryButtonLabel?: string | null;
  secondaryButtonLabel?: string | null;
  imageAlt?: string | null;
};

export type ForCoachesWhyPointContent = {
  title?: string | null;
  body?: string | null;
  icon?: ForCoachesWhyIconKey | null;
};

export type ForCoachesWhyContent = {
  badgeText?: string | null;
  title?: string | null;
  subtitle?: string | null;
  points?: ForCoachesWhyPointContent[] | null;
};

export type ForCoachesFeatureItemContent = {
  anchorId?: string | null;
  category?: string | null;
  headline?: string | null;
  description?: string | null;
  imageSrc?: string | null;
  imageAlt?: string | null;
};

export type ForCoachesFeaturesContent = {
  title?: string | null;
  subtitle?: string | null;
  items?: ForCoachesFeatureItemContent[] | null;
};

export type ForCoachesCtaContent = {
  badgeText?: string | null;
  titleLineOne?: string | null;
  titleLineTwo?: string | null;
  bodyPrefix?: string | null;
  bodyHighlightOne?: string | null;
  bodyMiddle?: string | null;
  bodyHighlightTwo?: string | null;
  bodySuffix?: string | null;
  bodyHighlightThree?: string | null;
  bodyEnd?: string | null;
  primaryButtonLabel?: string | null;
  secondaryButtonLabel?: string | null;
  helperText?: string | null;
};

export type ForCoachesPageContent = {
  title?: string | null;
  hero?: ForCoachesHeroContent | null;
  why?: ForCoachesWhyContent | null;
  features?: ForCoachesFeaturesContent | null;
  cta?: ForCoachesCtaContent | null;
};

type ForCoachesHeroDefaults = {
  badgeText: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  primaryButtonLabel: string;
  secondaryButtonLabel: string;
  imageAlt: string;
};

type ForCoachesWhyDefaults = {
  badgeText: string;
  title: string;
  subtitle: string;
};

type ForCoachesWhyPointDefaults = {
  title: string;
  body: string;
  icon: ForCoachesWhyIconKey;
};

type ForCoachesFeaturesDefaults = {
  title: string;
  subtitle: string;
};

type ForCoachesFeatureItemDefaults = {
  anchorId: string;
  category: string;
  headline: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
};

type ForCoachesCtaDefaults = {
  badgeText: string;
  titleLineOne: string;
  titleLineTwo: string;
  bodyPrefix: string;
  bodyHighlightOne: string;
  bodyMiddle: string;
  bodyHighlightTwo: string;
  bodySuffix: string;
  bodyHighlightThree: string;
  bodyEnd: string;
  primaryButtonLabel: string;
  secondaryButtonLabel: string;
  helperText: string;
};

export const DEFAULT_FOR_COACHES_HERO_CONTENT: ForCoachesHeroDefaults = {
  badgeText: "For Coaches",
  title: "Stop coaching in",
  titleHighlight: "spreadsheets.",
  subtitle:
    "Build programs, track progress, and manage clients in one place. Jimmy is the simple, powerful tool that gives you your Sundays back.",
  primaryButtonLabel: "Join Waitlist",
  secondaryButtonLabel: "Back to home",
  imageAlt: "Jimmy dashboard platform preview",
};

export const DEFAULT_FOR_COACHES_WHY_CONTENT: ForCoachesWhyDefaults = {
  badgeText: "Why Jimmy?",
  title: "The app that doesn't require a PhD to use.",
  subtitle:
    "Most coaching apps are built for giant gym chains with 50-page manuals. Jimmy is built for you-the coach who just wants to assign a squat without clicking 15 buttons.",
};

export const DEFAULT_FOR_COACHES_WHY_POINTS: ForCoachesWhyPointDefaults[] = [
  {
    title: 'Zero "Bloatware"',
    body: "No payroll systems. No complex turnstile integrations. Just the tools you actually need to coach, programmed to be faster than your old Excel sheet.",
    icon: "layers",
  },
  {
    title: "Works Where You Work",
    body: 'Basement gym with zero signal? No problem. Jimmy is "offline-first," so your data syncs whenever the internet decides to wake up.',
    icon: "wifiOff",
  },
  {
    title: "Your Wallet Will Thank You",
    body: 'Manage up to 5 clients for free, forever. No "14-day trials" that ask for a credit card. Grow at your own pace; we only make money when you do.',
    icon: "piggyBank",
  },
];

export const DEFAULT_FOR_COACHES_FEATURES_CONTENT: ForCoachesFeaturesDefaults = {
  title: "Everything you need. Nothing you don't.",
  subtitle:
    "Directly mapped to your screenshot list: Create Programs, Exercise Database, Manage Clients, Team Chat.",
};

export const DEFAULT_FOR_COACHES_FEATURE_ITEMS: ForCoachesFeatureItemDefaults[] =
  [
    {
      anchorId: "for-coaches-create-programs",
      category: "Create Programs",
      headline: "Program faster than they can complain.",
      description:
        'Drag, drop, done. Build complex programs in minutes, not hours. Save your best workouts as templates so you never have to type "Barbell Back Squat" from scratch again.',
      imageSrc: "/assets/photo/dashboard.png",
      imageAlt: "Create Programs feature preview",
    },
    {
      anchorId: "for-coaches-exercise-database",
      category: "Exercise Database",
      headline: "A library that actually makes sense.",
      description:
        "Access hundreds of built-in exercises or add your own custom videos from YouTube. No more sending clients random Instagram links to explain a lunge.",
      imageSrc: "/assets/photo/dashboard.png",
      imageAlt: "Exercise Database feature preview",
    },
    {
      anchorId: "for-coaches-manage-clients",
      category: "Manage Clients",
      headline: "Your entire roster, sorted.",
      description:
        "See who's active, who's slacking, and who owes you a check-in-all in one view. It's like having a personal assistant who loves organizing lists.",
      imageSrc: "/assets/photo/dashboard.png",
      imageAlt: "Manage Clients feature preview",
    },
    {
      anchorId: "for-coaches-team-chat",
      category: "Team Chat",
      headline: "Keep your WhatsApp for memes.",
      description:
        "Stop mixing client check-ins with your family group chat. Keep all coaching communication, feedback, and videos in one dedicated professional channel.",
      imageSrc: "/assets/photo/dashboard.png",
      imageAlt: "Team Chat feature preview",
    },
  ];

export const DEFAULT_FOR_COACHES_CTA_CONTENT: ForCoachesCtaDefaults = {
  badgeText: "Start Free Today",
  titleLineOne: "Excel is for accountants.",
  titleLineTwo: "Jimmy is for you.",
  bodyPrefix: "Stop wasting your Sunday evenings coloring cells. Get a ",
  bodyHighlightOne: "professional system",
  bodyMiddle: " that doesn't require a science degree to use. Managing your ",
  bodyHighlightTwo: "first 5 clients is free, forever",
  bodySuffix: ". ",
  bodyHighlightThree: "No credit card required",
  bodyEnd: ".",
  primaryButtonLabel: "Start for Free",
  secondaryButtonLabel: "See Pricing",
  helperText: "Takes less than 60 seconds. Seriously.",
};
