import {
  Rocket,
  Smartphone,
  Dumbbell,
  Users,
  CreditCard,
  HeartHandshake,
  type LucideIcon,
} from 'lucide-react'
import type { GuideCategoryKey } from '@/lib/guides'

export type CategoryMeta = {
  label: string
  Icon: LucideIcon
  accent: string       // Tailwind-safe colour for the icon chip bg (inline style)
  accentFg: string     // Text / icon colour on the chip
  description: string  // Used on the landing page category cards
}

export const GUIDE_CATEGORY_META: Record<GuideCategoryKey, CategoryMeta> = {
  'getting-started': {
    label: 'Getting started',
    Icon: Rocket,
    accent: 'rgba(138,50,224,0.10)',
    accentFg: '#7929c9',
    description: 'Everything you need to go from zero to coaching live clients in your branded app.',
  },
  'branded-app': {
    label: 'Your branded app',
    Icon: Smartphone,
    accent: 'rgba(56,189,248,0.13)',
    accentFg: '#0369a1',
    description: 'Logo, colors, store publishing and push notifications — make the app yours.',
  },
  programming: {
    label: 'Programming',
    Icon: Dumbbell,
    accent: 'rgba(217,119,6,0.12)',
    accentFg: '#b45309',
    description: 'Build training blocks, track PRs and use ready-made templates for Hyrox & CrossFit.',
  },
  community: {
    label: 'Community',
    Icon: Users,
    accent: 'rgba(16,185,129,0.12)',
    accentFg: '#0f766e',
    description: 'Launch your community feed, create client groups and keep conversations in one place.',
  },
  payments: {
    label: 'Payments',
    Icon: CreditCard,
    accent: 'rgba(192,38,211,0.10)',
    accentFg: '#a21caf',
    description: 'Connect Stripe, create subscription plans and understand your payouts and fees.',
  },
  retention: {
    label: 'Clients & retention',
    Icon: HeartHandshake,
    accent: 'rgba(239,68,68,0.10)',
    accentFg: '#dc2626',
    description: 'Structured onboarding, early churn signals and tactics to keep clients for longer.',
  },
}
