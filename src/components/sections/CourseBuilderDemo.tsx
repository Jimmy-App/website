'use client'

import { useEffect, useRef, useState } from 'react'
import {
  AnimatePresence,
  m as motion,
  useInView,
  useReducedMotion,
  type Transition,
} from 'framer-motion'
import {
  Play,
  FileText,
  HelpCircle,
  Plus,
  GripVertical,
  ChevronDown,
  MousePointer2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ── Lesson types ──────────────────────────────────────────────────────────────

type LessonType = 'video' | 'pdf' | 'quiz'

const TYPE = {
  video: { label: 'Video', icon: Play, tint: 'bg-purple-light text-purple' },
  pdf: { label: 'PDF', icon: FileText, tint: 'bg-[#eaf2ff] text-[#2563eb]' },
  quiz: { label: 'Quiz', icon: HelpCircle, tint: 'bg-[#fff1e6] text-[#e8630a]' },
} as const

const ICON = { size: 13, strokeWidth: 2 } as const

// ── Course structure ──────────────────────────────────────────────────────────

const MODULES = [
  { title: 'Module 1 · Basics', slots: 2 },
  { title: 'Module 2 · Nutrition', slots: 2 },
]

type Lesson = { m: number; s: number; type: LessonType; title: string; meta: string }
const LESSONS: Lesson[] = [
  { m: 0, s: 0, type: 'video', title: 'Welcome & mindset', meta: '3:20' },
  { m: 0, s: 1, type: 'pdf', title: 'Starter guide', meta: 'PDF' },
  { m: 1, s: 0, type: 'video', title: 'Macros 101', meta: '5:12' },
  { m: 1, s: 1, type: 'quiz', title: 'Test yourself', meta: 'Quiz' },
]
const N = LESSONS.length
const SLOT_H = 38

// lesson index that lands in a given module/slot
const lessonIdx = (m: number, s: number) => LESSONS.findIndex((l) => l.m === m && l.s === s)

// ── Geometry helper ───────────────────────────────────────────────────────────

type Box = { left: number; top: number; w: number; h: number }
function centerIn(el: HTMLElement | null, container: HTMLElement | null): Box | null {
  if (!el || !container) return null
  const a = el.getBoundingClientRect()
  const b = container.getBoundingClientRect()
  return { left: a.left - b.left + a.width / 2, top: a.top - b.top + a.height / 2, w: a.width, h: a.height }
}

// ── Lesson row presentation ───────────────────────────────────────────────────

function LessonRow({ lesson, dragging = false }: { lesson: Lesson; dragging?: boolean }) {
  const t = TYPE[lesson.type]
  const Icon = t.icon
  return (
    <div
      className={cn(
        'flex items-center gap-[7px] rounded-[8px] border bg-surface px-[8px] py-[6px]',
        dragging ? 'border-purple shadow-[0_12px_26px_-8px_rgba(138,50,224,0.45)]' : 'border-border',
      )}
    >
      {!dragging && <GripVertical size={12} className="-ml-[2px] flex-shrink-0 text-text-faint" />}
      <span className={cn('grid size-[22px] flex-shrink-0 place-items-center rounded-[6px]', t.tint)}>
        <Icon {...ICON} className={lesson.type === 'video' ? 'ml-[1px]' : undefined} />
      </span>
      <span className="min-w-0 flex-1 truncate text-[11px] font-semibold text-text">{lesson.title}</span>
      <span className="flex-shrink-0 rounded-[5px] bg-surface-2 px-[6px] py-[1px] text-[9px] font-semibold text-text-muted tabular-nums">
        {lesson.meta}
      </span>
    </div>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * Looping ~7s illustration of a Skool-style course builder. A cursor taps the
 * [+ Video] / [+ PDF] / [+ Quiz] palette and the lesson flies up into the next
 * slot of a module — the curriculum assembles in a few clicks.
 *
 * `embedded` strips the outer card chrome; `active` (default true) lets a host
 * pause + reset when its panel isn't on display.
 */
export function CourseBuilderDemo({
  embedded = false,
  active = true,
}: {
  embedded?: boolean
  active?: boolean
}) {
  const reduce = useReducedMotion() ?? false
  const containerRef = useRef<HTMLDivElement>(null)
  const refs = useRef<Record<string, HTMLElement | null>>({})
  const inView = useInView(containerRef, { amount: 0.3 })
  const running = inView && active

  const [placed, setPlaced] = useState(reduce ? N : 0)
  const [flight, setFlight] = useState<number | null>(null)
  const [flightBox, setFlightBox] = useState<
    { from: { left: number; top: number }; to: { left: number; top: number }; w: number } | null
  >(null)
  const [cursor, setCursor] = useState<{ left: number; top: number } | null>(null)
  const [clicking, setClicking] = useState(false)
  const [activeBtn, setActiveBtn] = useState<LessonType | null>(null)

  // Measure flight path (palette button → target slot) when a lesson lifts off.
  useEffect(() => {
    if (flight === null) {
      setFlightBox(null)
      return
    }
    const l = LESSONS[flight]
    const from = centerIn(refs.current[`btn-${l.type}`], containerRef.current)
    const to = centerIn(refs.current[`m${l.m}-s${l.s}`], containerRef.current)
    if (!from || !to) return
    // Cap the chip width and clamp it inside the container so it never starts
    // off-screen when the palette button sits near an edge (narrow / mobile).
    const cw = containerRef.current?.clientWidth ?? 280
    const w = Math.min(to.w, 168)
    const clampX = (x: number) => Math.max(4, Math.min(cw - w - 4, x))
    setFlightBox({
      w,
      from: { left: clampX(from.left - w / 2), top: from.top - SLOT_H / 2 },
      to: { left: clampX(to.left - w / 2), top: to.top - SLOT_H / 2 },
    })
  }, [flight])

  useEffect(() => {
    if (reduce) {
      setPlaced(N)
      setFlight(null)
      return
    }
    if (!running) {
      setPlaced(0)
      setFlight(null)
      setCursor(null)
      setActiveBtn(null)
      setClicking(false)
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
        setActiveBtn(null)
        setClicking(false)
        const cw = containerRef.current?.clientWidth ?? 280
        const ch = containerRef.current?.clientHeight ?? 320
        setCursor({ left: cw * 0.5, top: ch * 0.92 })
        await wait(560)

        for (let i = 0; i < N; i++) {
          if (cancelled) return
          const l = LESSONS[i]
          // move cursor to the matching palette button
          setActiveBtn(l.type)
          const btn = centerIn(refs.current[`btn-${l.type}`], containerRef.current)
          if (btn) setCursor({ left: btn.left, top: btn.top })
          await wait(520)
          if (cancelled) return
          // click
          setClicking(true)
          await wait(140)
          setClicking(false)
          // lesson flies up into its slot
          setFlight(i)
          await wait(470)
          if (cancelled) return
          setFlight(null)
          setPlaced(i + 1)
          setActiveBtn(null)
          await wait(330)
        }
        await wait(850)
      }
    }
    run()
    return () => {
      cancelled = true
      timers.forEach((t) => clearTimeout(t))
    }
  }, [reduce, running])

  const flightTransition: Transition = { duration: 0.46, ease: [0.5, 0, 0.2, 1] }

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative flex w-full flex-col gap-[8px]',
        !embedded && 'rounded-xl border border-border bg-surface p-3',
      )}
    >
      {/* Course title */}
      <div className="flex items-center gap-[7px]">
        <span className="grid size-[26px] place-items-center rounded-[7px] bg-purple text-white text-[12px] font-bold">
          🎓
        </span>
        <div className="leading-tight">
          <div className="text-[12.5px] font-bold text-text">Fitness Foundations</div>
          <div className="text-[9.5px] text-text-faint">{placed} lessons · {MODULES.length} modules</div>
        </div>
      </div>

      {/* Modules */}
      <div className="flex flex-col gap-[7px]">
        {MODULES.map((mod, mi) => {
          const filled = LESSONS.filter((l, li) => l.m === mi && li < placed).length
          return (
            <div key={mi} className="rounded-[10px] border border-border bg-surface-2/50 p-[7px]">
              <div className="mb-[6px] flex items-center gap-[5px] px-[1px]">
                <ChevronDown size={12} className="text-text-muted" />
                <span className="flex-1 text-[10.5px] font-bold text-text">{mod.title}</span>
                <span className="rounded-full bg-surface px-[6px] py-[1px] text-[9px] font-semibold text-text-muted tabular-nums">
                  {filled}/{mod.slots}
                </span>
              </div>
              <div className="flex flex-col gap-[5px]">
                {Array.from({ length: mod.slots }).map((_, si) => {
                  const li = lessonIdx(mi, si)
                  const isFilled = li > -1 && li < placed
                  const isTarget = flight === li
                  return (
                    <div
                      key={si}
                      ref={(el) => {
                        refs.current[`m${mi}-s${si}`] = el
                      }}
                      style={{ height: SLOT_H }}
                      className={cn(
                        'relative rounded-[8px]',
                        !isFilled && 'border border-dashed border-border bg-surface/40',
                        isTarget && 'border-purple/60 bg-purple-light/50',
                      )}
                    >
                      <AnimatePresence>
                        {isFilled && (
                          <motion.div
                            className="absolute inset-0"
                            initial={{ opacity: 0, scale: 0.95, y: -3 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                          >
                            <LessonRow lesson={LESSONS[li]} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Palette — add-lesson buttons */}
      <div className="flex gap-[6px]">
        {(Object.keys(TYPE) as LessonType[]).map((type) => {
          const t = TYPE[type]
          const Icon = t.icon
          const isActive = activeBtn === type
          return (
            <motion.span
              key={type}
              ref={(el) => {
                refs.current[`btn-${type}`] = el
              }}
              animate={isActive ? { scale: [1, 1.06, 1] } : { scale: 1 }}
              transition={{ duration: 0.4 }}
              className={cn(
                'flex flex-1 items-center justify-center gap-[4px] rounded-[8px] border px-[6px] py-[6px] text-[10px] font-semibold transition-colors',
                isActive
                  ? 'border-purple bg-purple-light text-purple'
                  : 'border-border bg-surface text-text-muted',
              )}
            >
              <Plus size={11} strokeWidth={2.5} />
              <span className={cn('grid size-[15px] place-items-center rounded-[4px]', t.tint)}>
                <Icon size={10} strokeWidth={2} />
              </span>
              {t.label}
            </motion.span>
          )
        })}
      </div>

      {/* Flying lesson chip */}
      <AnimatePresence>
        {flight !== null && flightBox && (
          <motion.div
            key={flight}
            className="pointer-events-none absolute z-20"
            style={{ width: flightBox.w }}
            initial={{ left: flightBox.from.left, top: flightBox.from.top, opacity: 0, scale: 0.9 }}
            animate={{ left: flightBox.to.left, top: flightBox.to.top, opacity: 1, scale: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
            transition={flightTransition}
          >
            <LessonRow lesson={LESSONS[flight]} dragging />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cursor */}
      <AnimatePresence>
        {cursor && (
          <motion.div
            className="pointer-events-none absolute z-30"
            initial={{ left: cursor.left, top: cursor.top, opacity: 0 }}
            animate={{ left: cursor.left, top: cursor.top, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.5, 0, 0.2, 1] }}
          >
            <motion.div animate={clicking ? { scale: 0.82 } : { scale: 1 }} transition={{ duration: 0.12 }} className="relative">
              <MousePointer2 size={17} className="fill-text text-text drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)]" strokeWidth={1.5} />
              <AnimatePresence>
                {clicking && (
                  <motion.span
                    className="absolute left-[2px] top-[2px] size-5 rounded-full border border-purple"
                    initial={{ scale: 0.3, opacity: 0.7 }}
                    animate={{ scale: 1.8, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
