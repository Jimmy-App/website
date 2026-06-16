'use client'

import { useEffect, useRef, useState } from 'react'
import { Link2, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

/** Top reading-progress bar tied to the article body (#article-prose). */
export function ReadingBar() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = document.getElementById('article-prose')
    const bar = ref.current
    if (!el || !bar) return
    let raf = 0
    const update = () => {
      raf = 0
      const top = el.offsetTop
      const h = el.offsetHeight
      const scrolled = window.scrollY + window.innerHeight - top
      const pct = Math.max(0, Math.min(1, scrolled / h))
      bar.style.transform = `scaleX(${pct})`
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
    // Mobile only: on desktop the sticky TOC already conveys reading progress.
    // Sits above the navbar (z > 100) so it stays visible as the bar that the
    // navbar background would otherwise cover on scroll.
    <div className="fixed inset-x-0 top-0 z-[120] h-[3px] bg-transparent lg:hidden">
      <div ref={ref} className="h-full origin-left bg-purple" style={{ transform: 'scaleX(0)' }} />
    </div>
  )
}

/** Sticky "On this page" table of contents with scroll-spy. */
export function ArticleToc({
  items,
  label,
}: {
  items: { id: string; text: string }[]
  label: string
}) {
  const [active, setActive] = useState(items[0]?.id ?? '')
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
      { rootMargin: '-96px 0px -68% 0px', threshold: 0 },
    )
    els.forEach((e) => obs.observe(e))
    return () => obs.disconnect()
  }, [items])

  return (
    <nav aria-label={label} className="sticky top-[6rem] hidden lg:block">
      <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.1em] text-text-faint">{label}</div>
      <ul className="flex flex-col gap-0.5 border-l border-divider">
        {items.map((it) => {
          const on = active === it.id
          return (
            <li key={it.id}>
              <a
                href={`#${it.id}`}
                className={cn(
                  '-ml-px block border-l-2 py-1.5 pl-4 text-[13px] leading-[1.4] transition-colors duration-200',
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
    </nav>
  )
}

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="size-[15px]">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)
const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="size-[16px]">
    <path d="M4.98 3.5C4.98 4.88 3.87 6 2.49 6S0 4.88 0 3.5 1.11 1 2.49 1s2.49 1.12 2.49 2.5zM.24 8h4.5v14H.24V8zm7.5 0h4.31v1.92h.06c.6-1.14 2.07-2.34 4.26-2.34 4.56 0 5.4 3 5.4 6.9V22h-4.5v-6.62c0-1.58-.03-3.62-2.2-3.62-2.2 0-2.54 1.72-2.54 3.5V22h-4.5V8z" />
  </svg>
)
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="size-[16px]">
    <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07c0 6.03 4.39 11.03 10.13 11.93v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07Z" />
  </svg>
)
const ThreadsIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="size-[16px]">
    <path d="M16.27 11.13c-.1-.05-.2-.09-.3-.13-.18-3.26-1.96-5.13-4.95-5.15h-.04c-1.79 0-3.28.76-4.19 2.16l1.65 1.13c.68-1.03 1.75-1.25 2.54-1.25h.03c.98 0 1.72.29 2.2.85.35.41.58.97.7 1.68-.86-.15-1.79-.19-2.79-.13-2.8.16-4.6 1.79-4.48 4.06.06 1.15.64 2.14 1.61 2.79.83.55 1.89.81 3 .75 1.46-.08 2.6-.64 3.41-1.66.61-.78.99-1.78 1.16-3.04.69.42 1.2.97 1.49 1.63.49 1.12.52 2.97-.99 4.48-1.32 1.32-2.91 1.89-5.31 1.91-2.66-.02-4.67-.87-5.98-2.53-1.22-1.55-1.85-3.79-1.88-6.65.02-2.86.66-5.1 1.88-6.65 1.31-1.66 3.32-2.51 5.98-2.53 2.68.02 4.73.88 6.08 2.55.66.82 1.16 1.85 1.49 3.05l1.93-.51c-.4-1.48-1.03-2.76-1.88-3.82C17.6 1.41 15.04.29 11.72.27h-.01C8.4.29 5.87 1.42 4.2 3.63 2.71 5.59 1.95 8.32 1.92 11.74v.02c.03 3.42.79 6.15 2.28 8.11 1.67 2.21 4.2 3.34 7.51 3.36h.01c2.94-.02 5.01-.79 6.72-2.5 2.24-2.23 2.17-5.03 1.43-6.74-.53-1.23-1.54-2.23-2.93-2.86Zm-4.55 5.4c-1.23.07-2.51-.48-2.57-1.66-.05-.87.62-1.85 2.64-1.97.23-.01.46-.02.68-.02.73 0 1.42.07 2.04.21-.23 2.88-1.58 3.37-2.79 3.44Z" />
  </svg>
)

/** Share row: X, LinkedIn, copy-link with a toast. */
export function ArticleShare({ label, copiedLabel }: { label: string; copiedLabel: string }) {
  const [copied, setCopied] = useState(false)
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  // Resolve the share target after mount so SSR and the first client render
  // agree (both empty) — avoids a hydration mismatch on the href attributes.
  useEffect(() => {
    setUrl(window.location.href)
    setTitle(document.title)
  }, [])
  const btn =
    'grid size-9 place-items-center rounded-full border border-border bg-surface text-text-muted transition-[color,border-color,transform] duration-200 hover:border-purple-border hover:text-purple active:scale-[0.94]'

  const copy = async () => {
    try {
      await navigator.clipboard?.writeText(url)
    } catch {
      /* clipboard unavailable — still confirm visually */
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }

  return (
    <div className="flex items-center gap-2">
      <span className="mr-1 text-[12px] font-semibold text-text-faint">{label}</span>
      <a
        className={btn}
        aria-label="Share on X"
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <XIcon />
      </a>
      <a
        className={btn}
        aria-label="Share on Threads"
        href={`https://www.threads.net/intent/post?text=${encodeURIComponent(`${title} ${url}`)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <ThreadsIcon />
      </a>
      <a
        className={btn}
        aria-label="Share on Facebook"
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <FacebookIcon />
      </a>
      <a
        className={btn}
        aria-label="Share on LinkedIn"
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <LinkedInIcon />
      </a>
      <button type="button" className={btn} aria-label="Copy link" onClick={copy}>
        {copied ? <Check className="size-[15px] text-[#16a34a]" strokeWidth={2.4} /> : <Link2 className="size-[15px]" strokeWidth={1.9} />}
      </button>
      <span
        role="status"
        aria-live="polite"
        className={cn(
          'pointer-events-none ml-1 text-[12px] font-medium text-[#16a34a] transition-opacity duration-200',
          copied ? 'opacity-100' : 'opacity-0',
        )}
      >
        {copiedLabel}
      </span>
    </div>
  )
}
