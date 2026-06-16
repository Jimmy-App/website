'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import type { TocItem } from '@/lib/guides'

type Props = {
  items: TocItem[]
  onThisPage: string
  readingLabel: string
}

export function GuideToc({ items, onThisPage, readingLabel }: Props) {
  const [active, setActive] = useState(items[0]?.id ?? '')
  const [pct, setPct] = useState(0)
  const barRef = useRef<HTMLDivElement>(null)

  // Scroll-spy with IntersectionObserver
  useEffect(() => {
    const els = items
      .map((i) => document.getElementById(i.id))
      .filter((e): e is HTMLElement => !!e)
    if (!els.length) return
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-96px 0px -65% 0px', threshold: 0 },
    )
    els.forEach((e) => obs.observe(e))
    return () => obs.disconnect()
  }, [items])

  // Reading progress (tied to #guide-article)
  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const el = document.getElementById('guide-article')
      if (!el) return
      const top = el.offsetTop
      const h = el.offsetHeight
      const scrolled = window.scrollY + window.innerHeight - top
      const p = Math.max(0, Math.min(1, scrolled / h))
      setPct(Math.round(p * 100))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <nav
      aria-label={onThisPage}
      className="sticky top-[calc(var(--navbar-height)+1.5rem)] hidden lg:block"
    >
      <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.1em] text-text-faint">
        {onThisPage}
      </p>
      <ul className="flex flex-col gap-px border-l border-divider">
        {items.map((it) => {
          const on = active === it.id
          return (
            <li key={it.id}>
              <a
                href={`#${it.id}`}
                className={cn(
                  '-ml-px block border-l-2 py-1.5 text-[12.5px] leading-[1.4] transition-colors duration-200',
                  it.sub ? 'pl-6' : 'pl-3.5',
                  on
                    ? 'border-purple font-semibold text-text'
                    : 'border-transparent text-text-muted hover:text-text',
                )}
              >
                {it.text}
              </a>
            </li>
          )
        })}
      </ul>

      {/* Reading progress widget */}
      <div className="mt-5 rounded-xl border border-border bg-surface-2 p-3.5">
        <div className="mb-2 flex items-center justify-between text-[11px] text-text-muted">
          <span>{readingLabel}</span>
          <span className="font-semibold text-text">{pct}%</span>
        </div>
        <div className="h-[5px] overflow-hidden rounded-full bg-surface-offset">
          <div
            ref={barRef}
            className="h-full rounded-full bg-purple transition-[width] duration-200"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </nav>
  )
}
