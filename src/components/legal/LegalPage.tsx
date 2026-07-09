'use client'

import { useEffect, useState } from 'react'
import { ArrowUp, ArrowRight, ArrowUpRight, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { LegalBlock, LegalDoc, LegalSlug, TocEntry } from '@/lib/legal'

export interface LegalCrossLink {
  slug: LegalSlug
  title: string
  href: string
}

export interface LegalLabels {
  eyebrow: string
  onThisPage: string
  lastUpdated: string
  backToTop: string
  more: string
  questions: string
  contactCta: string
}

interface Props {
  doc: LegalDoc
  toc: TocEntry[]
  formattedDate: string
  labels: LegalLabels
  crossLinks: LegalCrossLink[]
  contactHref: string
}

const two = (n: number) => String(n).padStart(2, '0')

// ─── Block renderer ───────────────────────────────────────────────────────────
function Block({ block }: { block: LegalBlock }) {
  switch (block.type) {
    case 'p':
      return (
        <p className="text-[15px] leading-[1.72] text-text-muted [&+p]:mt-4">
          {block.text}
        </p>
      )
    case 'h3':
      return (
        <h3 className="mt-8 mb-3 font-display text-[1.05rem] font-bold tracking-[-0.02em] text-text">
          {block.text}
        </h3>
      )
    case 'ul':
      return (
        <ul className="my-4 flex flex-col gap-2.5">
          {block.items.map((it, i) => (
            <li key={i} className="relative pl-5 text-[15px] leading-[1.62] text-text-muted">
              <span className="absolute left-0 top-[0.62em] size-[6px] -translate-y-1/2 rounded-full bg-purple" />
              {it}
            </li>
          ))}
        </ul>
      )
    case 'ol':
      return (
        <ol className="my-4 flex flex-col gap-2.5">
          {block.items.map((it, i) => (
            <li key={i} className="relative pl-8 text-[15px] leading-[1.62] text-text-muted">
              <span className="absolute left-0 top-0 flex size-[22px] items-center justify-center rounded-full bg-purple-light text-[11px] font-bold text-purple">
                {i + 1}
              </span>
              {it}
            </li>
          ))}
        </ol>
      )
    case 'table':
      return (
        <div className="my-5 overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[520px] border-collapse text-left text-[13.5px]">
            <thead>
              <tr className="bg-surface-2">
                {block.head.map((h, i) => (
                  <th
                    key={i}
                    className="whitespace-nowrap px-4 py-3 font-bold uppercase tracking-[0.04em] text-[11px] text-text-faint"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, ri) => (
                <tr
                  key={ri}
                  className="border-t border-divider [&:nth-child(even)]:bg-surface-2/40"
                >
                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      className={cn(
                        'px-4 py-3 align-top leading-[1.5] text-text-muted',
                        ci === 0 && 'font-semibold text-text',
                      )}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
  }
}

// ─── Sticky table of contents (scroll-spy) ────────────────────────────────────
function Toc({ toc, label }: { toc: TocEntry[]; label: string }) {
  const [active, setActive] = useState(toc[0]?.id ?? '')

  useEffect(() => {
    const els = toc
      .map((t) => document.getElementById(t.id))
      .filter((e): e is HTMLElement => !!e)
    if (!els.length) return
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-100px 0px -68% 0px', threshold: 0 },
    )
    els.forEach((e) => obs.observe(e))
    return () => obs.disconnect()
  }, [toc])

  return (
    <nav
      aria-label={label}
      className="sticky top-[calc(var(--navbar-height)+1.75rem)] hidden max-h-[calc(100svh-var(--navbar-height)-3rem)] overflow-y-auto lg:block"
    >
      <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.12em] text-text-faint">
        {label}
      </p>
      <ul className="flex flex-col border-l border-divider">
        {toc.map((t) => {
          const on = active === t.id
          return (
            <li key={t.id}>
              <a
                href={`#${t.id}`}
                className={cn(
                  '-ml-px flex gap-2 border-l-2 py-[7px] pl-4 pr-2 text-[12.5px] leading-[1.35] transition-colors duration-200',
                  on
                    ? 'border-purple font-semibold text-text'
                    : 'border-transparent text-text-muted hover:text-text',
                )}
              >
                <span
                  className={cn(
                    'shrink-0 tabular-nums',
                    on ? 'text-purple' : 'text-text-faint',
                  )}
                >
                  {two(t.n)}
                </span>
                <span>{t.text}</span>
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export function LegalPage({
  doc,
  toc,
  formattedDate,
  labels,
  crossLinks,
  contactHref,
}: Props) {
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 700)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <main className="relative">
      {/* Soft brand glow behind the hero */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] [background:radial-gradient(ellipse_58%_100%_at_50%_0%,rgba(138,50,224,0.08)_0%,transparent_70%)]"
      />

      <div className="relative mx-auto w-full max-w-[1120px] px-[clamp(1rem,4vw,2.5rem)]">
        {/* ── Hero ─────────────────────────────────────────────── */}
        <header className="pt-[calc(var(--navbar-height)+clamp(2.5rem,6vw,4.5rem))] pb-[clamp(2rem,4vw,3rem)]">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-purple/50" />
            <span className="eyebrow text-purple">{labels.eyebrow}</span>
          </div>
          <h1 className="mt-4 font-display text-[clamp(2.4rem,5.5vw,3.75rem)] font-extrabold leading-[1.03] tracking-[-0.035em] text-text">
            {doc.title}
          </h1>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-1.5 shadow-[var(--shadow-xs)]">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-purple/60" />
              <span className="relative inline-flex size-1.5 rounded-full bg-purple" />
            </span>
            <span className="text-[12.5px] font-medium text-text-muted">
              {labels.lastUpdated} · {formattedDate}
            </span>
          </div>
        </header>

        {/* ── Body: article + sticky TOC ───────────────────────── */}
        <div className="grid grid-cols-1 gap-x-14 gap-y-10 pb-[clamp(3rem,6vw,5rem)] lg:grid-cols-[minmax(0,1fr)_240px]">
          <article className="min-w-0 max-w-[70ch]">
            {doc.sections.map((section, i) => (
              <section
                key={section.id}
                id={section.id}
                className={cn(
                  'scroll-mt-[calc(var(--navbar-height)+2rem)]',
                  i > 0 && 'mt-12 border-t border-divider pt-11',
                )}
              >
                <div className="mb-4 flex items-baseline gap-3">
                  <span className="font-display text-[13px] font-extrabold tabular-nums text-purple/70">
                    {two(section.n)}
                  </span>
                  <h2 className="font-display text-[clamp(1.35rem,2.4vw,1.7rem)] font-extrabold leading-[1.15] tracking-[-0.03em] text-text">
                    {section.heading}
                  </h2>
                </div>
                <div>
                  {section.blocks.map((b, bi) => (
                    <Block key={bi} block={b} />
                  ))}
                </div>
              </section>
            ))}

            {/* Questions / contact strip */}
            <div className="mt-14 flex flex-col items-start gap-3 rounded-2xl border border-purple-border bg-purple-light/60 p-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-display text-[1.05rem] font-bold tracking-[-0.02em] text-text">
                {labels.questions}
              </p>
              <a
                href={contactHref}
                className="inline-flex items-center gap-2 rounded-full bg-purple px-5 py-2.5 text-sm font-semibold text-white transition-[background,box-shadow] duration-200 hover:bg-purple-hover hover:shadow-[var(--glow-purple)]"
              >
                <Mail className="size-4" strokeWidth={1.75} />
                {labels.contactCta}
              </a>
            </div>

            {/* Cross-links to the other policies */}
            {crossLinks.length > 0 && (
              <div className="mt-12">
                <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.12em] text-text-faint">
                  {labels.more}
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {crossLinks.map((c) => (
                    <a
                      key={c.slug}
                      href={c.href}
                      className={cn(
                        'group flex items-center justify-between gap-3 rounded-xl border border-border bg-surface px-5 py-4',
                        'transition-[border-color,box-shadow,transform] duration-200',
                        'hover:-translate-y-0.5 hover:border-purple-border hover:shadow-[0_10px_28px_-14px_rgba(138,50,224,0.4)]',
                      )}
                    >
                      <span className="font-display text-[15px] font-bold tracking-[-0.02em] text-text">
                        {c.title}
                      </span>
                      <ArrowUpRight
                        className="size-[18px] shrink-0 text-text-faint transition-[color,transform] duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-purple"
                        strokeWidth={1.75}
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </article>

          <aside>
            <Toc toc={toc} label={labels.onThisPage} />
          </aside>
        </div>
      </div>

      {/* ── Back to top ──────────────────────────────────────── */}
      <button
        type="button"
        aria-label={labels.backToTop}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={cn(
          'fixed bottom-6 right-6 z-40 flex size-11 items-center justify-center rounded-full',
          'border border-border bg-surface text-text-muted shadow-[var(--shadow-md)]',
          'transition-[opacity,transform,background,color] duration-300',
          'hover:bg-purple hover:text-white hover:border-transparent',
          showTop ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0',
        )}
      >
        <ArrowUp className="size-[18px]" strokeWidth={2} />
      </button>
    </main>
  )
}
