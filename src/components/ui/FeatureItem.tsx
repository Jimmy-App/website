import Link from 'next/link'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Mega-menu / list row: square icon tile + title + one-line subtitle.
 * Hovering tints the icon tile purple (pure CSS via `group`).
 * The subtitle never wraps — keep it to ~5 words.
 */
export function FeatureItem({
  icon = null,
  title,
  subtitle,
  href = '#',
  className,
}: {
  icon?: ReactNode
  title: ReactNode
  subtitle: ReactNode
  href?: string
  className?: string
}) {
  return (
    <Link
      href={href}
      className={cn(
        'group grid grid-cols-[34px_1fr] items-center gap-x-[11px] rounded-lg px-[10px] py-[9px] transition-[background-color,transform] duration-150 [transition-timing-function:var(--ease-out)] hover:bg-surface-2 active:scale-[0.985]',
        className,
      )}
    >
      <span className="row-span-2 flex size-[34px] items-center justify-center rounded-[9px] border border-border bg-surface-2 text-text-muted transition-colors duration-150 group-hover:border-purple-border group-hover:bg-purple-light group-hover:text-purple">
        {icon}
      </span>
      <span className="font-body text-[13.5px] font-semibold leading-snug tracking-[-0.01em] whitespace-nowrap text-text">
        {title}
      </span>
      <span className="mt-px font-body text-[11.5px] font-normal leading-[1.3] whitespace-nowrap text-text-faint">
        {subtitle}
      </span>
    </Link>
  )
}
