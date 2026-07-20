'use client'

import { LazyMotion, domAnimation } from 'framer-motion'
import type { ReactNode } from 'react'

/**
 * Loads only framer-motion's DOM-animation feature set (~18 KB) instead of the
 * full `motion` bundle (~120 KB). Every animated component uses the lightweight
 * `m` component (not `motion`); `strict` makes any stray `motion` usage throw at
 * render, so a missed conversion can't silently pull the full bundle back in.
 *
 * `domAnimation` covers animate/variants/exit + whileInView/hover/tap gestures —
 * everything this site uses. (No `layout`/`drag` props → domMax not needed.)
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  )
}
