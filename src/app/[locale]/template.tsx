'use client'

import { m as motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

/**
 * Page-transition wrapper. Unlike `layout.tsx`, a `template.tsx` re-mounts on
 * every navigation, so this fade fires each time the user moves between pages.
 *
 * Opacity-only by design: the page tree includes the `position: fixed` Navbar,
 * and any `transform` on this wrapper would become its containing block and
 * break the fixed header. A pure fade stays bulletproof and reads as premium
 * (PRODUCT.md — "confidence through restraint"). Reduced-motion → instant.
 */
export default function Template({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
