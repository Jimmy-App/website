import { Users, LineChart, Dumbbell, Wallet, Sparkles, type LucideIcon } from 'lucide-react'
import type { CategoryKey } from '@/lib/blog'

type CategoryMeta = {
  /** brand-leaning 2-stop gradient for cover placeholders */
  gradient: [string, string]
  /** soft pill colours (background / text) for the category chip */
  pill: { bg: string; fg: string }
  Icon: LucideIcon
}

export const CATEGORY_META: Record<CategoryKey, CategoryMeta> = {
  stories: {
    gradient: ['#6d28d9', '#a855f7'],
    pill: { bg: 'rgba(138,50,224,0.10)', fg: '#7c3aed' },
    Icon: Users,
  },
  retention: {
    gradient: ['#7c3aed', '#c026d3'],
    pill: { bg: 'rgba(192,38,211,0.10)', fg: '#a21caf' },
    Icon: LineChart,
  },
  training: {
    gradient: ['#c2620a', '#f59e0b'],
    pill: { bg: 'rgba(217,119,6,0.12)', fg: '#b45309' },
    Icon: Dumbbell,
  },
  business: {
    gradient: ['#0f766e', '#10b981'],
    pill: { bg: 'rgba(16,185,129,0.12)', fg: '#0f766e' },
    Icon: Wallet,
  },
  product: {
    gradient: ['#0369a1', '#38bdf8'],
    pill: { bg: 'rgba(56,189,248,0.14)', fg: '#0369a1' },
    Icon: Sparkles,
  },
}
