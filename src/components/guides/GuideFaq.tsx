'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { FaqItem } from '@/lib/guides'
import { renderInline } from '@/components/guides/GuideBody'

type Props = {
  items: FaqItem[]
}

export function GuideFaq({ items }: Props) {
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  function toggle(i: number) {
    setOpenIdx((prev) => (prev === i ? null : i))
  }

  return (
    <div className="mt-4 divide-y divide-divider rounded-xl border border-border">
      {items.map((item, i) => {
        const isOpen = openIdx === i
        return (
          <div key={i}>
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={`faq-${i}`}
              id={`faq-btn-${i}`}
              onClick={() => toggle(i)}
              className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left text-[14.5px] font-semibold text-text transition-colors hover:text-purple"
            >
              <span>{item.q}</span>
              <ChevronDown
                className={cn(
                  'mt-0.5 size-4 shrink-0 text-text-faint transition-transform duration-[280ms] [transition-timing-function:var(--ease-out)]',
                  isOpen && 'rotate-180 text-purple',
                )}
              />
            </button>

            {/* grid trick for smooth open/close */}
            <div
              id={`faq-${i}`}
              role="region"
              aria-labelledby={`faq-btn-${i}`}
              className="grid transition-[grid-template-rows] duration-[300ms] [transition-timing-function:var(--ease-out)]"
              style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
            >
              <div className="overflow-hidden">
                <div className="px-5 pb-5 pt-0 text-[14px] leading-[1.7] text-text-muted">
                  {renderInline(item.a)}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
