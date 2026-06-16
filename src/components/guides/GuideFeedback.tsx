'use client'

import { useState } from 'react'
import { ThumbsUp, ThumbsDown } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
  wasHelpful: string
  yes: string
  no: string
  thanks: string
}

export function GuideFeedback({ wasHelpful, yes, no, thanks }: Props) {
  const [choice, setChoice] = useState<'yes' | 'no' | null>(null)

  if (choice !== null) {
    return (
      <div className="flex items-center gap-2 py-1">
        <span
          className={cn(
            'flex size-7 items-center justify-center rounded-full',
            choice === 'yes'
              ? 'bg-[rgba(16,185,129,0.1)] text-[#059669]'
              : 'bg-surface-2 text-text-muted',
          )}
        >
          {choice === 'yes' ? (
            <ThumbsUp className="size-3.5" strokeWidth={2} />
          ) : (
            <ThumbsDown className="size-3.5" strokeWidth={2} />
          )}
        </span>
        <span className="text-[13.5px] font-medium text-text">{thanks}</span>
      </div>
    )
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-[13.5px] font-medium text-text-muted">{wasHelpful}</span>
      <button
        type="button"
        onClick={() => setChoice('yes')}
        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3.5 py-1.5 text-[13px] font-medium text-text transition-[background,border-color,transform] duration-150 hover:border-purple-border hover:bg-purple-light hover:text-purple active:scale-[0.95]"
      >
        <ThumbsUp className="size-3.5" strokeWidth={1.9} />
        {yes}
      </button>
      <button
        type="button"
        onClick={() => setChoice('no')}
        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3.5 py-1.5 text-[13px] font-medium text-text transition-[background,border-color,transform] duration-150 hover:border-border hover:bg-surface-2 active:scale-[0.95]"
      >
        <ThumbsDown className="size-3.5" strokeWidth={1.9} />
        {no}
      </button>
    </div>
  )
}
