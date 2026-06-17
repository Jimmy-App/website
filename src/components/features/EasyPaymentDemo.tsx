'use client'

/**
 * EasyPaymentDemo — member-side in-app checkout. The card number auto-fills,
 * the member can pay with Apple Pay or card, the Pay button shows a brief
 * processing spinner, then the payment lands on a success state before looping.
 * `active`-gated so it only runs in view; reduced-motion safe.
 */

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Check, CreditCard, Lock, Loader2 } from 'lucide-react'

const CARD = '4242424242424242'
const PRICE = '€49.00'

// Apple logo mark (lucide has no brand glyph).
function AppleMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M17.05 12.04c-.03-2.9 2.37-4.3 2.48-4.36-1.35-1.98-3.46-2.25-4.21-2.28-1.79-.18-3.5 1.05-4.41 1.05-.9 0-2.31-1.03-3.8-1-1.95.03-3.75 1.13-4.75 2.88-2.03 3.52-.52 8.74 1.45 11.6.96 1.4 2.11 2.97 3.62 2.91 1.45-.06 2-.94 3.75-.94 1.75 0 2.24.94 3.77.91 1.56-.03 2.55-1.42 3.5-2.83 1.1-1.62 1.56-3.19 1.58-3.27-.03-.02-3.03-1.16-3.06-4.6zM14.13 4.7c.8-.97 1.34-2.31 1.19-3.65-1.15.05-2.55.77-3.38 1.73-.74.85-1.39 2.22-1.22 3.53 1.29.1 2.6-.65 3.41-1.61z" />
    </svg>
  )
}

export function EasyPaymentDemo({ active = true }: { active?: boolean }) {
  const reduce = useReducedMotion() ?? false
  const [typed, setTyped] = useState(0) // digits revealed (0..16)
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  const iv = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const clear = () => {
      timers.current.forEach((t) => clearTimeout(t))
      timers.current = []
      if (iv.current) clearInterval(iv.current)
      iv.current = null
    }
    if (!active) {
      clear()
      setTyped(0)
      setProcessing(false)
      setSuccess(false)
      return
    }
    if (reduce) {
      setTyped(16)
      setSuccess(true)
      return
    }

    const push = (t: ReturnType<typeof setTimeout>) => timers.current.push(t)
    const run = () => {
      setTyped(0)
      setProcessing(false)
      setSuccess(false)
      // Auto-type the card number
      push(
        setTimeout(() => {
          let n = 0
          iv.current = setInterval(() => {
            n += 1
            setTyped(n)
            if (n >= 16 && iv.current) {
              clearInterval(iv.current)
              iv.current = null
            }
          }, 75)
        }, 600),
      )
      push(setTimeout(() => setProcessing(true), 2300)) // press Pay
      push(
        setTimeout(() => {
          setProcessing(false)
          setSuccess(true)
        }, 3400),
      )
      push(setTimeout(run, 5700)) // loop
    }
    run()
    return clear
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, reduce])

  const filled = typed >= 16

  return (
    <div className="relative flex flex-col gap-3 p-1">
      {/* Plan summary */}
      <div className="flex items-center gap-3 rounded-xl border border-border bg-surface px-3.5 py-3">
        <span className="grid size-9 flex-none place-items-center rounded-[11px] bg-purple-light text-purple">
          <CreditCard size={16} strokeWidth={2} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-bold text-text">Premium plan</div>
          <div className="text-[11px] font-medium text-text-faint">Billed monthly · cancel anytime</div>
        </div>
        <div className="text-right">
          <div className="font-display text-[15px] font-extrabold tabular-nums text-text">{PRICE}</div>
          <div className="text-[10px] font-medium text-text-faint">/ month</div>
        </div>
      </div>

      {/* Apple Pay */}
      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        className="flex h-11 items-center justify-center gap-1.5 rounded-xl bg-[#111] text-white"
      >
        <AppleMark className="size-[18px]" />
        <span className="text-[15px] font-semibold tracking-[-0.01em]">Pay</span>
      </button>

      {/* Divider */}
      <div className="flex items-center gap-2.5 px-0.5">
        <span className="h-px flex-1 bg-border" />
        <span className="text-[10.5px] font-semibold uppercase tracking-[0.1em] text-text-faint">or pay with card</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      {/* Card field */}
      <div className="rounded-xl border border-border bg-surface px-3.5 py-3">
        <div className="mb-2.5 flex items-center gap-2">
          <CreditCard size={15} className="text-text-faint" strokeWidth={2} />
          <div className="flex flex-1 items-center font-mono text-[13px] tracking-[0.06em] text-text">
            {Array.from({ length: 16 }).map((_, i) => {
              const show = i < typed
              const space = i > 0 && i % 4 === 0
              const caret = i === typed && typed < 16 && !success
              return (
                <span key={i} className={'relative ' + (space ? 'ml-[6px]' : '')}>
                  {caret && (
                    <motion.span
                      aria-hidden="true"
                      className="absolute -left-[2px] top-1/2 h-[15px] w-[1.5px] -translate-y-1/2 bg-purple"
                      animate={{ opacity: [1, 0.15, 1] }}
                      transition={{ duration: 0.7, repeat: Infinity }}
                    />
                  )}
                  <span className={show ? 'text-text' : 'text-text-faint/50'}>{show ? CARD[i] : '•'}</span>
                </span>
              )
            })}
          </div>
          <span className="font-display text-[11px] font-extrabold italic tracking-[-0.02em] text-[#1a1f71]">
            VISA
          </span>
        </div>
        <div className="flex gap-2 pl-[23px]">
          <div className="flex-1 rounded-md bg-surface-2 px-2.5 py-1.5 font-mono text-[11.5px] text-text-muted ring-1 ring-inset ring-border">
            {filled ? '12 / 28' : 'MM / YY'}
          </div>
          <div className="flex-1 rounded-md bg-surface-2 px-2.5 py-1.5 font-mono text-[11.5px] text-text-muted ring-1 ring-inset ring-border">
            {filled ? '•••' : 'CVC'}
          </div>
        </div>
      </div>

      {/* Pay button */}
      <motion.div
        animate={processing && !reduce ? { scale: 0.985 } : { scale: 1 }}
        transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
        className={
          'flex h-11 items-center justify-center gap-2 rounded-xl text-[14px] font-semibold text-white transition-colors duration-300 ' +
          (filled || processing ? 'bg-purple' : 'bg-purple/55')
        }
      >
        {processing ? (
          <>
            <Loader2 size={16} className="animate-spin" strokeWidth={2.4} />
            Processing…
          </>
        ) : (
          <>Pay {PRICE}</>
        )}
      </motion.div>

      {/* Secured footer */}
      <div className="flex items-center justify-center gap-1.5 text-[10.5px] font-medium text-text-faint">
        <Lock size={11} strokeWidth={2} />
        Secured by Stripe
      </div>

      {/* Success overlay */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 z-10 flex items-center justify-center rounded-[16px] bg-surface/85 backdrop-blur-[2px]"
          >
            <motion.div
              initial={reduce ? false : { scale: 0.85, y: 8, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{ type: 'spring', duration: 0.5, bounce: 0.34 }}
              className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-surface px-8 py-6 text-center shadow-[0_20px_50px_-24px_rgba(40,30,55,0.45)]"
            >
              <motion.span
                initial={reduce ? false : { scale: 0.4 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', duration: 0.45, bounce: 0.5, delay: 0.05 }}
                className="grid size-12 place-items-center rounded-full bg-green-500 text-white"
              >
                <Check size={24} strokeWidth={3} />
              </motion.span>
              <div className="font-display text-[16px] font-extrabold text-text">Payment successful</div>
              <div className="text-[12px] text-text-muted">
                {PRICE} paid · <span className="font-semibold text-text">Premium active</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
