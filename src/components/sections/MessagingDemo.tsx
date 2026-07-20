'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, m as motion, useInView, useReducedMotion } from 'framer-motion'
import { Play, Pause, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

// ── Thread data ───────────────────────────────────────────────────────────────
// Each message reserves a fixed-height slot so the panel never reflows.

type Msg =
  | { kind: 'out'; text: string; time: string; h: number; receipt?: boolean }
  | { kind: 'in'; text: string; time: string; h: number; typingFirst?: boolean }
  | { kind: 'voice'; time: string; h: number }

const MESSAGES: Msg[] = [
  { kind: 'out', text: 'Hey Marco, your new program is ready 💪', time: '09:41', h: 58, receipt: true },
  { kind: 'in', text: 'Amazing! One question about the EMOM block—', time: '09:42', h: 48, typingFirst: true },
  { kind: 'voice', time: '09:42', h: 46 },
  { kind: 'out', text: 'Sure! Check this modification 🎯', time: '09:43', h: 48 },
]

const N = MESSAGES.length
const WAVE = [55, 100, 42, 78, 60, 92, 38, 70, 50, 84, 46, 66] // voice waveform bars

// ── Typing indicator ──────────────────────────────────────────────────────────

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-[3px] rounded-xl rounded-bl-[3px] border border-border bg-surface-2 px-[11px] py-[10px]">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="size-[5px] rounded-full bg-text-faint"
          animate={{ y: [0, -3, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut', delay: i * 0.15 }}
        />
      ))}
    </span>
  )
}

// ── Read receipt (✓✓ that turns blue when read) ────────────────────────────────

function Receipt({ read }: { read: boolean }) {
  return (
    <span className="relative inline-flex h-[11px] w-[15px] items-center">
      <Check
        size={11}
        strokeWidth={3}
        className={cn('absolute left-0 transition-colors', read ? 'text-[#2563EB]' : 'text-text-faint')}
      />
      <Check
        size={11}
        strokeWidth={3}
        className={cn('absolute left-[4px] transition-colors', read ? 'text-[#2563EB]' : 'text-text-faint')}
      />
    </span>
  )
}

// ── Voice message (bars pulse + a progress dot travels while playing) ──────────

const VOICE_PLAY_MS = 1700

function VoiceBubble({ playing }: { playing: boolean }) {
  return (
    <span className="flex w-[210px] max-w-[82%] items-center gap-[9px] self-start rounded-xl rounded-bl-[3px] border border-border bg-surface-2 px-[11px] py-[9px]">
      <span className="flex size-[24px] flex-shrink-0 items-center justify-center rounded-full bg-purple text-white">
        {playing ? (
          <Pause size={10} strokeWidth={2.5} className="fill-current" />
        ) : (
          <Play size={10} strokeWidth={2} className="ml-[1px] fill-current" />
        )}
      </span>

      <span className="relative flex h-[18px] flex-1 items-center">
        {/* base (unplayed) waveform */}
        <span className="flex h-full w-full items-center gap-[2px]">
          {WAVE.map((h, i) => (
            <span
              key={i}
              className="flex-1 rounded-full bg-text-faint/45"
              style={{ height: `${h}%` }}
            />
          ))}
        </span>
        {/* played overlay — identical bars in purple, revealed left→right */}
        <motion.span
          className="absolute inset-0 flex h-full w-full items-center gap-[2px]"
          initial={false}
          animate={{ clipPath: playing ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)' }}
          transition={{ duration: playing ? VOICE_PLAY_MS / 1000 : 0.25, ease: 'linear' }}
        >
          {WAVE.map((h, i) => (
            <span
              key={i}
              className="flex-1 rounded-full bg-purple"
              style={{ height: `${h}%` }}
            />
          ))}
        </motion.span>
      </span>

      <span className="whitespace-nowrap text-[10px] tabular-nums text-text-faint">0:24</span>
    </span>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * Looping ~6.5s illustration of an in-app 1:1 coach↔client chat: a message is
 * sent (✓✓ turns read), the client starts typing, replies, sends a voice note
 * that plays, and the coach answers. Replaces "managing coaching over WhatsApp".
 *
 * `embedded` strips the outer card chrome; `active` (default true) lets a host
 * pause + reset when its panel isn't on display.
 */
export function MessagingDemo({
  embedded = false,
  active = true,
}: {
  embedded?: boolean
  active?: boolean
}) {
  const reduce = useReducedMotion() ?? false
  const containerRef = useRef<HTMLDivElement>(null)
  const inView = useInView(containerRef, { amount: 0.35 })
  const running = inView && active

  const [shown, setShown] = useState(reduce ? N : 0)
  const [typing, setTyping] = useState(false)
  const [read, setRead] = useState(reduce)
  const [voicePlaying, setVoicePlaying] = useState(false)

  useEffect(() => {
    if (reduce) {
      setShown(N)
      setRead(true)
      return
    }
    if (!running) {
      setShown(0)
      setTyping(false)
      setRead(false)
      setVoicePlaying(false)
      return
    }
    let cancelled = false
    const timers: number[] = []
    const wait = (ms: number) =>
      new Promise<void>((r) => timers.push(window.setTimeout(r, ms)))

    async function run() {
      while (!cancelled) {
        setShown(0)
        setTyping(false)
        setRead(false)
        setVoicePlaying(false)
        await wait(450)

        // msg 0 — coach sends, then it gets read
        setShown(1)
        await wait(550)
        setRead(true)
        await wait(500)

        // msg 1 — client typing → reply
        setShown(2)
        setTyping(true)
        await wait(850)
        if (cancelled) return
        setTyping(false)
        await wait(600)

        // msg 2 — voice note plays
        setShown(3)
        await wait(350)
        setVoicePlaying(true)
        await wait(1750)
        if (cancelled) return
        setVoicePlaying(false)
        await wait(180)

        // msg 3 — coach replies
        setShown(4)
        await wait(650)

        await wait(900) // hold
      }
    }
    run()
    return () => {
      cancelled = true
      timers.forEach((t) => clearTimeout(t))
    }
  }, [reduce, running])

  return (
    <div
      ref={containerRef}
      className={cn(
        'flex w-full flex-col gap-[5px]',
        !embedded && 'rounded-xl border border-border bg-surface p-3',
      )}
    >
      {MESSAGES.map((m, i) => {
        const isShown = i < shown
        const isTyping = m.kind === 'in' && m.typingFirst && typing && i === 1
        return (
          <div
            key={i}
            style={{ height: m.h }}
            className={cn('flex flex-col', m.kind === 'out' ? 'items-end' : 'items-start')}
          >
            <AnimatePresence mode="wait">
              {isShown && (
                <motion.div
                  key={isTyping ? 'typing' : 'msg'}
                  className={cn('flex flex-col', m.kind === 'out' ? 'items-end' : 'items-start')}
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.12 } }}
                  transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                >
                  {isTyping ? (
                    <TypingDots />
                  ) : m.kind === 'voice' ? (
                    <VoiceBubble playing={voicePlaying} />
                  ) : (
                    <>
                      <span
                        className={cn(
                          'max-w-[80%] px-[11px] py-[7px] text-[11.5px] leading-[1.4]',
                          m.kind === 'out'
                            ? 'rounded-xl rounded-br-[3px] bg-purple text-white'
                            : 'rounded-xl rounded-bl-[3px] border border-border bg-surface-2 text-text',
                        )}
                      >
                        {m.text}
                      </span>
                      {m.kind === 'out' && (
                        <span className="mt-[2px] inline-flex items-center gap-[3px] px-[2px] text-[10px] text-text-faint">
                          {m.time}
                          {m.receipt && <Receipt read={read} />}
                        </span>
                      )}
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
