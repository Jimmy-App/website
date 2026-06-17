'use client'

/**
 * DailyWorkoutDemo — member-side "Today's workout" illustration.
 * Sets get ticked off one by one, the progress bar fills, and the session
 * lands on a "complete" state before looping. Gated by `active` so it only
 * runs when the hero panel is in view; reduced-motion safe.
 */

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Check, Flame, Dumbbell, PartyPopper } from 'lucide-react'

const EXERCISES = [
  { name: 'Bench Press', scheme: '4 × 8', sets: 4 },
  { name: 'Incline DB Press', scheme: '3 × 10', sets: 3 },
  { name: 'Cable Fly', scheme: '3 × 12', sets: 3 },
] as const
const TOTAL = EXERCISES.reduce((n, e) => n + e.sets, 0) // 10

export function DailyWorkoutDemo({ active = true }: { active?: boolean }) {
  const reduce = useReducedMotion() ?? false
  const [done, setDone] = useState(0)
  const [complete, setComplete] = useState(false)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    const clear = () => {
      timers.current.forEach((t) => clearTimeout(t))
      timers.current = []
    }
    if (!active) {
      clear()
      setDone(0)
      setComplete(false)
      return
    }
    if (reduce) {
      setDone(TOTAL)
      setComplete(true)
      return
    }

    let n = 0
    setDone(0)
    setComplete(false)
    const tick = () => {
      n += 1
      setDone(n)
      if (n >= TOTAL) {
        timers.current.push(setTimeout(() => setComplete(true), 380))
        timers.current.push(
          setTimeout(() => {
            setComplete(false)
            setDone(0)
            n = 0
            timers.current.push(setTimeout(tick, 700))
          }, 2400),
        )
        return
      }
      timers.current.push(setTimeout(tick, n === 1 ? 620 : 560))
    }
    timers.current.push(setTimeout(tick, 600))
    return clear
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, reduce])

  const pct = Math.round((done / TOTAL) * 100)

  return (
    <div className="relative flex flex-col gap-3 p-1">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-purple">Today</div>
          <div className="font-display text-[15px] font-extrabold tracking-[-0.01em] text-text">
            Upper Body A
          </div>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-1 text-[11px] font-bold text-orange-500">
          <Flame size={12} strokeWidth={2.4} /> 18
        </span>
      </div>

      {/* Progress */}
      <div className="rounded-xl border border-border bg-surface px-3.5 py-3">
        <div className="mb-2 flex items-center justify-between text-[11px] font-semibold">
          <span className="text-text-muted">Session progress</span>
          <span className="tabular-nums text-text">
            {done}/{TOTAL} sets
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-surface-offset">
          <div
            className="h-full rounded-full bg-purple"
            style={{
              width: `${pct}%`,
              transition: reduce ? 'none' : 'width 500ms cubic-bezier(0.16,1,0.3,1)',
            }}
          />
        </div>
      </div>

      {/* Exercises */}
      <div className="flex flex-col gap-2">
        {EXERCISES.map((ex, ei) => {
          const before = EXERCISES.slice(0, ei).reduce((n, e) => n + e.sets, 0)
          const exDone = Math.max(0, Math.min(ex.sets, done - before))
          const current = exDone < ex.sets && done >= before && done < before + ex.sets
          return (
            <div
              key={ex.name}
              className={
                'rounded-xl border bg-surface px-3.5 py-3 transition-colors duration-300 ' +
                (current ? 'border-purple-border shadow-[0_2px_14px_-8px_rgba(138,50,224,0.5)]' : 'border-border')
              }
            >
              <div className="mb-2 flex items-center gap-2.5">
                <span className="flex size-7 flex-none items-center justify-center rounded-lg bg-purple-light text-purple">
                  <Dumbbell size={14} strokeWidth={2} />
                </span>
                <span className="flex-1 text-[13px] font-semibold text-text">{ex.name}</span>
                <span className="text-[11.5px] font-medium text-text-faint">{ex.scheme}</span>
              </div>
              <div className="flex gap-1.5 pl-[38px]">
                {Array.from({ length: ex.sets }).map((_, si) => {
                  const filled = si < exDone
                  return (
                    <div
                      key={si}
                      className={
                        'flex h-6 flex-1 items-center justify-center rounded-md text-[10px] font-bold transition-colors duration-300 ' +
                        (filled
                          ? 'bg-purple text-white'
                          : 'bg-surface-2 text-text-faint ring-1 ring-inset ring-border')
                      }
                    >
                      {filled ? (
                        <motion.span
                          initial={reduce ? false : { scale: 0.4, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                        >
                          <Check size={13} strokeWidth={3} />
                        </motion.span>
                      ) : (
                        si + 1
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Complete overlay */}
      <AnimatePresence>
        {complete && (
          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 z-10 flex items-center justify-center rounded-[16px] bg-surface/80 backdrop-blur-[2px]"
          >
            <motion.div
              initial={reduce ? false : { scale: 0.85, y: 8, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{ type: 'spring', duration: 0.5, bounce: 0.32 }}
              className="flex flex-col items-center gap-2 rounded-2xl border border-purple-border bg-surface px-7 py-6 text-center shadow-[0_20px_50px_-24px_rgba(138,50,224,0.5)]"
            >
              <span className="grid size-12 place-items-center rounded-full bg-purple text-white">
                <PartyPopper size={22} strokeWidth={2} />
              </span>
              <div className="font-display text-[16px] font-extrabold text-text">Session complete</div>
              <div className="text-[12px] text-text-muted">Nice work — logged to your streak.</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
