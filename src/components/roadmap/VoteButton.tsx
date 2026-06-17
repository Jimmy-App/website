'use client'

/**
 * VoteButton — per-card upvote. Persists to localStorage (demo, no backend),
 * shows base + the visitor's own +1. Arrow lifts on hover, presses with a
 * subtle scale, fills when voted (emil-style micro-interaction).
 */

import { useEffect, useState } from 'react'
import { Triangle } from 'lucide-react'
import { cn } from '@/lib/utils'

const KEY = 'jimmy_roadmap_votes'

function readVotes(): Record<string, boolean> {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '{}') as Record<string, boolean>
  } catch {
    return {}
  }
}

function fmt(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k` : String(n)
}

export function VoteButton({
  id,
  base,
  label,
  ariaLabel,
}: {
  id: string
  base: number
  label: string
  ariaLabel: string
}) {
  const [mounted, setMounted] = useState(false)
  const [voted, setVoted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setVoted(Boolean(readVotes()[id]))
  }, [id])

  const on = mounted && voted
  const count = base + (on ? 1 : 0)

  const toggle = () => {
    const next = !voted
    setVoted(next)
    try {
      const all = readVotes()
      all[id] = next
      localStorage.setItem(KEY, JSON.stringify(all))
    } catch {
      /* ignore */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      aria-label={ariaLabel}
      className={cn(
        'group/vote flex h-full min-w-[58px] flex-col items-center justify-center gap-1 rounded-xl border px-2.5 py-3 transition-[background,border-color,color,transform] duration-[var(--dur-fast)] active:scale-[0.94]',
        on
          ? 'border-purple-border bg-purple-light text-purple'
          : 'border-border bg-surface text-text-muted hover:border-purple-border hover:bg-purple-light hover:text-purple',
      )}
    >
      <Triangle
        size={15}
        strokeWidth={2.4}
        className={cn(
          'transition-transform duration-[var(--dur-fast)] ease-out group-hover/vote:-translate-y-0.5',
          on && 'fill-current',
        )}
      />
      <span className="text-[14px] font-extrabold tabular-nums leading-none [letter-spacing:-0.01em]">
        {fmt(count)}
      </span>
      <span
        className={cn(
          'text-[8.5px] font-bold uppercase tracking-[0.08em]',
          on ? 'text-purple' : 'text-text-faint',
        )}
      >
        {label}
      </span>
    </button>
  )
}
