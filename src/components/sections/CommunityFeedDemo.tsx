'use client'

import { useEffect, useRef, useState } from 'react'
import {
  AnimatePresence,
  m as motion,
  useInView,
  useReducedMotion,
  type Transition,
} from 'framer-motion'
import { MousePointer2 } from 'lucide-react'
import { cn } from '@/lib/utils'

// ── Feed data ─────────────────────────────────────────────────────────────────

type Reaction = { emoji: string; base: number }
type Post = {
  name: string
  initial: string
  color: string
  time: string
  text: string
  reactions: Reaction[]
}

const POSTS: Post[] = [
  {
    name: 'Marco D.',
    initial: 'M',
    color: '#2563EB',
    time: '2h',
    text: 'PR on squats today! 185 kg 💪',
    reactions: [
      { emoji: '❤️', base: 12 },
      { emoji: '💪', base: 8 },
      { emoji: '💬', base: 3 },
    ],
  },
  {
    name: 'Sara M.',
    initial: 'S',
    color: '#16A34A',
    time: '5h',
    text: "Week 2 done. Let's go 🔥",
    reactions: [
      { emoji: '🔥', base: 14 },
      { emoji: '❤️', base: 9 },
    ],
  },
]

// Members shown in the challenge avatar stack.
const STACK = [
  { initial: 'A', color: '#8a32e0' },
  { initial: 'K', color: '#2563EB' },
  { initial: 'R', color: '#16A34A' },
]
const JOIN_BASE = 23
const POST_H = 86 // fixed slot height → panel never reflows

// The cursor visits these targets in order, clicking each.
type Action =
  | { kind: 'react'; post: number; r: number; emoji: string }
  | { kind: 'join' }

const ACTIONS: Action[] = [
  { kind: 'react', post: 0, r: 0, emoji: '❤️' },
  { kind: 'react', post: 1, r: 0, emoji: '🔥' },
  { kind: 'join' },
  { kind: 'react', post: 0, r: 1, emoji: '💪' },
  { kind: 'react', post: 1, r: 1, emoji: '❤️' },
]

const idOf = (a: Action) => (a.kind === 'join' ? 'join' : `p${a.post}-r${a.r}`)

// ── Geometry helper ───────────────────────────────────────────────────────────

type Pt = { left: number; top: number }
function centerIn(el: HTMLElement | null, container: HTMLElement | null): (Pt & { w: number; h: number }) | null {
  if (!el || !container) return null
  const a = el.getBoundingClientRect()
  const b = container.getBoundingClientRect()
  return { left: a.left - b.left + a.width / 2, top: a.top - b.top + a.height / 2, w: a.width, h: a.height }
}

type Float = { id: number; emoji: string; left: number; top: number }

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * Looping ~7s illustration of a *live* community feed. A cursor flies across the
 * feed and clicks: it reacts to posts (the count pops and the emoji floats up
 * and away) and taps "Join" on the challenge (an avatar drops into the stack
 * and the counter ticks). Mirrors the cursor-driven feel of the workout builder.
 *
 * `embedded` strips the outer card chrome; `active` (default true) lets a host
 * pause + reset when its panel isn't on display.
 */
export function CommunityFeedDemo({
  embedded = false,
  active = true,
}: {
  embedded?: boolean
  active?: boolean
}) {
  const reduce = useReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)
  const targetRefs = useRef<Record<string, HTMLElement | null>>({})
  const inView = useInView(containerRef, { amount: 0.35 })
  const running = inView && active

  const [bumps, setBumps] = useState<Record<string, number>>({})
  const [joined, setJoined] = useState(JOIN_BASE)
  const [joinPulse, setJoinPulse] = useState(false)
  const [extraAvatar, setExtraAvatar] = useState(false)
  const [cursor, setCursor] = useState<Pt | null>(null)
  const [clicking, setClicking] = useState(false)
  const [floats, setFloats] = useState<Float[]>([])

  useEffect(() => {
    if (reduce) {
      setBumps({})
      setJoined(JOIN_BASE)
      setCursor(null)
      return
    }
    if (!running) {
      setBumps({})
      setJoined(JOIN_BASE)
      setExtraAvatar(false)
      setJoinPulse(false)
      setFloats([])
      setCursor(null)
      setClicking(false)
      return
    }

    let cancelled = false
    let floatId = 0
    const timers: number[] = []
    const wait = (ms: number) =>
      new Promise<void>((r) => timers.push(window.setTimeout(r, ms)))

    const spawnFloat = (emoji: string, left: number, top: number) => {
      const id = floatId++
      setFloats((f) => [...f, { id, emoji, left, top }])
      timers.push(
        window.setTimeout(() => {
          if (!cancelled) setFloats((f) => f.filter((x) => x.id !== id))
        }, 1100),
      )
    }

    async function run() {
      while (!cancelled) {
        // reset
        setBumps({})
        setJoined(JOIN_BASE)
        setExtraAvatar(false)
        setJoinPulse(false)
        setFloats([])
        setClicking(false)
        // park the cursor in the lower-right, faded in
        const cw = containerRef.current?.clientWidth ?? 280
        const ch = containerRef.current?.clientHeight ?? 320
        setCursor({ left: cw * 0.82, top: ch * 0.86 })
        await wait(560)

        for (const act of ACTIONS) {
          if (cancelled) return
          const c = centerIn(targetRefs.current[idOf(act)], containerRef.current)
          if (c) setCursor({ left: c.left, top: c.top })
          await wait(640) // travel
          if (cancelled) return

          // click
          setClicking(true)
          if (act.kind === 'join') {
            setJoined((j) => j + 1)
            setExtraAvatar(true)
            setJoinPulse(true)
            timers.push(window.setTimeout(() => !cancelled && setJoinPulse(false), 600))
          } else {
            const key = idOf(act)
            setBumps((b) => ({ ...b, [key]: (b[key] ?? 0) + 1 }))
            if (c) spawnFloat(act.emoji, c.left, c.top - c.h / 2)
          }
          await wait(150)
          setClicking(false)
          await wait(430)
        }
        await wait(820) // admire
      }
    }
    run()
    return () => {
      cancelled = true
      timers.forEach((t) => clearTimeout(t))
    }
  }, [reduce, running])

  const cursorTransition: Transition = { duration: 0.6, ease: [0.5, 0, 0.2, 1] }

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative flex w-full flex-col gap-[6px]',
        !embedded && 'rounded-xl border border-border bg-surface p-3',
      )}
    >
      {/* Challenge card */}
      <div className="flex items-center gap-[9px] rounded-[10px] border border-purple-border bg-purple-light px-[11px] py-[9px]">
        <span className="text-xl leading-none">🏃</span>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[12px] font-bold text-text">Week Challenge: 5K Run</div>
          {/* Avatar stack + counter */}
          <div className="mt-[3px] flex items-center gap-[6px]">
            <div className="flex items-center">
              {STACK.map((m, i) => (
                <span
                  key={m.initial}
                  className="flex size-[18px] items-center justify-center rounded-full border-[1.5px] border-purple-light text-[8px] font-bold text-white"
                  style={{ background: m.color, marginLeft: i === 0 ? 0 : -6 }}
                >
                  {m.initial}
                </span>
              ))}
              <AnimatePresence>
                {extraAvatar && (
                  <motion.span
                    initial={{ scale: 0, marginLeft: -6 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: 'spring', stiffness: 480, damping: 22 }}
                    className="flex size-[18px] items-center justify-center rounded-full border-[1.5px] border-purple-light bg-purple text-[8px] font-bold text-white"
                  >
                    +
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            <span className="text-[10.5px] text-text-muted">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={joined}
                  initial={joinPulse ? { scale: 1.4, color: 'var(--color-purple)' } : false}
                  animate={{ scale: 1, color: 'var(--color-text)' }}
                  transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
                  className="font-semibold tabular-nums"
                >
                  {joined}
                </motion.span>
              </AnimatePresence>{' '}
              joined
            </span>
          </div>
        </div>
        <motion.span
          ref={(el) => {
            targetRefs.current['join'] = el
          }}
          animate={joinPulse ? { scale: [1, 1.14, 1] } : { scale: 1 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="flex-shrink-0 whitespace-nowrap rounded-full bg-purple px-[10px] py-[3px] text-[10.5px] font-bold text-white"
        >
          Join
        </motion.span>
      </div>

      {/* Posts */}
      {POSTS.map((post, pi) => (
        <div
          key={post.name}
          style={{ height: POST_H }}
          className="rounded-[10px] border border-border bg-surface-2 px-[11px] py-[9px]"
        >
          <div className="mb-1 flex items-center gap-[6px]">
            <span
              className="flex size-6 flex-shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white"
              style={{ background: post.color }}
            >
              {post.initial}
            </span>
            <span className="text-[11px] font-semibold text-text">{post.name}</span>
            <span className="ml-auto text-[10px] text-text-faint">{post.time}</span>
          </div>
          <p className="mb-[7px] truncate text-[11.5px] leading-[1.4] text-text-muted">
            {post.text}
          </p>
          <div className="flex gap-[5px]">
            {post.reactions.map((rx, ri) => {
              const key = `p${pi}-r${ri}`
              const value = rx.base + (bumps[key] ?? 0)
              const bumped = (bumps[key] ?? 0) > 0
              return (
                <span
                  key={rx.emoji}
                  ref={(el) => {
                    targetRefs.current[key] = el
                  }}
                  className={cn(
                    'inline-flex items-center gap-[3px] rounded-full border px-[7px] py-[2px] text-[10.5px] transition-colors',
                    bumped
                      ? 'border-purple-border bg-purple-light text-purple'
                      : 'border-border bg-surface text-text-muted',
                  )}
                >
                  <span>{rx.emoji}</span>
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={value}
                      initial={bumped ? { scale: 1.5 } : false}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="font-semibold tabular-nums"
                    >
                      {value}
                    </motion.span>
                  </AnimatePresence>
                </span>
              )
            })}
          </div>
        </div>
      ))}

      {/* Floating reactions */}
      <AnimatePresence>
        {floats.map((f) => (
          <motion.span
            key={f.id}
            className="pointer-events-none absolute z-20 -translate-x-1/2 text-[15px]"
            style={{ left: f.left, top: f.top }}
            initial={{ opacity: 0, y: 0, scale: 0.5 }}
            animate={{ opacity: [0, 1, 1, 0], y: -46, scale: 1.1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            {f.emoji}
          </motion.span>
        ))}
      </AnimatePresence>

      {/* Cursor */}
      <AnimatePresence>
        {cursor && (
          <motion.div
            className="pointer-events-none absolute z-30"
            initial={{ left: cursor.left, top: cursor.top, opacity: 0 }}
            animate={{ left: cursor.left, top: cursor.top, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={cursorTransition}
          >
            <motion.div
              animate={clicking ? { scale: 0.8 } : { scale: 1 }}
              transition={{ duration: 0.12 }}
              className="relative"
            >
              <MousePointer2
                size={18}
                className="fill-text text-text drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)]"
                strokeWidth={1.5}
              />
              {/* click ripple */}
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
