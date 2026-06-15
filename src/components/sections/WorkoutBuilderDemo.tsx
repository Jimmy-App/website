'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
  type Transition,
} from 'framer-motion'
import {
  Dumbbell,
  ChevronsUp,
  Repeat,
  Timer,
  MousePointer2,
  GripVertical,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// useLayoutEffect on the client, useEffect on the server (avoids SSR warning).
const useIsoLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

// ── Exercise data ─────────────────────────────────────────────────────────────
// The first four are dragged (in order) from the library into the workout; the
// last two stay in the library as ambient "available" rows.

type Exercise = {
  name: string
  muscle: string
  scheme: string
  icon: React.ReactNode
  tint: string // icon badge background
}

const ICON_PROPS = { size: 15, strokeWidth: 2 } as const

const EXERCISES: Exercise[] = [
  { name: 'Bench Press', muscle: 'Chest', scheme: '4 × 8', icon: <Dumbbell {...ICON_PROPS} />, tint: 'bg-purple-light text-purple' },
  { name: 'Pull-up', muscle: 'Back', scheme: '3 × AMRAP', icon: <ChevronsUp {...ICON_PROPS} />, tint: 'bg-[#eaf2ff] text-[#2563eb]' },
  { name: 'Goblet Squat', muscle: 'Legs', scheme: '4 × 10', icon: <Repeat {...ICON_PROPS} />, tint: 'bg-[#fdecf2] text-[#db2777]' },
  { name: 'Plank', muscle: 'Core', scheme: '45 s', icon: <Timer {...ICON_PROPS} />, tint: 'bg-[#fff1e6] text-[#e8630a]' },
]

const LIBRARY_EXTRA: Exercise[] = [
  { name: 'Barbell Row', muscle: 'Back', scheme: '4 × 8', icon: <Dumbbell {...ICON_PROPS} />, tint: 'bg-surface-2 text-text-muted' },
  { name: 'Lunge', muscle: 'Legs', scheme: '3 × 12', icon: <Repeat {...ICON_PROPS} />, tint: 'bg-surface-2 text-text-muted' },
]

const N = EXERCISES.length
const SLOT_H = 56 // px — fixed slot height keeps measured targets stable

// ── Geometry helper ───────────────────────────────────────────────────────────

type Box = { left: number; top: number; width: number; height: number }

function boxIn(el: HTMLElement | null, container: HTMLElement | null): Box | null {
  if (!el || !container) return null
  const a = el.getBoundingClientRect()
  const b = container.getBoundingClientRect()
  return { left: a.left - b.left, top: a.top - b.top, width: a.width, height: a.height }
}

// ── Small exercise-row presentation (shared by library + flying ghost) ─────────

function ExerciseRow({
  ex,
  dragging = false,
  dimmed = false,
}: {
  ex: Exercise
  dragging?: boolean
  dimmed?: boolean
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-2.5 rounded-lg border bg-surface px-2.5 py-2 @max-[430px]:gap-1.5 @max-[430px]:px-1.5',
        dragging
          ? 'border-purple shadow-[0_12px_28px_-8px_rgba(138,50,224,0.45)]'
          : 'border-border',
        dimmed && 'opacity-45 saturate-50',
      )}
    >
      <span className={cn('grid size-7 flex-none place-items-center rounded-md @max-[430px]:size-6', ex.tint)}>
        {ex.icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[12.5px] font-semibold leading-tight text-text @max-[430px]:text-[11px]">
          {ex.name}
        </span>
        <span className="block truncate text-[10.5px] leading-tight text-text-faint @max-[430px]:text-[9.5px]">
          {ex.muscle}
        </span>
      </span>
      <span className="rounded-md bg-surface-2 px-1.5 py-0.5 text-[10px] font-semibold text-text-muted @max-[430px]:hidden">
        {ex.scheme}
      </span>
    </div>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * Looping ~7s illustration: exercises are dragged from the right-hand library
 * into an empty "Upper Body A" workout, one by one, until the workout is built.
 * Flight paths are measured from the real DOM so it stays accurate at any size.
 *
 * `embedded` strips the outer card chrome + internal title so it can sit inside
 * a host panel that already provides framing (e.g. the Platform preview card).
 * `active` (default true) lets a host pause + reset the loop when its panel
 * isn't the one on display.
 */
export function WorkoutBuilderDemo({
  embedded = false,
  active = true,
}: {
  embedded?: boolean
  active?: boolean
}) {
  const reduce = useReducedMotion()

  const containerRef = useRef<HTMLDivElement>(null)
  const slotRefs = useRef<(HTMLDivElement | null)[]>([])
  const libRefs = useRef<(HTMLDivElement | null)[]>([])

  // Only animate while on screen AND while this panel is the active one.
  const inView = useInView(containerRef, { amount: 0.35 })
  const running = inView && active

  const [placed, setPlaced] = useState(reduce ? N : 0)
  const [flight, setFlight] = useState<number | null>(null)
  const [coords, setCoords] = useState<{ from: Box; to: Box } | null>(null)

  // Measure the flight path whenever a new exercise lifts off.
  useIsoLayoutEffect(() => {
    if (flight === null) {
      setCoords(null)
      return
    }
    const from = boxIn(libRefs.current[flight], containerRef.current)
    const to = boxIn(slotRefs.current[flight], containerRef.current)
    if (from && to) setCoords({ from, to })
  }, [flight])

  // Timeline: drag each exercise in, hold the finished workout, reset, loop.
  // Runs only while in view; pauses (and resets on re-entry) otherwise.
  useEffect(() => {
    if (reduce) {
      setPlaced(N)
      setFlight(null)
      return
    }
    if (!running) {
      setPlaced(0)
      setFlight(null)
      return
    }
    let cancelled = false
    const timers: number[] = []
    const wait = (ms: number) =>
      new Promise<void>((r) => timers.push(window.setTimeout(r, ms)))

    async function run() {
      while (!cancelled) {
        setPlaced(0)
        setFlight(null)
        await wait(650)
        for (let i = 0; i < N; i++) {
          if (cancelled) return
          setFlight(i)
          await wait(880) // flight + settle
          if (cancelled) return
          setFlight(null)
          setPlaced(i + 1)
          await wait(450)
        }
        await wait(1350) // admire the finished workout
      }
    }
    run()
    return () => {
      cancelled = true
      timers.forEach((t) => clearTimeout(t))
    }
  }, [reduce, running])

  const flightTransition: Transition = {
    duration: 0.74,
    ease: [0.5, 0, 0.2, 1],
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        '@container relative flex w-full gap-3 overflow-hidden @max-[430px]:gap-2',
        embedded
          ? 'h-auto'
          : 'h-full rounded-xl bg-surface-2/60 p-3 @max-[430px]:p-2',
      )}
    >
      {/* ── Workout canvas ── */}
      <div className="flex min-w-0 flex-1 flex-col rounded-lg border border-border bg-surface p-3 shadow-[var(--shadow-sm)] @max-[430px]:p-2">
        {/* Workout header (hidden when embedded — host card shows the title) */}
        <div className={cn('mb-3 flex items-center justify-between', embedded && 'hidden')}>
          <div className="flex items-center gap-2">
            <span className="grid size-7 place-items-center rounded-md bg-purple text-white">
              <Dumbbell size={15} strokeWidth={2} />
            </span>
            <span className="text-[13px] font-bold text-text">Upper Body A</span>
          </div>
          <span className="rounded-full bg-purple-light px-2 py-0.5 text-[10px] font-semibold text-purple">
            Day 1 / 5
          </span>
        </div>

        {/* Slots */}
        <div className="flex flex-col gap-2">
          {EXERCISES.map((ex, i) => {
            const isFilled = i < placed
            const isTarget = flight === i
            return (
              <div
                key={ex.name}
                ref={(el) => {
                  slotRefs.current[i] = el
                }}
                style={{ height: SLOT_H }}
                className={cn(
                  'relative rounded-lg transition-colors',
                  !isFilled &&
                    'border border-dashed border-border/80 bg-surface-2/40',
                  isTarget && 'border-purple/60 bg-purple-light/50',
                )}
              >
                <AnimatePresence>
                  {isFilled && (
                    <motion.div
                      className="absolute inset-0 flex items-center"
                      initial={{ opacity: 0, scale: 0.94, y: -4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="flex w-full items-center gap-2 rounded-lg border border-border bg-surface px-2.5 py-2 @max-[430px]:gap-1.5 @max-[430px]:px-2">
                        <GripVertical
                          size={13}
                          className="shrink-0 text-text-faint @max-[430px]:hidden"
                        />
                        <span
                          className={cn(
                            'grid size-7 flex-none place-items-center rounded-md @max-[430px]:size-6',
                            ex.tint,
                          )}
                        >
                          {ex.icon}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[12.5px] font-semibold leading-tight text-text @max-[430px]:text-[11px]">
                            {ex.name}
                          </span>
                          <span className="block truncate text-[10.5px] leading-tight text-text-faint @max-[430px]:text-[9.5px]">
                            {ex.scheme} · {ex.muscle}
                          </span>
                        </span>
                        <span className="size-1.5 flex-none rounded-full bg-success" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {!isFilled && (
                  <span className="pointer-events-none absolute inset-0 grid place-items-center text-[10.5px] font-medium text-text-faint">
                    {isTarget ? 'Drop here' : ''}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Exercise library ── */}
      <div className="flex w-[150px] flex-none flex-col rounded-lg border border-border bg-surface p-2.5 @max-[430px]:w-[112px] @max-[430px]:p-2">
        <div className="mb-2 flex items-center justify-between px-0.5">
          <span className="text-[11px] font-bold text-text">Exercises</span>
          <span className="text-[9.5px] font-medium text-text-faint">551</span>
        </div>
        <div className="flex flex-col gap-1.5">
          {EXERCISES.map((ex, i) => (
            <div
              key={ex.name}
              ref={(el) => {
                libRefs.current[i] = el
              }}
            >
              <ExerciseRow
                ex={ex}
                dimmed={i < placed || flight === i}
              />
            </div>
          ))}
          {LIBRARY_EXTRA.map((ex) => (
            <ExerciseRow key={ex.name} ex={ex} dimmed />
          ))}
        </div>
      </div>

      {/* ── Flying ghost card + cursor ── */}
      <AnimatePresence>
        {flight !== null && coords && (
          <motion.div
            key={flight}
            className="pointer-events-none absolute z-20"
            style={{ width: coords.from.width }}
            initial={{
              left: coords.from.left,
              top: coords.from.top,
              width: coords.from.width,
              rotate: -3,
              scale: 1,
            }}
            animate={{
              left: coords.to.left,
              top: coords.to.top,
              width: coords.to.width,
              rotate: 0,
              scale: 1.02,
            }}
            exit={{ opacity: 0, transition: { duration: 0.12 } }}
            transition={flightTransition}
          >
            <ExerciseRow ex={EXERCISES[flight]} dragging />
            <MousePointer2
              size={16}
              className="absolute -bottom-2 right-3 fill-text text-text drop-shadow"
              strokeWidth={1.5}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
