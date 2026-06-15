'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  Link2,
  Copy,
  Check,
  Instagram,
  MessageCircle,
  Mail,
  Euro,
  MousePointer2,
  ArrowUpRight,
  BadgeCheck,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AffiliateHowData } from '@/lib/content'

export type HowLabels = NonNullable<AffiliateHowData['labels']>
const s = (v: string | null | undefined) => v ?? ''
const fill = (t: string | null | undefined, vars: Record<string, string>) =>
  (t ?? '').replace(/\{(\w+)\}/g, (_, k: string) => vars[k] ?? '')

// ── Shared helpers ────────────────────────────────────────────────────────────

export function useCountUp(to: number, run: boolean, reduce: boolean, from = 0, ms = 1200, delay = 0) {
  const [v, setV] = useState(reduce ? to : from)
  useEffect(() => {
    if (reduce) { setV(to); return }
    if (!run) { setV(from); return }
    let raf = 0
    let startT = 0
    const step = (t: number) => {
      if (!startT) startT = t
      const p = Math.min(1, (t - startT) / ms)
      const e = 1 - Math.pow(1 - p, 3)
      setV(from + (to - from) * e)
      if (p < 1) raf = requestAnimationFrame(step)
    }
    const id = window.setTimeout(() => { raf = requestAnimationFrame(step) }, delay)
    return () => { clearTimeout(id); cancelAnimationFrame(raf) }
  }, [run, reduce, to, from, ms, delay])
  return v
}

function DottedBg() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage: 'radial-gradient(rgba(138,50,224,0.10) 1px, transparent 1px)',
        backgroundSize: '15px 15px',
        WebkitMaskImage: 'radial-gradient(ellipse 85% 80% at 50% 45%, #000 25%, transparent 78%)',
        maskImage: 'radial-gradient(ellipse 85% 80% at 50% 45%, #000 25%, transparent 78%)',
      }}
    />
  )
}

function PvBar({ title, chip }: { title: string; chip: string }) {
  return (
    <div className="relative z-10 flex flex-shrink-0 items-center justify-between border-b border-border bg-surface/80 px-4 pb-3 pt-[13px] backdrop-blur">
      <span className="text-[13.5px] font-bold text-text">{title}</span>
      <span className="whitespace-nowrap rounded-full bg-purple-light px-[9px] py-[3px] text-[10px] font-bold tracking-[0.04em] text-purple">{chip}</span>
    </div>
  )
}

function Tags({ items }: { items: (string | null)[] }) {
  return (
    <div className="relative z-10 flex flex-shrink-0 flex-wrap gap-[5px] border-t border-border bg-surface/80 px-3 pb-[11px] pt-[9px] backdrop-blur">
      {items.filter(Boolean).map((t) => (
        <span key={t} className="rounded-full border border-border bg-surface-2 px-[10px] py-1 text-[11px] font-medium text-text-muted">{t}</span>
      ))}
    </div>
  )
}

function Cursor({ at, clicking }: { at: { left: number; top: number } | null; clicking: boolean }) {
  return (
    <AnimatePresence>
      {at && (
        <motion.div
          className="pointer-events-none absolute z-30"
          initial={{ left: at.left, top: at.top, opacity: 0 }}
          animate={{ left: at.left, top: at.top, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.5, 0, 0.2, 1] }}
        >
          <motion.div animate={clicking ? { scale: 0.82 } : { scale: 1 }} transition={{ duration: 0.12 }} className="relative">
            <MousePointer2 size={18} className="fill-text text-text drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)]" strokeWidth={1.5} />
            <AnimatePresence>
              {clicking && (
                <motion.span
                  className="absolute left-[2px] top-[2px] size-5 rounded-full border border-purple"
                  initial={{ scale: 0.3, opacity: 0.7 }}
                  animate={{ scale: 1.9, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                />
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function centerIn(el: HTMLElement | null, root: HTMLElement | null) {
  if (!el || !root) return null
  const a = el.getBoundingClientRect()
  const b = root.getBoundingClientRect()
  return { left: a.left - b.left + a.width / 2, top: a.top - b.top + a.height / 2 }
}

// ═══ STEP 1 — Register & generate referral link ═══════════════════════════════

const CODE = 'alex-9F2K'
const SCRAMBLE = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

function Scramble({ run, reduce }: { run: boolean; reduce: boolean }) {
  const [txt, setTxt] = useState(reduce ? CODE : '•••••••••')
  useEffect(() => {
    if (reduce) { setTxt(CODE); return }
    if (!run) { setTxt('•••••••••'); return }
    let frame = 0
    const total = 18
    const id = setInterval(() => {
      frame++
      const locked = Math.floor((frame / total) * CODE.length)
      setTxt(CODE.split('').map((ch, i) => (i < locked || ch === '-' ? ch : SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)])).join(''))
      if (frame >= total) { setTxt(CODE); clearInterval(id) }
    }, 50)
    return () => clearInterval(id)
  }, [run, reduce])
  return <span className="tabular-nums tracking-[0.01em]">{txt}</span>
}

export function StateGrab({ active, L }: { active: boolean; L: HowLabels }) {
  const reduce = useReducedMotion() ?? false
  const rootRef = useRef<HTMLDivElement>(null)
  const copyRef = useRef<HTMLButtonElement>(null)
  const [cycle, setCycle] = useState(0)
  const [copied, setCopied] = useState(false)
  const [cursor, setCursor] = useState<{ left: number; top: number } | null>(null)
  const [clicking, setClicking] = useState(false)
  const [verified, setVerified] = useState(false)

  useEffect(() => {
    if (reduce || !active) { setCopied(reduce); setVerified(true); setCursor(null); return }
    let cancelled = false
    const timers: number[] = []
    const wait = (ms: number) => new Promise<void>((r) => timers.push(window.setTimeout(r, ms)))
    async function run() {
      while (!cancelled) {
        setCopied(false); setVerified(false)
        setCursor({ left: (rootRef.current?.clientWidth ?? 320) * 0.5, top: (rootRef.current?.clientHeight ?? 320) * 0.92 })
        await wait(350)
        setVerified(true)
        setCycle((c) => c + 1)
        await wait(1250)
        const c = centerIn(copyRef.current, rootRef.current)
        if (c) setCursor(c)
        await wait(680)
        if (cancelled) return
        setClicking(true); await wait(150); setClicking(false)
        setCopied(true)
        await wait(2100)
      }
    }
    run()
    return () => { cancelled = true; timers.forEach(clearTimeout) }
  }, [active, reduce])

  return (
    <div ref={rootRef} className="relative flex h-full flex-col">
      <PvBar title={s(L.partnerBarTitle)} chip={s(L.freeBadge)} />
      <div className="relative flex flex-1 flex-col justify-center gap-3.5 overflow-hidden p-5">
        <DottedBg />

        <div className="relative flex items-center gap-3 rounded-[14px] border border-border bg-surface px-3.5 py-3 shadow-[var(--shadow-sm)]">
          <span className="grid size-10 place-items-center rounded-full bg-gradient-to-br from-[#B966FE] to-[#9537E4] font-display text-[15px] font-bold text-white">A</span>
          <div className="min-w-0 flex-1">
            <div className="text-[13px] font-bold text-text">{s(L.accountName)}</div>
            <div className="text-[11px] text-text-faint">{s(L.accountRole)}</div>
          </div>
          <AnimatePresence>
            {verified && (
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 420, damping: 18 }}
                className="inline-flex items-center gap-1 rounded-full bg-[#DCFCE7] px-2.5 py-1 text-[10.5px] font-bold text-[#166534]"
              >
                <BadgeCheck className="size-[13px]" strokeWidth={2.4} /> {s(L.approved)}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <div className="relative rounded-[14px] border border-purple-border bg-purple-light/60 px-3.5 py-3">
          <div className="mb-1.5 text-[9.5px] font-bold uppercase tracking-[0.08em] text-text-muted">{s(L.referralLinkLabel)}</div>
          <div className="flex items-center gap-2">
            <span className="grid size-8 flex-none place-items-center rounded-lg bg-surface text-purple shadow-[var(--shadow-xs)]">
              <Link2 className="size-[15px]" strokeWidth={2} />
            </span>
            <code className="min-w-0 flex-1 truncate font-mono text-[13.5px] font-semibold text-text">
              jimmy.app/r/<span className="text-purple"><Scramble key={cycle} run={active} reduce={reduce} /></span>
            </code>
            <button
              ref={copyRef}
              type="button"
              className={cn('inline-flex flex-none items-center gap-1.5 rounded-full px-3 py-1.5 text-[11.5px] font-bold transition-colors', copied ? 'bg-[#DCFCE7] text-[#166534]' : 'bg-purple text-white')}
            >
              {copied ? <Check className="size-[13px]" strokeWidth={3} /> : <Copy className="size-[13px]" strokeWidth={2.5} />}
              {copied ? s(L.copied) : s(L.copy)}
            </button>
          </div>

          <AnimatePresence>
            {copied && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.9 }}
                className="absolute -top-3 right-3 z-20 rounded-full bg-text px-2.5 py-1 text-[10px] font-semibold text-white shadow-[0_8px_20px_-6px_rgba(0,0,0,0.4)]"
              >
                {s(L.copiedToast)}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <Tags items={L.tagsStep1 ?? []} />
      <Cursor at={cursor} clicking={clicking} />
    </div>
  )
}

// ═══ STEP 2 — Track the link you share ════════════════════════════════════════

const CH_META = [
  { Icon: Instagram, to: 612, bg: '#E8630A' },
  { Icon: MessageCircle, to: 438, bg: '#16A34A' },
  { Icon: Mail, to: 234, bg: '#8a32e0' },
]
const SPARK = [8, 14, 12, 22, 28, 24, 36, 44, 40, 56, 64, 72]

function ChannelTrack({ meta, name, source, active, reduce, delay, max }: { meta: typeof CH_META[number]; name: string; source: string; active: boolean; reduce: boolean; delay: number; max: number }) {
  const v = useCountUp(meta.to, active, reduce, 0, 1100, delay)
  const finalPct = (meta.to / max) * 100
  return (
    <div className="relative flex items-center gap-2.5">
      <span className="grid size-7 flex-none place-items-center rounded-lg text-white" style={{ background: meta.bg }}>
        <meta.Icon className="size-[14px]" strokeWidth={2} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-semibold text-text">{name}</span>
          <span className="text-[12px] font-extrabold tabular-nums text-text">{Math.round(v).toLocaleString('en-US')}</span>
        </div>
        <div className="mt-1 h-[5px] overflow-hidden rounded-full bg-surface-offset">
          <motion.div
            className="h-full rounded-full"
            style={{ background: meta.bg }}
            initial={{ width: '0%' }}
            animate={{ width: active || reduce ? `${finalPct}%` : '0%' }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: reduce ? 0 : delay / 1000 }}
          />
        </div>
      </div>
    </div>
  )
}

export function StateShare({ active, L }: { active: boolean; L: HowLabels }) {
  const reduce = useReducedMotion() ?? false
  const clicks = useCountUp(1284, active, reduce, 0, 1500)
  const max = Math.max(...CH_META.map((c) => c.to))
  const channels = L.channels ?? []
  const points = SPARK.map((y, i) => `${(i / (SPARK.length - 1)) * 100},${40 - (y / 72) * 34}`).join(' ')
  const area = `0,40 ${points} 100,40`

  return (
    <div className="relative flex h-full flex-col">
      <PvBar title={s(L.shareBarTitle)} chip={s(L.liveBadge)} />
      <div className="relative flex flex-1 flex-col gap-3.5 overflow-hidden p-5">
        <DottedBg />

        <div className="relative flex items-end justify-between gap-3 rounded-[14px] border border-purple-border bg-purple-light/60 px-4 py-3">
          <div>
            <div className="text-[9.5px] font-bold uppercase tracking-[0.08em] text-text-muted">{s(L.linkClicksLabel)}</div>
            <div className="font-display text-[2rem] font-extrabold leading-[1.05] tracking-[-0.04em] tabular-nums text-text">{Math.round(clicks).toLocaleString('en-US')}</div>
            <div className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-[#DCFCE7] px-2 py-0.5 text-[10px] font-semibold text-[#166534]">
              <ArrowUpRight className="size-[10px]" strokeWidth={2.4} /> {s(L.clicksBadge)}
            </div>
          </div>
          <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="h-[58px] w-[46%]">
            <defs>
              <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8a32e0" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#8a32e0" stopOpacity="0" />
              </linearGradient>
            </defs>
            <motion.polygon points={area} fill="url(#sparkFill)" initial={{ opacity: 0 }} animate={{ opacity: active || reduce ? 1 : 0 }} transition={{ duration: 0.6, delay: reduce ? 0 : 0.5 }} />
            <motion.polyline points={points} fill="none" stroke="#8a32e0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" initial={{ pathLength: 0 }} animate={{ pathLength: active || reduce ? 1 : 0 }} transition={{ duration: 1.2, ease: 'easeInOut' }} />
          </svg>
        </div>

        <div className="relative flex flex-1 flex-col justify-center gap-3.5 rounded-[14px] border border-border bg-surface px-4 py-3.5 shadow-[var(--shadow-sm)]">
          {CH_META.map((meta, i) => (
            <ChannelTrack key={i} meta={meta} name={s(channels[i]?.name)} source={s(channels[i]?.source)} active={active} reduce={reduce} delay={200 + i * 180} max={max} />
          ))}
        </div>
      </div>
      <Tags items={L.tagsStep2 ?? []} />
    </div>
  )
}

// ═══ STEP 3 — Referrals pay you · withdraw ════════════════════════════════════

const PAY_AMTS = ['€249.00', '€373.50', '€448.20', '€312.00', '€529.00']
const PAY_DATES = ['09/27', '10/27', '11/27', '12/27', '01/28']
const CARD_H = 64
const GAP = 10
const SET_H = PAY_AMTS.length * (CARD_H + GAP)

function PayCard({ amt, date, L }: { amt: string; date: string; L: HowLabels }) {
  return (
    <div className="flex items-center gap-3 rounded-[12px] border border-border bg-surface px-3 shadow-[var(--shadow-sm)]" style={{ height: CARD_H }}>
      <span className="grid size-9 flex-none place-items-center rounded-[10px] bg-purple-light text-purple">
        <Euro className="size-[17px]" strokeWidth={2.2} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-[12.5px] font-bold text-text">{fill(L.newPaymentTemplate, { amt })}</div>
        <div className="mt-1 flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-md bg-surface-2 px-1.5 py-0.5 text-[10px] font-semibold text-text-muted">
            <Check className="size-[10px] text-[#22C55E]" strokeWidth={3} /> {s(L.completed)} · {date}
          </span>
          <span className="rounded-md px-1.5 py-0.5 text-[10px] font-medium text-text-faint">{s(L.commissionTag)}</span>
        </div>
      </div>
    </div>
  )
}

export function StateEarn({ active, L }: { active: boolean; L: HowLabels }) {
  const reduce = useReducedMotion() ?? false
  const balance = useCountUp(1911.7, active, reduce, 0, 1600)

  return (
    <div className="relative flex h-full flex-col">
      <PvBar title={s(L.commissionsBarTitle)} chip={s(L.monthBadge)} />
      <div className="relative flex flex-1 flex-col gap-3 overflow-hidden p-5">
        <DottedBg />

        <div className="relative flex items-center justify-between gap-3 rounded-[14px] border border-purple-border bg-purple-light/60 px-4 py-3">
          <div>
            <div className="text-[9.5px] font-bold uppercase tracking-[0.08em] text-text-muted">{s(L.availableLabel)}</div>
            <div className="font-display text-[1.7rem] font-extrabold leading-[1.1] tracking-[-0.04em] tabular-nums text-text">
              €{balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
          <motion.span
            animate={active && !reduce ? { scale: [1, 1.04, 1] } : { scale: 1 }}
            transition={{ duration: 1.6, repeat: active && !reduce ? Infinity : 0, ease: 'easeInOut' }}
            className="inline-flex flex-none items-center gap-1.5 rounded-full bg-purple px-4 py-2 text-[12px] font-bold text-white shadow-[0_8px_20px_-8px_rgba(138,50,224,0.7)]"
          >
            {s(L.withdraw)} <ArrowUpRight className="size-[14px]" strokeWidth={2.4} />
          </motion.span>
        </div>

        <div
          className="relative flex-1 overflow-hidden"
          style={{
            WebkitMaskImage: 'linear-gradient(to bottom, transparent, #000 16%, #000 84%, transparent)',
            maskImage: 'linear-gradient(to bottom, transparent, #000 16%, #000 84%, transparent)',
          }}
        >
          <motion.div
            className="absolute inset-x-0 top-0 flex flex-col"
            style={{ gap: GAP }}
            animate={active && !reduce ? { y: [0, -SET_H] } : { y: 0 }}
            transition={active && !reduce ? { duration: 9, ease: 'linear', repeat: Infinity } : { duration: 0 }}
          >
            {[...PAY_AMTS, ...PAY_AMTS].map((amt, i) => (
              <PayCard key={i} amt={amt} date={PAY_DATES[i % PAY_DATES.length]} L={L} />
            ))}
          </motion.div>
        </div>
      </div>
      <Tags items={L.tagsStep3 ?? []} />
    </div>
  )
}
