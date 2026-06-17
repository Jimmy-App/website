'use client'

/**
 * BrandedAppDemo — "your app, your brand" illustration. The same phone UI
 * re-skins itself through a few brand presets (logo monogram + accent colour
 * + app name) to show white-labelling. Colours animate via a `--brand` CSS
 * variable so every accent element transitions together. `active`-gated and
 * reduced-motion safe.
 */

import { useEffect, useState, type CSSProperties } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Home, Dumbbell, Users, User, Bell, Play } from 'lucide-react'

const BRANDS = [
  { name: 'Jimmy', mono: 'J', accent: '#8a32e0', soft: 'rgba(138,50,224,0.12)' },
  { name: 'PEAK', mono: 'P', accent: '#0d9488', soft: 'rgba(13,148,136,0.12)' },
  { name: 'FORGE', mono: 'F', accent: '#ea580c', soft: 'rgba(234,88,12,0.12)' },
] as const

const TABS = [Home, Dumbbell, Users, User]

export function BrandedAppDemo({ active = true }: { active?: boolean }) {
  const reduce = useReducedMotion() ?? false
  const [i, setI] = useState(0)

  useEffect(() => {
    if (!active || reduce) return
    const id = setInterval(() => setI((v) => (v + 1) % BRANDS.length), 2600)
    return () => clearInterval(id)
  }, [active, reduce])

  const brand = BRANDS[i]
  const trans = reduce ? 'none' : 'background-color 600ms cubic-bezier(0.16,1,0.3,1), color 600ms, border-color 600ms'
  const vars = { '--brand': brand.accent, '--brand-soft': brand.soft } as CSSProperties

  return (
    <div className="flex flex-col items-center gap-4 p-1" style={vars}>
      {/* Phone */}
      <div className="w-[224px] overflow-hidden rounded-[30px] border border-border bg-surface p-2.5 shadow-[0_20px_50px_-26px_rgba(40,30,55,0.45)]">
        <div className="overflow-hidden rounded-[22px] bg-surface-2">
          {/* App bar */}
          <div className="flex items-center gap-2.5 px-3.5 pb-3 pt-4">
            <span
              className="grid size-9 flex-none place-items-center rounded-[11px] font-display text-[15px] font-extrabold text-white"
              style={{ backgroundColor: 'var(--brand)', transition: trans }}
            >
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={brand.mono}
                  initial={reduce ? false : { y: 8, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={reduce ? undefined : { y: -8, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  {brand.mono}
                </motion.span>
              </AnimatePresence>
            </span>
            <div className="min-w-0 flex-1 overflow-hidden">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={brand.name}
                  initial={reduce ? false : { y: 8, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={reduce ? undefined : { y: -8, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="truncate font-display text-[14px] font-extrabold tracking-[-0.01em] text-text"
                >
                  {brand.name}
                </motion.div>
              </AnimatePresence>
              <div className="text-[9px] font-medium text-text-faint">Coaching app</div>
            </div>
            <Bell size={15} className="flex-none text-text-faint" strokeWidth={2} />
          </div>

          {/* Banner */}
          <div className="px-3.5">
            <div
              className="relative overflow-hidden rounded-[14px] px-3.5 py-3"
              style={{ backgroundColor: 'var(--brand)', transition: trans }}
            >
              <div className="text-[10px] font-semibold text-white/80">Today’s session</div>
              <div className="mt-0.5 font-display text-[15px] font-extrabold text-white">Upper Body A</div>
              <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[10px] font-bold" style={{ color: 'var(--brand)', transition: trans }}>
                <Play size={9} strokeWidth={3} /> Start
              </span>
              <div
                aria-hidden
                className="pointer-events-none absolute -right-6 -top-8 size-24 rounded-full"
                style={{ background: 'rgba(255,255,255,0.14)' }}
              />
            </div>
          </div>

          {/* Stat chips */}
          <div className="grid grid-cols-2 gap-2 px-3.5 py-3">
            {[
              { v: '18', l: 'day streak' },
              { v: '47', l: 'sessions' },
            ].map((s) => (
              <div key={s.l} className="rounded-[11px] border border-border bg-surface px-3 py-2">
                <div
                  className="font-display text-[16px] font-extrabold tabular-nums"
                  style={{ color: 'var(--brand)', transition: trans }}
                >
                  {s.v}
                </div>
                <div className="text-[9px] font-medium text-text-faint">{s.l}</div>
              </div>
            ))}
          </div>

          {/* Tab bar */}
          <div className="flex items-center justify-around border-t border-border bg-surface px-2 py-2.5">
            {TABS.map((Icon, t) => (
              <span
                key={t}
                className="grid size-7 place-items-center rounded-lg"
                style={
                  t === 0
                    ? { backgroundColor: 'var(--brand-soft)', color: 'var(--brand)', transition: trans }
                    : { color: 'var(--color-text-faint)' }
                }
              >
                <Icon size={15} strokeWidth={2} />
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Caption */}
      <div className="flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-[11px] font-medium text-text-muted">
        <span className="size-2 rounded-full" style={{ backgroundColor: 'var(--brand)', transition: trans }} />
        Your logo · your colors · your app
      </div>
    </div>
  )
}
