'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { LineChart, Clock, LayoutGrid, CreditCard, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AffiliateWhoData, AffiliateWhyData } from '@/lib/content'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]
const WHY_ICONS = [LineChart, Clock, LayoutGrid, CreditCard]

export function AffiliateWhyWho({ why, who }: { why: AffiliateWhyData; who: AffiliateWhoData }) {
  const reduce = useReducedMotion()
  const reveal = (d: number) => ({
    initial: reduce ? undefined : { opacity: 0, y: 18 },
    whileInView: reduce ? undefined : { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: 0.56, ease: EASE, delay: d },
  })

  const whyCards = why.cards ?? []
  const whoItems = who.items ?? []

  return (
    <>
      {/* ── Why partner ── */}
      <section className="px-[clamp(20px,5vw,40px)] pb-[clamp(56px,8vw,96px)] pt-[clamp(56px,8vw,96px)]">
        <div className="mx-auto max-w-[1120px]">
          <div className="mx-auto mb-[clamp(2.25rem,4vw,3.25rem)] max-w-[640px] text-center">
            <span className="mb-4 inline-flex items-center gap-[6px] text-[11px] font-bold uppercase tracking-[0.18em] text-purple before:size-[5px] before:rounded-full before:bg-purple before:content-['']">
              {why.eyebrow}
            </span>
            <h2 className="font-display text-[clamp(2rem,4vw,3.25rem)] font-extrabold leading-[1.08] tracking-[var(--tracking-tight)]">{why.title}</h2>
          </div>
          <div className="grid grid-cols-2 gap-[18px] max-[720px]:grid-cols-1">
            {whyCards.map((w, i) => {
              const Icon = WHY_ICONS[i] ?? LineChart
              return (
                <motion.div
                  key={i}
                  {...reveal(i * 0.08)}
                  className="flex items-start gap-[18px] rounded-2xl border border-border bg-surface p-[clamp(22px,2.6vw,30px)] shadow-[var(--shadow-md)] transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-purple-border hover:shadow-[0_18px_50px_-30px_rgba(138,50,224,0.4)]"
                >
                  <div className="grid size-[46px] flex-none place-items-center rounded-xl bg-purple-light text-purple">
                    <Icon className="size-[22px]" strokeWidth={1.8} />
                  </div>
                  <div>
                    <h3 className="mb-[7px] mt-0.5 font-display text-[18px] font-bold tracking-[-0.01em]">{w.title}</h3>
                    <p className="text-[14px] leading-[1.6] text-text-muted">{w.body}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Who it's for ── */}
      <section className="px-[clamp(20px,5vw,40px)] pb-[clamp(56px,8vw,96px)]">
        <div className="mx-auto max-w-[1120px]">
          <motion.div {...reveal(0)} className="rounded-2xl border border-border bg-surface p-[clamp(28px,4vw,48px)] shadow-[var(--shadow-md)]">
            <div className="mb-7 flex flex-wrap items-end justify-between gap-5">
              <h2 className="max-w-[16ch] font-display text-[clamp(1.7rem,3vw,2.4rem)] font-extrabold leading-[1.1] tracking-[var(--tracking-tight)]">{who.title}</h2>
              <p className="max-w-[34ch] text-[14.5px] leading-[1.6] text-text-muted">{who.subtitle}</p>
            </div>
            <div className="grid grid-cols-2 gap-x-7 gap-y-3 max-[640px]:grid-cols-1">
              {whoItems.map((item, i) => (
                <div key={i} className={cn('flex items-start gap-3 border-t border-divider py-3.5 text-[15px] leading-[1.45] text-text')}>
                  <span className="mt-px grid size-[22px] flex-none place-items-center rounded-full bg-purple-light text-purple">
                    <Check className="size-[13px]" strokeWidth={2.2} />
                  </span>
                  <div>
                    <b className="font-[650]">{item.title}</b>
                    <span className="mt-0.5 block text-[13px] text-text-muted">{item.sub}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
