'use client'

import { useState } from 'react'
import { ArrowRight, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * One form, every waitlist. `source` is what tells them apart server-side —
 * JIM-144's White Glove form reuses this with its own source and copy.
 * All labels are passed in so the copy can live in Sanity.
 */

export type WaitlistLabels = {
  placeholder: string
  cta: string
  ctaLoading: string
  ctaDone: string
  hintIdle: string
  hintDone: string
  hintError: string
}

type Status = 'idle' | 'loading' | 'done' | 'error'

export function WaitlistForm({
  source,
  labels,
  className,
}: {
  source: string
  labels: WaitlistLabels
  className?: string
}) {
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('') // honeypot
  const [status, setStatus] = useState<Status>('idle')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (status === 'loading') return
    setStatus('loading')
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, company, source }),
      })
      setStatus(res.ok ? 'done' : 'error')
    } catch {
      setStatus('error')
    }
  }

  // Success replaces the form instead of relabelling the button. The visitor
  // did the one thing we asked; leaving a dead input and a changed label makes
  // it ambiguous whether it worked.
  if (status === 'done') {
    return (
      <div
        role="status"
        className={cn(
          'flex w-full max-w-[440px] items-center gap-[12px] rounded-[16px]',
          'border border-purple-border bg-purple-light px-[18px] py-[16px]',
          className,
        )}
      >
        <span className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-purple text-white">
          <Check size={16} strokeWidth={2.8} aria-hidden="true" />
        </span>
        <span className="min-w-0">
          <span className="block text-[14.5px] font-semibold text-text">{labels.ctaDone}</span>
          <span className="block text-[13px] leading-[1.45] text-text-muted">{labels.hintDone}</span>
        </span>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className={cn('w-full max-w-[440px]', className)}>
      {/* Honeypot: off-screen rather than display:none, which some bots skip. */}
      <label className="sr-only" aria-hidden="true">
        Company
        <input
          tabIndex={-1}
          autoComplete="off"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </label>

      <div className="flex flex-col gap-[10px] sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={labels.placeholder}
          aria-label={labels.placeholder}
          className={cn(
            // 16px: anything smaller makes iOS zoom the page on focus.
            // `sm:flex-1`, not `flex-1`: below sm the wrapper is flex-col, where
            // flex-1 sets the basis on the VERTICAL axis and collapses the height.
            // appearance-none: iOS Safari otherwise keeps its native chrome and
            // overrides the radius and border.
            'h-[52px] w-full appearance-none rounded-[14px] border border-border bg-surface px-4 sm:flex-1',
            'text-[16px] text-text placeholder:text-text-faint',
            'outline-none transition-[border-color,box-shadow] duration-150 [transition-timing-function:var(--ease-out)]',
            'focus-visible:border-purple-border focus-visible:shadow-[0_0_0_3px_var(--color-purple-light)]',
            'disabled:opacity-60',
          )}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className={cn(
            'group/cta inline-flex h-[52px] items-center justify-center gap-[8px] rounded-[14px] px-[22px]',
            'whitespace-nowrap text-[15px] font-semibold text-white',
            // Flat purple with the shared tokens — the design system has no
            // gradients. Hover/active states come from Button.tsx, not invented.
            'bg-purple hover:bg-purple-hover hover:shadow-[var(--glow-purple)] active:bg-purple-active',
            'transition-[background,box-shadow,transform] duration-150 [transition-timing-function:var(--ease-out)]',
            'active:scale-[0.97] disabled:opacity-70 disabled:active:scale-100',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple/50 focus-visible:ring-offset-2',
          )}
        >
          {status === 'loading' ? labels.ctaLoading : labels.cta}
          {status !== 'loading' && (
            <ArrowRight
              size={15}
              strokeWidth={2.4}
              className="transition-transform duration-150 [transition-timing-function:var(--ease-out)] group-hover/cta:translate-x-[2px]"
            />
          )}
        </button>
      </div>

      {/* Space is reserved so the layout never jumps when the message changes. */}
      <p
        aria-live="polite"
        className={cn(
          'mt-[10px] min-h-[18px] text-[13px] leading-[1.4]',
          status === 'error' ? 'text-[var(--color-price-was)]' : 'text-text-faint',
        )}
      >
        {status === 'error' ? labels.hintError : labels.hintIdle}
      </p>
    </form>
  )
}
