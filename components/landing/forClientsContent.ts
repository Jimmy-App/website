export type ForClientsWhyIconKey = "zoomIn" | "clock3" | "wifiOff";

export type ForClientsHeroContent = {
  badgeText?: string | null;
  title?: string | null;
  titleHighlight?: string | null;
  subtitle?: string | null;
  primaryButtonLabel?: string | null;
  secondaryButtonLabel?: string | null;
  imageAlt?: string | null;
};

export type ForClientsWhyPointContent = {
  title?: string | null;
  body?: string | null;
  icon?: ForClientsWhyIconKey | null;
};

export type ForClientsWhyContent = {
  badgeText?: string | null;
  title?: string | null;
  points?: ForClientsWhyPointContent[] | null;
};

export type ForClientsFeatureItemContent = {
  anchorId?: string | null;
  category?: string | null;
  headline?: string | null;
  description?: string | null;
  imageSrc?: string | null;
  imageAlt?: string | null;
};

export type ForClientsFeaturesContent = {
  title?: string | null;
  subtitle?: string | null;
  items?: ForClientsFeatureItemContent[] | null;
};

export type ForClientsCtaContent = {
  badgeText?: string | null;
  title?: string | null;
  subtitle?: string | null;
  primaryButtonLabel?: string | null;
  secondaryButtonLabel?: string | null;
};

export type ForClientsPageContent = {
  title?: string | null;
  hero?: ForClientsHeroContent | null;
  why?: ForClientsWhyContent | null;
  features?: ForClientsFeaturesContent | null;
  cta?: ForClientsCtaContent | null;
};

type ForClientsHeroDefaults = {
  badgeText: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  primaryButtonLabel: string;
  secondaryButtonLabel: string;
  imageAlt: string;
};

type ForClientsWhyDefaults = {
  badgeText: string;
  title: string;
};

type ForClientsWhyPointDefaults = {
  title: string;
  body: string;
  icon: ForClientsWhyIconKey;
};

type ForClientsFeaturesDefaults = {
  title: string;
  subtitle: string;
};

type ForClientsFeatureItemDefaults = {
  anchorId: string;
  category: string;
  headline: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
};

type ForClientsCtaDefaults = {
  badgeText: string;
  title: string;
  subtitle: string;
  primaryButtonLabel: string;
  secondaryButtonLabel: string;
};

export const DEFAULT_FOR_CLIENTS_HERO_CONTENT: ForClientsHeroDefaults = {
  badgeText: "For Clients",
  title: "Your coach, now in",
  titleHighlight: "your pocket.",
  subtitle:
    "Ditch the printed PDFs, messy spreadsheets, and WhatsApp chats. Get your workouts, track your personal bests, and chat with your coach in one app that actually looks good.",
  primaryButtonLabel: "Download the App",
  secondaryButtonLabel: "Back to home",
  imageAlt: "Jimmy client app preview",
};

export const DEFAULT_FOR_CLIENTS_WHY_CONTENT: ForClientsWhyDefaults = {
  badgeText: "Why Clients Choose Jimmy",
  title: "We know what annoys you at the gym. So we fixed it.",
};

export const DEFAULT_FOR_CLIENTS_WHY_POINTS: ForClientsWhyPointDefaults[] = [
  {
    title: "Stop Pinching-to-Zoom",
    body: "No more squinting at a tiny PDF on your phone screen. Your workout is interactive, clear, and easy to read, even with sweat in your eyes.",
    icon: "zoomIn",
  },
  {
    title: "The Timer That Multitasks",
    body: "Our rest timer lives on your Lock Screen (Live Activity). Go ahead, scroll Instagram between sets, we'll ping you when it's time to lift again.",
    icon: "clock3",
  },
  {
    title: "Works in the Basement",
    body: "Is your gym in a bunker with zero Wi-Fi? No problem. Jimmy works offline and syncs your results the moment you get back to civilization.",
    icon: "wifiOff",
  },
];

export const DEFAULT_FOR_CLIENTS_FEATURES_CONTENT: ForClientsFeaturesDefaults = {
  title: "Built for training. Not for friction.",
  subtitle: "The App, Track Results, Training Log, and Stay Connected.",
};

export const DEFAULT_FOR_CLIENTS_FEATURE_ITEMS: ForClientsFeatureItemDefaults[] = [
  {
    anchorId: "for-clients-the-app",
    category: "The App",
    headline: "An app you won't hate using.",
    description:
      "Clean design, no clutter. We stripped away the complex menus so you can focus on your form, not on fighting the interface.",
    imageSrc: "/assets/photo/mock/jimmy-screen-home.svg",
    imageAlt: "Client app home preview",
  },
  {
    anchorId: "for-clients-track-results",
    category: "Track Results",
    headline: "Your personal Hall of Fame.",
    description:
      "Watch your numbers go up. Visualize your strength gains, track body weight trends, and compare progress photos side-by-side to see how far you've come.",
    imageSrc: "/assets/photo/mock/jimmy-screen-progress.svg",
    imageAlt: "Client progress tracking preview",
  },
  {
    anchorId: "for-clients-training-log",
    category: "Training Log",
    headline: "Log sets in seconds.",
    description:
      "Easily record weight, reps, and RPE. We show you your history from last week right on the screen, so you never have to guess, \"Wait, how much did I lift last time?\"",
    imageSrc: "/assets/photo/mock/jimmy-screen-workout.svg",
    imageAlt: "Client workout logging preview",
  },
  {
    anchorId: "for-clients-stay-connected",
    category: "Stay Connected",
    headline: "Feedback, exactly when you need it.",
    description:
      "Not sure about your squat depth? Record a video and send it to your coach directly inside the exercise chat. Get feedback, corrections, and high-fives without leaving the app.",
    imageSrc: "/assets/photo/mock/jimmy-screen-chats.svg",
    imageAlt: "Client chat preview",
  },
];

export const DEFAULT_FOR_CLIENTS_CTA_CONTENT: ForClientsCtaDefaults = {
  badgeText: "FOR CLIENTS",
  title: "Ready for your best workout?",
  subtitle:
    "If your coach is already on Jimmy, check your email for the invite. If not, show them this website and tell them to upgrade their game.",
  primaryButtonLabel: "Download the App",
  secondaryButtonLabel: "Show This to My Coach",
};
