'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, m as motion, useInView, useReducedMotion } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

// ── Data ──────────────────────────────────────────────────────────────────────

type Payment = { name: string; initial: string; color: string; amount: number }

const PAYMENTS: Payment[] = [
  { name: 'Marco D.', initial: 'M', color: '#2563EB', amount: 89 },
  { name: 'Sara M.', initial: 'S', color: '#16A34A', amount: 89 },
  { name: 'John B.', initial: 'J', color: '#8a32e0', amount: 59 },
  { name: 'Lena K.', initial: 'L', color: '#E8630A', amount: 89 },
]

const TOTAL = PAYMENTS.reduce((s, p) => s + p.amount, 0) // 326
const REVENUE_TARGET = 3840
const REVENUE_START = REVENUE_TARGET - TOTAL // counts up to 3,840

// Past months are static; the current month (last) grows with each payment.
const PAST_MONTHS = [
  { m: 'Jan', h: 44 },
  { m: 'Feb', h: 54 },
  { m: 'Mar', h: 49 },
  { m: 'Apr', h: 65 },
  { m: 'May', h: 73 },
]
const CUR_BASE = 48
const CUR_STEP = 12 // 4 payments → 48,60,72,84,96

const TOAST_W = 164
const TOAST_H = 34

// ── Geometry helper ───────────────────────────────────────────────────────────

type Box = { left: number; top: number; w: number; h: number }
function centerIn(el: HTMLElement | null, container: HTMLElement | null): Box | null {
  if (!el || !container) return null
  const a = el.getBoundingClientRect()
  const b = container.getBoundingClientRect()
  return { left: a.left - b.left + a.width / 2, top: a.top - b.top + a.height / 2, w: a.width, h: a.height }
}

// ── Count-up number (tweens up; snaps on reset) ───────────────────────────────

function useCountUp(target: number, reduce: boolean, ms = 650) {
  const [val, setVal] = useState(target)
  const fromRef = useRef(target)
  useEffect(() => {
    if (reduce) {
      setVal(target)
      fromRef.current = target
      return
    }
    const from = fromRef.current
    if (target <= from) {
      setVal(target)
      fromRef.current = target
      return
    }
    const start = performance.now()
    let raf = 0
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / ms)
      const e = 1 - Math.pow(1 - p, 3)
      setVal(Math.round(from + (target - from) * e))
      if (p < 1) raf = requestAnimationFrame(tick)
      else fromRef.current = target
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, reduce, ms])
  return val
}

type Float = { id: number; amount: number; left: number; top: number }

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * Looping ~7s illustration: incoming Stripe payments fly in as notifications and
 * each one "lands" — the current month's bar on the revenue chart grows, the big
 * revenue figure counts up and a green +€ rises. Sells "the system runs your
 * business while you coach".
 *
 * `embedded` strips the outer card chrome; `active` (default true) lets a host
 * pause + reset when its panel isn't on display.
 */
export function PaymentsDemo({
  embedded = false,
  active = true,
}: {
  embedded?: boolean
  active?: boolean
}) {
  const reduce = useReducedMotion() ?? false
  const containerRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const numRef = useRef<HTMLDivElement>(null)
  const inView = useInView(containerRef, { amount: 0.35 })
  const running = inView && active

  const [level, setLevel] = useState(reduce ? PAYMENTS.length : 0) // current-month growth
  const [revenue, setRevenue] = useState(reduce ? REVENUE_TARGET : REVENUE_START)
  const [toast, setToast] = useState<number | null>(null)
  const [toastBox, setToastBox] = useState<{ from: Box; to: Box } | null>(null)
  const [floats, setFloats] = useState<Float[]>([])

  const displayRevenue = useCountUp(revenue, reduce)

  // Measure the flight path when a notification appears.
  useEffect(() => {
    if (toast === null) {
      setToastBox(null)
      return
    }
    const bar = centerIn(barRef.current, containerRef.current)
    const cw = containerRef.current?.clientWidth ?? 280
    if (!bar) return
    const toLeft = Math.max(6, Math.min(cw - TOAST_W - 6, bar.left - TOAST_W / 2))
    const toTop = Math.max(4, bar.top - bar.h / 2 - TOAST_H - 10)
    setToastBox({
      from: { left: cw + 12, top: toTop, w: TOAST_W, h: TOAST_H },
      to: { left: toLeft, top: toTop, w: TOAST_W, h: TOAST_H },
    })
  }, [toast])

  useEffect(() => {
    if (reduce) {
      setLevel(PAYMENTS.length)
      setRevenue(REVENUE_TARGET)
      return
    }
    if (!running) {
      setLevel(0)
      setRevenue(REVENUE_START)
      setToast(null)
      setFloats([])
      return
    }
    let cancelled = false
    let floatId = 0
    const timers: number[] = []
    const wait = (ms: number) =>
      new Promise<void>((r) => timers.push(window.setTimeout(r, ms)))

    async function run() {
      while (!cancelled) {
        setLevel(0)
        setRevenue(REVENUE_START)
        setToast(null)
        setFloats([])
        await wait(550)

        let acc = REVENUE_START
        for (let i = 0; i < PAYMENTS.length; i++) {
          if (cancelled) return
          setToast(i) // notification flies in
          await wait(720)
          if (cancelled) return
          // land: grow bar, tick revenue, float +€
          setLevel(i + 1)
          acc += PAYMENTS[i].amount
          setRevenue(acc)
          const num = centerIn(numRef.current, containerRef.current)
          if (num) {
            const id = floatId++
            setFloats((f) => [...f, { id, amount: PAYMENTS[i].amount, left: num.left + num.w / 2 + 10, top: num.top - num.h / 2 }])
            timers.push(window.setTimeout(() => !cancelled && setFloats((f) => f.filter((x) => x.id !== id)), 1100))
          }
          await wait(230)
          setToast(null) // fade the notification
          await wait(470)
        }
        await wait(900)
      }
    }
    run()
    return () => {
      cancelled = true
      timers.forEach((t) => clearTimeout(t))
    }
  }, [reduce, running])

  const curH = CUR_BASE + level * CUR_STEP
  const p = toast !== null ? PAYMENTS[toast] : null

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative flex w-full flex-col',
        !embedded && 'rounded-xl border border-border bg-surface p-3',
      )}
    >
      {/* Header: revenue figure + Live pill */}
      <div className="mb-[14px] flex items-start justify-between">
        <div>
          <div className="text-[9.5px] font-semibold uppercase tracking-[0.07em] text-text-faint">
            Revenue this month
          </div>
          <div className="flex items-center gap-[7px]">
            <div
              ref={numRef}
              className="font-display text-[1.75rem] font-extrabold leading-[1.1] tracking-[-0.04em] text-text tabular-nums"
            >
              €{displayRevenue.toLocaleString('en-US')}
            </div>
            <span className="mb-[2px] inline-flex items-center gap-[2px] self-end rounded-full bg-[#DCFCE7] px-[6px] py-[2px] text-[9.5px] font-bold text-[#166534]">
              ▲ 28%
            </span>
          </div>
        </div>
        <span className="inline-flex items-center gap-[5px] rounded-full border border-border bg-surface-2 px-[8px] py-[3px] text-[9.5px] font-semibold text-text-muted">
          <span className="size-[6px] rounded-full bg-[#22C55E]" />
          Live
        </span>
      </div>

      {/* Revenue chart */}
      <div className="flex h-[96px] items-end gap-[6px]">
        {PAST_MONTHS.map((col) => (
          <div key={col.m} className="flex h-full flex-1 flex-col justify-end">
            <div
              className="w-full rounded-t-[3px] bg-purple/25"
              style={{ height: `${col.h}%` }}
            />
          </div>
        ))}
        {/* current month — grows with payments */}
        <div className="flex h-full flex-1 flex-col justify-end">
          <motion.div
            ref={barRef}
            className="w-full rounded-t-[3px] bg-purple shadow-[0_0_0_1px_rgba(138,50,224,0.15)]"
            animate={{ height: `${curH}%` }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
          />
        </div>
      </div>
      <div className="mt-[5px] flex gap-[6px]">
        {[...PAST_MONTHS.map((c) => c.m), 'Jun'].map((m, i) => (
          <span
            key={m}
            className={cn(
              'flex-1 text-center text-[9px]',
              i === PAST_MONTHS.length ? 'font-bold text-purple' : 'text-text-faint',
            )}
          >
            {m}
          </span>
        ))}
      </div>

      {/* Floating +€ */}
      <AnimatePresence>
        {floats.map((f) => (
          <motion.span
            key={f.id}
            className="pointer-events-none absolute z-20 text-[12px] font-bold text-[#16A34A]"
            style={{ left: f.left, top: f.top }}
            initial={{ opacity: 0, y: 4, scale: 0.7 }}
            animate={{ opacity: [0, 1, 1, 0], y: -26, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            +€{f.amount}
          </motion.span>
        ))}
      </AnimatePresence>

      {/* Flying payment notification */}
      <AnimatePresence>
        {p && toastBox && (
          <motion.div
            key={toast}
            className="pointer-events-none absolute z-30 flex items-center gap-[7px] rounded-[10px] border border-border bg-surface px-[9px] py-[7px] shadow-[0_10px_26px_-8px_rgba(0,0,0,0.28)]"
            style={{ width: TOAST_W }}
            initial={{ left: toastBox.from.left, top: toastBox.from.top, opacity: 0, scale: 0.96 }}
            animate={{ left: toastBox.to.left, top: toastBox.to.top, opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.94, transition: { duration: 0.22 } }}
            transition={{ duration: 0.6, ease: [0.5, 0, 0.2, 1] }}
          >
            <span
              className="flex size-[22px] flex-shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white"
              style={{ background: p.color }}
            >
              {p.initial}
            </span>
            <span className="min-w-0 flex-1 leading-tight">
              <span className="block truncate text-[10.5px] font-semibold text-text">{p.name}</span>
              <span className="block truncate whitespace-nowrap text-[9px] text-text-faint">Auto-billed</span>
            </span>
            <span className="text-[11px] font-extrabold text-text tabular-nums">+€{p.amount}</span>
            <span className="flex size-[15px] flex-shrink-0 items-center justify-center rounded-full bg-[#22C55E]">
              <Check size={9} strokeWidth={3} className="text-white" />
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
