'use client'

import { useEffect, useRef, useState } from 'react'
import {
  AnimatePresence,
  m as motion,
  useInView,
  useReducedMotion,
} from 'framer-motion'
import { Sparkles, Dumbbell, Repeat, Timer, MoveUpRight, Footprints } from 'lucide-react'
import { cn } from '@/lib/utils'

// Looping ~8s illustration of the Coach Brain copilot: the prompt types
// itself, "Enter" fires, the barbell exercise is struck out and two
// no-equipment replacements slide in — the same visual language as
// WorkoutBuilderDemo (product rows, not a terminal). Static end-state when
// prefers-reduced-motion.

const PROMPT = 'Adapt Sarah’s block — she’s traveling, no equipment'

type Row = {
  id: string
  name: string
  sub: string
  scheme: string
  icon: React.ReactNode
  tint: string
  added?: boolean
}

const ICON_PROPS = { size: 15, strokeWidth: 2 } as const

const SQUAT: Row = {
  id: 'squat',
  name: 'Back squat',
  sub: 'Barbell · rack',
  scheme: '4 × 6 @ 80%',
  icon: <Dumbbell {...ICON_PROPS} />,
  tint: 'bg-purple-light text-purple',
}
const KEPT: Row[] = [
  { id: 'hip', name: 'Hip thrust', sub: 'Glutes', scheme: '3 × 10', icon: <Repeat {...ICON_PROPS} />, tint: 'bg-[#eaf2ff] text-[#2563eb]' },
  { id: 'plank', name: 'Plank', sub: 'Core finisher', scheme: '45 s', icon: <Timer {...ICON_PROPS} />, tint: 'bg-[#fff1e6] text-[#e8630a]' },
]
const ADDED: Row[] = [
  { id: 'bss', name: 'Bulgarian split squat', sub: 'No equipment', scheme: '4 × 8 each', icon: <MoveUpRight {...ICON_PROPS} />, tint: 'bg-[#E7F7EE] text-[#16A368]', added: true },
  { id: 'step', name: 'Tempo step-up', sub: '3 s down · no equipment', scheme: '3 × 10', icon: <Footprints {...ICON_PROPS} />, tint: 'bg-[#E7F7EE] text-[#16A368]', added: true },
]

// idle → typing → sent (bar pulses) → working (the beat that attributes the
// change to the AI — without it the strikethrough looks like it just happened)
// → struck → swapped → hold → reset
type Phase = 'idle' | 'typing' | 'sent' | 'working' | 'struck' | 'swapped'

function ExerciseRow({ row, struck = false }: { row: Row; struck?: boolean }) {
  return (
    <div
      className={cn(
        'relative flex items-center gap-2.5 overflow-hidden rounded-xl border border-border bg-surface px-3 py-[9px]',
        'transition-opacity duration-300',
        struck && 'opacity-45',
      )}
    >
      {/* Diff-style settle: a green wash that dissolves, so "just added" is
          felt for a beat instead of only labelled by the chip. */}
      {row.added && (
        <motion.span
          aria-hidden="true"
          initial={{ opacity: 0.55 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1.3, delay: 0.45, ease: 'easeOut' }}
          className="pointer-events-none absolute inset-0 bg-[#E7F7EE]"
        />
      )}
      <span className={cn('relative grid size-7 flex-none place-items-center rounded-md', row.tint)}>
        {row.icon}
      </span>
      <span className="relative min-w-0 flex-1">
        <span
          className={cn(
            'block truncate text-[13px] font-semibold leading-tight text-text',
            struck && 'line-through decoration-text-faint',
          )}
        >
          {row.name}
        </span>
        <span className="block truncate text-[10.5px] leading-tight text-text-faint">
          {row.sub}
        </span>
      </span>
      {row.added && (
        <span className="relative rounded-full bg-[#E7F7EE] px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-[0.05em] text-[#16A368]">
          New
        </span>
      )}
      <span className="relative rounded-md bg-surface-2 px-1.5 py-0.5 text-[10.5px] font-semibold text-text-muted">
        {row.scheme}
      </span>
    </div>
  )
}

/**
 * `embedded` strips the outer card + caption so the demo can sit inside a host
 * that already provides framing — the feature page hero, which supplies its own
 * card and its own COMING SOON badge. Same contract as WorkoutBuilderDemo.
 */
export function CoachBrainDemo({
  embedded = false,
  caption = '',
}: { embedded?: boolean; caption?: string } = {}) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.4 })

  const [phase, setPhase] = useState<Phase>('idle')
  const [chars, setChars] = useState(0)

  // One timer chain per phase; unmount/out-of-view clears it.
  useEffect(() => {
    if (reduce || !inView) return
    let t: ReturnType<typeof setTimeout>
    if (phase === 'idle') t = setTimeout(() => setPhase('typing'), 900)
    else if (phase === 'typing') {
      if (chars < PROMPT.length) t = setTimeout(() => setChars((c) => c + 1), 26)
      else t = setTimeout(() => setPhase('sent'), 420)
    } else if (phase === 'sent') t = setTimeout(() => setPhase('working'), 450)
    else if (phase === 'working') t = setTimeout(() => setPhase('struck'), 950)
    else if (phase === 'struck') t = setTimeout(() => setPhase('swapped'), 800)
    else t = setTimeout(() => { setChars(0); setPhase('idle') }, 3400)
    return () => clearTimeout(t)
  }, [phase, chars, inView, reduce])

  // Reduced motion (or JS settling): show the finished state, no loop.
  const done = reduce ? true : phase === 'swapped'
  const struck = phase === 'struck'
  const rows: Row[] = done ? [...ADDED, ...KEPT] : [SQUAT, ...KEPT]
  const typed = reduce ? PROMPT : phase === 'typing' ? PROMPT.slice(0, chars) : phase === 'idle' ? '' : PROMPT

  return (
    <div
      ref={ref}
      className={cn(!embedded && 'mx-auto mb-[clamp(2rem,3.5vw,3rem)] max-w-[640px]')}
    >
      <motion.div
        initial={reduce || embedded ? false : { opacity: 0, y: 18, scale: 0.98 }}
        whileInView={embedded ? undefined : { opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
        className={cn(
          embedded
            ? 'p-[2px]'
            : cn(
                'rounded-[22px] border border-border bg-surface p-[clamp(14px,1.8vw,20px)]',
                'shadow-[0_28px_70px_-32px_rgba(138,50,224,0.35),0_6px_24px_rgba(26,25,23,0.05)]',
              ),
        )}
      >
        {/* The bar */}
        <motion.div
          animate={phase === 'sent' ? { scale: [1, 0.985, 1] } : { scale: 1 }}
          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
          className={cn(
            'flex items-center gap-[10px] rounded-[14px] border bg-surface-2 px-[13px] py-[11px]',
            'transition-colors duration-300',
            phase === 'sent' || phase === 'working' || struck ? 'border-purple-border' : 'border-border',
          )}
        >
          <Sparkles size={16} strokeWidth={2.3} aria-hidden="true" className="shrink-0 text-purple" />
          <p className="min-w-0 flex-1 truncate text-[13.5px] font-medium text-text">
            {typed === '' ? (
              <span className="text-text-faint">Ask Coach Brain…</span>
            ) : (
              typed
            )}
            {!reduce && phase === 'typing' && (
              <motion.span
                aria-hidden="true"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.7, repeat: Infinity }}
                className="ml-[1px] inline-block h-[14px] w-[1.5px] translate-y-[2px] bg-purple"
              />
            )}
          </p>
          {phase === 'working' ? (
            <motion.span
              animate={{ opacity: [1, 0.55, 1] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
              className="shrink-0 rounded-full bg-purple-light px-[9px] py-[3px] text-[10px] font-bold uppercase tracking-[0.05em] text-purple"
            >
              Thinking…
            </motion.span>
          ) : (
            <span
              className={cn(
                'shrink-0 rounded-[7px] border px-[7px] py-[3px] text-[10px] font-semibold transition-colors duration-200',
                phase === 'sent'
                  ? 'border-purple bg-purple text-white'
                  : 'border-border bg-surface text-text-faint',
              )}
            >
              ⏎
            </span>
          )}
        </motion.div>

        {/* The block it rewrote */}
        <div className="mt-[14px] flex items-center gap-[8px] px-[2px]">
          <p className="text-[10.5px] font-bold uppercase tracking-[0.1em] text-text-faint">
            Week 3 · Lower body
          </p>
          <AnimatePresence>
            {done && !reduce && (
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                className="rounded-full bg-purple-light px-[8px] py-[2px] text-[9.5px] font-bold uppercase tracking-[0.05em] text-purple"
              >
                Adapted
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* min-h reserves the 4-row state (measured: 210px) so the looping
            swap never moves the rest of the page — a demo that reflows the
            section under the reader's cursor every 8 s would be worse than
            no demo. */}
        <div className="mt-[10px] min-h-[210px]">
          <AnimatePresence mode="popLayout" initial={false}>
            {rows.map((row, i) => (
              <motion.div
                key={row.id}
                layout
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 14 }}
                transition={{
                  duration: 0.32,
                  ease: [0.23, 1, 0.32, 1],
                  delay: row.added ? i * 0.09 : 0,
                }}
                className="[&+&]:mt-[6px]"
              >
                <ExerciseRow row={row} struck={struck && row.id === 'squat'} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {!embedded && caption && (
        <p className="mt-[10px] text-center text-[12.5px] text-text-faint">{caption}</p>
      )}
    </div>
  )
}
