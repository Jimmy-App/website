import { Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Non-interactive placeholder for a CTA whose feature isn't live yet.
 * Reads as visibly disabled (muted grey, not-allowed cursor) and says "Soon".
 * Mirrors <Button> sizing so it can drop in where a Button was.
 */
const sizes = {
  sm: 'text-sm px-[18px] py-[9px]',
  md: 'text-sm px-[22px] py-3',
  lg: 'text-[15px] px-7 py-[14px]',
} as const

export function SoonButton({
  size = 'lg',
  full = false,
  label = 'Soon',
  className,
}: {
  size?: keyof typeof sizes
  full?: boolean
  label?: string
  className?: string
}) {
  return (
    <span
      role="button"
      aria-disabled="true"
      className={cn(
        'inline-flex cursor-not-allowed select-none items-center justify-center gap-[7px]',
        'rounded-full border border-border bg-surface-offset font-semibold leading-none tracking-[-0.01em] text-text-faint',
        sizes[size],
        full && 'w-full',
        className,
      )}
    >
      <Clock className="size-[15px]" strokeWidth={1.9} />
      {label}
    </span>
  )
}
