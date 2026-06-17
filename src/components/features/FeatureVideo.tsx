'use client'

/**
 * FeatureVideo — plays a real screen-recording inside the hero panel in place
 * of an animated demo. Muted/looping/inline so it autoplays everywhere; gated
 * by `active` (in-view) to save battery, and pauses on the poster frame under
 * prefers-reduced-motion.
 */

import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import type { FeatureMedia } from '@/lib/features'

export function FeatureVideo({
  media,
  active,
}: {
  media: FeatureMedia
  active: boolean
}) {
  const reduce = useReducedMotion() ?? false
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (active && !reduce) {
      const p = el.play()
      // Swallow the AbortError that fires if we pause before play() resolves.
      if (p && typeof p.catch === 'function') p.catch(() => {})
    } else {
      el.pause()
    }
  }, [active, reduce])

  return (
    <video
      ref={ref}
      poster={media.poster}
      width={media.width}
      height={media.height}
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
      className="block h-auto w-full"
      style={{ aspectRatio: `${media.width} / ${media.height}` }}
    >
      <source src={media.mp4} type="video/mp4" />
    </video>
  )
}
