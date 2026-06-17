/**
 * featureMeta.tsx
 *
 * Lucide icon maps for feature pages.
 * Kept in a .tsx file (React is imported) so icons render as JSX.
 * The data layer (features.ts) stores icon *keys* to stay plain TS.
 */

import {
  Dumbbell,
  GraduationCap,
  Users,
  MessageCircle,
  CreditCard,
  TrendingUp,
  // caps icons
  Blocks,
  Video,
  Copy,
  Layers,
  Lock,
  Award,
  MessageSquare,
  Megaphone,
  Trophy,
  Mic,
  Image,
  Repeat,
  BarChart3,
  Activity,
  Flame,
  type LucideProps,
} from 'lucide-react'
import type { ReactNode } from 'react'

// ── Feature header icon map ────────────────────────────────────────────────────
// Keyed by iconKey values in Feature.iconKey

type IconComponent = (props: LucideProps) => ReactNode

export const FEATURE_ICON_MAP: Record<string, IconComponent> = {
  dumbbell:        (p) => <Dumbbell {...p} />,
  'graduation-cap': (p) => <GraduationCap {...p} />,
  users:           (p) => <Users {...p} />,
  'message-circle': (p) => <MessageCircle {...p} />,
  'credit-card':   (p) => <CreditCard {...p} />,
  'trending-up':   (p) => <TrendingUp {...p} />,
}

// ── Caps (capabilities grid) icon map ─────────────────────────────────────────
// Keyed by FeatureCap.iconKey values

export const CAPS_ICON_MAP: Record<string, IconComponent> = {
  blocks:          (p) => <Blocks {...p} />,
  video:           (p) => <Video {...p} />,
  copy:            (p) => <Copy {...p} />,
  layers:          (p) => <Layers {...p} />,
  lock:            (p) => <Lock {...p} />,
  award:           (p) => <Award {...p} />,
  'message-square': (p) => <MessageSquare {...p} />,
  megaphone:       (p) => <Megaphone {...p} />,
  trophy:          (p) => <Trophy {...p} />,
  'message-circle': (p) => <MessageCircle {...p} />,
  mic:             (p) => <Mic {...p} />,
  image:           (p) => <Image {...p} />,
  repeat:          (p) => <Repeat {...p} />,
  'bar-chart-3':   (p) => <BarChart3 {...p} />,
  'trending-up':   (p) => <TrendingUp {...p} />,
  activity:        (p) => <Activity {...p} />,
  flame:           (p) => <Flame {...p} />,
}
