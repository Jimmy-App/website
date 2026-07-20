'use client'

import { useEffect, useRef, useState } from 'react'
import { m as motion, useAnimation, useInView, useReducedMotion } from 'framer-motion'
import { Link2, Share2, CreditCard } from 'lucide-react'
import { cn } from '@/lib/utils'
import { StateGrab, StateShare, StateEarn, type HowLabels } from './howItWorksStates'
import type { AffiliateHowData } from '@/lib/content'

// Mirrors THE PLATFORM on the home page: 7s per step, auto-advancing, gated by
// view + active — each step shows its own bespoke animated illustration.
const DURATION = 7000

const STEP_ICONS = [Link2, Share2, CreditCard]
const STATES = [StateGrab, StateShare, StateEarn]

function ProgressBar({ active, run }: { active: boolean; run: boolean }) {
  const controls = useAnimation()
  useEffect(() => {
    if (!active || !run) { controls.set({ width: '0%' }); return }
    controls.set({ width: '0%' })
    controls.start({ width: '100%', transition: { duration: DURATION / 1000, ease: 'linear' } })
    return () => { controls.stop() }
  }, [active, run, controls])
  return (
    <span className={cn('mt-[9px] block h-[2px] overflow-hidden rounded-full bg-[rgba(138,50,224,0.15)] transition-opacity', active ? 'opacity-100' : 'opacity-0')}>
      <motion.span className="block h-full rounded-full bg-purple" style={{ width: '0%' }} animate={controls} />
    </span>
  )
}

export function AffiliateHowItWorks({ data }: { data: AffiliateHowData }) {
  const reduce = useReducedMotion() ?? false
  const sectionRef = useRef<HTMLElement>(null)
  const inView = useInView(sectionRef, { amount: 'some' })
  const [active, setActive] = useState(0)

  const steps = data.steps ?? []
  const labels = (data.labels ?? {}) as HowLabels

  useEffect(() => {
    if (reduce || !inView || steps.length === 0) return
    const id = setTimeout(() => setActive((a) => (a + 1) % steps.length), DURATION)
    return () => clearTimeout(id)
  }, [active, inView, reduce, steps.length])

  return (
    <section ref={sectionRef} id="how" aria-label={data.title ?? 'How it works'} className="border-y border-border bg-surface-2">
      <div className="mx-auto max-w-[1160px] px-[clamp(20px,5vw,40px)] py-[clamp(4rem,7vw,6.5rem)]">
        <header className="mb-[clamp(3rem,5vw,4rem)] text-center">
          <span className="mb-[0.9rem] block text-[11px] font-bold uppercase tracking-[0.12em] text-purple">{data.eyebrow}</span>
          <h2 className="mb-[0.8rem] font-display text-[clamp(2.4rem,5vw,4rem)] font-extrabold leading-[1.05] tracking-[-0.04em] text-text text-balance">{data.title}</h2>
          <p className="mx-auto max-w-[500px] text-[16px] leading-[1.6] text-text-muted">{data.subtitle}</p>
        </header>

        <div className="grid grid-cols-[42fr_58fr] items-start gap-[clamp(2rem,4vw,3.5rem)] max-[860px]:grid-cols-1">
          {/* Left nav */}
          <div className="flex flex-col gap-[3px]">
            {steps.map((st, i) => {
              const isActive = i === active
              const Icon = STEP_ICONS[i] ?? Link2
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActive(i)}
                  className={cn(
                    'flex w-full items-start gap-3 rounded-[14px] border p-[14px_12px] text-left transition-[background,border-color,box-shadow] duration-200',
                    isActive
                      ? 'border-purple-border bg-surface shadow-[0_2px_16px_rgba(138,50,224,0.08),0_1px_4px_rgba(0,0,0,0.04)]'
                      : 'border-transparent hover:bg-[rgba(138,50,224,0.04)]',
                  )}
                >
                  <span className={cn('mt-px flex size-9 flex-shrink-0 items-center justify-center rounded-[10px] transition-colors duration-200', isActive ? 'bg-purple-light text-purple' : 'bg-surface-offset text-text-muted')}>
                    <Icon className="size-4" strokeWidth={2} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={cn('mb-0.5 block text-[10px] font-bold uppercase tracking-[0.1em] transition-colors duration-[180ms]', isActive ? 'text-purple' : 'text-text-faint')}>{st.label}</span>
                    <span className={cn('mb-0.5 block font-display text-base font-bold tracking-[-0.02em] leading-[1.25] transition-colors duration-[180ms]', isActive ? 'text-text' : 'text-text-muted')}>{st.name}</span>
                    <span className={cn('block text-[12px] leading-[1.4] transition-colors duration-[180ms]', isActive ? 'text-text-muted' : 'text-text-faint')}>{st.tagline}</span>
                    <ProgressBar active={isActive} run={inView && !reduce} />
                  </span>
                </button>
              )
            })}
          </div>

          {/* Right preview */}
          <div className="sticky top-[5.5rem] max-[860px]:static">
            <div className="relative h-[464px] overflow-hidden rounded-[22px] border border-border bg-surface shadow-[0_4px_32px_rgba(0,0,0,0.07),0_1px_4px_rgba(0,0,0,0.04)]">
              {STATES.map((State, i) => (
                <div
                  key={i}
                  aria-hidden={i !== active}
                  className={cn(
                    'absolute inset-0 transition-[opacity,transform,filter] duration-[440ms]',
                    '[transition-timing-function:cubic-bezier(0.16,1,0.3,1)]',
                    i === active ? 'opacity-100 translate-y-0 scale-100 blur-0' : 'pointer-events-none opacity-0 translate-y-[10px] scale-[0.985] blur-[6px]',
                  )}
                >
                  <State active={i === active && inView} L={labels} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
